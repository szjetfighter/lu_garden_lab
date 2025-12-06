<template>
  <div class="min-h-screen" style="background-color: var(--bg-primary);">
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

      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        匿，腻，溺
      </h1>
      <div class="text-center mb-8">
        <p class="text-gray-600">实验，以及冒犯。谁？当然是你</p>
      </div>
      
      <!-- 子模块列表 -->
      <div class="grid grid-responsive">
        <!-- NEW ARRIVAL 入口 -->
        <div 
          class="unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full"
          style="animation-delay: 0.1s"
          @click="enterNewArrival"
        >
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2 text-gray-800">NEW ARRIVAL</h2>
            <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">
              贩卖机，卖空气
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xs text-gray-500 m-0">状态: 已撤回</p>
            <button class="btn-primary">
              进入
            </button>
          </div>
        </div>

        <!-- 谁是ZD 入口 -->
        <div 
          class="unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full"
          style="animation-delay: 0.2s"
          @click="enterWhoIsZD"
        >
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2 text-gray-800">谁是ZD</h2>
            <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">
              炎石做得，陆家明做不得？
              <br />
              <span class="text-xs text-red-500">⚠️ 警告：此Poeject可能令人沮丧</span>
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xs text-gray-500 m-0">状态: 挑衅中</p>
            <button class="btn-primary">
              进入
            </button>
          </div>
        </div>

        <!-- 四气 入口 -->
        <div 
          class="unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full"
          style="animation-delay: 0.3s"
          @click="enterFourSeasons"
        >
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2 text-gray-800">四气</h2>
            <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">
              春生、夏蒸、秋落、冬冻
              <br />
              <span class="text-xs text-gray-400">施岳宏 · 节气诗选</span>
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xs text-gray-500 m-0">状态: 测不准</p>
            <button class="btn-primary">
              进入
            </button>
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

// 先锋实验宇宙入口页面
// 选择进入哪个子模块

// 返回宇宙门户
const goBack = () => {
  router.push('/')
}

// 进入NEW ARRIVAL
const enterNewArrival = () => {
  router.push('/pending/001_newarrival')
}

// 进入谁是臧棣
const enterWhoIsZD = () => {
  router.push('/pending/002_whoiszd')
}

// 进入四气
const enterFourSeasons = () => {
  router.push('/pending/003_fourseasons')
}
</script>
