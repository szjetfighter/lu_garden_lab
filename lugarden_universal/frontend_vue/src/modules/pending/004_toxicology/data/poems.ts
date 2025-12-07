/**
 * 毒理报告 - 诗歌数据
 * 
 * 每个字/词带有权重 (weight):
 * - 1.0: 核心物质 (名词、强动词) - 离心力无法剥离
 * - 0.5: 连接物质 (弱动词、介词) - 高转速下飘动
 * - 0.0: 粉尘杂质 (形容词、助词、虚词) - 低转速即被甩飞
 */

export interface ToxicToken {
  char: string           // 单个字符
  weight: number         // 0 | 0.5 | 1
  type: 'core' | 'link' | 'dust'  // 语义类型
}

export interface ToxicLine {
  tokens: ToxicToken[]
}

export interface ToxicPoem {
  id: string
  title: string
  author: string
  lines: ToxicLine[]
  // 预计算的"有效成分"（离心后残留）
  residue: string
  // 有效成分提取率
  extractionRate: number
}

/**
 * 《鸣放》- 冯铗
 * 
 * 权重标注说明：
 * - 核心意象（法院、无人机、霰弹、钟、兵马）= 1
 * - 动作/状态（暴走、摆字、闪光、响）= 1
 * - 连接词（在、被、将、如）= 0.5
 * - 修饰/虚词（的、了、吗、这、好、无比）= 0
 */
