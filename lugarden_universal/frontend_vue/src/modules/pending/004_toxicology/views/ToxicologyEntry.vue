<template>
  <div class="toxicology-entry">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <BackButton 
          text="返回"
          variant="default"
          size="medium"
          :hover-animation="true"
          @click="goBack"
        />
      </div>

      <!-- 标题区 -->
      <div class="header-section text-center mb-6 animate-fadeInUp">
        <h1 class="text-3xl font-bold tracking-widest text-gray-800 mb-2">毒理报告</h1>
        <p class="subtitle">你中的，哪门子毒</p>
      </div>

      <!-- 卡片容器（透明） -->
      <div class="scene-container animate-fadeInUp" style="animation-delay: 0.1s;">
        <div class="poison-grid">
          <button 
            v-for="(poison, index) in poisons" 
            :key="index"
            class="poison-btn"
            :class="{ 'selected': selectedIndex === index, 'shake': shaking && selectedIndex === index }"
            @click="selectPoison(index)"
          >
            <span class="poison-name">{{ poison.name }}</span>
          </button>
        </div>
      </div>

      <!-- 嘲讽弹窗 -->
      <Transition name="fade">
        <div v-if="showMocking" class="mocking-overlay">
          <div class="mocking-content">
            <p class="mocking-speaker">陆家明：</p>
            <p class="mocking-text">中毒的人能选自己中的是什么毒，</p>
            <p class="mocking-text">但你不能。</p>
            <div class="mocking-hint">正在进入毒理报告...</div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/shared/components/BackButton.vue'

const router = useRouter()

// 9种"毒"（反讽式的"正常人"状态）
const poisons = [
  { name: '饿了么' },
  { name: '爱上班' },
  { name: '喜欢冯铗' },
  { name: '讨厌冯铗' },
  { name: '想写诗' },
  { name: '性能力强' },
  { name: '文明乡下人' },
  { name: '开车不加塞' },
  { name: '没有起床气' }
]

const selectedIndex = ref<number | null>(null)
const shaking = ref(false)
const showMocking = ref(false)

const goBack = () => {
  router.push('/pending/home')
}

const selectPoison = (index: number) => {
  if (showMocking.value) return
  
  selectedIndex.value = index
  shaking.value = true
  
  // 抖动效果
  setTimeout(() => {
    shaking.value = false
    showMocking.value = true
    
    // 2秒后跳转
    setTimeout(() => {
      router.push('/pending/004_toxicology/report')
    }, 2500)
  }, 500)
}
</script>

<style scoped>
.toxicology-entry {
  min-height: 100vh;
  background: radial-gradient(ellipse at center, var(--bg-card, #f5f1e8) 0%, #e5e7eb 100%);
}

.header-section .subtitle {
  color: var(--text-tertiary, #9ca3af);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* 卡片容器 - 与其他页面保持一致 */
.scene-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  
  /* 透明卡片样式 */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(248, 250, 252, 0.3) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg, 12px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all var(--duration-normal, 0.3s) ease-out;
}

.scene-container:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.poison-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.poison-btn {
  background: var(--bg-secondary, #ffffff);
  border: 1px solid var(--color-primary-200, #d1d5db);
  border-radius: var(--radius-lg, 12px);
  padding: 1.25rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease-out;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
}

.poison-btn:hover {
  border-color: var(--color-brand-primary, #bca09e);
  transform: translateY(-2px);
  box-shadow: var(--shadow-base, 0 4px 6px rgba(0,0,0,0.1));
}

.poison-btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
}

.poison-btn.selected {
  background: linear-gradient(145deg, var(--color-primary-600, #1f2937), var(--color-primary-700, #111827));
  border-color: var(--color-primary-700, #111827);
  box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
}

.poison-btn.selected .poison-name {
  color: var(--text-light, #f0e8d9);
}

.poison-btn.shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.poison-name {
  color: var(--text-primary, #1f2937);
  font-size: 0.875rem;
  font-weight: 600;
}

/* 嘲讽弹窗 */
.mocking-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.mocking-content {
  text-align: center;
  padding: 2rem;
}

.mocking-speaker {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.mocking-text {
  color: #fff;
  font-size: 1.25rem;
  margin: 0.5rem 0;
  line-height: 1.8;
}

.mocking-hint {
  color: #444;
  font-size: 0.75rem;
  margin-top: 2rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* 过渡动画 */
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
