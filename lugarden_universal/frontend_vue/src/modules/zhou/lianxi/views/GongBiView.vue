<template>
  <div class="min-h-screen" style="background-color: var(--bg-primary);">
    <!-- 用户导航 -->
    <UserNavigation mode="minimal" position="absolute" :show-toast="false" />
    
    <div class="container mx-auto px-4 py-8 pt-16 md:pt-8">
      <div class="max-w-3xl mx-auto">
        
        <!-- 错误状态 -->
        <div v-if="error && !loading" class="space-y-6 animate-fadeInUp">
          <ErrorState 
            error-type="unknown"
            error-title="出现了问题"
            :error-message="error"
            :show-retry="false"
            :show-back="true"
            back-text="返回"
            @back="goBack"
            :suggestions="['请重新完成问答', '返回诗歌页面']"
          />
        </div>
        
        <!-- 输入步骤 -->
        <div v-if="!loading && !generatedPoem && !error" class="animate-fadeInUp">
          <!-- 标题 -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-4" style="color: var(--text-primary);">共笔</h1>
            <p class="text-lg" style="color: var(--text-secondary);">你起意，我落笔</p>
          </div>
          
          <!-- 原诗展示（可折叠） -->
          <div v-if="sourcePoem" class="source-poem-section">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold" style="color: var(--text-primary);">你读到的诗</h2>
              <button 
                @click="showSourcePoem = !showSourcePoem"
                class="toggle-button"
              >
                {{ showSourcePoem ? '折叠' : '展开' }}
              </button>
            </div>
            
            <div v-if="showSourcePoem" class="source-poem-viewer">
              <PoemViewer 
                :poem-title="sourcePoem.title"
                :quote-text="sourcePoem.quote"
                :quote-citation="sourcePoem.quoteSource"
                :main-text="sourcePoem.content"
                animation-delay="0.1s"
                :show-actions="false"
                :show-download="false"
              />
            </div>
          </div>
          
          <!-- 输入区域 -->
          <div class="input-section">
            <h2 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">你的临时起意</h2>
            <div class="w-full">
              <textarea 
                v-model="userFeeling"
                :maxlength="50"
                rows="4"
                class="feeling-input"
                :class="{ 'feeling-input-limit': userFeeling.length >= 50 }"
                placeholder=""
              />
              <div class="flex justify-end items-center mt-1 w-full">
                <span v-if="userFeeling.length >= 50" class="limit-hint mr-2">
                  念头不用太纷扰
                </span>
                <span 
                  class="char-count"
                  :class="{ 'char-count-limit': userFeeling.length >= 50 }"
                >
                  {{ userFeeling.length }} / 50
                </span>
              </div>
            </div>
            
            <!-- 操作按钮 - 三列布局：取消、主要操作、重新开始 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <button 
              @click="goBack"
              class="btn-control-base btn-control-hover btn-control-disabled px-6 py-3 rounded-lg font-medium text-body"
              style="background-color: var(--bg-secondary); color: var(--text-secondary);"
            >
              取消
            </button>
            <button 
              @click="handleSubmit"
              :disabled="!userFeeling.trim()"
              class="btn-gongbi text-body font-medium px-6 py-3 rounded-lg"
            >
              陆家明的闻言落笔
            </button>
            <button 
              @click="startOver"
              class="btn-restart text-body font-medium px-6 py-3 rounded-lg"
            >
              重新开始
            </button>
            </div>
          </div>
        </div>
        
        <!-- 生成中状态 -->
        <div v-if="loading" class="gongbi-loading animate-fadeInUp">
          <div class="loading-icon-wrapper">
            <img 
              src="/lujiaming_icon.png" 
              alt="陆家明"
              class="loading-icon"
            />
          </div>
          <p class="loading-text">诗渐浓，君稍待</p>
          
          <!-- 歌词式诗歌滚动 -->
          <div 
            v-if="currentLyricPoem" 
            class="lyric-container"
            :class="{ 'lyric-transitioning': isPoemTransitioning }"
          >
            <!-- 3行歌词区域 -->
            <div class="lyric-lines">
              <TransitionGroup name="lyric" tag="div" class="lyric-track">
                <p 
                  v-for="(line, idx) in visibleLinesArray" 
                  :key="line.key"
                  class="lyric-line"
                  :class="{ 
                    'lyric-current': idx === 1,
                    'lyric-dim': idx !== 1 
                  }"
                >
                  {{ line.text }}
                </p>
              </TransitionGroup>
            </div>
            
            <!-- 固定底部：章节 · 标题  作者 -->
            <p class="lyric-meta">
              {{ currentLyricPoem.chapter }} · {{ currentLyricPoem.title }}  吴任几
            </p>
          </div>
        </div>
        
        <!-- 结果展示 - 使用PoemViewer组件 -->
        <div v-if="generatedPoem && !loading" class="space-y-6">
          <!-- 陆家明生成的诗歌卡片 -->
          <PoemViewer 
            :poem-title="generatedPoem.title"
            :quote-text="generatedPoem.quote"
            :quote-citation="generatedPoem.quoteSource"
            :main-text="generatedPoem.content"
            animation-delay="0.2s"
            :show-actions="false"
            :show-download="false"
            :show-ai-label="true"
          />
          
          <!-- 保存状态提示 -->
          <div class="save-status-tip animate-fadeInUp" style="animation-delay: 0.3s;">
            <!-- 已登录：保存中 -->
            <div v-if="isLoggedIn && saving" class="tip-card tip-saving">
              <span class="tip-icon">⏳</span>
              <span class="tip-text">正在保存到作品集...</span>
            </div>
            
            <!-- 已登录：保存成功 -->
            <div v-else-if="isLoggedIn && saved" class="tip-card tip-success">
              <span class="tip-icon">✅</span>
              <span class="tip-text">已保存到我的作品集</span>
              <router-link to="/my-works" class="tip-link">查看作品</router-link>
            </div>
            
            <!-- 已登录：保存失败 -->
            <div v-else-if="isLoggedIn && saveError" class="tip-card tip-error">
              <span class="tip-icon">❌</span>
              <span class="tip-text">保存失败：{{ saveError }}</span>
              <button @click="handleAutoSave" class="tip-retry">重试</button>
            </div>
            
            <!-- 未登录：引导登录 -->
            <div v-else-if="!isLoggedIn" class="tip-card tip-info">
              <span class="tip-icon">💡</span>
              <span class="tip-text">登录后可以保存作品到作品集</span>
              <router-link to="/login" class="tip-login">去登录</router-link>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeInUp" style="animation-delay: 0.2s;">
            <button 
              @click="resetAndRetry"
              class="btn-control-base btn-control-hover px-6 py-3 rounded-lg font-medium text-body"
              style="background-color: var(--bg-secondary); color: var(--text-secondary);"
            >
              再写一首
            </button>
            <button 
              @click="goBack"
              class="btn-restart px-6 py-3 rounded-lg font-medium text-body"
            >
              返回诗歌页
            </button>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useZhouStore } from '@/modules/zhou/lianxi/stores/zhou'
