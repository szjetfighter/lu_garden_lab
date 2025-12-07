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
        <h1 class="text-3xl font-bold tracking-widest text-gray-100 mb-2">毒理报告</h1>
        <button class="author-link" @click="isAboutOpen = true">About 冯铗</button>
      </div>

      <!-- 作者简介弹窗 -->
      <AboutAuthor :is-open="isAboutOpen" @close="isAboutOpen = false" />

      <!-- 3D场景容器 -->
      <div class="scene-container animate-fadeInUp" style="animation-delay: 0.1s;">
        <ToxicologyScene 
          :key="sceneKey"
          ref="sceneRef"
          :rpm="currentRpm"
          :is-meltdown="isMeltdownPhase"
          @open-report="isReportOpen = true"
        />
        
        <!-- RPM 进度条 -->
        <div 
          v-if="!isFinished" 
          class="rpm-progress-bar"
          :class="{ 
            shaking: isMeltdownPhase && meltdownProgress < 0.4,
            dissolving: isMeltdownPhase && meltdownProgress >= 0.4
          }"
          :style="isMeltdownPhase && meltdownProgress >= 0.4 ? {
            opacity: Math.max(0, 1 - (meltdownProgress - 0.4) / 0.3),
            transform: `translateX(-50%) scale(${1 - (meltdownProgress - 0.4) * 0.5})`
          } : {}"
        >
          <div class="rpm-track">
            <div class="rpm-fill" :style="{ width: (currentRpm / 9000 * 100) + '%' }"></div>
          </div>
          <div class="rpm-ticks">
            <span v-for="n in 10" :key="n" class="tick" :class="{ active: currentRpm >= (n - 1) * 1000 }">
              <span class="tick-value">{{ (n - 1) * 1000 }}</span>
              <span class="tick-unit">RPM</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-section animate-fadeInUp" style="animation-delay: 0.2s;">
        <div class="control-panel-simple">
          <!-- 结束后显示重新开始 -->
          <button 
            v-if="isFinished"
            class="restart-btn"
            @click="restart"
          >
            重新开始
          </button>
          <!-- 正常/崩解中显示加速（崩解中禁用） -->
          <button 
            v-else
            class="accelerate-btn"
            :style="accelerateBtnStyle"
            :disabled="isMeltdownPhase"
            @mousedown="startAccelerate"
            @mouseup="stopAccelerate"
            @mouseleave="stopAccelerate"
            @touchstart.prevent="startAccelerate"
            @touchend.prevent="stopAccelerate"
          >
            {{ isMeltdownPhase ? '失控中...' : '加速' }}
          </button>
        </div>
      </div>

      <!-- 医疗警告（熔断时显示） -->
      <ClinicalMonitor 
        v-if="isMeltdown" 
        @dismiss="isMeltdown = false"
      />

      <!-- 毒理报告弹窗 -->
      <ToxicologyReportModal 
        :is-open="isReportOpen"
        :poem-title="sceneRef?.currentPoemTitle"
        @close="isReportOpen = false"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ClinicalMonitor from '../components/ClinicalMonitor.vue'
import ToxicologyScene from '../components/ToxicologyScene.vue'
import AboutAuthor from '../components/AboutAuthor.vue'
import ToxicologyReportModal from '../components/ToxicologyReportModal.vue'
import BackButton from '@/shared/components/BackButton.vue'

const router = useRouter()

// 状态
const sceneRef = ref<InstanceType<typeof ToxicologyScene> | null>(null)
const currentRpm = ref(0)
const isMeltdown = ref(false)
const isAboutOpen = ref(false)
const isMeltdownPhase = ref(false)  // 崩解阶段
const isFinished = ref(false)  // 结束状态
const sceneKey = ref(0)  // 用于重新加载场景
const meltdownProgress = ref(0)  // 崩解进度 0→1
const showReportButton = ref(false)  // 显示查看报告按钮
const isReportOpen = ref(false)  // 报告弹窗
let meltdownStartTime = 0

// 加速控制
let accelerateInterval: number | null = null
const isAccelerating = ref(false)

const startAccelerate = () => {
  if (isMeltdownPhase.value || isFinished.value) return  // 崩解中禁止操作
  
  isAccelerating.value = true
  accelerateInterval = window.setInterval(() => {
    if (currentRpm.value < 9000) {
      currentRpm.value = Math.min(9000, currentRpm.value + 100)
    } else if (!isMeltdownPhase.value) {
      // 达到9000，触发崩解
      triggerMeltdown()
    }
  }, 50)
}

