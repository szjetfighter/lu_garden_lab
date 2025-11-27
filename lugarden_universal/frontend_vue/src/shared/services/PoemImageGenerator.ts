/**
 * 诗歌图片生成器
 * 使用 Canvas 2D API 原生绘制诗歌卡片
 * 
 * 共享服务：可被所有宇宙模块使用
 */

import { FontSizeCalculator } from './FontSizeCalculator'

// ============================================
// 周与春秋 配置
// ============================================
export interface ZhouImageConfig {
  title: string
  quote?: string | null
  quoteCitation?: string | null
  content: string
  author?: string | null
  createdAt?: string | null // 创建时间，用于水印
  watermarkPrefix?: string | null // 水印前缀，如"吴任几"，完整水印为"吴任几 © 陆家花园"
}

// ============================================
// 摸诗宇宙 配置
// ============================================
export interface MoshiStanza {
  index: number
  content: string
}

export interface MoshiImageConfig {
  title: string           // 诗名（用于生成来源"诗名 · 一"）
  stanzas: MoshiStanza[]
}

// 中文数字映射
const CHINESE_NUMBERS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十']

// LayoutMetrics 预留接口，未来可用于更复杂的布局计算
// interface LayoutMetrics {
//   canvasWidth: number
//   canvasHeight: number
//   cardX: number
//   cardY: number
//   cardWidth: number
//   cardHeight: number
//   contentX: number
//   contentWidth: number
//   scale: number
// }

// 样式常量（基于需求规格）
const STYLES = {
  // 背景
  bgColor: '#f1f5f9',
  bgPadding: 24,
  
  // 卡片
  cardBgStart: '#ffffff',
  cardBgEnd: '#f8fafc',
  cardRadius: 12,
  cardShadowColor: 'rgba(0,0,0,0.1)',
  cardShadowBlur: 32,
  cardShadowOffsetY: 8,
  cardPaddingTop: 64,
  cardPaddingBottom: 40,
  cardPaddingX: 32,
  
  // 字体
  fontFamily: '"Noto Serif SC", "SimSun", "宋体", serif',
  
  // 颜色
  titleColor: '#1f2937',
  quoteColor: '#4b5563',
  contentColor: '#1f2937',
  authorColor: '#374151',
  separatorColor: '#e5e7eb',
  sourceColor: '#6b7280',
  
  // 字号（2倍分辨率下的实际像素）
  titleSize: 48,
  quoteSize: 28,
  contentSize: 32,
  authorSize: 24,
  sourceSize: 24,
  watermarkSize: 20,
  
  // 行高
  titleLineHeight: 1.3,
  quoteLineHeight: 1.6,
  contentLineHeight: 1.8,
  
  // 间距
  titleMarginBottom: 40,
  quoteMarginBottom: 16,
  citationMarginBottom: 48,
  contentMarginBottom: 40,
  authorMarginTop: 24,
  sourceMarginTop: 24,
  watermarkMarginTop: 16,
  watermarkColor: '#9ca3af', // gray-400
  
  // 画布
  baseWidth: 750,
  scale: 2
} as const

/**
 * 诗歌图片生成器
 */
export class PoemImageGenerator {
  
