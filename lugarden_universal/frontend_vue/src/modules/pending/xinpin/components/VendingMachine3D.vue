<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
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
  
  // 玻璃面板 - 脏玻璃效果（静态，无动画）
  const glassGeometry = new THREE.PlaneGeometry(4.5, 5.5)
  const grimeGlassMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#aaddff') },
      uOpacity: { value: 0.04 },   // 降低基础不透明度
      uGrimeScale: { value: 1.5 }
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uGrimeScale;
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
        vec2 worldUv = vWorldPosition.xy * uGrimeScale;
        float grime = noise(worldUv * 3.0);
        // 仅污渍效果，降低强度
        vec3 finalColor = uColor + vec3(0.015) * grime;
        float alpha = uOpacity + (grime * 0.015);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  })
  const glass = new THREE.Mesh(glassGeometry, grimeGlassMaterial)
  glass.position.set(0, 0.25, 1.1)
  machineGroup.add(glass)
  
  // 侧面玻璃（连接正面和主体，形成玻璃罩）
  const sideGlassDepth = 0.19
  const sideGlassZ = 1.0 + sideGlassDepth / 2
  const glassInnerWidth = 2.22
  const glassTop = 2.96
  const glassBottom = -2.46
  const glassHeight = glassTop - glassBottom
  const glassWidth = glassInnerWidth * 2
  const glassYCenter = (glassTop + glassBottom) / 2
  
  // 左侧玻璃
  const leftGlassGeo = new THREE.PlaneGeometry(sideGlassDepth, glassHeight)
  const leftGlass = new THREE.Mesh(leftGlassGeo, grimeGlassMaterial)
  leftGlass.position.set(-glassInnerWidth, glassYCenter, sideGlassZ)
  leftGlass.rotation.y = Math.PI / 2
  machineGroup.add(leftGlass)
  
  // 右侧玻璃
  const rightGlass = new THREE.Mesh(leftGlassGeo, grimeGlassMaterial)
  rightGlass.position.set(glassInnerWidth, glassYCenter, sideGlassZ)
  rightGlass.rotation.y = -Math.PI / 2
  machineGroup.add(rightGlass)
  
  // 上侧玻璃
  const topGlassGeo = new THREE.PlaneGeometry(glassWidth, sideGlassDepth)
  const topGlass = new THREE.Mesh(topGlassGeo, grimeGlassMaterial)
  topGlass.position.set(0, glassTop, sideGlassZ)
  topGlass.rotation.x = Math.PI / 2
  machineGroup.add(topGlass)
  
  // 下侧玻璃
  const bottomGlass = new THREE.Mesh(topGlassGeo, grimeGlassMaterial)
  bottomGlass.position.set(0, glassBottom, sideGlassZ)
  bottomGlass.rotation.x = -Math.PI / 2
  machineGroup.add(bottomGlass)
  
  // === 电子屏（机器顶部嵌入位置 y=4）===
  // 电子屏背板（宽度与主体一致5.0，紧贴顶部y=4.1，z前端对齐主体）
  // BoxGeometry 5.0 x 1.2 x 0.5，使用蓝色金属纹理
  const screenBackMats = [
    createOuterMat(0.5, 1.2),   // +X
    createOuterMat(0.5, 1.2),   // -X
    createOuterMat(5.0, 0.5),   // +Y
    createOuterMat(5.0, 0.5),   // -Y
    createOuterMat(5.0, 1.2),   // +Z 前
    createOuterMat(5.0, 1.2)    // -Z 后
  ]
  const screenBack = new THREE.Mesh(
    new THREE.BoxGeometry(5.0, 1.2, 0.5),
    screenBackMats
  )
  screenBack.position.set(0, 4.1, 0.75)
  machineGroup.add(screenBack)
  
  // 电子屏发光面板 - LED点阵效果
  const screenGlowGeometry = new THREE.PlaneGeometry(4.6, 0.8)
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
  // LED背景黑块（在LED后面，增强对比度）
  const ledBackGeometry = new THREE.PlaneGeometry(4.6, 0.8)
  const ledBackMaterial = new THREE.MeshBasicMaterial({
    color: 0x0a0a0a
  })
  const ledBack = new THREE.Mesh(ledBackGeometry, ledBackMaterial)
  ledBack.position.set(0, 4.1, 1.0)
  machineGroup.add(ledBack)
  
  // LED面板（在黑块前面）
  const screenGlow = new THREE.Mesh(screenGlowGeometry, ledShaderMaterial)
  screenGlow.position.set(0, 4.1, 1.01)
  machineGroup.add(screenGlow)
  
  // 电子屏滚动文字 - 两个Text对象首尾相接
  const clipLeft = new THREE.Plane(new THREE.Vector3(1, 0, 0), 2.3)
  const clipRight = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 2.3)
  
  // 创建第一个文字
  screenText1 = new Text()
  screenText1.text = scrollContent
  screenText1.fontSize = 0.22
  screenText1.color = 0x00ffaa
  screenText1.anchorX = 'left'
  screenText1.anchorY = 'middle'
  screenText1.position.set(2.3, 4.1, 1.02)  // 与LED面板对齐
  screenText1.material.clippingPlanes = [clipLeft, clipRight]
  screenText1.sync(() => {
    const bounds = screenText1.textRenderInfo?.blockBounds
    if (bounds) {
      textWidth = bounds[2] - bounds[0]
      // 第二个文字紧跟第一个后面
      screenText2.position.x = 2.3 + textWidth
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
  screenText2.position.set(2.3 + 30, 4.1, 1.02)  // 临时位置，sync后更新
  screenText2.material.clippingPlanes = [clipLeft, clipRight]
  screenText2.sync()
  sceneRef.add(screenText2)
  
  // === 霓虹灯招牌支架 ===
  // 加载锈蚀纹理
  const rustyTexture = await new Promise<THREE.Texture>((resolve) => {
    textureLoader.load(
      new URL('../assets/texture/rusty_metal_04_diff_1k.jpg', import.meta.url).href,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        resolve(texture)
      }
    )
  })
  
  // 创建锈蚀纹理材质函数
  function createRustyMat(width: number, height: number) {
    const tex = rustyTexture.clone()
    tex.needsUpdate = true
    tex.repeat.set(width * scale, height * scale)
    return new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.7,
      roughness: 0.6
    })
  }
  
  // 电子屏顶部 y=4.7，招牌 y=5.15，高度差0.45
  const poleHeight = 0.45
  const poleBottom = 4.7  // 电子屏顶部
  const poleCenter = poleBottom + poleHeight / 2
  
  // 立杆材质（立方体：0.05 x 0.45 x 0.05）
  const poleSize = 0.05
  const poleMats = [
    createRustyMat(poleSize, poleHeight),  // +X
    createRustyMat(poleSize, poleHeight),  // -X
    createRustyMat(poleSize, poleSize),    // +Y
    createRustyMat(poleSize, poleSize),    // -Y
    createRustyMat(poleSize, poleHeight),  // +Z
    createRustyMat(poleSize, poleHeight)   // -Z
  ]
  
  // 左立杆
  const leftPole = new THREE.Mesh(
    new THREE.BoxGeometry(poleSize, poleHeight, poleSize),
    poleMats
  )
  leftPole.position.set(-1.4, poleCenter, 0.95)
  machineGroup.add(leftPole)
  
  // 右立杆
  const rightPole = new THREE.Mesh(
    new THREE.BoxGeometry(poleSize, poleHeight, poleSize),
    poleMats
  )
  rightPole.position.set(1.4, poleCenter, 0.95)
  machineGroup.add(rightPole)
  
  // 横梁材质（每面按尺寸设置repeat）
  // BoxGeometry 2.86 x 0.05 x 0.05
  const barMats = [
    createRustyMat(0.05, 0.05),  // +X
    createRustyMat(0.05, 0.05),  // -X
    createRustyMat(2.86, 0.05),  // +Y
    createRustyMat(2.86, 0.05),  // -Y
    createRustyMat(2.86, 0.05),  // +Z
    createRustyMat(2.86, 0.05)   // -Z
  ]
  const crossBar = new THREE.Mesh(
    new THREE.BoxGeometry(2.86, 0.05, 0.05),
    barMats
  )
  crossBar.position.set(0, poleBottom + poleHeight, 0.95)
  machineGroup.add(crossBar)
  
  // === 霓虹灯招牌 ===
  const neonTextGroup = new THREE.Group()
  neonTextGroup.position.set(0, 5.15, 1.0)  // 稍微上移，在横梁上方
  
  // 多层堆叠模拟厚度（共6层，厚度约0.05）
  const textDepth = 0.05
  const layers = 6
  
  for (let i = 0; i < layers; i++) {
    const zPos = (i / (layers - 1) - 0.5) * textDepth  // -0.025 到 +0.025
    const isEdge = i === 0 || i === layers - 1  // 首尾层
    
    // 光晕层（只在边缘）
    if (isEdge) {
      const glowLayer = new Text()
      glowLayer.text = 'NEW ARRIVAL'
      glowLayer.font = cyberpunkFontUrl
      glowLayer.fontSize = 0.4
      glowLayer.color = 0xffffff
      glowLayer.anchorX = 'center'
      glowLayer.anchorY = 'middle'
      glowLayer.outlineWidth = 0.025
      glowLayer.outlineColor = 0xffffff
      glowLayer.outlineOpacity = 0.6
      glowLayer.position.z = zPos - 0.005
      glowLayer.sync(() => {
        if (glowLayer.material) glowLayer.material.side = THREE.DoubleSide
      })
      neonTextGroup.add(glowLayer)
    }
    
    // 主体层（带渐变：因Troika按字符UV映射，实际效果为字符级微渐变，产生霓虹质感）
    const mainLayer = new Text()
    mainLayer.text = 'NEW ARRIVAL'
    mainLayer.font = cyberpunkFontUrl
    mainLayer.fontSize = 0.4
    mainLayer.anchorX = 'center'
    mainLayer.anchorY = 'middle'
    mainLayer.position.z = zPos
    
    if (isEdge) {
      // 边缘层使用渐变材质（按字符UV产生微渐变效果）
      const gradientMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTopColor: { value: new THREE.Color(0xff6b9d) },     // 粉色
          uBottomColor: { value: new THREE.Color(0x8b0000) }   // 深红
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uTopColor;
          uniform vec3 uBottomColor;
          varying vec2 vUv;
          void main() {
            vec3 color = mix(uBottomColor, uTopColor, vUv.y);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.DoubleSide,
        transparent: true
      })
      mainLayer.material = gradientMaterial
    } else {
      mainLayer.color = 0x8b3a5a  // 中间层暗色
    }
    
    mainLayer.sync(() => {
      if (mainLayer.material && !isEdge) {
        mainLayer.material.side = THREE.DoubleSide
      }
    })
    neonTextGroup.add(mainLayer)
  }
  
  sceneRef.add(neonTextGroup)
  
  // 霓虹边框 - 一体式（Shape + ExtrudeGeometry）
  const neonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff })
  const neonThickness = 0.08
  
  // 创建框形Shape
  const outerWidth = 4.6 / 2
  const outerTop = 3 + neonThickness / 2
  const outerBottom = -2.5 - neonThickness / 2
  const innerWidth = outerWidth - neonThickness
  const innerTop = outerTop - neonThickness
  const innerBottom = outerBottom + neonThickness
  
  const frameShape = new THREE.Shape()
  // 外框（顺时针）
  frameShape.moveTo(-outerWidth, outerBottom)
  frameShape.lineTo(outerWidth, outerBottom)
  frameShape.lineTo(outerWidth, outerTop)
  frameShape.lineTo(-outerWidth, outerTop)
  frameShape.closePath()
  
  // 内框挖洞（逆时针）
  const hole = new THREE.Path()
  hole.moveTo(-innerWidth, innerBottom)
  hole.lineTo(-innerWidth, innerTop)
  hole.lineTo(innerWidth, innerTop)
  hole.lineTo(innerWidth, innerBottom)
  hole.closePath()
  frameShape.holes.push(hole)
  
  // 合并框体和支架为一体式组件
  const bracketLength = 0.19
  const frameZ = 1.15 - neonThickness / 2
  const bracketZ = 1.15 + neonThickness / 2 - bracketLength / 2
  const cornerX = outerWidth - neonThickness / 2
  const cornerTopY = outerTop - neonThickness / 2
  const cornerBottomY = outerBottom + neonThickness / 2
  
  // 框体几何体（平移到正确位置）
  const frameGeometry = new THREE.ExtrudeGeometry(frameShape, {
    depth: neonThickness,
    bevelEnabled: false
  })
  frameGeometry.translate(0, 0, frameZ)
  
  // 四角支架几何体
  const cornerPositions = [
    [-cornerX, cornerTopY],
    [cornerX, cornerTopY],
    [-cornerX, cornerBottomY],
    [cornerX, cornerBottomY]
  ]
  
  const bracketGeometries = cornerPositions.map(([x, y]) => {
    const geo = new THREE.BoxGeometry(neonThickness, neonThickness, bracketLength)
    geo.translate(x, y, bracketZ)
    return geo
  })
  
  // 合并所有几何体（转换为非索引几何体确保兼容）
  const mergedGeometry = BufferGeometryUtils.mergeGeometries([
    frameGeometry.toNonIndexed(),
    ...bracketGeometries.map(g => g.toNonIndexed())
  ])
  
  const neonFrameComplete = new THREE.Mesh(mergedGeometry, neonMaterial)
  machineGroup.add(neonFrameComplete)
  
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
  
  // 创建渐变背景纹理（多层同心矩形，3:4比例，从外到内加深）
  const bgCanvas = document.createElement('canvas')
  const canvasWidth = 768   // 3:4比例
  const canvasHeight = 1024
  bgCanvas.width = canvasWidth
  bgCanvas.height = canvasHeight
  const ctx = bgCanvas.getContext('2d')!
  
  // 颜色插值函数
  function lerpColor(color1: string, color2: string, t: number): string {
    const c1 = parseInt(color1.slice(1), 16)
    const c2 = parseInt(color2.slice(1), 16)
    const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff
    const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }
  
  // 64层渐变（从外到内，两段渐变）
  const layers = 64
  const outerColor = '#f5f1e8'  // 最外层：统一卡片背景色
  const midColor = '#454442'    // 第8层：深温暖灰
  const innerColor = '#0a0a0a'  // 最内层：近黑色
  const breakpoint = 8          // 断点
  
  // 先填充底色
  ctx.fillStyle = outerColor
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // 绘制同心矩形（从外到内）
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1)  // 0 到 1
    const scale = 1 - t * 0.75  // 从100%缩小到25%
    
    // 两段插值
    let color: string
    if (i <= breakpoint) {
      // 第0~8层: #f5f1e8 → #454442
      const segT = i / breakpoint
      color = lerpColor(outerColor, midColor, segT)
    } else {
      // 第8~64层: #454442 → #0a0a0a
      const segT = (i - breakpoint) / (layers - 1 - breakpoint)
      color = lerpColor(midColor, innerColor, segT)
    }
    const rectW = canvasWidth * scale
    const rectH = canvasHeight * scale
    const x = centerX - rectW / 2
    const y = centerY - rectH / 2
    const radius = 12  // 圆角：与卡片一致（--radius-lg = 12px）
    
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, rectW, rectH, radius)
    ctx.fill()
  }
  
  const bgTexture = new THREE.CanvasTexture(bgCanvas)
  scene.value.background = bgTexture
  
  // 创建相机 - 正面水平视角
  camera.value = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
  camera.value.position.set(90, 0, 18)  // 右侧倾斜视角 (90, 0, 18) 约78.7°
  camera.value.lookAt(0, 0, 0)         // 看向原点 (0, 0, 0)
  
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
  // 触摸设备设置：单指旋转，双指也旋转（避免dolly触摸事件bug）
  controls.value.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_ROTATE
  }
  
  // 后处理 - Bloom效果
  composer.value = new EffectComposer(renderer.value)
  const renderPass = new RenderPass(scene.value, camera.value)
  composer.value.addPass(renderPass)
  
  // Bloom辉光效果（淡色背景下降低强度）
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.45,   // strength - 辉光强度
    0.8,   // radius - 辉光半径（从0.4降到0.2）
    0.8    // threshold - 亮度阈值（从0.7提到0.8，更少物体发光）
  )
  composer.value.addPass(bloomPass)
  
  // === 外部光源 ===
  
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.value.add(ambientLight)
  
  // 主光源
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(5, 8, 5)
  scene.value.add(mainLight)
  
  // 填充光
  const fillLight = new THREE.DirectionalLight(0x00ffff, 0.3)
  fillLight.position.set(-5, 0, 5)
  scene.value.add(fillLight)
  
  // 背光
  const backLight = new THREE.DirectionalLight(0xff6b9d, 0.2)
  backLight.position.set(0, 5, -5)
  scene.value.add(backLight)
  
  // 聚光灯 - 从右上方打光
  const spotLight = new THREE.SpotLight(0xffffff, 1.5)
  spotLight.position.set(6, 8, 8)
  spotLight.target.position.set(0, 0, 0)
  spotLight.angle = Math.PI / 5
  spotLight.penumbra = 0.5
  spotLight.decay = 1
  spotLight.distance = 40
  scene.value.add(spotLight)
  scene.value.add(spotLight.target)
  
  // 辅助聚光灯 - 从左前方补光
  const spotLight2 = new THREE.SpotLight(0xaaccff, 0.8)
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
  
  // 清理EffectComposer
  if (composer.value) {
    composer.value.dispose()
  }
  
  // 深度清理场景中的所有对象
  if (scene.value) {
    scene.value.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose())
          } else {
            object.material.dispose()
          }
        }
      }
    })
    // 清理背景纹理
    if (scene.value.background instanceof THREE.Texture) {
      scene.value.background.dispose()
    }
    scene.value.clear()
  }
  
  if (renderer.value) {
    renderer.value.dispose()
    renderer.value.forceContextLoss()  // 强制释放WebGL上下文
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
      <span class="footer-brand">CAOSENG @ LUGARDEN</span>
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
  overflow: hidden;
  
  /* 统一卡片样式 - 参考 unified-content-card */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.6) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all var(--duration-normal) var(--ease-out);
}

.vending-machine-3d:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
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
