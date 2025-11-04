<template>
  <div class="login-container">
    <!-- 返回首页按钮 -->
    <div class="back-button-container">
      <button @click="goHome" class="back-home-btn">
        ← 返回首页
      </button>
    </div>

    <!-- 登录注册卡片 -->
    <div class="login-card unified-content-card">
      <h1 class="page-title">陆家花园</h1>
      <p class="page-subtitle">让您的诗歌创作有归属</p>

      <!-- Tab切换 -->
      <div class="tabs">
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          登录
        </button>
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册
        </button>
      </div>

      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-username">用户名</label>
          <input
            id="login-username"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="login-password">密码</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            required
            :disabled="loading"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <!-- 注册表单 -->
      <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="register-username">用户名</label>
          <input
            id="register-username"
            v-model="registerForm.username"
            type="text"
            placeholder="3-20个字符"
            required
            minlength="3"
            maxlength="20"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="register-password">密码</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            placeholder="至少6个字符"
            required
            minlength="6"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="register-confirm-password">确认密码</label>
          <input
            id="register-confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="再次输入密码"
            required
            minlength="6"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login, register, saveToken, saveGongBiWork } from '../services/authApi'

// 路由
const router = useRouter()
const route = useRoute()

// 状态
const activeTab = ref<'login' | 'register'>('login')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 表单数据
const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 切换tab时清空消息
watch(activeTab, () => {
  errorMessage.value = ''
  successMessage.value = ''
})

// 返回首页
const goHome = () => {
  router.push('/')
}

// 检测并保存未登录时生成的共笔作品
const checkAndSavePendingWork = async () => {
  try {
    const pendingWorkStr = localStorage.getItem('pending_gongbi_work')
    if (!pendingWorkStr) {
      return
    }
    
    const pendingWork = JSON.parse(pendingWorkStr)
    const { poem, urlParams, timestamp } = pendingWork
    
    // 检查是否过期（30分钟 = 1800000毫秒）
    const now = Date.now()
    const expireTime = 30 * 60 * 1000
    if (now - timestamp > expireTime) {
      console.log('[LoginView] 临时数据已过期，清除')
      localStorage.removeItem('pending_gongbi_work')
      return
    }
    
    console.log('[LoginView] 检测到未保存的共笔作品，开始保存')
    
    // 构造保存数据
    const sourcePoemId = `zhou_${urlParams.chapter}_${urlParams.poem}`
    const mappingId = `${urlParams.chapter}_${urlParams.pattern}`
    
    const result = await saveGongBiWork({
      sourcePoemId,
      mappingId,
      userInput: poem.userFeeling,
      poemTitle: poem.title,
      poemContent: poem.content,
      poemQuote: poem.quote || null,
      poemQuoteSource: poem.quoteSource || null,
      conversationId: poem.metadata?.conversationId || '',
      messageId: poem.metadata?.messageId || '',
      usageMetadata: poem.metadata || {}
    })
    
    if (result.success) {
      console.log('[LoginView] 临时作品保存成功')
      localStorage.removeItem('pending_gongbi_work')
    } else {
      console.error('[LoginView] 临时作品保存失败:', result.error)
      // 保存失败不清除数据，下次登录还能尝试
    }
  } catch (err) {
    console.error('[LoginView] 处理临时作品异常:', err)
  }
}

// 处理登录
const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await login({
      username: loginForm.value.username,
      password: loginForm.value.password
    })

    if (response.success && response.token) {
      // 保存token
      saveToken(response.token)
      
      // 检测并保存未登录时生成的共笔作品
      await checkAndSavePendingWork()
      
      // 跳转：如果有redirect参数，跳转到指定页面；否则跳转到我的作品
      const redirect = route.query.redirect as string
      router.push(redirect || '/my-works')
    } else {
      errorMessage.value = response.error || '登录失败'
    }
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败'
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // 前端验证
  if (registerForm.value.username.length < 3 || registerForm.value.username.length > 20) {
    errorMessage.value = '用户名必须是3-20个字符'
    return
  }

  if (registerForm.value.password.length < 6) {
    errorMessage.value = '密码至少需要6个字符'
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = '两次密码输入不一致'
    return
  }

  loading.value = true

  try {
    const response = await register({
      username: registerForm.value.username,
      password: registerForm.value.password,
      confirmPassword: registerForm.value.confirmPassword
    })

    if (response.success) {
      successMessage.value = '注册成功！正在跳转到登录...'
      
      // 清空注册表单
      registerForm.value = {
        username: '',
        password: '',
        confirmPassword: ''
      }
      
      // 2秒后切换到登录tab
      setTimeout(() => {
        activeTab.value = 'login'
        successMessage.value = ''
        // 将注册的用户名填入登录表单
        loginForm.value.username = registerForm.value.username
      }, 2000)
    } else {
      errorMessage.value = response.error || '注册失败'
    }
  } catch (error: any) {
    errorMessage.value = error.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 容器 */
.login-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 返回按钮 */
.back-button-container {
  position: absolute;
  top: 2rem;
  left: 2rem;
}

.back-home-btn {
  background: transparent;
  border: 1px solid var(--color-primary-300);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.back-home-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--color-brand-primary);
  transform: translateX(-2px);
}

/* 登录卡片 */
.login-card {
  max-width: 450px;
  width: 100%;
  padding: 3rem 2.5rem;
}

/* 页面标题 */
.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 0.05em;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-tertiary);
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 400;
}

/* Tab切换 */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-primary-200);
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-tertiary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  margin-bottom: -2px;
}

.tab-button:hover {
  color: var(--text-secondary);
}

.tab-button.active {
  color: var(--color-brand-primary);
  border-bottom-color: var(--color-brand-primary);
}

/* 表单 */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-primary-300);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  transition: all var(--duration-fast) var(--ease-out);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-brand-primary);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(39, 73, 73, 0.1);
}

.form-group input:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

/* 按钮 */
.btn-primary {
  padding: 0.875rem 2rem;
  background: linear-gradient(145deg, var(--color-brand-dark), #1a2e2e);
  color: var(--text-light);
  border: 1px solid #1a2e2e;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(145deg, #1a2e2e, #0f1a1a);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 消息提示 */
.error-message {
  color: #dc2626;
  font-size: var(--font-size-sm);
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border-left: 3px solid #dc2626;
  border-radius: 0.25rem;
}

.success-message {
  color: #16a34a;
  font-size: var(--font-size-sm);
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(22, 163, 74, 0.1);
  border-left: 3px solid #16a34a;
  border-radius: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .back-button-container {
    top: 1rem;
    left: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
  }
}
</style>

