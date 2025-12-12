import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ShuiPoem {
    id: string
    collectionId: string
    title: string
    content?: string
    date: string
    location?: string | null
    index: number
}

export interface ShuiCollection {
    id: string
    name: string
    nameEn: string
    dedication?: string | null
    description?: string | null
    dateStart: string
    dateEnd: string
    regions: string | null
    poemCount: number
    poems?: ShuiPoem[]
}

export const useShuiStore = defineStore('shui', () => {
    const collections = ref<ShuiCollection[]>([])
    const selectedCollection = ref<ShuiCollection | null>(null)
    const selectedPoem = ref<ShuiPoem | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // 解析regions JSON字符串
    function parseRegions(regions: string | null): string[] {
        if (!regions) return []
        try {
            return JSON.parse(regions)
        } catch {
            return []
        }
    }

    // 时间范围（用于时间轴）
    const timeRange = computed(() => {
        if (collections.value.length === 0) return { start: 2015, end: 2025 }
        const dates = collections.value.flatMap(c => [c.dateStart, c.dateEnd])
        const years = dates.map(d => parseInt(d.split('.')[0])).filter(y => !isNaN(y))
        return { start: Math.min(...years), end: Math.max(...years) }
    })

    // 获取海图数据（含诗歌摘要）
    async function fetchMapData() {
        if (collections.value.length > 0) return
        loading.value = true
        error.value = null
        try {
            const response = await fetch('/api/universes/shui/map')
            if (!response.ok) throw new Error('Failed to fetch map data')
            collections.value = await response.json()
        } catch (err: any) {
            console.error('[ShuiStore] fetchMapData failed:', err)
            error.value = err.message || '加载海图数据失败'
        } finally {
            loading.value = false
        }
    }

    // 获取单个故事集详情（含完整诗歌）
    async function fetchCollectionDetail(collectionId: string) {
        loading.value = true
        error.value = null
        try {
            const response = await fetch(`/api/universes/shui/collections/${collectionId}`)
            if (!response.ok) throw new Error('Failed to fetch collection')
            selectedCollection.value = await response.json()
        } catch (err: any) {
            console.error('[ShuiStore] fetchCollectionDetail failed:', err)
            error.value = err.message || '加载故事集失败'
        } finally {
            loading.value = false
        }
    }

    // 获取单首诗歌详情
    async function fetchPoemDetail(poemId: string) {
        loading.value = true
        error.value = null
        try {
            const response = await fetch(`/api/universes/shui/poems/${poemId}`)
            if (!response.ok) throw new Error('Failed to fetch poem')
            selectedPoem.value = await response.json()
        } catch (err: any) {
            console.error('[ShuiStore] fetchPoemDetail failed:', err)
            error.value = err.message || '加载诗歌失败'
        } finally {
            loading.value = false
        }
    }

    // 选中/取消选中故事集
    function selectCollection(collection: ShuiCollection | null) {
        selectedCollection.value = collection
    }

    // 清除选中
    function clearSelection() {
        selectedCollection.value = null
        selectedPoem.value = null
    }

    return {
        collections,
        selectedCollection,
        selectedPoem,
        loading,
        error,
        timeRange,
        parseRegions,
        fetchMapData,
        fetchCollectionDetail,
        fetchPoemDetail,
        selectCollection,
        clearSelection
    }
})
