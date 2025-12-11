/**
 * 水宇宙数据导入脚本
 * 将collections.json和poems.json导入SQLite数据库
 */

const { PrismaClient } = require('../../lugarden_universal/application/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const UNIVERSE_ID = 'universe_shui';

async function main() {
  console.log('=== 水宇宙数据导入 ===\n');

  // 1. 确保Universe存在
  console.log('1. 检查/创建Universe...');
  let universe = await prisma.universe.findUnique({ where: { id: UNIVERSE_ID } });
  if (!universe) {
    universe = await prisma.universe.create({
      data: {
        id: UNIVERSE_ID,
        code: 'shui',
        name: '水宇宙',
        type: 'shui',
        description: '基于肖水《十二个故事集》的诗歌宇宙',
        status: 'draft'
      }
    });
    console.log('   创建Universe: universe_shui');
  } else {
    console.log('   Universe已存在: universe_shui');
  }

  // 2. 读取JSON数据
  console.log('\n2. 读取JSON数据...');
  const collectionsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/collections.json'), 'utf-8'));
  const poemsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/poems.json'), 'utf-8'));
  
  console.log(`   collections: ${collectionsData.collections.length} 个故事集`);
  console.log(`   poems: ${poemsData.poems.length} 首诗`);

  // 3. 导入Collections
  console.log('\n3. 导入ShuiCollection...');
  for (const col of collectionsData.collections) {
    await prisma.shuiCollection.upsert({
      where: { id: `shui_collection_${col.nameEn}` },
      update: {},
      create: {
        id: `shui_collection_${col.nameEn}`,
        name: col.name,
        nameEn: col.nameEn,
        dedication: col.dedication || null,
        dateStart: col.dateStart,
        dateEnd: col.dateEnd,
        regions: col.regions ? JSON.stringify(col.regions) : null,
        poemCount: col.poemCount,
        description: col.description || null,
        universeId: UNIVERSE_ID
      }
    });
  }
  console.log(`   完成: ${collectionsData.collections.length} 个故事集`);

  // 4. 导入Poems
  console.log('\n4. 导入ShuiPoem...');
  for (const poem of poemsData.poems) {
    await prisma.shuiPoem.upsert({
      where: { id: poem.id },
      update: {},
      create: {
        id: poem.id,
        collectionId: poem.collectionId,
        title: poem.title,
        content: poem.content,
        date: poem.date,
        location: poem.location || null,
        index: poem.index,
        tokens: poem.tokens ? JSON.stringify(poem.tokens) : null,
        universeId: UNIVERSE_ID
      }
    });
  }
  console.log(`   完成: ${poemsData.poems.length} 首诗`);

  // 5. 验证
  console.log('\n5. 验证...');
  const dbCol = await prisma.shuiCollection.count();
  const dbPoem = await prisma.shuiPoem.count();
  console.log(`   数据库: ${dbCol} 个故事集, ${dbPoem} 首诗`);

  console.log('\n=== 导入完成 ===');
}

main()
  .catch(e => { console.error('错误:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