  // ============================================
  // 周与春秋 - 生成诗歌卡片
  // ============================================
  public static async createZhouCard(config: ZhouImageConfig): Promise<Blob | null> {
    // 等待字体加载
    await document.fonts.ready
    
    const scale = STYLES.scale
    const baseWidth = STYLES.baseWidth
    
    // 创建临时canvas计算布局
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return null
    
    // 计算内容区域宽度
    const cardWidth = baseWidth - STYLES.bgPadding * 2
    const contentWidth = cardWidth - STYLES.cardPaddingX * 2
    
    // 计算各部分高度
    let totalContentHeight = STYLES.cardPaddingTop
    
    // 标题高度
    tempCtx.font = `bold ${STYLES.titleSize}px ${STYLES.fontFamily}`
    const titleLines = this.wrapText(tempCtx, config.title, contentWidth)
    totalContentHeight += titleLines.length * STYLES.titleSize * STYLES.titleLineHeight
    totalContentHeight += STYLES.titleMarginBottom
    
    // 引文高度
    let quoteLines: string[] = []
    if (config.quote) {
      tempCtx.font = `italic ${STYLES.quoteSize}px ${STYLES.fontFamily}`
      quoteLines = this.wrapText(tempCtx, config.quote, contentWidth * 0.85)
      totalContentHeight += quoteLines.length * STYLES.quoteSize * STYLES.quoteLineHeight
      totalContentHeight += STYLES.quoteMarginBottom
      
      // 出处
      if (config.quoteCitation) {
        totalContentHeight += STYLES.quoteSize * STYLES.quoteLineHeight
      }
      totalContentHeight += STYLES.citationMarginBottom
    }
    
    // 正文高度
    tempCtx.font = `600 ${STYLES.contentSize}px ${STYLES.fontFamily}`
    const contentLines = this.wrapTextMultiParagraph(tempCtx, config.content, contentWidth)
    totalContentHeight += contentLines.length * STYLES.contentSize * STYLES.contentLineHeight
    totalContentHeight += STYLES.contentMarginBottom
    
    // 作者高度
    if (config.author) {
      totalContentHeight += STYLES.authorMarginTop
      totalContentHeight += 1 // 分隔线
      totalContentHeight += 24 // 分隔线到文字间距
      totalContentHeight += STYLES.authorSize * 1.5
    }
    
    // 水印高度
    if (config.createdAt || config.watermarkPrefix) {
      totalContentHeight += STYLES.watermarkMarginTop
      totalContentHeight += STYLES.watermarkSize * 1.5
    }
    
    totalContentHeight += STYLES.cardPaddingBottom
    
    // 计算画布尺寸
    const cardHeight = totalContentHeight
    const canvasWidth = baseWidth
    const canvasHeight = cardHeight + STYLES.bgPadding * 2
    
    // 创建实际canvas（2倍分辨率）
    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth * scale
    canvas.height = canvasHeight * scale
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    // 应用缩放
    ctx.scale(scale, scale)
    
    // 绘制灰色背景
    ctx.fillStyle = STYLES.bgColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // 绘制卡片阴影
    ctx.save()
    ctx.shadowColor = STYLES.cardShadowColor
    ctx.shadowBlur = STYLES.cardShadowBlur
    ctx.shadowOffsetY = STYLES.cardShadowOffsetY
    
    // 绘制卡片背景（渐变）
    const cardX = STYLES.bgPadding
    const cardY = STYLES.bgPadding
    const gradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardHeight)
    gradient.addColorStop(0, STYLES.cardBgStart)
    gradient.addColorStop(1, STYLES.cardBgEnd)
    
    ctx.fillStyle = gradient
    this.roundRect(ctx, cardX, cardY, cardWidth, cardHeight, STYLES.cardRadius)
    ctx.fill()
    ctx.restore()
    
    // 绘制内容
    let currentY = STYLES.bgPadding + STYLES.cardPaddingTop
    const centerX = canvasWidth / 2
    
