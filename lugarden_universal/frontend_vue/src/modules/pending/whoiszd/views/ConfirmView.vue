<script setup lang="ts">
/**
 * 第二层确认页 - 手动输入确认
 */

import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'confirmed'): void
}>()

const REQUIRED_TEXT = '我已仔细阅读并确认进入'
const inputText = ref('')

const isMatched = computed(() => inputText.value === REQUIRED_TEXT)

function handleConfirm() {
  if (isMatched.value) {
    emit('confirmed')
  }
}
</script>

<template>
  <div class="confirm-view min-h-screen bg-black text-white flex items-center justify-center px-6">
    <div class="max-w-lg w-full">
      <!-- 标题 -->
      <h2 class="text-xl mb-8 text-center text-gray-300">📋 内容边界声明</h2>
      
      <!-- 不涉及的内容 -->
      <div class="mb-6">
        <p class="text-gray-400 mb-3">本模块不涉及以下内容：</p>
        <ul class="space-y-2 text-gray-500">
          <li class="flex items-center gap-2">
            <span class="text-red-500">✗</span>
            <span>恐怖或血腥</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-red-500">✗</span>
            <span>宗教敏感</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-red-500">✗</span>
            <span>性别歧视</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-red-500">✗</span>
            <span>种族议题</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-red-500">✗</span>
            <span>色情或暴力</span>
          </li>
        </ul>
      </div>

      <!-- 可能包含的内容 -->
      <div class="mb-8">
        <p class="text-gray-400 mb-3">但可能包含：</p>
        <ul class="space-y-2 text-gray-500">
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            <span>俚语、俗语</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            <span>非传统的艺术表达</span>
          </li>
        </ul>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-gray-800 my-8"></div>

      <!-- 手动输入确认 -->
      <div class="text-center">
        <p class="text-gray-400 mb-4">请手动输入以下文字确认进入：</p>
        <p class="text-amber-400 mb-4 font-medium">{{ REQUIRED_TEXT }}</p>
        
        <input
          v-model="inputText"
          type="text"
          class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-center mb-6 focus:outline-none focus:border-amber-500 transition-colors"
          :placeholder="REQUIRED_TEXT"
          @keyup.enter="handleConfirm"
        />

        <button
          :disabled="!isMatched"
          :class="[
            'px-8 py-3 rounded transition-all duration-300',
            isMatched 
              ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          ]"
          @click="handleConfirm"
        >
          进入
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-view {
  font-family: 'Noto Serif SC', serif;
}
</style>
