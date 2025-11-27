/**
 * 导入 Scene-Character 关联数据
 * 从 scenes.json 的 characters[] 数组导入到 MaoxiaodouSceneCharacterLink 桥表
 */

const { PrismaClient } = require('../../lugarden_universal/application/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const UNIVERSE_ID = 'universe_maoxiaodou';

async function main() {
    console.log('=== 导入 Scene-Character 关联数据 ===\n');
    
    // 1. 读取 scenes.json
    const scenesPath = path.join(__dirname, '../data/scenes.json');
    const scenesData = JSON.parse(fs.readFileSync(scenesPath, 'utf-8'));
    const scenes = scenesData.scenes;
    
    console.log(`读取到 ${scenes.length} 个场景`);
    
    // 2. 获取数据库中现有的 Character ID 列表（用于验证）
    const existingCharacters = await prisma.maoxiaodouCharacter.findMany({
        select: { id: true }
    });
    const validCharacterIds = new Set(existingCharacters.map(c => c.id));
    console.log(`数据库中有 ${validCharacterIds.size} 个角色\n`);
    
    // 3. 构建关联数据
    const links = [];
    const warnings = [];
    
    for (const scene of scenes) {
        const sceneId = scene.id;
        const characters = scene.characters || [];
        
        for (const characterId of characters) {
            // 验证 characterId 是否存在
            if (!validCharacterIds.has(characterId)) {
                warnings.push(`警告: 场景 ${sceneId} 引用了不存在的角色 ${characterId}`);
                continue;
            }
            
            links.push({
                id: `${sceneId}_${characterId}`,
                sceneId: sceneId,
                characterId: characterId,
                universeId: UNIVERSE_ID
            });
        }
    }
    
    // 输出警告
    if (warnings.length > 0) {
        console.log('=== 警告 ===');
        warnings.forEach(w => console.log(w));
        console.log('');
    }
    
    console.log(`准备导入 ${links.length} 条关联记录\n`);
    
    // 4. 批量导入（使用 upsert 实现幂等性）
    let created = 0;
    let updated = 0;
    
    for (const link of links) {
        try {
            await prisma.maoxiaodouSceneCharacterLink.upsert({
                where: { id: link.id },
                update: {}, // 无需更新
                create: link
            });
            created++;
        } catch (error) {
            console.error(`导入失败: ${link.id}`, error.message);
        }
    }
    
    console.log('=== 导入完成 ===');
    console.log(`成功导入: ${created} 条`);
    
    // 5. 验证
    const finalCount = await prisma.maoxiaodouSceneCharacterLink.count();
    console.log(`\n数据库 MaoxiaodouSceneCharacterLink 总记录数: ${finalCount}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
