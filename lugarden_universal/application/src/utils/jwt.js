import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const TOKEN_EXPIRY = '7d'; // 7天有效期

/**
 * 生成JWT token
 * @param {Object} payload - token载荷（如{userId, username}）
 * @returns {string} - JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * 验证并解析JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} - 解析后的payload，失败返回null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // token无效、过期等情况
    return null;
  }
}


