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
        先锋实验
      </h1>
      <div class="text-center mb-8">
        <p class="text-gray-600">匿名化的诗歌实验场</p>
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
            <h2 class="text-2xl font-bold mb-4 text-gray-800">NEW ARRIVAL</h2>
            <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">
              诗歌贩卖机，投币即取
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xs text-gray-500 m-0">状态: 实验中</p>
            <button class="btn-primary">
              进入
            </button>
          </div>
        </div>

        <!-- 谁是臧棣 入口 -->
        <div 
          class="unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full"
          style="animation-delay: 0.2s"
          @click="enterWhoIsZD"
        >
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">谁是臧棣</h2>
            <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">
              20首诗，哪首是臧棣写的？
              <br />
              <span class="text-xs text-red-500">⚠️ 警告：此游戏可能令人沮丧</span>
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xs text-gray-500 m-0">状态: 实验中</p>
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
</script>
