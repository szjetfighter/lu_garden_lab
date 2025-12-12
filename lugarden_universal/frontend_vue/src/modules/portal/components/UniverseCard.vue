<template>
  <div 
    class="universe-card animate-fadeInUp"
    :class="{ 'card-disabled': !isActive, 'has-bg-image': backgroundImage }"
    :style="cardStyle"
    @click="handleCardClick"
  >
    <!-- 内容遮罩层 -->
    <div class="content-overlay">
      <!-- 内容区域 - 使用flex-1占据剩余空间 -->
      <div class="flex-1">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-2xl font-bold text-gray-800 m-0">{{ universe.name }}</h3>
          <span class="universe-status" :class="universe.status">
            {{ statusText }}
          </span>
        </div>
        <p class="text-base text-gray-600 mb-4 whitespace-pre-line leading-loose">{{ universe.description }}</p>
      </div>
      
      <!-- 底部区域 - Meta文字与按钮左右对齐 -->
      <div class="flex justify-between items-center mt-4">
        <p class="text-xs text-gray-500 m-0">{{ universe.meta }}</p>
        <button 
          class="enter-button"
          :disabled="!isActive"
          @click.stop="handleEnterClick"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Universe, UniverseCardEvents } from '@/modules/portal/types'

// Props定义
interface Props {
  universe: Universe
  disabled?: boolean
  index?: number
  backgroundImage?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  index: 0,
  backgroundImage: ''
})

// 事件定义
const emit = defineEmits<UniverseCardEvents>()

// 计算属性
const cardStyle = computed(() => {
  const style: Record<string, string> = {
    animationDelay: `${props.index * 0.1}s`
  }
  if (props.backgroundImage) {
    style['--card-bg-image'] = `url(${props.backgroundImage})`
  }
  return style
})

const isActive = computed(() => {
  return props.universe.status === 'published' && !props.disabled
})

const statusText = computed(() => {
  const statusMap: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    maintenance: '维护中'
  }
  return statusMap[props.universe.status] || '未知'
})

const buttonText = computed(() => {
  if (!isActive.value) {
    return props.universe.status === 'draft' ? '敬请期待' : '暂不可用'
  }
  return '进入宇宙'
})

// 事件处理
const handleCardClick = () => {
  emit('click', props.universe)
}

const handleEnterClick = () => {
  if (isActive.value) {
    emit('enter', props.universe)
  }
}
</script>

<style scoped>
/* 卡片包装器 - 确保flex布局生效 */
.universe-card-wrapper {
  height: 100%;
}

/* 宇宙卡片样式 - 与Zhou统一的玻璃态设计 */
.universe-card {
  /* 默认背景（无图片时） */
  /* 玻璃态背景 - 与Zhou的unified-content-card一致 */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.6) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-base); /* 8px */
  padding: var(--spacing-base); /* 1rem = 16px */
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  min-height: 200px;
  
  /* Flex布局 - 与Zhou完全一致 */
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 带背景图的卡片样式 - 玻璃态 + 底图叠加 */
/* 对角线渐变遮罩：右下角透明(背景图清晰) → 左上角不透明(背景图被遮盖) */
.universe-card.has-bg-image {
  background: 
    linear-gradient(
      to top left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 30%,
      rgba(255, 255, 255, 0.6) 60%,
      rgba(255, 255, 255, 0.8) 100%
    ),
    var(--card-bg-image) center/cover no-repeat;
}

/* 内容遮罩层 - 默认透明 */
.content-overlay {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 有背景图时 - 给内容遮罩层加磨砂效果 */
.universe-card.has-bg-image .content-overlay {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
  padding: 1rem;
}

.universe-card:hover:not(.card-disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.universe-card.card-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 内容区域 - 占据剩余空间 */
.card-content {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.universe-name {
  font-size: var(--font-size-2xl); /* 与Zhou的h2一致 */
  font-weight: 700;
  color: var(--text-primary); /* #1f2937 */
  margin: 0;
}

.universe-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.universe-status.active {
  background: #c6f6d5;
  color: #22543d;
}

.universe-status.developing {
  background: #feebc8;
  color: #c05621;
}

.universe-status.maintenance {
  background: #fed7d7;
  color: #c53030;
}

.universe-status.archived {
  background: #e2e8f0;
  color: #4a5568;
}

.universe-description {
  color: var(--text-tertiary); /* #6b7280 - 与Zhou统一 */
  font-size: var(--font-size-base); /* 继承body字号，与Zhou一致：clamp(1rem, 3vw, 1.125rem) */
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-line;
}

.universe-meta {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs); /* 等比例缩小：14px，与Zhou的text-sm一致 */
  margin: 0;
}

/* 底部区域 - Meta文字与按钮左右对齐，纵向居中 */
.card-footer {
  display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 纵向居中 */
  margin-top: 1rem; /* 与Zhou的mt-4一致 */
}

.enter-button {
  /* 与Zhou btn-primary完全一致的深灰色渐变 */
  background: linear-gradient(to bottom right, var(--color-primary-600), var(--color-primary-700));
  color: var(--text-light);
  border: 1px solid var(--color-primary-700);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  box-shadow: var(--shadow-base);
  min-width: 100px;
  min-height: 36px;
}

.enter-button:hover:not(:disabled) {
  background: linear-gradient(to bottom right, var(--color-primary-700), var(--color-primary-800));
  transform: translateY(-0.125rem);
  box-shadow: var(--shadow-md);
}

.enter-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.enter-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .universe-card {
    padding: 1.5rem;
    /* 继承PC端的min-height: 280px */
  }
  
  .universe-name {
    font-size: 1.25rem;
  }
  
  /* 移动端保持Meta文字与按钮左右对齐 */
  .card-footer {
    justify-content: space-between;
  }
}
</style>
