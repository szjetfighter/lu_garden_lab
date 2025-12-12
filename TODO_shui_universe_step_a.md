# 水宇宙开发 Step A (基础设施与L1门面) TODO (增强版)

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标
建立水宇宙（Shui Universe）的基础设施，并实现 L1 门户页面（标准化项目选择）与 L2 海图页面（岛屿与潮汐）。
**核心理念**：
- L1：复用标准化的 `MainProjectSelection`，展示水宇宙的项目入口（如“十二个故事集”）。
- L2（海图）：点击 L1 后的沉浸式体验，卡片即岛屿，背景即潮汐。

## 范围与约束
- **技术栈**：Vue 3 + TypeScript + UnoCSS + Prisma
## 范围与约束
- **架构对齐**：完全镜像 `zhou` 模块的层级结构：
  - Universe (L1) -> Project (L2) -> Experience (L3)
- **目录结构**：
  - `modules/shui/views/MainProjectSelection.vue` (L1)
  - `modules/shui/001_12tales/views/SubProjectSelection.vue` (L2)
  - `modules/shui/001_12tales/views/ShuiMap.vue` (L3 - 本次重点)

## 任务列表

### **阶段2025-12-12_A：基础设施搭建 (Infrastructure Setup)**

#### - [ ] 任务A.1：后端API与服务层实现
- **核心思想**: 建立后端数据通道，让前端能获取到水宇宙的故事集数据
- 交付物：
  - `lugarden_universal/application/services/shuiService.js` (或 .ts)
  - `lugarden_universal/application/routes/api/universes/shui.js` (或挂载点)
- 验收标准：
  - 调用 `GET /api/universes/shui/collections` 返回符合预期的 JSON 数组
  - 字段包含前端展示所需的：`name`, `description`, `poemCount`, `regions`, `dateStart`, `dateEnd`
- **风险评估**: 低风险
- 预期改动文件（预判）：
  - `lugarden_universal/application/server.js`
  - `lugarden_universal/application/services/shuiService.js` (新建)
- 实际改动文件: 
  - `lugarden_universal/application/src/services/shuiService.js`
  - `lugarden_universal/application/src/routes/universes.js`
  - `lugarden_universal/frontend_vue/src/stores/shuiStore.ts`
  - `lugarden_universal/frontend_vue/src/router/index.ts`
  - Views placeholders created.
- 完成状态：✅ 已完成
- 执行步骤：
    - [x] 步骤A.1.1：创建 `shuiService.js`，实现 `getAllCollections()` 方法，从 `ShuiCollection` 表读取数据
    - [x] 步骤A.1.2：创建/配置 API 路由，挂载 `/api/universes/shui/collections` 端点
    - [x] 步骤A.1.3：验证 API 响应格式 (Checked code)

#### - [x] 任务A.2：前端路由与状态管理
- **核心思想**: 搭建前端的基础页面结构和数据管理机制
- 交付物：
  - `router/index.ts` (更新)
  - `store/shuiStore.ts` (新建)
  - `views/shui` 目录结构
- 验收标准：
  - 访问 `/shui` 能进入 L1 页面
  - Pinia Store 能成功从 API 获取数据并存储
- **风险评估**: 低风险
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/router/index.ts`
  - `lugarden_universal/frontend_vue/src/stores/shuiStore.ts`
  - `lugarden_universal/frontend_vue/src/modules/shui/views/MainProjectSelection.vue` (新建)
  - `lugarden_universal/frontend_vue/src/modules/shui/views/ShuiMap.vue` (新建)
- 实际改动文件: [See above]
- 完成状态：✅ 已完成
- 执行步骤：
    - [x] 步骤A.2.1：在 `router/index.ts` 中注册 `/shui` (L1) 和 `/shui/map` (L2) 路由
    - [x] 步骤A.2.2：创建 `stores/shuiStore.ts`，实现 `fetchCollections` action
    - [x] 步骤A.2.3：创建模块目录结构 `src/modules/shui/views`

---

### **阶段2025-12-12_B：页面实现 (View Implementation)**

### **阶段2025-12-12_B：页面实现 (View Implementation)**

#### - [ ] 任务B.1：架构与路由铺设 (Hierarchy Setup)
- **核心思想**: 搭建通往 L3 核心体验的完整路由链
- 交付物：
  - `modules/shui/views/MainProjectSelection.vue` (L1)
  - `modules/shui/001_12tales/views/SubProjectSelection.vue` (L2)
- 验收标准：
  - L1 页面展示“十二个故事集”卡片
  - 点击卡片跳转至 L2 页面
  - L2 页面展示 3 个模式卡片（海图、扭蛋、碎片）
  - 点击“海图”跳转至 L3 页面
- **风险评估**: 低风险
- 预期改动文件：
  - `lugarden_universal/frontend_vue/src/router/index.ts`
  - `lugarden_universal/frontend_vue/src/modules/shui/**` (新建目录结构)
- 执行步骤：
    - [ ] 步骤B.1.1：创建目录结构 `modules/shui/001_12tales/views`
    - [ ] 步骤B.1.2：实现 L1 `MainProjectSelection.vue` (复用 `zhou` 模块，展示 Project 列表)
    - [ ] 步骤B.1.3：实现 L2 `SubProjectSelection.vue` (复用 `zhou` 模块，展示 Mode 列表)
    - [ ] 步骤B.1.4：配置路由：`/shui` -> `/shui/project/001_12tales` -> `/shui/project/001_12tales/map`

#### - [ ] 任务B.2：L3 海图实现 (Shui Map - Step A Focus)
- **核心思想**: 实现“海图与潮汐”的沉浸式页面（Step A 的最终落脚点）
- 交付物：
  - `modules/shui/001_12tales/views/ShuiMap.vue`
  - `modules/shui/components/ShuiCollectionCard.vue`
- 验收标准：
  - 背景为水波纹 (Tide)
  - 12个故事集展示为漂浮的岛屿 (Islands)
  - 悬停交互正常
- **风险评估**: 中风险 (视觉与动画效果)
- 执行步骤：
    - [ ] 步骤B.2.1：实现 `ShuiMap.vue` 基础容器
    - [ ] 步骤B.2.2：创建 `ShuiCollectionCard.vue`
    - [ ] 步骤B.2.3：实现数据渲染与动画

---

## 测试与验收
- [ ] 后端 API 测试：验证 `/api/universes/shui/collections`
- [ ] 路由测试：验证 `/shui` -> `/shui/map` 的跳转流程
- [ ] 视觉测试：验证 L2 的水波纹和卡片浮动效果

## 更新日志关联
- **预计更新类型**: [功能更新]
- **更新目录**: `documentation/changelog/2025-12-12_水宇宙StepA/`
- **更新日志文件**: `更新日志.md`
- **测试验证点**: 
  - [ ] L1 页面正常显示 "十二个故事集" 卡片
  - [ ] 点击卡片正确跳转到 L2
  - [ ] L2 页面正确渲染12个故事集卡片

## 注意事项
- 保持 L1 风格与全站统一
- L2 允许进行风格化的视觉实验

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/2025-12-12_水宇宙StepA/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 更新 `public/更新日志.md` 文件 (如有)
- [ ] 提交所有更改到Git
- [ ] 更新项目状态

## 当前状态
🔄 进行中
