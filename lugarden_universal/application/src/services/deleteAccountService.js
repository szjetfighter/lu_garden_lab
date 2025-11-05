/**
 * 删除账号服务
 * 处理用户账号删除和数据匿名化
 */

import { PrismaClient as AuthPrisma } from '../../generated/auth-prisma/index.js';
import { comparePassword } from '../utils/password.js';

const authDb = new AuthPrisma();

/**
 * 删除用户账号（软删除）
 * 标记账号为已删除，用户无法登录，但作品保留
 * @param {string} userId - 用户ID (UUID)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteUserAccount(userId) {
  try {
    // 软删除：设置deletedAt时间戳
    await authDb.user.update({
      where: { id: userId },
      data: { 
        deletedAt: new Date() 
      }
    });

    return {
      success: true,
      message: '账号已成功删除'
    };
  } catch (error) {
    console.error('删除账号失败:', error);
    throw new Error('删除账号失败，请稍后重试');
  }
}

/**
 * 验证密码（用于删除前身份确认）
 * @param {string} userId - 用户ID (UUID)
 * @param {string} password - 用户输入的密码
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(userId, password) {
  try {
    const user = await authDb.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      return false;
    }

    return await comparePassword(password, user.password);
  } catch (error) {
    console.error('验证密码失败:', error);
    return false;
  }
}

/**
 * 验证用户名匹配（用于二次确认）
 * @param {string} userId - 用户ID (UUID)
 * @param {string} username - 用户输入的用户名
 * @returns {Promise<boolean>}
 */
export async function verifyUsernameMatch(userId, username) {
  try {
    const user = await authDb.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });

    return user && user.username === username;
  } catch (error) {
    console.error('验证用户名失败:', error);
    return false;
  }
}

