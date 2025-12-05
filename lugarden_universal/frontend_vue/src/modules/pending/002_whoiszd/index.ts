/**
 * 「谁是臧棣」实验模块
 * 
 * 一个关于AI诗歌模仿与"光晕消逝"的社会学实验游戏
 */

// 类型导出（公共接口）
export * from './types/whoiszd'

// 视图组件导出（公共接口 - 仅路由入口）
export { default as EntryGuard } from './views/EntryGuard.vue'

// 注意：ConfirmPhase, GamePhase, TerminatedPhase, ResultPhase 
// 是 EntryGuard 的内部组件，不对外导出（Modular Monolith 封装原则）
