<template>
  <div ref="containerRef" class="toxicology-scene"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useToxicScene } from '../composables/useToxicScene'
import { useToxicParticles } from '../composables/useToxicParticles'
import { useCentrifugeDevice } from '../composables/useCentrifugeDevice'
import { poemMingFang } from '../data/poems'

const props = defineProps<{
  rpm: number
}>()

const containerRef = ref<HTMLDivElement | null>(null)

// 累积旋转角度（用于同步设备和粒子）
let globalRotation = 0

// 场景
const { 
  scene, 
  init: initScene, 
  dispose: disposeScene, 
  onUpdate,
  setRpm 
} = useToxicScene(containerRef)

// 粒子系统
const { 
  loadPoem, 
  applyCentrifuge, 
  update: updateParticles,
  reset: resetParticles,
  getResidue,
  getExtractionRate
} = useToxicParticles(scene)

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
  
  // 加载诗歌
  loadPoem(poemMingFang)
  
  // 注册更新回调
  onUpdate((delta, _time) => {
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
