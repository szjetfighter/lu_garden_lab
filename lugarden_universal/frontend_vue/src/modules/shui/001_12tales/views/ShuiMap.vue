<template>
  <div class="shui-map-view relative w-full h-screen overflow-hidden bg-[#eef2f6]">
    
    <!-- 1. 背景层: 潮汐 (The Tide) -->
    <!-- 使用CSS动画模拟简单的水面光影 -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#e0f7fa] to-[#e8eaf6]"></div>
    <div class="tide-layer absolute inset-0 opacity-30 mix-blend-overlay"></div>
    
    <!-- 装饰性经纬线 -->
    <div class="absolute inset-0 grid-lines pointer-events-none opacity-10"></div>

    <!-- 2. UI层: 顶部导航 -->
    <div class="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
      <div class="pointer-events-auto">
        <BackButton 
          text="返回"
          variant="ghost" 
          size="medium"
          @click="goBack"
        />
      </div>
      <div class="text-right pointer-events-auto">
        <h1 class="text-xl font-bold text-slate-700 tracking-widest font-serif">海图 001</h1>
        <p class="text-xs text-slate-400 font-mono">31°14'N, 121°29'E</p>
      </div>
    </div>

    <!-- 3. 内容层: 岛屿 (The Islands) -->
    <div class="absolute inset-0 container mx-auto relative pointer-events-none">
      <div class="pointer-events-auto w-full h-full relative" v-if="!shuiStore.loading">
        <!-- 随机分布岛屿 -->
        <ShuiCollectionCard
          v-for="(col, index) in shuiStore.collections"
          :key="col.id"
          :collection="col"
          :index="index"
          :x="getIslandPosition(index).x"
          :y="getIslandPosition(index).y"
        />
      </div>
      
      <!-- 加载/空状态 -->
      <div v-if="shuiStore.loading" class="absolute inset-0 flex items-center justify-center">
         <span class="text-slate-400 tracking-widest animate-pulse">正在测绘海域...</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShuiStore } from '@/stores/shuiStore'
import BackButton from '@/shared/components/BackButton.vue' // 注意这里可能需要兼容variant="glass"
import ShuiCollectionCard from '@/modules/shui/components/ShuiCollectionCard.vue'

const router = useRouter()
const shuiStore = useShuiStore()

const GRID_COLS = 4
const GRID_ROWS = 3

// 生成确定性但看起来随机的位置
function getIslandPosition(index: number) {
  // 将屏幕分为 4x3 的网格
  // x: 10% ~ 90%
  // y: 20% ~ 80%
  
  const col = index % GRID_COLS
  const row = Math.floor(index / GRID_COLS)
  
  // 基础网格位置
  const baseX = (col / GRID_COLS) * 80 + 10 // 10-90
  const baseY = (row / GRID_ROWS) * 60 + 20 // 20-80
  
  // 增加随机偏移 (基于 index 的伪随机)
  const randomX = Math.sin(index * 123) * 5
  const randomY = Math.cos(index * 321) * 5
  
  return {
    x: baseX + randomX,
    y: baseY + randomY
  }
}

onMounted(async () => {
  if (shuiStore.collections.length === 0) {
    await shuiStore.fetchCollections()
  }
})

function goBack() {
  router.push('/shui/project/001_12tales')
}
</script>

<style scoped>
.tide-layer {
  background: 
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 60%),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10px);
  animation: tide-flow 20s ease-in-out infinite alternate;
}

@keyframes tide-flow {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.1); opacity: 0.5; }
}

.grid-lines {
  background-image: 
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 100px 100px;
}
</style>
