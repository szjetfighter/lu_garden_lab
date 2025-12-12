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
          class="project-card unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full has-bg-image"
          :style="{ animationDelay: '0.1s', '--card-bg-image': `url(${moduleNewarrival})` }"
          @click="enterNewArrival"
        >
          <div class="content-overlay">
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
        </div>

        <!-- 谁是ZD 入口 -->
        <div 
          class="project-card unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full has-bg-image"
          :style="{ animationDelay: '0.2s', '--card-bg-image': `url(${moduleWhoiszd})` }"
          @click="enterWhoIsZD"
        >
          <div class="content-overlay">
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
        </div>

        <!-- 四气 入口 -->
        <div 
          class="project-card unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full has-bg-image"
          :style="{ animationDelay: '0.3s', '--card-bg-image': `url(${moduleFourseasons})` }"
          @click="enterFourSeasons"
        >
          <div class="content-overlay">
            <div class="flex-1">
              <h2 class="text-2xl font-bold mb-2 text-gray-800">四气</h2>
              <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">
                脱囊，动身，解离，坐定
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

        <!-- 毒理报告 入口 -->
        <div 
          class="project-card unified-content-card rounded-base animate-fadeInUp cursor-pointer flex flex-col h-full has-bg-image"
          :style="{ animationDelay: '0.4s', '--card-bg-image': `url(${moduleToxicology})` }"
          @click="enterToxicology"
        >
          <div class="content-overlay">
            <div class="flex-1">
              <h2 class="text-2xl font-bold mb-4 text-gray-800">毒理报告</h2>
              <div class="text-base mb-4 whitespace-pre-line leading-loose text-gray-600 italic">
                为熬死老家伙们做长久的准备
              </div>
            </div>
            <div class="flex justify-between items-center mt-4">
              <p class="text-xs m-0 text-gray-400">状态：无授权</p>
              <button class="btn-primary">
                进入
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
import moduleNewarrival from '@/modules/pending/assets/image/module-newarrival@0.33x.png'
import moduleWhoiszd from '@/modules/pending/assets/image/module-whoiszd@0.33x.png'
import moduleFourseasons from '@/modules/pending/assets/image/module-fourseasons@0.33x.png'
import moduleToxicology from '@/modules/pending/assets/image/module-toxicology@0.33x.png'

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

// 进入毒理报告
const enterToxicology = () => {
  router.push('/pending/004_toxicology')
}
</script>

<style scoped>
/* 项目卡片背景图 - 对角线渐变遮罩 */
.project-card.has-bg-image {
  background: 
    linear-gradient(
      to top left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 30%,
      rgba(255, 255, 255, 0.6) 60%,
      rgba(255, 255, 255, 0.9) 100%
    ),
    var(--card-bg-image) center/cover no-repeat;
  padding: var(--spacing-base);
}

/* 内容遮罩层 - 默认透明 */
.content-overlay {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  border-radius: 6px;
  padding: 1rem;
}

/* 伪元素做磨砂遮罩背景 - 对角线渐变消失 */
.project-card.has-bg-image .content-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
  z-index: -1;
  mask-image: linear-gradient(
    to bottom right,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 30%,
    rgba(0, 0, 0, 0.7) 60%,
    black 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom right,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 30%,
    rgba(0, 0, 0, 0.7) 60%,
    black 100%
  );
}
</style>
