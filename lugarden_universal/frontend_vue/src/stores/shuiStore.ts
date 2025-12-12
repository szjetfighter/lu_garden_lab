import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ShuiCollection {
    id: number
    name: string
    nameEn: string
    description?: string
    dateStart?: string
    dateEnd?: string
    regions?: string
    poemCount?: number
    poet?: string
}

export const useShuiStore = defineStore('shui', () => {
    const collections = ref<ShuiCollection[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchCollections() {
        // 避免重复加载
        if (collections.value.length > 0) return

        loading.value = true
        error.value = null
        try {
            const response = await fetch('/api/universes/shui/collections')
            if (!response.ok) {
                throw new Error('Failed to fetch collections')
            }
            const data = await response.json()
            collections.value = data
        } catch (err: any) {
            console.warn('Failed to fetch collections, falling back to mock data:', err)
            // Mock data fallback
            collections.value = [
                {
                    id: 1,
                    name: '十二个故事集',
                    nameEn: '12 Tales',
                    dateStart: '2024.01',
                    dateEnd: '2024.12',
                    description: '关于时间、记忆与重构的十二个实验性文本。',
                    poemCount: 12,
                    regions: '["上海", "梦境"]',
                    poet: '肖水'
                }
            ]
            // Not setting error here to allow UI to render mock data
            // error.value = err.message || '加载故事集失败'
        } finally {
            loading.value = false
        }
    }

    // 获取特定Collection
    function getCollectionById(id: number) {
        return collections.value.find(c => c.id === id)
    }

    return {
        collections,
        loading,
        error,
        fetchCollections,
        getCollectionById
    }
})
