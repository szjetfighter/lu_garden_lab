<script setup lang="ts">
/**
 * 可展开的About卡片组件
 * 用于MainProjectSelection页面，展示项目介绍
 * 风格：神秘感，类似"最好不要点"
 */

import { ref } from 'vue'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// 导入Feature配图 (0.3x压缩版本)
import image1 from '@/modules/zhou/001_lianxi/assets/images/zhou_image1@0.3x.png'
import image2 from '@/modules/zhou/001_lianxi/assets/images/zhou_image2@0.3x.png'
import image3 from '@/modules/zhou/001_lianxi/assets/images/zhou_image3@0.3x.png'

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ''
}

// PPT简短版内容
const content = {
  headline: '「周与春秋练习」',
  tagline: '基于AI技术的第一部开放性诗集',
  keywords: '命理学 ｜ 疗愈 ｜ 当代人的精神互助',
  intro: '吴任几历时五年的沉淀之作，融合中国原生信仰与现代生活体验。引导读者从阅读到创造，从感悟到存在的完整美学旅程。',
  features: [
    {
      id: 'divination',
      title: 'I · 占卜式阅读',
      description: '基于个人当下状态的说明书，每个人都可以成为卜问大师',
      image: image1
    },
    {
      id: 'cocreation',
      title: 'II · 瞬时共创',
      description: '把灵感传递给陆家明——陆家花园的AI诗人，由TA创作即就诗歌，体验GEN世代共笔',
      image: image2
    },
    {
      id: 'digital-art',
      title: 'III · 数字存在艺术',
      description: '共笔诗歌作为可留存或流转的数字痕迹，赋予永恒艺术生命',
      image: image3
    }
  ]
}
</script>

<template>
  <div class="about-card-trigger">
    <!-- 可点击的标题区域 -->
    <button 
      class="card-header"
      @click="openModal"
    >
      <span class="card-title">About 周与春秋练习</span>
      <ChevronDownIcon class="w-5 h-5 chevron-icon" />
    </button>

    <!-- Modal弹窗 - 使用Teleport渲染到body，不干扰Swiper -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
          <div class="modal-content unified-content-card" @click.stop>
            <!-- 关闭按钮 -->
            <button class="modal-close" @click="closeModal">
              <XMarkIcon class="w-6 h-6" />
            </button>
            
            <div class="content-inner">
              <h3 class="content-headline">{{ content.headline }}</h3>
              <p class="content-tagline">{{ content.tagline }}</p>
              <p class="content-keywords">{{ content.keywords }}</p>
              
              <p class="content-intro">{{ content.intro }}</p>
              
              <div class="features-section">
                <div 
                  v-for="feature in content.features" 
                  :key="feature.id"
                  class="feature-item"
                >
                  <h4 class="feature-title">{{ feature.title }}</h4>
                  <p class="feature-desc">{{ feature.description }}</p>
                  <img 
                    v-if="feature.image" 
                    :src="feature.image" 
                    :alt="feature.title" 
                    class="feature-image"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* 触发按钮样式 */
.about-card-trigger {
  width: 100%;
}

.card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-base);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.card-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.card-title {
  font-size: 0.875rem;
  color: #6b7280;
  letter-spacing: 0.02em;
}

.chevron-icon {
  color: #6b7280;
  transition: transform 0.3s ease;
}

/* Modal遮罩层 - 参考AboutModal.vue */
.modal-overlay {
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

/* Modal内容 - 参考AboutModal.vue */
.modal-content {
  position: relative;
  width: 100%;
  max-width: 32rem;
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

/* 关闭按钮 - 参考AboutModal.vue */
.modal-close {
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

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.content-inner {
  padding: var(--spacing-xl);
  text-align: center;
}

/* 统一使用页面已有的字号和颜色 */
/* text-2xl=1.5rem, text-xl=1.25rem, text-base=1rem, text-sm=0.875rem, text-xs=0.75rem */
/* text-gray-800=#1f2937, text-gray-600=#4b5563, text-gray-500=#6b7280 */

.content-headline {
  font-size: 1.25rem;  /* text-xl */
  font-weight: 700;    /* font-bold */
  color: #1f2937;      /* text-gray-800 */
  margin-bottom: var(--spacing-base);
}

.content-tagline {
  font-size: 0.875rem; /* text-sm，与keywords一致 */
  color: #4b5563;      /* text-gray-600 */
  margin-bottom: var(--spacing-xs);
}

.content-keywords {
  font-size: 0.875rem; /* text-sm */
  color: #6b7280;      /* text-gray-500 */
  margin-bottom: var(--spacing-lg);
}

.content-intro {
  font-size: 0.875rem; /* text-sm，与feature-desc一致 */
  color: #4b5563;      /* text-gray-600 */
  line-height: 1.75;
  text-align: left;
  margin-bottom: var(--spacing-lg);
}

.features-section {
  text-align: left;
  margin-top: var(--spacing-lg);
}

.feature-item {
  padding: var(--spacing-base) 0;
  border-bottom: 1px solid #f1f5f9;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-title {
  font-size: 1rem;     /* text-base */
  font-weight: 600;    /* font-semibold */
  color: #1f2937;      /* text-gray-800 */
  margin-bottom: var(--spacing-xs);
  text-align: center;
}

.feature-desc {
  font-size: 0.875rem; /* text-sm */
  color: #4b5563;      /* text-gray-600 */
  line-height: 1.5;
}

.feature-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  margin-top: var(--spacing-base);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Modal动画 - 参考AboutModal.vue */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
