# 周与春秋 About功能 A/B Test TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

在周与春秋模块的三个位置添加"About"功能入口，作为A/B测试，评估哪种信息展示方式对用户最有效。

**测试目的**：
- 确定最佳的项目介绍入口位置和形式
- 收集吴任几对不同方案的反馈
- 为周与春秋宇宙封版做准备

**内容来源**：
- 吴任几PPT《周与春秋练习 介绍2025》
- 位置：`lu_garden_lab/周与春秋练习 介绍2025.pdf`

## 范围与约束

- **涉及页面**：`MainProjectSelection.vue`、`SubProjectSelection.vue`
- **弹窗规范**：复用 `modules/mao/moshi/components/PoemViewer.vue` 的设计模式
  - 简洁现代风格（白色渐变、圆角、模糊背景）
  - `overlay` + `modal` 结构
  - 右上角X关闭按钮 + 点击遮罩关闭
  - `z-index: 100`
- **封版策略**：A/B测试结束后，保留效果最好的方案，其余移除
- **回退方案**：如三个方案均不理想，全部移除

## 内容规划

### PPT简短版内容（用于About弹窗）

```
「周与春秋练习」
基于AI技术的第一部开放性诗集
命理学 ｜ 疗愈 ｜ 当代人的精神互助

吴任几历时五年的沉淀之作，融合中国原生信仰与现代生活体验。
引导用户从"阅读"到"创造"，从"感悟"到"存在"的完整美学旅程。

◆ 三大核心体验 ◆

I. 占卜式阅读
基于个人当下状态的说明书，每个人都可以成为周易大师

II. 瞬时共创
将灵感告诉AI，通过算法解构与再生，即时共创专属诗歌

III. 数字存在艺术
诗歌作为可留存或流转的数字痕迹，赋予永恒艺术生命
```

### 作者理念内容（用于图3弹窗）

```
关于诗人：吴任几

《周与春秋练习》是吴任几历时五年的沉淀之作。

◆ 创作理念 ◆
融合中国原生信仰（周易卦象）与现代生活体验，
打破传统阅读的边界，让诗歌成为"回答"而非"阅读物"。

◆ 陆家花园实现的Feature ◆
• 占卜式问答 — 通过问题匹配专属诗歌
• 诗人解读 — "最好不要点"的神秘按钮
• 瞬时共创 — AI驱动的即时诗歌生成（规划中）
```

## 任务列表

---

### **阶段A：共享组件准备**

#### - [x] 任务A.1：创建AboutModal通用组件 ✅
- **核心思想**: 基于PoemViewer模式，创建适用于About内容的弹窗组件
- 实际改动文件：
  - `modules/zhou/lianxi/components/AboutModal.vue` — 新建
  - `modules/zhou/lianxi/components/AboutExpandableCard.vue` — 新建
- 交付物：
  - 支持about/author两种variant
  - 符合项目弹窗动画规范
  - 支持Teleport到body
- 完成状态： 已完成

---

### **阶段B：三个位置的About入口实现**

#### - [x] 任务B.1：图1位置 — 可展开卡片 
- **核心思想**: 在MainProjectSelection页面的项目卡片下方，添加可展开的About卡片
- 实际改动文件：
  - `modules/zhou/lianxi/views/MainProjectSelection.vue`
  - `modules/zhou/lianxi/components/AboutExpandableCard.vue`
- 交付物：
  - 可展开/收起的卡片组件
  - 标题：“about周与春秋练习”
  - 展开后显示PPT简短版内容
- 完成状态： 已完成

#### - [x] 任务B.2：图2位置 — 标题旁“about”字符 
- **核心思想**: 在SubProjectSelection页面标题“周与春秋练习”旁添加可点击的“about”文字
- 实际改动文件：
  - `modules/zhou/lianxi/views/SubProjectSelection.vue`
- 交付物：
  - 可点击的“about”文字（样式：小号、灰色、虚线下划线）
  - 点击触发AboutModal (variant="about")
  - 弹窗内容：PPT简短版
- 完成状态： 已完成

