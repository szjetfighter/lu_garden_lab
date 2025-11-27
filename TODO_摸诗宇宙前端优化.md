# 摸诗宇宙 前端优化 TODO（增强版）

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

优化摸诗宇宙的老虎机交互体验，使其具备真实老虎机的视觉反馈：
1. 列滚动动画 - 核心体验
2. 中奖符号高亮 - 结果反馈

## 范围与约束

- 仅修改前端组件，后端仅增加winningCells字段
- 不引入第三方动画库，使用CSS/Vue原生能力
- 保持现有功能不变

## 任务列表

> **任务编号规范**
> - 阶段11-27_A：核心交互优化
> - 阶段11-27_B：体验增强（可选）

---

### **阶段11-27_A：核心交互优化**

#### - [ ] 任务A.1：列滚动动画

- **核心思想**: 老虎机的核心体验是每列独立垂直滚动，依次停止
- 交付物：
  - SlotMachine.vue 滚动动画实现
- 验收标准：
  - 点击"摸诗"后，5列同时开始滚动
  - 滚动时显示随机符号流（模拟真实滚动）
  - 依次停止：第1列先停 → 第5列最后停（间隔约300ms）
  - 停止时有缓动效果
- **风险评估**: 低风险，纯前端CSS动画
- 预期改动文件（预判）：
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
  - `frontend_vue/src/modules/moshi/stores/moshiStore.ts`
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
  - [ ] 步骤A.1.1：设计滚动状态管理（spinning/stopping/stopped）
  - [ ] 步骤A.1.2：实现列滚动CSS动画
  - [ ] 步骤A.1.3：实现依次停止逻辑
  - [ ] 步骤A.1.4：验证动画流畅性

#### - [x] 任务A.2：中奖符号高亮

- **核心思想**: 中奖时视觉强调形成连线的格子
- 交付物：
  - 中奖格子高亮样式
  - 后端返回中奖格子坐标
- 验收标准：
  - 中奖后，连线格子发光/闪烁
  - 非中奖格子轻微变暗，形成对比
  - 一眼能看出哪些格子形成了连线
- **风险评估**: 低风险，后端仅增加字段
- 预期改动文件（预判）：
  - `application/src/services/moshiService.js`
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
  - `frontend_vue/src/modules/moshi/types/moshi.ts`
- 实际改动文件: 同上
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.2.1：后端spin接口增加winningCells字段
  - [x] 步骤A.2.2：前端根据坐标渲染高亮样式
  - [x] 步骤A.2.3：添加高亮动画（脉冲/发光）

#### - [x] 任务A.3：滚动动画优化

- **核心思想**: 确保滚动动画始终可见，不被API响应速度影响
- 交付物：
  - 优化后的滚动动画逻辑
- 验收标准：
  - 每次摸诗都能看到明显的滚动效果（至少1秒）
  - 滚动更流畅、更有老虎机感
- **风险评估**: 零风险，纯前端CSS/逻辑调整
- 预期改动文件（预判）：
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
- 实际改动文件:
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.3.1：增加MIN_SPIN_DURATION=1000ms最小滚动时间
  - [x] 步骤A.3.2：优化CSS动画（translateY固定像素值280px，周期0.08s）
  - [x] 步骤A.3.3：新增isAnimating状态，替代store.isSpinning控制动画锁
  - [x] 步骤A.3.4：按钮disabled状态改用isAnimating

#### - [x] 任务A.4：中奖符号显示一致性

- **核心思想**: 确保前端显示的中奖符号与实际产生stanza的符号一致
- 交付物：
  - 后端返回primarySymbol字段
  - 前端根据primarySymbol显示
- 验收标准：
  - 显示的中奖符号必须是实际用于查询stanza的符号
  - intersection模式和fallback模式都正确处理
- **风险评估**: 低风险，后端增加字段，前端调整显示逻辑
- 预期改动文件（预判）：
  - `application/src/services/moshiService.js`
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
  - `frontend_vue/src/modules/moshi/types/moshi.ts`
