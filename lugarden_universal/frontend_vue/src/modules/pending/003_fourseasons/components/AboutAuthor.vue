<script setup lang="ts">
/**
 * 作者简介弹窗组件
 * 用于展示施岳宏的作者简介
 * 参考: modules/zhou/001_lianxi/components/AboutModal.vue
 */

import { XMarkIcon } from '@heroicons/vue/24/outline'
import authorPhoto from '../assets/image/author.webp'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 作者简介内容
const authorContent = {
  name: '施岳宏',
  bio: `2000年生于广州
上大·戴望舒新诗工场成员
获光华诗歌奖（2024）、顶度诗歌奖（2024）
本名是姥姥取的所以没起笔名
热爱好猫
有公众号"舍取林"`
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
            <img :src="authorPhoto" alt="施岳宏" class="author-photo" />
            <h2 class="author-name">{{ authorContent.name }}</h2>
            <p class="author-bio">{{ authorContent.bio }}</p>
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

/* 作者简介样式 */
.author-body {
  text-align: left;
}

.author-photo {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto var(--spacing-lg, 1.5rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
