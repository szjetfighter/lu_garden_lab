<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import type { CaogongProduct } from '../types/xinpin'
import { products } from '../data/products'
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

function createVendingMachine(sceneRef: THREE.Scene) {
  const machineGroup = new THREE.Group()
  
  // 售货机主体 - 只渲染内侧，不遮挡产品
  const bodyGeometry = new THREE.BoxGeometry(5, 7, 2)
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.2,
    side: THREE.BackSide  // 只渲染内侧
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.set(0, 0, 0)
  machineGroup.add(body)
  
  // 背面遮挡板（防止从背面看穿）
  const backCoverGeometry = new THREE.PlaneGeometry(5, 7)
  const backCoverMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.2
  })
  const backCover = new THREE.Mesh(backCoverGeometry, backCoverMaterial)
  backCover.position.set(0, 0, -1)
  backCover.rotation.y = Math.PI  // 朝向背面
  machineGroup.add(backCover)
  
  // 外框边缘（左右上下四条边）
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.2
  })
  // 左边框
  const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 2), frameMaterial)
  leftFrame.position.set(-2.35, 0, 0)
  machineGroup.add(leftFrame)
  // 右边框
  const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 2), frameMaterial)
  rightFrame.position.set(2.35, 0, 0)
  machineGroup.add(rightFrame)
  // 上边框
  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 2), frameMaterial)
  topFrame.position.set(0, 3.25, 0)
  machineGroup.add(topFrame)
  // 下边框
  const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 2), frameMaterial)
  bottomFrame.position.set(0, -3, 0)
  machineGroup.add(bottomFrame)
  
  // 内部展示背板（只渲染背面，不遮挡产品）
  const backPanelGeometry = new THREE.PlaneGeometry(4.4, 5.2)
  const backPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0.5,
    roughness: 0.8,
    side: THREE.FrontSide
  })
  const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial)
  backPanel.position.set(0, 0.4, -0.2)
  machineGroup.add(backPanel)
  
  // 玻璃面板
  const glassGeometry = new THREE.BoxGeometry(4.5, 5.3, 0.05)
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 0.95,
    thickness: 0.1,
    transparent: true,
    opacity: 0.15
  })
  const glass = new THREE.Mesh(glassGeometry, glassMaterial)
  glass.position.set(0, 0.4, 1.1)
  machineGroup.add(glass)
  
  // 顶部招牌背板
  const signBackGeometry = new THREE.BoxGeometry(5.2, 1.2, 0.5)
  const signBackMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a15,
    metalness: 0.8,
    roughness: 0.3
  })
  const signBack = new THREE.Mesh(signBackGeometry, signBackMaterial)
  signBack.position.set(0, 4, 0.3)
  machineGroup.add(signBack)
  
  // 霓虹招牌发光板
  const signGlowGeometry = new THREE.BoxGeometry(4.8, 0.8, 0.1)
  const signGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6b9d,
    transparent: true,
    opacity: 0.9
  })
  const signGlow = new THREE.Mesh(signGlowGeometry, signGlowMaterial)
  signGlow.position.set(0, 4, 0.6)
  machineGroup.add(signGlow)
  
  // 霓虹边框 - 更粗更亮
  const neonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff })
  const neonThickness = 0.08
  
  // 展示区边框
  const framePositions = [
    { geo: [4.6, neonThickness, neonThickness], pos: [0, 3, 1.15] },  // 顶
    { geo: [4.6, neonThickness, neonThickness], pos: [0, -2.2, 1.15] }, // 底
    { geo: [neonThickness, 5.2, neonThickness], pos: [-2.25, 0.4, 1.15] }, // 左
    { geo: [neonThickness, 5.2, neonThickness], pos: [2.25, 0.4, 1.15] }  // 右
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
  const cellHeight = 1.2
  const startX = -1.6
  const startY = 2.4
  
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
  scene.value.background = new THREE.Color(0xffffff)
  
  // 创建相机 - 稍微倾斜的视角
  camera.value = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
  camera.value.position.set(2, 1, 12)
  camera.value.lookAt(0, 0, 0)
  
  // 创建渲染器
  renderer.value = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
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
  
  // 创建售货机
  createVendingMachine(scene.value)
  
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
    
    <!-- 顶部标题覆盖层 -->
    <div class="title-overlay">
      <h1 class="title">新品发布</h1>
      <p class="subtitle">曹僧诗歌售卖机 · 3D</p>
    </div>
    
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
