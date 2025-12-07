<script setup lang="ts">
/**
 * 作者简介弹窗组件
 * 用于展示冯铗的作者简介
 */

import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 作者简介内容
const authorContent = {
  name: '冯铗',
  bio: `▉▉ ▉▉▉▉ ▉▉ ▉▉ ▉▉▉▉▉ ▉ ▉▉▉`,
  notice: '陆家明：尚未获得诗人授权，属于先斩后奏'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="about-modal-overlay"
        @click.self="emit('close')"
      >
        <div class="about-modal-content">
          <!-- 关闭按钮 -->
          <button class="close-button" @click="emit('close')">
            <XMarkIcon class="w-6 h-6" />
          </button>

          <!-- 作者简介 -->
          <div class="modal-body author-body">
            <div class="author-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" class="ban-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <h2 class="author-name">{{ authorContent.name }}</h2>
            <p class="author-bio">{{ authorContent.bio }}</p>
            <p class="author-notice">{{ authorContent.notice }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.about-modal-overlay {
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

.about-modal-content {
  position: relative;
  width: 100%;
  max-width: 32rem;
  max-height: 80vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.modal-body {
  text-align: center;
}

.author-body {
  text-align: left;
}

/* 无照片时的头像占位 */
.author-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg, 1.5rem);
  background: #1a1a1a;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ban-icon {
  width: 64px;
  height: 64px;
}

.author-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: var(--spacing-lg, 1.5rem);
  text-align: center;
}

.author-bio {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;
}

.author-notice {
  font-size: 0.75rem;
  color: var(--text-tertiary, #9ca3af);
  text-align: center;
  margin-top: var(--spacing-lg, 1.5rem);
  font-style: italic;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .about-modal-content,
.modal-leave-active .about-modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .about-modal-content,
.modal-leave-to .about-modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
