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
        <nav class="user-nav">
          <!-- 桌面端导航 -->
          <div class="desktop-nav">
            <!-- 已登录状态 -->
            <div v-if="isLoggedIn" class="user-nav-logged-in">
              <span class="user-name">{{ username }}</span>
              <span class="nav-divider">|</span>
              <router-link to="/my-works" class="nav-link">我的作品</router-link>
              <span class="nav-divider">|</span>
              <button @click="handleLogout" class="nav-link logout-btn">退出</button>
            </div>
            
            <!-- 未登录状态 -->
            <div v-else class="user-nav-logged-out">
              <router-link to="/login" class="login-btn">登录/注册</router-link>
            </div>
          </div>
          
          <!-- 移动端展开式菜单 -->
          <div v-if="isLoggedIn" class="mobile-nav">
            <button @click="toggleMenu" class="menu-toggle-btn">
              <span class="username-mobile">{{ username }}</span>
              <span class="menu-icon">{{ isMenuOpen ? '✕' : '⋮' }}</span>
            </button>
            
            <transition name="dropdown">
              <div v-if="isMenuOpen" class="dropdown-menu" @click.stop>
                <router-link to="/my-works" @click="closeMenu" class="menu-item">
                  <DocumentTextIcon class="menu-item-icon" />
                  我的作品
                </router-link>
                <button @click="handleMenuLogout" class="menu-item menu-item-logout">
                  ↗ 退出
                </button>
              </div>
            </transition>
          </div>
          
          <!-- 移动端未登录 -->
          <div v-else class="mobile-nav-logged-out">
            <router-link to="/login" class="login-btn-mobile">登录/注册</router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- 宇宙卡片列表区域 -->
    <main class="universes-container">
      <!-- 加载状态 -->
      <LoadingSpinner 
        v-if="loading" 
        message="正在加载宇宙列表..."
        size="large"
      />
      
      <!-- 错误状态 -->
      <ErrorState 
        v-else-if="error.hasError"
        :message="error.message"
        @retry="portalStore.retryLoad"
      />
      
      <!-- 空状态 -->
      <EmptyState
        v-else-if="universes.length === 0"
        title="暂无可用宇宙"
        description="目前还没有已上线的宇宙项目，请稍后再来探索吧～"
        icon="🌌"
        :show-action="true"
        action-text="刷新列表"
        @action="portalStore.refreshUniverses"
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import { LoadingSpinner, ErrorState, EmptyState, NotificationToast } from '@/shared/components'
import { UniverseCard } from '@/modules/portal/components'
import { usePortalStore } from '@/modules/portal/stores'
import { isAuthenticated, getUserInfo } from '@/core/auth/services/authApi'
import type { Universe } from '@/modules/portal/types'

// 路由
const router = useRouter()

// Portal状态管理
const portalStore = usePortalStore()

// 用户登录状态
const isLoggedIn = computed(() => isAuthenticated())
const username = ref('加载中...')

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const response = await getUserInfo()
    if (response.success && response.user) {
      username.value = response.user.username
    } else {
      username.value = '用户'
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    username.value = '用户'
  }
}

// 移动端菜单状态
const isMenuOpen = ref(false)

// Toast通知状态
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// 当前年份
const currentYear = computed(() => new Date().getFullYear())

// 计算属性
const loading = computed(() => portalStore.isLoading)
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
      developing: `${universe.name} 正在紧张开发中，敬请期待！🚧`,
      maintenance: `${universe.name} 正在维护升级，请稍后再来～🔧`,
      archived: `${universe.name} 已暂时下线，感谢您的关注！📦`
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

// 移动端菜单控制
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleMenuLogout = () => {
  closeMenu()
  handleLogout()
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (isMenuOpen.value && !target.closest('.mobile-nav')) {
    isMenuOpen.value = false
  }
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  showToastMessage('已退出登录', 'success')
  // 刷新页面以更新登录状态
  window.location.reload()
}

// 生命周期
onMounted(async () => {
  // 如果已登录，加载用户信息
  if (isLoggedIn.value) {
    await loadUserInfo()
  }
  
  // 预加载数据，如果已有缓存则不重新加载
  await portalStore.preloadUniverseData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

/* 用户导航样式 */
.user-nav {
  position: absolute;
  right: 2rem;
  top: 2rem;
  z-index: 10;
}

/* 桌面端导航 - 默认显示 */
.desktop-nav {
  display: block;
}

/* 移动端导航 - 默认隐藏 */
.mobile-nav,
.mobile-nav-logged-out {
  display: none;
  position: relative;
}

.user-nav-logged-in {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.user-name {
  color: var(--text-primary);
  font-weight: 500;
}

.nav-divider {
  color: var(--text-tertiary);
  opacity: 0.4;
}

.nav-link {
  color: var(--color-primary-300);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-primary-400);
}

.logout-btn {
  font-weight: 400;
}

.user-nav-logged-out {
  display: flex;
  align-items: center;
}

.login-btn {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background-color: var(--color-primary-300);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background-color: var(--color-primary-400);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

/* 移动端菜单按钮 */
.menu-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-toggle-btn:hover {
  opacity: 0.7;
}

.username-mobile {
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-tertiary);
}

.menu-icon {
  font-size: 1.25rem;
  line-height: 1;
  color: var(--text-tertiary);
}

/* 移动端未登录按钮 */
.login-btn-mobile {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background: transparent;
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-btn-mobile:hover {
  opacity: 0.7;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 160px;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: white;
  border: none;
  text-align: left;
  font-size: 0.9375rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s ease;
  text-decoration: none;
}

.menu-item:hover {
  background: var(--bg-secondary);
}

.menu-item + .menu-item {
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

.menu-item-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.menu-item-logout {
  color: var(--color-primary-300);
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 宇宙容器 */
.universes-container {
  max-width: 1200px;
  margin: 0 auto;
}

.universes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
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
  
  /* 移动端用户导航 */
  .user-nav {
    right: 1rem;
    top: 1rem;
  }
  
  /* 移动端：隐藏桌面端导航，显示移动端菜单 */
  .desktop-nav {
    display: none;
  }
  
  .mobile-nav,
  .mobile-nav-logged-out {
    display: block;
  }
}
</style>
