<template>
  <!-- 用户导航 -->
  <nav class="user-nav" :class="navClasses">
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

  <!-- 通知提示 -->
  <NotificationToast
    v-if="showToast && props.showToast"
    :message="toastMessage"
    :type="toastType"
    :duration="3000"
    @close="showToast = false"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import { NotificationToast } from '@/shared/components'
import { isAuthenticated, getUserInfo } from '@/core/auth/services/authApi'

// Props定义
interface Props {
  mode?: 'full' | 'minimal'
  position?: 'absolute' | 'relative'
  showToast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'full',
  position: 'absolute',
  showToast: true
})

// 路由
const router = useRouter()

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

// 计算导航样式类
const navClasses = computed(() => ({
  'nav-full': props.mode === 'full',
  'nav-minimal': props.mode === 'minimal',
  'nav-absolute': props.position === 'absolute',
  'nav-relative': props.position === 'relative'
}))

// 显示Toast通知
const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
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
  if (props.showToast) {
    showToastMessage('已退出登录', 'success')
  }
  // 刷新页面以更新登录状态
  window.location.reload()
}

// 生命周期
onMounted(async () => {
  // 如果已登录，加载用户信息
  if (isLoggedIn.value) {
    await loadUserInfo()
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 用户导航样式 */
.user-nav {
  z-index: 10;
}

/* 默认full模式样式（从UniversePortal复制） */
.nav-full {
  position: absolute;
  right: 2rem;
  top: 2rem;
}

/* minimal模式样式（适用于其他页面） */
.nav-minimal {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 1000;
}

/* 定位控制 */
.nav-absolute {
  position: absolute;
}

.nav-relative {
  position: relative;
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

/* 响应式设计 */
@media (max-width: 768px) {
  /* 移动端调整定位 */
  .nav-full {
    right: 1rem;
    top: 1rem;
  }
  
  .nav-minimal {
    right: 0.5rem;
    top: 0.5rem;
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
