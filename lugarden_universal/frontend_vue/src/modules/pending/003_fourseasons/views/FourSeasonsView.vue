<template>
  <div class="fourseasons-container">
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>

    <!-- 标题 -->
    <div class="header">
      <h1>四气</h1>
      <p>{{ currentPoem?.title }} · {{ currentPoem?.subtitle }}</p>
    </div>

    <!-- 3D场景 -->
    <PoemScene :season="currentSeason" />

    <!-- 季节选择器 -->
    <div class="selector-wrapper">
      <SeasonSelector v-model="currentSeason" />
    </div>

    <!-- 提示 -->
    <div class="hint">
      <span v-if="currentSeason === 'spring'">静待生长</span>
      <span v-else-if="currentSeason === 'summer'">触摸文字，感受灼热</span>
      <span v-else-if="currentSeason === 'autumn'">滑动屏幕，吹散落叶</span>
      <span v-else-if="currentSeason === 'winter'">摇晃手机，融化冰封</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PoemScene from '../components/PoemScene.vue'
import SeasonSelector from '../components/SeasonSelector.vue'
import { poems } from '../data/poems'
import type { Season } from '../composables/useSeasonEffects'

const router = useRouter()
const currentSeason = ref<Season>('summer')

const currentPoem = computed(() => {
  return poems.find(p => p.season === currentSeason.value)
})

const goBack = () => {
  router.push('/pending/home')
}
</script>

<style scoped>
.fourseasons-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #0a0a0a;
  overflow: hidden;
}

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
  color: #fff;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  text-align: center;
  color: #fff;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.5em;
  margin-bottom: 0.25rem;
}

.header p {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.selector-wrapper {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.hint {
  position: absolute;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
}
</style>

