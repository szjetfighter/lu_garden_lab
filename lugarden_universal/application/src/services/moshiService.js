/**
 * 摸诗服务 - 老虎机核心逻辑
 * 
 * 功能：
 * 1. 生成5x3符号矩阵
 * 2. 243ways连线判定
 * 3. 根据中奖符号查询stanza池
 * 4. 返回随机stanza
 */

import { getPrismaClient } from '../persistence/prismaClient.js';

// ================================
// 符号配置
// ================================

const SYMBOLS = {
  // 人物符号（稀有）
  maoxiaodou: { id: 'maoxiaodou', name: '毛小豆', type: 'character', emoji: '🐻', weight: 8 },
  huashao: { id: 'huashao', name: '华少', type: 'character', emoji: '👔', weight: 8 },
  dongxiansheng: { id: 'dongxiansheng', name: '栋先生', type: 'character', emoji: '🎒', weight: 8 },
  zhangqiu: { id: 'zhangqiu', name: '张秋', type: 'character', emoji: '👩', weight: 8 },
  
  // 场景类型符号（常见）
  office: { id: 'office', name: '办公室', type: 'scene', emoji: '🏢', weight: 15, sceneType: '办公室社交' },
  brotherhood: { id: 'brotherhood', name: '兄弟会', type: 'scene', emoji: '🎰', weight: 15, sceneType: '兄弟会社交' },
  enclosed: { id: 'enclosed', name: '封闭空间', type: 'scene', emoji: '🚪', weight: 15, sceneType: '封闭空间' },
  social: { id: 'social', name: '社交', type: 'scene', emoji: '🍻', weight: 15, sceneType: '商务社交' },
  sport: { id: 'sport', name: '运动', type: 'scene', emoji: '🏃', weight: 12, sceneType: '运动环境' },
  
  // Wild符号（最稀有）
  wild: { id: 'wild', name: '陆', type: 'wild', emoji: '🌸', weight: 5 }
};

const SYMBOL_LIST = Object.values(SYMBOLS);
const TOTAL_WEIGHT = SYMBOL_LIST.reduce((sum, s) => sum + s.weight, 0);

// ================================
// 核心函数
// ================================

/**
 * 按权重随机选择一个符号
 */
function getRandomSymbol() {
  let random = Math.random() * TOTAL_WEIGHT;
  for (const symbol of SYMBOL_LIST) {
    random -= symbol.weight;
    if (random <= 0) return symbol;
  }
  return SYMBOL_LIST[SYMBOL_LIST.length - 1];
}

/**
 * 生成5x3符号矩阵
 */
function generateMatrix() {
  const matrix = [];
  for (let col = 0; col < 5; col++) {
    const column = [];
    for (let row = 0; row < 3; row++) {
      column.push(getRandomSymbol());
    }
    matrix.push(column);
  }
  return matrix;
}

/**
 * 243ways连线判定
 * 返回所有中奖的符号ID集合 + 中奖格子坐标
 */
function checkWins(matrix) {
  const winningSymbols = new Set();
  const winDetails = [];
  const winningCells = []; // 中奖格子坐标 [col, row]
  
  // 获取第一列所有非Wild符号
  const firstColSymbols = new Set();
  for (const symbol of matrix[0]) {
    if (symbol.type !== 'wild') {
      firstColSymbols.add(symbol.id);
    }
  }
  // Wild也可以作为起始
  if (matrix[0].some(s => s.type === 'wild')) {
    // Wild起始时，需要看第二列有什么符号
    for (const symbol of matrix[1]) {
      if (symbol.type !== 'wild') {
        firstColSymbols.add(symbol.id);
      }
    }
  }
  
  // 对每个可能的符号检查连线
  for (const targetId of firstColSymbols) {
    let consecutiveCols = 0;
    const cellsForThisSymbol = [];
    
    for (let col = 0; col < 5; col++) {
      const matchingRows = [];
      for (let row = 0; row < 3; row++) {
        const s = matrix[col][row];
        if (s.id === targetId || s.type === 'wild') {
          matchingRows.push(row);
        }
      }
      
      if (matchingRows.length > 0) {
        consecutiveCols++;
        // 记录这一列中匹配的格子
        matchingRows.forEach(row => cellsForThisSymbol.push([col, row]));
      } else {
        break;
      }
    }
    
    // 3列及以上算中奖
    if (consecutiveCols >= 3) {
      winningSymbols.add(targetId);
      // 只保留连线范围内的格子
      const validCells = cellsForThisSymbol.filter(([col]) => col < consecutiveCols);
      winDetails.push({
        symbolId: targetId,
        symbol: SYMBOLS[targetId],
        columns: consecutiveCols,
        cells: validCells  // 该符号对应的中奖格子
      });
      // 合并到总winningCells（兼容旧逻辑）
      validCells.forEach(cell => {
        if (!winningCells.some(([c, r]) => c === cell[0] && r === cell[1])) {
          winningCells.push(cell);
        }
      });
    }
  }
  
  return { winningSymbols: Array.from(winningSymbols), winDetails, winningCells };
}

/**
 * 根据中奖符号查询stanza池
 */
