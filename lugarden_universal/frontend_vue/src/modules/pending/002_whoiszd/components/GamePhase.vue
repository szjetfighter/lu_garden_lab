<script setup lang="ts">
/**
 * 游戏主界面 - 诗歌展示与选择
 * 继承whoiszd-theme深色主题样式
 */

import { ref, onMounted } from 'vue'
import { useGameState } from '../composables/useGameState'

const emit = defineEmits<{
  (e: 'terminated', reason: 'consecutive' | 'rushed'): void
  (e: 'completed', stats: { yesCount: number; noCount: number; total: number }): void
}>()

const {
  currentPoem,
  progress,
  terminated,
  completed,
  answers,
  initGame,
  submitAnswer,
  nextPoem
} = useGameState()

// 反馈状态
const showFeedback = ref(false)
const lastAnswer = ref<'yes' | 'no' | null>(null)
const feedbackMessage = ref('')

// 猜急检测：记录最近点击「下一首」的时间戳
const nextClickTimestamps = ref<number[]>([])
const RUSHED_THRESHOLD = 4  // 4次点击（看了3首诗）
const RUSHED_WINDOW_MS = 6000  // 6秒窗口

onMounted(() => {
  initGame()
})

function handleChoice(answer: 'yes' | 'no') {
  lastAnswer.value = answer
  const result = submitAnswer(answer)
  
  if (result.isCorrect) {
    feedbackMessage.value = '嘿嘿，被你发现是我写的了'
  } else {
    feedbackMessage.value = '不是，这首诗是我写的'
  }
  
  showFeedback.value = true
  
  if (result.shouldTerminate) {
    // 延迟触发终止（连错惩罚）
    setTimeout(() => {
      emit('terminated', 'consecutive')
    }, 1500)
  }
}

function handleNext() {
  // 猜急检测
  const now = Date.now()
  nextClickTimestamps.value.push(now)
  // 只保留最近3次
  if (nextClickTimestamps.value.length > RUSHED_THRESHOLD) {
    nextClickTimestamps.value.shift()
  }
  // 检查最近3次是否在10秒内
  if (nextClickTimestamps.value.length >= RUSHED_THRESHOLD) {
    const oldest = nextClickTimestamps.value[0]
    if (now - oldest < RUSHED_WINDOW_MS) {
      // 猜急惩罚
      emit('terminated', 'rushed')
      return
    }
  }

  showFeedback.value = false
  lastAnswer.value = null
  feedbackMessage.value = ''
  
  nextPoem()
  
  if (completed.value) {
    emit('completed', {
      yesCount: answers.value.filter(a => a === 'yes').length,
      noCount: answers.value.filter(a => a === 'no').length,
      total: answers.value.length
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 头部：标题和进度 -->
    <header class="text-center py-8 animate-fadeInUp">
      <h1 class="text-3xl mb-2 tracking-wider text-zd-light">是 臧 棣 写 的 么</h1>
      <p class="text-zd-muted">({{ progress.current }}/{{ progress.total }})</p>
    </header>

    <!-- 诗歌展示区 -->
    <main class="flex justify-center px-6 pb-8">
      <div v-if="currentPoem" class="zd-card max-w-2xl w-full px-8 py-10 animate-fadeInUp animate-delay-100">
        <!-- 诗歌标题 -->
        <h2 class="text-xl text-zd-light text-center mb-8">
          {{ currentPoem.title }}
        </h2>
        
        <!-- 诗歌正文 -->
        <div class="space-y-2 text-center text-zd-text leading-relaxed mb-12">
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
          class="flex justify-center gap-6"
        >
          <button
            class="zd-btn-choice"
            @click="handleChoice('yes')"
          >
            是
          </button>
          <button
            class="zd-btn-choice"
            @click="handleChoice('no')"
          >
            不是
          </button>
        </div>

        <!-- 反馈区域 -->
        <div 
          v-else 
          class="text-center animate-fadeInUp"
        >
          <div class="mb-8">
            <p class="text-zd-light font-bold text-lg mb-2">陆家明</p>
            <p class="text-zd-text">
              {{ feedbackMessage }}
            </p>
          </div>
          
          <button
            v-if="!terminated"
            class="zd-btn-primary"
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
/* 继承whoiszd-theme的CSS变量 */

.zd-btn-choice {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  min-width: 100px;
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
  line-height: 1.25;
  font-weight: 500;
  color: var(--zd-text-light, #ffffff);
  background: rgba(55, 65, 81, 0.6);
  border: 1px solid var(--zd-border, rgba(55, 65, 81, 0.5));
  border-radius: var(--radius-lg, 12px);
  cursor: pointer;
  transition: all var(--duration-normal, 0.3s) var(--ease-out);
}

.zd-btn-choice:hover {
  background: rgba(75, 85, 99, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.zd-btn-choice:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
