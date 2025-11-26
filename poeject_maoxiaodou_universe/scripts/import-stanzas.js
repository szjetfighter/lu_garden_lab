/**
 * 诗节数据导入脚本
 * 将 stanzas.json 和 stanza_scene_links.json 导入数据库
 * 
 * 使用方法：node import-stanzas.js
 */

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 Prisma Client
const requireCjs = createRequire(import.meta.url);
let PrismaClient;
try {
  ({ PrismaClient } = requireCjs('../../lugarden_universal/application/generated/prisma'));
} catch (_ignored) {
  ({ PrismaClient } = requireCjs('@prisma/client'));
}

const prisma = new PrismaClient();

// 数据文件路径
const STANZAS_PATH = path.join(__dirname, '../data/stanzas.json');
const LINKS_PATH = path.join(__dirname, '../data/stanza_scene_links.json');

async function importStanzas() {
  console.log('📖 读取 stanzas.json...');
  const stanzasData = JSON.parse(fs.readFileSync(STANZAS_PATH, 'utf-8'));
  const stanzas = stanzasData.stanzas;
  
  console.log(`📊 共 ${stanzas.length} 个诗节待导入`);
  
  let created = 0;
  let skipped = 0;
  
  for (const stanza of stanzas) {
    try {
      await prisma.maoxiaodouStanza.upsert({
        where: {
          poemId_index: {
            poemId: stanza.poemId,
            index: stanza.index
          }
        },
        update: {
          content: stanza.content,
        },
        create: {
          id: stanza.id,
          poemId: stanza.poemId,
          index: stanza.index,
          content: stanza.content,
          universeId: stanza.universeId,
        }
      });
      created++;
    } catch (error) {
      console.error(`❌ 导入失败: ${stanza.id}`, error.message);
      skipped++;
    }
  }
  
  console.log(`✅ Stanza 导入完成: ${created} 成功, ${skipped} 跳过`);
  return created;
}

async function importLinks() {
  console.log('📖 读取 stanza_scene_links.json...');
  const linksData = JSON.parse(fs.readFileSync(LINKS_PATH, 'utf-8'));
  const links = linksData.links;
  
  console.log(`📊 共 ${links.length} 个链接待导入`);
  
  let created = 0;
  let skipped = 0;
  
  for (const link of links) {
    try {
      await prisma.maoxiaodouStanzaSceneLink.upsert({
        where: {
          stanzaId_sceneId: {
            stanzaId: link.stanzaId,
            sceneId: link.sceneId
          }
        },
        update: {
          confidence: link.confidence,
          reason: link.reason,
        },
        create: {
          id: link.id,
          stanzaId: link.stanzaId,
          sceneId: link.sceneId,
          confidence: link.confidence,
          reason: link.reason,
          universeId: link.universeId,
        }
      });
      created++;
    } catch (error) {
      console.error(`❌ 导入失败: ${link.id}`, error.message);
      skipped++;
    }
  }
  
  console.log(`✅ StanzaSceneLink 导入完成: ${created} 成功, ${skipped} 跳过`);
  return created;
}

async function verifyImport() {
  console.log('\n📊 验证导入结果...');
  
  const stanzaCount = await prisma.maoxiaodouStanza.count();
  const linkCount = await prisma.maoxiaodouStanzaSceneLink.count();
  
  console.log(`   - MaoxiaodouStanza: ${stanzaCount} 条`);
  console.log(`   - MaoxiaodouStanzaSceneLink: ${linkCount} 条`);
  
  // 抽查：获取第一个诗节及其关联场景
  const sampleStanza = await prisma.maoxiaodouStanza.findFirst({
    include: {
      sceneLinks: {
        include: {
          scene: true
        }
      }
    }
  });
  
  if (sampleStanza) {
    console.log(`\n🔍 抽查样本: ${sampleStanza.id}`);
    console.log(`   - 内容: ${sampleStanza.content.substring(0, 50)}...`);
    console.log(`   - 关联场景: ${sampleStanza.sceneLinks.map(l => l.scene.scenario).join(', ')}`);
  }
  
  return { stanzaCount, linkCount };
}

async function main() {
  console.log('🚀 开始导入诗节数据...\n');
  
  try {
    await importStanzas();
    await importLinks();
    await verifyImport();
    
    console.log('\n✅ 所有数据导入完成!');
  } catch (error) {
    console.error('❌ 导入过程出错:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
