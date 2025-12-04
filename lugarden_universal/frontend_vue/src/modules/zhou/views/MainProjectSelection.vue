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
      
      <!-- 项目列表 -->
      <div v-else>
        <div class="grid grid-responsive">
          <div 
            v-for="(project, index) in zhouStore.universeData.projects" 
            :key="project.id"
            class="unified-content-card rounded-base animate-fadeInUp flex flex-col h-full"
            :style="{ animationDelay: `${0.1 * index}s` }"
            @click="selectProject(project)"
          >
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
        
        <!-- About可展开卡片 (A/B测试位置1) -->
        <!-- 使用相同的grid-responsive布局，确保与项目卡片宽度一致 -->
        <div class="mt-6 grid grid-responsive">
          <div class="animate-fadeInUp" style="animation-delay: 0.3s;">
            <AboutExpandableCard />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useZhouStore } from '@/modules/zhou/stores/zhou'
import type { ZhouProject } from '@/modules/zhou/types/zhou'
import ErrorState from '@/shared/components/ErrorState.vue'
import BackButton from '@/shared/components/BackButton.vue'
import AboutExpandableCard from '@/modules/zhou/001_lianxi/components/AboutExpandableCard.vue'

const router = useRouter()
const zhouStore = useZhouStore()

// 周与春秋宇宙入口页面
// 选择进入哪个子模块/项目

// 组件挂载时初始化数据
onMounted(async () => {
  // 检测移动设备
  zhouStore.detectMobileDevice()
  
  // 如果还未初始化或数据过期，加载宇宙内容
  if (!zhouStore.appState.initialized || shouldRefreshData()) {
    await zhouStore.loadUniverseContent()
  }
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
/* 组件特有的样式 */
.loading-spinner {
  animation: spin 1s linear infinite;
}
</style>
