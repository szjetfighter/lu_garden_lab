<script setup lang="ts">
/**
 * 「谁是臧棣」入口守卫组件
 * 
 * 职责：
 * 1. 检测冷却状态
 * 2. 管理整个游戏流程（冷却 → 声明 → 确认 → 游戏 → 终止/结算）
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useCooldown } from '../composables/useCooldown'
import { useGameState } from '../composables/useGameState'
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

// 游戏状态管理
const { stats } = useGameState()

// 阶段流转
function goToConfirm() {
  phase.value = 'confirm'
}

function goToGame() {
  phase.value = 'playing'
}

function handleTerminated() {
  phase.value = 'terminated'
}

function handleCompleted() {
  phase.value = 'result'
}

function handleRestart() {
  phase.value = 'disclaimer'
}

onMounted(async () => {
  const inCooldown = checkCooldown()
  if (inCooldown) {
    phase.value = 'cooldown'
    await startCountdown()
    phase.value = 'disclaimer'
  } else {
    phase.value = 'disclaimer'
  }
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <div class="whoiszd-entry min-h-screen bg-black text-white">
    <!-- 加载中 -->
    <div v-if="phase === 'loading'" class="min-h-screen flex items-center justify-center">
      <p class="text-gray-400">...</p>
    </div>

    <!-- 冷却期 -->
    <div v-else-if="phase === 'cooldown'" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md px-6">
        <p class="text-xl mb-4 text-gray-300">朋友，审美的事，急不来</p>
        <p class="text-lg mb-8 text-gray-400">嘻嘻，你说呢？</p>
        <p class="text-6xl font-mono text-white">{{ remainingSeconds }}</p>
      </div>
    </div>

    <!-- 第一层声明 -->
    <div v-else-if="phase === 'disclaimer'" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-lg px-6">
        <h1 class="text-2xl mb-8 text-amber-400">⚠️</h1>
        <p class="text-gray-300 mb-4">本模块内容可能具有冒犯性。</p>
        <p class="text-gray-300 mb-8">
          如果您选择继续，即表示您同意<br/>承担被冒犯的可能。
        </p>
        <button 
          class="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
          @click="goToConfirm"
        >
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
      :yes-count="stats.yesCount"
      :no-count="stats.noCount"
      :total="stats.total"
      @restart="handleRestart"
    />
  </div>
</template>

<style scoped>
.whoiszd-entry {
  font-family: 'Noto Serif SC', serif;
}
</style>
