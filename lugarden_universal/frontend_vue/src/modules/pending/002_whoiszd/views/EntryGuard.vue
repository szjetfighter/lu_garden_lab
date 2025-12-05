<script setup lang="ts">
/**
 * 「谁是臧棣」入口守卫组件
 * 
 * 职责：
 * 1. 检测冷却状态
 * 2. 管理整个游戏流程（冷却 → 声明 → 确认 → 游戏 → 终止/结算）
 * 3. 作为深色主题容器，注入CSS变量覆盖
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useCooldown } from '../composables/useCooldown'
import { STORAGE_KEY_CONFIRMED } from '../types/whoiszd'
import ConfirmView from './ConfirmView.vue'
import GameView from './GameView.vue'
import TerminatedView from './TerminatedView.vue'
import ResultView from './ResultView.vue'

// 游戏阶段
type Phase = 'loading' | 'cooldown' | 'disclaimer' | 'confirm' | 'playing' | 'terminated' | 'result'

const phase = ref<Phase>('loading')

// 冷却状态管理
const { 
  remainingSeconds, 
  checkCooldown, 
  startCountdown, 
  stopCountdown 
} = useCooldown()

// 游戏统计数据（从 GameView 接收）
const gameStats = ref({ yesCount: 0, noCount: 0, total: 0 })

// 冷却页面逐行显示
const cooldownLine1 = ref(false)
const cooldownLine2 = ref(false)
const cooldownLine3 = ref(false)

function startCooldownAnimation() {
  cooldownLine1.value = false
  cooldownLine2.value = false
  cooldownLine3.value = false
  setTimeout(() => cooldownLine1.value = true, 100)
  setTimeout(() => cooldownLine2.value = true, 1100)
  setTimeout(() => cooldownLine3.value = true, 2100)
}

// 检查是否已确认过声明
function hasConfirmed(): boolean {
  return localStorage.getItem(STORAGE_KEY_CONFIRMED) === 'true'
}

// 保存确认状态
function saveConfirmed() {
  localStorage.setItem(STORAGE_KEY_CONFIRMED, 'true')
}

// 阶段流转
function goToConfirm() {
  // 如果已确认过，跳过confirm直接进游戏
  if (hasConfirmed()) {
    phase.value = 'playing'
  } else {
    phase.value = 'confirm'
  }
}

function goToGame() {
  // 保存确认状态
  saveConfirmed()
  phase.value = 'playing'
}

function handleTerminated() {
  phase.value = 'terminated'
}

function handleCompleted(stats: { yesCount: number; noCount: number; total: number }) {
  gameStats.value = stats
  phase.value = 'result'
}

function handleRestart() {
  // 已确认过，直接进游戏
  phase.value = 'playing'
}

onMounted(async () => {
  const inCooldown = checkCooldown()
  const confirmed = hasConfirmed()
  
  if (inCooldown) {
    phase.value = 'cooldown'
    startCooldownAnimation()
    await startCountdown()
    // 冷却结束后，已确认过的直接进游戏，否则显示disclaimer
    phase.value = confirmed ? 'playing' : 'disclaimer'
  } else {
    // 已确认过的直接进游戏，否则显示disclaimer
    phase.value = confirmed ? 'playing' : 'disclaimer'
  }
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <div class="whoiszd-theme min-h-screen">
    <!-- 加载中 -->
    <div v-if="phase === 'loading'" class="min-h-screen flex items-center justify-center">
      <p class="text-zd-muted">...</p>
    </div>

    <!-- 冷却期 -->
    <div v-else-if="phase === 'cooldown'" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md px-6">
        <p 
          class="text-xl mb-4 text-zd-light reveal-line"
          :class="{ 'revealed': cooldownLine1 }"
        >朋友，审美的事，急不来</p>
        <p 
          class="text-lg mb-8 text-zd-muted reveal-line"
          :class="{ 'revealed': cooldownLine2 }"
        >嘻嘻，你说呢？</p>
        <p 
          class="text-6xl font-mono text-zd-light reveal-line"
          :class="{ 'revealed': cooldownLine3 }"
        >{{ remainingSeconds }}</p>
      </div>
    </div>

    <!-- 第一层声明 -->
    <div v-else-if="phase === 'disclaimer'" class="min-h-screen flex items-center justify-center">
      <div class="zd-card text-center max-w-lg px-8 py-10 animate-fadeInUp">
        <div class="zd-icon-warning mb-6">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-zd-light mb-4">本模块内容可能具有冒犯性。</p>
        <p class="text-zd-text mb-8">
          如果您选择继续，即表示您同意<br/>承担被冒犯的可能。
        </p>
        <button class="zd-btn-primary" @click="goToConfirm">
          继续
        </button>
      </div>
    </div>

    <!-- 第二层确认 -->
    <ConfirmView 
      v-else-if="phase === 'confirm'" 
      @confirmed="goToGame" 
    />

    <!-- 游戏主界面 -->
    <GameView 
      v-else-if="phase === 'playing'"
      @terminated="handleTerminated"
      @completed="handleCompleted"
    />

    <!-- 惩罚/终止页 -->
    <TerminatedView v-else-if="phase === 'terminated'" />

    <!-- 结算揭示页 -->
    <ResultView 
      v-else-if="phase === 'result'"
      :yes-count="gameStats.yesCount"
      :no-count="gameStats.noCount"
      :total="gameStats.total"
      @restart="handleRestart"
    />
  </div>
</template>

<style scoped>
/* ================================
   深色主题容器 - CSS变量覆盖
   保持与全站设计系统的一致性
================================ */
.whoiszd-theme {
  /* 深色背景 */
  --zd-bg: #0a0a0a;
  --zd-bg-card: rgba(20, 20, 20, 0.95);
  --zd-bg-card-hover: rgba(30, 30, 30, 0.95);
  
  /* 文字颜色层级 */
  --zd-text-light: #ffffff;
  --zd-text: #d1d5db;
  --zd-text-muted: #6b7280;
  
  /* 主题强调色（琥珀色） */
  --zd-accent: #d97706;
  --zd-accent-hover: #f59e0b;
  --zd-accent-muted: #92400e;
  
  /* 状态色 */
  --zd-success: #10b981;
  --zd-error: #ef4444;
  
  /* 边框 */
  --zd-border: rgba(55, 65, 81, 0.5);
  --zd-border-accent: rgba(217, 119, 6, 0.3);
  
  /* 应用深色背景 */
  background-color: var(--zd-bg);
  color: var(--zd-text);
  font-family: var(--font-family-primary);
}

