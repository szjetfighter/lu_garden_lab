/**
 * 游戏状态管理（内存中，不持久化）
 */

import { ref, computed } from 'vue'
import { 
  type UserGameState, 
  type ZangdiPoem,
  CONSECUTIVE_LIMIT, 
  TOTAL_POEMS 
} from '../types/whoiszd'
import poemsData from '../data/poems.json'

export function useGameState() {
  // 游戏状态
  const currentIndex = ref(0)
  const answers = ref<('yes' | 'no')[]>([])
  const consecutiveYesCount = ref(0)
  const terminated = ref(false)
  const completed = ref(false)
  const shuffleOrder = ref<number[]>([])

  // 诗歌数据
  const poems = ref<ZangdiPoem[]>(poemsData.poems as ZangdiPoem[])
  const totalPoems = computed(() => Math.min(poems.value.length, TOTAL_POEMS))

  /** 初始化/重置游戏 */
  function initGame() {
    currentIndex.value = 0
    answers.value = []
    consecutiveYesCount.value = 0
    terminated.value = false
    completed.value = false
    
    // 从所有诗中随机抽取TOTAL_POEMS首
    const allIndices = Array.from({ length: poems.value.length }, (_, i) => i)
    const shuffled = shuffleArray(allIndices)
    shuffleOrder.value = shuffled.slice(0, totalPoems.value)
  }

  /** Fisher-Yates 洗牌算法 */
  function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  /** 获取当前诗歌 */
  const currentPoem = computed<ZangdiPoem | null>(() => {
    if (currentIndex.value >= totalPoems.value) return null
    const poemIndex = shuffleOrder.value[currentIndex.value]
    return poems.value[poemIndex] || null
  })

  /** 提交答案 */
  function submitAnswer(answer: 'yes' | 'no'): { 
    isCorrect: boolean
    shouldTerminate: boolean 
  } {
    answers.value.push(answer)
    
    if (answer === 'yes') {
      // 选"是"是错误的（因为全是AI生成的）
      consecutiveYesCount.value++
      
      if (consecutiveYesCount.value >= CONSECUTIVE_LIMIT) {
        terminated.value = true
        return { isCorrect: false, shouldTerminate: true }
      }
      
      return { isCorrect: false, shouldTerminate: false }
    } else {
      // 选"不是"是正确的
      consecutiveYesCount.value = 0
      return { isCorrect: true, shouldTerminate: false }
    }
  }

  /** 进入下一首 */
  function nextPoem() {
    if (currentIndex.value < totalPoems.value - 1) {
      currentIndex.value++
    } else {
      completed.value = true
    }
  }

  /** 统计数据 */
  const stats = computed(() => {
    const yesCount = answers.value.filter(a => a === 'yes').length
    const noCount = answers.value.filter(a => a === 'no').length
    return {
      total: answers.value.length,
      yesCount,
      noCount,
      yesPercentage: answers.value.length > 0 
        ? Math.round((yesCount / answers.value.length) * 100) 
        : 0
    }
  })

  /** 进度信息 */
  const progress = computed(() => ({
    current: currentIndex.value + 1,
    total: totalPoems.value
  }))

  return {
    // 状态
    currentIndex,
    answers,
    consecutiveYesCount,
    terminated,
    completed,
    shuffleOrder,
    
    // 计算属性
    currentPoem,
    totalPoems,
    stats,
    progress,
    
    // 方法
    initGame,
    submitAnswer,
    nextPoem
  }
}
