/**
 * 曹僧宇宙 - 新品发布模块类型定义
 */

/** 单个产品（对应组诗中的一个小节） */
export interface CaogongProduct {
  /** 产品ID */
  id: string
  /** 目录名称（导言中的名称） */
  catalogName: string
  /** 小节标题 */
  sectionTitle: string
  /** 副标题（如有） */
  subtitle?: string
  /** 诗行数组 */
  lines: string[]
  /** 产品序号 1-14 */
  order: number
}

/** 产品状态 */
export interface ProductState {
  /** 当前选中的产品ID */
  selectedProductId: string | null
  /** 弹窗是否打开 */
  isModalOpen: boolean
}
