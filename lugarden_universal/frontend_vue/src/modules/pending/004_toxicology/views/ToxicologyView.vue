<template>
  <div class="toxicology-view">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <BackButton 
          text="返回"
          variant="ghost"
          size="medium"
          :hover-animation="true"
          @click="goBack"
          class="dark-back-btn"
        />
      </div>

      <!-- 标题区 -->
      <div class="header-section text-center mb-6 animate-fadeInUp">
        <h1 class="text-3xl font-bold tracking-widest text-gray-100 mb-2">毒理学报告</h1>
        <button class="author-link" @click="isAboutOpen = true">About 冯铗</button>
      </div>

      <!-- 作者简介弹窗 -->
      <AboutAuthor :is-open="isAboutOpen" @close="isAboutOpen = false" />

      <!-- 3D场景容器 -->
      <div class="scene-container animate-fadeInUp" style="animation-delay: 0.1s;">
        <ToxicologyScene 
          ref="sceneRef"
          :rpm="currentRpm"
        />
        
        <!-- 提取率显示（覆盖在场景上） -->
        <div class="extraction-overlay" v-if="currentRpm > 0">
          <span class="label">提取率:</span>
          <span class="value">{{ extractionRate.toFixed(1) }}%</span>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-section animate-fadeInUp" style="animation-delay: 0.2s;">
        <div class="control-panel">
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
          <button class="reset-btn" @click="resetExperiment">重置实验</button>
        </div>
      </div>

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
import AboutAuthor from '../components/AboutAuthor.vue'
import BackButton from '@/shared/components/BackButton.vue'

const router = useRouter()

// 状态
const sceneRef = ref<InstanceType<typeof ToxicologyScene> | null>(null)
const currentRpm = ref(0)
const isMeltdown = ref(false)
const extractionRate = ref(0)
const isAboutOpen = ref(false)

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
.toxicology-view {
  min-height: 100vh;
  background: #0a0a0a;
}

/* 深色主题返回按钮 */
.dark-back-btn {
  color: #888 !important;
  background: transparent !important;
}

.dark-back-btn:hover {
  color: #fff !important;
  background: transparent !important;
}

.scene-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  
  /* 深色卡片样式 */
  background: #111;
  border: 1px solid #333;
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all var(--duration-normal, 0.3s) ease-out;
}

.scene-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
}

.extraction-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-family: 'Courier New', monospace;
  text-align: right;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

.extraction-overlay .label {
  font-size: 0.625rem;
  color: #999;
}

.extraction-overlay .value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff4444;
}

.control-section {
  max-width: 600px;
  margin: var(--spacing-lg, 1.5rem) auto 0;
}

.control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #111;
  border: 1px solid #333;
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.rpm-display {
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.rpm-value {
  font-size: 2rem;
  font-weight: 700;
  color: #22c55e;
}

.rpm-unit {
  font-size: 0.875rem;
  color: #888;
}

.rpm-status {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.status-idle {
  color: #666;
  background: rgba(102, 102, 102, 0.1);
}

.status-normal {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.status-warning {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.status-danger {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  animation: blink 0.5s ease-in-out infinite alternate;
}

.reset-btn {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #444;
  color: #888;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #666;
  color: #ccc;
}

.author-link {
  display: inline-block;
  margin-top: var(--spacing-sm, 0.5rem);
  font-size: 0.75rem;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.author-link:hover {
  color: #22c55e;
}

@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0.5; }
}
</style>