import { createGongBi, getGongBiErrorMessage } from '@/modules/zhou/lianxi/services/gongBiApi'
import { saveGongBiWork, isAuthenticated } from '@/core/auth/services/authApi'
import PoemViewer from '@/modules/zhou/lianxi/components/PoemViewer.vue'
import { ErrorState, UserNavigation } from '@/shared/components'

const router = useRouter()
const route = useRoute()
const zhouStore = useZhouStore()

// ================================
// 响应式状态
// ================================
const userFeeling = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const showSourcePoem = ref(true)

// 歌词式诗歌滚动状态
interface LyricPoem {
  title: string
  chapter: string
  lines: string[]
}
const lyricPoems = ref<LyricPoem[]>([])
const currentPoemIndex = ref(0)
const currentLineIndex = ref(0)
const isPoemTransitioning = ref(false) // 诗歌切换过渡状态
let lyricTimer: ReturnType<typeof setInterval> | null = null

// 原诗信息
const sourcePoem = ref<{
  title: string
  quote: string | null
  quoteSource: string | null
  content: string
} | null>(null)

// 生成的诗歌
const generatedPoem = ref<{
  title: string
  quote: string
  quoteSource: string
  content: string
  userFeeling: string
  metadata?: {
    conversationId: string
    messageId: string
    tokens: number
  }
} | null>(null)

