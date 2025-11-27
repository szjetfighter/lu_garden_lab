/**
 * 摸诗模块类型定义
 */

export interface MoshiSymbol {
  id: string
  name: string
  emoji: string
  type: 'character' | 'scene' | 'wild'
}

export interface WinDetail {
  symbolId: string
  symbol: MoshiSymbol
  columns: number
}

export interface Stanza {
  id: string
  content: string
  poemId: string
  index: number
  poem: { title: string }
}

export interface SpinResult {
  status: string
  matrix: MoshiSymbol[][]  // 5列 x 3行
  win: boolean
  winDetails: WinDetail[]
  winningCells: [number, number][]  // 所有中奖格子坐标（兼容）
  primaryWinDetail: WinDetail | null  // 实际产生stanza的符号详情
  primaryWinningCells: [number, number][]  // 只包含primarySymbol的格子
  stanza: Stanza | null
  stanzaSource: 'intersection' | 'fallback' | null
  debug?: {
    poolSizes: Record<string, number>
  }
}

export interface MoshiState {
  isSpinning: boolean
  matrix: MoshiSymbol[][] | null
  lastResult: SpinResult | null
  spinCount: number
  winCount: number
}
