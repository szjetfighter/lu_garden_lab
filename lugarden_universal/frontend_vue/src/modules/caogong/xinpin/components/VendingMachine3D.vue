<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { Text } from 'troika-three-text'
import type { CaogongProduct } from '../types/xinpin'
import { products } from '../data/products'

// Cyberpunk字体
import cyberpunkFontUrl from '../assets/fonts/cyberpunk.ttf?url'
// 金属纹理
import metalDiffUrl from '../assets/texture/blue_metal_plate_diff_1k.jpg?url'
import ProductModal from './ProductModal.vue'

// 产品ID到GLB文件的映射
const productModelMap: Record<string, string> = {
  neiranji: 'Tomato.glb',
  paoche: 'shy fly.glb',
  zhanjian: 'Ship.glb',
  jiaoshoujia: 'Bread Roll.glb',
  daqiao: 'Sandwich.glb',
  chaiqianbi: 'bird.glb',
  bengji: 'Teeth.glb',
  cichangqi: 'Magnet.glb',
  zhongzhidan: 'Egg sunny side up.glb',
  daiyuntong: 'Glass Jar.glb',
  cibei: 'Cup Of Tea.glb',
  panyanti: 'Shoes.glb',
  wudijing: 'Mirror.glb',
  jixiebiao: 'Watch.glb'
}

// 响应式状态
const containerRef = ref<HTMLDivElement | null>(null)
const selectedProduct = ref<CaogongProduct | null>(null)
const isModalOpen = ref(false)
const isLoading = ref(true)
const loadingProgress = ref(0)

// Three.js对象
const scene = shallowRef<THREE.Scene | null>(null)
const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
const composer = shallowRef<EffectComposer | null>(null)
const controls = shallowRef<OrbitControls | null>(null)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// 产品模型和悬停效果
const productMeshes = new Map<THREE.Object3D, CaogongProduct>()
const productGroups: THREE.Group[] = []
let hoveredGroup: THREE.Group | null = null

// 动画
let animationId: number | null = null
let time = 0

// 电子屏滚动文字 - 用两个Text对象实现无缝循环
let screenText1: any = null
let screenText2: any = null
let textWidth = 0

// 脏玻璃材质
let grimeGlassMaterial: THREE.ShaderMaterial | null = null
// 脏污金属材质
let grimeMetalMaterial: THREE.ShaderMaterial | null = null
const scrollContent = '新品发布 ◆ 烂西红柿牌内燃机⑴  苍蝇跑车⑵  翻山战舰⑶  白面团脚手架⑷  跨海三明治大桥壹体成型机⑸  时间鸟拆迁臂⑹  牙线蹦极绳⑺  理念磁场器⑻  种植蛋壹号⑼  试管婴儿代孕桶⑽  治胆瓷杯⑾  攀岩蹄⑿  无底镜⒀  蛔虫机械表⒁ __◇ ◇ ◇ ◇__'

function handleProductClick(product: CaogongProduct) {
  selectedProduct.value = product
  isModalOpen.value = true
}

function handleClose() {
  isModalOpen.value = false
}

function onPointerMove(event: MouseEvent) {
  if (!containerRef.value || !camera.value || !scene.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera.value)
  const intersects = raycaster.intersectObjects(scene.value.children, true)
  
  // 重置之前悬停的组
  if (hoveredGroup) {
    hoveredGroup.scale.setScalar(1)
    hoveredGroup = null
  }
  
  for (const intersect of intersects) {
    let obj: THREE.Object3D | null = intersect.object
    while (obj) {
      if (obj instanceof THREE.Group && productGroups.includes(obj)) {
        hoveredGroup = obj
        obj.scale.setScalar(1.15)
        containerRef.value!.style.cursor = 'pointer'
        return
      }
      obj = obj.parent
    }
  }
  containerRef.value!.style.cursor = 'grab'
}

