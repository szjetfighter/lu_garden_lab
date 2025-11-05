/**
 * 删除账号路由
 * DELETE /api/user/delete
 */

import express from 'express';
import { deleteUserAccount, verifyUsernameMatch } from '../services/deleteAccountService.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * 删除用户账号
 * 需要JWT认证 + 用户名二次确认
 */
router.delete('/user/delete', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { password, username } = req.body;

    // 验证是否提供了密码和用户名
    if (!password || !username) {
      return res.status(400).json({
        success: false,
        message: '请提供密码和用户名以确认删除'
      });
    }

    // 先验证密码
    const { verifyPassword } = await import('../services/deleteAccountService.js');
    const isPasswordValid = await verifyPassword(userId, password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '密码错误'
      });
    }

    // 再验证用户名是否匹配
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

