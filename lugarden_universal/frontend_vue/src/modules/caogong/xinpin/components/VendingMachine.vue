<script setup lang="ts">
import { ref } from 'vue'
import type { CaogongProduct } from '../types/xinpin'
import { products } from '../data/products'
import ProductSlot from './ProductSlot.vue'
import ProductModal from './ProductModal.vue'

const selectedProduct = ref<CaogongProduct | null>(null)
const isModalOpen = ref(false)
const isDispensing = ref(false)

function handleSelect(product: CaogongProduct) {
  // 播放出货动画
  isDispensing.value = true
  selectedProduct.value = product
  
  // 延迟显示弹窗，模拟出货
  setTimeout(() => {
    isDispensing.value = false
    isModalOpen.value = true
  }, 600)
}

function handleClose() {
  isModalOpen.value = false
}
</script>

<template>
  <div class="vending-machine">
    <!-- 顶部招牌 -->
    <div class="machine-signboard">
      <div class="signboard-glow"></div>
      <h1 class="signboard-title">新品发布</h1>
      <p class="signboard-subtitle">曹僧诗歌售卖机</p>
    </div>
    
    <!-- 主机身 -->
    <div class="machine-body">
      <!-- 产品展示柜 -->
      <div class="display-cabinet">
        <div class="products-grid">
          <ProductSlot
            v-for="product in products"
            :key="product.id"
            :product="product"
            @select="handleSelect"
          />
        </div>
        <!-- 玻璃反光效果 -->
        <div class="glass-reflection"></div>
      </div>
      
      <!-- 出货口 -->
      <div class="dispenser-section">
        <div class="dispenser-slot" :class="{ dispensing: isDispensing }">
          <div class="dispenser-inner">
            <span v-if="isDispensing" class="dispensing-text">出货中...</span>
            <span v-else class="dispenser-label">▼ 取货口 ▼</span>
          </div>
          <div class="dispenser-flap"></div>
        </div>
      </div>
    </div>
    
    <!-- 底部信息 -->
    <div class="machine-footer">
      <div class="footer-badge">2015.02.10-17</div>
      <div class="footer-brand">CAOSENG MFG.</div>
    </div>
  </div>
  
  <!-- 产品说明书弹窗 -->
  <ProductModal
    :product="selectedProduct"
    :is-open="isModalOpen"
    @close="handleClose"
  />
</template>

<style scoped>
.vending-machine {
  max-width: 520px;
  margin: 0 auto;
  
  /* 机器外壳 */
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
  border-radius: 8px;
  box-shadow: 
    0 0 0 3px #444,
    0 0 0 6px #222,
    0 30px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* 顶部招牌 */
.machine-signboard {
  position: relative;
  padding: 1.25rem 1rem;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  text-align: center;
  border-bottom: 3px solid #333;
}

.signboard-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center top,
    rgba(255, 0, 128, 0.15) 0%,
    transparent 60%
  );
  pointer-events: none;
}

.signboard-title {
  position: relative;
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(180deg, #ff6b9d 0%, #c44569 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 20px rgba(255, 107, 157, 0.5));
  letter-spacing: 0.15em;
}

.signboard-subtitle {
  position: relative;
  font-size: 0.75rem;
  color: #0ff;
  margin: 0.5rem 0 0;
  letter-spacing: 0.3em;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

/* 主机身 */
.machine-body {
  padding: 1rem;
  background: linear-gradient(180deg, #1a1a1a 0%, #111 100%);
}

/* 展示柜 */
.display-cabinet {
  position: relative;
  padding: 0.75rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #151515 100%);
  border: 2px solid #333;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.glass-reflection {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.03) 0%,
    transparent 50%,
    transparent 100%
  );
  pointer-events: none;
  border-radius: 4px;
}

/* 出货口 */
.dispenser-section {
  padding: 0 0.5rem;
}

.dispenser-slot {
  position: relative;
  background: linear-gradient(180deg, #0a0a0a 0%, #000 100%);
  border: 2px solid #333;
  border-radius: 4px;
  overflow: hidden;
}

.dispenser-slot.dispensing {
  border-color: #0ff;
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.3),
    inset 0 0 30px rgba(0, 255, 255, 0.1);
}

.dispenser-inner {
  padding: 1rem;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dispenser-label {
  font-size: 0.75rem;
  color: #555;
  letter-spacing: 0.2em;
}

.dispensing-text {
  font-size: 0.875rem;
  color: #0ff;
  animation: pulse 0.5s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dispenser-flap {
  height: 8px;
  background: linear-gradient(180deg, #222 0%, #111 100%);
  border-top: 1px solid #333;
}

/* 底部信息 */
.machine-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  border-top: 1px solid #333;
}

.footer-badge {
  font-size: 0.625rem;
  font-family: 'Courier New', monospace;
  color: #555;
}

.footer-brand {
  font-size: 0.625rem;
  font-family: 'Courier New', monospace;
  color: #555;
  letter-spacing: 0.1em;
}
</style>
