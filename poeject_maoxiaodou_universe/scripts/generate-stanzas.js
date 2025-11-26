/**
 * 诗节拆分脚本
 * 将14首诗歌拆分为stanzas.json
 * 
 * 拆分规则：
 * - 正篇（7首）：按中文编号 一、二、三... 拆分
 * - 前篇/番外（7首）：按连续空行拆分
 */

const fs = require('fs');
const path = require('path');

// 诗歌配置
const poems = [
  // 正篇 - 按中文编号拆分
  { id: 'maoxiaodou_story_2', title: '毛小豆故事演绎 Ⅱ', section: '正篇', file: '正篇/毛小豆故事演绎 Ⅱ.txt', splitByNumber: true },
  { id: 'shark_and_rock', title: '鲨鱼与岩石', section: '正篇', file: '正篇/鲨鱼与岩石.txt', splitByNumber: true },
  { id: 'gold_medal_winner', title: '金牌得主', section: '正篇', file: '正篇/金牌得主.txt', splitByNumber: true },
  { id: 'remake', title: '毛小豆故事演绎 Ⅰ REMAKE', section: '正篇', file: '正篇/毛小豆故事演绎 Ⅰ REMAKE.txt', splitByNumber: true },
  { id: 'new_year', title: '新年快乐', section: '正篇', file: '正篇/新年快乐.txt', splitByNumber: true },
  { id: 'temple', title: '拆庙', section: '正篇', file: '正篇/拆庙.txt', splitByNumber: true },
  { id: 'fortune', title: '八方来财', section: '正篇', file: '正篇/八方来财.txt', splitByNumber: true },
  
  // 前篇 - 按空行拆分
  { id: 'sodium', title: '钠', section: '前篇', file: '前篇/钠.txt', splitByNumber: false },
  { id: 'wheat', title: '麦', section: '前篇', file: '前篇/麦.txt', splitByNumber: false },
  { id: 'museum', title: '馆', section: '前篇', file: '前篇/馆.txt', splitByNumber: false },
  
  // 番外 - 按空行拆分
  { id: 'canned_tuna', title: '高级罐头装金枪鱼', section: '番外', file: '番外/高级罐头装金枪鱼.txt', splitByNumber: false },
  { id: 'watch_out', title: '注意看', section: '番外', file: '番外/注 意 看.txt', splitByNumber: false },
  { id: 'interest', title: '你的兴趣是什么', section: '番外', file: '番外/你的兴趣是什么.txt', splitByNumber: false },
  { id: 'subtitles', title: '论字幕的必要性', section: '番外', file: '番外/论字幕的必要性.txt', splitByNumber: false },
];

// 中文数字映射
const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五'];

// 按中文编号拆分
function splitByChineseNumber(content) {
  const stanzas = [];
  // 匹配 "一" 或 "一、" 或 "一." 开头的行
  const pattern = /^(一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五)[、.．]?\s*$/gm;
  
  const lines = content.split('\n');
  let currentStanza = [];
  let stanzaIndex = 0;
  let inStanza = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // 检查是否是编号行
    const isNumberLine = chineseNumbers.some(num => {
      return trimmedLine === num || 
             trimmedLine === num + '、' || 
             trimmedLine === num + '.' ||
             trimmedLine === num + '．';
    });
    
    if (isNumberLine) {
      // 保存之前的诗节（如果有内容）
      if (currentStanza.length > 0 && currentStanza.some(l => l.trim())) {
        stanzas.push({
          index: stanzaIndex,
          content: currentStanza.join('\n').trim()
        });
      }
      stanzaIndex++;
      currentStanza = [];
      inStanza = true;
    } else if (inStanza) {
      currentStanza.push(line);
    } else {
      // 编号前的内容（标题等），跳过
      continue;
    }
  }
  
  // 保存最后一个诗节
  if (currentStanza.length > 0 && currentStanza.some(l => l.trim())) {
    stanzas.push({
      index: stanzaIndex,
      content: currentStanza.join('\n').trim()
    });
  }
  
  return stanzas;
}

// 检测是否为日期行（格式：YYYY.MM 或 YYYY/MM 或 YYYY-MM）
function isDateLine(line) {
  const trimmed = line.trim();
  return /^\d{4}[.\/\-]\d{2}$/.test(trimmed);
}

// 按空行拆分（修复版）
function splitByEmptyLine(content, poemId) {
  const stanzas = [];
  const lines = content.split('\n');
  let currentStanza = [];
  let stanzaIndex = 1;
  let hasContent = false;
  
  // 不跳过任何行，所有内容都是诗歌的一部分
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      // 遇到空行
      if (hasContent) {
        const stanzaContent = currentStanza.join('\n').trim();
        if (stanzaContent) {
          stanzas.push({
            index: stanzaIndex,
            content: stanzaContent
          });
          stanzaIndex++;
        }
        currentStanza = [];
        hasContent = false;
      }
    } else {
      currentStanza.push(line);
      hasContent = true;
    }
  }
  
  // 保存最后一个诗节
  const lastContent = currentStanza.join('\n').trim();
  if (lastContent) {
    // 检查最后一个是否只是日期行
    if (isDateLine(lastContent)) {
      // 日期合并到前一个诗节
      if (stanzas.length > 0) {
        stanzas[stanzas.length - 1].content += '\n\n' + lastContent;
      }
    } else {
      stanzas.push({
        index: stanzaIndex,
        content: lastContent
      });
    }
  }
  
  return stanzas;
}

// 主函数
function main() {
  const poemsDir = path.join(__dirname, '..', 'poems');
  const outputPath = path.join(__dirname, '..', 'data', 'stanzas.json');
  
  const allStanzas = [];
  const universeId = 'universe_maoxiaodou';
  
  let totalStanzas = 0;
  
  for (const poem of poems) {
    const filePath = path.join(poemsDir, poem.file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`文件不存在: ${filePath}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    let stanzas;
    if (poem.splitByNumber) {
      stanzas = splitByChineseNumber(content);
    } else {
      stanzas = splitByEmptyLine(content, poem.id);
    }
    
    console.log(`${poem.title}: ${stanzas.length} 个诗节`);
    totalStanzas += stanzas.length;
    
    for (const stanza of stanzas) {
      allStanzas.push({
        id: `${poem.id}_stanza_${stanza.index}`,
        poemId: poem.id,
        index: stanza.index,
        content: stanza.content,
        universeId: universeId
      });
    }
  }
  
  // 输出JSON
  const output = {
    metadata: {
      universe_name: '毛小豆宇宙',
      version: '1.0',
      description: '毛小豆宇宙诗节数据（基于诗歌文本拆分生成）',
      created_at: new Date().toISOString().split('T')[0],
      status: '初稿（待复核）',
      total_stanzas: totalStanzas,
      split_rules: {
        '正篇': '按中文编号（一、二、三...）拆分',
        '前篇': '按连续空行拆分',
        '番外': '按连续空行拆分'
      }
    },
    stanzas: allStanzas
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  
  console.log(`\n总计: ${totalStanzas} 个诗节`);
  console.log(`输出: ${outputPath}`);
}

main();
