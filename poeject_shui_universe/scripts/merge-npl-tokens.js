/**
 * 合并shui_NPL.json的tokens到poems.json
 * 通过标题(title)进行匹配
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const poemsPath = path.join(dataDir, 'poems.json');
const nplPath = path.join(dataDir, 'shui_NPL.json');

// 读取文件
const poemsData = JSON.parse(fs.readFileSync(poemsPath, 'utf-8'));
const nplData = JSON.parse(fs.readFileSync(nplPath, 'utf-8'));

// 构建NPL标题->tokens映射
const tokenMap = new Map();
for (const volume of nplData.volumes) {
  for (const poem of volume.poems) {
    tokenMap.set(poem.title, poem.tokens);
  }
}

// 合并tokens到poems
let matchCount = 0;
let missCount = 0;
const missingTitles = [];

for (const poem of poemsData.poems) {
  const tokens = tokenMap.get(poem.title);
  if (tokens) {
    poem.tokens = tokens;
    matchCount++;
  } else {
    missCount++;
    missingTitles.push(poem.title);
  }
}

// 写入更新后的poems.json
fs.writeFileSync(poemsPath, JSON.stringify(poemsData, null, 2), 'utf-8');

// 输出结果
console.log('=== 合并完成 ===');
console.log(`匹配成功: ${matchCount} 首`);
console.log(`匹配失败: ${missCount} 首`);
if (missingTitles.length > 0) {
  console.log('未匹配的标题:', missingTitles);
}
console.log(`输出文件: ${poemsPath}`);
