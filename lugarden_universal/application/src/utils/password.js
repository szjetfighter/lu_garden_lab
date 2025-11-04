import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * 加密密码
 * @param {string} plainPassword - 明文密码
 * @returns {Promise<string>} - bcrypt hash
 */
export async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * 验证密码
 * @param {string} plainPassword - 明文密码
 * @param {string} hashedPassword - bcrypt hash
 * @returns {Promise<boolean>} - 密码是否匹配
 */
export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

