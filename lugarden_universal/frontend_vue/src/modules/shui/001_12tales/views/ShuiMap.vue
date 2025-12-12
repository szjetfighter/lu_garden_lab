<template>
  <div class="shui-map-view relative w-full h-screen overflow-hidden bg-[#eef2f6] flex flex-col">
    
    <!-- 1. 背景层: 潮汐动效 -->
    <div class="fixed inset-0 bg-gradient-to-b from-[#e0f7fa] to-[#e8eaf6]"></div>
    <div class="tide-layer fixed inset-0 opacity-30 mix-blend-overlay"></div>

    <!-- 2. 顶部导航 -->
    <div class="relative z-50 p-4 flex justify-between items-start shrink-0">
      <BackButton text="返回" variant="ghost" size="medium" @click="goBack" />
      <div class="text-right">
        <h1 class="text-lg font-bold text-slate-700 tracking-widest font-serif">海图 · 故事集</h1>
        <p class="text-xs text-slate-400 font-mono">2015 — 2020</p>
      </div>
    </div>

    <!-- 3. 主体：地图区域 -->
    <div class="flex-1 relative z-10 flex items-center justify-center px-6" v-if="!shuiStore.loading">
      <!-- 地图容器卡片 -->
      <div class="map-container unified-content-card rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-blue-100 w-full max-w-4xl h-full max-h-[60vh] overflow-hidden">
        <ChinaMapSvg 
          :activeId="selectedCollectionId"
          :hoveredId="hoveredCollectionId"
          @hover="hoveredCollectionId = $event"
          @select="handleMapSelect"
        />
      </div>
      
      <!-- 选中故事集的诗歌列表侧边栏 -->
      <Transition name="slide">
        <div 
          v-if="selectedCollection" 
          class="poems-sidebar absolute right-0 top-0 bottom-24 w-80 bg-white/95 backdrop-blur-md shadow-xl border-l border-blue-100 overflow-y-auto z-20"
        >
          <div class="p-4 border-b border-blue-50 sticky top-0 bg-white/95 backdrop-blur-md">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-slate-800 font-serif">{{ selectedCollection.name }}</h3>
                <p class="text-xs text-blue-400 font-mono mt-1">{{ selectedCollection.poemCount }} 首诗</p>
              </div>
              <button @click="selectedCollectionId = null" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-2">
            <div 
              v-for="poem in selectedCollection.poems" 
              :key="poem.id"
              class="poem-item p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
              @click="handleSelectPoem(poem)"
            >
              <div class="text-xs text-blue-300 font-mono mb-1">{{ poem.date }}</div>
              <div class="text-sm text-slate-700">{{ poem.title }}</div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    
    <!-- 4. 底部：横向时间轴 -->
    <div class="timeline-bar relative z-30 h-24 bg-white/80 backdrop-blur-md border-t border-blue-100 shrink-0">
      <div class="h-full flex items-center px-8 overflow-x-auto">
        <!-- 时间轴线 -->
        <div class="absolute top-1/2 left-8 right-8 h-px bg-blue-200"></div>
        
        <!-- 时间节点 -->
        <div class="flex items-center gap-8 relative">
          <div 
            v-for="col in mapCollections" 
            :key="col.id"
            class="timeline-node-h flex flex-col items-center cursor-pointer group"
            @mouseenter="hoveredCollectionId = col.id"
            @mouseleave="hoveredCollectionId = null"
            @click="handleMapSelect(col.id)"
          >
            <!-- 节点圆点 -->
            <div 
              class="w-4 h-4 rounded-full border-2 transition-all duration-300"
              :class="selectedCollectionId === col.id 
                ? 'bg-blue-500 border-blue-500 scale-125' 
                : hoveredCollectionId === col.id 
                  ? 'bg-blue-100 border-blue-400' 
                  : 'bg-white border-blue-300'"
            ></div>
            <!-- 标签 -->
            <div class="mt-2 text-center whitespace-nowrap">
              <div 
                class="text-xs font-medium transition-colors"
                :class="selectedCollectionId === col.id ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-500'"
              >
                {{ col.name.replace('故事集', '') }}
              </div>
              <div class="text-[10px] text-slate-400 font-mono">{{ col.dateStart.split('.').slice(0,2).join('.') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="shuiStore.loading" class="fixed inset-0 flex items-center justify-center z-40 bg-white/50">
      <span class="text-slate-400 tracking-widest animate-pulse">正在测绘海域...</span>
    </div>
    
    <!-- 诗歌详情弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedPoem" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="closePoem">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div class="poem-modal relative bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
            <button @click="closePoem" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div class="text-xs text-blue-400 mb-2 font-mono">{{ selectedPoem.date }} · {{ selectedPoem.location || '未知' }}</div>
            <h2 class="text-2xl font-bold text-slate-800 mb-6 font-serif">{{ selectedPoem.title }}</h2>
            <div class="poem-content text-slate-700 leading-loose whitespace-pre-line font-serif">{{ selectedPoem.content }}</div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShuiStore, type ShuiCollection, type ShuiPoem } from '@/stores/shuiStore'
import BackButton from '@/shared/components/BackButton.vue'
import ChinaMapSvg from '@/modules/shui/components/ChinaMapSvg.vue'

const router = useRouter()
const shuiStore = useShuiStore()

// 只展示有明确地理位置的6个故事集
const MAP_COLLECTION_IDS = [
  'shui_collection_bohai',    // 渤海
  'shui_collection_taiyuan',  // 太原
  'shui_collection_jiangdong',// 江东
  'shui_collection_nanling',  // 南岭
  'shui_collection_nanxi',    // 南溪
  'shui_collection_shanghai'  // 上海
]

const mapCollections = computed(() => 
  shuiStore.collections.filter(c => MAP_COLLECTION_IDS.includes(c.id))
)

// 交互状态
const selectedCollectionId = ref<string | null>(null)
const hoveredCollectionId = ref<string | null>(null)
const selectedPoem = ref<ShuiPoem | null>(null)

// 当前选中的故事集
const selectedCollection = computed(() => 
  mapCollections.value.find(c => c.id === selectedCollectionId.value) || null
)

// 地图/时间轴点击选择故事集
function handleMapSelect(collectionId: string) {
  if (selectedCollectionId.value === collectionId) {
    selectedCollectionId.value = null
  } else {
    selectedCollectionId.value = collectionId
  }
}

// 选择诗歌查看详情
async function handleSelectPoem(poem: ShuiPoem) {
  if (!poem.content) {
    await shuiStore.fetchPoemDetail(poem.id)
    selectedPoem.value = shuiStore.selectedPoem
  } else {
    selectedPoem.value = poem
  }
}

// 关闭诗歌弹窗
function closePoem() {
  selectedPoem.value = null
}

onMounted(async () => {
  if (shuiStore.collections.length === 0) {
    await shuiStore.fetchMapData()
  }
})

function goBack() {
  router.push('/shui/project/001_12tales')
}
</script>

<style scoped>
.tide-layer {
  background: 
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 60%),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10px);
  animation: tide-flow 20s ease-in-out infinite alternate;
}

@keyframes tide-flow {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.1); opacity: 0.5; }
}

.grid-lines {
  background-image: 
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 100px 100px;
}

/* 诗歌弹窗淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.poem-modal {
  animation: modal-in 0.3s ease;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 侧边栏滑入滑出 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
