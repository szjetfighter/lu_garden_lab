const { PrismaClient } = require('../../lugarden_universal/application/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    // 添加 xueli 角色
    await prisma.maoxiaodouCharacter.create({
        data: {
            id: 'xueli',
            name: '雪梨',
            role: '张秋的滑冰搭子',
            description: '出现在《金牌得主》的滑冰训练场景中，是张秋新认识的摸鱼搭子。',
            category: 'tertiary',
            universeId: 'universe_maoxiaodou'
        }
    });
    console.log('✅ xueli 角色已添加');
    
    // 添加 SceneCharacterLink
    await prisma.maoxiaodouSceneCharacterLink.create({
        data: {
            id: 'gold_medal_winner_skating_training_xueli',
            sceneId: 'gold_medal_winner_skating_training',
            characterId: 'xueli',
            universeId: 'universe_maoxiaodou'
        }
    });
    console.log('✅ xueli-滑冰训练 关联已添加');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
