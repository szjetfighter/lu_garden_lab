<template>
  <div class="empty-state flex items-center justify-center text-center" :class="containerClass">
    <div class="empty-content unified-content-card animate-fadeInUp max-w-sm w-full">
      <!-- 图标 - 统一使用SVG -->
      <div class="mb-lg">
        <div v-if="!$slots.icon" class="mb-base">
          <component :is="displayIcon" class="w-12 h-12 mx-auto text-gray-400" aria-hidden="true" />
        </div>
        <slot name="icon"></slot>
      </div>
      
      <!-- 标题 -->
      <h3 class="text-heading-spaced text-gray-700">{{ title }}</h3>
      
      <!-- 描述文字 -->
      <p v-if="description" class="text-body-spaced text-gray-600">{{ description }}</p>
      
      <!-- 操作按钮 -->
      <div v-if="showAction || $slots.action" class="mb-base">
        <slot name="action">
          <button 
            v-if="actionText"
            @click="handleAction"
            class="btn-primary min-w-[120px]"
            :disabled="actionLoading"
          >
            <span v-if="actionLoading">{{ actionLoadingText }}</span>
            <span v-else>{{ actionText }}</span>
          </button>
        </slot>
      </div>
      
      <!-- 额外内容插槽 -->
      <div v-if="$slots.extra" class="mt-base">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// 组件Props
interface Props {
  iconComponent?: any  // SVG组件支持
  title?: string
  description?: string
  actionText?: string
  actionLoadingText?: string
  actionLoading?: boolean
  showAction?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'search' | 'error' | 'loading' | 'success'
  centered?: boolean
}

// 组件Emits
interface Emits {
  action: []
}

const props = withDefaults(defineProps<Props>(), {
  iconComponent: null,
  title: '暂无内容',
  description: '',
  actionText: '',
  actionLoadingText: '处理中...',
  actionLoading: false,
  showAction: false,
  size: 'medium',
  variant: 'default',
  centered: true
})

const emit = defineEmits<Emits>()

// 根据variant返回对应的默认SVG图标
const displayIcon = computed(() => {
  if (props.iconComponent) return props.iconComponent
  
  switch (props.variant) {
    case 'search':
      return MagnifyingGlassIcon
    case 'error':
      return ExclamationCircleIcon
    case 'success':
      return CheckCircleIcon
    case 'loading':
      return ClockIcon
    default:
      return DocumentTextIcon
  }
})

// 计算容器类
const containerClass = computed(() => ({
  [`empty-${props.size}`]: true,
  'empty-centered': props.centered
}))

// 处理操作
const handleAction = () => {
  if (!props.actionLoading) {
    emit('action')
  }
}
</script>

<style scoped>
/* C.9 统一化重构 - 使用unified-content-card风格 */
.empty-state {
  padding: var(--spacing-xl) var(--spacing-base);
}

.empty-centered {
  min-height: 280px;
}

/* 尺寸变体 */
.empty-small {
  min-height: 200px;
}

.empty-small .empty-content {
  padding: var(--spacing-base);
}

.empty-medium {
  min-height: 280px;
}

.empty-large {
  min-height: 360px;
}

/* 响应式 */
@media (max-width: 480px) {
  .empty-content {
    max-width: none;
  }
}

/* 可访问性 */
@media (prefers-reduced-motion: reduce) {
  .empty-content {
    animation: none;
  }
}
</style>
