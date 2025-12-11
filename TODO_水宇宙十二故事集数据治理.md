# 水宇宙·十二故事集 数据治理 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

为水宇宙数据库建立《十二个故事集》的数据模型，实现诗集文本的结构化存储。

**核心价值**：
1. **结构化存储**：将 txt 诗集转化为可查询的数据库记录
2. **层级组织**：12个故事集 → 120+首诗的清晰层级
3. **元数据提取**：地点、日期、人物标记等维度

**与毛小豆宇宙的差异**：
- 肖水诗歌为"小说诗"（4行左右），**无需 Stanza 拆分**
- 核心组织维度是**地理**而非角色/场景
- 数据结构更简洁

## 范围与约束

### 功能范围
- ✅ 新增 `ShuiCollection` 实体表（12条记录）
- ✅ 新增 `ShuiPoem` 实体表（120+条记录）
- ✅ 诗集文本程序化解析（识别故事集边界和诗歌边界）
- ⏳ 可选：AI 提取诗歌元数据（地点、人物、主题）

### 约束
- ❌ 暂不实现 Stanza 拆分（诗歌本身即最小叙事单元）
- ❌ 暂不实现 Scene/Character 复杂关联（与毛小豆不同）

### 技术约束
- 数据库：`lugarden.db`（主数据库）
- 数据格式：先生成 JSON，再导入数据库
- 迁移策略：数据治理完成后再执行 Prisma 迁移

## 两层约束框架

| 层级 | 载体 | 约束性质 | 作用 |
|------|------|----------|------|
| **设计层** | Schema 设计文档 | 强约束，但可调整 | 指导数据治理，表达设计意图 |
| **契约层** | `prisma/lugarden/schema.prisma` | 契约性约束，刚性 | 约束迁移和数据导入 |

**核心原则**：Schema.md 先于数据治理，Prisma.schema 后于数据治理。JSON 定稿后，设计才转化为契约。

---

## 任务列表

### **阶段A：设计**

#### - [x] 任务A.1：创建 Schema 设计文档（草稿）✅
- **核心思想**: 定义 ShuiCollection 和 ShuiPoem 的表结构
- 交付物：
  - `documentation/database/lugarden_schema_shui.md`（草稿）
- 验收标准：
  - 包含 `ShuiCollection` 表定义（id, name, nameEn, dedication, dateStart, dateEnd, regions, description, universeId）
  - 包含 `ShuiPoem` 表定义（id, collectionId, title, content, date, location, metadata, universeId）
  - 明确外键关系和唯一约束
  - 标记为"草稿"状态
- **风险评估**: 低风险，纯文档工作
- 预期改动文件：
  - `documentation/database/lugarden_schema_shui.md`（新建）
- 实际改动文件: `documentation/database/lugarden_schema_shui.md`
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤A.1.1：创建 Schema 设计文档
   - [x] 步骤A.1.2：定义 ShuiCollection 表结构
   - [x] 步骤A.1.3：定义 ShuiPoem 表结构
   - [x] 步骤A.1.4：定义关系和约束

#### - [x] 任务A.2：定义 JSON 数据结构 ✅
- **核心思想**: 定义数据治理输出的 JSON 格式
- 交付物：
  - `poeject_shui_universe/data/collections.json` 结构定义
  - `poeject_shui_universe/data/poems.json` 结构定义
- 验收标准：
  - JSON 结构与 Schema.md 设计一致
  - 包含必要的元数据（metadata）
- **风险评估**: 低风险，纯设计工作
- 预期改动文件：
  - 无（仅设计，实际文件在数据治理阶段创建）
- 实际改动文件: 与B阶段合并执行
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤A.2.1：定义 collections.json 结构
   - [x] 步骤A.2.2：定义 poems.json 结构（含tokens字段）

---

### **阶段B：数据治理 - 文本解析**

#### - [x] 任务B.1：解析诗集文本结构 ✅
- **核心思想**: 分析 `十二个故事集·肖水.txt` 的文本结构，确定解析规则
- 交付物：
  - 解析规则文档（可在本 TODO 中记录）
- 验收标准：
  - 确定12个故事集的边界标识（如"XXX故事集"）
  - 确定每首诗的边界标识（标题行 + 日期行）
  - 确定诗歌内容的提取规则
- **风险评估**: 低风险
- 预期改动文件：
  - 本 TODO 文件（记录解析规则）
