<script setup lang="ts">
import VendingMachine3D from '../components/VendingMachine3D.vue'
</script>

<template>
  <div class="xinpin-view">
    <div class="container mx-auto px-4 py-8 pt-16 md:pt-8">
      <VendingMachine3D />
    </div>
  </div>
</template>

<style scoped>
.xinpin-view {
  min-height: 100vh;
  /* 四周向内渐变：边缘浅灰 -> 中心卡片背景色 */
  background: radial-gradient(ellipse at center, var(--bg-card) 0%, #e5e7eb 100%);
}
</style>
