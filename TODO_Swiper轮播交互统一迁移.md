# Swiper轮播交互统一迁移 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标
将Portal及各宇宙模块的项目选择界面（如MainProjectSelection）统一迁移至Swiper轮播交互，提供一致的滑动体验：
- **PC端**：横向滑动，居中高亮
- **手机端**：纵向滑动，首尾贴边（centeredSlidesBounds）
- **交互增强**：鼠标滚轮、键盘导航、分页器

## 范围与约束
- 涉及模块：Portal、Zhou、Mao（未来可能包括Shui等）
- 依赖：swiper ^12.0.3
- 关键配置：`slides-per-view="auto"`, `centered-slides`, `centered-slides-bounds`
- 保持各模块视觉风格不变，仅替换交互组件

## 任务列表

> **任务编号规范**
> - 阶段12-13_A使用前缀"A"：任务A.1、任务A.2 …；步骤使用"A.1.x"的三级编号

---

### **阶段12-13_A：Portal页面Swiper迁移**

#### - [x] 任务A.1：Portal页面引入Swiper滑动体验
- **核心思想**: 替换原有的grid布局为Swiper轮播，提供更现代的滑动交互体验
- 交付物：
  - `UniversePortal.vue` Swiper集成
  - `package.json` 新增swiper依赖
- 验收标准：
  - PC端横向滑动，居中高亮，非活动卡片半透明+缩小
  - 手机端纵向滑动，首尾贴边无空白
  - 鼠标滚轮、键盘方向键可控制滑动
  - 分页器可点击切换
- **风险评估**: 低风险，纯前端UI改动
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`
  - `lugarden_universal/frontend_vue/package.json`
  - `lugarden_universal/frontend_vue/package-lock.json`
- 实际改动文件: 
  - `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`
  - `lugarden_universal/frontend_vue/package.json`
  - `lugarden_universal/frontend_vue/package-lock.json`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤A.1.1：安装swiper依赖
   - [x] 步骤A.1.2：替换grid布局为Swiper组件
   - [x] 步骤A.1.3：配置PC横向/手机纵向方向切换
   - [x] 步骤A.1.4：添加centeredSlidesBounds解决首尾留白
   - [x] 步骤A.1.5：样式调整（非活动卡片透明度、缩放、分页器）

---

### **阶段12-13_B：Zhou模块MainProjectSelection迁移**

#### - [ ] 任务B.1：Zhou模块MainProjectSelection引入Swiper
- **核心思想**: 将Zhou的项目选择界面迁移至Swiper，与Portal保持一致的交互体验
- 交付物：
  - `MainProjectSelection.vue` Swiper集成
- 验收标准：
  - 与Portal相同的滑动交互体验
  - 保持Zhou模块现有视觉风格
- **风险评估**: 低风险
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
- 实际改动文件: [待记录]
- 完成状态：🔄 待开始

---

### **阶段12-13_C：Mao模块MainProjectSelection迁移**

#### - [ ] 任务C.1：Mao模块MainProjectSelection引入Swiper
- **核心思想**: 将Mao的项目选择界面迁移至Swiper
- 交付物：
  - Mao模块MainProjectSelection的Swiper集成
- 验收标准：
  - 与Portal相同的滑动交互体验
  - 保持Mao模块现有视觉风格
- **风险评估**: 低风险
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue`
- 实际改动文件: [待记录]
- 完成状态：🔄 待开始

---

## 测试与验收
- 各模块需在PC和手机端分别测试滑动体验
- 验证鼠标滚轮、键盘、触摸滑动、分页器点击均正常工作
- 验证首尾卡片无异常留白

## 更新日志关联
- **预计更新类型**: 功能更新
- **更新目录**: `documentation/changelog/2025-12-13_swiper轮播交互迁移/`
- **更新日志文件**: `更新日志.md`
- **测试验证点**: 
  - [ ] Portal页面Swiper交互正常
  - [ ] Zhou模块Swiper交互正常
  - [ ] Mao模块Swiper交互正常

## 注意事项
- 每完成一个任务都要测试功能
- 如果出现问题立即回滚
- 保持Git提交记录清晰（原子提交、提交信息规范、功能分支）

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/2025-12-13_swiper轮播交互迁移/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git

## 当前状态
🔄 进行中（阶段A已完成，待提交）

---
*本模板基于陆家花园项目Git开发指南创建（增强版）*