/* ================================
   深色主题卡片 - 基于unified-content-card
   使用:deep()穿透到子组件
================================ */
.whoiszd-theme :deep(.zd-card),
.zd-card {
  background: var(--zd-bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--zd-border);
  border-radius: var(--radius-lg);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all var(--duration-normal) var(--ease-out);
}

.whoiszd-theme :deep(.zd-card:hover),
.zd-card:hover {
  background: var(--zd-bg-card-hover);
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* ================================
   深色主题按钮 - 基于btn-primary
================================ */
.whoiszd-theme :deep(.zd-btn-primary),
.zd-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 120px;
  padding: 0.75rem 2rem;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--zd-text-light);
  background: linear-gradient(135deg, var(--zd-accent) 0%, var(--zd-accent-muted) 100%);
  border: 1px solid var(--zd-accent-muted);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.whoiszd-theme :deep(.zd-btn-primary:hover),
.zd-btn-primary:hover {
  background: linear-gradient(135deg, var(--zd-accent-hover) 0%, var(--zd-accent) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

.whoiszd-theme :deep(.zd-btn-primary:active),
.zd-btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
}

.whoiszd-theme :deep(.zd-btn-secondary),
.zd-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 100px;
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--zd-text);
  background: rgba(55, 65, 81, 0.6);
  border: 1px solid var(--zd-border);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.whoiszd-theme :deep(.zd-btn-secondary:hover),
.zd-btn-secondary:hover {
  background: rgba(75, 85, 99, 0.8);
  border-color: rgba(107, 114, 128, 0.6);
  transform: translateY(-1px);
}

/* ================================
   工具类 - 使用:deep()穿透到子组件
================================ */
.whoiszd-theme :deep(.text-zd-light) { color: var(--zd-text-light); }
.whoiszd-theme :deep(.text-zd-text) { color: var(--zd-text); }
.whoiszd-theme :deep(.text-zd-muted) { color: var(--zd-text-muted); }
.whoiszd-theme :deep(.text-zd-accent) { color: var(--zd-accent); }
.whoiszd-theme :deep(.text-zd-success) { color: var(--zd-success); }
.whoiszd-theme :deep(.text-zd-error) { color: var(--zd-error); }

/* 当前组件内的工具类 */
.text-zd-light { color: var(--zd-text-light); }
.text-zd-text { color: var(--zd-text); }
.text-zd-muted { color: var(--zd-text-muted); }
.text-zd-accent { color: var(--zd-accent); }
.text-zd-success { color: var(--zd-success); }
.text-zd-error { color: var(--zd-error); }

.zd-icon-warning {
  color: var(--zd-accent);
}

/* 逐行显示动画 */
.reveal-line {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.reveal-line.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ================================
   动画 - 复用全局animate-fadeInUp
================================ */
</style>