- 实际改动文件: `poeject_shui_universe/scripts/parse-poems.js`
- 完成状态：✅ 2025-12-11
- 解析规则：
  - 故事集边界：`XXX故事集`标题行
  - 诗歌边界：日期行`YYYY.M.D`
  - 十之八九故事集特殊处理：5节分为5首
- 执行步骤：
   - [x] 步骤B.1.1：分析故事集边界模式
   - [x] 步骤B.1.2：分析诗歌边界模式
   - [x] 步骤B.1.3：记录解析规则

#### - [x] 任务B.2：生成 collections.json ✅
- **核心思想**: 提取12个故事集的元数据
- 交付物：
  - `poeject_shui_universe/data/collections.json`（初稿）
- 验收标准：
  - 包含12个故事集
  - 每个故事集包含：id, name, nameEn, dedication, dateStart, dateEnd, regions
- **风险评估**: 低风险
- 预期改动文件：
  - `poeject_shui_universe/data/collections.json`（新建）
- 实际改动文件: `poeject_shui_universe/data/collections.json`
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤B.2.1：提取12个故事集名称
   - [x] 步骤B.2.2：提取日期范围
   - [x] 步骤B.2.3：提取地域信息
   - [x] 步骤B.2.4：生成 collections.json

#### - [x] 任务B.3：生成 poems.json ✅
- **核心思想**: 解析所有诗歌，生成结构化数据
- 交付物：
  - `poeject_shui_universe/data/poems.json`（初稿）
- 验收标准：
  - 包含所有诗歌（预期120+首）
  - 每首诗包含：id, collectionId, title, content, date, location
  - 诗歌按故事集分组
- **风险评估**: 中风险，解析逻辑可能有边界情况
- 预期改动文件：
  - `poeject_shui_universe/data/poems.json`（新建）
  - `poeject_shui_universe/scripts/parse-poems.js`（新建，可选）
- 实际改动文件: 
  - `poeject_shui_universe/data/poems.json`（109首诗）
  - `poeject_shui_universe/scripts/parse-poems.js`
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤B.3.1：编写解析脚本或手动解析
   - [x] 步骤B.3.2：处理每个故事集的诗歌
   - [x] 步骤B.3.3：生成 poems.json

#### - [x] 任务B.4：用户复核数据 ✅
- **核心思想**: 人工检查解析结果，确保正确性
- 交付物：
  - `collections.json`（复核后）
  - `poems.json`（复核后）
- 验收标准：
  - 故事集数量正确（12个）
  - 诗歌数量正确
  - 诗歌内容完整，无丢失
  - 日期、标题正确
- **风险评估**: 低风险
- 预期改动文件：
  - `poeject_shui_universe/data/collections.json`（修正）
  - `poeject_shui_universe/data/poems.json`（修正）
- 实际改动文件: 
  - `poeject_shui_universe/data/poems.json`（合并NLP tokens）
  - `poeject_shui_universe/data/shui_NPL.json`（NLP分词数据）
  - `poeject_shui_universe/scripts/merge-npl-tokens.js`
  - `poeject_shui_universe/scripts/audit-poems.js`
- 完成状态：✅ 2025-12-11
- 复核结果：
  - 12个故事集 ✅
  - 109首诗（含十之八九5节）✅
  - 全部字段完整 ✅
  - NLP tokens已合并 ✅
- 执行步骤：
   - [x] 步骤B.4.1：检查故事集数量和名称
   - [x] 步骤B.4.2：抽查诗歌内容完整性
   - [x] 步骤B.4.3：修正发现的问题（十之八九拆分为5首）
   - [x] 步骤B.4.4：合并NLP tokens到poems.json
   - [x] 步骤B.4.5：执行审核脚本验证数据质量

---

### **阶段C：契约化**

#### - [x] 任务C.1：创建 Schema 设计文档（定稿）✅
- **核心思想**: 根据数据治理结果，创建正式的Schema定稿文档
- 交付物：
  - `documentation/database/lugarden_schema_251211-shui-universe.md`（定稿）
  - 参考格式：`lugarden_schema_251127-scene-character.md`
- 验收标准：
  - 反映数据治理中发现的调整需求
  - 移除"草稿"标记
- **风险评估**: 低风险
- 预期改动文件：
  - `documentation/database/lugarden_schema_251211-shui-universe.md`（新建）
