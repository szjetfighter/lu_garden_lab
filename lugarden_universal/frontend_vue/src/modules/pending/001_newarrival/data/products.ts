/**
 * 匿名化产品数据生成器
 * 原素材授权已撤回，使用字符池随机填充
 */

import type { CaogongProduct } from '../types/xinpin'
import { productSkeletons, scrollContentLength, catalogIntroLength } from './skeleton'
import { randomFill, randomFillLines } from '../utils/randomFill'

/**
 * 生成匿名化产品数据
 * 每次调用都会生成新的随机内容
 */
export function generateProducts(): CaogongProduct[] {
  return productSkeletons.map(skeleton => ({
    id: skeleton.id,
    catalogName: randomFill(skeleton.catalogNameLength),
    sectionTitle: randomFill(skeleton.sectionTitleLength),
    subtitle: skeleton.subtitleLength ? randomFill(skeleton.subtitleLength) : undefined,
    order: skeleton.order,
    lines: randomFillLines(skeleton.lineLengths)
  }))
}

/** 根据产品列表生成滚动文字 */
export function generateScrollContent(productList: CaogongProduct[]): string {
  const prefix = 'NEW ARRIVAL ◆ '
  const suffix = ' _◆ ◆ ◆_'
  // 用◇连接所有产品的catalogName
  const middle = productList.map(p => p.catalogName).join('◇')
  return prefix + middle + suffix
}

/** 生成匿名化导言目录 */
export function generateCatalogIntro(): string {
  return randomFill(catalogIntroLength)
}

/** 响应式产品数据（每次刷新重新生成） */
export const products: CaogongProduct[] = generateProducts()

/** 导言目录文本（匿名化） */
export const catalogIntro = generateCatalogIntro()

/** 诗歌创作时间（保留格式，内容匿名化） */
export const creationDate = '████.██.██-██'
