/**
 * 数据库初始化模块
 * 在应用启动时设置SQLite WAL模式
 */

import { PrismaClient as LugardenPrisma } from '../../generated/prisma/index.js';
import { PrismaClient as AuthPrisma } from '../../generated/auth-prisma/index.js';

export async function initDatabases() {
  const lugarden = new LugardenPrisma();
  const auth = new AuthPrisma();

  try {
    // 设置WAL模式
    const [lugardenMode] = await lugarden.$queryRawUnsafe('PRAGMA journal_mode=WAL;');
    const [authMode] = await auth.$queryRawUnsafe('PRAGMA journal_mode=WAL;');

    console.log(`[DB] lugarden.db journal_mode: ${lugardenMode?.journal_mode || lugardenMode}`);
    console.log(`[DB] auth.db journal_mode: ${authMode?.journal_mode || authMode}`);
  } catch (err) {
    console.error('[DB] WAL初始化失败:', err.message);
  } finally {
    await lugarden.$disconnect();
    await auth.$disconnect();
  }
}