function onClick(event: MouseEvent) {
  if (!containerRef.value || !camera.value || !scene.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera.value)
  const intersects = raycaster.intersectObjects(scene.value.children, true)
  
  for (const intersect of intersects) {
    let obj: THREE.Object3D | null = intersect.object
    while (obj) {
      if (productMeshes.has(obj)) {
        handleProductClick(productMeshes.get(obj)!)
        return
      }
      obj = obj.parent
    }
  }
}

async function createVendingMachine(sceneRef: THREE.Scene) {
  const machineGroup = new THREE.Group()
  
  // 外框材质 - 外部锈蚀贴图，内部干净纯色
  const textureLoader = new THREE.TextureLoader()
  const rustyMetalTexture = await new Promise<THREE.Texture>((resolve) => {
    textureLoader.load(metalDiffUrl, (texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)
      resolve(texture)
    })
  })
  
  // 内部材质（干净纯色）
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.3,
    roughness: 0.8
  })
  
  // 创建按比例贴图的材质（根据面的宽高设置repeat）
  const scale = 0.5  // 每单位重复0.5次纹理
  function createOuterMat(width: number, height: number) {
    const tex = rustyMetalTexture.clone()
    tex.needsUpdate = true
    tex.repeat.set(width * scale, height * scale)
    return new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.7,
      roughness: 0.6
    })
  }
  
  // BoxGeometry面顺序: +X, -X, +Y, -Y, +Z, -Z
  // 左边框 0.3(x) x 7(y) x 2(z)
  // +X面(内): 2x7, -X面(外): 2x7, +Y面: 0.3x2, -Y面: 0.3x2, +Z面: 0.3x7, -Z面: 0.3x7
  const leftFrameMats = [
    innerMaterial,           // +X 内侧
    createOuterMat(2, 7),    // -X 外侧
    createOuterMat(0.3, 2),  // +Y
    createOuterMat(0.3, 2),  // -Y
    createOuterMat(0.3, 7),  // +Z 前
    createOuterMat(0.3, 7)   // -Z 后
  ]
  const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 2), leftFrameMats)
  leftFrame.position.set(-2.35, 0, 0)
  machineGroup.add(leftFrame)
  
  // 右边框 0.3(x) x 7(y) x 2(z)
  const rightFrameMats = [
    createOuterMat(2, 7),    // +X 外侧
    innerMaterial,           // -X 内侧
    createOuterMat(0.3, 2),  // +Y
    createOuterMat(0.3, 2),  // -Y
    createOuterMat(0.3, 7),  // +Z 前
    createOuterMat(0.3, 7)   // -Z 后
  ]
  const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 2), rightFrameMats)
  rightFrame.position.set(2.35, 0, 0)
  machineGroup.add(rightFrame)
  
  // 上边框 4.4(x) x 0.5(y) x 2(z)
  const topFrameMats = [
    createOuterMat(2, 0.5),   // +X
    createOuterMat(2, 0.5),   // -X
    createOuterMat(4.4, 2),   // +Y 外侧
    innerMaterial,            // -Y 内侧
    createOuterMat(4.4, 0.5), // +Z 前
    createOuterMat(4.4, 0.5)  // -Z 后
  ]
  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.5, 2), topFrameMats)
  topFrame.position.set(0, 3.25, 0)
  machineGroup.add(topFrame)
  
  // 下边框 4.4(x) x 1(y) x 2(z)
  const bottomFrameMats = [
    createOuterMat(2, 1),    // +X
    createOuterMat(2, 1),    // -X
    innerMaterial,           // +Y 内侧
    createOuterMat(4.4, 2),  // -Y 外侧
    createOuterMat(4.4, 1),  // +Z 前
    createOuterMat(4.4, 1)   // -Z 后
  ]
  const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1, 2), bottomFrameMats)
  bottomFrame.position.set(0, -3, 0)
  machineGroup.add(bottomFrame)
  
  // 背板 - 封住机身背面
  const backPanelGeometry = new THREE.PlaneGeometry(4.4, 5.5)
  const backPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,  // 深蓝黑，干净内部
    metalness: 0.3,
    roughness: 0.8,
    side: THREE.DoubleSide
  })
  const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial)
  backPanel.position.set(0, 0.25, -0.99)  // 放在机身背面
  machineGroup.add(backPanel)
  
  // 玻璃面板 - 脏玻璃效果（使用世界坐标实现全局连续纹理）
  const glassGeometry = new THREE.PlaneGeometry(4.5, 5.5)
  grimeGlassMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#aaddff') },
      uOpacity: { value: 0.2 },
      uGrimeScale: { value: 1.5 },  // 世界坐标下的缩放
      uRainSpeed: { value: 0.1 }
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uGrimeScale;
      uniform float uRainSpeed;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        // 使用世界坐标采样，实现跨组件连续纹理
        vec2 worldUv = vWorldPosition.xy * uGrimeScale;
        float grime = noise(worldUv * 3.0);
        vec2 rainUv = vec2(vWorldPosition.x * 8.0, vWorldPosition.y * 0.5 + uTime * uRainSpeed);
        float rain = noise(rainUv);
        rain = smoothstep(0.7, 0.85, rain);
        vec3 finalColor = uColor + vec3(0.05) * grime + vec3(0.25) * rain;
        float alpha = uOpacity + (grime * 0.05) + (rain * 0.15);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  })
  const glass = new THREE.Mesh(glassGeometry, grimeGlassMaterial)
  glass.position.set(0, 0.25, 1.1)
  machineGroup.add(glass)
  
  // === 电子屏（机器顶部嵌入位置 y=4）===
  // 电子屏背板
  const screenBackGeometry = new THREE.BoxGeometry(5.2, 1.2, 0.5)
  const screenBackMaterial = new THREE.MeshStandardMaterial({
    color: 0x53565A,  // 枪灰色
    metalness: 0.85,
    roughness: 0.35
  })
  const screenBack = new THREE.Mesh(screenBackGeometry, screenBackMaterial)
  screenBack.position.set(0, 4, 0.3)
  machineGroup.add(screenBack)
  
  // 电子屏发光面板 - LED点阵效果
  const screenGlowGeometry = new THREE.PlaneGeometry(4.8, 0.8)
  const ledShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xff6b9d) },
      uGridSize: { value: 80.0 },  // 网格密度
      uDotSize: { value: 0.6 }     // 点大小
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uGridSize;
      uniform float uDotSize;
      varying vec2 vUv;
      
      void main() {
        // 创建网格坐标
        vec2 grid = fract(vUv * vec2(uGridSize, uGridSize * 0.167));  // 宽高比约6:1
        
        // 计算到网格中心的距离
        vec2 center = grid - 0.5;
        float dist = length(center);
        
        // 圆形LED点
        float dot = smoothstep(uDotSize * 0.5, uDotSize * 0.3, dist);
        
        // 添加轻微发光
        float glow = exp(-dist * 4.0) * 0.3;
        
        float alpha = (dot + glow) * 0.5;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.FrontSide
  })
  const screenGlow = new THREE.Mesh(screenGlowGeometry, ledShaderMaterial)
  screenGlow.position.set(0, 4, 0.56)
  machineGroup.add(screenGlow)
  
  // 电子屏滚动文字 - 两个Text对象首尾相接
  const clipLeft = new THREE.Plane(new THREE.Vector3(1, 0, 0), 2.4)
  const clipRight = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 2.4)
  
  // 创建第一个文字
  screenText1 = new Text()
  screenText1.text = scrollContent
  screenText1.fontSize = 0.22
  screenText1.color = 0x00ffaa
  screenText1.anchorX = 'left'
  screenText1.anchorY = 'middle'
  screenText1.position.set(2.4, 4, 0.6)
  screenText1.material.clippingPlanes = [clipLeft, clipRight]
  screenText1.sync(() => {
    const bounds = screenText1.textRenderInfo?.blockBounds
    if (bounds) {
      textWidth = bounds[2] - bounds[0]
      // 第二个文字紧跟第一个后面
      screenText2.position.x = 2.4 + textWidth
    }
  })
  sceneRef.add(screenText1)
  
  // 创建第二个文字
  screenText2 = new Text()
  screenText2.text = scrollContent
  screenText2.fontSize = 0.22
  screenText2.color = 0x00ffaa
  screenText2.anchorX = 'left'
  screenText2.anchorY = 'middle'
  screenText2.position.set(2.4 + 30, 4, 0.6)  // 临时位置，sync后更新
  screenText2.material.clippingPlanes = [clipLeft, clipRight]
  screenText2.sync()
  sceneRef.add(screenText2)
  
  // === 霓虹灯招牌（机器上方悬空）===
  const neonTextGroup = new THREE.Group()
  neonTextGroup.position.set(0, 5, 0.25)  // z与电子屏对齐
  
  // 底层：白色描边/光晕（稍大）
  const glowText = new Text()
  glowText.text = 'NEW ARRIVAL'
  glowText.font = cyberpunkFontUrl
  glowText.fontSize = 0.4
  glowText.color = 0xffffff
  glowText.anchorX = 'center'
  glowText.anchorY = 'middle'
  glowText.outlineWidth = 0.025
  glowText.outlineColor = 0xffffff
  glowText.outlineOpacity = 0.6
  glowText.position.z = -0.01  // 稍微靠后
  glowText.sync()
  neonTextGroup.add(glowText)
  
  // 顶层：粉色主体
  const mainText = new Text()
  mainText.text = 'NEW ARRIVAL'
  mainText.font = cyberpunkFontUrl
  mainText.fontSize = 0.4
  mainText.color = 0xff6b9d
  mainText.anchorX = 'center'
  mainText.anchorY = 'middle'
  mainText.outlineWidth = 0.012
  mainText.outlineColor = 0xffb6c1
  mainText.sync()
  neonTextGroup.add(mainText)
  
  sceneRef.add(neonTextGroup)
  
  // 霓虹边框 - 更粗更亮
  const neonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff })
  const neonThickness = 0.08
  
  // 展示区边框
  const framePositions = [
    { geo: [4.6, neonThickness, neonThickness], pos: [0, 3, 1.15] },  // 顶，保持不变
    { geo: [4.6, neonThickness, neonThickness], pos: [0, -2.5, 1.15] }, // 底，对齐下边框顶部
    { geo: [neonThickness, 5.5, neonThickness], pos: [-2.25, 0.25, 1.15] }, // 左，高度增加
    { geo: [neonThickness, 5.5, neonThickness], pos: [2.25, 0.25, 1.15] }  // 右
  ]
  
  framePositions.forEach(({ geo, pos }) => {
    const neon = new THREE.Mesh(
      new THREE.BoxGeometry(geo[0], geo[1], geo[2]),
      neonMaterial
    )
    neon.position.set(pos[0], pos[1], pos[2])
    machineGroup.add(neon)
  })
  
  // 出货口
  const dispenserGeometry = new THREE.BoxGeometry(4, 0.8, 0.6)
  const dispenserMaterial = new THREE.MeshStandardMaterial({
    color: 0x050505,
    metalness: 0.95,
    roughness: 0.1
  })
  const dispenser = new THREE.Mesh(dispenserGeometry, dispenserMaterial)
  dispenser.position.set(0, -3, 0.8)
  machineGroup.add(dispenser)
  
  // 出货口内部发光
  const dispenserGlowGeometry = new THREE.BoxGeometry(3.8, 0.6, 0.1)
  const dispenserGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3
  })
  const dispenserGlow = new THREE.Mesh(dispenserGlowGeometry, dispenserGlowMaterial)
  dispenserGlow.position.set(0, -3, 1.1)
  machineGroup.add(dispenserGlow)
  
  // 装饰铆钉
  const rivetGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const rivetMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 1,
    roughness: 0.2
  })
  const rivetPositions = [
    [-2.3, 3.3, 1], [2.3, 3.3, 1],
    [-2.3, -2.8, 1], [2.3, -2.8, 1],
    [-2.3, 0, 1], [2.3, 0, 1]
  ]
  rivetPositions.forEach(pos => {
    const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial)
    rivet.position.set(pos[0], pos[1], pos[2])
    machineGroup.add(rivet)
  })
  
  sceneRef.add(machineGroup)
  
  // 霓虹灯光源（内部照明）
  const lights = [
    { color: 0x00ffff, intensity: 3, pos: [0, 2, 0.5] },
    { color: 0xff6b9d, intensity: 2, pos: [0, 3.5, 0.5] },
    { color: 0x00ffff, intensity: 1.5, pos: [-1.5, 0, 0.5] },
    { color: 0x00ffff, intensity: 1.5, pos: [1.5, 0, 0.5] },
    { color: 0x00ffff, intensity: 2, pos: [0, -2, 0.5] }
  ]
  
  lights.forEach(({ color, intensity, pos }) => {
    const light = new THREE.PointLight(color, intensity, 8)
    light.position.set(pos[0], pos[1], pos[2])
    sceneRef.add(light)
  })
}

