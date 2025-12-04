/**
 * 长度骨架：保留原始结构的字符长度
 * 用于匿名化后按原格式填充随机字符
 */

export interface ProductSkeleton {
  id: string
  catalogNameLength: number
  sectionTitleLength: number
  subtitleLength?: number
  order: number
  lineLengths: number[]
}

/** 14个产品的长度骨架 */
export const productSkeletons: ProductSkeleton[] = [
  {
    id: 'neiranji',
    catalogNameLength: 8,
    sectionTitleLength: 8,
    order: 1,
    lineLengths: [9, 9, 10, 9, 9, 10, 7, 9, 9, 9, 8, 8, 10, 9]
  },
  {
    id: 'paoche',
    catalogNameLength: 4,
    sectionTitleLength: 4,
    order: 2,
    lineLengths: [12, 11, 11, 11, 9, 10, 10, 11, 12, 11, 11, 12, 12, 11, 12]
  },
  {
    id: 'zhanjian',
    catalogNameLength: 4,
    sectionTitleLength: 5,
    subtitleLength: 12,
    order: 3,
    lineLengths: [10, 12, 11, 12, 10, 10, 8, 11, 10, 11, 10, 12, 12, 10]
  },
  {
    id: 'jiaoshoujia',
    catalogNameLength: 6,
    sectionTitleLength: 6,
    order: 4,
    lineLengths: [8, 8, 7, 8, 8, 8, 8, 6, 10, 11, 10, 7, 7, 8]
  },
  {
    id: 'daqiao',
    catalogNameLength: 13,
    sectionTitleLength: 13,
    order: 5,
    lineLengths: [10, 9, 8, 10, 13, 11, 10, 11, 12, 8, 9, 10]
  },
  {
    id: 'chaiqianbi',
    catalogNameLength: 6,
    sectionTitleLength: 6,
    order: 6,
    lineLengths: [9, 9, 10, 7, 10, 10, 7, 8, 9, 8, 8, 10]
  },
  {
    id: 'bengji',
    catalogNameLength: 5,
    sectionTitleLength: 5,
    order: 7,
    lineLengths: [11, 11, 9, 10, 11, 10, 11, 9, 11, 10]
  },
  {
    id: 'cichangqi',
    catalogNameLength: 5,
    sectionTitleLength: 5,
    subtitleLength: 14,
    order: 8,
    lineLengths: [15, 16, 12, 16, 16, 14, 15, 13, 14]
  },
  {
    id: 'zhongzhidan',
    catalogNameLength: 5,
    sectionTitleLength: 13,
    order: 9,
    lineLengths: [10, 11, 10, 11, 10, 9, 11, 10, 10, 11, 11, 12, 12, 10, 11]
  },
  {
    id: 'daiyuntong',
    catalogNameLength: 8,
    sectionTitleLength: 10,
    order: 10,
    lineLengths: [13, 14, 13, 14, 13, 13, 13, 12, 12, 14, 13, 14, 13]
  },
  {
    id: 'cibei',
    catalogNameLength: 4,
    sectionTitleLength: 4,
    order: 11,
    lineLengths: [12, 13, 12, 10, 11, 10, 10, 11, 9, 10, 9, 11, 11, 10, 11]
  },
  {
    id: 'panyanti',
    catalogNameLength: 3,
    sectionTitleLength: 6,
    order: 12,
    lineLengths: [8, 12, 10, 10, 10, 11, 10, 9, 13, 8, 9]
  },
  {
    id: 'wudijing',
    catalogNameLength: 3,
    sectionTitleLength: 6,
    order: 13,
    lineLengths: [10, 10, 11, 9, 11, 11, 12, 11, 11, 13, 10, 10]
  },
  {
    id: 'jixiebiao',
    catalogNameLength: 5,
    sectionTitleLength: 5,
    subtitleLength: 8,
    order: 14,
    lineLengths: [10, 11, 10, 11, 9, 11, 10, 9, 9, 9, 11]
  }
]

/** 滚动文字长度 */
export const scrollContentLength = 95

/** 导言目录长度 */
export const catalogIntroLength = 80
