<script setup lang="ts">
/**
 * 产品说明书弹窗组件
 * 统一使用项目通用Modal风格
 * 包含3D模型预览
 */
import { ref, watch, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { CaogongProduct } from '../types/xinpin'

const props = defineProps<{
  product: CaogongProduct | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

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

// Three.js refs
const modelContainerRef = ref<HTMLDivElement | null>(null)
const scene = shallowRef<THREE.Scene | null>(null)
const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
const controls = shallowRef<OrbitControls | null>(null)
const currentModel = shallowRef<THREE.Group | null>(null)
let animationId: number | null = null

/** 获取圈号数字 */
function getCircledNumber(n: number): string {
  return '⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁'.split('')[n - 1] || String(n)
}

/** 初始化3D场景 */
function initScene() {
  if (!modelContainerRef.value) return
  
  const container = modelContainerRef.value
  const width = container.clientWidth
  const height = container.clientHeight
  
  // 创建场景（透明背景）
  scene.value = new THREE.Scene()
  scene.value.background = null
  
  // 创建相机（紧凑显示）
  camera.value = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.value.position.set(0, 0.2, 2.5)
  
  // 创建渲染器（透明背景）
  renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.value.setSize(width, height)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.value.toneMapping = THREE.ACESFilmicToneMapping
  renderer.value.toneMappingExposure = 1.2
  container.appendChild(renderer.value.domElement)
  
  // 添加控制器
  controls.value = new OrbitControls(camera.value, renderer.value.domElement)
  controls.value.enableDamping = true
  controls.value.dampingFactor = 0.05
  controls.value.enableZoom = true
  controls.value.enablePan = false
  controls.value.autoRotate = true
  controls.value.autoRotateSpeed = 2
  
  // 添加光照
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.value.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.value.add(directionalLight)
  
  const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
  backLight.position.set(-5, 3, -5)
  scene.value.add(backLight)
  
  // 开始动画循环
  animate()
}

/** 加载模型 */
function loadModel(productId: string) {
  const modelFile = productModelMap[productId]
  if (!modelFile || !scene.value) return
  
  // 移除旧模型
  if (currentModel.value) {
    scene.value.remove(currentModel.value)
    currentModel.value = null
  }
  
  const loader = new GLTFLoader()
  const modelUrl = new URL(`../assets/GLB/${modelFile}`, import.meta.url).href
  
  loader.load(modelUrl, (gltf) => {
    const model = gltf.scene
    
    // 修复模型材质（与主体一致）
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const fixMaterial = (mat: THREE.Material) => {
          mat.side = THREE.DoubleSide
          if ('transparent' in mat && mat.transparent) {
            ;(mat as THREE.MeshStandardMaterial).alphaTest = 0.1
            ;(mat as THREE.MeshStandardMaterial).depthWrite = true
          }
        }
        if (Array.isArray(child.material)) {
          child.material.forEach(fixMaterial)
        } else {
          fixMaterial(child.material)
        }
      }
    })
    
    // 计算边界盒并居中缩放
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 1.5 / maxDim
    model.scale.setScalar(scale)
    
    model.position.sub(center.multiplyScalar(scale))
    
    if (scene.value) {
      scene.value.add(model)
      currentModel.value = model
    }
  }, undefined, (error) => {
    console.error('模型加载失败:', productId, error)
  })
}

/** 动画循环 */
function animate() {
  animationId = requestAnimationFrame(animate)
  
  if (controls.value) {
    controls.value.update()
  }
  
  if (renderer.value && scene.value && camera.value) {
    renderer.value.render(scene.value, camera.value)
  }
}

/** 清理资源 */
function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  
  // 深度清理模型
  if (currentModel.value && scene.value) {
    currentModel.value.traverse((object: THREE.Object3D) => {
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
    scene.value.remove(currentModel.value)
    currentModel.value = null
  }
  
  // 清理场景中所有对象
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
    scene.value.clear()
  }
  
  if (controls.value) {
    controls.value.dispose()
    controls.value = null
  }
  
  if (renderer.value) {
    renderer.value.dispose()
    renderer.value.forceContextLoss()  // 强制释放WebGL上下文
    if (modelContainerRef.value && renderer.value.domElement.parentNode) {
      modelContainerRef.value.removeChild(renderer.value.domElement)
    }
    renderer.value = null
  }
  
  scene.value = null
  camera.value = null
}

// 监听modal打开/关闭
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.product) {
    // 延迟初始化，等待DOM渲染
    setTimeout(() => {
      initScene()
      loadModel(props.product!.id)
    }, 100)
  } else {
    cleanup()
  }
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && product"
        class="modal-overlay"
        @click.self="emit('close')"
      >
        <div class="modal-content">
          <!-- 关闭按钮 -->
          <button class="close-button" @click="emit('close')">
            <XMarkIcon class="w-6 h-6" />
          </button>
          
          <!-- 3D模型预览（取代序号） -->
          <div ref="modelContainerRef" class="model-preview"></div>
          
          <!-- 产品标题（使用catalogName与滚动条对应） -->
          <div class="product-title">
            <h2>{{ product.catalogName }}</h2>
            <p v-if="product.subtitle" class="subtitle">{{ product.subtitle }}</p>
          </div>
          
          <!-- 诗歌内容 -->
          <div class="poem-body">
            <p
              v-for="(line, index) in product.lines"
              :key="index"
              class="poem-line"
            >
              {{ line }}
            </p>
          </div>
          
          <!-- 水印 -->
          <div class="modal-watermark">
            INCOGNITO Ⓒ LUGARDEN
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 32rem;
  max-height: 80vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.product-title {
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.product-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Noto Serif SC', serif;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: #4a5568;
  margin-top: 0.5rem;
}

.model-preview {
  width: 100%;
  height: 80px;
  margin-bottom: 0.5rem;
  overflow: hidden;
  cursor: grab;
}

.model-preview:active {
  cursor: grabbing;
}

.poem-body {
  padding: 0.5rem 0;
}

.poem-line {
  font-size: 1rem;
  line-height: 2;
  color: #2d3748;
  font-family: 'Noto Serif SC', serif;
  margin: 0;
  text-align: center;
}

.modal-watermark {
  margin-top: 1.5rem;
  padding-top: 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #a0aec0;
  letter-spacing: 0.1em;
  border-top: 1px solid #e2e8f0;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
