import { getPrismaClient } from '../persistence/prismaClient.js';

export class ShuiService {
    /**
     * 获取所有水宇宙故事集（按时间排序）
     * @returns {Promise<Array>} 故事集列表
     */
    async getAllCollections() {
        try {
            const prisma = getPrismaClient();
            const collections = await prisma.shuiCollection.findMany({
                orderBy: { dateStart: 'asc' }
            });
            return collections;
        } catch (error) {
            console.error('[ShuiService] 获取故事集失败:', error);
            throw error;
        }
    }

    /**
     * 获取单个故事集及其所有诗歌
     * @param {string} collectionId 故事集ID
     * @returns {Promise<Object>} 故事集详情及诗歌列表
     */
    async getCollectionWithPoems(collectionId) {
        try {
            const prisma = getPrismaClient();
            const collection = await prisma.shuiCollection.findUnique({
                where: { id: collectionId },
                include: {
                    poems: { orderBy: { index: 'asc' } }
                }
            });
            if (!collection) {
                const error = new Error(`故事集 ${collectionId} 不存在`);
                error.statusCode = 404;
                throw error;
            }
            return collection;
        } catch (error) {
            console.error('[ShuiService] 获取故事集详情失败:', error);
            throw error;
        }
    }

    /**
     * 获取所有故事集及诗歌摘要（海图用）
     * @returns {Promise<Array>} 故事集列表（含诗歌摘要）
     */
    async getAllCollectionsWithPoems() {
        try {
            const prisma = getPrismaClient();
            const collections = await prisma.shuiCollection.findMany({
                orderBy: { dateStart: 'asc' },
                include: {
                    poems: {
                        orderBy: { index: 'asc' },
                        select: { id: true, title: true, date: true, location: true, index: true }
                    }
                }
            });
            return collections;
        } catch (error) {
            console.error('[ShuiService] 获取全量数据失败:', error);
            throw error;
        }
    }

    /**
     * 获取单首诗歌详情
     * @param {string} poemId 诗歌ID
     * @returns {Promise<Object>} 诗歌详情
     */
    async getPoemById(poemId) {
        try {
            const prisma = getPrismaClient();
            const poem = await prisma.shuiPoem.findUnique({
                where: { id: poemId },
                include: { collection: true }
            });
            if (!poem) {
                const error = new Error(`诗歌 ${poemId} 不存在`);
                error.statusCode = 404;
                throw error;
            }
            return poem;
        } catch (error) {
            console.error('[ShuiService] 获取诗歌详情失败:', error);
            throw error;
        }
    }
}

export const shuiService = new ShuiService();
