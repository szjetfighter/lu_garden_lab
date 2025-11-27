<script setup lang="ts">
/**
 * 诗节展示组件
 */

import { computed } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'

const store = useMoshiStore()

const stanza = computed(() => store.currentStanza)
const isVisible = computed(() => store.isWin && stanza.value)

// 格式化诗节内容，保留换行
const formattedContent = computed(() => {
  if (!stanza.value) return ''
  return stanza.value.content
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
        <span class="poem-id">{{ stanza?.poemId }}</span>
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

.poem-id {
  color: #a09080;
  font-size: 0.8rem;
  font-style: italic;
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
