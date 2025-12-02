<script setup lang="ts">
/**
 * 作者简介弹窗组件
 * 用于展示吴任几的作者简介
 * 设计参考: modules/mao/moshi/components/PoemViewer.vue
 */

import { XMarkIcon } from '@heroicons/vue/24/outline'
import authorPhoto from '@/modules/zhou/lianxi/assets/images/author@0.3x.png'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 作者简介内容
const authorContent = {
  name: '吴任几',
  bio: '诗人，1997年出生于上海，毕业于英国利兹大学社会学院。曾获复旦大学光华诗歌奖等荣誉。诗歌作品刊登于《诗刊》《星星》《上海文学》《作品》等，收入《中国诗歌2019年度精选》（人民文学出版社）、《2018—2019中国新诗年鉴》（四川民族出版社）、《Poems From Chinese Millennials》(New Zealand: Wai-te-ata Press)等多本年鉴。'
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
            <img :src="authorPhoto" alt="吴任几" class="author-photo" />
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

.modal-headline {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
}

.modal-tagline {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.modal-keywords {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.modal-intro {
  font-size: 0.9375rem;
  color: #2d3748;
  line-height: 1.8;
  text-align: left;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.features-section,
.philosophy-section {
  text-align: left;
  margin-top: 1.5rem;
}

.features-title,
.section-title {
  font-size: 0.875rem;
  color: #1a365d;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.feature-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.feature-desc {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.6;
}

.section-content {
  font-size: 0.9375rem;
  color: #2d3748;
  line-height: 1.8;
  padding: 0 0.5rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  font-size: 0.9375rem;
  color: #2d3748;
  line-height: 1.8;
  padding: 0.5rem 0;
  padding-left: 1rem;
  position: relative;
}

.feature-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #1a365d;
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
  margin: 0 auto var(--spacing-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.author-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.author-bio {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.8;
  text-align: justify;
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
