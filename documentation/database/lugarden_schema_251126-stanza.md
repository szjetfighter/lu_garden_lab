# 陆家花园主宇宙数据库设计 - v3.2 (主宇宙中立实体架构 + Stanza扩展)

> **基准版本**: 2025-11-26
> **文档状态**: ✅ 定稿（数据治理已完成）
> **基于版本**: v3.1 (lugarden_schema_251126.md)

本设计采用"主宇宙中立实体 + 子宇宙桥接"的架构模型，实现跨宇宙数据融合与解耦。

**当前版本：24张表**

> **数据治理结果**（实际数据统计）：
> - MaoxiaodouStanza: 110条记录（14首诗拆分）
> - MaoxiaodouStanzaSceneLink: 110条记录（30个场景关联）
> - 置信度分布: 105高/5中
- 主宇宙中立实体：3张表（Theme、Emotion、Universe）
- 桥表：3张表（UniverseTheme、UniverseEmotion、CrossUniverseContentLink）
- 周春秋宇宙：5张表（ZhouProject、ZhouSubProject、ZhouPoem、ZhouQA、ZhouMapping）
- 毛小豆宇宙：13张表（MaoxiaodouPoem、MaoxiaodouCharacter、MaoxiaodouCharacterRelation、MaoxiaodouTerminology、MaoxiaodouTheme、MaoxiaodouScene、MaoxiaodouTimeline、MaoxiaodouTheory、MaoxiaodouReadingLayer、MaoxiaodouMapping、MaoxiaodouMetadata、**MaoxiaodouStanza**、**MaoxiaodouStanzaSceneLink**）

## 设计原则
- 中立：核心概念（Themes/Archetypes/Emotions）不绑定任何具体子宇宙。
- 解耦：子宇宙（毛小豆、周与春秋）通过桥表与中立实体建立关联。
- 受控冗余：允许在子宇宙保留必要的本地字段，但跨宇宙共享走中立实体。
- 稳定 ID：所有表使用稳定且可迁移的字符串 ID（如 `lugarden_*` 前缀）。
- [DECISION] 统一诗歌库取舍：选择方案B（各宇宙自持诗库 + 通过视图/物化映射统一）。
- [DECISION] Universe ID/Code 规范：采纳 `universe_maoxiaodou`、`universe_zhou_spring_autumn` 等稳定字符串。

## 核心中立实体（主宇宙）
1) Theme（主题）
   - id (PK)
   - name (unique)
   - description

2) Emotion（情感）
   - id (PK)
   - name (unique)
   - polarity (enum: positive | neutral | negative | mixed)
   - intensity (int, 1..5)
   - [DECISION] polarity 允许 mixed 以覆盖复杂情绪；intensity 采用 1..5 离散刻度，便于统计与阈值判断。

> 注：当前版本不在主宇宙层纳入 Archetype / Concept；二者下沉到各自子宇宙独立建模。

## 子宇宙与桥表
> 桥表（junction/association table）用于表达多对多关系，并承载差异化语义（如权重/置信度/备注），将“主宇宙中立实体”与“子宇宙 Universe”在运行时映射，避免强绑定。

1) Universe（子宇宙）
   - id (PK) （如：`universe_maoxiaodou`、`universe_zhou_spring_autumn`）
   - code (unique)
   - name
   - description
   - type (enum: maoxiaodou/zhou_spring_autumn/other)
   - status (默认: "draft"，可选: "published")
   - createdAt (DateTime, 创建时间)
   - updatedAt (DateTime, 更新时间)

2) UniverseTheme（桥：子宇宙 ↔ 主题）
   - id (PK)
   - universeId (FK → Universe.id)
   - themeId (FK → Theme.id)
   - confidence (0..1)
   - note
   - unique(universeId, themeId)
   - [DECISION] 保留 confidence、note 字段用于表达该宇宙下的适配度与注记。

3) UniverseEmotion（桥：子宇宙 ↔ 情感）
   - id (PK)
   - universeId (FK → Universe.id)
   - emotionId (FK → Emotion.id)
   - weight (0..1)
   - unique(universeId, emotionId)
   - [DECISION] 保留 weight，用于表示该宇宙与某情感的关联强度（不替代 Emotion.intensity）。

## 子宇宙内实体（详细对应表）

