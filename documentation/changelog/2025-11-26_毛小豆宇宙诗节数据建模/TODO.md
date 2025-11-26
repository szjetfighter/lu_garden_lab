# 毛小豆宇宙诗节数据建模 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

为毛小豆宇宙数据库新增诗节（Stanza）粒度的数据建模，实现诗歌文本的细粒度拆分，并建立 Stanza 与 Scene 的多对多关联关系。

**核心价值**：
1. **粒度细化**：从诗歌（14首）下沉到诗节（109节），提供更精细的叙事单元
2. **关联打通**：通过 Stanza-Scene 桥接，实现"文本切片 ↔ 叙事空间"的双向查询
3. **展示基础**：为"摸诗宇宙"展示毛小豆宇宙场景奠定数据基础

**架构意义**：
- Stanza 是诗歌的最小叙事单元，109个选项比29个Scene提供更丰富的随机性
- 通过 Stanza → Scene → Character/Terminology 的链式关联，形成完整的"星座图"式数据网络

## 范围与约束

### 功能范围
- ✅ 新增 `MaoxiaodouStanza` 实体表（109条记录）
- ✅ 新增 `MaoxiaodouStanzaSceneLink` 桥表（Stanza ↔ Scene 多对多）
- ✅ 诗歌文本程序化拆分（正篇按编号，前篇/番外按空行）
- ✅ AI 推断 Stanza-Scene 映射关系

### 约束
- ❌ 暂不为 Stanza 新增独立的 Character/Terminology 关联（通过 Scene 间接获取）
- ❌ 暂不实现 Stanza 的诗学分析字段（narrativeFunction, emotionalTone 等）

### 技术约束
- 数据库：`lugarden.db`（主数据库）
- 数据格式：先生成 JSON，再导入数据库
- 迁移策略：数据治理完成后再执行 Prisma 迁移

## 两层约束框架

| 层级 | 载体 | 约束性质 | 作用 |
|------|------|----------|------|
| **设计层** | `lugarden_schema_251126-stanza.md` | 强约束，但可调整 | 指导数据治理，表达设计意图 |
| **契约层** | `prisma/lugarden/schema.prisma` | 契约性约束，刚性 | 约束迁移和数据导入 |

**核心原则**：Schema.md 先于数据治理，Prisma.schema 后于数据治理。JSON 定稿后，设计才转化为契约。

---

## 任务列表

### **阶段A：设计**

#### - [x] 任务A.1：创建 Schema 设计文档（草稿）
- **核心思想**: 复制现有 schema 文档，在其基础上新增 Stanza 相关表的设计，确保完整性和一致性
- 交付物：
  - `documentation/database/lugarden_schema_251126-stanza.md`（基于 lugarden_schema_251126.md 复制并扩展）
- 验收标准：
  - 包含原有所有表定义（保持一致性）
  - 新增 `MaoxiaodouStanza` 表定义（id, poemId, index, content, universeId）
  - 新增 `MaoxiaodouStanzaSceneLink` 桥表定义（id, stanzaId, sceneId）
  - 明确外键关系和唯一约束
  - 更新版本号和"草稿"状态标记
- **风险评估**: 低风险，纯文档工作
- 预期改动文件：
  - `documentation/database/lugarden_schema_251126-stanza.md`（cp lugarden_schema_251126.md 后扩展）
- 实际改动文件: 
- 完成状态：✅ 已完成
- 实际改动文件: `documentation/database/lugarden_schema_251126-stanza.md`
- 执行步骤：
   - [x] 步骤A.1.1：复制 `lugarden_schema_251126.md` → `lugarden_schema_251126-stanza.md`
   - [x] 步骤A.1.2：更新版本号和状态标记（草稿）
   - [x] 步骤A.1.3：在毛小豆宇宙部分新增 MaoxiaodouStanza 表设计
   - [x] 步骤A.1.4：新增 MaoxiaodouStanzaSceneLink 桥表设计
   - [x] 步骤A.1.5：更新关系图、统计信息和 Prisma 代码附录

#### - [x] 任务A.2：设计 JSON 数据结构
- **核心思想**: 定义数据治理输出的 JSON 格式，作为 Schema 的"中间态"
- 交付物：
  - `poeject_maoxiaodou_universe/data/stanzas.json` 结构定义
  - `poeject_maoxiaodou_universe/data/stanza_scene_links.json` 结构定义（或合并）
