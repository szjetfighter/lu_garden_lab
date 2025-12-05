<script setup lang="ts">
/**
 * 结算揭示页 - 游戏完成后显示统计和真相
 * 继承whoiszd-theme深色主题样式
 */

import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  yesCount: number
  noCount: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const router = useRouter()

// 演出效果：逐行显示
const showLine1 = ref(false) // 标题
const showLine2 = ref(false) // 第一句
const showLine3 = ref(false) // 第二句
const showLine4 = ref(false) // 第三句
const showButtons = ref(false) // 按钮

onMounted(() => {
  // 逐行显示动画
  setTimeout(() => showLine1.value = true, 100)
  setTimeout(() => showLine2.value = true, 1100)
  setTimeout(() => showLine3.value = true, 2100)
  setTimeout(() => showLine4.value = true, 3100)
  setTimeout(() => showButtons.value = true, 4100)
})

// 根据yesCount决定显示不同文案
const resultType = computed(() => {
  if (props.yesCount === 0) return 'perfect'      // 全部识破
  if (props.yesCount <= 3) return 'good'          // 少量被骗
  return 'fooled'                                  // 较多被骗
})

function handleRestart() {
  emit('restart')
}

function handleReturn() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="zd-card max-w-lg w-full px-8 py-10 text-center">
      <!-- 标题 -->
      <h1 
        class="text-2xl mb-8 text-zd-light reveal-line"
        :class="{ 'revealed': showLine1 }"
      >游 戏 结 束</h1>

      <!-- 真相揭示 - 全部识破 -->
      <div v-if="resultType === 'perfect'" class="mb-8">
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine2 }"
        >
          你全部选择了「不是」。
        </p>
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine3 }"
        >
          恭喜，你完全识破了我的模仿。
        </p>
        <p 
          class="text-zd-text mb-6 reveal-line"
          :class="{ 'revealed': showLine4 }"
        >
          或者，你不够有趣。
        </p>
      </div>

      <!-- 真相揭示 - 少量被骗 -->
      <div v-else-if="resultType === 'good'" class="mb-8">
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine2 }"
        >
          你有{{ yesCount }}次选择了「是」。
        </p>
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine3 }"
        >
          意味着你认为我{{ yesCount }}次成功模仿了臧棣。
        </p>
        <p 
          class="text-zd-text mb-6 reveal-line"
          :class="{ 'revealed': showLine4 }"
        >
          也有可能，你只是猜的。
        </p>
      </div>

      <!-- 真相揭示 - 较多被骗 -->
      <div v-else class="mb-8">
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine2 }"
        >
          你有{{ yesCount }}次选择了「是」。
        </p>
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine3 }"
        >
          我的模仿明明很拙劣。
        </p>
        <p 
          class="text-zd-text mb-6 reveal-line"
          :class="{ 'revealed': showLine4 }"
        >
          只是你更傻。
        </p>
      </div>

      <!-- 操作按钮 -->
      <div 
        class="flex justify-center gap-4 reveal-line"
        :class="{ 'revealed': showButtons }"
      >
        <button
          class="zd-btn-secondary"
          @click="handleRestart"
        >
          再来一次
        </button>
        <button
          class="zd-btn-primary"
          @click="handleReturn"
        >
          返回陆家花园
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 逐行显示动画 */
.reveal-line {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.reveal-line.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