async function loadProductModels(sceneRef: THREE.Scene) {
  const loader = new GLTFLoader()
  const gridCols = 4
  const cellWidth = 1.05
  const cellHeight = 1.35  // 增加行间距，充分利用空间
  const startX = -1.6
  const startY = 2.3  // 调整起始位置，让产品垂直居中
  
  let loadedCount = 0
  const totalProducts = products.length
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const modelFile = productModelMap[product.id]
    
    if (!modelFile) continue
    
    const col = i % gridCols
    const row = Math.floor(i / gridCols)
    const x = startX + col * cellWidth
    const y = startY - row * cellHeight
    const z = 0.5
    
    // 创建产品组（用于整体缩放效果）
    const productGroup = new THREE.Group()
    productGroup.position.set(x, y, z)
    productGroups.push(productGroup)
    
    // 产品展示台
    const platformGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.08, 32)
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.8,
      roughness: 0.3
    })
    const platform = new THREE.Mesh(platformGeometry, platformMaterial)
    platform.position.set(0, -0.4, 0)
    platform.rotation.x = 0
    productGroup.add(platform)
    
    // 展示台边缘发光环
    const ringGeometry = new THREE.TorusGeometry(0.38, 0.02, 8, 32)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.7
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.set(0, -0.36, 0)
    ring.rotation.x = Math.PI / 2
    productGroup.add(ring)
    
    try {
      // 加载GLB模型
      const modelPath = new URL(`../assets/GLB/${modelFile}`, import.meta.url).href
      console.log(`Loading: ${product.id} -> ${modelFile}`)
      const gltf = await loader.loadAsync(modelPath)
      const model = gltf.scene
      console.log(`Loaded: ${product.id}`, model)
      
      // 修复模型材质：设置双面渲染 + 修复透明材质
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const fixMaterial = (mat: THREE.Material) => {
            mat.side = THREE.DoubleSide
            // 修复过度透明的材质
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              // 强制设置不透明
              mat.transparent = false
              mat.opacity = 1
              mat.depthWrite = true
              // 如果没有颜色，设置默认颜色
              if (!mat.map && mat.color.getHex() === 0xffffff) {
                mat.color.setHex(0x88ccff)
                mat.metalness = 0.3
                mat.roughness = 0.2
              }
            }
          }
          if (Array.isArray(child.material)) {
            child.material.forEach(fixMaterial)
          } else {
            fixMaterial(child.material)
          }
        }
      })
      
      // 计算模型边界并缩放
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 0.65 / maxDim
      model.scale.setScalar(scale)
      
      // 居中模型
      const center = box.getCenter(new THREE.Vector3())
      model.position.set(
        -center.x * scale,
        -center.y * scale + 0.1,
        -center.z * scale
      )
      
      // 注册点击映射
      productMeshes.set(model, product)
      productGroup.add(model)
    } catch (error) {
      console.warn(`Failed to load model for ${product.id}:`, error)
      
      // 使用发光占位立方体
      const placeholderGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const placeholderMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b9d,
        emissive: 0xff6b9d,
        emissiveIntensity: 0.5
      })
      const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial)
      placeholder.position.set(0, 0.1, 0)
      productMeshes.set(placeholder, product)
      productGroup.add(placeholder)
    }
    
    sceneRef.add(productGroup)
    loadedCount++
    loadingProgress.value = Math.round((loadedCount / totalProducts) * 100)
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)
  time += 0.01
  
  // 更新脏污材质动画
  if (grimeGlassMaterial) {
    grimeGlassMaterial.uniforms.uTime.value = time
  }
  
  // 电子屏文字滚动 - 两个Text对象同步移动
  if (screenText1 && screenText2 && textWidth > 0) {
    const speed = 0.015
    screenText1.position.x -= speed
    screenText2.position.x -= speed
    
    // 当第一个文字完全滚出左边，移到第二个后面
    if (screenText1.position.x < -2.4 - textWidth) {
      screenText1.position.x = screenText2.position.x + textWidth
    }
    // 当第二个文字完全滚出左边，移到第一个后面
    if (screenText2.position.x < -2.4 - textWidth) {
      screenText2.position.x = screenText1.position.x + textWidth
    }
  }
  
  // 产品持续旋转（统一速度）
  productGroups.forEach((group) => {
    group.rotation.y += 0.005  // 每帧旋转0.005弧度
  })
  
  // 更新控制器
  if (controls.value) {
    controls.value.update()
  }
  
  if (composer.value) {
    composer.value.render()
  } else if (renderer.value && scene.value && camera.value) {
    renderer.value.render(scene.value, camera.value)
  }
}

