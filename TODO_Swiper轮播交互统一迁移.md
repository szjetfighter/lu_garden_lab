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
>
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
  - [X] 步骤A.1.1：安装swiper依赖
  - [X] 步骤A.1.2：替换grid布局为Swiper组件
  - [X] 步骤A.1.3：配置PC横向/手机纵向方向切换
  - [X] 步骤A.1.4：添加centeredSlidesBounds解决首尾留白
  - [X] 步骤A.1.5：样式调整（非活动卡片透明度、缩放、分页器）

#### - [x] 任务A.2：Portal Swiper体验优化与卡片自适应

- **核心思想**: 优化Swiper在不同设备上的表现，增强卡片description的自适应能力
- 交付物：
  - `UniversePortal.vue` Swiper优化
  - `UniverseCard.vue` description自适应字号
- 验收标准：
  - Swiper高度自适应（clamp响应式）
  - 边缘渐隐效果（mask-image）
  - viewport切换时Swiper重新渲染（:key绑定）
  - 卡片description根据宽度自适应字号
  - 背景色统一无色差
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`
  - `lugarden_universal/frontend_vue/src/modules/portal/components/UniverseCard.vue`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.2.1：添加:key实现viewport切换重渲染
  - [x] 步骤A.2.2：centeredSlidesBounds仅手机端生效
  - [x] 步骤A.2.3：Swiper高度clamp自适应（320px-480px）
  - [x] 步骤A.2.4：边缘渐隐效果（mask-image 2.5%）
  - [x] 步骤A.2.5：背景色统一为var(--bg-primary)
  - [x] 步骤A.2.6：移除卡片box-shadow消除色差
  - [x] 步骤A.2.7：引入FontSizeCalculator实现description自适应字号
  - [x] 步骤A.2.8：调整标题与Swiper间距为2rem

### **阶段12-13_B：各宇宙MainProjectSelection迁移**

#### - [x] 任务B.1：Zhou MainProjectSelection改为Swiper

- **核心思想**: 统一周与春秋宇宙的项目选择交互体验
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.2：Mao MainProjectSelection改为Swiper

- **核心思想**: 统一毛小豆宇宙的项目选择交互体验
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.3：Pending MainProjectSelection改为Swiper

- **核心思想**: 统一匿腻溺宇宙的项目选择交互体验
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/pending/views/MainProjectSelection.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.4：补齐样式与Portal统一

- **核心思想**: 确保三宇宙Swiper视觉效果与Portal完全一致
- 补齐内容:
  - 非活动slide透明度0.4 + scale(0.92)
  - 分页器样式（圆点+激活态变长）
  - 手机端垂直分页器位置
  - 容器高度clamp(320px, 50vh, 480px)
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/views/MainProjectSelection.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.5：补齐入场动画 + 恢复首页卡片阴影

- **核心思想**: 统一卡片入场动画效果
- 补齐内容:
  - 三宇宙卡片添加 `animate-fadeInUp` 入场动画
  - Pending卡片添加错落延迟（0.1s递增）
  - 恢复首页UniverseCard的box-shadow
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/portal/components/UniverseCard.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.6：Portal Swiper容器扩大 + 装饰图

- **核心思想**: 扩大Portal手机端Swiper容器，用装饰图填充空白区域
- **技术探索记录**:
  - `centeredSlidesBounds` 在容器高度 > 2倍卡片高度时，首尾卡片无法激活（Swiper设计限制）
  - 解决方案：移除 `centeredSlidesBounds`，改为纯居中显示 + 装饰图填充空白
- 改动内容:
  - 手机端容器高度：`50vh` → `65vh`（clamp 320px-620px）
  - 移除 `centeredSlidesBounds`，卡片始终居中显示
  - 添加 `lu-banner.svg` 伪元素装饰图，跟随滑动进度淡出
  - 监听 `@progress` 事件，通过CSS变量控制装饰图位置和透明度
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.7-B.8：Zhou/Mao/Pending 65vh统一 + 卡片样式统一

- **核心思想**: 三宇宙与Portal统一65vh高度，卡片padding统一为1.5rem
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/views/MainProjectSelection.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.9：创建unified-card-with-bg全局类

- **核心思想**: 提取重复的带背景图卡片样式到全局类，消除代码重复
- 改动内容:
  - 在 `components.css` 创建 `.unified-card-with-bg` 全局类
  - Zhou/Mao/Pending 使用新类，删除重复样式
  - UniverseCard 也重构使用 `unified-card-with-bg`
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/assets/styles/components.css`
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/portal/components/UniverseCard.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.10：四宇宙banner装饰图

- **核心思想**: 为四个宇宙添加各自的banner装饰图，跟随滑动淡出
- 改动内容:
  - 添加 `lu-banner.svg`、`zhou-banner.svg`、`mao-banner.svg`、`pending-banner.svg`
  - banner滚动逻辑简化为二值状态：第一张显示，其他隐藏
- 实际改动文件:
  - `lugarden_universal/frontend_vue/public/lu-banner.svg`
  - `lugarden_universal/frontend_vue/public/zhou-banner.svg`
  - `lugarden_universal/frontend_vue/public/mao-banner.svg`
  - `lugarden_universal/frontend_vue/public/pending-banner.svg`
  - 各模块MainProjectSelection.vue
- 完成状态：✅ 已完成

#### - [x] 任务B.11：About卡片改为Modal弹窗

- **核心思想**: 解决About卡片放入Swiper后无法拖动的问题
- **技术探索记录**:
  - 尝试 `touch-action: pan-y` - 失败
  - 尝试 `swiper-no-swiping` 类 - 失败
  - 最终方案：展开内容改为Modal弹窗，使用Teleport渲染到body
- 改动内容:
  - About卡片放入Swiper紧随项目卡片
  - 点击About打开Modal弹窗显示内容
  - 参考 `AboutModal.vue` 样式
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/zhou/001_lianxi/components/AboutExpandableCard.vue`
- 完成状态：✅ 已完成

#### - [x] 任务B.12：所有Modal隐藏滚动条

- **核心思想**: 统一所有Modal的滚动条样式，隐藏但保留滚动功能
- 改动内容:
  - 添加 `scrollbar-width: none`、`-ms-overflow-style: none`
  - 添加 `::-webkit-scrollbar { display: none }`
- 实际改动文件:
  - `AboutExpandableCard.vue`
  - `AboutModal.vue`
  - `PoemViewer.vue`
  - `ToxicologyReportModal.vue`
  - `AboutAuthor.vue` (fourseasons)
  - `AboutAuthor.vue` (toxicology)
  - `ProductModal.vue`
  - `MyWorksView.vue`
- 完成状态：✅ 已完成

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