export const poemMingFang: ToxicPoem = {
  id: 'mingfang',
  title: '鸣放',
  author: '冯铗',
  lines: [
    // 连着几天在河边暴走，闻这好世界的
    {
      tokens: [
        { char: '连', weight: 0.5, type: 'link' },
        { char: '着', weight: 0, type: 'dust' },
        { char: '几', weight: 0, type: 'dust' },
        { char: '天', weight: 1, type: 'core' },
        { char: '在', weight: 0.5, type: 'link' },
        { char: '河', weight: 1, type: 'core' },
        { char: '边', weight: 0.5, type: 'link' },
        { char: '暴', weight: 1, type: 'core' },
        { char: '走', weight: 1, type: 'core' },
        { char: '，', weight: 0, type: 'dust' },
        { char: '闻', weight: 1, type: 'core' },
        { char: '这', weight: 0, type: 'dust' },
        { char: '好', weight: 0, type: 'dust' },
        { char: '世', weight: 1, type: 'core' },
        { char: '界', weight: 1, type: 'core' },
        { char: '的', weight: 0, type: 'dust' },
      ]
    },
    // 好。这硝味。
    {
      tokens: [
        { char: '好', weight: 0, type: 'dust' },
        { char: '。', weight: 0, type: 'dust' },
        { char: '这', weight: 0, type: 'dust' },
        { char: '硝', weight: 1, type: 'core' },
        { char: '味', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 像一阵无比缓慢的霰弹。
    {
      tokens: [
        { char: '像', weight: 0.5, type: 'link' },
        { char: '一', weight: 0, type: 'dust' },
        { char: '阵', weight: 0, type: 'dust' },
        { char: '无', weight: 0, type: 'dust' },
        { char: '比', weight: 0, type: 'dust' },
        { char: '缓', weight: 0, type: 'dust' },
        { char: '慢', weight: 0, type: 'dust' },
        { char: '的', weight: 0, type: 'dust' },
        { char: '霰', weight: 1, type: 'core' },
        { char: '弹', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 沙垟桥上众人夜聚如溃。
    {
      tokens: [
        { char: '沙', weight: 1, type: 'core' },
        { char: '垟', weight: 1, type: 'core' },
        { char: '桥', weight: 1, type: 'core' },
        { char: '上', weight: 0.5, type: 'link' },
        { char: '众', weight: 0.5, type: 'link' },
        { char: '人', weight: 1, type: 'core' },
        { char: '夜', weight: 1, type: 'core' },
        { char: '聚', weight: 1, type: 'core' },
        { char: '如', weight: 0.5, type: 'link' },
        { char: '溃', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 表演中的无人机群
    {
      tokens: [
        { char: '表', weight: 1, type: 'core' },
        { char: '演', weight: 1, type: 'core' },
        { char: '中', weight: 0.5, type: 'link' },
        { char: '的', weight: 0, type: 'dust' },
        { char: '无', weight: 1, type: 'core' },
        { char: '人', weight: 1, type: 'core' },
        { char: '机', weight: 1, type: 'core' },
        { char: '群', weight: 1, type: 'core' },
      ]
    },
    // 一会儿摆字，一会儿排出滚动的龙形。
    {
      tokens: [
        { char: '一', weight: 0, type: 'dust' },
        { char: '会', weight: 0, type: 'dust' },
        { char: '儿', weight: 0, type: 'dust' },
        { char: '摆', weight: 1, type: 'core' },
        { char: '字', weight: 1, type: 'core' },
        { char: '，', weight: 0, type: 'dust' },
        { char: '一', weight: 0, type: 'dust' },
        { char: '会', weight: 0, type: 'dust' },
        { char: '儿', weight: 0, type: 'dust' },
        { char: '排', weight: 1, type: 'core' },
        { char: '出', weight: 0.5, type: 'link' },
        { char: '滚', weight: 1, type: 'core' },
        { char: '动', weight: 0.5, type: 'link' },
        { char: '的', weight: 0, type: 'dust' },
        { char: '龙', weight: 1, type: 'core' },
        { char: '形', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 仿佛数百具气态的遗迹被轻掸而去。
    {
      tokens: [
        { char: '仿', weight: 0, type: 'dust' },
        { char: '佛', weight: 0, type: 'dust' },
        { char: '数', weight: 0, type: 'dust' },
        { char: '百', weight: 0, type: 'dust' },
        { char: '具', weight: 0.5, type: 'link' },
        { char: '气', weight: 1, type: 'core' },
        { char: '态', weight: 0.5, type: 'link' },
        { char: '的', weight: 0, type: 'dust' },
        { char: '遗', weight: 1, type: 'core' },
        { char: '迹', weight: 1, type: 'core' },
        { char: '被', weight: 0.5, type: 'link' },
        { char: '轻', weight: 0, type: 'dust' },
        { char: '掸', weight: 1, type: 'core' },
        { char: '而', weight: 0, type: 'dust' },
        { char: '去', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 将它们塞回一个
    {
      tokens: [
        { char: '将', weight: 0.5, type: 'link' },
        { char: '它', weight: 0, type: 'dust' },
        { char: '们', weight: 0, type: 'dust' },
        { char: '塞', weight: 1, type: 'core' },
        { char: '回', weight: 1, type: 'core' },
        { char: '一', weight: 0, type: 'dust' },
        { char: '个', weight: 0, type: 'dust' },
      ]
    },
    // 闪光是不易的吧。
    {
      tokens: [
        { char: '闪', weight: 1, type: 'core' },
        { char: '光', weight: 1, type: 'core' },
        { char: '是', weight: 0.5, type: 'link' },
        { char: '不', weight: 0, type: 'dust' },
        { char: '易', weight: 0.5, type: 'link' },
        { char: '的', weight: 0, type: 'dust' },
        { char: '吧', weight: 0, type: 'dust' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 将它们用"嘭"拴住却有何难？
    {
      tokens: [
        { char: '将', weight: 0.5, type: 'link' },
        { char: '它', weight: 0, type: 'dust' },
        { char: '们', weight: 0, type: 'dust' },
        { char: '用', weight: 0.5, type: 'link' },
        { char: '"', weight: 0, type: 'dust' },
        { char: '嘭', weight: 1, type: 'core' },
        { char: '"', weight: 0, type: 'dust' },
        { char: '拴', weight: 1, type: 'core' },
        { char: '住', weight: 0.5, type: 'link' },
        { char: '却', weight: 0, type: 'dust' },
        { char: '有', weight: 0.5, type: 'link' },
        { char: '何', weight: 0, type: 'dust' },
        { char: '难', weight: 1, type: 'core' },
        { char: '？', weight: 0, type: 'dust' },
      ]
    },
    // 法院大楼被骤然擦亮，灰扑扑夜色如粉尘
    {
      tokens: [
        { char: '法', weight: 1, type: 'core' },
        { char: '院', weight: 1, type: 'core' },
        { char: '大', weight: 0, type: 'dust' },
        { char: '楼', weight: 1, type: 'core' },
        { char: '被', weight: 0.5, type: 'link' },
        { char: '骤', weight: 0, type: 'dust' },
        { char: '然', weight: 0, type: 'dust' },
        { char: '擦', weight: 1, type: 'core' },
        { char: '亮', weight: 1, type: 'core' },
        { char: '，', weight: 0, type: 'dust' },
        { char: '灰', weight: 0, type: 'dust' },
        { char: '扑', weight: 0, type: 'dust' },
        { char: '扑', weight: 0, type: 'dust' },
        { char: '夜', weight: 1, type: 'core' },
        { char: '色', weight: 1, type: 'core' },
        { char: '如', weight: 0.5, type: 'link' },
        { char: '粉', weight: 1, type: 'core' },
        { char: '尘', weight: 1, type: 'core' },
      ]
    },
    // 霎净难以深抹。
    {
      tokens: [
        { char: '霎', weight: 1, type: 'core' },
        { char: '净', weight: 1, type: 'core' },
        { char: '难', weight: 1, type: 'core' },
        { char: '以', weight: 0.5, type: 'link' },
        { char: '深', weight: 0, type: 'dust' },
        { char: '抹', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 其上大钟已十数年不转，
    {
      tokens: [
        { char: '其', weight: 0, type: 'dust' },
        { char: '上', weight: 0.5, type: 'link' },
        { char: '大', weight: 0, type: 'dust' },
        { char: '钟', weight: 1, type: 'core' },
        { char: '已', weight: 0.5, type: 'link' },
        { char: '十', weight: 0, type: 'dust' },
        { char: '数', weight: 0, type: 'dust' },
        { char: '年', weight: 1, type: 'core' },
        { char: '不', weight: 0, type: 'dust' },
        { char: '转', weight: 1, type: 'core' },
        { char: '，', weight: 0, type: 'dust' },
      ]
    },
    // 不响，
    {
      tokens: [
        { char: '不', weight: 0, type: 'dust' },
        { char: '响', weight: 1, type: 'core' },
        { char: '，', weight: 0, type: 'dust' },
      ]
    },
    // 但锈锁般诚实。
    {
      tokens: [
        { char: '但', weight: 0, type: 'dust' },
        { char: '锈', weight: 1, type: 'core' },
        { char: '锁', weight: 1, type: 'core' },
        { char: '般', weight: 0, type: 'dust' },
        { char: '诚', weight: 1, type: 'core' },
        { char: '实', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 空门大开而不遏诸兵马城外般诚实。
    {
      tokens: [
        { char: '空', weight: 1, type: 'core' },
        { char: '门', weight: 1, type: 'core' },
        { char: '大', weight: 0, type: 'dust' },
        { char: '开', weight: 1, type: 'core' },
        { char: '而', weight: 0, type: 'dust' },
        { char: '不', weight: 0, type: 'dust' },
        { char: '遏', weight: 1, type: 'core' },
        { char: '诸', weight: 0.5, type: 'link' },
        { char: '兵', weight: 1, type: 'core' },
        { char: '马', weight: 1, type: 'core' },
        { char: '城', weight: 1, type: 'core' },
        { char: '外', weight: 0.5, type: 'link' },
        { char: '般', weight: 0, type: 'dust' },
        { char: '诚', weight: 1, type: 'core' },
        { char: '实', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 林某说，总预备队不动。
    {
      tokens: [
        { char: '林', weight: 1, type: 'core' },
        { char: '某', weight: 0.5, type: 'link' },
        { char: '说', weight: 1, type: 'core' },
        { char: '，', weight: 0, type: 'dust' },
        { char: '总', weight: 0.5, type: 'link' },
        { char: '预', weight: 1, type: 'core' },
        { char: '备', weight: 1, type: 'core' },
        { char: '队', weight: 1, type: 'core' },
        { char: '不', weight: 0, type: 'dust' },
        { char: '动', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 而朋友你明天就要走了。
    {
      tokens: [
        { char: '而', weight: 0, type: 'dust' },
        { char: '朋', weight: 1, type: 'core' },
        { char: '友', weight: 1, type: 'core' },
        { char: '你', weight: 0.5, type: 'link' },
        { char: '明', weight: 0.5, type: 'link' },
        { char: '天', weight: 1, type: 'core' },
        { char: '就', weight: 0, type: 'dust' },
        { char: '要', weight: 0.5, type: 'link' },
        { char: '走', weight: 1, type: 'core' },
        { char: '了', weight: 0, type: 'dust' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 远远看去奔跳的病体。
    {
      tokens: [
        { char: '远', weight: 0, type: 'dust' },
        { char: '远', weight: 0, type: 'dust' },
        { char: '看', weight: 1, type: 'core' },
        { char: '去', weight: 0.5, type: 'link' },
        { char: '奔', weight: 1, type: 'core' },
        { char: '跳', weight: 1, type: 'core' },
        { char: '的', weight: 0, type: 'dust' },
        { char: '病', weight: 1, type: 'core' },
        { char: '体', weight: 1, type: 'core' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
    // 什么呢？路边，
    {
      tokens: [
        { char: '什', weight: 0, type: 'dust' },
        { char: '么', weight: 0, type: 'dust' },
        { char: '呢', weight: 0, type: 'dust' },
        { char: '？', weight: 0, type: 'dust' },
        { char: '路', weight: 1, type: 'core' },
        { char: '边', weight: 0.5, type: 'link' },
        { char: '，', weight: 0, type: 'dust' },
      ]
    },
    // 一长串细鞭炮如荨麻疹很快地遍了过去。
    {
      tokens: [
        { char: '一', weight: 0, type: 'dust' },
        { char: '长', weight: 0, type: 'dust' },
        { char: '串', weight: 0.5, type: 'link' },
        { char: '细', weight: 0, type: 'dust' },
        { char: '鞭', weight: 1, type: 'core' },
        { char: '炮', weight: 1, type: 'core' },
        { char: '如', weight: 0.5, type: 'link' },
        { char: '荨', weight: 1, type: 'core' },
        { char: '麻', weight: 1, type: 'core' },
        { char: '疹', weight: 1, type: 'core' },
        { char: '很', weight: 0, type: 'dust' },
        { char: '快', weight: 0, type: 'dust' },
        { char: '地', weight: 0, type: 'dust' },
        { char: '遍', weight: 1, type: 'core' },
        { char: '了', weight: 0, type: 'dust' },
        { char: '过', weight: 0.5, type: 'link' },
        { char: '去', weight: 0.5, type: 'link' },
        { char: '。', weight: 0, type: 'dust' },
      ]
    },
  ],
  // 离心后残留的"有效成分"
  residue: '天河暴走闻世界硝味霰弹沙垟桥人夜聚溃表演无人机群摆字排滚龙形气遗迹掸去塞回闪光嘭拴难法院楼擦亮夜色粉尘霎净难抹钟年转响锈锁诚实空门开遏兵马城诚实林说预备队动朋友天走看奔跳病体路鞭炮荨麻疹遍',
  // 有效成分提取率
  extractionRate: 0.47
}

// 导出所有诗歌
export const poems: ToxicPoem[] = [poemMingFang]

// 获取诗歌
export function getPoem(id: string): ToxicPoem | undefined {
  return poems.find(p => p.id === id)
}
