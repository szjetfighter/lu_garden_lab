/**
 * 摸诗API服务
 */

import type { SpinResult, MoshiSymbol } from '@/modules/mao/types/moshi'

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
  },
  
  /**
   * 获取完整诗歌
   */
  async getPoem(poemId: string): Promise<{
    id: string
    title: string
    section: string
    stanzas: Array<{ id: string; index: number; content: string }>
  } | null> {
    const response = await fetch(`${API_BASE}/poem/${encodeURIComponent(poemId)}`)
    
    if (response.status === 404) {
      return null
    }
    
    if (!response.ok) {
      throw new Error(`获取诗歌失败: ${response.status}`)
    }
    
    const data = await response.json()
    return data.poem
  }
}
