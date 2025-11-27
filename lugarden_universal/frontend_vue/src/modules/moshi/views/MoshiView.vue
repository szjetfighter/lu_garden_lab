<script setup lang="ts">
/**
 * 摸诗宇宙主视图
 */

import { onMounted, ref, watch, computed } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'
import SlotMachine from '../components/SlotMachine.vue'
import StanzaDisplay from '../components/StanzaDisplay.vue'
import PoemViewer from '../components/PoemViewer.vue'
import WinModal from '../components/WinModal.vue'

const store = useMoshiStore()

// 控制中奖弹窗
const showWinModal = ref(false)

// 控制诗节展示是否显示
const showStanza = ref(false)

// 控制全诗展示
const showFullPoem = ref(false)
const currentPoemId = ref('')

// 当前中奖详情
const currentWinDetail = computed(() => store.lastResult?.primaryWinDetail || null)

// 显示中奖弹窗
const handleShowWin = () => {
  showWinModal.value = true
}

// 关闭中奖弹窗
const handleCloseWin = () => {
  showWinModal.value = false
}

// 点击"查收奖品"按钮时：关闭弹窗，显示诗节
const handleClaimPrize = () => {
  showWinModal.value = false
  showStanza.value = true
}

// 点击"查看全诗"按钮
const handleViewFullPoem = (poemId: string) => {
  currentPoemId.value = poemId
  showFullPoem.value = true
}

// 关闭全诗
const handleCloseFullPoem = () => {
  showFullPoem.value = false
  currentPoemId.value = ''
}

// A.4: 监听isSpinning开始时重置显示状态（解耦统计更新和弹窗重置）
watch(() => store.isSpinning, (newVal, oldVal) => {
  // 开始新的spin时重置状态
  if (newVal && !oldVal) {
    showWinModal.value = false
    showStanza.value = false
    showFullPoem.value = false
  }
})

onMounted(() => {
  // 进入页面时重置状态
  store.reset()
})
</script>

<template>
  <div class="moshi-view">
    <div class="moshi-container">
      <!-- 老虎机 -->
      <SlotMachine @show-win="handleShowWin" />
      
      <!-- 诗节展示：点击查收奖品后显示 -->
      <StanzaDisplay 
        v-if="showStanza" 
        @view-full-poem="handleViewFullPoem"
      />
      
      <!-- 中奖弹窗 -->
      <WinModal 
        v-if="showWinModal && currentWinDetail"
        :win-detail="currentWinDetail"
        @close="handleCloseWin"
        @claim-prize="handleClaimPrize"
      />
      
      <!-- 全诗展示 -->
      <PoemViewer 
        v-if="showFullPoem && currentPoemId"
        :poem-id="currentPoemId"
        @close="handleCloseFullPoem"
      />
      
      <!-- 错误提示 -->
      <Transition name="fade">
        <div v-if="store.error" class="error-toast">
          {{ store.error }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.moshi-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--bg-primary);
}

.moshi-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  background: #ff4444;
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
}

/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