async function getStanzaPool(winningSymbols) {
  const prisma = getPrismaClient();
  const pools = {};
  
  for (const symbolId of winningSymbols) {
    const symbol = SYMBOLS[symbolId];
    let stanzas = [];
    
    if (symbol.type === 'character') {
      // 人物符号：通过SceneCharacterLink找场景，再找stanza
      stanzas = await prisma.maoxiaodouStanza.findMany({
        where: {
          sceneLinks: {
            some: {
              scene: {
                characterLinks: {
                  some: {
                    characterId: symbolId
                  }
                }
              }
            }
          }
        },
        select: { 
          id: true, 
          content: true, 
          poemId: true,
          index: true,
          poem: { select: { title: true } }
        }
      });
    } else if (symbol.type === 'scene') {
      // 场景类型符号：通过scene.type找stanza
      stanzas = await prisma.maoxiaodouStanza.findMany({
        where: {
          sceneLinks: {
            some: {
              scene: {
                type: symbol.sceneType
              }
            }
          }
        },
        select: { 
          id: true, 
          content: true, 
          poemId: true,
          index: true,
          poem: { select: { title: true } }
        }
      });
    }
    
    pools[symbolId] = stanzas;
  }
  
  return pools;
}

/**
 * 从多个池中取交集，或降级到最大池
 */
function selectStanza(pools, winningSymbols) {
  if (winningSymbols.length === 0) {
    return null;
  }
  
  // 尝试取交集
  let intersection = null;
  for (const symbolId of winningSymbols) {
    const pool = pools[symbolId] || [];
    if (intersection === null) {
      intersection = new Set(pool.map(s => s.id));
    } else {
      const poolIds = new Set(pool.map(s => s.id));
      intersection = new Set([...intersection].filter(id => poolIds.has(id)));
    }
  }
  
  // 如果交集非空，从交集中随机选
  if (intersection && intersection.size > 0) {
    const intersectionArray = Array.from(intersection);
    const randomId = intersectionArray[Math.floor(Math.random() * intersectionArray.length)];
    // 找到完整的stanza对象，并返回第一个中奖符号作为主要符号
    for (const symbolId of winningSymbols) {
      const stanza = pools[symbolId]?.find(s => s.id === randomId);
      if (stanza) return { stanza, source: 'intersection', primarySymbol: winningSymbols[0] };
    }
  }
  
  // 降级：从最大的池中随机选
  let maxPool = [];
  let maxSymbol = null;
  for (const symbolId of winningSymbols) {
    const pool = pools[symbolId] || [];
    if (pool.length > maxPool.length) {
      maxPool = pool;
      maxSymbol = symbolId;
    }
  }
  
  if (maxPool.length > 0) {
    const stanza = maxPool[Math.floor(Math.random() * maxPool.length)];
    return { stanza, source: 'fallback', primarySymbol: maxSymbol };
  }
  
  return null;
}

// ================================
// 导出服务
// ================================

export const moshiService = {
  /**
   * 执行一次摸诗
   */
  async spin() {
    // 1. 生成矩阵
    const matrix = generateMatrix();
    
    // 2. 判定连线
    const { winningSymbols, winDetails, winningCells } = checkWins(matrix);
    
    // 3. 查询stanza池
    const pools = await getStanzaPool(winningSymbols);
    
    // 4. 选择stanza
    const result = selectStanza(pools, winningSymbols);
    
    // 5. 构建主要中奖符号详情
    let primaryWinDetail = null;
    if (result?.primarySymbol) {
      const detail = winDetails.find(d => d.symbolId === result.primarySymbol);
      if (detail) {
        primaryWinDetail = detail;
      }
    }
    
    // 6. 构建响应
    return {
      matrix: matrix.map(col => col.map(s => ({
        id: s.id,
        name: s.name,
        emoji: s.emoji,
        type: s.type
      }))),
      win: winningSymbols.length > 0,
      winDetails,
      winningCells, // 所有中奖格子坐标（兼容）
      primaryWinDetail, // 实际产生stanza的符号详情
      primaryWinningCells: primaryWinDetail?.cells || [], // 只包含primarySymbol的格子
      stanza: result?.stanza || null,
      stanzaSource: result?.source || null,
      debug: {
        poolSizes: Object.fromEntries(
          Object.entries(pools).map(([k, v]) => [k, v.length])
        )
      }
    };
  },
  
  /**
   * 获取符号配置（供前端使用）
   */
  getSymbols() {
    return SYMBOL_LIST.map(s => ({
      id: s.id,
      name: s.name,
      emoji: s.emoji,
      type: s.type,
      weight: s.weight
    }));
  },
  
  /**
   * 获取完整诗歌（包含所有诗节）
   */
  async getPoem(poemId) {
    const prisma = getPrismaClient();
    
    // 获取诗歌信息
    const poem = await prisma.maoxiaodouPoem.findUnique({
      where: { id: poemId },
      include: {
        stanzas: {
          orderBy: { index: 'asc' },
          select: {
            id: true,
            index: true,
            content: true
          }
        }
      }
    });
    
    if (!poem) {
      return null;
    }
    
    return {
      id: poem.id,
      title: poem.title,
      section: poem.section,
      stanzas: poem.stanzas
    };
  }
};
