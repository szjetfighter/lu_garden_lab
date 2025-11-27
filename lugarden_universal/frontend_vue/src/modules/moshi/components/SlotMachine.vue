<script setup lang="ts">
/**
 * 老虎机组件
 * 5x3符号矩阵 + 摸诗按钮 + 列滚动动画
 */

import { computed, ref, onMounted } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'
import { moshiApi } from '../services/moshiApi'
import type { MoshiSymbol } from '../types/moshi'

const store = useMoshiStore()

// 事件
const emit = defineEmits<{
  showWin: []
  claimPrize: []
}>()

// 从API获取的符号列表
const symbols = ref<MoshiSymbol[]>([])

// 获取滚动时显示的符号对象列表
const spinningDisplaySymbols = computed(() => {
  if (symbols.value.length === 0) {
    // fallback：还没加载时用默认
    return [{ id: 'wild', emoji: '🌸', image: null }] as MoshiSymbol[]
  }
  return symbols.value
})

// 初始化时获取符号配置
onMounted(async () => {
  try {
    symbols.value = await moshiApi.getSymbols()
  } catch (e) {
    console.error('[SlotMachine] 获取符号配置失败:', e)
  }
})

// 每列状态: 'idle' | 'spinning' | 'stopped'
const columnStates = ref<string[]>(['idle', 'idle', 'idle', 'idle', 'idle'])

// 动画进行中标志（独立于API状态）
const isAnimating = ref(false)

// 滚动中显示的随机符号对象（每列12个符号用于滚动效果）
const spinningSymbols = ref<MoshiSymbol[][]>([[], [], [], [], []])

// 生成随机滚动符号对象
function generateSpinningSymbols(): MoshiSymbol[][] {
  const displayList = spinningDisplaySymbols.value
  return Array(5).fill(null).map(() => 
    Array(12).fill(null).map(() => 
      displayList[Math.floor(Math.random() * displayList.length)]
    )
  )
}

// 默认符号对象（未开始时显示陆家明图标）
const defaultSymbol: { id: string; name: string; poeticName: string; emoji: null; image: string; type: 'wild' } = {
  id: 'wild',
  name: '陆',
  poeticName: '陆',
  emoji: null,
  image: '/lujiaming_icon.png',
  type: 'wild'
}
const defaultSymbols = [
  [defaultSymbol, defaultSymbol, defaultSymbol],
  [defaultSymbol, defaultSymbol, defaultSymbol],
  [defaultSymbol, defaultSymbol, defaultSymbol],
  [defaultSymbol, defaultSymbol, defaultSymbol],
  [defaultSymbol, defaultSymbol, defaultSymbol]
]

// 最终显示的矩阵（返回完整symbol对象）
const displayMatrix = computed(() => {
  if (!store.matrix) {
    return defaultSymbols
  }
  return store.matrix
})

const primaryWinDetail = computed(() => store.lastResult?.primaryWinDetail || null)
const primaryWinningCells = computed(() => store.lastResult?.primaryWinningCells || [])

// 判断某个格子是否中奖（只高亮primarySymbol的格子）
function isWinningCell(colIdx: number, rowIdx: number) {
  return primaryWinningCells.value.some(([col, row]: [number, number]) => col === colIdx && row === rowIdx)
}

// 判断某列是否应该显示最终结果
function _shouldShowResult(colIdx: number) {
  return columnStates.value[colIdx] === 'stopped' || columnStates.value[colIdx] === 'idle'
}

// 获取某列的滚动符号
function getSpinningColumn(colIdx: number) {
  return spinningSymbols.value[colIdx] || []
}

async function handleSpin() {
  // 使用本地动画状态，而非API状态
  if (isAnimating.value) return
  
  isAnimating.value = true
  
  // 1. 生成滚动符号
  spinningSymbols.value = generateSpinningSymbols()
  
  // 2. 所有列开始滚动
  columnStates.value = ['spinning', 'spinning', 'spinning', 'spinning', 'spinning']
  
  // 3. 记录开始时间，确保最小滚动时间
  const spinStartTime = Date.now()
  const MIN_SPIN_DURATION = 1000 // 最小滚动1秒
  
  // 4. 调用API获取结果
  await store.spin()
  
  // 5. 计算还需要等待多久才能开始停止
  const elapsed = Date.now() - spinStartTime
  const remainingWait = Math.max(0, MIN_SPIN_DURATION - elapsed)
  
  // 6. 等待后依次停止每列（间隔250ms）
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        columnStates.value[i] = 'stopped'
        columnStates.value = [...columnStates.value]
      }, i * 250)
    }
    
    // 7. 全部停止后重置为idle，并解除动画锁
    setTimeout(() => {
      columnStates.value = ['idle', 'idle', 'idle', 'idle', 'idle']
      isAnimating.value = false
      // 8. 如果中奖，通知父组件显示弹窗
      if (store.lastResult?.primaryWinDetail) {
        emit('showWin')
      }
    }, 5 * 250 + 500)
  }, remainingWait)
}
</script>

