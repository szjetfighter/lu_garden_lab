<script setup lang="ts">
/**
 * 游戏主界面 - 诗歌展示与选择
 */

import { ref, onMounted } from 'vue'
import { useGameState } from '../composables/useGameState'

const emit = defineEmits<{
  (e: 'terminated'): void
  (e: 'completed'): void
}>()

const {
  currentPoem,
  progress,
  terminated,
  completed,
  initGame,
  submitAnswer,
  nextPoem
} = useGameState()

// 反馈状态
const showFeedback = ref(false)
const lastAnswer = ref<'yes' | 'no' | null>(null)
const feedbackMessage = ref('')

onMounted(() => {
  initGame()
})

function handleChoice(answer: 'yes' | 'no') {
  lastAnswer.value = answer
  const result = submitAnswer(answer)
  
  if (result.isCorrect) {
    feedbackMessage.value = '正确。这首诗由AI生成。'
  } else {
    feedbackMessage.value = '不是。这首诗由AI生成。'
  }
  
  showFeedback.value = true
  
  if (result.shouldTerminate) {
    // 延迟触发终止
    setTimeout(() => {
      emit('terminated')
    }, 1500)
  }
}

function handleNext() {
  showFeedback.value = false
  lastAnswer.value = null
  feedbackMessage.value = ''
  
  nextPoem()
  
  if (completed.value) {
    emit('completed')
  }
}
</script>

<template>
  <div class="game-view min-h-screen bg-black text-white flex flex-col">
    <!-- 头部：标题和进度 -->
    <header class="text-center py-8">
      <h1 class="text-3xl mb-2 tracking-wider">谁 是 臧 棣 ？</h1>
      <p class="text-gray-500">({{ progress.current }}/{{ progress.total }})</p>
    </header>

    <!-- 诗歌展示区 -->
    <main class="flex-1 flex items-center justify-center px-6 pb-8">
      <div v-if="currentPoem" class="max-w-2xl w-full">
        <!-- 诗歌标题 -->
        <h2 class="text-xl text-amber-400 text-center mb-8">
          《{{ currentPoem.title }}》
        </h2>
        
        <!-- 诗歌正文 -->
        <div class="space-y-2 text-center text-gray-300 leading-relaxed mb-12">
          <p 
            v-for="(line, index) in currentPoem.body" 
            :key="index"
            :class="line === '' ? 'h-4' : ''"
          >
            {{ line }}
          </p>
        </div>

        <!-- 选择按钮 -->
        <div 
          v-if="!showFeedback" 
          class="flex justify-center gap-8"
        >
          <button
            class="px-12 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-lg transition-colors"
            @click="handleChoice('yes')"
          >
            是
          </button>
          <button
            class="px-12 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-lg transition-colors"
            @click="handleChoice('no')"
          >
            不是
          </button>
        </div>

        <!-- 反馈区域 -->
        <div 
          v-else 
          class="text-center"
        >
          <p 
            :class="[
              'text-xl mb-8',
              lastAnswer === 'no' ? 'text-green-400' : 'text-red-400'
            ]"
          >
            「{{ feedbackMessage }}」
          </p>
          
          <button
            v-if="!terminated"
            class="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
            @click="handleNext"
          >
            下一首
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.game-view {
  font-family: 'Noto Serif SC', serif;
}
</style>
