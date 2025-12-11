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
          class="project-card unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full has-bg-image"
          :style="{ animationDelay: '0.1s', '--card-bg-image': `url(${moduleMoshi})` }"
          @click="enterMoshi"
        >
          <div class="content-overlay">
            <div class="flex-1">
              <h2 class="text-2xl font-bold mb-2 text-gray-800">摸诗</h2>
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
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BackButton from '@/shared/components/BackButton.vue'

// 模块背景图
import moduleMoshi from '@/modules/mao/assets/image/module-moshi@0.33x.png'

const router = useRouter()

// 毛小豆宇宙入口页面
// 选择进入哪个子模块

// 返回宇宙门户
const goBack = () => {
  router.push('/')
}

// 进入摸诗
const enterMoshi = () => {
  router.push('/maoxiaodou/moshi')
}
</script>

<style scoped>
/* 项目卡片背景图 */
.project-card.has-bg-image {
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(248, 250, 252, 0.1) 100%),
    var(--card-bg-image) center/cover no-repeat;
  padding: var(--spacing-base);
}

/* 内容遮罩层 - 默认透明 */
.content-overlay {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 有背景图时的磨砂效果 */
.project-card.has-bg-image .content-overlay {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
  padding: 1rem;
}
</style>
