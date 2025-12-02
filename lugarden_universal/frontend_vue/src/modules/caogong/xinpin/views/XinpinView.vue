<script setup lang="ts">
import VendingMachine from '../components/VendingMachine.vue'
</script>

<template>
  <div class="xinpin-view">
    <VendingMachine />
  </div>
</template>

<style scoped>
.xinpin-view {
  min-height: 100vh;
  padding: 2rem 1rem;
  
  /* 工业背景 */
  background: 
    radial-gradient(ellipse at center, #1a1512 0%, #0a0805 100%);
}
</style>
