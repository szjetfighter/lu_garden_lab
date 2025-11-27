<script setup lang="ts">
/**
 * 摸诗宇宙主视图
 */

import { onMounted } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'
import SlotMachine from '../components/SlotMachine.vue'
import StanzaDisplay from '../components/StanzaDisplay.vue'

const store = useMoshiStore()

onMounted(() => {
  // 进入页面时重置状态
  store.reset()
})
</script>

<template>
  <div class="moshi-view">
    <div class="moshi-container">
      <!-- 老虎机 -->
      <SlotMachine />
      
      <!-- 诗节展示 -->
      <StanzaDisplay />
      
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
