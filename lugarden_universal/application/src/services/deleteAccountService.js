/**
 * 删除账号服务
 * 处理用户账号删除和数据匿名化
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 删除用户账号
 * @param {number} userId - 用户ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteUserAccount(userId) {
  try {
    // 使用事务确保数据一致性
    await prisma.$transaction(async (tx) => {
      // 1. 匿名化用户的作品：将userId设为null
      await tx.userPoem.updateMany({
        where: { userId: userId },
        data: { userId: null }
      });

      // 2. 删除用户记录
      await tx.user.delete({
        where: { id: userId }
      });
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
 * 验证用户名匹配（用于二次确认）
 * @param {number} userId - 用户ID
 * @param {string} username - 用户输入的用户名
 * @returns {Promise<boolean>}
 */
export async function verifyUsernameMatch(userId, username) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });

    return user && user.username === username;
  } catch (error) {
    console.error('验证用户名失败:', error);
    return false;
  }
}