- 验收标准：
  - JSON 结构与 Schema.md 设计一致
  - 包含必要的元数据（metadata）
  - 便于后续数据导入脚本解析
- **风险评估**: 低风险，纯设计工作
- 预期改动文件：
  - 无（仅设计文档，实际文件在数据治理阶段创建）
- 实际改动文件: 通过生成脚本确定结构
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤A.2.1：参考 scenes.json 和 characters.json 的结构
   - [x] 步骤A.2.2：定义 stanzas.json 的 schema
   - [x] 步骤A.2.3：决定 stanza_scene_links 为独立文件

---

### **阶段B：数据治理 - Stanza 拆分**

#### - [x] 任务B.1：AI 生成 Stanza 数据
- **核心思想**: 程序化拆分14首诗歌为109个诗节，生成 JSON 初稿
- 交付物：
  - `poeject_maoxiaodou_universe/data/stanzas.json`（初稿）
- 验收标准：
  - 正篇（7首）：按中文编号 `一、二、三...` 拆分
  - 前篇/番外（7首）：按连续空行拆分
  - 每个 Stanza 包含：id, poemId, index, content, universeId
  - 拆分总数约109个（±5）
- **风险评估**: 低风险，规则明确
- 预期改动文件：
  - `poeject_maoxiaodou_universe/data/stanzas.json`（新建）
- 实际改动文件: 
  - `poeject_maoxiaodou_universe/data/stanzas.json`
  - `poeject_maoxiaodou_universe/scripts/generate-stanzas.js`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤B.1.1：编写拆分脚本 generate-stanzas.js
   - [x] 步骤B.1.2：处理正篇7首诗（按编号拆分）
   - [x] 步骤B.1.3：处理前篇3首诗（按空行拆分）
   - [x] 步骤B.1.4：处理番外4首诗（按空行拆分）
   - [x] 步骤B.1.5：生成完整 stanzas.json

**拆分结果统计（116个诗节）**：
| 诗歌 | 诗节数 | 部分 |
|------|--------|------|
| 毛小豆故事演绎 Ⅱ | 7 | 正篇 |
| 鲨鱼与岩石 | 9 | 正篇 |
| 金牌得主 | 9 | 正篇 |
| 毛小豆故事演绎 Ⅰ REMAKE | 7 | 正篇 |
| 新年快乐 | 6 | 正篇 |
| 拆庙 | 9 | 正篇 |
| 八方来财 | 6 | 正篇 |
| 钒 | 7 | 前篇 |
| 麦 | 7 | 前篇 |
| 馆 | 15 | 前篇 |
| 高级罐头装金枪鱼 | 5 | 番外 |
| 注意看 | 11 | 番外 |
| 你的兴趣是什么 | 8 | 番外 |
| 论字幕的必要性 | 10 | 番外 |

#### - [x] 任务B.2：用户复核 Stanza 拆分
- **核心思想**: 人工检查 AI 拆分结果，确保边界正确
- 交付物：
  - `stanzas.json`（复核修正后）
- 验收标准：
  - 每首诗的诗节数量正确
  - 诗节边界无误（不多切、不少切）
  - Content 内容完整（不丢失文本）
- **风险评估**: 低风险，数据量可控
- 预期改动文件：
  - `poeject_maoxiaodou_universe/data/stanzas.json`（修正）
- 实际改动文件: 
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤B.2.1：逐首诗检查诗节数量
   - [x] 步骤B.2.2：抽查诗节边界是否正确
   - [x] 步骤B.2.3：修正发现的问题
   - [x] 步骤B.2.4：标记 stanzas.json 为"已复核"

---

### **阶段C：数据治理 - StanzaSceneLink 映射**

#### - [x] 任务C.1：AI 生成 StanzaSceneLink 初稿
- **核心思想**: LLM 分析每个 Stanza 内容，推断其对应的 Scene
- 交付物：
  - `poeject_maoxiaodou_universe/data/stanza_scene_links.json`（初稿）
- 验收标准：
  - 每个 Stanza 至少关联1个 Scene
  - 关联依据：Stanza 文本内容 vs Scene 的 scenario/description/characters/terminology
  - 输出格式：[{stanzaId, sceneId}, ...]
