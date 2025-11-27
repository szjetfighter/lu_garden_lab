<script setup lang="ts">
/**
 * 中奖弹窗组件
 * 显示中奖信息和查收奖品按钮
 */

import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { WinDetail } from '../types/moshi'

defineProps<{
  winDetail: WinDetail
}>()

const emit = defineEmits<{
  close: []
  claimPrize: []
}>()
</script>

<template>
  <div class="win-modal-overlay" @click.self="emit('close')">
    <div class="win-modal">
      <!-- 关闭按钮 -->
      <button class="close-button" @click="emit('close')">
        <XMarkIcon class="w-6 h-6" />
      </button>
      
      <div class="win-content">
        <!-- 庆祝图标 -->
        <div class="celebration-icon">🎉</div>
        
        <!-- 恭喜文字 -->
        <h2 class="win-title">恭喜中奖！</h2>
        
        <!-- 中奖符号展示 -->
        <div class="win-symbol-display">
          <img 
            v-if="winDetail.symbol.image" 
            :src="winDetail.symbol.image" 
            class="win-symbol-image" 
            :alt="winDetail.symbol.name || ''" 
          />
          <span v-else class="win-symbol-emoji">{{ winDetail.symbol.emoji }}</span>
          <span class="win-symbol-name">{{ winDetail.symbol.poeticName || winDetail.symbol.name }}</span>
        </div>
        
        <!-- 查收奖品按钮 -->
        <button class="claim-button" @click="emit('claimPrize')">
          查收奖品
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.win-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.win-modal {
  position: relative;
  width: 100%;
  max-width: 48rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.win-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.celebration-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-in-out infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

.win-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1a1a2e;
  margin: 0 0 1.5rem 0;
  font-family: 'Noto Serif SC', 'Source Han Serif CN', serif;
}

.win-symbol-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.win-symbol-image {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
}

.win-symbol-emoji {
  font-size: 3rem;
}

.win-symbol-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #92400e;
}

.claim-button {
  min-height: 48px;
  min-width: 160px;
  padding: 0.875rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
}

.claim-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
}

.claim-button:active {
  transform: translateY(0);
}
</style>
