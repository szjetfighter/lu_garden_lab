<script setup lang="ts">
/**
 * 中奖弹窗组件
 * 显示中奖信息和查收奖品按钮
 * 根据连线数量显示不同的动画特效
 */

import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { WinDetail } from '@/modules/mao/types/moshi'

const props = defineProps<{
  winDetail: WinDetail
}>()

const emit = defineEmits<{
  close: []
  claimPrize: []
}>()

// 根据连线数量获取标题和样式
const winLevel = computed(() => {
  const columns = props.winDetail.columns || 3
  if (columns >= 5) {
    return {
      title: 'ULTRA WIIIIIIIN',
      class: 'win-ultra',
      icon: '⚡'
    }
  } else if (columns >= 4) {
    return {
      title: 'MEGA WIIIN',
      class: 'win-mega',
      icon: '✦'
    }
  } else {
    return {
      title: 'BIG WIN',
      class: 'win-big',
      icon: '🎉'
    }
  }
})
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
        <div class="celebration-icon" :class="winLevel.class">{{ winLevel.icon }}</div>
        
        <!-- 动态中奖标题 -->
        <h2 class="win-title" :class="winLevel.class">
          <span v-for="(char, idx) in winLevel.title" :key="idx" class="win-char" :style="{ animationDelay: `${idx * 0.05}s` }">
            {{ char }}
          </span>
        </h2>
        
        <!-- 中奖符号展示 -->
        <div class="win-symbol-display">
          <img 
            v-if="winDetail.symbol.image" 
            :src="winDetail.symbol.image" 
            class="win-symbol-image" 
            :alt="winDetail.symbol.name || ''" 
          />
          <span v-else class="win-symbol-emoji">{{ winDetail.symbol.emoji }}</span>
          <span class="win-symbol-name">{{ winDetail.poeticName || winDetail.symbol.name }}</span>
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

.celebration-icon.win-big {
  animation: bounce 0.6s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.5));
}

.celebration-icon.win-mega {
  animation: bounce 0.5s ease-in-out infinite alternate, icon-glow-purple 0.8s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.7));
}

.celebration-icon.win-ultra {
  font-size: 5rem;
  animation: bounce 0.4s ease-in-out infinite alternate, icon-glow-gold 0.3s ease-in-out infinite, icon-shake 0.1s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.9));
}

@keyframes icon-glow-purple {
  0%, 100% { filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.7)); }
  50% { filter: drop-shadow(0 0 30px rgba(168, 85, 247, 1)); }
}

@keyframes icon-glow-gold {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.9)) brightness(1); }
  50% { filter: drop-shadow(0 0 40px rgba(251, 191, 36, 1)) brightness(1.3); }
}

@keyframes icon-shake {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(-3deg); }
  75% { transform: translateY(-5px) rotate(3deg); }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

.win-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  font-family: 'Impact', 'Arial Black', sans-serif;
  letter-spacing: 0.1em;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.win-char {
  display: inline-block;
  animation: char-bounce 0.6s ease-out both;
}

@keyframes char-bounce {
  0% { transform: translateY(-30px) scale(0.5); opacity: 0; }
  60% { transform: translateY(5px) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

/* 3连 - BIG WIN - 粉色系 */
.win-title.win-big {
  color: #ec4899;
  text-shadow: 
    0 0 10px rgba(236, 72, 153, 0.5),
    0 0 20px rgba(236, 72, 153, 0.3),
    2px 2px 0 #f9a8d4;
}

.win-title.win-big .win-char {
  animation: char-bounce 0.6s ease-out both, glow-pink 1.5s ease-in-out infinite 0.6s;
}

@keyframes glow-pink {
  0%, 100% { text-shadow: 0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3), 2px 2px 0 #f9a8d4; }
  50% { text-shadow: 0 0 20px rgba(236, 72, 153, 0.8), 0 0 40px rgba(236, 72, 153, 0.5), 2px 2px 0 #f9a8d4; }
}

/* 4连 - MEGA WIN - 紫色系 */
.win-title.win-mega {
  color: #a855f7;
  text-shadow: 
    0 0 15px rgba(168, 85, 247, 0.6),
    0 0 30px rgba(168, 85, 247, 0.4),
    3px 3px 0 #c084fc;
}

.win-title.win-mega .win-char {
  animation: char-bounce 0.6s ease-out both, glow-purple 1s ease-in-out infinite 0.6s, shake-text 0.1s ease-in-out infinite 0.6s;
}

@keyframes glow-purple {
  0%, 100% { text-shadow: 0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(168, 85, 247, 0.4), 3px 3px 0 #c084fc; }
  50% { text-shadow: 0 0 30px rgba(168, 85, 247, 1), 0 0 60px rgba(168, 85, 247, 0.7), 3px 3px 0 #c084fc; }
}

@keyframes shake-text {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
}

/* 5连 - ULTRA WIN - 深琥珀金 + 随机放大 + 超强发光 */
.win-title.win-ultra {
  color: #d97706;
  text-shadow: 
    0 0 20px rgba(251, 191, 36, 0.8),
    0 0 40px rgba(251, 191, 36, 0.6),
    0 0 60px rgba(251, 191, 36, 0.4),
    0 0 80px rgba(251, 191, 36, 0.3),
    4px 4px 0 #f59e0b;
}

.win-title.win-ultra .win-char {
  animation: 
    char-bounce 0.6s ease-out both, 
    glow-gold-ultra 0.3s ease-in-out infinite 0.6s, 
    shake-heavy-text 0.08s ease-in-out infinite 0.6s,
    random-scale 0.5s ease-in-out infinite 0.6s;
}

@keyframes random-scale {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.25); }
  50% { transform: scale(0.85); }
  75% { transform: scale(1.2); }
}

@keyframes glow-gold-ultra {
  0%, 100% { 
    text-shadow: 
      0 0 20px rgba(251, 191, 36, 0.8), 
      0 0 40px rgba(251, 191, 36, 0.6), 
      0 0 60px rgba(251, 191, 36, 0.4),
      0 0 80px rgba(251, 191, 36, 0.3),
      4px 4px 0 #f59e0b;
    filter: brightness(1);
  }
  50% { 
    text-shadow: 
      0 0 40px rgba(251, 191, 36, 1), 
      0 0 80px rgba(251, 191, 36, 0.9), 
      0 0 120px rgba(251, 191, 36, 0.7),
      0 0 160px rgba(251, 191, 36, 0.5),
      4px 4px 0 #f59e0b;
    filter: brightness(1.4);
  }
}

@keyframes glow-gold {
  0%, 100% { 
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.4), 4px 4px 0 #f59e0b;
    filter: brightness(1);
  }
  50% { 
    text-shadow: 0 0 40px rgba(251, 191, 36, 1), 0 0 80px rgba(251, 191, 36, 0.8), 0 0 120px rgba(251, 191, 36, 0.6), 4px 4px 0 #f59e0b;
    filter: brightness(1.2);
  }
}

@keyframes shake-heavy-text {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-2px) rotate(-0.5deg); }
  75% { transform: translateX(2px) rotate(0.5deg); }
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
