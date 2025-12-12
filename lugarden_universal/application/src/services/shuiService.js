import { getPrismaClient } from '../persistence/prismaClient.js';

export class ShuiService {
    /**
     * 获取所有水宇宙故事集
     * @returns {Promise<Array>} 故事集列表
     */
    async getAllCollections() {
        try {
            const prisma = getPrismaClient();
            const collections = await prisma.shuiCollection.findMany({
                orderBy: {
                    id: 'asc'
                }
            });
            return collections;
        } catch (error) {
            console.error('[ShuiService] 获取故事集失败:', error);
            throw error;
        }
    }
}

export const shuiService = new ShuiService();
