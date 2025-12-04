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

      <div class="flex items-center justify-center min-h-[60vh]">
        <div class="unified-content-card rounded-base animate-fadeInUp max-w-md w-full text-center">
          <h1 class="text-2xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            授权验证
          </h1>
          
          <div class="mb-6">
            <input 
              v-model="authCode"
              type="text"
              placeholder="请输入授权码"
              class="w-full px-4 py-3 border border-gray-300 rounded-base text-center text-lg focus:outline-none focus:border-gray-500 transition-colors"
              :class="{ 'border-red-400 bg-red-50': showError }"
              @keyup.enter="verify"
              @input="showError = false"
            />
            <p v-if="showError" class="text-red-500 text-sm mt-2 animate-fadeInUp">
              授权码错误，请重新输入
            </p>
          </div>
          
          <button 
            class="btn-primary w-full"
            @click="verify"
          >
            验证
          </button>
          
          <p class="text-xs text-gray-500 mt-6">
            <a 
              href="#" 
              class="auth-link"
              @click.prevent="showModal1 = true"
            >此处获取授权码</a>
          </p>
        </div>
      </div>
    </div>
    
    <!-- 第一层弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showModal1" 
          class="modal-overlay"
          @click.self="showModal1 = false"
        >
          <div class="modal-content">
            <div class="modal-body">
              <h2 class="modal-title">陆家明</h2>
              <p class="modal-text">
                授权码由 © 陆家花园 管理团队发放<br />
                请<a 
                  href="#" 
                  class="auth-link"
                  @click.prevent="showModal2 = true; showModal1 = false"
                >联系西尔/吴任几/阿栋</a>获取
              </p>
              <button class="modal-button" @click="showModal1 = false">
                知道了
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- 第二层弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showModal2" 
          class="modal-overlay"
          @click.self="showModal2 = false"
        >
          <div class="modal-content">
            <div class="modal-body">
              <h2 class="modal-title">陆家明</h2>
              <p class="modal-text">我也不知道他们的联系方式<br />要么你自己想想办法？</p>
              <button class="modal-button" @click="showModal2 = false">
                好吧
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/shared/components/BackButton.vue'

const router = useRouter()

// 授权码SHA-256哈希值 - 源代码中不暴露明文授权码
// 逆向者只能看到哈希，无法直接获取原始授权码
const CORRECT_HASH = '13d3eea6e1177a18b819ad753b5f98c3d43de92fe988b3316c74e58ea82c56d5'
const STORAGE_KEY = 'pending_authorized'

const authCode = ref('')
const showError = ref(false)
const showModal1 = ref(false)
const showModal2 = ref(false)

// SHA-256哈希函数
async function hashCode(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str.toLowerCase())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 检查是否已授权
onMounted(() => {
  const authorized = localStorage.getItem(STORAGE_KEY)
  if (authorized === 'true') {
    // 已授权，直接进入
    router.replace('/pending/home')
  }
})

// 返回门户
const goBack = () => {
  router.push('/')
}

// 验证授权码（哈希对比，不暴露明文）
const verify = async () => {
  const inputHash = await hashCode(authCode.value)
  if (inputHash === CORRECT_HASH) {
    // 验证通过，记录状态并跳转
    localStorage.setItem(STORAGE_KEY, 'true')
    router.replace('/pending/home')
  } else {
    // 验证失败
    showError.value = true
  }
}
</script>

<style scoped>
/* 授权码链接样式 */
.auth-link {
  font-weight: 600;
  text-decoration: underline;
  color: inherit;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #374151;
}

/* 弹窗样式 - 参考AboutModal.vue */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 24rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-body {
  text-align: center;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
}

.modal-text {
  font-size: 1.125rem;
  color: #4b5563;
  line-height: 2;
  margin-bottom: 2.5rem;
}

.modal-button {
  padding: 0.75rem 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: #1f2937;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-button:hover {
  background: #374151;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
