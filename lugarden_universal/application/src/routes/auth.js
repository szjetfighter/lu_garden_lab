import express from 'express';
import { registerUser, loginUser, deleteAccount } from '../services/authService.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register - 用户注册
 * Body: { username, password, confirmPassword }
 */
router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  // 验证必填字段
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      error: '请填写所有必填字段'
    });
  }
  
  // 验证用户名长度（3-20字符）
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({
      success: false,
      error: '用户名必须为3-20个字符'
    });
  }
  
  // 验证密码长度（至少6字符）
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: '密码至少6个字符'
    });
  }
  
  // 验证密码一致性
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      error: '两次输入的密码不一致'
    });
  }
  
  // 调用服务层注册用户
  const result = await registerUser({ username, password });
  
  if (result.success) {
    return res.status(201).json(result);
  } else {
    return res.status(400).json(result);
  }
});

/**
 * POST /api/auth/login - 用户登录
 * Body: { username, password }
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 验证必填字段
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: '请填写用户名和密码'
    });
  }
  
  // 调用服务层登录
  const result = await loginUser({ username, password });
  
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
});

/**
 * DELETE /api/auth/delete-account - 删除账户
 * Headers: Authorization: Bearer <token>
 * Body: { password }
 */
router.delete('/delete-account', requireAuth, async (req, res) => {
  const { password } = req.body;
  const userId = req.userId; // 从requireAuth中间件获取
  
  // 验证必填字段
  if (!password) {
    return res.status(400).json({
      success: false,
      error: '请输入密码以确认删除'
    });
  }
  
  // 调用服务层删除账户
  const result = await deleteAccount({ userId, password });
  
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
});

export default router;

