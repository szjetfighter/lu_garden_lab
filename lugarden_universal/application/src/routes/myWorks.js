import express from 'express';
import { saveGongBiWork, getUserWorks } from '../services/myWorksService.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * POST /api/my-works/save - 保存共笔作品
 * Headers: Authorization: Bearer <token>
 * Body: { sourcePoemId, mappingId, userInput, 
 *         poemTitle, poemContent,
 *         poemQuote?, poemQuoteSource?, conversationId, messageId, usageMetadata }
 */
router.post('/save', requireAuth, async (req, res) => {
  const userId = req.userId; // 从requireAuth中间件获取
  const {
    sourcePoemId,
    mappingId,
    userInput,
    poemTitle,
    poemContent,
    poemQuote,
    poemQuoteSource,
    conversationId,
    messageId,
    usageMetadata
  } = req.body;
  
  // 验证必填字段
  if (!sourcePoemId || !mappingId || !userInput || 
      !poemTitle || !poemContent || !conversationId || !messageId) {
    return res.status(400).json({
      success: false,
      error: '缺少必填字段'
    });
  }
  
  // 调用服务层保存
  const result = await saveGongBiWork({
    userId,
    sourcePoemId,
    mappingId,
    userInput,
    poemTitle,
    poemContent,
    poemQuote,
    poemQuoteSource,
    conversationId,
    messageId,
    usageMetadata
  });
  
  if (result.success) {
    return res.status(201).json(result);
  } else {
    return res.status(400).json(result);
  }
});

/**
 * GET /api/my-works - 查询我的作品
 * Headers: Authorization: Bearer <token>
 */
router.get('/', requireAuth, async (req, res) => {
  const userId = req.userId; // 从requireAuth中间件获取
  
  // 调用服务层查询
  const result = await getUserWorks(userId);
  
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
});

export default router;

