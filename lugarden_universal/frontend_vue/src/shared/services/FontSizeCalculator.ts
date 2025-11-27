/**
 * 诗歌字号自适应计算器
 * 
 * 解决问题：现代诗以换行分行，但单行过长会自动换行，导致读者混淆
 * 解决方案：根据最长行宽度自适应缩小字体，确保每行不自动换行
 * 
 * 共享服务：可被所有宇宙模块和PoemImageGenerator使用
 */

export interface FontSizeOptions {
  baseFontSize: number      // 基准字号（px）
  minFontSize: number       // 最小字号（px），避免字体过小
  fontFamily: string        // 字体族
  fontWeight?: string       // 字重，默认 'normal'
}

export interface AdaptiveFontResult {
  fontSize: number          // 计算后的字号（px）
  scale: number             // 缩放比例（1 = 未缩放）
  isScaled: boolean         // 是否进行了缩放
  maxLineWidth: number      // 最长行宽度（px）
}

export class FontSizeCalculator {
  // 复用的canvas元素，避免重复创建
  private static canvas: HTMLCanvasElement | null = null

  /**
   * 获取canvas context用于测量文本
   */
  private static getContext(): CanvasRenderingContext2D {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
    }
    return this.canvas.getContext('2d')!
  }

  /**
   * 测量单行文本宽度
   * @param text 文本内容
   * @param fontSize 字号（px）
   * @param fontFamily 字体族
   * @param fontWeight 字重
   */
  static measureTextWidth(
    text: string,
    fontSize: number,
    fontFamily: string,
    fontWeight: string = 'normal'
  ): number {
    const ctx = this.getContext()
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    return ctx.measureText(text).width
  }

  /**
   * 计算自适应字号
   * @param content 诗歌内容（包含换行符）
   * @param containerWidth 容器宽度（px）
   * @param options 字号配置
   */
  static calcAdaptiveFontSize(
    content: string,
    containerWidth: number,
    options: FontSizeOptions
  ): AdaptiveFontResult {
    const { baseFontSize, minFontSize, fontFamily, fontWeight = 'normal' } = options

    // 按换行符分割成行
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '')
    
    if (lines.length === 0) {
      return {
        fontSize: baseFontSize,
        scale: 1,
        isScaled: false,
        maxLineWidth: 0
      }
    }

    // 测量每行宽度，找出最长行
    const lineWidths = lines.map(line => 
      this.measureTextWidth(line, baseFontSize, fontFamily, fontWeight)
    )
    const maxLineWidth = Math.max(...lineWidths)

    // 如果最长行不超过容器宽度，无需缩放
    if (maxLineWidth <= containerWidth) {
      return {
        fontSize: baseFontSize,
        scale: 1,
        isScaled: false,
        maxLineWidth
      }
    }

    // 计算缩放比例
    const scale = containerWidth / maxLineWidth
    const scaledFontSize = baseFontSize * scale

    // 应用最小字号限制
    const finalFontSize = Math.max(scaledFontSize, minFontSize)
    const finalScale = finalFontSize / baseFontSize

    return {
      fontSize: finalFontSize,
      scale: finalScale,
      isScaled: true,
      maxLineWidth
    }
  }

  /**
   * 计算多段内容的自适应字号（取所有段落中最长行）
   * @param contents 多段内容数组
   * @param containerWidth 容器宽度（px）
   * @param options 字号配置
   */
  static calcAdaptiveFontSizeMultiple(
    contents: string[],
    containerWidth: number,
    options: FontSizeOptions
  ): AdaptiveFontResult {
    const { baseFontSize, minFontSize, fontFamily, fontWeight = 'normal' } = options

    // 收集所有行
    const allLines: string[] = []
    for (const content of contents) {
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== '')
      allLines.push(...lines)
    }

    if (allLines.length === 0) {
      return {
        fontSize: baseFontSize,
        scale: 1,
        isScaled: false,
        maxLineWidth: 0
      }
    }

    // 测量每行宽度，找出最长行
    const lineWidths = allLines.map(line => 
      this.measureTextWidth(line, baseFontSize, fontFamily, fontWeight)
    )
    const maxLineWidth = Math.max(...lineWidths)

    // 如果最长行不超过容器宽度，无需缩放
    if (maxLineWidth <= containerWidth) {
      return {
        fontSize: baseFontSize,
        scale: 1,
        isScaled: false,
        maxLineWidth
      }
    }

    // 计算缩放比例
    const scale = containerWidth / maxLineWidth
    const scaledFontSize = baseFontSize * scale

    // 应用最小字号限制
    const finalFontSize = Math.max(scaledFontSize, minFontSize)
    const finalScale = finalFontSize / baseFontSize

    return {
      fontSize: finalFontSize,
      scale: finalScale,
      isScaled: true,
      maxLineWidth
    }
  }
}
