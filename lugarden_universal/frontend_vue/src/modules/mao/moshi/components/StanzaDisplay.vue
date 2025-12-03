<script setup lang="ts">
/**
 * 诗节展示组件
 */

import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { useMoshiStore } from '../stores/moshiStore'
import ShareTools from '@/shared/components/ShareTools.vue'
import { PoemImageGenerator } from '@/shared/services/PoemImageGenerator'
import { FontSizeCalculator } from '@/shared/services/FontSizeCalculator'
import { 
  DocumentDuplicateIcon, 
  ArrowDownTrayIcon,
  CheckIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const store = useMoshiStore()

// 事件
const emit = defineEmits<{
  viewFullPoem: [poemId: string]
}>()

const stanza = computed(() => store.currentStanza)

// 格式化诗节内容，保留换行
const formattedContent = computed(() => {
  if (!stanza.value) return ''
  return stanza.value.content
})

// 状态
const isCopied = ref(false)
const isActionLoading = ref(false)

// 字号自适应
const contentRef = ref<HTMLElement | null>(null)
const adaptiveFontSize = ref(17.6) // 默认1.1rem = 17.6px

const FONT_CONFIG = {
  baseFontSize: 17.6,  // 1.1rem
  minFontSize: 12,     // 最小字号
  fontFamily: '"Noto Serif SC", "Source Han Serif CN", serif',
  fontWeight: 'normal'
}

// 计算自适应字号
const calcFontSize = () => {
  if (!contentRef.value || !formattedContent.value) return
  
  // 获取容器宽度（减去padding）
  const containerWidth = contentRef.value.clientWidth
  
  const result = FontSizeCalculator.calcAdaptiveFontSize(
    formattedContent.value,
    containerWidth,
    FONT_CONFIG
  )
  
  adaptiveFontSize.value = result.fontSize
}

// 监听内容变化重新计算
watch(formattedContent, () => {
  nextTick(calcFontSize)
})

// 组件挂载后计算
onMounted(() => {
  nextTick(calcFontSize)
  // 监听窗口大小变化
  window.addEventListener('resize', calcFontSize)
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

// 获取纯文本内容
const plainTextContent = computed(() => {
  if (!stanza.value) return ''
  return `${formattedContent.value}\n\n——${formattedSource.value}`
})

// 复制诗节
const copyStanza = async () => {
  if (isActionLoading.value) return
  isActionLoading.value = true
  
  try {
    const text = plainTextContent.value
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    
    isCopied.value = true
    setTimeout(() => { isCopied.value = false }, 3000)
  } catch (error) {
    console.error('复制失败:', error)
  } finally {
    isActionLoading.value = false
  }
}

// 下载诗节图片
const downloadStanza = async () => {
  if (isActionLoading.value || !stanza.value) return
  isActionLoading.value = true
  
  try {
    const title = stanza.value.poem?.title || '诗节'
    const fileName = `${title.replace(/[^\w\s\u4e00-\u9fa5-]/g, '')}.png`
    
    const blob = await PoemImageGenerator.createMoshiCard({
      title: title,
      stanzas: [{
        index: stanza.value.index || 1,
        content: formattedContent.value
      }]
    })
    
    if (!blob) throw new Error('图片生成失败')
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => URL.revokeObjectURL(url), 100)
  } catch (error) {
    console.error('下载失败:', error)
  } finally {
    isActionLoading.value = false
  }
}

// ShareTools 配置
const actionButtons = computed(() => [
  {
    key: 'copy',
    iconComponent: isCopied.value ? CheckIcon : DocumentDuplicateIcon,
    handler: copyStanza,
    disabled: isActionLoading.value,
    title: isCopied.value ? '已复制' : '复制诗节',
    variant: isCopied.value ? ('success' as const) : undefined,
    visible: true
  },
  {
    key: 'download',
    iconComponent: ArrowDownTrayIcon,
    handler: downloadStanza,
    disabled: isActionLoading.value,
    title: '下载诗节图片',
    visible: true
  }
])
</script>

<template>
  <Transition name="fade-slide">
    <div v-if="stanza" class="stanza-display">
      <div class="stanza-header">
        <DocumentTextIcon class="stanza-icon" />
        <span class="stanza-label">你摸到了一节诗</span>
      </div>
      
      <div ref="contentRef" class="stanza-content">
        <p class="stanza-text" :style="{ fontSize: adaptiveFontSize + 'px' }">{{ formattedContent }}</p>
      </div>
      
      <div class="stanza-footer">
        <span class="poem-source">{{ formattedSource }}</span>
      </div>
      
      <!-- 分享工具 -->
      <ShareTools
        :actions="actionButtons"
        :show-actions="true"
        layout="auto"
      />
      
      <!-- 查看全诗按钮（暂时隐藏） -->
      <button 
        v-if="false"
        class="view-full-poem-button"
        @click="emit('viewFullPoem', stanza?.poemId || '')"
      >
        查看全诗 →
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* A.8: 采用zhou标准布局模式，避免PC调试与真机差异 */
.stanza-display {
  max-width: 28rem;
  margin: 1.5rem auto 2rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.stanza-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.stanza-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.stanza-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.stanza-content {
  padding: 1rem 0;
}

.stanza-text {
  color: #1f2937;
  /* font-size由JS动态计算 */
  line-height: 2;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
  white-space: pre;
  margin: 0;
}

.stanza-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  text-align: right;
}

.poem-source {
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: bold;
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

.view-full-poem-button {
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.view-full-poem-button:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}
</style>
