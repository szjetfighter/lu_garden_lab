<template>
  <div 
    class="control-knob"
    :class="{ 'is-danger': rpmRatio > 0.8 }"
    ref="knobRef"
    @mousedown="startDrag"
    @touchstart.prevent="startDrag"
    @wheel.prevent="onWheel"
  >
    <!-- 旋钮背景 -->
    <div class="knob-track">
      <!-- 刻度线 -->
      <svg class="tick-marks" viewBox="0 0 100 100">
        <g v-for="i in 10" :key="i">
          <line 
            :x1="50 + 42 * Math.cos(((i - 1) * 27 - 135) * Math.PI / 180)"
            :y1="50 + 42 * Math.sin(((i - 1) * 27 - 135) * Math.PI / 180)"
            :x2="50 + 48 * Math.cos(((i - 1) * 27 - 135) * Math.PI / 180)"
            :y2="50 + 48 * Math.sin(((i - 1) * 27 - 135) * Math.PI / 180)"
            :stroke="(i - 1) >= 7 ? '#ff0000' : '#333'"
            stroke-width="2"
          />
        </g>
      </svg>
    </div>
    
    <!-- 旋钮本体 -->
    <div 
      class="knob-body"
      :style="{ transform: `rotate(${rotation}deg)` }"
    >
      <div class="knob-indicator" :class="{ 'indicator-danger': rpmRatio > 0.7 }"></div>
      <div class="knob-center"></div>
    </div>
    
    <!-- 危险区弧线 -->
    <svg class="danger-arc" viewBox="0 0 100 100">
      <path
        d="M 50 50 L 95 50 A 45 45 0 0 1 50 95"
        fill="rgba(255, 0, 0, 0.15)"
        transform="rotate(65, 50, 50)"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps<{
  rpm: number
  maxRpm: number
}>()

const emit = defineEmits<{
  (e: 'update:rpm', value: number): void
  (e: 'change', value: number): void
}>()

const knobRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const lastAngle = ref(0)

// RPM比率
const rpmRatio = computed(() => props.rpm / props.maxRpm)

// 旋钮旋转角度 (0-270度，从-135到+135)
const rotation = computed(() => {
  return rpmRatio.value * 270 - 135
})

// 计算鼠标相对于旋钮中心的角度
const getAngle = (clientX: number, clientY: number): number => {
  if (!knobRef.value) return 0
  const rect = knobRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  return Math.atan2(clientY - centerY, clientX - centerX)
}

const updateRpm = (newRpm: number) => {
  newRpm = Math.round(newRpm / 100) * 100 // 步进100
  newRpm = Math.max(0, Math.min(props.maxRpm, newRpm))
  emit('update:rpm', newRpm)
  emit('change', newRpm)
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  lastAngle.value = getAngle(clientX, clientY)
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const currentAngle = getAngle(clientX, clientY)
  
  // 计算角度变化（处理跨越±π的情况）
  let deltaAngle = currentAngle - lastAngle.value
  if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2
  if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2
  
  // 角度变化转换为RPM变化（顺时针=正，逆时针=负）
  // 270度对应9000 RPM，所以每弧度约 9000 / (270 * π/180) = 1909 RPM
  const deltaRpm = deltaAngle * (props.maxRpm / (270 * Math.PI / 180))
  
  updateRpm(props.rpm + deltaRpm)
  lastAngle.value = currentAngle
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 滚轮支持
const onWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -300 : 300
  updateRpm(props.rpm + delta)
}

onUnmounted(() => {
  stopDrag()
})
</script>

<style scoped>
.control-knob {
  position: relative;
  width: 150px;
  height: 150px;
  cursor: grab;
  user-select: none;
  transition: filter 0.3s;
}

.control-knob:active {
  cursor: grabbing;
}

.control-knob.is-danger {
  filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.5));
}

.knob-track {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
  box-shadow: 
    inset 0 2px 10px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(0, 255, 0, 0.1);
}

.tick-marks {
  position: absolute;
  width: 100%;
  height: 100%;
}

.knob-body {
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 3px rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.2s;
}

.knob-body:hover {
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 3px rgba(255, 255, 255, 0.1),
    0 0 20px rgba(0, 255, 0, 0.3);
}

.knob-indicator {
  position: absolute;
  top: 8%;
  left: 50%;
  width: 4px;
  height: 25%;
  background: #00ff00;
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  transition: background 0.3s, box-shadow 0.3s;
}

.knob-indicator.indicator-danger {
  background: #ff0000;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
}

.knob-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20%;
  height: 20%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #111;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.8);
}

.danger-arc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
