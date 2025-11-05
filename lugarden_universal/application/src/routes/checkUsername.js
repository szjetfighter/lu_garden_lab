/**
 * 用户名检查路由
 * 提供用户名可用性检查API
 */

import express from 'express'
import { checkUsernameAvailability } from '../services/usernameCheckService.js'

const router = express.Router()

// 简单的IP限流Map（生产环境应使用Redis）
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 60秒
const RATE_LIMIT_MAX = 10 // 最多10次请求

/**
 * 简单限流中间件
 */
function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress
  const now = Date.now()
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }
  
  const requests = rateLimitMap.get(ip)
  
  // 清理过期的请求记录
  const validRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW)
  
  if (validRequests.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      message: '请求过于频繁，请稍后再试'
    })
  }
  
  validRequests.push(now)
  rateLimitMap.set(ip, validRequests)
  
  next()
}

/**
 * GET /api/auth/check-username
 * 检查用户名是否可用
 */
router.get('/check-username', rateLimiter, async (req, res) => {
  try {
    const { username } = req.query
    
    // 参数校验
    if (!username) {
      return res.status(400).json({
        available: false,
        reason: 'missing_parameter',
        message: '请提供用户名'
      })
    }
    
    // 执行检查
    const result = await checkUsernameAvailability(username)
    
    // 返回结果
    res.json(result)
  } catch (error) {
    console.error('[checkUsername] 检查用户名失败:', error)
    res.status(500).json({
      available: false,
      reason: 'server_error',
      message: '服务器错误，请稍后再试'
    })
  }
})

export default router

