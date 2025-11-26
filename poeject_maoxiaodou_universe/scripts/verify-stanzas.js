/**
 * 诗节数据验证脚本
 * 阶段F：数据完整性校验 + 关联关系验证
 */

import { createRequire } from 'module';
const requireCjs = createRequire(import.meta.url);
let PrismaClient;
try {
  ({ PrismaClient } = requireCjs('../../lugarden_universal/application/generated/prisma'));
} catch (_ignored) {
  ({ PrismaClient } = requireCjs('@prisma/client'));
}

const prisma = new PrismaClient();

async function verify() {
  console.log('========== 阶段F：数据验证 ==========\n');
  
  // F.1 数据完整性校验
  console.log('【F.1 数据完整性校验】');
  
  const stanzaCount = await prisma.maoxiaodouStanza.count();
  const linkCount = await prisma.maoxiaodouStanzaSceneLink.count();
  const sceneCount = await prisma.maoxiaodouScene.count();
  
  console.log(`  - MaoxiaodouStanza: ${stanzaCount} 条 (预期: 110)`);
  console.log(`  - MaoxiaodouStanzaSceneLink: ${linkCount} 条 (预期: 110)`);
  console.log(`  - MaoxiaodouScene: ${sceneCount} 条 (预期: 30)`);
  
  // 检查孤儿记录
  const orphanStanzas = await prisma.maoxiaodouStanza.findMany({
    where: { sceneLinks: { none: {} } }
  });
  console.log(`  - 无关联场景的诗节: ${orphanStanzas.length} 条`);
  
  // F.2 关联关系验证
  console.log('\n【F.2 关联关系验证】');
  
  // Stanza → Scene 查询
  const sampleStanza = await prisma.maoxiaodouStanza.findFirst({
    where: { id: 'shark_and_rock_stanza_1' },
    include: { sceneLinks: { include: { scene: true } } }
  });
  console.log(`  Stanza→Scene: ${sampleStanza.id}`);
  console.log(`    场景: ${sampleStanza.sceneLinks.map(l => l.scene.scenario).join(', ')}`);
  
  // Scene → Stanza 查询
  const sampleScene = await prisma.maoxiaodouScene.findFirst({
    where: { id: 'shark_and_rock_poker_room' },
    include: { stanzaLinks: { include: { stanza: true } } }
  });
  console.log(`  Scene→Stanza: ${sampleScene.scenario}`);
  console.log(`    诗节数: ${sampleScene.stanzaLinks.length}`);
  
  // Stanza → Scene → Poem 链式查询
  const chainQuery = await prisma.maoxiaodouStanza.findFirst({
    include: {
      poem: true,
      sceneLinks: { include: { scene: { include: { poem: true } } } }
    }
  });
  console.log('  链式查询: Stanza→Scene→Poem');
  console.log(`    诗节所属诗: ${chainQuery.poem.title}`);
  console.log(`    关联场景所属诗: ${chainQuery.sceneLinks[0]?.scene?.poem?.title}`);
  
  // 统计每首诗的诗节数
  console.log('\n【诗节分布统计】');
  const poemStats = await prisma.maoxiaodouStanza.groupBy({
    by: ['poemId'],
    _count: { id: true }
  });
  for (const stat of poemStats) {
    console.log(`  - ${stat.poemId}: ${stat._count.id} 节`);
  }
  
  // 置信度分布
  console.log('\n【置信度分布】');
  const confStats = await prisma.maoxiaodouStanzaSceneLink.groupBy({
    by: ['confidence'],
    _count: { id: true }
  });
  for (const stat of confStats) {
    console.log(`  - ${stat.confidence}: ${stat._count.id} 条`);
  }
  
  console.log('\n========== 验证完成 ==========');
  await prisma.$disconnect();
}

verify().catch(e => { console.error(e); process.exit(1); });
