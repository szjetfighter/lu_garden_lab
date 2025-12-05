<script setup lang="ts">
import { useRouter } from 'vue-router'
import VendingMachine3D from '../components/VendingMachine3D.vue'
import BackButton from '@/shared/components/BackButton.vue'

const router = useRouter()

const goBack = () => {
  router.push('/pending/home')
}
</script>

<template>
  <div class="xinpin-view">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <BackButton 
          text="返回"
          variant="default"
          size="medium"
          :hover-animation="true"
          @click="goBack"
        />
      </div>
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
