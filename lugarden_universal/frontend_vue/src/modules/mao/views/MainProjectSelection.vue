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
        :centered-slides-bounds="isMobile"
        :pagination="{ clickable: true }"
        :mousewheel="true"
        :keyboard="{ enabled: true }"
        :grab-cursor="true"
        class="projects-swiper"
        :class="{ 'swiper-vertical-mode': isMobile }"
      >
        <!-- 摸诗入口 -->
        <SwiperSlide>
          <div 
            class="project-card unified-content-card rounded-base cursor-pointer flex flex-col h-full has-bg-image animate-fadeInUp"
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
    height: clamp(320px, 50vh, 480px);
    padding: 1rem 0;
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
