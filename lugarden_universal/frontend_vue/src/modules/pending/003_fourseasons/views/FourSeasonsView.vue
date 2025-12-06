<template>
  <div class="fourseasons-view">
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
      <div class="header-section text-center mb-6">
        <h1 class="text-3xl font-light tracking-widest text-gray-800 mb-2">四气</h1>
        <p class="text-sm text-gray-500">{{ currentPoem?.title }} · {{ currentPoem?.subtitle }}</p>
      </div>

      <!-- 3D场景容器 -->
      <div class="scene-container">
        <PoemScene :season="currentSeason" />
      </div>

      <!-- 提示文字 -->
      <div class="hint-section text-center mt-4 mb-4">
        <span class="text-sm text-gray-400">
          <template v-if="currentSeason === 'spring'">静待生长</template>
          <template v-else-if="currentSeason === 'summer'">触摸文字，感受灼热</template>
          <template v-else-if="currentSeason === 'autumn'">滑动屏幕，吹散落叶</template>
          <template v-else-if="currentSeason === 'winter'">摇晃手机，融化冰封</template>
        </span>
      </div>

      <!-- 季节选择器 -->
      <div class="selector-section flex justify-center">
        <SeasonSelector v-model="currentSeason" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PoemScene from '../components/PoemScene.vue'
import SeasonSelector from '../components/SeasonSelector.vue'
import BackButton from '@/shared/components/BackButton.vue'
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
.fourseasons-view {
  min-height: 100vh;
  /* 与001模块统一的渐变背景 */
  background: radial-gradient(ellipse at center, var(--bg-card, #f5f1e8) 0%, #e5e7eb 100%);
}

.scene-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  
  /* 统一卡片样式 - 参考001 unified-content-card */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.6) 100%);
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
</style>

