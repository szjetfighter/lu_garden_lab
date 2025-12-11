/**
 * 十二故事集诗歌解析脚本
 * 将txt诗集解析为JSON格式
 */
const fs = require('fs');
const path = require('path');

// 故事集配置
const collections = [
  { nameEn: 'bohai', name: '渤海故事集', startLine: 36 },
  { nameEn: 'taiyuan', name: '太原故事集', startLine: 145 },
  { nameEn: 'jiangdong', name: '江东故事集', startLine: 254 },
  { nameEn: 'nanling', name: '南岭故事集', startLine: 370 },
  { nameEn: 'shanghai', name: '上海故事集', startLine: 577 },
  { nameEn: 'yunque', name: '云雀故事集', startLine: 782 },
  { nameEn: 'molu', name: '末路故事集', startLine: 987 },
  { nameEn: 'nanxi', name: '南溪故事集', startLine: 1192 },
  { nameEn: 'zidu', name: '自渡故事集', startLine: 1404 },
  { nameEn: 'shizhiba', name: '十之八九故事集', startLine: 1609, isLong: true },
  { nameEn: 'dangzhou', name: '当昼有人客故事集', startLine: 1675, isLong: true },
  { nameEn: 'piruzhao', name: '譬如朝露故事集', startLine: 1782 }
];

// 日期正则
const dateRegex = /^\d{4}\.\d{1,2}\.\d{1,2}/;

function parsePoems(text) {
  const lines = text.split('\n');
  const poems = [];
  
  for (let ci = 0; ci < collections.length; ci++) {
    const col = collections[ci];
    const nextCol = collections[ci + 1];
    const endLine = nextCol ? nextCol.startLine : lines.length;
    
    let poemIndex = 0;
    let currentPoem = null;
    let contentLines = [];
    
    for (let i = col.startLine; i < endLine; i++) {
      const line = lines[i]?.trim() || '';
      
      // 跳过空行和故事集标题
      if (!line || line.includes('故事集') || line === '献给湖南省郴州市北湖区南溪乡') continue;
      
      // 检测日期行（诗歌结束）
      if (dateRegex.test(line)) {
        if (currentPoem && contentLines.length > 0) {
          currentPoem.content = contentLines.join('\n');
          currentPoem.date = line.split(' ')[0]; // 处理"2024.8.15 改写宇行"这种情况
          poems.push(currentPoem);
          currentPoem = null;
          contentLines = [];
        }
        continue;
      }
      
      // 检测标题行（短行，非内容）
      if (!currentPoem && line.length < 20 && !line.includes('，') && !line.includes('。')) {
        poemIndex++;
        currentPoem = {
          id: `shui_poem_${col.nameEn}_${String(poemIndex).padStart(2, '0')}`,
          collectionId: `shui_collection_${col.nameEn}`,
          title: line,
          content: '',
          date: '',
          location: null,
          index: poemIndex,
          universeId: 'shui'
        };
        continue;
      }
      
      // 内容行
      if (currentPoem) {
        contentLines.push(line);
      }
    }
  }
  
  return poems;
}

// 主函数
const inputPath = path.join(__dirname, '../data/十二个故事集·肖水.txt');
const outputPath = path.join(__dirname, '../data/poems.json');

const text = fs.readFileSync(inputPath, 'utf-8');
const poems = parsePoems(text);

const output = {
  metadata: {
    version: '1.0',
    source: '十二个故事集·肖水.txt',
    createdAt: new Date().toISOString().split('T')[0],
    status: 'draft',
    totalPoems: poems.length,
    universeId: 'shui'
  },
  poems
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`解析完成: ${poems.length} 首诗`);
console.log('输出文件:', outputPath);
