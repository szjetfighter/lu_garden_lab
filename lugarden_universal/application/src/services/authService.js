import { PrismaClient as AuthPrisma } from '../../generated/auth-prisma/index.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

const authDb = new AuthPrisma();

/**
 * 用户注册
 * @param {Object} data - {username, password}
 * @returns {Promise<Object>} - {success, user?, error?}
 */
export async function registerUser({ username, password }) {
  try {
    // 检查用户名是否已存在
    const existingUser = await authDb.user.findUnique({
      where: { username }
    });
    
    if (existingUser) {
      return {
        success: false,
        error: '用户名已被使用'
      };
    }
    
    // 密码加密
    const hashedPassword = await hashPassword(password);
    
    // 创建用户
    const user = await authDb.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
    
    // 返回用户信息（不含密码）
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    console.error('注册失败:', error);
    return {
      success: false,
      error: '注册失败，请稍后重试'
    };
  }
}

/**
 * 用户登录
 * @param {Object} data - {username, password}
 * @returns {Promise<Object>} - {success, token?, user?, error?}
 */
export async function loginUser({ username, password }) {
  try {
    // 查找用户
    const user = await authDb.user.findUnique({
      where: { username }
    });
    
    // 用户不存在或密码错误（统一返回信息，不泄露用户存在性）
    if (!user) {
      return {
        success: false,
        error: '用户名或密码错误'
      };
    }
    
    // 检查账号是否已删除（在验证密码前检查，避免泄露账号存在性）
    if (user.deletedAt) {
      return {
        success: false,
        error: '用户名或密码错误'
      };
    }
    
    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        error: '用户名或密码错误'
      };
    }
    
    // 生成JWT
    const token = generateToken({
      userId: user.id,
      username: user.username
    });
    
    // 返回token和用户信息
    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    console.error('登录失败:', error);
    return {
      success: false,
      error: '登录失败，请稍后重试'
    };
  }
}

/**
 * 删除账户
 * @param {Object} data - {userId, password}
 * @returns {Promise<Object>} - {success, message?, error?}
 */
export async function deleteAccount({ userId, password }) {
  try {
    // 查找用户
    const user = await authDb.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return {
        success: false,
        error: '用户不存在'
      };
    }
    
    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        error: '密码错误'
      };
    }
    
    // 删除用户（Cascade自动删除所有作品）
    await authDb.user.delete({
      where: { id: userId }
    });
    
    return {
      success: true,
      message: '账户已成功删除'
    };
  } catch (error) {
    console.error('删除账户失败:', error);
    return {
      success: false,
      error: '删除账户失败，请稍后重试'
    };
  }
}