    // 绘制标题
    ctx.fillStyle = STYLES.titleColor
    ctx.font = `bold ${STYLES.titleSize}px ${STYLES.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    for (const line of titleLines) {
      ctx.fillText(line, centerX, currentY)
      currentY += STYLES.titleSize * STYLES.titleLineHeight
    }
    currentY += STYLES.titleMarginBottom
    
    // 绘制引文
    if (config.quote && quoteLines.length > 0) {
      ctx.fillStyle = STYLES.quoteColor
      ctx.font = `italic ${STYLES.quoteSize}px ${STYLES.fontFamily}`
      ctx.textAlign = 'center'
      
      for (const line of quoteLines) {
        ctx.fillText(line, centerX, currentY)
        currentY += STYLES.quoteSize * STYLES.quoteLineHeight
      }
      currentY += STYLES.quoteMarginBottom
      
      // 出处（右对齐）
      if (config.quoteCitation) {
        ctx.textAlign = 'right'
        const rightX = STYLES.bgPadding + cardWidth - STYLES.cardPaddingX
        ctx.fillText(`——${config.quoteCitation}`, rightX, currentY)
        currentY += STYLES.quoteSize * STYLES.quoteLineHeight
      }
      currentY += STYLES.citationMarginBottom
    }
    
    // 绘制正文
    ctx.fillStyle = STYLES.contentColor
    ctx.font = `600 ${STYLES.contentSize}px ${STYLES.fontFamily}`
    ctx.textAlign = 'center'
    
    for (const line of contentLines) {
      if (line === '') {
        // 空行，添加额外间距
        currentY += STYLES.contentSize * 0.5
      } else {
        ctx.fillText(line, centerX, currentY)
        currentY += STYLES.contentSize * STYLES.contentLineHeight
      }
    }
    currentY += STYLES.contentMarginBottom
    
    // 绘制作者
    if (config.author) {
      currentY += STYLES.authorMarginTop
      
      // 分隔线（整个内容区域宽度，与页面border-t一致）
      ctx.strokeStyle = STYLES.separatorColor
      ctx.lineWidth = 1
      ctx.beginPath()
      const lineStartX = STYLES.bgPadding + STYLES.cardPaddingX
      const lineEndX = STYLES.bgPadding + cardWidth - STYLES.cardPaddingX
      ctx.moveTo(lineStartX, currentY)
      ctx.lineTo(lineEndX, currentY)
      ctx.stroke()
      
      currentY += 24
      
      // 作者文字
      ctx.fillStyle = STYLES.authorColor
      ctx.font = `600 ${STYLES.authorSize}px ${STYLES.fontFamily}`
      ctx.textAlign = 'center'
      ctx.fillText(`作者: ${config.author}`, centerX, currentY)
      currentY += STYLES.authorSize * 1.5
    }
    
    // 绘制水印
    if (config.createdAt || config.watermarkPrefix) {
      currentY += STYLES.watermarkMarginTop
      
      // 如果有 watermarkPrefix，使用 "前缀 © 陆家花园" 格式；否则用时间戳格式
      const watermarkText = config.watermarkPrefix 
        ? `${config.watermarkPrefix} © 陆家花园`
        : `${config.createdAt}于©陆家花园`
      
      ctx.fillStyle = STYLES.watermarkColor
      ctx.font = `${STYLES.watermarkSize}px ${STYLES.fontFamily}`
      ctx.textAlign = 'center'
      ctx.fillText(watermarkText, centerX, currentY)
    }
    
    // 导出为Blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png', 1.0)
    })
  }
  
  // ============================================
  // 摸诗宇宙 - 生成诗歌卡片
  // 单诗节：无标题，右下角"诗名 · 一"
  // 多诗节：有标题，诗节间分割线
  // ============================================
  public static async createMoshiCard(config: MoshiImageConfig): Promise<Blob | null> {
    await document.fonts.ready
    
    const scale = STYLES.scale
    const baseWidth = STYLES.baseWidth
    const isSingleStanza = config.stanzas.length === 1
    
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return null
    
    const cardWidth = baseWidth - STYLES.bgPadding * 2
    const contentWidth = cardWidth - STYLES.cardPaddingX * 2
    
    // 计算自适应字号：根据最长行宽度缩小字体，避免自动换行
    const BASE_CONTENT_SIZE = 28  // 基准字号
    const MIN_CONTENT_SIZE = 18   // 最小字号
    const contents = config.stanzas.map(s => s.content)
    const fontResult = FontSizeCalculator.calcAdaptiveFontSizeMultiple(
      contents,
      contentWidth,
      {
        baseFontSize: BASE_CONTENT_SIZE,
        minFontSize: MIN_CONTENT_SIZE,
        fontFamily: STYLES.fontFamily,
        fontWeight: 'normal'
      }
    )
    const moshiContentSize = fontResult.fontSize
    
    // 计算各部分高度
    let totalContentHeight = STYLES.cardPaddingTop
    
    // 标题高度（单诗节带节号，多诗节纯标题）
    let titleLines: string[] = []
    tempCtx.font = `bold ${STYLES.titleSize}px ${STYLES.fontFamily}`
    if (isSingleStanza) {
      const stanzaIndex = config.stanzas[0].index
      const chineseNum = CHINESE_NUMBERS[stanzaIndex] || stanzaIndex.toString()
      const titleWithIndex = `${config.title} · ${chineseNum}`
      titleLines = this.wrapText(tempCtx, titleWithIndex, contentWidth)
    } else {
      titleLines = this.wrapText(tempCtx, config.title, contentWidth)
    }
    totalContentHeight += titleLines.length * STYLES.titleSize * STYLES.titleLineHeight
    // 多诗节时增大标题与正文间距
    const titleMargin = isSingleStanza ? STYLES.titleMarginBottom : STYLES.titleMarginBottom + 16
    totalContentHeight += titleMargin
    
    // 诗节高度（正文不加粗）
    tempCtx.font = `${moshiContentSize}px ${STYLES.fontFamily}`
    const stanzaLinesArray: string[][] = []
    for (let i = 0; i < config.stanzas.length; i++) {
      const stanza = config.stanzas[i]
      const lines = this.wrapTextMultiParagraph(tempCtx, stanza.content, contentWidth)
      stanzaLinesArray.push(lines)
      
      totalContentHeight += lines.length * moshiContentSize * STYLES.contentLineHeight
      
      // 分割线（最后一节后不加，仅多诗节）
      if (!isSingleStanza && i < config.stanzas.length - 1) {
        totalContentHeight += 32 + 1 + 32
      }
    }
    totalContentHeight += STYLES.contentMarginBottom
    
    // 水印高度（固定显示）
    totalContentHeight += STYLES.watermarkMarginTop
    totalContentHeight += STYLES.watermarkSize * 1.5
    
    totalContentHeight += STYLES.cardPaddingBottom
    
    // 画布尺寸
    const cardHeight = totalContentHeight
    const canvasWidth = baseWidth
    const canvasHeight = cardHeight + STYLES.bgPadding * 2
    
    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth * scale
    canvas.height = canvasHeight * scale
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    ctx.scale(scale, scale)
    
    // 灰色背景
    ctx.fillStyle = STYLES.bgColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // 卡片阴影
    ctx.save()
    ctx.shadowColor = STYLES.cardShadowColor
    ctx.shadowBlur = STYLES.cardShadowBlur
    ctx.shadowOffsetY = STYLES.cardShadowOffsetY
    
    // 卡片背景
    const cardX = STYLES.bgPadding
    const cardY = STYLES.bgPadding
    const gradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardHeight)
    gradient.addColorStop(0, STYLES.cardBgStart)
    gradient.addColorStop(1, STYLES.cardBgEnd)
    
    ctx.fillStyle = gradient
    this.roundRect(ctx, cardX, cardY, cardWidth, cardHeight, STYLES.cardRadius)
    ctx.fill()
    ctx.restore()
    
    // 绘制内容
    let currentY = STYLES.bgPadding + STYLES.cardPaddingTop
    const centerX = canvasWidth / 2
    
    // 标题（单诗节带节号，多诗节纯标题）
    ctx.fillStyle = STYLES.titleColor
    ctx.font = `bold ${STYLES.titleSize}px ${STYLES.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    for (const line of titleLines) {
      ctx.fillText(line, centerX, currentY)
      currentY += STYLES.titleSize * STYLES.titleLineHeight
    }
    // 多诗节时增大标题与正文间距
    currentY += isSingleStanza ? STYLES.titleMarginBottom : STYLES.titleMarginBottom + 16
    
    // 诗节（不加粗）
    ctx.fillStyle = STYLES.contentColor
    ctx.font = `${moshiContentSize}px ${STYLES.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    for (let i = 0; i < stanzaLinesArray.length; i++) {
      const lines = stanzaLinesArray[i]
      
      for (const line of lines) {
        if (line === '') {
          currentY += moshiContentSize * 0.5
        } else {
          ctx.fillText(line, centerX, currentY)
          currentY += moshiContentSize * STYLES.contentLineHeight
        }
      }
      
      // 分割线（仅多诗节，最后一节后不加）
      if (!isSingleStanza && i < stanzaLinesArray.length - 1) {
        currentY += 32
        
        ctx.strokeStyle = STYLES.separatorColor
        ctx.lineWidth = 1
        ctx.beginPath()
        const lineStartX = STYLES.bgPadding + STYLES.cardPaddingX + 60
        const lineEndX = STYLES.bgPadding + cardWidth - STYLES.cardPaddingX - 60
        ctx.moveTo(lineStartX, currentY)
        ctx.lineTo(lineEndX, currentY)
        ctx.stroke()
        
        currentY += 1 + 32
      }
    }
    currentY += STYLES.contentMarginBottom
    
    // 水印（固定：西尔 © 陆家花园）
    currentY += STYLES.watermarkMarginTop
    const watermarkText = '西尔 © 陆家花园'
    
    ctx.fillStyle = STYLES.watermarkColor
    ctx.font = `${STYLES.watermarkSize}px ${STYLES.fontFamily}`
    ctx.textAlign = 'center'
    ctx.fillText(watermarkText, centerX, currentY)
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png', 1.0)
    })
  }
  
  // ============================================
  // 共享工具方法
  // ============================================
  
  /**
   * 绘制圆角矩形
   */
  private static roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }
  
  /**
   * 文本换行（单段落）
   */
  private static wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    if (!text) return []
    
    const chars = text.split('')
    const lines: string[] = []
    let currentLine = ''
    
    for (const char of chars) {
      const testLine = currentLine + char
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = char
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }
  
  /**
   * 文本换行（多段落，处理换行符）
   */
  private static wrapTextMultiParagraph(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    if (!text) return []
    
    // 按换行符分割段落
    const paragraphs = text.split(/\r?\n/)
    const allLines: string[] = []
    
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        allLines.push('') // 保留空行
      } else {
        const lines = this.wrapText(ctx, paragraph, maxWidth)
        allLines.push(...lines)
      }
    }
    
    return allLines
  }
}
