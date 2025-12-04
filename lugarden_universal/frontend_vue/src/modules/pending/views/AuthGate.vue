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
          
          <p class="text-gray-600 mb-6">
            此区域需要授权码访问
          </p>
          
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
        </div>
      </div>
    </div>
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
