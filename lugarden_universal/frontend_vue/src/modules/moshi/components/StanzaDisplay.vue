<script setup lang="ts">
/**
 * 诗节展示组件
 */

import { computed } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'

const store = useMoshiStore()

const stanza = computed(() => store.currentStanza)
// 只在中奖且不在动画中时显示
const isVisible = computed(() => store.isWin && stanza.value && !store.isSpinning)

// 格式化诗节内容，保留换行
const formattedContent = computed(() => {
  if (!stanza.value) return ''
  return stanza.value.content
})

// 数字转中文
const numberToChinese = (num: number): string => {
  const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  if (num <= 10) return chars[num]
  if (num < 20) return '十' + (num % 10 === 0 ? '' : chars[num % 10])
  const tens = Math.floor(num / 10)
  const ones = num % 10
  return chars[tens] + '十' + (ones === 0 ? '' : chars[ones])
}

// 格式化出处：诗名 · 一
const formattedSource = computed(() => {
  if (!stanza.value) return ''
  const title = stanza.value.poem?.title || stanza.value.poemId
  const index = numberToChinese(stanza.value.index || 1)
  return `${title} · ${index}`
})
</script>

<template>
  <Transition name="fade-slide">
    <div v-if="isVisible" class="stanza-display">
      <div class="stanza-header">
        <span class="stanza-icon">📜</span>
        <span class="stanza-label">你摸到了一节诗</span>
      </div>
      
      <div class="stanza-content">
        <p class="stanza-text">{{ formattedContent }}</p>
      </div>
      
      <div class="stanza-footer">
        <span class="poem-source">{{ formattedSource }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.stanza-display {
  width: 100%;
  max-width: 500px;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f0e6 0%, #ebe5d6 100%);
  border-radius: 0.75rem;
  border-left: 4px solid #c49b66;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stanza-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #d5cfc0;
}

.stanza-icon {
  font-size: 1.25rem;
}

.stanza-label {
  color: #8b7355;
  font-size: 0.9rem;
  font-weight: 500;
}

.stanza-content {
  padding: 0.5rem 0;
}

.stanza-text {
  color: #2a2a2a;
  font-size: 1.1rem;
  line-height: 2;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
  white-space: pre-wrap;
  margin: 0;
}

.stanza-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #d5cfc0;
  text-align: right;
}

.poem-source {
  color: #8b7355;
  font-size: 0.85rem;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