- 实际改动文件: `documentation/database/lugarden_schema_251211-shui-universe.md`
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤C.1.1：复制251127版本为基础
   - [x] 步骤C.1.2：更新版本号为v3.4，表数量为27张
   - [x] 步骤C.1.3：添加水宇宙实体定义（ShuiCollection、ShuiPoem）
   - [x] 步骤C.1.4：添加水宇宙Prisma Schema（含tokens字段）
   - [x] 步骤C.1.5：更新文档状态为"定稿"

#### - [x] 任务C.2：更新 Prisma Schema ✅
- **核心思想**: 将定稿设计转化为 Prisma 契约
- 交付物：
  - `prisma/lugarden/schema.prisma`（新增 Shui* model）
- 验收标准：
  - `ShuiCollection` model 定义正确
  - `ShuiPoem` model 定义正确
  - 外键关系和唯一约束符合 Schema.md
  - `npx prisma validate` 通过
- **风险评估**: 低风险
- 预期改动文件：
  - `lugarden_universal/application/prisma/lugarden/schema.prisma`
- 实际改动文件: `lugarden_universal/application/prisma/lugarden/schema.prisma`
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤C.2.1：新增 ShuiCollection model
   - [x] 步骤C.2.2：新增 ShuiPoem model
   - [x] 步骤C.2.3：更新 Universe model 关系（添加shuiCollections、shuiPoems）
   - [x] 步骤C.2.4：执行 `npx prisma validate` 验证 ✅

---

### **阶段D：迁移与导入**

#### - [x] 任务D.1：执行数据库迁移 ✅
- **核心思想**: 在数据库中创建新表
- 交付物：
  - `prisma/lugarden/migrations/20251211091618_add_shui_universe/migration.sql`
- 验收标准：
  - 迁移脚本生成成功
  - 迁移执行成功
  - 数据库中新增两张空表
- **风险评估**: 低风险，增量式变更
- 预期改动文件：
  - `prisma/lugarden/migrations/...`（自动生成）
- 实际改动文件: `prisma/lugarden/migrations/20251211091618_add_shui_universe/`
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤D.1.1：执行 `npx prisma migrate dev --name add_shui_universe`
   - [x] 步骤D.1.2：检查生成的迁移脚本
   - [x] 步骤D.1.3：确认数据库表创建成功

#### - [x] 任务D.2：编写数据导入脚本 ✅
- **核心思想**: 将 JSON 数据导入数据库
- 交付物：
  - `poeject_shui_universe/scripts/import-to-db.js`
- 验收标准：
  - 读取 collections.json 和 poems.json
  - 使用 Prisma Client 批量插入
  - 处理重复数据（幂等性）
- **风险评估**: 低风险
- 预期改动文件：
  - `poeject_shui_universe/scripts/import-to-db.js`（新建）
- 实际改动文件: `poeject_shui_universe/scripts/import-to-db.js`
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤D.2.1：创建导入脚本
   - [x] 步骤D.2.2：实现 Collection 数据导入逻辑
   - [x] 步骤D.2.3：实现 Poem 数据导入逻辑
   - [x] 步骤D.2.4：添加Universe创建和验证

#### - [x] 任务D.3：执行数据导入 ✅
- **核心思想**: 运行脚本，将数据写入数据库
- 交付物：
  - 数据库中 12 条 Collection 记录
  - 数据库中 109 条 Poem 记录
- 验收标准：
  - 导入脚本执行成功
  - 数据条数与 JSON 一致
  - 外键关系正确
- **风险评估**: 低风险
- 预期改动文件：
  - 无（数据库变更）
- 实际改动文件: 数据库lugarden.db
- 完成状态：✅ 2025-12-11
- 执行步骤：
   - [x] 步骤D.3.1：执行导入脚本
   - [x] 步骤D.3.2：验证数据条数（12故事集+109首诗）
   - [x] 步骤D.3.3：外键关系正确

---

### **阶段E：验证**

#### - [ ] 任务E.1：数据完整性校验
- **核心思想**: 验证导入数据的完整性和正确性
- 交付物：
  - 验证脚本: `poeject_shui_universe/scripts/verify-data.js`
- 验收标准：
  - Collection 总数 = 12
  - Poem 总数 = JSON 记录数
  - 所有 Poem 都有 collectionId 关联
- **风险评估**: 低风险
- 预期改动文件：
  - `poeject_shui_universe/scripts/verify-data.js`（新建）