// 保存状态
const saving = ref(false)
const saved = ref(false)
const saveError = ref<string | null>(null)

// 计算属性：是否已登录
const isLoggedIn = computed(() => isAuthenticated())

// URL参数（用于API调用）
const urlParams = ref<{
  chapter: string
  pattern: string
  poem: string
} | null>(null)

// ================================
// 歌词式诗歌滚动功能
// ================================

// 从store获取随机诗歌用于歌词滚动
function loadLyricPoems() {
  const poems = zhouStore.universeData.poems
  const mappings = zhouStore.universeData.mappings
  const poemTitles = Object.keys(poems)
  
  if (poemTitles.length === 0) return
  
  // 随机打乱并取前5首
  const shuffled = [...poemTitles].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 5)
  
  lyricPoems.value = selected.map(title => {
    const poem = poems[title]
    // 获取章节名（从mappings中查找）
    let chapter = ''
    if (mappings.units) {
      for (const [chapterName, unit] of Object.entries(mappings.units)) {
        if (unit && typeof unit === 'object') {
          // unit是 Record<pattern, { poemTitle: string }>
          for (const mapping of Object.values(unit)) {
            if (mapping && typeof mapping === 'object' && 'poemTitle' in mapping) {
              if ((mapping as { poemTitle: string }).poemTitle === title) {
                chapter = chapterName
                break
              }
            }
          }
          if (chapter) break
        }
      }
    }
    // 分割诗歌行
    const lines = poem.main_text 
      ? poem.main_text.split('\n').filter((l: string) => l.trim())
      : []
    return { title, chapter, lines }
  })
}

// 滚动一行
function scrollNextLine() {
  if (lyricPoems.value.length === 0) return
  
  const currentPoem = lyricPoems.value[currentPoemIndex.value]
  if (!currentPoem) return
  
  // 滚动到下一行
  if (currentLineIndex.value < currentPoem.lines.length - 1) {
    currentLineIndex.value++
    // 继续计时下一行
    lyricTimer = setTimeout(scrollNextLine, 3500)
  } else {
    // 当前诗歌播完，开始切换
    transitionToNextPoem()
  }
}

// 切换到下一首诗（淡出 → 切换内容 → 淡入 → 开始计时）
function transitionToNextPoem() {
  // 1. 开始淡出
  isPoemTransitioning.value = true
  
  // 2. 淡出完成后（800ms）
  setTimeout(() => {
    // 3. 切换诗歌内容（此时opacity=0，用户看不到）
    currentPoemIndex.value = (currentPoemIndex.value + 1) % lyricPoems.value.length
    currentLineIndex.value = 0
    
    // 4. 短暂停顿后开始淡入（100ms）
    setTimeout(() => {
      isPoemTransitioning.value = false
      
      // 5. 淡入完成后开始计时（800ms后）
      setTimeout(() => {
        lyricTimer = setTimeout(scrollNextLine, 3500)
      }, 800)
    }, 100)
  }, 800)
}

// 启动歌词滚动
function startLyricScroll() {
  if (lyricTimer) return
  loadLyricPoems()
  currentPoemIndex.value = 0
  currentLineIndex.value = 0
  isPoemTransitioning.value = false
  
  // 开始第一次计时
  lyricTimer = setTimeout(scrollNextLine, 3500)
}

// 停止歌词滚动
function stopLyricScroll() {
  if (lyricTimer) {
    clearTimeout(lyricTimer)
    lyricTimer = null
  }
}

// 当前诗歌
const currentLyricPoem = computed(() => {
  if (lyricPoems.value.length === 0) return null
  return lyricPoems.value[currentPoemIndex.value]
})

