/**
 * 「谁是臧棣」实验模块类型定义
 */

/** 单首诗歌数据 */
export interface ZangdiPoem {
  id: number              // 1-20
  title: string           // 诗歌标题
  body: string[]          // 诗歌正文（按行）
  generatedAt?: string    // 生成时间（用于最终揭示）
}

/** 诗歌集合 */
export interface ZangdiPoemCollection {
  version: string
  generatedBy: string     // "陆家明"
  poems: ZangdiPoem[]
}

/** 用户游戏状态（内存中，不持久化） */
export interface UserGameState {
  currentIndex: number           // 当前诗歌索引
  answers: ('yes' | 'no')[]      // 用户选择历史
  consecutiveYesCount: number    // 连续选"是"计数
  terminated: boolean            // 是否被强制终止
  completed: boolean             // 是否完成全部
  shuffleOrder: number[]         // 随机顺序
}

/** 冷却状态（localStorage持久化） */
export interface CooldownState {
  kickedAt: number       // 被踢出的时间戳（Date.now()）
  reason: 'consecutive'  // 踢出原因
}

/** 游戏阶段枚举 */
export type GamePhase = 
  | 'cooldown'      // 冷却期
  | 'disclaimer'    // 第一层声明
  | 'confirm'       // 第二层确认
  | 'playing'       // 游戏中
  | 'terminated'    // 被踢出
  | 'result'        // 结算揭示

/** 冷却配置常量 */
export const COOLDOWN_DURATION_MS = 60 * 1000  // 60秒冷却
export const CONSECUTIVE_LIMIT = 5              // 连续错误阈值
export const TOTAL_POEMS = 20                   // 诗歌总数

/** localStorage键名 */
export const STORAGE_KEY_COOLDOWN = 'whoiszd_cooldown'
