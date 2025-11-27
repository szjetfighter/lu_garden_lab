/**
 * 诗歌图片生成器
 * 使用 Canvas 2D API 原生绘制诗歌卡片
 * 
 * 共享服务：可被所有宇宙模块使用
 */

export interface PoemImageConfig {
  title: string
  quote?: string | null
  quoteCitation?: string | null
  content: string
  author?: string | null
  createdAt?: string | null // 创建时间，用于水印
  source?: string | null    // 出处（如"诗名 · 一"）
}

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
  
  /**
   * 生成诗歌卡片图片
   */
  public static async createCard(config: PoemImageConfig): Promise<Blob | null> {
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
    
    // 出处高度（如"诗名 · 一"）
    if (config.source) {
      totalContentHeight += STYLES.sourceMarginTop
      totalContentHeight += STYLES.sourceSize * 1.5
    }
    
    // 作者高度
    if (config.author) {
      totalContentHeight += STYLES.authorMarginTop
      totalContentHeight += 1 // 分隔线
      totalContentHeight += 24 // 分隔线到文字间距
      totalContentHeight += STYLES.authorSize * 1.5
    }
    
    // 水印高度
    if (config.createdAt) {
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
    
    // 绘制出处（如"诗名 · 一"）
    if (config.source) {
      currentY += STYLES.sourceMarginTop
      ctx.fillStyle = STYLES.sourceColor
      ctx.font = `${STYLES.sourceSize}px ${STYLES.fontFamily}`
      ctx.textAlign = 'right'
      const rightX = STYLES.bgPadding + cardWidth - STYLES.cardPaddingX
      ctx.fillText(config.source, rightX, currentY)
      currentY += STYLES.sourceSize * 1.5
    }
    
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
    if (config.createdAt) {
      currentY += STYLES.watermarkMarginTop
      
      // 格式化时间：2025-11-25 12:09于©陆家花园
      const watermarkText = `${config.createdAt}于©陆家花园`
      
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
