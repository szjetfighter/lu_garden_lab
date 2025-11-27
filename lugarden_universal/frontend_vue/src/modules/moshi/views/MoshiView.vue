<script setup lang="ts">
/**
 * 摸诗宇宙主视图
 */

import { onMounted, ref, watch } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'
import SlotMachine from '../components/SlotMachine.vue'
import StanzaDisplay from '../components/StanzaDisplay.vue'
import PoemViewer from '../components/PoemViewer.vue'

const store = useMoshiStore()

// 控制诗节展示是否显示
const showStanza = ref(false)

// 控制全诗展示
const showFullPoem = ref(false)
const currentPoemId = ref('')

// 点击"查收奖品"按钮时显示诗节
const handleClaimPrize = () => {
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

// 监听新的spin，重置显示状态
watch(() => store.spinCount, () => {
  showStanza.value = false
  showFullPoem.value = false
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
      <SlotMachine @claim-prize="handleClaimPrize" />
      
      <!-- 诗节展示：点击查收奖品后显示 -->
      <StanzaDisplay 
        v-if="showStanza" 
        @view-full-poem="handleViewFullPoem"
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
    
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="star" v-for="i in 20" :key="i" :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`
      }"></div>
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
  background: linear-gradient(180deg, #0a0a15 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.moshi-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
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

/* 背景星星装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  opacity: 0.3;
  animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
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
