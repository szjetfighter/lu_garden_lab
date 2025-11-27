<script setup lang="ts">
/**
 * 诗歌完整展示组件
 * 显示完整诗歌的所有诗节
 */

import { ref, computed, onMounted } from 'vue'
import { moshiApi } from '../services/moshiApi'
import ShareTools from '@/shared/components/ShareTools.vue'
import { PoemImageGenerator } from '@/shared/services/PoemImageGenerator'
import { 
  DocumentDuplicateIcon, 
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  poemId: string
}>()

const emit = defineEmits<{
  close: []
}>()

// 数据状态
const poem = ref<{
  id: string
  title: string
  section: string
  stanzas: Array<{ id: string; index: number; content: string }>
} | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// 操作状态
const isCopied = ref(false)
const isActionLoading = ref(false)

// 加载诗歌
onMounted(async () => {
  try {
    poem.value = await moshiApi.getPoem(props.poemId)
    if (!poem.value) {
      error.value = '诗歌不存在'
    }
  } catch (e) {
    error.value = '加载失败'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

// 合并所有诗节内容
const fullContent = computed(() => {
  if (!poem.value) return ''
  return poem.value.stanzas.map(s => s.content).join('\n\n')
})

// 纯文本内容
const plainTextContent = computed(() => {
  if (!poem.value) return ''
  return `${poem.value.title}\n\n${fullContent.value}`
})

// 复制
const copyPoem = async () => {
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
  } catch (e) {
    console.error('复制失败:', e)
  } finally {
    isActionLoading.value = false
  }
}

// 下载
const downloadPoem = async () => {
  if (isActionLoading.value || !poem.value) return
  isActionLoading.value = true
  
  try {
    const title = poem.value.title
    const fileName = `${title.replace(/[^\w\s\u4e00-\u9fa5-]/g, '')}.png`
    
    const blob = await PoemImageGenerator.createCard({
      title: title,
      content: fullContent.value
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
  } catch (e) {
    console.error('下载失败:', e)
  } finally {
    isActionLoading.value = false
  }
}

// ShareTools 配置
const actionButtons = computed(() => [
  {
    key: 'copy',
    iconComponent: isCopied.value ? CheckIcon : DocumentDuplicateIcon,
    handler: copyPoem,
    disabled: isActionLoading.value,
    title: isCopied.value ? '已复制' : '复制全诗',
    variant: isCopied.value ? ('success' as const) : undefined,
    visible: true
  },
  {
    key: 'download',
    iconComponent: ArrowDownTrayIcon,
    handler: downloadPoem,
    disabled: isActionLoading.value,
    title: '下载诗歌图片',
    visible: true
  }
])
</script>

<template>
  <div class="poem-viewer-overlay" @click.self="emit('close')">
    <div class="poem-viewer-modal">
      <!-- 关闭按钮 -->
      <button class="close-button" @click="emit('close')">
        <XMarkIcon class="w-6 h-6" />
      </button>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-state">
        加载中...
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>
      
      <!-- 诗歌内容 -->
      <div v-else-if="poem" class="poem-content">
        <h2 class="poem-title">{{ poem.title }}</h2>
        
        <div class="stanzas-container">
          <div 
            v-for="stanza in poem.stanzas" 
            :key="stanza.id"
            class="stanza-item"
          >
            <p class="stanza-text">{{ stanza.content }}</p>
          </div>
        </div>
        
        <!-- 分享工具（暂时隐藏） -->
        <ShareTools
          :actions="actionButtons"
          :show-actions="false"
          layout="auto"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.poem-viewer-overlay {
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

.poem-viewer-modal {
  position: relative;
  width: 100%;
  max-width: 600px;
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

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.poem-content {
  text-align: center;
}

.poem-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2a2a2a;
  margin-bottom: 2rem;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
}

.stanzas-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stanza-item {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.stanza-item:last-child {
  border-bottom: none;
}

.stanza-text {
  color: #2a2a2a;
  font-size: 1.1rem;
  line-height: 2;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
  white-space: pre-wrap;
  margin: 0;
}
</style>
