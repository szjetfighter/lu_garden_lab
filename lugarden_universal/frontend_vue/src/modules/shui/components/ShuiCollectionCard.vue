<template>
  <div 
    class="shui-island-card absolute cursor-pointer transition-all duration-500 group"
    :style="positionStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 浮动容器 (Bobbing Animation) -->
    <div 
      class="bobbing-container relative"
      :style="{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }"
    >
      <!-- 卡片本体 -->
      <div 
        class="card-body bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-blue-100/50 p-4 w-48 text-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:z-50 group-hover:border-blue-300 group-hover:-translate-y-4"
      >
        <div class="text-xs text-gray-400 mb-1 font-mono">{{ collection.dateStart }}</div>
        <h3 class="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-700">
          {{ collection.name }}
        </h3>
        <!-- 悬停时显示的额外信息 -->
        <div class="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
          <div class="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
             {{ collection.regions || '未知海域' }}
          </div>
          <div class="text-xs text-blue-400 mt-1">
             {{ collection.poemCount }} 首诗
          </div>
        </div>
      </div>
      
      <!-- 倒影/阴影效果 -->
      <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-black/10 blur-md rounded-full transition-all duration-500 group-hover:w-24 group-hover:opacity-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShuiCollection } from '@/stores/shuiStore'

const props = defineProps<{
  collection: ShuiCollection
  x: number // 百分比 0-100
  y: number // 百分比 0-100
  index: number
}>()

const isHovered = ref(false)

// 随机化浮动动画参数
const delay = computed(() => -(props.index * 0.7))
const duration = computed(() => 3 + (props.index % 4) * 0.5)

const positionStyle = computed(() => ({
  left: `${props.x}%`,
  top: `${props.y}%`,
  zIndex: isHovered.value ? 50 : 10
}))
</script>

<style scoped>
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bobbing-container {
  animation: bob ease-in-out infinite;
}

/* 暂停浮动当悬停时，防止抖动 */
.shui-island-card:hover .bobbing-container {
  animation-play-state: paused;
}
</style>