### 周与春秋宇宙实体（来源：poeject_zhou_spring_autumn/data/content_draft/）

#### 1) ZhouPoem（诗歌综合表）
**数据来源：** `poem_archetypes.json` + `poems_draft/*.txt` 文件
- id (PK): 诗歌唯一标识
- title: 诗歌标题
- chapter: 所属章节 ("观我生", "雨，木冰", "是折枝")
- body: 诗歌正文内容（Json格式，支持结构化诗歌内容）
- filePath: 原始文件路径
- coreTheme: 核心主题
- problemSolved: 解决的问题
- spiritualConsolation: 精神慰藉
- classicalEcho: 经典回响
- poetExplanation: 诗人解释
- universeId (FK → Universe.id)
- subProjectId (FK → ZhouSubProject.id, nullable)

#### 2) ZhouProject（项目表）
**数据来源：** `projects.json`
- id (PK): 项目唯一标识 (project_zhou_spring_autumn_001)
- name: 项目名称 ("周与春秋练习")
- description: 项目描述 ("也是你的诗歌在场")
- poet: 诗人 ("吴任几")
- status: 状态 ("published")
- universeId (FK → Universe.id)

#### 3) ZhouSubProject（子项目表）
**数据来源：** `projects.json` → subProjects
- id (PK): 子项目唯一标识 (subproject_guanwosheng_001)
- projectId (FK → ZhouProject.id)
- name: 子项目名称 ("观我生", "雨，木冰", "是折枝")
- description: 子项目描述
- universeId (FK → Universe.id)

#### 4) ZhouQA（问答条目表）
**数据来源：** `questions.json`
- id (PK)
- chapter: 章节名 ("观我生", "雨，木冰", "是折枝")
- index (int): 题序 (1-4)
- question: 问题文本
- optionA: 选项A文本
- optionB: 选项B文本
- meaningA: 选项A含义
- meaningB: 选项B含义
- universeId (FK → Universe.id)
- subProjectId (FK → ZhouSubProject.id)

#### 5) ZhouMapping（结果映射表）
**数据来源：** `mappings.json` → units
- id (PK)
- chapter: 章节名 ("观我生", "雨，木冰", "是折枝")
- combination: 答案组合 ("1100", "0010", etc.)
- poemTitle: 对应诗歌标题
- meaning: 用户原型解读（可选，用于共笔功能）
- universeId (FK → Universe.id)
- unique(universeId, chapter, combination)

### 毛小豆宇宙实体（来源：poeject_maoxiaodou_universe/data/）

#### 6) MaoxiaodouPoem（诗歌文本表）
**数据来源：** `poems.json` + poems/ 目录下的 .txt 文件
- id (PK): 诗歌唯一标识 (maoxiaodou_story_2, shark_and_rock, etc.)
- title: 诗歌标题
- section: 所属部分 ("正篇", "前篇", "番外")
- summary: 内容摘要
- body: 诗歌正文 (从 .txt 文件读取)
- emotionalTone: 情感基调
- conflictExplicit: 显性冲突
- conflictImplicit: 隐性冲突
- metadata (json): 其他元数据
- universeId (FK → Universe.id)

#### 7) MaoxiaodouCharacter（角色表）
**数据来源：** `characters.json`
- id (PK): 角色唯一标识 (maoxiaodou, huashao, etc.)
- name: 角色名称
- aliases (json): 别名列表
- role: 角色定位
- description: 角色描述
- coreMotivation: 核心动机
- developmentArc (json): 发展轨迹
- notes: 备注
- category: 角色类别 ("core", "secondary", "tertiary")
- universeId (FK → Universe.id)

#### 8) MaoxiaodouCharacterRelation（角色关系表）
**数据来源：** `characters.json` → relationships
- id (PK)
- sourceCharacterId (FK → MaoxiaodouCharacter.id)
- targetCharacterId (FK → MaoxiaodouCharacter.id)
- relationType: 关系类型 ("朋友", "恋人", "同事", etc.)
- description: 关系描述
- strength: 关系强度 (0.0-1.0)
- universeId (FK → Universe.id)

#### 9) MaoxiaodouScene（场景表）
**数据来源：** `scenes.json`
- id (PK): 场景唯一标识
- scenario: 场景名称
- type: 场景类型 ("兄弟会社交", "办公室社交", etc.)
- description: 场景描述
- poemId (FK → MaoxiaodouPoem.id)
- universeId (FK → Universe.id)

