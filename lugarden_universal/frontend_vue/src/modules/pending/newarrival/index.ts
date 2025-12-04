/**
 * [INCOGNITO] - 新品发布模块导出
 * 内容已匿名化
 */

// Types
export * from './types/xinpin'

// Data
export { products, catalogIntro, creationDate } from './data/products'

// Components
export { default as VendingMachine3D } from './components/VendingMachine3D.vue'
export { default as ProductModal } from './components/ProductModal.vue'

// Views
export { default as XinpinView } from './views/XinpinView.vue'

// 模块信息
export default {
  name: 'NEW ARRIVAL',
  description: '[ANONYMIZATION] - 3D自动售货机交互体验',
  version: '1.0.0',
  author: 'INCOGNITO',
  creationDate: 'INCOGNITO'
}
