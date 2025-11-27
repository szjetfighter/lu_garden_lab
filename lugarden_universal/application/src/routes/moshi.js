/**
 * 摸诗API路由
 * 
 * 端点：
 * - POST /api/moshi/spin - 执行一次摸诗（老虎机转动）
 * - GET /api/moshi/symbols - 获取符号配置
 */

import { Router } from 'express';
import { moshiService } from '../services/moshiService.js';

const router = Router();

/**
 * POST /api/moshi/spin
 * 执行一次摸诗
 * 
 * 响应：
 * {
 *   matrix: [[{id, name, emoji, type}, ...], ...],  // 5x3符号矩阵
 *   win: boolean,                                    // 是否中奖
 *   winDetails: [{symbolId, symbol, columns}, ...], // 中奖详情
 *   stanza: { id, content, poemId } | null,         // 中奖stanza
 *   stanzaSource: 'intersection' | 'fallback' | null
 * }
 */
router.post('/spin', async (req, res, next) => {
  try {
    const result = await moshiService.spin();
    return res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('[Moshi API] spin error:', error);
    return next(error);
  }
});

/**
 * GET /api/moshi/symbols
 * 获取符号配置（供前端渲染使用）
 */
router.get('/symbols', (req, res) => {
  const symbols = moshiService.getSymbols();
  return res.json({
    status: 'success',
    symbols
  });
});

/**
 * GET /api/moshi/poem/:poemId
 * 获取完整诗歌（包含所有诗节）
 */
router.get('/poem/:poemId', async (req, res, next) => {
  try {
    const { poemId } = req.params;
    const poem = await moshiService.getPoem(poemId);
    
    if (!poem) {
      return res.status(404).json({
        status: 'error',
        message: '诗歌不存在'
      });
    }
    
    return res.json({
      status: 'success',
      poem
    });
  } catch (error) {
    console.error('[Moshi API] getPoem error:', error);
    return next(error);
  }
});

export default router;