#### 9.1) MaoxiaodouStanza（诗节表） [NEW]
**数据来源：** `stanzas.json`（基于 poems/*.txt 拆分生成）
- id (PK): 诗节唯一标识 (格式: `{poemId}_stanza_{index}`)
- poemId (FK → MaoxiaodouPoem.id): 所属诗歌
- index (Int): 诗节序号（从1开始）
- content (Text): 诗节正文内容
- universeId (FK → Universe.id)
- @@unique([poemId, index]): 同一诗歌内序号唯一

> **拆分规则**:
> - 正篇（7首）：按中文编号 `一、二、三...` 拆分
> - 前篇/番外（7首）：按连续空行拆分
> - 预计总数：约109个诗节

#### 9.2) MaoxiaodouStanzaSceneLink（诗节-场景桥表） [NEW]
**数据来源：** `stanza_scene_links.json`（AI推断 + 人工复核）
- id (PK): 关联唯一标识
- stanzaId (FK → MaoxiaodouStanza.id): 诗节ID
- sceneId (FK → MaoxiaodouScene.id): 场景ID
- universeId (FK → Universe.id)
- @@unique([stanzaId, sceneId]): 同一诗节-场景关联唯一

> **设计说明**:
> - Stanza 和 Scene 是多对多关系（一个诗节可能涉及多个场景，一个场景可能出现在多个诗节）
> - 通过 Scene 间接获取 Character 和 Terminology，避免重复标注

#### 10) MaoxiaodouTerminology（术语表）
**数据来源：** `terminology.json`
- id (PK): 术语唯一标识
- term: 术语名称
- category: 术语类别 ("poker", "symbol", "business", etc.)
- definition: 定义
- context: 使用语境
- usage: 用法示例
- universeId (FK → Universe.id)

#### 11) MaoxiaodouTheme（主题表）
**数据来源：** `themes.json`
- id (PK): 主题唯一标识 (male_community, identity_anxiety, etc.)
- name: 主题名称
- description: 主题描述
- manifestations (json): 表现形式列表
- universeId (FK → Universe.id)

#### 12) MaoxiaodouTimeline（时间线表）
**数据来源：** `timeline.json`
- id (PK): 时期唯一标识
- name: 时期名称
- timeRange: 时间范围
- description: 时期描述
- keyEvents (json): 关键事件列表
- universeId (FK → Universe.id)

#### 13) MaoxiaodouTheory（理论框架表）
**数据来源：** `theoretical_framework.json`
- id (PK): 理论唯一标识
- name: 理论名称
- concept: 理论概念
- description: 理论描述
- manifestations (json): 理论表现
- universeId (FK → Universe.id)

#### 14) MaoxiaodouReadingLayer（阅读层次表）
**数据来源：** `reading_experience.json`
- id (PK): 阅读层次唯一标识
- name: 层次名称
- description: 层次描述
- accessibility: 适用读者
- readingGoals (json): 阅读目标
- universeId (FK → Universe.id)

#### 15) MaoxiaodouMapping（映射关系表）
**数据来源：** `mappings.json`
- id (PK)
- sourceType: 源类型 ("character", "poem", "theme", etc.)
- sourceId: 源ID
- targetType: 目标类型
- targetId: 目标ID
- mappingType: 映射类型 ("theory_mapping", "section_mapping", etc.)
- universeId (FK → Universe.id)

#### 16) MaoxiaodouMetadata（元数据表）
**数据来源：** `metadata.json`
- id (PK)
- universeName: 宇宙名称
- version: 版本号
- description: 描述
- dataSources (json): 数据来源
- statistics (json): 统计信息
- relationships (json): 关系统计
- universeId (FK → Universe.id)

（可选统一诗歌表）Poem（主宇宙诗歌库，用于跨宇宙复用）
   - id (PK)
   - title (unique)
   - body
   - sourceUniverseId (nullable FK)
   - [DECISION] 当前阶段不启用；采用方案B通过视图/物化映射统一检索。

## 关系草案（明细对应）

### 主宇宙中立实体关系
- Emotion *..* Universe（UniverseEmotion）
- Theme *..* Universe（UniverseTheme）

### 周与春秋宇宙内部关系
- ZhouProject (1) → ZhouSubProject (N)
- ZhouSubProject (1) → ZhouQA (N)
- ZhouSubProject (1) → ZhouPoem (N)
- ZhouSubProject (1) → ZhouMapping (N)
- 所有周宇宙表 → Universe (N:1)

### 毛小豆宇宙内部关系
- MaoxiaodouPoem (1) → MaoxiaodouScene (N)
- MaoxiaodouPoem (1) → MaoxiaodouStanza (N) [NEW]
- MaoxiaodouStanza (N) ↔ MaoxiaodouScene (M) [through MaoxiaodouStanzaSceneLink] [NEW]
- MaoxiaodouCharacter (1) → MaoxiaodouCharacterRelation (N) [source]
- MaoxiaodouCharacter (1) → MaoxiaodouCharacterRelation (N) [target]
- MaoxiaodouTimeline (1) → MaoxiaodouPoem (N) [through timeline periods]
- MaoxiaodouTheory (1) → MaoxiaodouMapping (N) [through theory mappings]
- MaoxiaodouReadingLayer (1) → MaoxiaodouPoem (N) [through reading paths]
- 所有毛小豆表 → Universe (N:1)

### 跨宇宙关系
- ZhouMapping.poemTitle ↔ MaoxiaodouPoem.title（通过视图/物化表统一）
- ZhouPoem.coreTheme ↔ Theme.name（通过中立主题关联）
- MaoxiaodouTheme ↔ Theme（通过UniverseTheme桥表）

## 约束与策略
- 删除策略：Universe 禁止级联删除核心中立实体；桥表随 Universe 删除。
- 命名唯一性：Theme/Archetype/Emotion 在主宇宙内唯一；子宇宙内允许同名但通过 Universe 作用域约束。
- 校验：迁移后对照 JSON 源进行计数与引用完整性校验；关键桥表建立 `unique` 复合键。

## 迁移步骤（按文件对应关系）

### 第一阶段：基础架构
1) 初始化 Universe 表（两条记录）
   - `universe_zhou_spring_autumn` 
   - `universe_maoxiaodou`

2) 提取并合并中立实体
   - 从 `poem_archetypes.json` 提取周宇宙主题 → Theme 表
   - 从 `themes.json` 提取毛小豆主题 → Theme 表（去重合并）
   - 构建 UniverseTheme 桥表关联

### 第二阶段：周与春秋宇宙数据导入
3) **ZhouPoem** ← `poem_archetypes.json` + `poems_draft/*.txt`（48首诗的综合数据）
4) **ZhouProject** ← `projects.json`
5) **ZhouSubProject** ← `projects.json` → subProjects
6) **ZhouQA** ← `questions.json`（按章节分组）
7) **ZhouMapping** ← `mappings.json` → units

### 第三阶段：毛小豆宇宙数据导入
8) **MaoxiaodouPoem** ← `poems.json` + `poems/*.txt`（14首诗）
9) **MaoxiaodouCharacter** ← `characters.json`（30个角色）
10) **MaoxiaodouCharacterRelation** ← `characters.json` → relationships
11) **MaoxiaodouScene** ← `scenes.json`（29个场景）
12) **MaoxiaodouTerminology** ← `terminology.json`（125个术语）
13) **MaoxiaodouTheme** ← `themes.json`（6个主题）
14) **MaoxiaodouTimeline** ← `timeline.json`（3个时期）
15) **MaoxiaodouTheory** ← `theoretical_framework.json`（4个理论）
16) **MaoxiaodouReadingLayer** ← `reading_experience.json`（3个层次）
17) **MaoxiaodouMapping** ← `mappings.json`（各种映射关系）
18) **MaoxiaodouMetadata** ← `metadata.json`（统计信息）

### 第四阶段：关联与校验
19) 建立跨宇宙诗歌标题映射关系
20) 数据完整性校验：
    - 周宇宙：48首诗歌综合表 + 12个问题 + 48个映射组合
    - 毛小豆宇宙：14首诗 + 30个角色 + 125个术语 + 6个主题
21) 外键完整性检查
22) 典型查询测试（跨宇宙主题检索、诗歌映射等）

## Prisma 草案片段（按对应关系完整定义）
```prisma
// 主宇宙中立实体
model Theme { 
  id String @id  
  name String @unique 
  description String? 
  bridges UniverseTheme[] 
}

model Emotion { 
  id String @id  
  name String @unique 
  polarity String 
  intensity Int 
  bridges UniverseEmotion[] 
}

model Universe { 
  id String @id
  code String @unique 
  name String 
  type String 
  description String?
  status String @default("draft")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt @default(now())
  
  universeThemes UniverseTheme[] 
  universeEmotions UniverseEmotion[]
  // 周与春秋关系
  zhouPoems ZhouPoem[]
  zhouProjects ZhouProject[]
  zhouSubProjects ZhouSubProject[]
  zhouQAs ZhouQA[]
  zhouMappings ZhouMapping[]
  // 毛小豆关系
  maoxiaodouPoems MaoxiaodouPoem[]
  maoxiaodouCharacters MaoxiaodouCharacter[]
  maoxiaodouScenes MaoxiaodouScene[]
  maoxiaodouTerminology MaoxiaodouTerminology[]
  maoxiaodouThemes MaoxiaodouTheme[]
  maoxiaodouTimelines MaoxiaodouTimeline[]
  maoxiaodouTheories MaoxiaodouTheory[]
  maoxiaodouReadingLayers MaoxiaodouReadingLayer[]
  maoxiaodouMappings MaoxiaodouMapping[]
  maoxiaodouMetadata MaoxiaodouMetadata[]
  maoxiaodouStanzas MaoxiaodouStanza[] // [NEW]
  maoxiaodouStanzaSceneLinks MaoxiaodouStanzaSceneLink[] // [NEW]
}

// 桥表
model UniverseTheme { 
  id String @id  
  universeId String 
  themeId String 
  confidence Float? 
  note String? 
  universe Universe @relation(fields: [universeId], references: [id]) 
  theme Theme @relation(fields: [themeId], references: [id]) 
  @@unique([universeId, themeId]) 
}

model UniverseEmotion { 
  id String @id
  universeId String 
  emotionId String 
  weight Float? 
  universe Universe @relation(fields: [universeId], references: [id]) 
  emotion Emotion @relation(fields: [emotionId], references: [id]) 
  @@unique([universeId, emotionId]) 
}

model CrossUniverseContentLink {
  id String @id
  sourceUniverseId String
  sourceEntityType String
  sourceEntityId String
  targetUniverseId String
  targetEntityType String
  targetEntityId String
  mappingType String
  score Float?
  note String?
  createdAt DateTime @default(now())
  
  sourceUniverse Universe @relation("CrossUniverseSource", fields: [sourceUniverseId], references: [id])
  targetUniverse Universe @relation("CrossUniverseTarget", fields: [targetUniverseId], references: [id])
  
  @@unique([sourceUniverseId, sourceEntityType, sourceEntityId, targetUniverseId, targetEntityType, targetEntityId])
}

// 周与春秋宇宙表 (对应 poeject_zhou_spring_autumn/data/content_draft/)
model ZhouProject {
  id String @id
  name String
  description String?
  poet String?
  status String?
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
  subProjects ZhouSubProject[]
}

model ZhouSubProject {
  id String @id
  projectId String
  name String
  description String?
  universeId String
  project ZhouProject @relation(fields: [projectId], references: [id])
  universe Universe @relation(fields: [universeId], references: [id])
  qas ZhouQA[]
  poems ZhouPoem[]
  mappings ZhouMapping[]
}

model ZhouQA {
  id String @id
  chapter String
  index Int
  question String
  optionA String
  optionB String
  meaningA String
  meaningB String
  universeId String
  subProjectId String?
  universe Universe @relation(fields: [universeId], references: [id])
  subProject ZhouSubProject? @relation(fields: [subProjectId], references: [id])
}

model ZhouMapping {
  id String @id
  chapter String
  combination String
  poemTitle String
  meaning String? // 用户原型解读功能
  universeId String
  subProjectId String?
  universe Universe @relation(fields: [universeId], references: [id])
  subProject ZhouSubProject? @relation(fields: [subProjectId], references: [id])
  @@unique([universeId, chapter, combination])
}

model ZhouPoem {
  id String @id
  title String
  chapter String
  body Json? // 重构为JSON格式：支持结构化诗歌内容
  filePath String?
  coreTheme String?
  problemSolved String?
  spiritualConsolation String?
  classicalEcho String?
  poetExplanation String?
  universeId String
  subProjectId String?
  universe Universe @relation(fields: [universeId], references: [id])
  subProject ZhouSubProject? @relation(fields: [subProjectId], references: [id])
  @@unique([universeId, title])
}

// 毛小豆宇宙表 (对应 poeject_maoxiaodou_universe/data/)
model MaoxiaodouPoem {
  id String @id
  title String
  section String
  summary String?
  body String?
  emotionalTone String?
  conflictExplicit String?
  conflictImplicit String?
  metadata String? // JSON
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
  scenes MaoxiaodouScene[]
  stanzas MaoxiaodouStanza[] // [NEW] 诗节关联
  @@unique([universeId, title])
}

model MaoxiaodouCharacter {
  id String @id
  name String
  aliases String? // JSON
  role String?
  description String?
  coreMotivation String?
  developmentArc String? // JSON
  notes String?
  category String?
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
  sourceRelations MaoxiaodouCharacterRelation[] @relation("SourceCharacter")
  targetRelations MaoxiaodouCharacterRelation[] @relation("TargetCharacter")
  @@unique([universeId, name])
}

model MaoxiaodouCharacterRelation {
  id String @id
  sourceCharacterId String
  targetCharacterId String
  relationType String
  description String?
  strength Float?
  universeId String
  sourceCharacter MaoxiaodouCharacter @relation("SourceCharacter", fields: [sourceCharacterId], references: [id])
  targetCharacter MaoxiaodouCharacter @relation("TargetCharacter", fields: [targetCharacterId], references: [id])
  universe Universe @relation(fields: [universeId], references: [id])
}

model MaoxiaodouScene {
  id String @id
  scenario String
  type String?
  description String?
  poemId String
  universeId String
  poem MaoxiaodouPoem @relation(fields: [poemId], references: [id])
  universe Universe @relation(fields: [universeId], references: [id])
  stanzaLinks MaoxiaodouStanzaSceneLink[] // [NEW] 诗节关联
}

// [NEW] 诗节表 - 诗歌的最小叙事单元
model MaoxiaodouStanza {
  id String @id // 格式: {poemId}_stanza_{index}
  poemId String
  index Int // 诗节序号（从1开始）
  content String // 诗节正文内容
  universeId String
  poem MaoxiaodouPoem @relation(fields: [poemId], references: [id])
  universe Universe @relation(fields: [universeId], references: [id])
  sceneLinks MaoxiaodouStanzaSceneLink[] // 场景关联
  @@unique([poemId, index])
}

// [NEW] 诗节-场景桥表 - 多对多关系
model MaoxiaodouStanzaSceneLink {
  id String @id
  stanzaId String
  sceneId String
  universeId String
  stanza MaoxiaodouStanza @relation(fields: [stanzaId], references: [id])
  scene MaoxiaodouScene @relation(fields: [sceneId], references: [id])
  universe Universe @relation(fields: [universeId], references: [id])
  @@unique([stanzaId, sceneId])
}

model MaoxiaodouTerminology {
  id String @id
  term String
  category String?
  definition String?
  context String?
  usage String?
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
  @@unique([universeId, term])
}

model MaoxiaodouTheme {
  id String @id
  name String
  description String?
  manifestations String? // JSON
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
  @@unique([universeId, name])
}

model MaoxiaodouTimeline {
  id String @id
  name String
  timeRange String?
  description String?
  keyEvents String? // JSON
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
}

model MaoxiaodouTheory {
  id String @id
  name String
  concept String?
  description String?
  manifestations String? // JSON
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
  @@unique([universeId, name])
}

model MaoxiaodouReadingLayer {
  id String @id
  name String
  description String?
  accessibility String?
  readingGoals String? // JSON
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
}

model MaoxiaodouMapping {
  id String @id
  sourceType String
  sourceId String
  targetType String
  targetId String
  mappingType String
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
}

model MaoxiaodouMetadata {
  id String @id
  universeName String
  version String
  description String?
  dataSources String? // JSON
  statistics String? // JSON
  relationships String? // JSON
  universeId String
  universe Universe @relation(fields: [universeId], references: [id])
}
```

> 说明：上段已与生产环境 Prisma Schema (prisma/lugarden/schema.prisma) 完全对齐，于 2025-11-26 验证通过。
