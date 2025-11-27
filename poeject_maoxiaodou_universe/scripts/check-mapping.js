const { PrismaClient } = require('../../lugarden_universal/application/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    // 检查Stanza-Scene关系：一个Stanza对应几个Scene？
    const links = await prisma.maoxiaodouStanzaSceneLink.findMany();
    
    // 按stanzaId分组
    const byStanza = {};
    links.forEach(l => {
        byStanza[l.stanzaId] = (byStanza[l.stanzaId] || []).concat(l.sceneId);
    });
    
    // 统计每个stanza对应几个scene
    const counts = Object.values(byStanza).map(scenes => scenes.length);
    const multiScene = Object.entries(byStanza).filter(([_, scenes]) => scenes.length > 1);
    
    console.log(`总Stanza数: ${Object.keys(byStanza).length}`);
    console.log(`总Link数: ${links.length}`);
    console.log(`对应1个Scene的Stanza: ${counts.filter(c => c === 1).length}`);
    console.log(`对应多个Scene的Stanza: ${multiScene.length}`);
    
    if (multiScene.length > 0) {
        console.log('\n=== 对应多个Scene的Stanza ===');
        multiScene.slice(0, 5).forEach(([stanza, scenes]) => {
            console.log(`${stanza} → ${scenes.join(', ')}`);
        });
    } else {
        console.log('\n结论：每个Stanza只对应1个Scene，是一对一关系！');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