function handleResize() {
  if (!containerRef.value || !camera.value || !renderer.value || !composer.value) return
  
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  
  camera.value.aspect = width / height
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(width, height)
  composer.value.setSize(width, height)
}

async function initThreeJS() {
  if (!containerRef.value) return
  
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  
  // 创建场景
  scene.value = new THREE.Scene()
  const bgColor = 0x808080  // 中灰色
  scene.value.background = new THREE.Color(bgColor)
  
  // 创建相机 - 稍微倾斜的视角
  camera.value = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
  camera.value.position.set(2, 1, 12)
  camera.value.lookAt(0, 0, 0)
  
  // 创建渲染器
  renderer.value = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.value.localClippingEnabled = true  // 启用clipping
  renderer.value.setSize(width, height)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.value.toneMapping = THREE.ACESFilmicToneMapping
  renderer.value.toneMappingExposure = 1.5
  containerRef.value.appendChild(renderer.value.domElement)
  
  // 轨道控制器
  controls.value = new OrbitControls(camera.value, renderer.value.domElement)
  controls.value.enableDamping = true
  controls.value.dampingFactor = 0.05
  controls.value.minDistance = 8
  controls.value.maxDistance = 18
  controls.value.maxPolarAngle = Math.PI / 1.8
  controls.value.minPolarAngle = Math.PI / 4
  controls.value.enablePan = false
  
  // 后处理 - Bloom效果
  composer.value = new EffectComposer(renderer.value)
  const renderPass = new RenderPass(scene.value, camera.value)
  composer.value.addPass(renderPass)
  
  // 白色背景下关闭Bloom
  // const bloomPass = new UnrealBloomPass(
  //   new THREE.Vector2(width, height),
  //   1.0,   // strength
  //   0.4,   // radius
  //   0.8    // threshold
  // )
  // composer.value.addPass(bloomPass)
  
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.value.add(ambientLight)
  
  // 主光源
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
  mainLight.position.set(5, 8, 5)
  scene.value.add(mainLight)
  
  // 填充光
  const fillLight = new THREE.DirectionalLight(0x00ffff, 0.6)
  fillLight.position.set(-5, 0, 5)
  scene.value.add(fillLight)
  
  // 背光
  const backLight = new THREE.DirectionalLight(0xff6b9d, 0.4)
  backLight.position.set(0, 5, -5)
  scene.value.add(backLight)
  
  // 聚光灯 - 从右上方打光
  const spotLight = new THREE.SpotLight(0xffffff, 3)
  spotLight.position.set(6, 8, 8)
  spotLight.target.position.set(0, 0, 0)
  spotLight.angle = Math.PI / 5
  spotLight.penumbra = 0.5
  spotLight.decay = 1
  spotLight.distance = 40
  scene.value.add(spotLight)
  scene.value.add(spotLight.target)
  
  // 辅助聚光灯 - 从左前方补光
  const spotLight2 = new THREE.SpotLight(0xaaccff, 1.5)
  spotLight2.position.set(-5, 6, 8)
  spotLight2.target.position.set(0, 0, 0)
  spotLight2.angle = Math.PI / 6
  spotLight2.penumbra = 0.5
  scene.value.add(spotLight2)
  scene.value.add(spotLight2.target)
  
  // 创建售货机
  await createVendingMachine(scene.value)
  
  // 加载产品模型
  await loadProductModels(scene.value)
  
  isLoading.value = false
  
  // 开始动画循环
  animate()
  
  // 监听事件
  window.addEventListener('resize', handleResize)
}

