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
      >
        <!-- NEW ARRIVAL 入口 -->
        <SwiperSlide>
          <div 
            class="project-card unified-content-card rounded-base cursor-pointer flex flex-col h-full has-bg-image animate-fadeInUp"
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
            class="project-card unified-content-card rounded-base cursor-pointer flex flex-col h-full has-bg-image animate-fadeInUp"
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
            class="project-card unified-content-card rounded-base cursor-pointer flex flex-col h-full has-bg-image animate-fadeInUp"
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
            class="project-card unified-content-card rounded-base cursor-pointer flex flex-col h-full has-bg-image animate-fadeInUp"
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
  padding: 1.5rem;
}

/* 内容遮罩层 - 默认透明（与UniverseCard统一） */
.content-overlay {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 有背景图时 - 内容遮罩层样式（与UniverseCard统一） */
.project-card.has-bg-image .content-overlay {
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
