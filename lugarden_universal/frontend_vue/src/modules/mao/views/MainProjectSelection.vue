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
      
      <!-- 子项目列表 - Swiper -->
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
        <!-- 摸诗入口 -->
        <SwiperSlide>
          <div 
            class="project-card unified-card-with-bg animate-fadeInUp"
            :style="{ '--card-bg-image': `url(${moduleMoshi})` }"
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
import moduleMoshi from '@/modules/mao/assets/image/module-moshi@0.33x.png'

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
    background: url('/mao-banner.svg') no-repeat center;
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
