<script setup lang="ts">
/**
 * 惩罚/终止页面 - 连续错误3次后显示
 * 继承whoiszd-theme深色主题样式
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCooldown } from '../composables/useCooldown'

const router = useRouter()
const { setCooldown } = useCooldown()

// 逐行显示
const showLine1 = ref(false)
const showLine2 = ref(false)
const showLine3 = ref(false)
const showSmirk = ref(false)

onMounted(() => {
  // 设置冷却状态
  setCooldown()
  
  // 逐行显示动画
  setTimeout(() => showLine1.value = true, 100)
  setTimeout(() => showLine2.value = true, 1100)
  setTimeout(() => showLine3.value = true, 2100)
  setTimeout(() => showSmirk.value = true, 4100)
  
  // 6秒后强制跳转到pending入口
  setTimeout(() => {
    router.push('/pending/home')
  }, 6000)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <p 
        class="text-xl text-zd-light mb-4 reveal-line"
        :class="{ 'revealed': showLine1 }"
      >
        朋友，你似乎不具备
      </p>
      <p 
        class="text-xl text-zd-light mb-8 reveal-line"
        :class="{ 'revealed': showLine2 }"
      >
        鉴别诗人和机器的能力
      </p>
      <p 
        class="text-lg text-zd-muted reveal-line"
        :class="{ 'revealed': showLine3 }"
      >
        呼，真遗憾呢
      </p>
      <p 
        class="text-4xl mt-8 reveal-line"
        :class="{ 'revealed': showSmirk }"
      >
        😏
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 逐行显示动画 */
.reveal-line {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.reveal-line.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