<template>
  <div class="slot-machine">
    <!-- 标题 -->
    <div class="slot-header">
      <h2 class="slot-title">摸诗</h2>
      <p class="slot-subtitle">COME ON！让我康康你的手气 👀</p>
    </div>
    
    <!-- 矩阵区域 -->
    <div class="slot-matrix" :class="{ win: store.isWin }">
      <div 
        v-for="(col, colIdx) in 5" 
        :key="colIdx" 
        class="slot-column"
        :class="{ 
          spinning: columnStates[colIdx] === 'spinning',
          stopped: columnStates[colIdx] === 'stopped',
          [`col-${colIdx}`]: columnStates[colIdx] === 'spinning'
        }"
      >
        <!-- 滚动中：显示滚动条带 -->
        <div v-if="columnStates[colIdx] === 'spinning'" class="spin-strip">
          <div 
            v-for="(symbol, idx) in getSpinningColumn(colIdx)" 
            :key="idx" 
            class="slot-cell"
          >
            <img v-if="symbol.image" :src="symbol.image" class="symbol-image" :alt="symbol.name || ''" />
            <span v-else class="symbol">{{ symbol.emoji }}</span>
          </div>
        </div>
        <!-- 停止后：显示最终结果 -->
        <template v-else>
          <div 
            v-for="(symbol, rowIdx) in displayMatrix[colIdx]" 
            :key="rowIdx" 
            class="slot-cell"
            :class="{ winning: isWinningCell(colIdx, rowIdx) && columnStates[colIdx] === 'idle' }"
          >
            <img v-if="symbol.image" :src="symbol.image" class="symbol-image" alt="陆" />
            <span v-else class="symbol">{{ symbol.emoji }}</span>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 摸诗按钮 -->
    <button 
      class="spin-button"
      :disabled="isAnimating"
      @click="handleSpin"
    >
      <span v-if="isAnimating">转动中...</span>
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
  width: calc(100% - 2rem);
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: var(--radius-base, 1rem);
  box-shadow: var(--shadow-card, 0 4px 20px rgba(0, 0, 0, 0.08));
}

.slot-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.slot-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1a1a2e;
  margin: 0;
}

.slot-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.slot-matrix {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.75rem;
  border: 3px solid #b8860b;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(184, 134, 11, 0.2);
}

.slot-matrix.win {
  border-color: #f8d56b;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.05),
    0 0 25px rgba(248, 213, 107, 0.5),
    0 0 40px rgba(248, 213, 107, 0.3);
}

.slot-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  height: calc(60px * 3 + 0.5rem * 2); /* 3个格子高度 + 间隙 */
  overflow: hidden;
  border-radius: 0.5rem;
  transition: box-shadow 0.3s ease;
}

/* A.3.4: 多色动态列边框发光 - 5列5色 */
.slot-column.spinning.col-0 {
  animation: glow-pulse-gold 0.8s ease-in-out infinite;
}
.slot-column.spinning.col-1 {
  animation: glow-pulse-cyan 0.8s ease-in-out infinite 0.1s;
}
.slot-column.spinning.col-2 {
  animation: glow-pulse-pink 0.8s ease-in-out infinite 0.2s;
}
.slot-column.spinning.col-3 {
  animation: glow-pulse-purple 0.8s ease-in-out infinite 0.3s;
}
.slot-column.spinning.col-4 {
  animation: glow-pulse-orange 0.8s ease-in-out infinite 0.4s;
}

