import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function useThreeScene(containerRef: Ref<HTMLElement | null>) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  let controls: OrbitControls | null = null
  
  let animationId: number | null = null
  const updateCallbacks: Array<(delta: number) => void> = []
  const clock = new THREE.Clock()

  const init = () => {
    if (!containerRef.value) return

    const container = containerRef.value
    const width = container.clientWidth
    const height = container.clientHeight

    // 渲染器
    renderer.value = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.value.setClearColor(0x0a0a0a, 1)
    container.appendChild(renderer.value.domElement)

    // 相机 
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    camera.position.set(0, 0, 7)  // 正视
    camera.lookAt(0, 0, 0)

    // 轨道控制器 - 可旋转、缩放
    controls = new OrbitControls(camera, renderer.value.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.minDistance = 1.5
    controls.maxDistance = 15
    controls.enablePan = true
    controls.enableRotate = true

    // 窗口大小变化
    window.addEventListener('resize', handleResize)

    // 启动渲染循环
    animate()
  }

  const handleResize = () => {
    if (!containerRef.value || !renderer.value) return

    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.value.setSize(width, height)
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    
    const delta = clock.getDelta()
    
    // 更新控制器
    if (controls) {
      controls.update()
    }
    
    // 执行所有更新回调
    updateCallbacks.forEach(cb => cb(delta))
    
    if (renderer.value) {
      renderer.value.render(scene, camera)
    }
  }

  const onUpdate = (callback: (delta: number) => void) => {
    updateCallbacks.push(callback)
  }

  const dispose = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    window.removeEventListener('resize', handleResize)
    
    if (controls) {
      controls.dispose()
    }
    
    if (renderer.value) {
      renderer.value.dispose()
      renderer.value.domElement.remove()
    }

    // 清理场景
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }

  onMounted(init)
  onUnmounted(dispose)

  return {
    scene,
    camera,
    renderer,
    onUpdate,
  }
}