#### - [x] 任务B.3：图3位置 — 作者可点击 
- **核心思想**: 将“作者：吴任几”改为可点击，展示作者理念
- 实际改动文件：
  - `modules/zhou/lianxi/views/SubProjectSelection.vue`
- 交付物：
  - “作者：吴任几”可点击（样式：hover变色+下划线、cursor指针）
  - 点击触发AboutModal (variant="author")
  - 弹窗内容：作者理念 + 陆家花园Feature说明
- 完成状态： 已完成

---

### **阶段C：样式修正与验证**

#### - [x] 任务C.1：可展开卡片风格统一 ✅
- **核心思想**: About可展开卡片需与项目卡片风格一致，使用全局 `unified-content-card` 类
- **问题**: 初版使用自定义灰色实底样式，与玻璃态卡片风格不统一
- 实际改动文件：
  - `modules/zhou/lianxi/components/AboutExpandableCard.vue`
- 改动内容：
  - 添加 `unified-content-card rounded-base` 类
  - 移除自定义 `background`、`border`、`box-shadow` 样式
  - 覆盖 `min-height: auto` 和 `padding: 0` 适应折叠状态
  - 边框线改为 `rgba(255, 255, 255, 0.3)` 与全局一致
- 完成状态：✅ 已完成

#### - [x] 任务C.2：PC端宽度对齐 ✅
- **核心思想**: About卡片需与项目卡片宽度一致
- **问题**: PC端About卡片使用 `max-w-2xl mx-auto` 固定672px，与 `grid-responsive` 的项目卡片宽度不一致
- 实际改动文件：
  - `modules/zhou/lianxi/views/MainProjectSelection.vue`
- 改动内容：
  - 移除 `max-w-2xl mx-auto`
  - 使用 `grid grid-responsive` 布局，使About卡片自动占用第1列宽度
- 完成状态：✅ 已完成

#### - [x] 任务C.3：折叠时透明效果 ✅
- **核心思想**: 未展开时About卡片完全透明，展开后显示玻璃态卡片
- 实际改动文件：
  - `modules/zhou/lianxi/components/AboutExpandableCard.vue`
- 改动内容：
  - 动态绑定class：`:class="{ 'unified-content-card': isExpanded, 'collapsed-transparent': !isExpanded }"`
  - 添加 `.collapsed-transparent` 样式：透明背景、无边框、无阴影
  - 添加 `transition: all 0.3s ease` 过渡动画
- 完成状态：✅ 已完成

#### - [x] 任务C.4：标题文字优化 ✅
- **核心思想**: 配合透明效果，调整标题样式使其更自然
- 实际改动文件：
  - `modules/zhou/lianxi/components/AboutExpandableCard.vue`
- 改动内容：
  - "about" → "About"（A大写）
  - 移除斜体 (`font-style: italic`)
  - 颜色调整为 `#6b7280`（text-gray-500，与"作者"文字一致）
  - 箭头图标颜色同步调整
- 完成状态：✅ 已完成

---

## 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 三个入口互相干扰 | 低 | 中 | 位置分散，不会同时出现 |
| 内容过长影响体验 | 中 | 中 | 精简PPT内容为简短版 |
| 弹窗样式不统一 | 低 | 低 | 复用ProductModal模式 |

## 当前状态
🟢 **阶段A+B+C已完成**

### 已完成
- ✅ A.1 AboutModal通用组件
- ✅ B.1 图1可展开卡片
- ✅ B.2 图2 about字符弹窗
- ✅ B.3 图3作者可点击弹窗
- ✅ C.1 可展开卡片风格统一
- ✅ C.2 PC端宽度对齐
- ✅ C.3 折叠时透明效果
- ✅ C.4 标题文字优化
- ✅ type-check 通过
- ✅ build 通过

---
*基于陆家花园项目TODO模板创建*
*创建时间：2025-12-02*
*阶段A+B完成时间：2025-12-03*
*阶段C完成时间：2025-12-03*
*关联资源：周与春秋练习 介绍2025.pdf*