const stopAccelerate = () => {
  if (isMeltdownPhase.value) return  // 崩解中禁止操作
  
  isAccelerating.value = false
  if (accelerateInterval) {
    clearInterval(accelerateInterval)
    accelerateInterval = null
  }
  // 自然减速
  const decelerate = () => {
    if (currentRpm.value > 0 && !isAccelerating.value && !isMeltdownPhase.value) {
      currentRpm.value = Math.max(0, currentRpm.value - 50)
      requestAnimationFrame(decelerate)
    }
  }
  decelerate()
}

// 触发崩解
const triggerMeltdown = () => {
  isMeltdownPhase.value = true
  isAccelerating.value = false
  meltdownProgress.value = 0
  meltdownStartTime = performance.now()
  
  if (accelerateInterval) {
    clearInterval(accelerateInterval)
    accelerateInterval = null
  }
  
  // 通知场景开始崩解
  if (sceneRef.value) {
    sceneRef.value.startMeltdown()
  }
  
  // 更新进度
  const updateProgress = () => {
    const elapsed = (performance.now() - meltdownStartTime) / 1000
    meltdownProgress.value = Math.min(1, elapsed / 5)  // 5秒
    
    if (meltdownProgress.value < 1) {
      requestAnimationFrame(updateProgress)
    } else {
      isMeltdownPhase.value = false
      isFinished.value = true
      // 1秒后显示查看报告按钮
      setTimeout(() => {
        showReportButton.value = true
      }, 1000)
    }
  }
  requestAnimationFrame(updateProgress)
}

// 重新开始
const restart = () => {
  isFinished.value = false
  currentRpm.value = 0
  showReportButton.value = false
  isReportOpen.value = false
  sceneKey.value++  // 触发场景重新加载
}

// 按钮颜色（黑色到暗红色）
const accelerateBtnStyle = computed(() => {
  const ratio = currentRpm.value / 9000
  const r = Math.floor(30 + ratio * 120)  // 30 -> 150
  const g = Math.floor(30 - ratio * 20)   // 30 -> 10
  const b = Math.floor(30 - ratio * 20)   // 30 -> 10
  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    borderColor: `rgb(${r + 30}, ${g + 10}, ${b + 10})`
  }
})

// 重置实验
const resetExperiment = () => {
  currentRpm.value = 0
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

.control-panel-simple {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.accelerate-btn {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  background: rgb(30, 30, 30);
  border: 2px solid rgb(60, 40, 40);
  color: #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  -webkit-user-select: none;
}

.accelerate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(150, 30, 30, 0.3);
}

.accelerate-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(150, 30, 30, 0.4);
}

.accelerate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  animation: pulse 0.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.5; }
  to { opacity: 0.9; }
}

.restart-btn {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  background: #1a1a1a;
  border: 2px solid #22c55e;
  color: #22c55e;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restart-btn:hover {
  background: #22c55e;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* RPM 进度条 */
.rpm-progress-bar {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
}

.rpm-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.rpm-fill {
  height: 100%;
  background: linear-gradient(90deg, #333 0%, #661111 50%, #aa2222 100%);
  border-radius: 3px;
  transition: width 0.1s ease;
}

.rpm-ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 2px;
}

.rpm-ticks .tick {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Courier New', monospace;
  color: #444;
  transition: color 0.2s;
}

.rpm-ticks .tick.active {
  color: #aa4444;
}

.tick-value {
  font-size: 0.6rem;
  font-weight: 600;
  line-height: 1.2;
}

.tick-unit {
  font-size: 0.4rem;
  opacity: 0.7;
}

/* 震动动画 */
.rpm-progress-bar.shaking {
  animation: shake 0.1s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(-50%) translate(0, 0); }
  25% { transform: translateX(-50%) translate(-3px, 1px); }
  50% { transform: translateX(-50%) translate(2px, -1px); }
  75% { transform: translateX(-50%) translate(-1px, 2px); }
}

/* 查看报告按钮 */
.view-report-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  font-weight: 400;
  padding: 1rem 2rem;
  background: rgba(30, 30, 35, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.2em;
  transition: all 0.3s ease;
  animation: btnBreathe 3s ease-in-out infinite;
}

@keyframes btnBreathe {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 1;
  }
}

.view-report-btn:hover {
  background: rgba(50, 50, 55, 0.8);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%) scale(1.02);
}

/* 渐入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
