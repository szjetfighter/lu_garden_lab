<script setup lang="ts">
import type { CaogongProduct } from '../types/xinpin'

defineProps<{
  product: CaogongProduct | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

/** 获取圈号数字 */
function getCircledNumber(n: number): string {
  return '⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁'.split('')[n - 1] || String(n)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && product"
        class="modal-overlay"
        @click.self="emit('close')"
      >
        <div class="modal-content">
          <!-- 说明书头部 -->
          <div class="manual-header">
            <div class="manual-badge">产品说明书</div>
            <button class="close-btn" @click="emit('close')">×</button>
          </div>
          
          <!-- 产品标题 -->
          <div class="product-title">
            <span class="title-number">{{ getCircledNumber(product.order) }}</span>
            <h2>{{ product.sectionTitle }}</h2>
            <p v-if="product.subtitle" class="subtitle">——{{ product.subtitle }}</p>
          </div>
          
          <!-- 诗歌内容 -->
          <div class="poem-body">
            <p
              v-for="(line, index) in product.lines"
              :key="index"
              class="poem-line"
            >
              {{ line }}
            </p>
          </div>
          
          <!-- 底部装饰 -->
          <div class="manual-footer">
            <span class="footer-ornament">◆ ◇ ◆</span>
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
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  max-width: 500px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  
  /* 复古说明书风格 */
  background: linear-gradient(180deg, #f5f0e6 0%, #e8e0d0 100%);
  border: 3px solid #8b7355;
  border-radius: 4px;
  box-shadow: 
    0 0 0 1px #5a4a3a,
    0 0 0 4px #3a2a1a,
    0 20px 60px rgba(0, 0, 0, 0.5);
  
  padding: 0;
}

.manual-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%);
  border-bottom: 2px solid #8b7355;
}

.manual-badge {
  font-size: 0.75rem;
  color: #d4a574;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: transparent;
  border: 1px solid #8b7355;
  border-radius: 50%;
  color: #d4a574;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #8b7355;
  color: #1a0a00;
}

.product-title {
  padding: 1.5rem 1.5rem 1rem;
  text-align: center;
  border-bottom: 1px dashed #8b7355;
}

.title-number {
  display: block;
  font-size: 2rem;
  color: #5a4a3a;
  margin-bottom: 0.5rem;
}

.product-title h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2a1a0a;
  font-family: 'Noto Serif SC', serif;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: #6a5a4a;
  margin-top: 0.5rem;
  font-style: italic;
}

.poem-body {
  padding: 1.5rem;
}

.poem-line {
  font-size: 1rem;
  line-height: 2;
  color: #2a1a0a;
  font-family: 'Noto Serif SC', serif;
  margin: 0;
  text-indent: 0;
}

.manual-footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px dashed #8b7355;
}

.footer-ornament {
  color: #8b7355;
  letter-spacing: 0.5em;
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