// 当前显示的3行（前一行、当前行、后一行）- 用于TransitionGroup
const visibleLinesArray = computed(() => {
  if (!currentLyricPoem.value) return []
  const lines = currentLyricPoem.value.lines
  const idx = currentLineIndex.value
  const poemIdx = currentPoemIndex.value
  
  return [
    { key: `${poemIdx}-${idx - 1}`, text: idx > 0 ? lines[idx - 1] : '' },
    { key: `${poemIdx}-${idx}`, text: lines[idx] || '' },
    { key: `${poemIdx}-${idx + 1}`, text: idx < lines.length - 1 ? lines[idx + 1] : '' }
  ]
})

// 监听loading状态，启动/停止歌词滚动
watch(loading, (isLoading) => {
  if (isLoading) {
    startLyricScroll()
  } else {
    stopLyricScroll()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  stopLyricScroll()
})

// ================================
// 生命周期
// ================================
onMounted(async () => {
  // 开发调试：?debug=loading 直接进入loading状态
  if (route.query.debug === 'loading') {
    // 先加载宇宙数据以获取诗歌
    await zhouStore.loadUniverseContent()
    loading.value = true
    return
  }
  
  // 从URL参数读取数据
  const chapterParam = route.query.chapter as string | undefined
  const patternParam = route.query.pattern as string | undefined
  const poemParam = route.query.poem as string | undefined
  
  if (!chapterParam || !patternParam || !poemParam) {
    error.value = '缺少必要参数，请重新完成问答'
    setTimeout(() => router.replace('/zhou'), 2000)
    return
  }
  
  // 保存URL参数用于后续API调用
  urlParams.value = {
    chapter: chapterParam,
    pattern: patternParam,
    poem: poemParam
  }
  
  try {
    // 加载原诗数据
    await zhouStore.loadPoemByParams(chapterParam, patternParam, poemParam)
    
    // 从store中提取诗歌数据
    const poem = zhouStore.result.selectedPoem
    if (!poem || !poem.body) {
      throw new Error('未能加载诗歌数据')
    }
    
    // 解析诗歌body
    const poemBody = typeof poem.body === 'string' ? JSON.parse(poem.body) : poem.body
    
    sourcePoem.value = {
      title: poemParam,
      quote: poemBody?.quote_text || null,
      quoteSource: poemBody?.quote_citation || null,
      content: poemBody?.main_text || (typeof poem.body === 'string' ? poem.body : '')
    }
    
    console.log('[GongBiView] 原诗加载成功:', sourcePoem.value.title)
    
  } catch (err) {
    console.error('[GongBiView] 加载原诗失败:', err)
    error.value = '加载诗歌失败，请稍后重试'
    setTimeout(() => router.replace('/zhou'), 2000)
  }
})

// ================================
// 方法
// ================================

// 提交感受，生成诗歌
const handleSubmit = async () => {
  if (!userFeeling.value.trim() || !urlParams.value) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    console.log('[GongBiView] 提交感受:', {
      feeling: userFeeling.value,
      params: urlParams.value
    })
    
    // 调用真实的共笔API
    const poem = await createGongBi({
      chapterKey: urlParams.value.chapter,
      answerPattern: urlParams.value.pattern,
      poemTitle: urlParams.value.poem,
      userFeeling: userFeeling.value
    })
    
    generatedPoem.value = poem
    
    console.log('[GongBiView] 诗歌生成成功:', poem.title)
    
    // 如果已登录，自动保存作品
    if (isLoggedIn.value) {
      await handleAutoSave()
    } else {
      // 未登录：存储到localStorage，登录后自动保存
      storePendingWork()
    }
    
  } catch (err) {
    console.error('[GongBiView] 生成诗歌失败:', err)
    error.value = getGongBiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

// 存储待保存的作品到localStorage（未登录用户）
const storePendingWork = () => {
  if (!generatedPoem.value || !urlParams.value) {
    return
  }
  
  try {
    const pendingWork = {
      poem: generatedPoem.value,
      urlParams: urlParams.value,
      timestamp: Date.now()
    }
    
    localStorage.setItem('pending_gongbi_work', JSON.stringify(pendingWork))
    console.log('[GongBiView] 临时数据已存储，等待登录后保存')
  } catch (err) {
    console.error('[GongBiView] 存储临时数据失败:', err)
  }
}

// 自动保存作品（已登录用户）
const handleAutoSave = async () => {
  if (!generatedPoem.value || !urlParams.value) {
    return
  }
  
  saving.value = true
  saved.value = false
  saveError.value = null
  
  try {
    // 构造sourcePoemId和mappingId
    const sourcePoemId = `zhou_${urlParams.value.chapter}_${urlParams.value.poem}`
    const mappingId = `${urlParams.value.chapter}_${urlParams.value.pattern}`
    
    console.log('[GongBiView] 自动保存作品:', {
      sourcePoemId,
      mappingId,
      hasMetadata: !!generatedPoem.value.metadata
    })
    
    const result = await saveGongBiWork({
      sourcePoemId,
      mappingId,
      userInput: generatedPoem.value.userFeeling,
      poemTitle: generatedPoem.value.title,
      poemContent: generatedPoem.value.content,
      poemQuote: generatedPoem.value.quote || null,
      poemQuoteSource: generatedPoem.value.quoteSource || null,
      conversationId: generatedPoem.value.metadata?.conversationId || '',
      messageId: generatedPoem.value.metadata?.messageId || '',
      usageMetadata: generatedPoem.value.metadata || {}
    })
    
    if (result.success) {
      saved.value = true
      console.log('[GongBiView] 作品保存成功')
    } else {
      saveError.value = result.error || '保存失败'
      console.error('[GongBiView] 作品保存失败:', result.error)
    }
  } catch (err: any) {
    saveError.value = err.message || '保存失败'
    console.error('[GongBiView] 作品保存异常:', err)
  } finally {
    saving.value = false
  }
}

// 重置状态，再写一首
const resetAndRetry = () => {
  userFeeling.value = ''
  generatedPoem.value = null
  error.value = null
  showSourcePoem.value = true
  saved.value = false
  saveError.value = null
}

// 返回上一页
const goBack = () => {
  // 返回到result页面（带URL参数）
  if (urlParams.value) {
    const params = new URLSearchParams({
      chapter: urlParams.value.chapter,
      pattern: urlParams.value.pattern,
      poem: urlParams.value.poem
    })
    router.push(`/result?${params.toString()}`)
  } else {
    router.back()
  }
}

// 重新开始 - 智能导航回到当前项目的子项目选择页
const startOver = () => {
  // 保存当前项目信息用于导航
  const currentProject = zhouStore.navigation.currentMainProject
  
  // 重置应用状态
  zhouStore.resetApp()
  
  // 智能导航：如果有当前主项目，返回其子项目选择页；否则返回主项目选择页
  if (currentProject) {
    router.push(`/project/${currentProject.id}`)
  } else {
    router.push('/zhou')
  }
}
</script>

<style scoped>
/* 使用全局样式变量 */

/* 原诗展示区域 */
.source-poem-section {
  padding: var(--spacing-lg);
  background: rgba(var(--card-bg-rgb), 0.6);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

/* 折叠/展开按钮 */
.toggle-button {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: var(--radius-base);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.toggle-button:hover {
  background-color: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

/* 原诗PoemViewer容器 - 修改卡片内部底部padding以保持视觉平衡 */
/* PoemViewer内部使用card-padding-poem: pt-3xl(64px) pb-lg(24px) */
/* 覆盖卡片本身的底部padding，使其与顶部对称 */
.source-poem-viewer :deep(.poem-content) {
  padding-bottom: 4rem; /* 64px，与pt-3xl对称 */
}

/* 输入区域容器 - 与诗歌区域宽度对齐 */
.input-section {
  width: 100%;
  padding: var(--spacing-lg);
}

/* 感受输入框 - 内嵌样式（参考进度条） */
.feeling-input {
  width: 100%;
  padding: 1rem;
  border-radius: var(--radius-lg);
  border: none;
  background-color: rgba(107, 114, 128, 0.12);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  line-height: 1.5;
  transition: all var(--duration-normal) var(--ease-out);
  resize: vertical;
  /* 内嵌阴影效果 - 参考ProgressBar */
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.12),
    inset 0 1px 2px rgba(0, 0, 0, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.4);
}

.feeling-input:focus {
  outline: none;
  background-color: rgba(107, 114, 128, 0.15);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.feeling-input-limit {
  background-color: rgba(245, 158, 11, 0.08);
  box-shadow: 
    inset 0 2px 4px rgba(245, 158, 11, 0.15),
    inset 0 1px 2px rgba(245, 158, 11, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.4);
}

.feeling-input-limit:focus {
  background-color: rgba(245, 158, 11, 0.12);
  box-shadow: 
    inset 0 2px 4px rgba(245, 158, 11, 0.18),
    inset 0 1px 2px rgba(245, 158, 11, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* 字数统计 - 右对齐+透明度（参考备案信息） */
.char-count {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  opacity: 0.5;
  transition: all var(--duration-fast) var(--ease-out);
}

/* 共笔加载状态 - 诗意化设计 */
.gongbi-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--spacing-2xl);
}

.loading-icon-wrapper {
  margin-bottom: var(--spacing-xl);
}

.loading-icon {
  width: 80px;
  height: 80px;
}

.loading-text {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  letter-spacing: 0.05em;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

/* 歌词式诗歌滚动样式 */
.lyric-container {
  margin-top: var(--spacing-3xl);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: opacity 0.8s ease;
}

/* 诗歌切换过渡效果 - 100%淡出 */
.lyric-transitioning {
  opacity: 0;
}

.lyric-lines {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.lyric-track {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  position: relative;
}

.lyric-line {
  font-size: var(--font-size-base);
  line-height: 1.8;
  min-height: 1.8em;
}

.lyric-dim {
  color: var(--text-tertiary);
  opacity: 0.4;
}

.lyric-current {
  color: var(--text-primary);
  font-weight: 500;
  opacity: 1;
}

/* TransitionGroup 平滑滚动动画 */
.lyric-move,
.lyric-enter-active,
.lyric-leave-active {
  transition: all 0.5s ease;
}

.lyric-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.lyric-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 关键：离开元素保持居中 */
.lyric-leave-active {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

.lyric-meta {
  margin-top: var(--spacing-xl);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.05em;
}


.char-count:hover {
  opacity: 0.7;
}

.char-count-limit {
  color: var(--color-warning);
  font-weight: 500;
  opacity: 0.8;
}

.char-count-limit:hover {
  opacity: 1;
}

/* 上限提示 */
.limit-hint {
  font-size: var(--font-size-sm);
  color: var(--color-warning);
  font-style: italic;
  opacity: 0.9;
}

/* 保存状态提示 */
.save-status-tip {
  width: 100%;
  max-width: 800px; /* 与PoemViewer对齐 */
  margin: 0 auto;
}

.tip-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  background: rgba(var(--card-bg-rgb), 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  transition: all var(--duration-normal) var(--ease-out);
}

.tip-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.tip-link,
.tip-login {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-primary-600);
  text-decoration: none;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-base);
  transition: all var(--duration-fast) var(--ease-out);
}

.tip-link:hover,
.tip-login:hover {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary-700);
}

.tip-retry {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-error);
  background: none;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.tip-retry:hover {
  background-color: rgba(var(--color-error-rgb, 239, 68, 68), 0.1);
}

.tip-success {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.05);
}

.tip-error {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}

.tip-info {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.tip-saving {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.05);
}

/* 响应式调整 */
@media (max-width: 480px) {
  .feeling-input {
    padding: 0.75rem;
    font-size: var(--font-size-sm);
  }
  
  .tip-card {
    padding: 0.75rem 1rem;
    font-size: var(--font-size-sm);
  }
  
  .tip-icon {
    font-size: 1rem;
  }
}
</style>