@keyframes glow-pulse-gold {
  0%, 100% { box-shadow: 0 0 8px rgba(248, 213, 107, 0.4), inset 0 0 4px rgba(248, 213, 107, 0.2); }
  50% { box-shadow: 0 0 20px rgba(248, 213, 107, 0.8), 0 0 30px rgba(248, 213, 107, 0.4), inset 0 0 8px rgba(248, 213, 107, 0.3); }
}
@keyframes glow-pulse-cyan {
  0%, 100% { box-shadow: 0 0 8px rgba(34, 211, 238, 0.4), inset 0 0 4px rgba(34, 211, 238, 0.2); }
  50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.4), inset 0 0 8px rgba(34, 211, 238, 0.3); }
}
@keyframes glow-pulse-pink {
  0%, 100% { box-shadow: 0 0 8px rgba(244, 114, 182, 0.4), inset 0 0 4px rgba(244, 114, 182, 0.2); }
  50% { box-shadow: 0 0 20px rgba(244, 114, 182, 0.8), 0 0 30px rgba(244, 114, 182, 0.4), inset 0 0 8px rgba(244, 114, 182, 0.3); }
}
@keyframes glow-pulse-purple {
  0%, 100% { box-shadow: 0 0 8px rgba(168, 85, 247, 0.4), inset 0 0 4px rgba(168, 85, 247, 0.2); }
  50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.4), inset 0 0 8px rgba(168, 85, 247, 0.3); }
}
@keyframes glow-pulse-orange {
  0%, 100% { box-shadow: 0 0 8px rgba(251, 146, 60, 0.4), inset 0 0 4px rgba(251, 146, 60, 0.2); }
  50% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.8), 0 0 30px rgba(251, 146, 60, 0.4), inset 0 0 8px rgba(251, 146, 60, 0.3); }
}

/* 滚动条带容器 */
.spin-strip {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: scroll-down 0.08s linear infinite;
  /* A.3.1: 运动模糊 */
  filter: blur(1.2px);
}

/* A.3.2: 脉冲式光带闪烁 */
.slot-column.spinning::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 35%,
    rgba(255, 255, 255, 0.9) 48%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.9) 52%,
    transparent 65%,
    transparent 100%
  );
  animation: flash-pulse 0.25s ease-in-out infinite;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
}

@keyframes flash-pulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.7; }
}

@keyframes scroll-down {
  0% { transform: translateY(-540px); }
  100% { transform: translateY(-260px); }
}

/* A.3.3: 停止回弹增强 - overshoot + 多阶段bounce */
.slot-column.stopped {
  animation: enhanced-bounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes enhanced-bounce {
  0% { 
    transform: translateY(-18px);
    filter: blur(0.8px);
  }
  25% { 
    transform: translateY(10px);
    filter: blur(0);
  }
  45% { 
    transform: translateY(-5px);
  }
  65% { 
    transform: translateY(3px);
  }
  80% { 
    transform: translateY(-1px);
  }
  100% { 
    transform: translateY(0);
  }
}

.slot-cell {
  width: 60px;
  height: 60px;
  min-height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 0.5rem;
  border: 2px solid #b8860b;
  transition: all 0.3s ease;
}

/* 中奖格子高亮 */
.slot-cell.winning {
  border-color: #f8d56b;
  box-shadow: 
    0 0 10px rgba(248, 213, 107, 0.5),
    0 0 20px rgba(248, 213, 107, 0.3);
  animation: pulse 1s ease-in-out infinite;
  perspective: 500px;
}

/* A.3.5: 中奖图标scale+rotateY动画 */
.slot-cell.winning .symbol-image {
  animation: icon-celebrate 1.2s ease-in-out infinite;
}

.slot-cell.winning .symbol {
  animation: icon-celebrate 1.2s ease-in-out infinite;
}

@keyframes icon-celebrate {
  0%, 100% { 
    transform: scale(1) rotateY(0deg);
  }
  25% { 
    transform: scale(1.15) rotateY(15deg);
  }
  50% { 
    transform: scale(1.2) rotateY(0deg);
  }
  75% { 
    transform: scale(1.15) rotateY(-15deg);
  }
}

@keyframes pulse {
  0%, 100% { 
    box-shadow: 
      0 0 10px rgba(248, 213, 107, 0.5),
      0 0 20px rgba(248, 213, 107, 0.3);
  }
  50% { 
    box-shadow: 
      0 0 15px rgba(248, 213, 107, 0.7),
      0 0 30px rgba(248, 213, 107, 0.5);
  }
}

.symbol {
  font-size: 2rem;
}

.symbol-image {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.spin-button {
  margin-top: 1.5rem;
  min-height: 44px;
  min-width: 140px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
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
