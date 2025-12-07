<template>
  <div ref="containerRef" class="toxicology-scene"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useToxicScene } from '../composables/useToxicScene'
import { useToxicParticles } from '../composables/useToxicParticles'
import { useCentrifugeDevice } from '../composables/useCentrifugeDevice'
import { getRandomPoem } from '../data/loader'

const props = defineProps<{
  rpm: number
}>()

const containerRef = ref<HTMLDivElement | null>(null)

// 累积旋转角度（用于同步设备和粒子）
let globalRotation = 0

// 场景
const { 
  scene, 
  camera,
  renderer,
  init: initScene, 
  dispose: disposeScene, 
  onUpdate,
  setRpm 
} = useToxicScene(containerRef)

// 射线检测器
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// 点击处理 - 根据角度判断试管
const handleClick = (event: MouseEvent) => {
  if (!containerRef.value || !renderer.value || !camera) return
  
  const rect = containerRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  
  // 检测与场景中物体的交点
  const intersects = raycaster.intersectObjects(scene.children, true)
  
  if (intersects.length > 0) {
    const point = intersects[0].point
    // 根据点击位置的角度判断试管索引
    const angle = Math.atan2(point.z, point.x)
    // 转换为 0-3 的索引
    let tubeIndex = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 4 + 0.5) % 4
    // 调整旋转偏移
    tubeIndex = (tubeIndex + Math.floor(globalRotation / (Math.PI / 2))) % 4
    
    // 3D悬浮展示
    floatOutTube(tubeIndex)
  }
}

// 粒子系统
const { 
  loadPoem, 
  applyCentrifuge, 
  update: updateParticles,
  reset: resetParticles,
  getResidue,
  getExtractionRate,
  floatOutTube,
  updateFloating,
  isFloating
} = useToxicParticles(scene, camera)

// 离心机设备
const {
  create: createDevice,
  update: updateDevice,
  dispose: disposeDevice
} = useCentrifugeDevice(scene)

// 监听RPM变化
watch(() => props.rpm, (newRpm) => {
  setRpm(newRpm)
})

// 重置（包括旋转角度）
const reset = () => {
  globalRotation = 0
  resetParticles()
}

onMounted(() => {
  initScene()
  
  // 创建离心机设备
  createDevice()
  
  // 加载随机诗歌
  const poem = getRandomPoem()
  loadPoem(poem)
  
  // 添加点击事件
  containerRef.value?.addEventListener('click', handleClick)
  
  // 注册更新回调
  onUpdate((delta, _time) => {
    // 如果有悬浮展示，优先更新悬浮动画
    if (isFloating()) {
      updateFloating()
      return
    }
    
    // 更新旋转角度
    const angularVelocity = (props.rpm * Math.PI * 2) / 60
    globalRotation += angularVelocity * delta
    
    // 更新粒子离心效果
    applyCentrifuge(props.rpm, delta)
    
    // 更新粒子位置（跟随旋转和倾斜）
    updateParticles(globalRotation, props.rpm / 9000)
    
    // 更新设备（同步旋转和指示灯）
    updateDevice(globalRotation, props.rpm / 9000)
  })
})

onUnmounted(() => {
  containerRef.value?.removeEventListener('click', handleClick)
  disposeDevice()
  disposeScene()
})

// 暴露方法给父组件
defineExpose({
  reset,
  getResidue,
  getExtractionRate
})
</script>

<style scoped>
.toxicology-scene {
  width: 100%;
  height: 100%;
  background: #0a0a0a;
}
</style>
