/**
 * 从 toxicology_zhengti.json 加载诗歌数据
 */

import toxicologyData from './toxicology_zhengti.json'

// JSON 中的 Token 类型
interface JsonToken {
  text: string
  type: string
  rpm: number
  weight: number
}

// JSON 中的诗歌类型
interface JsonPoem {
  title: string
  tokenCount: number
  tokens: JsonToken[]
}

// 粒子系统需要的 Token 类型
export interface ToxicToken {
  char: string
  weight: number
  type: 'core' | 'link' | 'dust'
}

// 粒子系统需要的诗歌类型
export interface ToxicPoem {
  id: string
  title: string
  author: string
  tokens: ToxicToken[]  // 扁平化的 token 列表
}

// 类型映射：根据 type 前缀判断 core/link/dust
function mapTokenType(type: string, weight: number): 'core' | 'link' | 'dust' {
  // 高权重 (>0.5) = core
  if (weight > 0.5) return 'core'
  // 中等权重 (0.2-0.5) = link
  if (weight > 0.2) return 'link'
  // 低权重 (<0.2) = dust
  return 'dust'
}

// 将 JSON 诗歌转换为粒子系统格式
function convertPoem(jsonPoem: JsonPoem, index: number): ToxicPoem {
  const tokens: ToxicToken[] = []
  
  jsonPoem.tokens.forEach(token => {
    // 将每个 text 拆分为单个字符
    const chars = token.text.split('')
    chars.forEach(char => {
      tokens.push({
        char,
        weight: token.weight,
        type: mapTokenType(token.type, token.weight)
      })
    })
  })
  
  return {
    id: `poem_${index}`,
    title: jsonPoem.title,
    author: '冯铗',
    tokens
  }
}

// 加载所有诗歌
export function loadAllPoems(): ToxicPoem[] {
  const data = toxicologyData as { poems: JsonPoem[] }
  return data.poems.map((p, i) => convertPoem(p, i))
}

// 获取诗歌列表（标题）
export function getPoemTitles(): string[] {
  const data = toxicologyData as { poems: JsonPoem[] }
  return data.poems.map(p => p.title)
}

// 获取单首诗歌
export function getPoem(index: number): ToxicPoem | undefined {
  const poems = loadAllPoems()
  return poems[index]
}

// 获取随机诗歌
export function getRandomPoem(): ToxicPoem {
  const poems = loadAllPoems()
  const index = Math.floor(Math.random() * poems.length)
  return poems[index]
}

// 统计信息
export function getStats() {
  const data = toxicologyData as { meta: { stats: unknown } }
  return data.meta.stats
}