onMounted(() => {
  initThreeJS()
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  
  window.removeEventListener('resize', handleResize)
  
  if (controls.value) {
    controls.value.dispose()
  }
  
  if (renderer.value) {
    renderer.value.dispose()
    if (containerRef.value && renderer.value.domElement) {
      containerRef.value.removeChild(renderer.value.domElement)
    }
  }
  
  productMeshes.clear()
  productGroups.length = 0
})
</script>

<template>
  <div class="vending-machine-3d">
    <!-- 3D画布容器 -->
    <div 
      ref="containerRef" 
      class="canvas-container"
      @click="onClick"
      @pointermove="onPointerMove"
    />
    
    <!-- 加载提示 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中... {{ loadingProgress }}%</p>
      </div>
    </div>
    
    <!-- 顶部标题已移至3D场景中 -->
    
    <!-- 底部信息 -->
    <div class="footer-overlay">
      <span class="footer-date">2015.02.10-17</span>
      <span class="footer-brand">CAOSENG MFG.</span>
    </div>
    
    <!-- 产品说明书弹窗 -->
    <ProductModal
      :product="selectedProduct"
      :is-open="isModalOpen"
      @close="handleClose"
    />
  </div>
</template>

<style scoped>
.vending-machine-3d {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 3 / 4;
  background: #0a0805;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 0 0 3px #333,
    0 0 0 6px #1a1a1a,
    0 20px 60px rgba(0, 0, 0, 0.5);
}

.canvas-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 8, 5, 0.95);
  z-index: 10;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #333;
  border-top-color: #0ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #0ff;
  font-size: 0.875rem;
  letter-spacing: 0.1em;
}

.title-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(10, 8, 5, 0.9) 0%, transparent 100%);
  pointer-events: none;
}

.title {
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(180deg, #ff6b9d 0%, #c44569 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(255, 107, 157, 0.5));
  letter-spacing: 0.15em;
}

.subtitle {
  font-size: 0.625rem;
  color: #0ff;
  margin: 0.25rem 0 0;
  letter-spacing: 0.2em;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.footer-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: linear-gradient(0deg, rgba(10, 8, 5, 0.9) 0%, transparent 100%);
  pointer-events: none;
}

.footer-date,
.footer-brand {
  font-size: 0.625rem;
  font-family: 'Courier New', monospace;
  color: #555;
}

.footer-brand {
  letter-spacing: 0.1em;
}
</style>
