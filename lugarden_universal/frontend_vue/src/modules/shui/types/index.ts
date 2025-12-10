/**
 * 水宇宙 - 类型定义
 * 基于肖水《十二个故事集》诗集结构
 */

// 故事集定义（12个地域/主题故事集）
export interface StoryCollection {
  id: string
  name: string // 如 "渤海故事集"
  nameEn: string // 如 "bohai"
  dedication?: string // 献词，如南溪故事集的"献给湖南省郴州市北湖区南溪乡"
  poemCount: number
  dateRange: {
    start: string // YYYY.M.D
    end: string
  }
  regions: string[] // 涉及地域
  description?: string
}

// 单首诗（小说诗/新绝句）
export interface ShuiPoem {
  id: string
  collectionId: string // 所属故事集
  title: string // 诗题（多为地名）
  content: string[] // 诗行数组
  date: string // 创作日期 YYYY.M.D
  location?: string // 诗中涉及的主要地点
  characters?: string[] // 诗中人物标记（他/她/我）
  themes?: string[] // 主题标签
}

// 故事集统计
export interface CollectionStats {
  totalCollections: number
  totalPoems: number
  dateRange: {
    earliest: string
    latest: string
  }
  regions: string[]
}

// 宇宙状态
export interface ShuiState {
  collections: StoryCollection[]
  poems: ShuiPoem[]
  currentCollection: StoryCollection | null
  currentPoem: ShuiPoem | null
  isLoading: boolean
  error: string | null
}
