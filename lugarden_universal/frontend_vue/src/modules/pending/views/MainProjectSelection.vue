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
      
      <!-- 子模块列表 - Swiper -->
      <Swiper
        :key="isMobile ? 'mobile' : 'desktop'"
        :modules="swiperModules"
        :direction="isMobile ? 'vertical' : 'horizontal'"
        :slides-per-view="'auto'"
        :space-between="isMobile ? 16 : 24"
        :centered-slides="true"
        :pagination="{ clickable: true }"
        :mousewheel="true"
        :keyboard="{ enabled: true }"
        :grab-cursor="true"
        class="projects-swiper"
        :class="{ 'swiper-vertical-mode': isMobile }"
        :style="{ '--swiper-progress': swiperProgress }"
        @progress="onSwiperProgress"
      >
        <!-- NEW ARRIVAL 入口 -->
        <SwiperSlide>
          <div 
            class="project-card unified-card-with-bg animate-fadeInUp"
            :style="{ '--card-bg-image': `url(${moduleNewarrival})` }"
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
        </SwiperSlide>

        <!-- 谁是ZD 入口 -->
        <SwiperSlide>
          <div 
            class="project-card unified-card-with-bg animate-fadeInUp"
            :style="{ '--card-bg-image': `url(${moduleWhoiszd})`, animationDelay: '0.1s' }"
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
        </SwiperSlide>

        <!-- 四气 入口 -->
        <SwiperSlide>
          <div 
            class="project-card unified-card-with-bg animate-fadeInUp"
            :style="{ '--card-bg-image': `url(${moduleFourseasons})`, animationDelay: '0.2s' }"
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
        </SwiperSlide>

        <!-- 毒理报告 入口 -->
        <SwiperSlide>
          <div 
            class="project-card unified-card-with-bg animate-fadeInUp"
            :style="{ '--card-bg-image': `url(${moduleToxicology})`, animationDelay: '0.3s' }"
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
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import BackButton from '@/shared/components/BackButton.vue'

// 模块背景图
import moduleNewarrival from '@/modules/pending/assets/image/module-newarrival@0.33x.png'
import moduleWhoiszd from '@/modules/pending/assets/image/module-whoiszd@0.33x.png'
import moduleFourseasons from '@/modules/pending/assets/image/module-fourseasons@0.33x.png'
import moduleToxicology from '@/modules/pending/assets/image/module-toxicology@0.33x.png'

const router = useRouter()

// Swiper配置
const swiperModules = [Pagination, Mousewheel, Keyboard]
const isMobile = ref(window.innerWidth < 768)
const swiperProgress = ref(0)

// 监听滑动进度，让装饰图标跟随滑动（二值状态：第一张显示，其他隐藏）
const onSwiperProgress = (_swiper: any, progress: number) => {
  if (isMobile.value) {
    swiperProgress.value = progress > 0.01 ? 1 : 0
  }
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

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
/* Swiper样式 - 与Portal统一 */
.projects-swiper {
  width: 100%;
  padding: 1rem 0 3rem;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 2.5%,
    black 97.5%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 2.5%,
    black 97.5%,
    transparent 100%
  );
}

.projects-swiper :deep(.swiper-slide) {
  width: auto;
  height: auto;
  opacity: 0.4;
  transform: scale(0.92);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.projects-swiper :deep(.swiper-slide-active) {
  opacity: 1;
  transform: scale(1);
}

.projects-swiper :deep(.swiper-slide) > * {
  width: 420px;
  max-width: 85vw;
}

/* 分页器样式 */
.projects-swiper :deep(.swiper-pagination) {
  bottom: 0.5rem;
}

.projects-swiper :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: var(--text-tertiary);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.projects-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: var(--color-primary-500);
  width: 20px;
  border-radius: 4px;
}

/* 手机端垂直模式 */
@media (max-width: 768px) {
  .projects-swiper.swiper-vertical-mode {
    height: clamp(320px, 65vh, 620px);
    padding: 1rem 0;
  }
  
  /* Swiper容器顶部装饰图标 - 跟随滑动 */
  .projects-swiper::before {
    content: '';
    position: absolute;
    top: calc(3% - var(--swiper-progress, 0) * 50%);
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: auto;
    aspect-ratio: 1280 / 510;
    background: url('/pending-banner.svg') no-repeat center;
    background-size: contain;
    opacity: calc(0.15 - var(--swiper-progress, 0) * 0.15);
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.1s ease;
  }
  
  .projects-swiper :deep(.swiper-slide) > * {
    width: 85vw;
    max-width: none;
    margin-left: 1rem;
  }
  
  .projects-swiper.swiper-vertical-mode :deep(.swiper-pagination) {
    right: 0.5rem;
    left: auto;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .projects-swiper.swiper-vertical-mode :deep(.swiper-pagination-bullet-active) {
    width: 8px;
    height: 20px;
  }
}

/* 卡片样式已迁移至全局 unified-card-with-bg */
</style>
