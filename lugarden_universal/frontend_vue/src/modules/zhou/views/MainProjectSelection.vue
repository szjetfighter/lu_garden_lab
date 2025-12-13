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
        周与春秋
      </h1>
      <div class="text-center mb-8">
        <p class="text-gray-600">这里的诗，是你的回答</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-if="zhouStore.universeData.error">
        <ErrorState 
          error-type="network"
          error-title="加载失败"
          :error-message="zhouStore.universeData.error"
          :show-retry="true"
          :show-back="false"
          retry-text="重试"
          @retry="retryLoad"
          :suggestions="['请检查网络连接', '刷新页面重试', '联系技术支持']"
        />
      </div>
      
      <!-- 项目列表 - Swiper -->
      <div v-else>
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
          <SwiperSlide 
            v-for="(project, index) in zhouStore.universeData.projects" 
            :key="project.id"
          >
            <div 
              class="project-card unified-card-with-bg animate-fadeInUp"
              :style="getCardStyle(project.name, index)"
              @click="selectProject(project)"
            >
              <div class="content-overlay">
                <div class="flex-1">
                  <h2 class="text-2xl font-bold mb-2 text-gray-800">{{ project.name }}</h2>
                  <div class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">{{ project.description }}</div>
                </div>
                <div class="flex justify-between items-center mt-4">
                  <p class="text-xs text-gray-500 m-0">作者: {{ project.poet || '未指定' }}</p>
                  <button class="btn-primary">
                    进入
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        
        <!-- About可展开卡片 -->
        <div class="mt-6 max-w-md mx-auto px-4">
          <AboutExpandableCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useZhouStore } from '@/modules/zhou/stores/zhou'
import type { ZhouProject } from '@/modules/zhou/types/zhou'
import ErrorState from '@/shared/components/ErrorState.vue'
import BackButton from '@/shared/components/BackButton.vue'
import AboutExpandableCard from '@/modules/zhou/001_lianxi/components/AboutExpandableCard.vue'

// 模块背景图
import moduleLianxi from '@/modules/zhou/assets/image/module-lianxi@0.33x.png'

const router = useRouter()
const zhouStore = useZhouStore()

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

// 获取项目背景图（按名称匹配）
const getProjectBackground = (projectName: string): string => {
  const bgMap: Record<string, string> = {
    '周与春秋练习': moduleLianxi
  }
  return bgMap[projectName] || ''
}

// 获取卡片样式
const getCardStyle = (projectName: string, index: number) => {
  const style: Record<string, string> = {
    animationDelay: `${0.1 * index}s`
  }
  const bg = getProjectBackground(projectName)
  if (bg) {
    style['--card-bg-image'] = `url(${bg})`
  }
  return style
}

// 周与春秋宇宙入口页面
// 选择进入哪个子模块/项目

// 组件挂载时初始化数据
onMounted(async () => {
  // 检测移动设备
  zhouStore.detectMobileDevice()
  
  // 监听窗口resize
  window.addEventListener('resize', handleResize)
  
  // 如果还未初始化或数据过期，加载宇宙内容
  if (!zhouStore.appState.initialized || shouldRefreshData()) {
    await zhouStore.loadUniverseContent()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 判断是否需要刷新数据（可选的缓存策略）
function shouldRefreshData(): boolean {
  if (!zhouStore.universeData.lastFetchTime) return true
  
  const CACHE_DURATION = 10 * 60 * 1000 // 10分钟
  const now = Date.now()
  return (now - zhouStore.universeData.lastFetchTime) > CACHE_DURATION
}

// 选择项目
function selectProject(project: ZhouProject): void {
  zhouStore.selectMainProject(project)
  router.push(`/project/${project.id}`)
}

// 返回宇宙门户
function goBack(): void {
  // 直接跳转到宇宙门户，避免状态管理操作（吸取E2教训）
  router.push('/')
}

// 重试加载
async function retryLoad(): Promise<void> {
  zhouStore.clearError()
  await zhouStore.loadUniverseContent()
}
</script>

<style scoped>
/* Swiper样式 - 与Portal统一 */
.projects-swiper {
  width: 100%;
  padding: 1rem 0 3rem;
  /* 边缘渐隐效果 */
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
    background: url('/zhou-banner.svg') no-repeat center;
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

/* 组件特有的样式 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

/* 卡片样式已迁移至全局 unified-card-with-bg */
</style>
