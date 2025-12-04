<script setup lang="ts">
/**
 * 结算揭示页 - 游戏完成后显示统计和真相
 */

import { useRouter } from 'vue-router'

const props = defineProps<{
  yesCount: number
  noCount: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const router = useRouter()

function handleRestart() {
  emit('restart')
}

function handleReturn() {
  router.push('/')
}
</script>

<template>
  <div class="result-view min-h-screen bg-black text-white flex items-center justify-center px-6">
    <div class="max-w-lg w-full text-center">
      <!-- 标题 -->
      <h1 class="text-2xl mb-8 text-gray-300">游 戏 结 束</h1>

      <!-- 统计数据 -->
      <div class="bg-gray-900 rounded-lg p-6 mb-8">
        <p class="text-gray-400 mb-2">
          你认为「是臧棣」的次数：<span class="text-amber-400 text-xl">{{ yesCount }}</span>
        </p>
        <p class="text-gray-400">
          你认为「不是」的次数：<span class="text-green-400 text-xl">{{ noCount }}</span>
        </p>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-gray-800 my-8"></div>

      <!-- 真相揭示 -->
      <div class="mb-8">
        <h2 class="text-xl text-amber-400 mb-6">真 相 揭 示</h2>
        
        <p class="text-gray-300 mb-4">
          这{{ total }}首诗，全部由陆家明AI生成。
        </p>
        <p class="text-gray-300 mb-6">
          没有一首是臧棣写的。
        </p>

        <div class="border-t border-gray-800 my-6"></div>

        <p class="text-gray-500 mb-2">
          你选择「是」的{{ yesCount }}次，
        </p>
        <p class="text-gray-500 mb-2">
          意味着你认为AI成功模仿了臧棣。
        </p>
        <p class="text-gray-500 mb-6">
          或者，你只是在猜。
        </p>

        <p class="text-gray-600 text-sm">
          无论如何，感谢参与这场实验。
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center gap-4">
        <button
          class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
          @click="handleRestart"
        >
          再来一次
        </button>
        <button
          class="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
          @click="handleReturn"
        >
          返回陆家花园
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-view {
  font-family: 'Noto Serif SC', serif;
}
</style>
