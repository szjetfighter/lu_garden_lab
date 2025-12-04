/**
 * 摸诗子模块导出
 * types和stores已提升到宇宙级 @/modules/mao/
 */

// Services（子模块专用）
export { moshiApi } from './services/moshiApi'

// Components（子模块专用）
export { default as SlotMachine } from './components/SlotMachine.vue'
export { default as StanzaDisplay } from './components/StanzaDisplay.vue'

// Views（子模块专用）
export { default as MoshiView } from './views/MoshiView.vue'

// Re-export from universe level for convenience
export * from '@/modules/mao/types/moshi'
export { useMoshiStore } from '@/modules/mao/stores/moshiStore'
