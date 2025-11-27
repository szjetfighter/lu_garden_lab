<script setup lang="ts">
/**
 * 老虎机组件
 * 5x3符号矩阵 + 摸诗按钮
 */

import { computed } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'

const store = useMoshiStore()

// 默认符号（未开始时显示）
const defaultSymbols = [
  ['🌸', '🌸', '🌸'],
  ['🌸', '🌸', '🌸'],
  ['🌸', '🌸', '🌸'],
  ['🌸', '🌸', '🌸'],
  ['🌸', '🌸', '🌸']
]

const displayMatrix = computed(() => {
  if (!store.matrix) {
    return defaultSymbols
  }
  return store.matrix.map(col => col.map(s => s.emoji))
})

const winDetails = computed(() => store.lastResult?.winDetails || [])

function handleSpin() {
  store.spin()
}
</script>

<template>
  <div class="slot-machine">
    <!-- 标题 -->
    <div class="slot-header">
      <h2 class="slot-title">摸诗宇宙</h2>
      <p class="slot-subtitle">转动命运的轮盘，遇见属于你的诗节</p>
    </div>
    
    <!-- 矩阵区域 -->
    <div class="slot-matrix" :class="{ spinning: store.isSpinning, win: store.isWin }">
      <div 
        v-for="(col, colIdx) in displayMatrix" 
        :key="colIdx" 
        class="slot-column"
        :style="{ animationDelay: `${colIdx * 0.1}s` }"
      >
        <div 
          v-for="(symbol, rowIdx) in col" 
          :key="rowIdx" 
          class="slot-cell"
        >
          <span class="symbol">{{ symbol }}</span>
        </div>
      </div>
    </div>
    
    <!-- 中奖信息 -->
    <div v-if="winDetails.length > 0" class="win-info">
      <div v-for="detail in winDetails" :key="detail.symbolId" class="win-detail">
        <span class="win-symbol">{{ detail.symbol.emoji }}</span>
        <span class="win-text">{{ detail.symbol.name }} × {{ detail.columns }}</span>
      </div>
    </div>
    
    <!-- 摸诗按钮 -->
    <button 
      class="spin-button"
      :disabled="store.isSpinning"
      @click="handleSpin"
    >
      <span v-if="store.isSpinning">转动中...</span>
      <span v-else>摸 诗</span>
    </button>
    
    <!-- 统计信息 -->
    <div class="stats">
      <span>摸诗 {{ store.spinCount }} 次</span>
      <span class="divider">|</span>
      <span>中奖 {{ store.winCount }} 次</span>
      <span class="divider">|</span>
      <span>中奖率 {{ store.winRate }}%</span>
    </div>
  </div>
</template>

<style scoped>
.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.slot-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.slot-title {
  font-size: 2rem;
  font-weight: bold;
  color: #f8d56b;
  margin: 0;
  text-shadow: 0 2px 10px rgba(248, 213, 107, 0.3);
}

.slot-subtitle {
  color: #a0a0b0;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.slot-matrix {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
  border-radius: 0.75rem;
  border: 2px solid #333;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
}

.slot-matrix.win {
  border-color: #f8d56b;
  box-shadow: 
    inset 0 2px 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(248, 213, 107, 0.3);
}

.slot-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slot-matrix.spinning .slot-column {
  animation: spin 0.3s ease-in-out infinite;
}

@keyframes spin {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.slot-cell {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #2a2a4a 0%, #1a1a3a 100%);
  border-radius: 0.5rem;
  border: 1px solid #444;
}

.symbol {
  font-size: 2rem;
}

.win-info {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba(248, 213, 107, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(248, 213, 107, 0.3);
}

.win-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.win-symbol {
  font-size: 1.5rem;
}

.win-text {
  color: #f8d56b;
  font-weight: 500;
}

.spin-button {
  margin-top: 1.5rem;
  padding: 1rem 3rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a1a2e;
  background: linear-gradient(180deg, #f8d56b 0%, #e6c35a 100%);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(248, 213, 107, 0.3);
}

.spin-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 213, 107, 0.4);
}

.spin-button:active:not(:disabled) {
  transform: translateY(0);
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats {
  margin-top: 1rem;
  color: #666;
  font-size: 0.85rem;
}

.divider {
  margin: 0 0.5rem;
  opacity: 0.5;
}
</style>
