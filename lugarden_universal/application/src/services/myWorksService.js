import { PrismaClient as AuthPrisma } from '../../generated/auth-prisma/index.js';
import { PrismaClient as LugardenPrisma } from '../../generated/prisma/index.js';

const authDb = new AuthPrisma();
const lugardenDb = new LugardenPrisma();

/**
 * 保存共笔作品
 * @param {Object} data - 完整的共笔作品数据
 * @returns {Promise<Object>} - {success, work?, error?}
 */
export async function saveGongBiWork(data) {
  try {
    const {
      userId,
      sourcePoemId,
      mappingId,
      userInput,
      poemTitle,
      poemContent,
      poemQuote,
      poemQuoteSource,
      conversationId,
      messageId,
      usageMetadata
    } = data;
    
    // 验证必填字段
    if (!userId || !sourcePoemId || !mappingId || !userInput || 
        !poemTitle || !poemContent || !conversationId || !messageId) {
      return {
        success: false,
        error: '缺少必填字段'
      };
    }
    
    // 从lugarden.db查询原诗信息（用于冗余字段）
    const sourcePoem = await lugardenDb.zhouPoem.findUnique({
      where: { id: sourcePoemId }
    });
    
    if (!sourcePoem) {
      return {
        success: false,
        error: '原诗不存在'
      };
    }
    
    // 从lugarden.db查询mapping信息（用于冗余字段）
    const mapping = await lugardenDb.zhouMapping.findUnique({
      where: { id: mappingId }
    });
    
    if (!mapping) {
      return {
        success: false,
        error: '映射关系不存在'
      };
    }
    
    // 保存到auth.db，包含冗余字段
    const work = await authDb.userGongBiWork.create({
      data: {
        userId,
        sourcePoemId,
        mappingId,
        // 冗余字段（来自ZhouPoem）
        sourcePoemTitle: sourcePoem.title,
        sourcePoemChapter: sourcePoem.chapter,
        // 冗余字段（来自ZhouMapping）
        mappingChapter: mapping.chapter,
        mappingCombination: mapping.combination,
        mappingMeaning: mapping.meaning,
        // 用户输入和生成内容
        userInput,
        poemTitle,
        poemContent,
        poemQuote: poemQuote || null,
        poemQuoteSource: poemQuoteSource || null,
        // Dify追溯
        conversationId,
        messageId,
        usageMetadata: JSON.stringify(usageMetadata)
      }
    });
    
    return {
      success: true,
      work: {
        id: work.id,
        sourcePoemTitle: work.sourcePoemTitle,
        sourcePoemChapter: work.sourcePoemChapter,
        mappingMeaning: work.mappingMeaning,
        userInput: work.userInput,
        poemTitle: work.poemTitle,
        poemContent: work.poemContent,
        poemQuote: work.poemQuote,
        poemQuoteSource: work.poemQuoteSource,
        createdAt: work.createdAt
      }
    };
  } catch (error) {
    console.error('保存共笔作品失败:', error);
    return {
      success: false,
      error: '保存失败，请稍后重试'
    };
  }
}

/**
 * 查询用户的所有作品
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - {success, works?, error?}
 */
export async function getUserWorks(userId) {
  try {
    const works = await authDb.userGongBiWork.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    // 格式化返回数据（移除内部字段）
    const formattedWorks = works.map(work => ({
      id: work.id,
      sourcePoemTitle: work.sourcePoemTitle,
      sourcePoemChapter: work.sourcePoemChapter,
      mappingCombination: work.mappingCombination,
      mappingMeaning: work.mappingMeaning,
      userInput: work.userInput,
      poemTitle: work.poemTitle,
      poemContent: work.poemContent,
      poemQuote: work.poemQuote,
      poemQuoteSource: work.poemQuoteSource,
      createdAt: work.createdAt
    }));
    
    return {
      success: true,
      works: formattedWorks
    };
  } catch (error) {
    console.error('查询作品失败:', error);
    return {
      success: false,
      error: '查询失败，请稍后重试'
    };
  }
}

