/**
 * 摸诗状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SpinResult, MoshiSymbol } from '../types/moshi'
import { moshiApi } from '../services/moshiApi'

export const useMoshiStore = defineStore('moshi', () => {
  // 状态
  const isSpinning = ref(false)
  const matrix = ref<MoshiSymbol[][] | null>(null)
  const lastResult = ref<SpinResult | null>(null)
  const spinCount = ref(0)
  const winCount = ref(0)
  const error = ref<string | null>(null)
  
  // 计算属性
  const winRate = computed(() => {
    if (spinCount.value === 0) return 0
    return Math.round((winCount.value / spinCount.value) * 100)
  })
  
  const currentStanza = computed(() => lastResult.value?.stanza || null)
  const isWin = computed(() => lastResult.value?.win || false)
  
  // 动作
  async function spin() {
    if (isSpinning.value) return
    
    isSpinning.value = true
    error.value = null
    
    try {
      const result = await moshiApi.spin()
      
      matrix.value = result.matrix
      lastResult.value = result
      spinCount.value++
      
      if (result.win) {
        winCount.value++
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '摸诗失败'
      console.error('[MoshiStore] spin error:', e)
    } finally {
      isSpinning.value = false
    }
  }
  
  function reset() {
    matrix.value = null
    lastResult.value = null
    spinCount.value = 0
    winCount.value = 0
    error.value = null
  }
  
  return {
    // 状态
    isSpinning,
    matrix,
    lastResult,
    spinCount,
    winCount,
    error,
    // 计算属性
    winRate,
    currentStanza,
    isWin,
    // 动作
    spin,
    reset
  }
})
