/**
 * 曹僧宇宙 - 新品发布模块导出
 */

// Types
export * from './types/xinpin'

// Data
export { products, catalogIntro, creationDate } from './data/products'

// Components
export { default as VendingMachine } from './components/VendingMachine.vue'
export { default as VendingMachine3D } from './components/VendingMachine3D.vue'
export { default as ProductSlot } from './components/ProductSlot.vue'
export { default as ProductModal } from './components/ProductModal.vue'

// Views
export { default as XinpinView } from './views/XinpinView.vue'

// 模块信息
export default {
  name: '新品发布',
  description: '曹僧宇宙 - 基于《新品发布》组诗的自动售货机交互体验',
  version: '1.0.0',
  author: '曹僧',
  creationDate: '2015.02.10-17'
}
