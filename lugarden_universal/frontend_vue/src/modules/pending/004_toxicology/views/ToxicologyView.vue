<template>
  <div class="toxicology-container">
    <!-- 3D场景 -->
    <ToxicologyScene 
      ref="sceneRef"
      :rpm="currentRpm" 
      class="scene-container"
    />
    
    <!-- UI覆盖层 -->
    <div class="ui-overlay">
      <!-- 顶部：标题与状态 -->
      <header class="header">
        <div class="header-left">
          <button class="back-btn" @click="goBack">←</button>
        </div>
        <div class="header-center">
          <h1 class="title">毒理学报告</h1>
          <div class="subtitle">冯铗《一剂》· 离心提纯实验</div>
        </div>
        <div class="header-right">
          <button class="reset-btn" @click="resetExperiment">重置</button>
        </div>
      </header>

      <!-- 提取率显示 -->
      <div class="extraction-info" v-if="currentRpm > 0">
        <span class="label">有效成分提取率:</span>
        <span class="value">{{ extractionRate.toFixed(1) }}%</span>
      </div>

      <!-- 底部：控制面板 -->
      <footer class="control-panel">
        <ControlKnob 
          v-model:rpm="currentRpm" 
          :max-rpm="9000"
          @change="onRpmChange"
        />
        <div class="rpm-display">
          <span class="rpm-value">{{ currentRpm }}</span>
          <span class="rpm-unit">RPM</span>
        </div>
        <div class="rpm-status" :class="rpmStatusClass">
          {{ rpmStatusText }}
        </div>
      </footer>

      <!-- 医疗警告（熔断时显示） -->
      <ClinicalMonitor 
        v-if="isMeltdown" 
        @dismiss="isMeltdown = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ControlKnob from '../components/ControlKnob.vue'
import ClinicalMonitor from '../components/ClinicalMonitor.vue'
import ToxicologyScene from '../components/ToxicologyScene.vue'

const router = useRouter()

// 状态
const sceneRef = ref<InstanceType<typeof ToxicologyScene> | null>(null)
const currentRpm = ref(0)
const isMeltdown = ref(false)
const extractionRate = ref(0)

// RPM状态文本
const rpmStatusText = computed(() => {
  if (currentRpm.value === 0) return '待机'
  if (currentRpm.value < 3000) return '低速分离'
  if (currentRpm.value < 6000) return '中速分离'
  if (currentRpm.value < 8000) return '高速分离'
  return '⚠️ 危险转速'
})

const rpmStatusClass = computed(() => {
  if (currentRpm.value === 0) return 'status-idle'
  if (currentRpm.value < 6000) return 'status-normal'
  if (currentRpm.value < 8000) return 'status-warning'
  return 'status-danger'
})

// RPM变化回调
const onRpmChange = (rpm: number) => {
  // 更新提取率
  if (sceneRef.value) {
    extractionRate.value = sceneRef.value.getExtractionRate() * 100
  }
}

// 重置实验
const resetExperiment = () => {
  currentRpm.value = 0
  extractionRate.value = 0
  if (sceneRef.value) {
    sceneRef.value.reset()
  }
}

// 返回
const goBack = () => {
  router.push('/pending')
}
</script>

<style scoped>
.toxicology-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #0a0a0a;
  overflow: hidden;
}

.scene-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: auto;
}

.header-left,
.header-right {
  width: 80px;
}

.header-center {
  text-align: center;
}

.back-btn,
.reset-btn {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  color: #00ff00;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover,
.reset-btn:hover {
  background: rgba(0, 255, 0, 0.2);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.title {
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: #00ff00;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  margin: 0;
}

.subtitle {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

.extraction-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Courier New', monospace;
  text-align: center;
  pointer-events: none;
}

.extraction-info .label {
  display: block;
  font-size: 0.75rem;
  color: #666;
}

.extraction-info .value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #ff0000;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}

.control-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: auto;
}

.rpm-display {
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.rpm-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
}

.rpm-unit {
  font-size: 0.875rem;
  color: #666;
}

.rpm-status {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2px;
}

.status-idle {
  color: #666;
  background: rgba(102, 102, 102, 0.1);
}

.status-normal {
  color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

.status-warning {
  color: #ffaa00;
  background: rgba(255, 170, 0, 0.1);
}

.status-danger {
  color: #ff0000;
  background: rgba(255, 0, 0, 0.2);
  animation: blink 0.5s ease-in-out infinite alternate;
}

@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0.5; }
}
</style>
