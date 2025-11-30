<script setup lang="ts">
/**
 * 老虎机组件
 * 5x3符号矩阵 + 摸诗按钮 + 列滚动动画
 */

import { computed, ref, onMounted } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'
import { moshiApi } from '../services/moshiApi'
import type { MoshiSymbol } from '../types/moshi'

/**
 * 根据符号ID获取图片URL
 * 使用Vite的new URL()实现静态资源导入
 */
function getSymbolImage(symbolId: string): string {
  return new URL(`../assets/images/symbols/${symbolId}.png`, import.meta.url).href
}

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

// A.5: 每列的连线等级 (0=无连线, 1-5=连线列数)
const chainLevels = ref<number[]>([0, 0, 0, 0, 0])

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
const defaultSymbol: { id: string; name: string; poeticName: string; emoji: null; type: 'wild' } = {
  id: 'wild',
  name: '陆',
  poeticName: '陆',
  emoji: null,
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

// A.5: 计算每列的连线等级
// 返回数组 [col0等级, col1等级, ...]
// 等级含义: 0=该列断开, N=到该列为止连续匹配了N列
function calculateChainLevels(matrix: MoshiSymbol[][]): number[] {
  const levels = [0, 0, 0, 0, 0]
  
  // 获取第一列所有符号ID（包括wild作为万能匹配）
  const firstColIds = new Set<string>()
  for (const symbol of matrix[0]) {
    if (symbol.type !== 'wild') {
      firstColIds.add(symbol.id)
    }
  }
  // 如果第一列有wild，看第二列有什么符号
  if (matrix[0].some(s => s.type === 'wild') && matrix[1]) {
    for (const symbol of matrix[1]) {
      if (symbol.type !== 'wild') {
        firstColIds.add(symbol.id)
      }
    }
  }
  
  // 找出最长连线
  let maxChain = 0
  for (const targetId of firstColIds) {
    let chain = 0
    for (let col = 0; col < 5; col++) {
      const hasMatch = matrix[col].some(s => s.id === targetId || s.type === 'wild')
      if (hasMatch) {
        chain++
      } else {
        break
      }
    }
    if (chain > maxChain) {
      maxChain = chain
    }
  }
  
  // 填充每列的等级
  for (let col = 0; col < 5; col++) {
    if (col < maxChain) {
      levels[col] = col + 1  // 1, 2, 3, 4, 5
    } else {
      levels[col] = 0  // 断开
    }
  }
  
  return levels
}

// A.5: 根据连线等级计算延迟（大幅递增制造悬念）
function getDelayForColumn(colIdx: number, level: number): number {
  const baseDelay = 250
  if (level === 0) return baseDelay  // 断开，快速结束
  
  // 有连线时大幅递增延迟
  const delays = [250, 500, 1000, 2000, 3500]
  return delays[Math.min(colIdx, 4)]
}

// A.5: 检测到第N列为止是否有连线潜力
function hasChainPotential(matrix: MoshiSymbol[][], upToCol: number): boolean {
  // 获取第一列所有符号ID
  const firstColIds = new Set<string>()
  for (const symbol of matrix[0]) {
    if (symbol.type !== 'wild') {
      firstColIds.add(symbol.id)
    }
  }
  if (matrix[0].some(s => s.type === 'wild') && matrix[1]) {
    for (const symbol of matrix[1]) {
      if (symbol.type !== 'wild') {
        firstColIds.add(symbol.id)
      }
    }
  }
  
  // 检查是否有符号能连续匹配到upToCol
  for (const targetId of firstColIds) {
    let chain = 0
    for (let col = 0; col <= upToCol && col < 5; col++) {
      const hasMatch = matrix[col].some(s => s.id === targetId || s.type === 'wild')
      if (hasMatch) {
        chain++
      } else {
        break
      }
    }
    if (chain > upToCol) {
      return true  // 到upToCol为止都有匹配
    }
  }
  return false
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
  
  // A.5: 获取最终矩阵用于逐步检测
  const matrix = store.matrix
  // 开始时所有列chainLevel都是0（无特效）
  chainLevels.value = [0, 0, 0, 0, 0]
  
  // 6. 等待后依次停止每列（A.5: 逐步揭示特效）
  setTimeout(() => {
    // 链式处理每列：停止当前列 → 检测下一列 → 设置特效 → 等待 → 停止下一列
    const stopColumn = (colIdx: number) => {
      // 停止当前列
      columnStates.value[colIdx] = 'stopped'
      columnStates.value = [...columnStates.value]
      
      // 如果是最后一列，完成
      if (colIdx >= 4) {
        // 延迟后进入idle状态
        setTimeout(() => {
          columnStates.value = ['idle', 'idle', 'idle', 'idle', 'idle']
          chainLevels.value = [0, 0, 0, 0, 0]
          isAnimating.value = false
          store.commitStats()
          if (store.lastResult?.primaryWinDetail) {
            emit('showWin')
          }
        }, 500)
        return
      }
      
      // 正确逻辑：只有当前面的列已经连上时，下一列才高亮
      // - 第0列停止后：第1列不高亮（还没形成连线）
      // - 第1列停止后：检测前2列(0+1)是否连上 → 如果是，第2列高亮（再连一个就中奖！）
      // - 第2列停止后：检测前3列是否连上 → 如果是（已中奖），第3列高亮
      const nextCol = colIdx + 1
      let nextDelay = 250 // 默认快速
      
      // 只有当前列>=1时才检测（第0列停止后不给第1列高亮）
      // 检测的是"前colIdx+1列是否都连上"
      if (colIdx >= 1 && matrix && hasChainPotential(matrix, colIdx)) {
        // 前面的列已经形成连线！给下一列设置chainLevel，触发特效
        chainLevels.value[nextCol] = nextCol + 1
        chainLevels.value = [...chainLevels.value]
        // 使用增强延迟
        nextDelay = getDelayForColumn(nextCol, nextCol + 1)
      }
      
      // 等待后停止下一列
      setTimeout(() => stopColumn(nextCol), nextDelay)
    }
    
    // 从第0列开始，固定250ms后停止
    setTimeout(() => stopColumn(0), 250)
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
          [`col-${colIdx}`]: columnStates[colIdx] === 'spinning',
          [`chain-${chainLevels[colIdx]}`]: columnStates[colIdx] === 'spinning' && chainLevels[colIdx] > 0,
          'no-chain': columnStates[colIdx] === 'spinning' && chainLevels[colIdx] === 0
        }"
      >
        <!-- 滚动中：显示滚动条带 -->
        <div v-if="columnStates[colIdx] === 'spinning'" class="spin-strip">
          <div 
            v-for="(symbol, idx) in getSpinningColumn(colIdx)" 
            :key="idx" 
            class="slot-cell"
          >
            <img :src="getSymbolImage(symbol.id)" class="symbol-image" :alt="symbol.name || ''" />
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
            <img :src="getSymbolImage(symbol.id)" class="symbol-image" :alt="symbol.name || ''" />
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
/* A.8: 采用zhou标准布局模式，避免PC调试与真机差异 */
/* 使用max-w + mx-auto，不使用calc */
.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 1rem;
  background: white;
  border-radius: var(--radius-base, 1rem);
  box-shadow: var(--shadow-card, 0 4px 20px rgba(0, 0, 0, 0.08));
  box-sizing: border-box;
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
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.75rem;
  border: 3px solid #b8860b;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(184, 134, 11, 0.2);
  box-sizing: border-box;
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
  height: calc(3rem * 3 + 0.5rem * 2); /* 3个格子高度 + 间隙 */
  overflow: hidden;
  border-radius: 0.5rem;
  transition: box-shadow 0.3s ease;
}

/* A.5: 无连线的列 - 无发光效果 */
.slot-column.spinning.no-chain {
  box-shadow: none;
  animation: none;
}

/* A.3.4 + A.5: 多色动态列边框发光 - 只有连上的列才发光 */
.slot-column.spinning.col-0:not(.no-chain) {
  animation: glow-pulse-gold 0.8s ease-in-out infinite;
}
.slot-column.spinning.col-1:not(.no-chain) {
  animation: glow-pulse-cyan 0.8s ease-in-out infinite 0.1s;
}
.slot-column.spinning.col-2:not(.no-chain) {
  animation: glow-pulse-pink 0.8s ease-in-out infinite 0.2s;
}
.slot-column.spinning.col-3:not(.no-chain) {
  animation: glow-pulse-purple 0.8s ease-in-out infinite 0.3s;
}
.slot-column.spinning.col-4:not(.no-chain) {
  animation: glow-pulse-orange 0.8s ease-in-out infinite 0.4s;
}

/* A.5: 4连 - 轻微抖动 + 星星效果 */
.slot-column.spinning.chain-4 {
  animation: glow-pulse-purple 0.8s ease-in-out infinite, shake-light 0.15s ease-in-out infinite;
}

/* A.5: 5连 - 剧烈抖动 + 闪电效果 */
.slot-column.spinning.chain-5 {
  animation: glow-pulse-orange 0.8s ease-in-out infinite, shake-heavy 0.1s ease-in-out infinite;
}

@keyframes shake-light {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes shake-heavy {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  20% { transform: translateX(-3px) rotate(-1deg); }
  40% { transform: translateX(3px) rotate(1deg); }
  60% { transform: translateX(-3px) rotate(-1deg); }
  80% { transform: translateX(3px) rotate(1deg); }
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

/* A.5: 条件性光带 - chain-1/2/3有光带，chain-4/5用特殊特效 */
.slot-column.spinning:not(.no-chain):not(.chain-4):not(.chain-5)::after {
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

/* 无连线的列没有光带 */
.slot-column.spinning.no-chain::after {
  display: none;
}

@keyframes flash-pulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.7; }
}

/* A.5: 4连星星特效 - 两侧呼吸星星 */
.slot-column.spinning.chain-4::before,
.slot-column.spinning.chain-4::after {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  pointer-events: none;
  z-index: 15;
}

.slot-column.spinning.chain-4::before {
  content: '';
  left: -4px;
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(168, 85, 247, 0.8) 20%,
    rgba(168, 85, 247, 0.3) 40%,
    rgba(168, 85, 247, 0.9) 50%,
    rgba(168, 85, 247, 0.3) 60%,
    rgba(168, 85, 247, 0.8) 80%,
    transparent 100%
  );
  animation: star-side-pulse 0.4s ease-in-out infinite;
  box-shadow: 
    0 0 15px rgba(168, 85, 247, 0.8),
    0 0 30px rgba(168, 85, 247, 0.5),
    -5px 0 20px rgba(168, 85, 247, 0.6);
}

.slot-column.spinning.chain-4::after {
  content: '';
  right: -4px;
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(168, 85, 247, 0.8) 25%,
    rgba(168, 85, 247, 0.3) 45%,
    rgba(168, 85, 247, 0.9) 55%,
    rgba(168, 85, 247, 0.3) 65%,
    rgba(168, 85, 247, 0.8) 85%,
    transparent 100%
  );
  animation: star-side-pulse 0.4s ease-in-out infinite 0.2s;
  box-shadow: 
    0 0 15px rgba(168, 85, 247, 0.8),
    0 0 30px rgba(168, 85, 247, 0.5),
    5px 0 20px rgba(168, 85, 247, 0.6);
}

@keyframes star-side-pulse {
  0%, 100% { 
    opacity: 0.5;
    transform: scaleY(0.9);
  }
  50% { 
    opacity: 1;
    transform: scaleY(1.1);
  }
}

/* A.5: 5连闪电特效 - 超级赛亚人气场 */
.slot-column.spinning.chain-5::before,
.slot-column.spinning.chain-5::after {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12px;
  pointer-events: none;
  z-index: 15;
}

.slot-column.spinning.chain-5::before {
  content: '';
  left: -6px;
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(251, 191, 36, 1) 10%,
    transparent 20%,
    rgba(251, 191, 36, 1) 30%,
    transparent 40%,
    rgba(251, 191, 36, 1) 50%,
    transparent 60%,
    rgba(251, 191, 36, 1) 70%,
    transparent 80%,
    rgba(251, 191, 36, 1) 90%,
    transparent 100%
  );
  animation: lightning-crackle 0.1s steps(3) infinite;
  box-shadow: 
    0 0 20px rgba(251, 191, 36, 1),
    0 0 40px rgba(251, 191, 36, 0.8),
    0 0 60px rgba(251, 191, 36, 0.5),
    -8px 0 30px rgba(251, 191, 36, 0.7);
  filter: blur(1px);
}