- **风险评估**: 中风险，LLM 推断可能有误差
- 预期改动文件：
  - `poeject_maoxiaodou_universe/data/stanza_scene_links.json`（新建）
- 实际改动文件: `poeject_maoxiaodou_universe/data/stanza_scene_links.json`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤C.1.1：准备 LLM 输入（Stanza 文本 + 所有 Scene 定义）
   - [x] 步骤C.1.2：设计 Prompt（判断 Stanza 发生在哪个 Scene）
   - [x] 步骤C.1.3：逐首诗处理，生成映射关系
   - [x] 步骤C.1.4：合并为完整 stanza_scene_links.json

#### - [x] 任务C.2：用户复核 StanzaSceneLink 映射
- **核心思想**: 人工审核 AI 推断的映射关系，纠正错误
- 交付物：
  - `stanza_scene_links.json`（复核修正后）
- 验收标准：
  - 映射关系符合诗歌叙事逻辑
  - 无明显的错误映射（如：德扑场景映射到办公室诗节）
  - 覆盖率：所有 Stanza 都有至少1个 Scene 关联
- **风险评估**: 中风险，需要人工判断
- 预期改动文件：
  - `poeject_maoxiaodou_universe/data/stanza_scene_links.json`（修正）
- 实际改动文件: 
  - `poeject_maoxiaodou_universe/data/scenes.json`（新增 skating_training 场景）
  - `poeject_maoxiaodou_universe/data/stanza_scene_links.json`（修正 metadata 和 stanza_10 映射）
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤C.2.1：逐首诗检查映射关系
   - [x] 步骤C.2.2：识别并修正错误映射
   - [x] 步骤C.2.3：检查是否有遗漏（未关联的 Stanza）
   - [x] 步骤C.2.4：标记 stanza_scene_links.json 为"已复核"

**复核结果**：
- 场景审查：新增 `gold_medal_winner_skating_training` 场景（拆分健身房与滑冰训练）
- 链接审查：修正 `watch_out_stanza_10` 从 restroom 改为 office
- 数据统计：110个链接，30个场景，105高置信度+5中置信度

#### - [x] 任务C.3：JSON 定稿
- **核心思想**: 确认数据治理结果，为契约化做准备
- 交付物：
  - `stanzas.json`（定稿）
  - `stanza_scene_links.json`（定稿）
- 验收标准：
  - 两个 JSON 文件均通过复核
  - 数据结构符合 Schema.md 设计
  - 如有 Schema 调整需求，记录到任务C.3
- **风险评估**: 低风险
- 预期改动文件：
  - `poeject_maoxiaodou_universe/data/stanzas.json`（定稿标记）
  - `poeject_maoxiaodou_universe/data/stanza_scene_links.json`（定稿标记）
- 实际改动文件: 
  - `poeject_maoxiaodou_universe/data/stanzas.json`
  - `poeject_maoxiaodou_universe/data/stanza_scene_links.json`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤C.3.1：最终检查两个 JSON 文件
   - [x] 步骤C.3.2：如有 Schema 调整需求，记录备忘
   - [x] 步骤C.3.3：标记 JSON 为定稿

**定稿结果**：
- `stanzas.json`: 110个诗节，14首诗
- `stanza_scene_links.json`: 110个链接，30个场景
- Schema调整需求：无（数据结构符合设计）

---

### **阶段D：契约化**

#### - [x] 任务D.1：更新 Schema 设计文档（定稿）
- **核心思想**: 根据数据治理结果，更新 Schema.md 为定稿
- 交付物：
  - `documentation/database/lugarden_schema_251126-stanza.md`（定稿）
- 验收标准：
  - 反映数据治理中发现的调整需求
  - 移除“草稿”标记
  - 与即将创建的 Prisma schema 一致
- **风险评估**: 低风险
- 预期改动文件：
  - `documentation/database/lugarden_schema_251126-stanza.md`
- 实际改动文件: `documentation/database/lugarden_schema_251126-stanza.md`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤D.1.1：应用数据治理中发现的调整
   - [x] 步骤D.1.2：更新文档状态为“定稿”
   - [x] 步骤D.1.3：最终审核

#### - [x] 任务D.2：更新 Prisma Schema
- **核心思想**: 将定稿设计转化为 Prisma 契约
- 交付物：
  - `prisma/lugarden/schema.prisma`（新增两个 model）
