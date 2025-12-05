<script setup lang="ts">
/**
 * 第二层确认页 - 手动输入确认
 * 继承whoiszd-theme深色主题样式
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
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="zd-card max-w-lg w-full px-8 py-10 animate-fadeInUp">
      <!-- 标题 -->
      <h2 class="text-xl mb-8 text-center text-zd-light flex items-center justify-center gap-2">
        <svg class="w-5 h-5 text-zd-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        内容边界声明
      </h2>
      
      <!-- 不涉及的内容 -->
      <div class="mb-8 text-center">
        <p class="text-zd-muted mb-2">本模块不涉及以下内容：</p>
        <div class="text-zd-text leading-8">
          <p>恐怖或血腥</p>
          <p>宗教敏感</p>
          <p>性别歧视</p>
          <p>种族议题</p>
          <p>色情或暴力</p>
        </div>
      </div>

      <!-- 可能包含的内容 -->
      <div class="mb-8 text-center">
        <p class="text-zd-muted mb-2">但可能包含：</p>
        <div class="text-zd-text leading-8">
          <p>俚语、俗语</p>
          <p>阴阳怪气</p>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="zd-divider my-8"></div>

      <!-- 手动输入确认 -->
      <div class="text-center">
        <p class="text-zd-muted mb-4">请手动输入以下文字确认进入：</p>
        <p class="text-zd-accent mb-4 font-medium">{{ REQUIRED_TEXT }}</p>
        
        <input
          v-model="inputText"
          type="text"
          class="zd-input w-full mb-6"
          :placeholder="REQUIRED_TEXT"
          @keyup.enter="handleConfirm"
        />

        <button
          :disabled="!isMatched"
          :class="isMatched ? 'zd-btn-primary' : 'zd-btn-disabled'"
          @click="handleConfirm"
        >
          进入
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 继承whoiszd-theme的CSS变量 */

.zd-divider {
  border-top: 1px solid var(--zd-border, rgba(55, 65, 81, 0.5));
}

.zd-input {
  padding: 0.75rem 1rem;
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid var(--zd-border, rgba(55, 65, 81, 0.5));
  border-radius: var(--radius-base, 8px);
  color: var(--zd-text-light, #ffffff);
  text-align: center;
  font-size: var(--font-size-base);
  transition: all var(--duration-normal, 0.3s) var(--ease-out);
}

.zd-input:focus {
  outline: none;
  border-color: var(--zd-accent, #d97706);
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
}

.zd-input::placeholder {
  color: var(--zd-text-muted, #6b7280);
}

.zd-btn-disabled {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 120px;
  padding: 0.75rem 2rem;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--zd-text-muted, #6b7280);
  background: rgba(55, 65, 81, 0.4);
  border: 1px solid var(--zd-border, rgba(55, 65, 81, 0.5));
  border-radius: var(--radius-base, 8px);
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
