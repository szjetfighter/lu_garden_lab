# 摸诗宇宙入口 MVP开发 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

打造"摸诗"宇宙——陆家花园中属于陆家明的独立创作空间，通过老虎机式随机词语生成机制，为用户创作每日专属诗歌。

**核心价值**：
1. **双轨制架构**：与"周与春秋"的严肃哲学体验形成互补，提供轻盈、游戏化的日常诗歌生成
2. **诗学实验**：利用毛小豆宇宙的125个terminology作为词库，实现"具象-抽象-行动"三层诗学结构
3. **用户日常化**：提供低门槛的诗歌创作入口，增加用户与陆家花园的日常互动频率

**业务意义**：
- 增加Portal页面的内容丰富度（从1个宇宙入口扩展到2个）
- 建立AI诗人"陆家明"的人格化形象
- 为未来的多宇宙扩展提供架构范式

## 范围与约束

### 功能范围
- ✅ 老虎机式三框词语抽取（具象/抽象/行动）
- ✅ 基于Dify工作流的诗歌生成（意图分析+生成节点）
- ✅ 生成诗歌自动保存到用户作品集（my-works）
- ✅ Portal页面新增"摸诗"宇宙卡片

### MVP约束
- ❌ 暂不实现"每日唯一"限制（无次数限制）
- ❌ 暂不实现词语使用频率统计与平衡
- ❌ 暂不实现历史生成记录查看
- ❌ 暂不考虑移动端专门优化（继承Portal响应式）

### 技术约束
- 数据库：复用现有 `lugarden.db`（主数据库）
- 词库：直接使用 `MaoxiaodouTerminology` 表（125个词）
- 认证：复用现有Auth系统（需登录才能使用）
- Dify：需要创建新的工作流（独立于周与春秋）

---

## 任务列表

### **阶段11-06_A：数据架构与词库分组**

#### - [ ] 任务A.1：定义摸诗宇宙数据模型
- **核心思想**: 在现有数据库中新增"摸诗"宇宙相关表，支持词语抽取记录和生成诗歌存储
- 交付物：
  - `prisma/schema.prisma`（新增MoshiRoll和MoshiPoem模型）
  - 数据库迁移脚本
- 验收标准：
  - Prisma schema定义清晰，包含所有必要字段
  - 与User表、MaoxiaodouTerminology表正确关联
  - 支持记录用户抽取的词语和生成的诗歌
- **风险评估**: 低风险，增量式数据库变更，不影响现有功能
- 预期改动文件（预判）：
  - `lugarden_universal/application/prisma/schema.prisma`
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤A.1.1：设计MoshiRoll表（记录抽词行为）
     - 字段：id, userId, word1Id, word2Id, word3Id, createdAt
   - [ ] 步骤A.1.2：设计MoshiPoem表（记录生成诗歌）
     - 字段：id, userId, rollId, title, body, createdAt
     - 关联User表和MoshiRoll表
   - [ ] 步骤A.1.3：执行 `npx prisma migrate dev` 生成迁移

#### - [ ] 任务A.2：实现词库三层分组配置
- **核心思想**: 将125个terminology按"具象-抽象-行动"三层分组，为老虎机提供结构化词池
- 交付物：
  - `lugarden_universal/application/src/config/moshi-word-pools.js`（词池配置）
  - 词库分组JSON文档（供前端预览）
- 验收标准：
  - 具象层：48个词（location, consumer_brand, person, beauty等）
  - 抽象层：24个词（symbol, concept, event, group等）
  - 行动层：53个词（poker, business, internet_slang, gaming等）
  - 配置文件可被后端API直接引用
- **风险评估**: 零风险，纯配置文件
- 预期改动文件（预判）：
  - `lugarden_universal/application/src/config/moshi-word-pools.js`（新建）
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤A.2.1：创建词池配置文件，定义三层category映射
   - [ ] 步骤A.2.2：编写分组验证脚本，确认125个词全覆盖
   - [ ] 步骤A.2.3：导出JSON供前端参考（可选）

---

### **阶段11-06_B：后端API开发**

#### - [ ] 任务B.1：实现词语随机抽取API
- **核心思想**: 提供 `/api/moshi/roll` 端点，按三层结构随机抽取3个词语
- 交付物：
  - `lugarden_universal/application/src/routes/moshi.js`
  - API测试用例
- 验收标准：
  - GET `/api/moshi/roll` 返回3个词语（含完整definition, context, usage）
  - 框1从具象层抽取，框2从抽象层，框3从行动层
  - 需要用户登录（JWT验证）
  - 记录抽取行为到MoshiRoll表
- **风险评估**: 低风险，标准的CRUD操作
- 预期改动文件（预判）：
  - `lugarden_universal/application/src/routes/moshi.js`（新建）
  - `lugarden_universal/application/server.js`（注册路由）
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤B.1.1：创建moshi路由文件，实现随机抽取逻辑
   - [ ] 步骤B.1.2：从词池配置中按category分组查询
   - [ ] 步骤B.1.3：记录抽取结果到MoshiRoll表
   - [ ] 步骤B.1.4：使用curl测试API返回格式

