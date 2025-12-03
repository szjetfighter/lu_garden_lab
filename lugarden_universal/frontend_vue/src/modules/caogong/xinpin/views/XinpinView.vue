<script setup lang="ts">
import VendingMachine3D from '../components/VendingMachine3D.vue'
</script>

<template>
  <div class="xinpin-view">
    <VendingMachine3D />
  </div>
</template>

<style scoped>
.xinpin-view {
  min-height: 100vh;
  padding: 2rem 1rem;
  
  /* 工业背景 */
  background: radial-gradient(ellipse at center, #1a1512 0%, #0a0805 100%);
}
</style>