- 验收标准：
  - `MaoxiaodouStanza` model 定义正确
  - `MaoxiaodouStanzaSceneLink` model 定义正确
  - 外键关系和唯一约束符合 Schema.md
  - `npx prisma validate` 通过
- **风险评估**: 低风险
- 预期改动文件：
  - `lugarden_universal/application/prisma/lugarden/schema.prisma`
- 实际改动文件: `lugarden_universal/application/prisma/lugarden/schema.prisma`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤D.2.1：新增 MaoxiaodouStanza model
   - [x] 步骤D.2.2：新增 MaoxiaodouStanzaSceneLink model
   - [x] 步骤D.2.3：添加关系定义（与 Poem, Scene, Universe）
   - [x] 步骤D.2.4：执行 `npx prisma validate` 验证 ✅

---

### **阶段E：迁移与导入**

#### - [x] 任务E.1：执行数据库迁移
- **核心思想**: 在数据库中创建新表
- 交付物：
  - `prisma/lugarden/migrations/20251126090328_add_stanza_tables/migration.sql`
- 验收标准：
  - 迁移脚本生成成功
  - 迁移执行成功
  - 数据库中新增两张空表
- **风险评估**: 低风险，增量式变更
- 预期改动文件：
  - `prisma/lugarden/migrations/...`（自动生成）
- 实际改动文件: `prisma/lugarden/migrations/20251126090328_add_stanza_tables/`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤E.1.1：执行 `npx prisma migrate dev --name add_stanza_tables`
   - [x] 步骤E.1.2：检查生成的迁移脚本
   - [x] 步骤E.1.3：确认数据库表创建成功

#### - [x] 任务E.2：编写数据导入脚本
- **核心思想**: 将 JSON 数据导入数据库
- 交付物：
  - `poeject_maoxiaodou_universe/scripts/import-stanzas.js`
- 验收标准：
  - 读取 stanzas.json 和 stanza_scene_links.json
  - 使用 Prisma Client 批量插入
  - 处理重复数据（幂等性）
- **风险评估**: 低风险
- 预期改动文件：
  - `scripts/import-stanzas.js`（新建）
- 实际改动文件: `poeject_maoxiaodou_universe/scripts/import-stanzas.js`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤E.2.1：创建导入脚本骨架
   - [x] 步骤E.2.2：实现 Stanza 数据导入逻辑
   - [x] 步骤E.2.3：实现 StanzaSceneLink 数据导入逻辑
   - [x] 步骤E.2.4：添加错误处理和日志

#### - [x] 任务E.3：执行数据导入
- **核心思想**: 运行脚本，将数据写入数据库
- 交付物：
  - 数据库中 110 条 Stanza 记录
  - 数据库中 110 条 StanzaSceneLink 记录
- 验收标准：
  - 导入脚本执行成功
  - 数据条数与 JSON 一致
  - 外键关系正确（可查询验证）
- **风险评估**: 低风险
- 预期改动文件：
  - 无（数据库变更）
- 实际改动文件: lugarden.db
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤E.3.1：执行导入脚本
   - [x] 步骤E.3.2：检查数据条数 (110/110)
   - [x] 步骤E.3.3：抽查外键关系 ✅

**导入结果**：
- MaoxiaodouStanza: 110 条
- MaoxiaodouStanzaSceneLink: 110 条
- 新增 MaoxiaodouScene: 1 条 (gold_medal_winner_skating_training)

---

### **阶段F：验证**

#### - [x] 任务F.1：数据完整性校验
- **核心思想**: 验证导入数据的完整性和正确性
- 交付物：
  - 验证脚本: `poeject_maoxiaodou_universe/scripts/verify-stanzas.js`
- 验收标准：
  - Stanza 总数 = JSON 记录数
  - StanzaSceneLink 总数 = JSON 记录数
  - 所有 Stanza 都有 poemId 关联
  - 所有 Link 的 stanzaId 和 sceneId 都有效
- **风险评估**: 低风险
- 预期改动文件：
  - 无
- 实际改动文件: `poeject_maoxiaodou_universe/scripts/verify-stanzas.js`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤F.1.1：查询 Stanza 总数并对比 (110/110)
   - [x] 步骤F.1.2：查询 StanzaSceneLink 总数并对比 (110/110)
   - [x] 步骤F.1.3：验证外键完整性 (孤儿记录: 0)
   - [x] 步骤F.1.4：抽查数据内容正确性 ✅

