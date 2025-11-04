<template>
  <div class="my-works-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="nav-content">
        <h1 class="page-title">我的作品集</h1>
        <div class="nav-actions">
          <span class="username">{{ username }}</span>
          <button @click="logout" class="logout-btn">退出登录</button>
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

      <!-- 作品列表 -->
      <div v-else class="works-grid">
        <div 
          v-for="(work, index) in works" 
          :key="work.id"
          class="work-item"
        >
          <!-- 作品元信息 -->
          <div class="work-meta">
            <div class="meta-row">
              <span class="meta-label">原诗</span>
              <span class="meta-value">《{{ work.sourcePoemTitle }}》</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">章节</span>
              <span class="meta-value">{{ work.sourcePoemChapter }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">创作时间</span>
              <span class="meta-value">{{ formatDate(work.createdAt) }}</span>
            </div>
          </div>

          <!-- 使用PoemViewer展示作品 -->
          <PoemViewer
            :poem-title="work.poemTitle"
            :quote-text="work.poemQuote || ''"
            :quote-citation="work.poemQuoteSource || ''"
            :main-text="work.poemContent"
            author="陆家明 × 您"
            :show-actions="true"
            :animation-delay="`${index * 0.1}s`"
          />

          <!-- 用户输入回顾 -->
          <div class="user-input-section">
            <p class="input-label">您的感受：</p>
            <p class="input-content">{{ work.userInput }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="works-footer">
      <p>共创作 {{ works.length }} 首诗歌</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LoadingSpinner, ErrorState, EmptyState } from '@/shared/components'
import { PoemViewer } from '@/modules/zhou/components'
import { getMyWorks, clearToken, getToken } from '../services/authApi'
import type { Work } from '../services/authApi'

// 路由
const router = useRouter()

// 状态
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const works = ref<Work[]>([])

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
      works.value = response.works
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

// 退出登录
const logout = () => {
  clearToken()
  router.push('/')
}

// 去创作
const goToCreate = () => {
  router.push('/zhou')
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

// 生命周期
onMounted(() => {
  loadWorks()
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
}

.username {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: 1px solid var(--color-primary-300);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.logout-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--color-brand-primary);
  transform: translateY(-1px);
}

/* 主内容区 */
.works-main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* 作品网格 */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 3rem;
}

/* 作品项 */
.work-item {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 作品元信息 */
.work-meta {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.8) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

/* 用户输入回顾 */
.user-input-section {
  background: linear-gradient(135deg, rgba(240, 249, 255, 0.6) 0%, rgba(224, 242, 254, 0.8) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
}

.input-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.input-content {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .works-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-content {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .nav-actions {
    width: 100%;
    justify-content: space-between;
  }

  .works-main {
    padding: 2rem 1.5rem;
  }

  .works-grid {
    gap: 2rem;
  }

  .work-meta {
    padding: 0.875rem 1.25rem;
  }

  .user-input-section {
    padding: 1rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .nav-content {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.125rem;
  }

  .username {
    font-size: 0.875rem;
  }

  .logout-btn {
    padding: 0.375rem 1rem;
    font-size: 0.8125rem;
  }

  .works-main {
    padding: 1.5rem 1rem;
  }
}
</style>