- 实际改动文件:
  - `application/src/services/moshiService.js` - selectStanza返回primarySymbol，spin构建primaryWinDetail
  - `frontend_vue/src/modules/moshi/types/moshi.ts` - 添加primaryWinDetail类型
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue` - 使用primaryWinDetail显示
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.4.1：后端selectStanza返回primarySymbol（intersection和fallback模式统一）
  - [x] 步骤A.4.2：后端spin根据primarySymbol从winDetails中查找并返回primaryWinDetail
  - [x] 步骤A.4.3：前端使用primaryWinDetail显示中奖符号

#### - [x] 任务A.5：高亮与显示优化

- **核心思想**: 解决高亮、显示时机、出处格式等问题
- 交付物：
  - 高亮只显示primarySymbol对应的格子
  - 移除"×N"列数显示
  - 奖励和stanza在滚动结束后才显示
  - stanza出处格式改为"诗名 · 一"
- 验收标准：
  - 高亮的格子必须只包含primarySymbol匹配的格子
  - 中奖提示简化为"🍻 社交"格式，不显示列数
  - 滚动动画完全结束后才显示中奖信息和stanza
  - stanza出处显示为"诗名 · 一"格式（中文数字：一、二、三...）
- **风险评估**: 低风险，后端过滤winningCells，前端调整显示时机和格式
- 预期改动文件（预判）：
  - `application/src/services/moshiService.js`
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
  - `frontend_vue/src/modules/moshi/components/StanzaDisplay.vue`（如存在）
- 实际改动文件:
  - `application/src/services/moshiService.js` - winDetail附带cells，primaryWinningCells，查询include poem.title和index
  - `frontend_vue/src/modules/moshi/types/moshi.ts` - 添加primaryWinningCells，Stanza添加index和poem
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue` - primaryWinningCells高亮，移除×N，动画结束后显示
  - `frontend_vue/src/modules/moshi/components/StanzaDisplay.vue` - 动画结束后显示，出处格式"诗名 · 一"
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.5.1：后端winDetail附带cells，返回primaryWinningCells
  - [x] 步骤A.5.2：前端使用primaryWinningCells高亮
  - [x] 步骤A.5.3：前端移除"×N"列数显示
  - [x] 步骤A.5.4：前端奖励/stanza显示时机改为动画结束后
  - [x] 步骤A.5.5：stanza出处格式改为"诗名 · 一"（numberToChinese函数）

---

### **阶段11-27_B：体验增强（可选）**

#### - [ ] 任务B.1：音效

- **核心思想**: 声音反馈增强沉浸感
- 交付物：
  - 滚动音效、停止音效、中奖音效
- 验收标准：
  - 音效与动画同步
  - 可静音
- **风险评估**: 零风险
- 预期改动文件（预判）：
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
  - `frontend_vue/public/sounds/` (新增)
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
  - [ ] 步骤B.1.1：准备音效文件
  - [ ] 步骤B.1.2：实现音效播放逻辑
  - [ ] 步骤B.1.3：添加静音开关

#### - [ ] 任务B.2：大奖特效

- **核心思想**: 4列/5列连线时给予额外惊喜
- 交付物：
  - 全屏撒花/光效动画
- 验收标准：
  - 仅大奖触发
  - 不阻塞后续操作
- **风险评估**: 零风险
- 预期改动文件（预判）：
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
  - [ ] 步骤B.2.1：实现撒花动画组件
  - [ ] 步骤B.2.2：集成到中奖流程

---

## 测试与验收

- [ ] 点击摸诗后，能明显看到5列依次滚动停止
- [ ] 中奖时，一眼能看出哪些格子形成了连线
- [ ] 构建无错误

## 更新日志关联

- **预计更新类型**: 功能更新
- **更新目录**: `documentation/changelog/2025-11-27_摸诗宇宙前端优化/`
- **更新日志文件**: `更新日志.md`
- **测试验证点**: 
  - [ ] 滚动动画流畅
  - [ ] 高亮效果明显
  - [ ] 无性能问题

## 注意事项

- 每完成一个任务都要测试功能
- 如果出现问题立即回滚
- 保持Git提交记录清晰

## 完成后的操作

- [ ] 创建更新目录：`documentation/changelog/2025-11-27_摸诗宇宙前端优化/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git

## 当前状态

🔄 进行中

---
*本模板基于陆家花园项目Git开发指南创建（增强版）*
