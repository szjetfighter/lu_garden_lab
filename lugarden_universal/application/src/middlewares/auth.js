import { verifyToken } from '../utils/jwt.js';

/**
 * 认证中间件 - 保护需要登录的API端点
 * @param {Request} req - Express请求对象
 * @param {Response} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
export function requireAuth(req, res, next) {
  // 从请求头获取token
  const authHeader = req.headers.authorization;
  
  // 检查Authorization头是否存在
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未提供认证令牌'
    });
  }
  
  // 提取token（去除"Bearer "前缀）
  const token = authHeader.substring(7);
  
  // 验证token
  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: '认证令牌无效或已过期'
    });
  }
  
  // 将userId挂载到req对象，供后续路由使用
  req.userId = payload.userId;
  
  // 继续执行下一个中间件或路由处理器
  next();
}


