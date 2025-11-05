<template>
  <div class="my-works-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="nav-content">
        <h1 class="page-title">我的作品集</h1>
        <div class="nav-actions">
          <!-- 桌面端：完整显示 -->
          <div class="desktop-nav">
            <span class="username">{{ username }}</span>
            <button @click="goBack" class="back-btn">返回陆家花园</button>
            <button @click="logout" class="logout-btn">退出登录</button>
            <button @click="showDeleteConfirm" class="farewell-btn">
              <HandRaisedIcon class="farewell-icon" />
              Farewell
            </button>
          </div>
          
          <!-- 移动端：展开式菜单 -->
          <div class="mobile-nav">
            <button @click="toggleMenu" class="menu-toggle-btn">
              <span class="username-mobile">{{ username }}</span>
              <span class="menu-icon">{{ isMenuOpen ? '✕' : '⋮' }}</span>
            </button>
            
            <transition name="dropdown">
              <div v-if="isMenuOpen" class="dropdown-menu" @click.stop>
                <button @click="handleMenuAction(goBack)" class="menu-item">
                  <img src="/lujiaming_icon.png" alt="陆家花园" class="menu-icon-img" />
                  返回陆家花园
                </button>
                <button @click="handleMenuAction(logout)" class="menu-item menu-item-logout">
                  <span class="menu-logout-icon">↗</span>
                  退出登录
                </button>
                <button @click="handleMenuAction(showDeleteConfirm)" class="menu-item menu-item-farewell">
                  <HandRaisedIcon class="menu-farewell-icon" />
                  Farewell
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="works-main">
      <!-- 加载状态 -->
      <LoadingSpinner 
        v-if="loading" 
        message="正在加载作品..."
        size="large"
      />

      <!-- 错误状态 -->
      <ErrorState
        v-else-if="error"
        :message="errorMessage"
        @retry="loadWorks"
      />

      <!-- 空状态 -->
      <EmptyState
        v-else-if="works.length === 0"
        icon="✍️"
        title="您还没有创作作品"
        description="去创作一首属于您的诗歌吧～"
        :show-action="true"
        action-text="去创作"
        @action="goToCreate"
      />

      <!-- 作品列表（列表形式，折叠展开） -->
      <div v-else class="works-list">
        <div 
          v-for="(work, index) in works" 
          :key="work.id"
          class="work-item"
        >
          <!-- 摘要区（点击展开/收起） -->
          <div class="work-summary" @click="toggleWork(work)">
            <div class="summary-header">
              <h3 class="work-title">{{ work.poemTitle }}</h3>
              <button class="toggle-icon" :class="{ expanded: work.isExpanded }">
                {{ work.isExpanded ? '▲' : '▼' }}
              </button>
            </div>
            <div class="summary-meta">
              <span class="meta-tag">原诗：《{{ work.sourcePoemTitle }}》</span>
              <span class="meta-separator">•</span>
              <span class="meta-tag">{{ work.sourcePoemChapter }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-tag">{{ formatDate(work.createdAt) }}</span>
            </div>
          </div>

          <!-- 完整内容区（折叠状态） -->
          <transition name="expand">
            <div v-if="work.isExpanded" class="work-content">
              <!-- 用户输入 -->
              <div class="user-input-section">
                <div class="user-feeling-label">您的思绪</div>
                <div class="user-feeling-content">{{ work.userInput }}</div>
              </div>

              <!-- 使用PoemViewer展示完整作品 -->
              <PoemViewer
                :poem-title="work.poemTitle"
                :quote-text="work.poemQuote || ''"
                :quote-citation="work.poemQuoteSource || ''"
                :main-text="work.poemContent"
                :author="`陆家明 × ${username}`"
                :show-actions="true"
                :animation-delay="`${index * 0.1}s`"
              />
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="works-footer">
      <p>共创作 {{ works.length }} 首诗歌</p>
    </footer>

    <!-- 删除账号确认对话框 -->
    <transition name="modal">
      <div v-if="isDeleteModalOpen" class="modal-overlay" @click="closeDeleteModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>
              <ExclamationTriangleIcon class="warning-icon" />
              删除账号
            </h2>
          </div>
          
          <div class="modal-body">
            <p class="warning-text">此操作不可恢复！删除账号后：</p>
            <ul class="warning-list">
              <li>您的个人信息将被永久删除</li>
              <li>您将无法再次登录此账号</li>
              <li>您的作品将匿名化保留在平台上</li>
            </ul>

            <div class="confirm-input">
              <label for="confirm-password">请先输入密码验证身份：</label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                placeholder="输入密码"
                @keyup.enter="confirmDelete"
              />
            </div>

            <div class="confirm-input">
              <label for="confirm-username">再输入用户名 <strong>{{ username }}</strong> 确认删除：</label>
              <input
                id="confirm-username"
                v-model="confirmUsername"
                type="text"
                placeholder="输入用户名"
                @keyup.enter="confirmDelete"
              />
            </div>
            
            <p v-if="deleteError" class="error-message">{{ deleteError }}</p>
          </div>
          
          <div class="modal-footer">
            <button @click="closeDeleteModal" class="cancel-btn" :disabled="isDeleting">
              取消
            </button>
            <button
              @click="confirmDelete"
              class="confirm-delete-btn"
              :disabled="isDeleting || !confirmPassword || !confirmUsername"
            >
              {{ isDeleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ExclamationTriangleIcon, HandRaisedIcon } from '@heroicons/vue/24/outline'
import { LoadingSpinner, ErrorState, EmptyState } from '@/shared/components'
import { PoemViewer } from '@/modules/zhou/components'
import { getMyWorks, clearToken, getToken, deleteAccount } from '../services/authApi'
import type { Work } from '../services/authApi'

// 扩展Work类型，添加UI状态
interface WorkWithExpanded extends Work {
  isExpanded: boolean
}

// 路由
const router = useRouter()

// 状态
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const works = ref<WorkWithExpanded[]>([])
const isMenuOpen = ref(false)

// 删除账号相关状态
const isDeleteModalOpen = ref(false)
const confirmPassword = ref('')
const confirmUsername = ref('')
const isDeleting = ref(false)
const deleteError = ref('')

// 从token中解析用户名（简单实现）
const username = computed(() => {
  const token = getToken()
  if (!token) return '游客'
  
  // JWT格式: header.payload.signature
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.username || '用户'
  } catch {
    return '用户'
  }
})

// 加载作品列表
const loadWorks = async () => {
  loading.value = true
  error.value = false
  errorMessage.value = ''

  try {
    const response = await getMyWorks()
    
    if (response.success && response.works) {
      // 给每个作品添加isExpanded属性（默认折叠）
      works.value = response.works.map(work => ({
        ...work,
        isExpanded: false
      }))
    } else {
      error.value = true
      errorMessage.value = response.error || '加载作品失败'
    }
  } catch (err: any) {
    error.value = true
    errorMessage.value = err.message || '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 切换作品展开/收起状态
const toggleWork = (work: WorkWithExpanded) => {
  work.isExpanded = !work.isExpanded
}

// 退出登录
const logout = () => {
  clearToken()
  router.push('/')
}

// 去创作
const goToCreate = () => {
  router.push('/zhou')
}

// 返回陆家花园
const goBack = () => {
  router.push('/')
}

// 移动端菜单控制
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleMenuAction = (action: () => void) => {
  action()
  isMenuOpen.value = false
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (isMenuOpen.value && !target.closest('.mobile-nav')) {
    isMenuOpen.value = false
  }
}

// 删除账号相关函数
const showDeleteConfirm = () => {
  isDeleteModalOpen.value = true
  confirmPassword.value = ''
  confirmUsername.value = ''
  deleteError.value = ''
}

const closeDeleteModal = () => {
  if (isDeleting.value) return // 删除中不允许关闭
  isDeleteModalOpen.value = false
  confirmPassword.value = ''
  confirmUsername.value = ''
  deleteError.value = ''
}

const confirmDelete = async () => {
  deleteError.value = ''
  isDeleting.value = true

  try {
    const response = await deleteAccount(confirmPassword.value, confirmUsername.value)

    if (response.success) {
      // 删除成功：清除token并跳转到登录页
      clearToken()
      alert('账号已成功删除')
      router.push('/login')
    } else {
      deleteError.value = response.error || '删除账号失败'
    }
  } catch (err: any) {
    deleteError.value = err.message || '网络错误，请稍后重试'
  } finally {
    isDeleting.value = false
  }
}

// 生命周期
onMounted(() => {
  loadWorks()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 容器 */
.my-works-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.top-nav {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 0.02em;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
}

/* 桌面端导航 - 默认显示 */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* 移动端导航 - 默认隐藏 */
.mobile-nav {
  display: none;
  position: relative;
}

.username {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.back-btn {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(145deg, var(--color-brand-dark), #1a2e2e);
  color: var(--text-light);
  border: 1px solid #1a2e2e;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn:hover {
  background: linear-gradient(145deg, #1a2e2e, #0f1a1a);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.back-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(145deg, var(--color-brand-dark), #1a2e2e);
  color: var(--text-light);
  border: 1px solid #1a2e2e;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logout-btn:hover {
  background: linear-gradient(145deg, #1a2e2e, #0f1a1a);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.farewell-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--color-primary-300);
  color: var(--text-primary);
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  opacity: 0.5;
}

.farewell-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--color-brand-primary);
  transform: translateY(-1px);
}

.farewell-icon {
  width: 1rem;
  height: 1rem;
  color: var(--text-primary);
  flex-shrink: 0;
}

/* 移动端菜单按钮 */
.menu-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid var(--color-primary-300);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.menu-toggle-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--color-brand-primary);
}

.username-mobile {
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon {
  font-size: 1.25rem;
  line-height: 1;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid var(--color-primary-200);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 180px;
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
  transition: background var(--duration-fast) var(--ease-out);
}

.menu-icon-img {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  flex-shrink: 0;
}

.menu-logout-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.menu-farewell-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-primary);
  flex-shrink: 0;
  opacity: 0.5;
}

.menu-item:hover {
  background: var(--bg-secondary);
}

.menu-item + .menu-item {
  border-top: 1px solid var(--color-primary-100);
}

.menu-item-logout {
  color: var(--text-primary);
  font-weight: 500;
  background: linear-gradient(145deg, rgba(42, 74, 74, 0.05), rgba(26, 46, 46, 0.05));
}

.menu-item-logout:hover {
  background: linear-gradient(145deg, rgba(42, 74, 74, 0.1), rgba(26, 46, 46, 0.1));
}

.menu-item-farewell {
  color: var(--text-primary);
  font-size: 0.875rem;
  opacity: 0.5;
}

.menu-item-farewell:hover {
  background: var(--bg-secondary);
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

/* 主内容区 */
.works-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* 作品列表（垂直列表） */
.works-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 作品项（列表项） */
.work-item {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all var(--duration-normal) var(--ease-out);
}

.work-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 摘要区（可点击） */
.work-summary {
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.work-summary:hover {
  background: var(--bg-secondary);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.work-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.toggle-icon {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all var(--duration-fast) var(--ease-out);
}

.toggle-icon:hover {
  color: var(--color-brand-primary);
  transform: scale(1.1);
}

.toggle-icon.expanded {
  color: var(--color-brand-primary);
}

.summary-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.meta-tag {
  color: var(--text-secondary);
}

.meta-separator {
  color: var(--color-primary-300);
}

/* 完整内容区 */
.work-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--color-primary-100);
}

/* 用户输入区 */
.user-input-section {
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
}

.user-feeling-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.user-feeling-content {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 400;
  line-height: 1.6;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.meta-value {
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
  text-align: right;
}

/* 展开/收起动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 2000px;
  opacity: 1;
}

/* 页脚 */
.works-footer {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1.5rem 2rem;
  text-align: center;
}

.works-footer p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* 删除账号模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #ef4444;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.warning-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #ef4444;
  flex-shrink: 0;
}

.modal-body {
  padding: 1.5rem;
}

.warning-text {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.warning-list {
  margin: 0 0 1.5rem 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.warning-list li {
  margin-bottom: 0.5rem;
}

.confirm-input {
  margin-top: 1.5rem;
}

.confirm-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.confirm-input label strong {
  color: var(--text-primary);
  font-weight: 600;
}

.confirm-input input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.confirm-input input:focus {
  border-color: #ef4444;
}

.error-message {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 500;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-btn {
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.cancel-btn:hover:not(:disabled) {
  background: rgba(226, 232, 240, 0.3);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-delete-btn {
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  color: white;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.confirm-delete-btn:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.confirm-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-content {
    padding: 1rem 1.5rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .works-main {
    padding: 2rem 1.5rem;
  }

  .works-list {
    gap: 1.25rem;
  }

  .work-summary {
    padding: 1rem 1.25rem;
  }

  .work-content {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }

  .work-title {
    font-size: 1.125rem;
  }

  .summary-meta {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .nav-content {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .page-title {
    font-size: 1.125rem;
  }

  /* 移动端：隐藏桌面端导航，显示移动端菜单 */
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }

  .works-main {
    padding: 1.5rem 1rem;
  }

  .works-list {
    gap: 1rem;
  }

  .work-summary {
    padding: 0.875rem 1rem;
  }

  .work-content {
    padding: 0 1rem 1rem 1rem;
  }

  .user-input-section {
    padding: 0.875rem 1rem;
    margin-bottom: 1.25rem;
  }

  .work-title {
    font-size: 1rem;
  }

  .summary-meta {
    font-size: 0.75rem;
  }

  .user-feeling-content {
    font-size: 0.75rem;
  }

  .meta-tag {
    flex-shrink: 0;
  }
}
</style>


