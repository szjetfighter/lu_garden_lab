<template>
  <div 
    class="shui-island-card cursor-pointer transition-all duration-300"
    :class="[align === 'right' ? 'text-right' : 'text-left']"
  >
    <!-- 卡片主体 -->
    <div 
      class="card-body inline-block bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-blue-100/50 p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1"
      :class="{ 'border-blue-400 shadow-md': isExpanded }"
      @click="emit('toggle')"
    >
      <!-- 头部：日期+标题 -->
      <div class="flex items-start gap-3 mb-2">
        <div class="text-xs text-blue-400 font-mono whitespace-nowrap pt-0.5">
          {{ collection.dateStart.split('.').slice(0,2).join('.') }}
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-800 leading-tight hover:text-blue-700 transition-colors">
            {{ collection.name }}
          </h3>
          <div class="text-xs text-gray-400 mt-1">
            {{ collection.poemCount }} 首诗 · {{ parseRegions(collection.regions) }}
          </div>
        </div>
      </div>
      
      <!-- 展开的诗歌列表 -->
      <Transition name="expand">
        <div v-if="isExpanded && collection.poems" class="mt-3 pt-3 border-t border-blue-100">
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div 
              v-for="poem in collection.poems" 
              :key="poem.id"
              class="poem-item flex items-center gap-2 p-2 rounded hover:bg-blue-50 transition-colors cursor-pointer"
              :class="align === 'right' ? 'flex-row-reverse text-right' : ''"
              @click.stop="emit('select-poem', poem)"
            >
              <span class="text-xs text-blue-300 font-mono w-6 shrink-0">{{ String(poem.index).padStart(2, '0') }}</span>
              <span class="text-sm text-gray-700 truncate">{{ poem.title }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShuiCollection, ShuiPoem } from '@/stores/shuiStore'

const props = defineProps<{
  collection: ShuiCollection
  index: number
  isExpanded: boolean
  align: 'left' | 'right'
}>()

const emit = defineEmits<{
  toggle: []
  'select-poem': [poem: ShuiPoem]
}>()

function parseRegions(regions: string | null): string {
  if (!regions) return '未知海域'
  try {
    const arr = JSON.parse(regions)
    return Array.isArray(arr) ? arr.join('·') : regions
  } catch {
    return regions
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 300px;
}

.poem-item:hover {
  transform: translateX(4px);
}

.shui-island-card[class*="text-right"] .poem-item:hover {
  transform: translateX(-4px);
}
</style>
