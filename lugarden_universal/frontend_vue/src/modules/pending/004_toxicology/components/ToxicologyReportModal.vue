<script setup lang="ts">
/**
 * 毒理学报告弹窗
 * 显示离心后残留的诗歌原文
 */
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  isOpen: boolean
  poemTitle?: string
  poemAuthor?: string
  poemLines?: string[]
}>()

const emit = defineEmits<{
  close: []
}>()
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
            <h2 class="report-title">毒理学报告</h2>
          </div>
          
          <!-- 诗歌信息 -->
          <div class="poem-section">
            <div class="poem-meta">
              <span class="poem-title">{{ poemTitle || '未知' }}</span>
              <span class="poem-author">{{ poemAuthor || '佚名' }}</span>
            </div>
            
            <!-- 诗歌内容 -->
            <div class="poem-body">
              <p
                v-for="(line, index) in poemLines"
                :key="index"
                class="poem-line"
              >
                {{ line }}
              </p>
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

.poem-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #333;
}

.poem-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1rem;
  color: #ccc;
}

.poem-author {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #666;
}

.poem-body {
  padding: 1rem 0;
}

.poem-line {
  font-size: 1rem;
  line-height: 2.2;
  color: #e0e0e0;
  font-family: 'Noto Serif SC', serif;
  margin: 0;
  text-align: center;
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