#### - [x] 任务F.2：关联关系验证
- **核心思想**: 验证 Stanza-Scene 关联的查询可用性
- 交付物：
  - 验证查询示例（在 verify-stanzas.js 中）
- 验收标准：
  - 可以从 Stanza 查询到关联的 Scene
  - 可以从 Scene 查询到关联的 Stanza
  - 可以通过 Scene 间接获取 Character 和 Terminology
- **风险评估**: 低风险
- 预期改动文件：
  - 无
- 实际改动文件: 无
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤F.2.1：测试 Stanza → Scene 查询 (shark_and_rock_stanza_1 → 德州扑克牌局)
   - [x] 步骤F.2.2：测试 Scene → Stanza 查询 (德州扑克牌局 → 7个诗节)
   - [x] 步骤F.2.3：测试 Stanza → Scene → Poem 链式查询 ✅

**验证结果**：
- 数据完整性: 100%
- 关联关系: 双向可查
- 链式查询: 正常工作
- 置信度分布: high 107 / medium 3

---

## 测试与验收

### 数据验证
- [ ] Stanza 拆分数量正确（预期约109条）
- [ ] 每个 Stanza 都有对应的 Scene 关联
- [ ] 外键关系完整，无孤儿记录

### 查询验证
- [ ] 从任意 Stanza 可查询到关联 Scene
- [ ] 从任意 Scene 可查询到关联 Stanza
- [ ] 从 Stanza 可间接获取 Characters 和 Terminology

### 一致性验证
- [ ] JSON 数据与数据库记录一致
- [ ] Prisma schema 与 Schema.md 文档一致

---

## 更新日志关联
- **预计更新类型**: 数据架构更新
- **更新目录**: `documentation/changelog/2025-11-26_毛小豆宇宙诗节数据建模/`
- **更新日志文件**: `更新日志.md`
- **测试验证点**: 
  - [ ] 两张新表创建成功
  - [ ] 数据导入完整
  - [ ] 关联查询正常

---

## 注意事项

### 协作模式
- **用户（架构师）**：战略设计、质量控制、最终复核
- **AI（执行者）**：Schema 草稿、程序化处理、LLM 推断、初稿生成
- **核心原则**：AI 处理 + 人工复核，而非人工标注

### 两层约束原则
- Schema.md 是"设计文档"，是人与AI之间的沟通工具，可调整
- Prisma.schema 是"契约"，是代码与数据库之间的约束，刚性
- JSON 定稿后，设计才转化为契约

### Git提交规范
- 按阶段提交：`feat(maoxiaodou): 完成Stanza数据治理`
- 原子提交：每个任务独立 commit
- 分支策略：`feature/maoxiaodou-stanza` 分支开发

---

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/2025-11-26_毛小豆宇宙诗节数据建模/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git
- [ ] 合并到main

---

## 当前状态
✅ 全部完成 - 毛小豆宇宙诗节数据建模已完成，待Git提交

---

## 附录：核心设计决策记录

### 1. 为什么选择 Stanza 而非其他粒度？
- Stanza（诗节）是诗歌的自然叙事单元
- 109个诗节比14首诗提供更丰富的随机性（适用于"摸诗宇宙"）
- 比行级拆分更有意义，保留完整的叙事片段

### 2. 为什么 Stanza 和 Scene 是多对多关系？
- 一个 Stanza 可能涉及多个 Scene（如：场景切换）
- 一个 Scene 可能出现在多个 Stanza（如：反复描写同一场景）
- 多对多关系需要桥表（MaoxiaodouStanzaSceneLink）

### 3. 为什么先数据治理，后迁移？
- 这是探索性项目，Schema 设计可能在数据治理中调整
- JSON 作为中间态，比数据库迁移更灵活
- 只有在 JSON 定稿后，才将设计"契约化"为 Prisma schema

### 4. 为什么 Stanza 不直接关联 Character/Terminology？
- Scene 已经包含了 characters[] 和 terminology[] 的标注
- 通过 Stanza → Scene 间接获取，避免重复标注
- 保持数据结构简洁，遵循 DRY 原则

---

*本TODO基于陆家花园项目协作规范创建*
*创建日期：2025-11-26*
