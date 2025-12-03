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

#### - [x] 任务C.5：内容排版与配图 ✅
- **核心思想**: 完善About卡片展开内容的排版和配图
- 实际改动文件：
  - `modules/zhou/lianxi/components/AboutExpandableCard.vue`
  - `modules/zhou/lianxi/assets/images/zhou_image1@0.3x.png` — 新增
  - `modules/zhou/lianxi/assets/images/zhou_image2@0.3x.png` — 新增
  - `modules/zhou/lianxi/assets/images/zhou_image3@0.3x.png` — 新增
- 改动内容：
  - 添加3张Feature配图（压缩至0.3x，总计约550KB）
  - 移除"◆ 三大核心体验 ◆"装饰性标题
  - Feature标题格式改为 "I · 占卜式阅读" 并居中
  - 统一间距到项目标准CSS变量（`var(--spacing-*)`）
  - 增大整体间距（content-inner用xl，其他关键间距用lg）
  - 统一字号（tagline、intro、feature-desc都用text-sm）
- 完成状态：✅ 已完成

#### - [x] 任务C.6：作者简介弹窗优化 ✅
- **核心思想**: 简化AboutModal为纯作者简介，移除重复的项目介绍内容
- 实际改动文件：
  - `modules/zhou/lianxi/components/AboutModal.vue`
  - `modules/zhou/lianxi/views/SubProjectSelection.vue`
  - `modules/zhou/lianxi/assets/images/author@0.3x.png` — 新增
- 改动内容：
  - AboutModal移除about variant，只保留作者简介功能
  - 添加作者照片（圆形居中，120x120px）
  - 更新作者简介文案（完整简历）
  - SubProjectSelection移除about入口，只保留"作者"点击弹窗
- 完成状态：✅ 已完成

#### - [x] 任务C.7：共笔视图Loading歌词滚动 ✅
- **核心思想**: 在共笔页面等待AI生成期间，展示吴任几其他诗歌的歌词式滚动
- 实际改动文件：
  - `modules/zhou/lianxi/views/GongBiView.vue`
- 改动内容：
  - 从store随机获取5首诗，按行歌词式滚动展示
  - 显示3行（前一行淡色、当前行高亮、后一行淡色）
  - 底部固定显示「章节 · 标题  吴任几」
  - 单行切换3秒，TransitionGroup平滑滚动动画
  - 诗歌切换时完整淡入淡出（800ms淡出 → 100ms停顿 → 800ms淡入）
  - 移除Logo闪烁动画
  - 添加`?debug=loading`调试入口
- 完成状态：✅ 已完成

#### - [x] 任务C.8：冗余Loading/Empty状态清理与动画统一 ✅
- **核心思想**: 移除页面切换时的冗余loading/empty状态闪烁，统一卡片动画风格
- 实际改动文件：
  - `modules/portal/views/UniversePortal.vue`
  - `modules/portal/components/UniverseCard.vue`
  - `modules/zhou/lianxi/views/MainProjectSelection.vue`
  - `modules/zhou/lianxi/views/SubProjectSelection.vue`
  - `modules/zhou/lianxi/views/QuizScreen.vue`
  - `modules/zhou/lianxi/views/ResultScreen.vue`
  - `modules/zhou/lianxi/views/ClassicalEchoScreen.vue`
- 改动内容：
  - 移除Portal和周模块的LoadingSpinner（API响应快，无需显示）
  - 移除EmptyState（避免数据加载前闪烁）
  - 统一Portal卡片动画为CSS class方式（animate-fadeInUp）
  - 移除ClassicalEcho页面1秒延迟和转圈动画
- 完成状态：✅ 已完成

#### - [x] 任务C.9：状态组件统一化重构 ✅
- **核心思想**: 统一EmptyState、LoadingSpinner、ErrorState三个状态组件的设计风格
- 实际改动文件：
  - `shared/components/EmptyState.vue`
  - `shared/components/LoadingSpinner.vue`
  - `shared/components/ErrorState.vue`
- 改动内容：
  - **Emoji → SVG**：EmptyState移除emoji icon prop，根据variant自动选择heroicons SVG
  - **卡片风格统一**：三组件均应用`unified-content-card`设计规范
  - **图标尺寸统一**：w-12 h-12
  - **动画统一**：使用animate-fadeInUp
  - **LoadingSpinner**：当showText时应用卡片样式
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
- ✅ B.2 图2 about字符弹窗（已移除，与B.1重复）
- ✅ B.3 图3作者可点击弹窗
- ✅ C.1 可展开卡片风格统一
- ✅ C.2 PC端宽度对齐
- ✅ C.3 折叠时透明效果
- ✅ C.4 标题文字优化
- ✅ C.5 内容排版与配图
- ✅ C.6 作者简介弹窗优化
- ✅ C.7 共笔视图Loading歌词滚动
- ✅ C.8 冗余Loading/Empty状态清理与动画统一
- ✅ C.9 状态组件统一化重构
- ✅ type-check 通过
- ✅ build 通过

---
*基于陆家花园项目TODO模板创建*
*创建时间：2025-12-02*
*阶段A+B完成时间：2025-12-03*
*阶段C完成时间：2025-12-03*
*关联资源：周与春秋练习 介绍2025.pdf*
