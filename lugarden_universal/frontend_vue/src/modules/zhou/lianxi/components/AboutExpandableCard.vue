<script setup lang="ts">
/**
 * 可展开的About卡片组件
 * 用于MainProjectSelection页面，展示项目介绍
 * 风格：神秘感，类似"最好不要点"
 */

import { ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// PPT简短版内容
const content = {
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
</script>

<template>
  <div 
    class="about-expandable-card rounded-base"
    :class="{ 'unified-content-card': isExpanded, 'collapsed-transparent': !isExpanded }"
  >
    <!-- 可点击的标题区域 -->
    <button 
      class="card-header"
      @click="toggleExpand"
    >
      <span class="card-title">about周与春秋练习</span>
      <component 
        :is="isExpanded ? ChevronUpIcon : ChevronDownIcon" 
        class="w-5 h-5 chevron-icon"
      />
    </button>

    <!-- 可展开的内容区域 -->
    <Transition name="expand">
      <div v-if="isExpanded" class="card-content">
        <div class="content-inner">
          <h3 class="content-headline">{{ content.headline }}</h3>
          <p class="content-tagline">{{ content.tagline }}</p>
          <p class="content-keywords">{{ content.keywords }}</p>
          
          <p class="content-intro">{{ content.intro }}</p>
          
          <div class="features-section">
            <p class="features-title">◆ 三大核心体验 ◆</p>
            <div 
              v-for="feature in content.features" 
              :key="feature.id"
              class="feature-item"
            >
              <h4 class="feature-title">{{ feature.title }}</h4>
              <p class="feature-desc">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 基础样式 */
.about-expandable-card {
  min-height: auto;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 折叠时完全透明 */
.collapsed-transparent {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
}

.card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.card-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.card-title {
  font-size: 0.9375rem;
  color: #64748b;
  font-style: italic;
  letter-spacing: 0.05em;
}

.chevron-icon {
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.card-content {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.content-inner {
  padding: 1.5rem;
  text-align: center;
}

.content-headline {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a365d;
  margin-bottom: 0.5rem;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
}

.content-tagline {
  font-size: 0.9375rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.content-keywords {
  font-size: 0.8125rem;
  color: #718096;
  margin-bottom: 1.25rem;
}

.content-intro {
  font-size: 0.875rem;
  color: #2d3748;
  line-height: 1.8;
  text-align: left;
  margin-bottom: 1.25rem;
}

.features-section {
  text-align: left;
  margin-top: 1rem;
}

.features-title {
  font-size: 0.8125rem;
  color: #1a365d;
  text-align: center;
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}

.feature-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.125rem;
}

.feature-desc {
  font-size: 0.8125rem;
  color: #4a5568;
  line-height: 1.5;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
