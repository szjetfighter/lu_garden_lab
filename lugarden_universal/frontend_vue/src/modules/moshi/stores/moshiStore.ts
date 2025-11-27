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
  const pendingWin = ref(false) // A.4: 暂存中奖状态
  
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
      // A.4: 暂存中奖状态，不立即更新统计
      pendingWin.value = result.win
    } catch (e) {
      error.value = e instanceof Error ? e.message : '摸诗失败'
      console.error('[MoshiStore] spin error:', e)
    } finally {
      isSpinning.value = false
    }
  }
  
  // A.4: 动画结束后调用，更新统计
  function commitStats() {
    spinCount.value++
    if (pendingWin.value) {
      winCount.value++
    }
    pendingWin.value = false
  }
  
  function reset() {
    matrix.value = null
    lastResult.value = null
    spinCount.value = 0
    winCount.value = 0
    pendingWin.value = false
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
    commitStats,
    reset
  }
})
