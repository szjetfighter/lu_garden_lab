/**
 * lianxi子模块统一导出
 * types和stores已提升到宇宙级 @/modules/zhou/
 */

// 组件导出（子模块专用）
export * from './components'

// 视图导出（子模块专用）
export * from './views'

// Re-export from universe level for convenience
export * from '@/modules/zhou/types/zhou'
export { useZhouStore } from '@/modules/zhou/stores/zhou'

// 默认导出模块信息
export default {
  name: 'lianxi子模块',
  description: '周与春秋练习功能 - 基于吴任几《周与春秋练习》系列诗歌的互动体验',
  version: '1.0.0',
  components: [
    'QuestionCard',
    'PoemViewer', 
    'ClassicalEchoDisplay',
    'InterpretationDisplay',
    'ControlButtons'
  ],
  views: [
    'SubProjectSelection', 
    'QuizScreen',
    'ClassicalEchoScreen',
    'ResultScreen',
    'GongBiView'
  ]
}
