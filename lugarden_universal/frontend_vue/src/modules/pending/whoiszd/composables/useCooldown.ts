/**
 * 冷却状态管理
 */

import { ref, computed } from 'vue'
import { 
  type CooldownState, 
  STORAGE_KEY_COOLDOWN, 
  COOLDOWN_DURATION_MS 
} from '../types/whoiszd'

export function useCooldown() {
  const kickedAt = ref<number | null>(null)
  const remainingSeconds = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  /** 检查是否在冷却期 */
  function checkCooldown(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY_COOLDOWN)
    if (!stored) {
      kickedAt.value = null
      return false
    }
    
    try {
      const state: CooldownState = JSON.parse(stored)
      const elapsed = Date.now() - state.kickedAt
      const remaining = Math.ceil((COOLDOWN_DURATION_MS - elapsed) / 1000)
      
      if (remaining <= 0) {
        clearCooldown()
        return false
      }
      
      kickedAt.value = state.kickedAt
      remainingSeconds.value = remaining
      return true
    } catch {
      clearCooldown()
      return false
    }
  }

  /** 设置冷却（被踢出时调用） */
  function setCooldown() {
    const state: CooldownState = {
      kickedAt: Date.now(),
      reason: 'consecutive'
    }
    localStorage.setItem(STORAGE_KEY_COOLDOWN, JSON.stringify(state))
    kickedAt.value = state.kickedAt
    remainingSeconds.value = Math.ceil(COOLDOWN_DURATION_MS / 1000)
  }

  /** 清除冷却 */
  function clearCooldown() {
    localStorage.removeItem(STORAGE_KEY_COOLDOWN)
    kickedAt.value = null
    remainingSeconds.value = 0
  }

  /** 开始倒计时（返回Promise，倒计时结束时resolve） */
  function startCountdown(): Promise<void> {
    return new Promise((resolve) => {
      if (timer) clearInterval(timer)
      
      timer = setInterval(() => {
        remainingSeconds.value--
        if (remainingSeconds.value <= 0) {
          if (timer) clearInterval(timer)
          clearCooldown()
          resolve()
        }
      }, 1000)
    })
  }

  /** 停止倒计时 */
  function stopCountdown() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const isInCooldown = computed(() => kickedAt.value !== null && remainingSeconds.value > 0)

  return {
    kickedAt,
    remainingSeconds,
    isInCooldown,
    checkCooldown,
    setCooldown,
    clearCooldown,
    startCountdown,
    stopCountdown
  }
}
