<script setup lang="ts">
/**
 * 惩罚/终止页面
 * - consecutive: 连续错误3次
 * - rushed: 10秒内点击3次下一首（猴急）
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCooldown } from '../composables/useCooldown'

const props = defineProps<{
  reason: 'consecutive' | 'rushed'
}>()

const router = useRouter()
const { setCooldown } = useCooldown()

// 根据原因决定文案和emoji
const messages = computed(() => {
  if (props.reason === 'rushed') {
    return {
      line1: '「 朋友，这么猴急啊 」',
      line2: '',
      line3: '呵呵',
      emoji: '🙂'
    }
  }
  // consecutive
  return {
    line1: '「 朋友，你似乎不具备',
    line2: '鉴别诗人和机器的能力 」',
    line3: '呼，真遗憾呢',
    emoji: '😏'
  }
})

// 逐行显示
const showName = ref(false)
const showLine1 = ref(false)
const showLine2 = ref(false)
const showLine3 = ref(false)
const showSmirk = ref(false)

onMounted(() => {
  // 设置冷却状态（传递原因）
  setCooldown(props.reason)
  
  // 逐行显示动画：陆家明先出现
  setTimeout(() => showName.value = true, 100)
  setTimeout(() => showLine1.value = true, 1100)
  if (messages.value.line2) {
    setTimeout(() => showLine2.value = true, 2100)
    setTimeout(() => showLine3.value = true, 3100)
    setTimeout(() => showSmirk.value = true, 5100)
  } else {
    // 猴急模式：跳过line2
    setTimeout(() => showLine3.value = true, 2100)
    setTimeout(() => showSmirk.value = true, 4100)
  }
  
  // 7秒后强制跳转到pending入口
  setTimeout(() => {
    router.push('/pending/home')
  }, 7000)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <p 
        class="text-zd-light font-bold text-xl mb-6 reveal-line"
        :class="{ 'revealed': showName }"
      >陆家明</p>
      <p 
        class="text-xl text-zd-light mb-4 reveal-line"
        :class="{ 'revealed': showLine1 }"
      >
        {{ messages.line1 }}
      </p>
      <p 
        v-if="messages.line2"
        class="text-xl text-zd-light mb-8 reveal-line"
        :class="{ 'revealed': showLine2 }"
      >
        {{ messages.line2 }}
      </p>
      <p 
        class="text-lg text-zd-muted reveal-line"
        :class="{ 'revealed': showLine3 }"
      >
        {{ messages.line3 }}
      </p>
      <p 
        class="text-4xl mt-8 reveal-line"
        :class="{ 'revealed': showSmirk }"
      >
        {{ messages.emoji }}
      </p>
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