#### - [ ] 任务B.2：实现诗歌生成触发API
- **核心思想**: 提供 `/api/moshi/generate` 端点，调用Dify工作流生成诗歌并保存
- 交付物：
  - `/api/moshi/generate` 端点实现
  - Dify工作流调用逻辑
- 验收标准：
  - POST `/api/moshi/generate` 接收3个词语ID
  - 查询词语的definition和context传递给Dify
  - 调用Dify工作流生成诗歌
  - 保存到MoshiPoem表并关联到用户作品集
  - 返回生成的诗歌内容
- **风险评估**: 中风险，依赖Dify工作流稳定性
- 预期改动文件（预判）：
  - `lugarden_universal/application/src/routes/moshi.js`
  - `lugarden_universal/application/src/services/difyService.js`（可能需要扩展）
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤B.2.1：设计Dify请求payload格式（包含3个词的完整信息）
   - [ ] 步骤B.2.2：实现Dify工作流调用（异步处理）
   - [ ] 步骤B.2.3：解析Dify返回，保存到MoshiPoem表
   - [ ] 步骤B.2.4：关联到用户作品集（my-works）

---

### **阶段11-06_C：前端老虎机UI开发**

#### - [ ] 任务C.1：创建老虎机组件（SlotMachine.vue）
- **核心思想**: 实现三框滚动动画效果，模拟真实老虎机视觉体验
- 交付物：
  - `lugarden_universal/frontend_vue/src/modules/moshi/components/SlotMachine.vue`
  - CSS动画效果
- 验收标准：
  - 三个框同时开始滚动
  - 点击"停止"按钮，三个框依次停止（有延迟效果）
  - 显示最终抽取的3个词语（中文term）
  - 动画流畅，视觉效果符合"轻盈诗学"美学
- **风险评估**: 中风险，CSS动画需要调试
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/moshi/components/SlotMachine.vue`（新建）
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤C.1.1：创建组件骨架，定义props和emits
   - [ ] 步骤C.1.2：实现滚动动画（CSS transform + transition）
   - [ ] 步骤C.1.3：实现停止逻辑（依次停止，间隔200ms）
   - [ ] 步骤C.1.4：调整视觉样式（字体、颜色、间距）

#### - [ ] 任务C.2：创建摸诗主页面（MoshiHome.vue）
- **核心思想**: 集成老虎机组件，处理词语抽取和诗歌生成的完整流程
- 交付物：
  - `lugarden_universal/frontend_vue/src/modules/moshi/views/MoshiHome.vue`
  - Pinia store（moshi.ts）
- 验收标准：
  - 页面包含老虎机组件和"开始摸诗"按钮
  - 点击按钮调用 `/api/moshi/roll` 获取3个词
  - 词语停止后显示"生成诗歌"按钮
  - 点击生成，调用 `/api/moshi/generate`，显示loading
  - 生成成功后显示诗歌内容（周与春秋格式）
  - 提供"再来一次"和"查看作品集"按钮
- **风险评估**: 低风险，标准的Vue组件开发
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/moshi/views/MoshiHome.vue`（新建）
  - `lugarden_universal/frontend_vue/src/modules/moshi/stores/moshi.ts`（新建）
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤C.2.1：创建Pinia store，定义state（words, poem, loading）
   - [ ] 步骤C.2.2：实现rollWords action（调用API）
   - [ ] 步骤C.2.3：实现generatePoem action（调用API）
   - [ ] 步骤C.2.4：创建主页面，集成老虎机和状态管理
   - [ ] 步骤C.2.5：添加loading和error状态处理

#### - [ ] 任务C.3：Portal页面新增摸诗入口
- **核心思想**: 在Portal主页添加"摸诗"宇宙卡片，作为支线入口
- 交付物：
  - 修改 `UniversePortal.vue`，新增摸诗卡片
  - 配置路由 `/moshi`
- 验收标准：
  - Portal页面显示两个宇宙卡片：周与春秋（主线）+ 摸诗（支线）
  - 摸诗卡片样式轻盈、视觉上与周与春秋区分
  - 点击卡片进入摸诗主页面
  - 移动端响应式布局正常
