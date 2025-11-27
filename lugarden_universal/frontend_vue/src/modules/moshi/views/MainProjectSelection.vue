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
        毛小豆宇宙
      </h1>
      <div class="text-center mb-8">
        <p class="text-gray-600">毛小豆故事演绎，演绎了你的故事么？</p>
      </div>
      
      <!-- 子项目列表 -->
      <div class="grid grid-responsive">
        <!-- 摸诗入口 -->
        <div 
          class="unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full"
          style="animation-delay: 0.3s"
          @click="enterMoshi"
        >
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">摸诗</h2>
            <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">
              棒子老虎鸡？不如老虎机！
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xs text-gray-500 m-0">作者: 西尔</p>
            <button class="btn-primary">
              开始摸诗
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

// 返回宇宙门户
const goBack = () => {
  router.push('/')
}

// 进入摸诗
const enterMoshi = () => {
  router.push('/maoxiaodou/moshi')
}
</script>
