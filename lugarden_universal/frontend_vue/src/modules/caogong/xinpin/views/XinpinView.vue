<script setup lang="ts">
import { ref } from 'vue'
import VendingMachine3D from '../components/VendingMachine3D.vue'
import VendingMachine from '../components/VendingMachine.vue'

const use3D = ref(true)
</script>

<template>
  <div class="xinpin-view">
    <!-- 模式切换 -->
    <div class="mode-toggle">
      <button 
        class="toggle-btn" 
        :class="{ active: use3D }"
        @click="use3D = true"
      >
        3D模式
      </button>
      <button 
        class="toggle-btn" 
        :class="{ active: !use3D }"
        @click="use3D = false"
      >
        2D模式
      </button>
    </div>
    
    <!-- 3D售货机 -->
    <VendingMachine3D v-if="use3D" />
    
    <!-- 2D售货机（降级方案） -->
    <VendingMachine v-else />
  </div>
</template>

<style scoped>
.xinpin-view {
  min-height: 100vh;
  padding: 2rem 1rem;
  
  /* 工业背景 */
  background: radial-gradient(ellipse at center, #1a1512 0%, #0a0805 100%);
}

.mode-toggle {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: #666;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.1em;
}

.toggle-btn:hover {
  border-color: #0ff;
  color: #0ff;
}

.toggle-btn.active {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border-color: #0ff;
  color: #0ff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}
</style>
