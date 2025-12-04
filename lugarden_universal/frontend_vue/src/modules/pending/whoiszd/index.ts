/**
 * 「谁是臧棣」实验模块
 * 
 * 一个关于AI诗歌模仿与"光晕消逝"的社会学实验游戏
 */

// 类型导出
export * from './types/whoiszd'

// Composables导出
export { useCooldown } from './composables/useCooldown'
export { useGameState } from './composables/useGameState'

// 视图组件导出
export { default as EntryGuard } from './views/EntryGuard.vue'
export { default as ConfirmView } from './views/ConfirmView.vue'
export { default as GameView } from './views/GameView.vue'
export { default as TerminatedView } from './views/TerminatedView.vue'
export { default as ResultView } from './views/ResultView.vue'
