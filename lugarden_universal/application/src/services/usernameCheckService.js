/**
 * 用户名校验服务
 * 提供用户名格式校验和唯一性检查功能
 */

import { PrismaClient as AuthPrisma } from '../../generated/auth-prisma/index.js'

const authDb = new AuthPrisma()

/**
 * 校验用户名格式
 * @param {string} username - 待校验的用户名
 * @returns {{ valid: boolean, message: string }}
 */
export function validateUsernameFormat(username) {
  // 检查长度：3-20个字符
  if (!username || username.length < 3 || username.length > 20) {
    return {
      valid: false,
      message: '用户名必须是3-20个字符'
    }
  }

  // 检查字符：支持中英文、数字、下划线
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message: '用户名只能包含中英文、数字和下划线'
    }
  }

  return {
    valid: true,
    message: '用户名格式正确'
  }
}

/**
 * 检查用户名是否已被使用（包含软删除用户）
 * @param {string} username - 待检查的用户名
 * @returns {Promise<boolean>} - true表示已被使用，false表示可用
 */
export async function isUsernameTaken(username) {
  try {
    const user = await authDb.user.findUnique({
      where: { username },
      select: { id: true }
    })
    return !!user // 如果找到用户（无论是否删除），返回true
  } catch (error) {
    console.error('[usernameCheckService] 查询用户名失败:', error)
    throw new Error('检查用户名时发生错误')
  }
}

/**
 * 完整的用户名可用性检查
 * @param {string} username - 待检查的用户名
 * @returns {Promise<{ available: boolean, reason: string|null, message: string }>}
 */
export async function checkUsernameAvailability(username) {
  // 1. 格式校验
  const formatCheck = validateUsernameFormat(username)
  if (!formatCheck.valid) {
    return {
      available: false,
      reason: 'invalid_format',
      message: formatCheck.message
    }
  }

  // 2. 唯一性校验
  const isTaken = await isUsernameTaken(username)
  if (isTaken) {
    return {
      available: false,
      reason: 'username_taken',
      message: '用户名不可使用' // 不区分活跃用户和已删除用户
    }
  }

  // 3. 全部通过
  return {
    available: true,
    reason: null,
    message: '用户名可用'
  }
}

