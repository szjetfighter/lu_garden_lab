<template>
  <div class="universe-portal">
    <!-- 主标题区域 -->
    <header class="portal-header">
      <div class="header-content">
        <div class="title-section">
      <h1 class="portal-title">陆家花园</h1>
      <p class="portal-subtitle">诗歌宇宙的探索入口</p>
        </div>
        
        <!-- 用户导航 -->
        <UserNavigation mode="full" position="absolute" :show-toast="true" />
      </div>
    </header>

    <!-- 宇宙卡片列表区域 -->
    <main class="universes-container">
      <!-- 错误状态 -->
      <ErrorState 
        v-if="error.hasError"
        :message="error.message"
        @retry="portalStore.retryLoad"
      />
      
      <!-- 宇宙列表 -->
      <div v-else class="universes-grid">
        <UniverseCard
          v-for="(universe, index) in universes" 
          :key="universe.id"
          :universe="universe"
          :index="index"
          @click="navigateToUniverse"
          @enter="navigateToUniverse"
        />
      </div>
    </main>

    <!-- 版权与备案信息 -->
    <footer class="site-footer">
      <p class="copyright">© {{ currentYear }} 陆家花园</p>
      <a 
        href="https://beian.miit.gov.cn" 
        target="_blank" 
        rel="noopener noreferrer"
        class="beian-link icp-beian"
      >
        沪ICP备2025147783号
      </a>
      <a 
        href="https://www.beian.gov.cn/portal/registerSystemInfo" 
        target="_blank" 
        rel="noopener noreferrer"
        class="beian-link police-beian"
      >
        沪公网安备31010702009727号
      </a>
    </footer>

    <!-- 通知提示 -->
    <NotificationToast
      v-if="showToast"
      :message="toastMessage"
      :type="toastType"
      :duration="3000"
      @close="showToast = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ErrorState, NotificationToast, UserNavigation } from '@/shared/components'
import { UniverseCard } from '@/modules/portal/components'
import { usePortalStore } from '@/modules/portal/stores'
import type { Universe } from '@/modules/portal/types'

// 路由
const router = useRouter()

// Portal状态管理
const portalStore = usePortalStore()

// Toast通知状态（Portal专用）
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// 当前年份
const currentYear = computed(() => new Date().getFullYear())

// 计算属性
const error = computed(() => ({
  hasError: portalStore.hasError,
  message: portalStore.errorMessage
}))
const universes = computed(() => portalStore.visibleUniverses)

// 显示Toast通知
const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

const navigateToUniverse = async (universe: Universe) => {
  // 选择宇宙
  await portalStore.selectUniverse(universe)
  
  if (!portalStore.isUniverseAccessible(universe)) {
    // 显示友好的开发中提示
    const statusMessages = {
      draft: `${universe.name} 正在紧张开发中，敬请期待！🚧`,
      maintenance: `${universe.name} 正在维护升级，请稍后再来～🔧`
    }
    const message = statusMessages[universe.status as keyof typeof statusMessages] || `${universe.name} 暂时无法访问`
    showToastMessage(message, 'info')
    return
  }
  
  // 获取导航路径并跳转
  const navigationPath = portalStore.getUniverseNavigationPath(universe.id)
  showToastMessage(`正在进入 ${universe.name}～`, 'success')
  router.push(navigationPath)
}


// 生命周期
onMounted(async () => {
  // 预加载数据，如果已有缓存则不重新加载
  await portalStore.preloadUniverseData()
})
</script>

<style scoped>
/* 主容器 - 与Zhou统一的淡雅背景 */
.universe-portal {
  min-height: 100vh;
  background-color: var(--bg-primary); /* #f3f4f6 - 与Zhou统一 */
  padding: 4rem 2rem 2rem; /* 顶部增加额外间距，整体向下平移 */
}

/* 头部样式 - 简洁诗意 */
.portal-header {
  margin-bottom: 3rem;
  margin-top: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  text-align: center;
  flex: 1;
}

.portal-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary); /* #1f2937 */
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.portal-subtitle {
  font-size: 1.125rem;
  color: var(--text-tertiary); /* #6b7280 */
  margin: 0;
  font-weight: 400;
}


/* 宇宙容器 */
.universes-container {
  max-width: 1200px;
  margin: 0 auto;
}

.universes-grid {
  display: grid;
  gap: 2rem;
  justify-content: center;
  /* 单个宇宙：居中显示，限制宽度 */
  grid-template-columns: repeat(auto-fit, minmax(400px, 500px));
  /* 最大2列 */
  max-width: min(100%, 1040px);
  margin: 0 auto;
}

/* 版权与备案信息 */
.site-footer {
  margin-top: 3rem;
  padding: 1.5rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.copyright {
  margin: 0;
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  font-weight: 400;
}

.beian-link {
  display: inline-block;
  color: var(--color-primary-300);
  text-decoration: none;
  font-size: var(--font-size-xs);
  transition: all var(--duration-fast) var(--ease-out);
  opacity: 0.5;
}

.beian-link:hover {
  color: var(--text-tertiary);
  opacity: 0.7;
}

/* ICP备案和公安备案保持一致的样式 */
.icp-beian,
.police-beian {
  font-weight: 400;
  letter-spacing: 0.02em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .universe-portal {
    padding: 1rem;
  }
  
  .portal-header {
    margin-top: 4rem;
  }
  
  .portal-title {
    font-size: 2rem;
  }
  
  .portal-subtitle {
    font-size: 1rem;
  }
  
  .universes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .site-footer {
    margin-top: 2rem;
    padding: 1rem 0;
  }
}
</style>
