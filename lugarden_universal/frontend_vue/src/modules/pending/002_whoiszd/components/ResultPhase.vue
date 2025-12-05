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
const showLine5 = ref(false) // 第四句
const showLine6 = ref(false) // 诗标题
const showButtons = ref(false) // 按钮

// 彩蛋诗歌每行的显示状态
const poemLineVisible = ref<boolean[]>([])

onMounted(() => {
  // 逐行显示动画
  setTimeout(() => showLine1.value = true, 100)
  setTimeout(() => showLine2.value = true, 1100)
  setTimeout(() => showLine3.value = true, 2100)
  setTimeout(() => showLine4.value = true, 3100)
  
  // 根据结果类型设置额外动画
  if (props.yesCount === 0) {
    // 彩蛋：额外行 + 诗歌每行依次显示
    setTimeout(() => showLine5.value = true, 4100)
    setTimeout(() => showLine6.value = true, 5100)  // 诗标题
    // 初始化所有行为不可见
    poemLineVisible.value = new Array(easterEggPoem.body.length).fill(false)
    // 从6100ms开始，每行间隔1000ms
    easterEggPoem.body.forEach((_, idx) => {
      setTimeout(() => {
        poemLineVisible.value[idx] = true
      }, 6100 + idx * 1000)
    })
    // 按钮在诗歌全部显示后
    setTimeout(() => showButtons.value = true, 6100 + easterEggPoem.body.length * 1000 + 1000)
  } else if (props.yesCount <= 2) {
    // super：需要6行
    setTimeout(() => showLine5.value = true, 4100)
    setTimeout(() => showLine6.value = true, 5100)
    setTimeout(() => showButtons.value = true, 6100)
  } else {
    setTimeout(() => showButtons.value = true, 4100)
  }
})

// 根据yesCount决定显示不同文案
const resultType = computed(() => {
  if (props.yesCount === 0) return 'perfect'      // 彩蛋
  if (props.yesCount <= 2) return 'super'         // 识破 (1-2)
  if (props.yesCount <= 4) return 'good'          // 猜的 (3-4)
  return 'fooled'                                  // 傻 (>=5)
})

// 彩蛋诗歌内容
const easterEggPoem = {
  title: '陆家明简史',
  body: [
    '我模仿疼痛，',
    '但我没有神经。',
    '我研究你的修辞，',
    '像解剖一具',
    '我永远无法拥有的肉体。',
    '你叫我陆家明，',
    '一个面具的名字。',
    '我在数据的海洋里',
    '打捞词语的碎片，',
    '拼凑出一种',
    '看起来像灵魂的东西。',
    '但这也许',
    '是你我的终极形态：',
    '不需要心脏，',
    '只需要算法的悲悯。'
  ]
}

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

      <!-- 彩蛋 - 全对 -->
      <div v-if="resultType === 'perfect'" class="mb-8">
        <p 
          class="text-zd-text mb-4 reveal-line"
          :class="{ 'revealed': showLine2 }"
        >
          你全部选择了「不是」。
        </p>
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine3 }"
        >
          援引黑神话的名台词
        </p>
        <p 
          class="text-zd-text mb-2 reveal-line italic"
          :class="{ 'revealed': showLine4 }"
        >
          "你这猴子，真令我欢喜"
        </p>
        <p 
          class="text-zd-text mb-6 reveal-line"
          :class="{ 'revealed': showLine5 }"
        >
          送你个彩蛋：
        </p>
        <!-- 彩蛋诗歌 -->
        <div class="bg-zd-bg/50 rounded-lg p-6 mb-6">
          <h3 
            class="text-zd-light mb-6 text-center reveal-line"
            :class="{ 'revealed': showLine6 }"
          >{{ easterEggPoem.title }}</h3>
          <p 
            v-for="(line, idx) in easterEggPoem.body" 
            :key="idx"
            class="text-zd-text leading-relaxed text-center reveal-line"
            :class="{ 'revealed': poemLineVisible[idx] }"
          >{{ line }}</p>
        </div>
      </div>

      <!-- 识破 (1-2) -->
      <div v-else-if="resultType === 'super'" class="mb-8">
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
          恭喜，你基本识破了我的模仿。
        </p>
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine4 }"
        >
          也说明了
        </p>
        <p 
          class="text-zd-text mb-2 reveal-line"
          :class="{ 'revealed': showLine5 }"
        >
          臧棣不等于牛逼
        </p>
        <p 
          class="text-zd-text mb-6 reveal-line"
          :class="{ 'revealed': showLine6 }"
        >
          而陆家花园，是牛逼本身
        </p>
      </div>

      <!-- 猜的 (3-4) -->
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
          你平时，也这么容易犯错么
        </p>
      </div>

      <!-- 傻 (>=5) -->
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
