const { PrismaClient } = require('../../lugarden_universal/application/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const sceneCount = await prisma.maoxiaodouScene.count();
    const characterCount = await prisma.maoxiaodouCharacter.count();
    const stanzaCount = await prisma.maoxiaodouStanza.count();
    const stanzaSceneLinkCount = await prisma.maoxiaodouStanzaSceneLink.count();
    const sceneCharacterLinkCount = await prisma.maoxiaodouSceneCharacterLink.count();
    
    console.log('=== 数据库状态 ===');
    console.log(`MaoxiaodouScene: ${sceneCount} 条`);
    console.log(`MaoxiaodouCharacter: ${characterCount} 条`);
    console.log(`MaoxiaodouStanza: ${stanzaCount} 条`);
    console.log(`MaoxiaodouStanzaSceneLink: ${stanzaSceneLinkCount} 条`);
    console.log(`MaoxiaodouSceneCharacterLink: ${sceneCharacterLinkCount} 条`);
    
    // 展示 Scene-Character 对应关系
    console.log('\n=== Scene-Character 对应关系 ===\n');
    
    const scenes = await prisma.maoxiaodouScene.findMany({
        include: {
            characterLinks: {
                include: {
                    character: { select: { id: true, name: true } }
                }
            }
        },
        orderBy: { id: 'asc' }
    });
    
    for (const scene of scenes) {
        const chars = scene.characterLinks.map(l => l.character.name).join(', ');
        console.log(`${scene.scenario} (${scene.type})`);
        console.log(`  → ${chars || '无角色'}`);
        console.log('');
    }
    
    // 统计每个角色出现的场景数
    console.log('=== 角色出场统计 ===\n');
    const characters = await prisma.maoxiaodouCharacter.findMany({
        include: {
            sceneLinks: true
        },
        orderBy: { id: 'asc' }
    });
    
    const charStats = characters
        .map(c => ({ name: c.name, count: c.sceneLinks.length }))
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count);
    
    charStats.forEach(c => console.log(`${c.name}: ${c.count} 个场景`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
