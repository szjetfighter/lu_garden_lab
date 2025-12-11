/**
 * poems.json 结构化质量审核脚本
 */
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/poems.json'), 'utf-8'));

console.log('=== poems.json 结构化质量审核 ===\n');

// 1. 基础统计
console.log('【1. 基础统计】');
console.log('  总诗歌数:', data.poems.length);
console.log('  metadata.totalPoems:', data.metadata.totalPoems);
console.log('  一致性:', data.poems.length === data.metadata.totalPoems ? '✅' : '❌');

// 2. 字段完整性检查
console.log('\n【2. 字段完整性】');
const requiredFields = ['id', 'collectionId', 'title', 'content', 'date', 'index', 'universeId', 'tokens'];
const fieldStats = {};
requiredFields.forEach(f => fieldStats[f] = { present: 0, missing: [] });

data.poems.forEach((p, i) => {
  requiredFields.forEach(f => {
    if (p[f] !== undefined && p[f] !== null && (Array.isArray(p[f]) ? p[f].length > 0 : true)) {
      fieldStats[f].present++;
    } else {
      fieldStats[f].missing.push(p.title || i);
    }
  });
});

requiredFields.forEach(f => {
  const stat = fieldStats[f];
  const status = stat.present === data.poems.length ? '✅' : (stat.present === 0 ? '❌' : '⚠️');
  console.log(`  ${f}: ${stat.present}/109 ${status}`);
  if (stat.missing.length > 0 && stat.missing.length <= 5) {
    console.log('    缺失:', stat.missing.join(', '));
  }
});

// 3. ID格式检查
console.log('\n【3. ID格式一致性】');
const idPattern = /^shui_poem_[a-z]+_\d{2}$/;
const invalidIds = data.poems.filter(p => !idPattern.test(p.id));
console.log('  格式规范(shui_poem_{collection}_{num}):', invalidIds.length === 0 ? '✅' : `⚠️ ${invalidIds.length}个异常`);
if (invalidIds.length > 0 && invalidIds.length <= 10) {
  console.log('    异常ID:', invalidIds.map(p => p.id).join(', '));
}

// 4. 日期格式检查
console.log('\n【4. 日期格式一致性】');
const datePattern = /^\d{4}\.\d{1,2}\.\d{1,2}$/;
const invalidDates = data.poems.filter(p => !datePattern.test(p.date));
console.log('  格式规范(YYYY.M.D):', invalidDates.length === 0 ? '✅' : `⚠️ ${invalidDates.length}个异常`);
if (invalidDates.length > 0 && invalidDates.length <= 5) {
  console.log('    异常日期:', invalidDates.map(p => `${p.title}:${p.date}`).join(', '));
}

// 5. Collection分布
console.log('\n【5. Collection分布】');
const collectionCount = {};
data.poems.forEach(p => {
  collectionCount[p.collectionId] = (collectionCount[p.collectionId] || 0) + 1;
});
Object.entries(collectionCount).sort().forEach(([k, v]) => {
  const name = k.replace('shui_collection_', '');
  console.log(`  ${name}: ${v}首`);
});

// 6. tokens质量
console.log('\n【6. Tokens质量】');
const tokenStats = data.poems.map(p => p.tokens ? p.tokens.length : 0);
const avgTokens = (tokenStats.reduce((a, b) => a + b, 0) / tokenStats.length).toFixed(1);
const minTokens = Math.min(...tokenStats);
const maxTokens = Math.max(...tokenStats);
console.log('  平均tokens数:', avgTokens);
console.log('  最少:', minTokens);
console.log('  最多:', maxTokens);
const emptyTokens = data.poems.filter(p => !p.tokens || p.tokens.length === 0);
console.log('  空tokens:', emptyTokens.length === 0 ? '✅ 无' : `❌ ${emptyTokens.length}首`);

// 7. index连续性检查
console.log('\n【7. Index连续性】');
const indexIssues = [];
Object.keys(collectionCount).forEach(cid => {
  const poems = data.poems.filter(p => p.collectionId === cid).sort((a, b) => a.index - b.index);
  for (let i = 0; i < poems.length; i++) {
    if (poems[i].index !== i + 1) {
      indexIssues.push(`${cid}: 期望${i + 1}, 实际${poems[i].index}`);
    }
  }
});
console.log('  index从1开始连续:', indexIssues.length === 0 ? '✅' : `⚠️ ${indexIssues.length}个问题`);
if (indexIssues.length > 0 && indexIssues.length <= 5) {
  console.log('    问题:', indexIssues.join('; '));
}

// 8. 内容完整性
console.log('\n【8. 内容完整性】');
const emptyContent = data.poems.filter(p => !p.content || p.content.trim().length < 10);
console.log('  内容非空(>10字符):', emptyContent.length === 0 ? '✅' : `❌ ${emptyContent.length}首异常`);

console.log('\n=== 审核完成 ===');