- 实际改动文件: 
- 完成状态：
- 执行步骤：
   - [ ] 步骤E.1.1：查询 Collection 总数并对比
   - [ ] 步骤E.1.2：查询 Poem 总数并对比
   - [ ] 步骤E.1.3：验证外键完整性
   - [ ] 步骤E.1.4：抽查数据内容正确性

#### - [ ] 任务E.2：关联关系验证
- **核心思想**: 验证 Collection-Poem 关联的查询可用性
- 交付物：
  - 验证查询示例
- 验收标准：
  - 可以从 Collection 查询到所有 Poem
  - 可以从 Poem 查询到所属 Collection
- **风险评估**: 低风险
- 预期改动文件：
  - 无
- 实际改动文件: 
- 完成状态：
- 执行步骤：
   - [ ] 步骤E.2.1：测试 Collection → Poem 查询
   - [ ] 步骤E.2.2：测试 Poem → Collection 查询

---

## 诗集结构预览

### 12个故事集

| 序号 | 故事集 | 首数 | 创作时间 | 地域 |
|------|--------|------|----------|------|
| 1 | 渤海故事集 | 10 | 2015.11-12 | 韩国、青岛、沧州、北京、天津 |
| 2 | 太原故事集 | 10 | 2015.12 | 山西太原 |
| 3 | 江东故事集 | 10 | 2016.1-6 | 泰山、重庆、杭州、厦门、青海湖 |
| 4 | 南岭故事集 | 10 | 2016.9 | 湖南南部 |
| 5 | 上海故事集 | 10 | 2016.10-2017.11 | 上海 |
| 6 | 云雀故事集 | 10 | 2019.6-7 | 南通、上海、杭州、深圳 |
| 7 | 末路故事集 | 10 | 2018.12-2020.1 | 南京、武汉、衡阳、西安、北京 |
| 8 | 南溪故事集 | 10 | 2020.2 | 湖南郴州（诗人故乡） |
| 9 | 自渡故事集 | 10 | 2020.11-12 | 疫情时期 |
| 10 | 十之八九故事集 | 5节 | 2020.4 | 长篇叙事 |
| 11 | 当昼有人客故事集 | 4首 | 2020.5-9 | 长篇叙事 |
| 12 | 譬如朝露故事集 | 10 | 2024.8 | 死亡/告别 |

---

## 注意事项

### 协作模式
- **用户（架构师）**：战略设计、质量控制、最终复核
- **AI（执行者）**：Schema 草稿、程序化处理、初稿生成
- **核心原则**：AI 处理 + 人工复核

### Git提交规范
- 按阶段提交：`feat(shui): 完成十二故事集数据治理`
- 原子提交：每个任务独立 commit
- 提交消息使用 `-F` 方式处理多行

---

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/YYYY-MM-DD_水宇宙十二故事集数据治理/`
- [ ] 将本TODO文件移动到更新目录
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git

---

## 当前状态
✅ 阶段A/B/C/D已完成 - 待执行阶段E验证

### 实际完成情况 (2025-12-11)
- **A.1** Schema设计文档 ✅ → `lugarden_schema_shui.md`（草稿）
- **A.2** JSON数据结构定义 ✅
- **B.1** 解析诗集文本结构 ✅ → 109首诗（含十之八九5节）
- **B.2** 生成collections.json ✅ → 12个故事集
- **B.3** 生成poems.json ✅ → 109首诗
- **B.4** 用户复核数据 ✅ → 合并NLP tokens，审核通过
- **C.1** Schema定稿 ✅ → `lugarden_schema_251211-shui-universe.md`（v3.4, 27张表）
- **C.2** Prisma Schema ✅ → `schema.prisma`（新增ShuiCollection、ShuiPoem，validate通过）
- **D.1** 数据库迁移 ✅ → `20251211091618_add_shui_universe`
- **D.2** 导入脚本 ✅ → `import-to-db.js`
- **D.3** 数据导入 ✅ → 12故事集 + 109首诗 + 1宇宙(universe_shui)

**额外完成**：
- NLP分词数据 → `shui_NPL.json`（已合并到poems.json的tokens字段）
- 解析脚本 → `scripts/parse-poems.js`
- 合并脚本 → `scripts/merge-npl-tokens.js`
- 审核脚本 → `scripts/audit-poems.js`

---

*本TODO基于陆家花园项目协作规范创建*
*创建日期：2025-12-11*
