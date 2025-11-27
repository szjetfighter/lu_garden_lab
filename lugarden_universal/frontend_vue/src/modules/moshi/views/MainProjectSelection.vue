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

      <!-- 项目信息 -->
      <div class="text-center mb-8">
        <h1 class="content-title animate-fadeInDown">
          毛小豆宇宙
        </h1>
        <div class="content-subtitle animate-fadeIn" style="animation-delay: 0.2s;">
          毛小豆故事演绎，演绎了你的故事么？
        </div>
        <p class="text-gray-500 mb-8">
          作者: 西尔
        </p>
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
              转动命运的轮盘，用老虎机的方式遇见属于你的诗节。
              每一次转动，都是一次与诗歌的随机相遇。
            </div>
          </div>
          <div class="flex justify-end mt-4">
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
