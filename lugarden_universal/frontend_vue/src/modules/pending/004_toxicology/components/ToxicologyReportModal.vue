<script setup lang="ts">
/**
 * 毒理报告弹窗
 * 显示离心后残留的诗歌原文
 */
import { ref, computed, watch, nextTick } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import poemsData from '../data/poems.json'
import { FontSizeCalculator } from '@/shared/services/FontSizeCalculator'

const props = defineProps<{
  isOpen: boolean
  poemTitle?: string
}>()

const emit = defineEmits<{
  close: []
}>()

// 从 poems.json 获取诗歌内容
const poemContent = computed(() => {
  if (!props.poemTitle) return null
  return poemsData.poems.find(p => p.title === props.poemTitle)
})

// 检测是否是 sections 格式（如八芥）
const hasSections = computed(() => {
  return poemContent.value && 'sections' in poemContent.value
})

// sections 格式的数据
const poemSections = computed(() => {
  if (!hasSections.value || !poemContent.value) return []
  return (poemContent.value as any).sections || []
})

// 普通格式的 lines
const poemLines = computed(() => {
  if (hasSections.value) return []
  return (poemContent.value as any)?.lines || []
})

// 所有行（用于字号计算）
const allLines = computed(() => {
  if (hasSections.value) {
    const lines: string[] = []
    for (const section of poemSections.value) {
      if (section.subtitle) lines.push(section.subtitle)
      if (section.lines) lines.push(...section.lines)
    }
    return lines
  }
  return poemLines.value
})

// 字号自适应
const poemBodyRef = ref<HTMLElement | null>(null)
const adaptiveFontSize = ref(16) // 默认 1rem = 16px

const FONT_CONFIG = {
  baseFontSize: 16,
  minFontSize: 10,
  fontFamily: "'Noto Serif SC', serif",
  fontWeight: 'normal'
}

const calcFontSize = () => {
  if (!poemBodyRef.value || allLines.value.length === 0) return
  
  const containerWidth = poemBodyRef.value.clientWidth
  const result = FontSizeCalculator.calcAdaptiveFontSizeMultiple(
    allLines.value,
    containerWidth,
    FONT_CONFIG
  )
  adaptiveFontSize.value = result.fontSize
}

// 监听弹窗打开和诗歌内容变化
watch([() => props.isOpen, allLines], ([isOpen]) => {
  if (isOpen) {
    nextTick(() => {
      setTimeout(calcFontSize, 50) // 等待 DOM 渲染
    })
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="emit('close')"
      >
        <div class="modal-content">
          <!-- 关闭按钮 -->
          <button class="close-button" @click="emit('close')">
            <XMarkIcon class="w-6 h-6" />
          </button>
          
          <!-- 标题 -->
          <div class="report-header">
            <div class="report-label">TOXICOLOGY REPORT</div>
            <h2 class="report-title">毒理报告</h2>
          </div>
          
          <!-- 诗歌信息 -->
          <div class="poem-section">
            <h3 class="poem-title">{{ poemTitle || '未知' }}</h3>
            
            <!-- 诗歌内容 -->
            <div ref="poemBodyRef" class="poem-body">
              <!-- sections 格式（如八芥） -->
              <template v-if="hasSections">
                <div 
                  v-for="(section, sIdx) in poemSections" 
                  :key="sIdx"
                  class="poem-section-block"
                >
                  <p 
                    v-if="section.subtitle" 
                    class="poem-subtitle"
                    :style="{ fontSize: adaptiveFontSize + 'px' }"
                  >
                    {{ section.subtitle }}
                  </p>
                  <p
                    v-for="(line, lIdx) in section.lines"
                    :key="lIdx"
                    class="poem-line"
                    :style="{ fontSize: adaptiveFontSize + 'px' }"
                  >
                    {{ line }}
                  </p>
                </div>
              </template>
              <!-- 普通格式 -->
              <template v-else>
                <p
                  v-for="(line, index) in poemLines"
                  :key="index"
                  class="poem-line"
                  :style="{ fontSize: adaptiveFontSize + 'px' }"
                >
                  {{ line }}
                </p>
              </template>
            </div>
          </div>
          
          <!-- 水印 -->
          <div class="modal-watermark">
            CENTRIFUGE RESIDUE Ⓒ LUGARDEN
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 28rem;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(30, 30, 35, 0.7);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }
  50% { 
    transform: scale(1.01);
    opacity: 0.95;
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #888;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.report-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
}

.report-label {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #aa4444;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
}

.report-title {
  font-size: 1.5rem;
  font-weight: 300;
  color: #f0f0f0;
  font-family: 'Noto Serif SC', serif;
  margin: 0;
  letter-spacing: 0.3em;
}

.poem-section {
  margin: 1.5rem 0;
}

.poem-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #e0e0e0;
  text-align: center;
  margin: 0 0 1.5rem 0;
}

.poem-body {
  padding: 1rem 0;
}

.poem-section-block {
  margin-bottom: 1.5rem;
}

.poem-section-block:last-child {
  margin-bottom: 0;
}

.poem-subtitle {
  /* font-size 由 JS 动态计算 */
  line-height: 2;
  color: #aa8866;
  font-family: 'Noto Serif SC', serif;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  text-align: center;
  white-space: pre;
}

.poem-line {
  /* font-size 由 JS 动态计算 */
  line-height: 2.2;
  color: #e0e0e0;
  font-family: 'Noto Serif SC', serif;
  margin: 0;
  text-align: center;
  white-space: pre;
}

.modal-watermark {
  margin-top: 1.5rem;
  padding-top: 1rem;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  color: #444;
  letter-spacing: 0.15em;
  border-top: 1px solid #333;
}

/* 过渡动画 */
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
