<script setup lang="ts">
/**
 * 惩罚/终止页面 - 连续错误5次后显示
 */

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCooldown } from '../composables/useCooldown'

const router = useRouter()
const { setCooldown } = useCooldown()

onMounted(() => {
  // 设置冷却状态
  setCooldown()
  
  // 3秒后强制跳转到pending入口
  setTimeout(() => {
    router.push('/pending/newarrival')  // 暂时跳转到newarrival，后续可改为pending入口
  }, 3000)
})
</script>

<template>
  <div class="terminated-view min-h-screen bg-black text-white flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <p class="text-xl text-gray-300 mb-4">
        朋友，你似乎不具备
      </p>
      <p class="text-xl text-gray-300 mb-8">
        鉴别诗人和机器的能力
      </p>
      <p class="text-lg text-gray-500">
        呼，真遗憾呢
      </p>
    </div>
  </div>
</template>

<style scoped>
.terminated-view {
  font-family: 'Noto Serif SC', serif;
}
</style>
