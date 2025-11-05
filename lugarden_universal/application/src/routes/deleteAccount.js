/**
 * 删除账号路由
 * DELETE /api/user/delete
 */

import express from 'express';
import { deleteUserAccount, verifyUsernameMatch } from '../services/deleteAccountService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * 删除用户账号
 * 需要JWT认证 + 用户名二次确认
 */
router.delete('/user/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username } = req.body;

    // 验证是否提供了用户名
    if (!username) {
      return res.status(400).json({
        success: false,
        message: '请输入用户名以确认删除'
      });
    }

    // 验证用户名是否匹配
    const isMatch = await verifyUsernameMatch(userId, username);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '用户名不匹配，请重新输入'
      });
    }

    // 删除账号
    const result = await deleteUserAccount(userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('删除账号API错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '删除账号失败'
    });
  }
});

export default router;