- **风险评估**: 低风险，增量式UI修改
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`
  - `lugarden_universal/frontend_vue/src/router/index.ts`
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤C.3.1：在数据库新增摸诗宇宙记录（status: published）
   - [ ] 步骤C.3.2：配置路由 `/moshi` → `MoshiHome.vue`
   - [ ] 步骤C.3.3：Portal API返回摸诗宇宙数据
   - [ ] 步骤C.3.4：测试Portal页面显示效果

---

### **阶段11-06_D：Dify工作流配置**

#### - [ ] 任务D.1：创建摸诗Dify工作流
- **核心思想**: 设计"意图分析+诗歌生成"的两节点工作流，生成周与春秋格式诗歌
- 交付物：
  - Dify工作流配置（可导出YAML）
  - 工作流ID和API密钥
- 验收标准：
  - 节点1（意图分析）：接收3个词的definition和context，生成情境描述
  - 节点2（诗歌生成）：基于情境描述，生成40-50字诗歌（周与春秋格式）
  - system_prompt明确陆家明的诗人人设
  - 输出格式：JSON（包含title和body）
- **风险评估**: 中风险，需要prompt调试
- 预期改动文件（预判）：
  - Dify平台配置（无本地文件）
  - `.env.local`（添加新的DIFY_MOSHI_WORKFLOW_ID）
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤D.1.1：在Dify创建新工作流"摸诗-诗歌生成"
   - [ ] 步骤D.1.2：配置意图分析节点（LLM，模型选择）
   - [ ] 步骤D.1.3：配置诗歌生成节点（LLM + RAG可选）
   - [ ] 步骤D.1.4：测试工作流，调整prompt
   - [ ] 步骤D.1.5：获取workflow ID，配置到.env.local

#### - [ ] 任务D.2：集成Dify工作流到后端
- **核心思想**: 在后端API中调用Dify工作流，处理异步响应
- 交付物：
  - Dify调用逻辑封装
  - 错误处理机制
- 验收标准：
  - 后端成功调用Dify工作流
  - 正确传递3个词的完整信息
  - 解析Dify返回的JSON格式诗歌
  - 处理超时和失败情况（降级方案可选）
- **风险评估**: 中风险，依赖外部服务稳定性
- 预期改动文件（预判）：
  - `lugarden_universal/application/src/services/difyService.js`
  - `lugarden_universal/application/src/routes/moshi.js`
- 实际改动文件: 
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤D.2.1：扩展difyService，添加调用摸诗工作流的方法
   - [ ] 步骤D.2.2：在moshi.js中集成调用逻辑
   - [ ] 步骤D.2.3：添加超时处理（30秒）
   - [ ] 步骤D.2.4：测试端到端流程（从抽词到生成）

---

## 测试与验收

### 功能测试
- [ ] 词语抽取功能：多次调用 `/api/moshi/roll`，确认3个词分别来自不同层
- [ ] 诗歌生成功能：测试5-10组不同词语组合，验证生成质量
- [ ] 用户作品集：确认生成的诗歌出现在my-works中
- [ ] 认证检查：未登录用户无法访问摸诗功能

### UI/UX测试
- [ ] 老虎机动画流畅度（Chrome/Firefox/Safari）
- [ ] PC端和移动端响应式布局
- [ ] Portal页面两个宇宙卡片的视觉层次

### 性能测试
- [ ] 词语抽取API响应时间 < 200ms
- [ ] Dify生成诗歌时间 < 15秒
- [ ] 前端loading状态清晰，用户不会焦虑等待

### 边界测试
- [ ] 词库为空时的降级处理
- [ ] Dify服务不可用时的错误提示
- [ ] 生成失败后的重试机制

---

## 更新日志关联
- **预计更新类型**: 功能更新（新宇宙入口）
- **更新目录**: `documentation/changelog/2025-11-06_摸诗宇宙入口MVP开发/`
- **更新日志文件**: `更新日志.md`
- **测试验证点**: 
  - [ ] 摸诗宇宙在Portal正常显示
  - [ ] 老虎机抽词和诗歌生成流程完整可用
  - [ ] 生成的诗歌保存到用户作品集

---

## 注意事项

### 架构原则
- 摸诗宇宙作为独立模块（`/modules/moshi`），不侵入周与春秋代码
- 词库复用毛小豆宇宙数据，但生成逻辑独立
- 遵循Portal模块的代码规范和样式系统

### 美学原则
- 摸诗的视觉风格应"轻盈"、"游戏化"，与周与春秋的"严肃"形成对比
- 老虎机动画不宜过度炫技，保持诗学气质
- 生成的诗歌格式与周与春秋一致（40-50字，克制、冷静）

### Git提交规范
- 按阶段提交：feat(moshi): 完成数据模型设计
- 原子提交：每个任务独立commit
- 分支策略：`feature/moshi-mvp` 分支开发，完成后PR到main

---

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/2025-11-06_摸诗宇宙入口MVP开发/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git（feature分支）
- [ ] 创建PR，进行代码审查
- [ ] 合并到main，部署到VPS

---

## 当前状态
🔄 进行中

---

## 附录：核心设计决策记录

### 1. 为什么叫"摸诗"而非"点石成金"？
- "摸诗"更贴近"摸鱼"的日常语境，降低严肃感
- 保留"诗"字，明确功能定位
- 朗朗上口，便于口头传播

### 2. 为什么是三框而非两框或四框？
- 三框对应"具象-抽象-行动"的完整叙事结构
- 符合人类认知习惯（场景+情绪+方式）
- 视觉上不拥挤，留有呼吸感

### 3. 为什么MVP不做"每日唯一"限制？
- 降低首次开发复杂度，快速验证核心体验
- 需要观察用户实际使用频率，再决定限制策略
- 可在后续版本迭代时加入

### 4. 为什么生成格式沿用周与春秋？
- 保持陆家花园整体诗学风格统一
- 40-50字的克制格式是西尔的美学标签
- 避免"游戏化"导致诗歌质量下降

---

*本TODO基于陆家花园项目协作规范创建*
*创建日期：2025-11-06*

