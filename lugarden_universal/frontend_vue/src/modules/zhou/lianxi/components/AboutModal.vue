<script setup lang="ts">
/**
 * About弹窗组件
 * 用于展示周与春秋项目介绍内容
 * 设计参考: modules/mao/moshi/components/PoemViewer.vue
 */

import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  isOpen: boolean
  title?: string
  variant?: 'about' | 'author'  // about=项目介绍, author=作者理念
}>()

const emit = defineEmits<{
  close: []
}>()

// PPT简短版内容
const aboutContent = {
  headline: '「周与春秋练习」',
  tagline: '基于AI技术的第一部开放性诗集',
  keywords: '命理学 ｜ 疗愈 ｜ 当代人的精神互助',
  intro: '吴任几历时五年的沉淀之作，融合中国原生信仰与现代生活体验。引导用户从"阅读"到"创造"，从"感悟"到"存在"的完整美学旅程。',
  features: [
    {
      id: 'divination',
      title: 'I. 占卜式阅读',
      description: '基于个人当下状态的说明书，每个人都可以成为周易大师'
    },
    {
      id: 'cocreation',
      title: 'II. 瞬时共创',
      description: '将灵感告诉AI，通过算法解构与再生，即时共创专属诗歌'
    },
    {
      id: 'digital-art',
      title: 'III. 数字存在艺术',
      description: '诗歌作为可留存或流转的数字痕迹，赋予永恒艺术生命'
    }
  ]
}

// 作者理念内容
const authorContent = {
  headline: '关于诗人：吴任几',
  intro: '《周与春秋练习》是吴任几历时五年的沉淀之作。',
  philosophy: {
    title: '创作理念',
    content: '融合中国原生信仰（周易卦象）与现代生活体验，打破传统阅读的边界，让诗歌成为"回答"而非"阅读物"。'
  },
  features: {
    title: '陆家花园实现的Feature',
    items: [
      '占卜式问答 — 通过问题匹配专属诗歌',
      '诗人解读 — "最好不要点"的神秘按钮',
      '瞬时共创 — AI驱动的即时诗歌生成（规划中）'
    ]
  }
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

          <!-- About项目介绍 -->
          <div v-if="variant !== 'author'" class="modal-body">
            <h2 class="modal-headline">{{ aboutContent.headline }}</h2>
            <p class="modal-tagline">{{ aboutContent.tagline }}</p>
            <p class="modal-keywords">{{ aboutContent.keywords }}</p>
            
            <p class="modal-intro">{{ aboutContent.intro }}</p>
            
            <div class="features-section">
              <p class="features-title">◆ 三大核心体验 ◆</p>
              <div 
                v-for="feature in aboutContent.features" 
                :key="feature.id"
                class="feature-item"
              >
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-desc">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- Author作者理念 -->
          <div v-else class="modal-body">
            <h2 class="modal-headline">{{ authorContent.headline }}</h2>
            <p class="modal-intro">{{ authorContent.intro }}</p>
            
            <div class="philosophy-section">
              <p class="section-title">◆ {{ authorContent.philosophy.title }} ◆</p>
              <p class="section-content">{{ authorContent.philosophy.content }}</p>
            </div>
            
            <div class="features-section">
              <p class="section-title">◆ {{ authorContent.features.title }} ◆</p>
              <ul class="feature-list">
                <li 
                  v-for="(item, index) in authorContent.features.items" 
                  :key="index"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
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