.slot-column.spinning.chain-5::after {
  content: '';
  right: -6px;
  background: linear-gradient(180deg, 
    transparent 5%,
    rgba(251, 191, 36, 1) 15%,
    transparent 25%,
    rgba(251, 191, 36, 1) 35%,
    transparent 45%,
    rgba(251, 191, 36, 1) 55%,
    transparent 65%,
    rgba(251, 191, 36, 1) 75%,
    transparent 85%,
    rgba(251, 191, 36, 1) 95%,
    transparent 100%
  );
  animation: lightning-crackle 0.1s steps(3) infinite 0.05s;
  box-shadow: 
    0 0 20px rgba(251, 191, 36, 1),
    0 0 40px rgba(251, 191, 36, 0.8),
    0 0 60px rgba(251, 191, 36, 0.5),
    8px 0 30px rgba(251, 191, 36, 0.7);
  filter: blur(1px);
}

@keyframes lightning-crackle {
  0% { 
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
  33% { 
    opacity: 0.7;
    transform: scaleY(1.05) translateY(-2px);
  }
  66% { 
    opacity: 1;
    transform: scaleY(0.95) translateY(2px);
  }
  100% { 
    opacity: 0.8;
    transform: scaleY(1) translateY(0);
  }
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
  width: 3rem;
  height: 3rem;
  min-height: 3rem;
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
  background: #fffbeb; /* 淡黄色背景 */
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
