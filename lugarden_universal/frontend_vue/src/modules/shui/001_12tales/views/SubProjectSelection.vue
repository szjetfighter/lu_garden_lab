<template>
  <div class="min-h-screen bg-blue-50/50">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <BackButton 
          text="返回故事集"
          variant="default"
          size="medium"
          :hover-animation="true"
          @click="goBack"
        />
      </div>

      <h1 class="text-3xl font-bold text-center mb-2 text-gray-800 font-serif">
        十二个故事集
      </h1>
      <p class="text-center text-gray-500 mb-10">选择你的体验模式</p>
      
      <!-- 模式列表 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        <!-- 卡片1：海图与潮汐 (Shui Map) -->
        <div 
          class="mode-card group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100 hover:border-blue-400 transform hover:-translate-y-2"
          @click="selectMode('map')"
        >
          <div class="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
            <!-- 装饰性波纹 -->
            <div class="absolute inset-0 opacity-30 bg-white/20"></div>
            <div class="text-white text-5xl">🗺️</div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">海图与潮汐</h3>
            <p class="text-gray-500 text-sm mb-4">The Chart & The Tide</p>
            <p class="text-gray-600 leading-relaxed">
              以俯瞰视角探索十二座岛屿。每一座岛屿都是一段尘封的记忆，随潮汐起伏。
            </p>
            <div class="mt-6 flex justify-end">
              <span class="inline-flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                开始探索 &rarr;
              </span>
            </div>
          </div>
        </div>

        <!-- 卡片2：深海扭蛋机 (Gachapon) -->
        <div 
          class="mode-card group cursor-not-allowed bg-gray-50 rounded-xl shadow-none border border-gray-200 opacity-70"
        >
          <div class="h-40 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center grayscale">
            <div class="text-white text-5xl">💊</div>
          </div>
          <div class="p-6">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-xl font-bold text-gray-700">深海扭蛋机</h3>
              <span class="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded">Coming Soon</span>
            </div>
            <p class="text-gray-500 text-sm mb-4">Story Gachapon</p>
            <p class="text-gray-500 leading-relaxed">
              随机打捞海底的碎片。也许是一段对话，也许是一个没有结局的故事。
            </p>
          </div>
        </div>

        <!-- 卡片3：碎片之海 (Fragments) -->
        <div 
          class="mode-card group cursor-not-allowed bg-gray-50 rounded-xl shadow-none border border-gray-200 opacity-70"
        >
          <div class="h-40 bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center grayscale">
            <div class="text-white text-5xl">🫧</div>
          </div>
          <div class="p-6">
             <div class="flex justify-between items-center mb-2">
              <h3 class="text-xl font-bold text-gray-700">碎片之海</h3>
              <span class="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded">Coming Soon</span>
            </div>
            <p class="text-gray-500 text-sm mb-4">Fragment Reassembly</p>
            <p class="text-gray-500 leading-relaxed">
              沉浸在气泡的海洋中，尝试将那些破碎的句子重新拼凑完整。
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BackButton from '@/shared/components/BackButton.vue'

const router = useRouter()

function goBack(): void {
  router.push('/shui')
}

function selectMode(mode: string): void {
  if (mode === 'map') {
    router.push('/shui/project/001_12tales/map')
  }
}
</script>
