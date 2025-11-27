/**
 * 摸诗API服务
 */

import type { SpinResult, MoshiSymbol } from '../types/moshi'

const API_BASE = '/api/moshi'

export const moshiApi = {
  /**
   * 执行一次摸诗
   */
  async spin(): Promise<SpinResult> {
    const response = await fetch(`${API_BASE}/spin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      throw new Error(`摸诗失败: ${response.status}`)
    }
    
    return response.json()
  },
  
  /**
   * 获取符号配置
   */
  async getSymbols(): Promise<MoshiSymbol[]> {
    const response = await fetch(`${API_BASE}/symbols`)
    
    if (!response.ok) {
      throw new Error(`获取符号失败: ${response.status}`)
    }
    
    const data = await response.json()
    return data.symbols
  }
}
