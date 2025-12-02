<script setup lang="ts">
import type { CaogongProduct } from '../types/xinpin'

defineProps<{
  product: CaogongProduct
}>()

const emit = defineEmits<{
  select: [product: CaogongProduct]
}>()

/** 每个产品的抽象图标 */
const productIcons: Record<string, string> = {
  neiranji: '🍅',
  paoche: '🪰',
  zhanjian: '⚓',
  jiaoshoujia: '🫓',
  daqiao: '🥪',
  chaiqianbi: '🦅',
  bengji: '🦷',
  cichangqi: '🧲',
  zhongzhidan: '🥚',
  daiyuntong: '🧪',
  cibei: '🫖',
  panyanti: '🦶',
  wudijing: '🪞',
  jixiebiao: '⌚'
}
</script>

<template>
  <button
    class="product-slot"
    @click="emit('select', product)"
  >
    <!-- 玻璃展示柜 -->
    <div class="glass-case">
      <!-- 产品图标 -->
      <div class="product-icon">{{ productIcons[product.id] || '📦' }}</div>
      <!-- 内部发光 -->
      <div class="inner-glow"></div>
    </div>
    <!-- 标签 -->
    <div class="product-label">
      <span class="label-number">{{ product.order.toString().padStart(2, '0') }}</span>
      <span class="label-name">{{ product.catalogName }}</span>
    </div>
    <!-- 边框灯条 -->
    <div class="light-strip"></div>
  </button>
</template>

<style scoped>
.product-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  
  /* 金属框架 */
  background: linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%);
  border: 2px solid #555;
  border-radius: 4px;
  
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.product-slot:hover {
  border-color: #0ff;
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.3),
    inset 0 0 20px rgba(0, 255, 255, 0.1);
}

.product-slot:hover .glass-case {
  background: rgba(0, 255, 255, 0.1);
}

.product-slot:hover .inner-glow {
  opacity: 1;
}

.product-slot:hover .light-strip {
  opacity: 1;
  box-shadow: 0 0 10px #0ff;
}

.product-slot:active {
  transform: scale(0.98);
}

/* 玻璃展示柜 */
.glass-case {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 透明玻璃效果 */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  border-bottom: 1px solid #444;
  
  transition: background 0.3s ease;
}

.product-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  transition: transform 0.3s ease;
}

.product-slot:hover .product-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.5));
}

.inner-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 255, 255, 0.15) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

/* 产品标签 */
.product-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0.5rem 0.25rem;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
}

.label-number {
  font-size: 0.625rem;
  font-family: 'Courier New', monospace;
  color: #0ff;
  letter-spacing: 0.1em;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.label-name {
  font-size: 0.625rem;
  color: #aaa;
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 边框灯条 */
.light-strip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #0ff;
  opacity: 0.3;
  transition: all 0.3s ease;
}
</style>
