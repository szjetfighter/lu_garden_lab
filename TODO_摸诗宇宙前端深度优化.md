# 摸诗宇宙 前端深度优化 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

深度优化摸诗宇宙的视觉一致性和交互体验：
1. 卡片宽度统一 - 与zhou宇宙PoemViewer保持一致
2. 中奖弹窗化 - 提升奖励仪式感
3. 诗歌字号自适应 - 避免长行自动换行与诗人分行混淆

## 范围与约束

- 仅修改前端组件
- 以zhou/PoemViewer为视觉标准（max-w-3xl mx-auto = 48rem + 居中）
- 保持现有功能不变

## 任务列表

---

### **阶段A：视觉统一与交互优化**

#### - [x] 任务A.1：卡片宽度统一与中奖弹窗化

- **核心思想**: 
  1. 所有moshi模块卡片组件与zhou/PoemViewer宽度一致
  2. win-info从内嵌卡片改为弹窗，增强中奖仪式感
- **参考标准**: zhou/PoemViewer.vue 第2行 `class="poem-viewer max-w-3xl mx-auto"`
  - `max-w-3xl` = max-width: 48rem (768px)
  - `mx-auto` = margin: 0 auto（水平居中）
- 交付物：
  - SlotMachine.vue 宽度统一
  - StanzaDisplay.vue 宽度统一
  - moshi/PoemViewer.vue 宽度统一
  - win-info 改为弹窗组件
- 验收标准：
  - 手机端所有卡片两侧有留白，圆角可见
  - 桌面端卡片居中，宽度与zhou/PoemViewer一致
  - 中奖后显示弹窗，点击"查收奖品"后展示诗节
- **风险评估**: 低风险，纯前端样式和组件改动
- 预期改动文件（预判）：
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
  - `frontend_vue/src/modules/moshi/components/StanzaDisplay.vue`
  - `frontend_vue/src/modules/moshi/components/PoemViewer.vue`
  - `frontend_vue/src/modules/moshi/components/WinModal.vue`（新建）
  - `frontend_vue/src/modules/moshi/views/MoshiView.vue`
- 实际改动文件:
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue` - 宽度统一+移除win-info
  - `frontend_vue/src/modules/moshi/components/StanzaDisplay.vue` - 宽度统一
  - `frontend_vue/src/modules/moshi/components/PoemViewer.vue` - max-width改为48rem
  - `frontend_vue/src/modules/moshi/components/WinModal.vue` - 新建中奖弹窗组件
  - `frontend_vue/src/modules/moshi/views/MoshiView.vue` - 集成WinModal，添加showWin事件处理
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.1.1：SlotMachine.vue `.slot-machine` 添加宽度限制
  - [x] 步骤A.1.2：StanzaDisplay.vue `.stanza-display` 改为 48rem
  - [x] 步骤A.1.3：moshi/PoemViewer.vue `.poem-viewer-modal` 改为 48rem
  - [x] 步骤A.1.4：SlotMachine.vue 移除 `.win-info` 内嵌卡片
  - [x] 步骤A.1.5：新建 WinModal.vue 弹窗组件
  - [x] 步骤A.1.6：MoshiView.vue 集成 WinModal
  - [x] 步骤A.1.7：验证（TypeScript类型检查0错误，Vite构建成功）
  - [x] 步骤A.1.8（追加）：修复小屏幕宽度问题，width改为calc(100%-2rem)

### 技术分析记录

**问题**：初次实现后，手机端卡片仍撑满屏幕，圆角不可见。

**根因分析**：
- `max-width: 48rem` (768px) 对430px手机屏幕不生效
- `width: 100%` 会填满父容器，导致无边距

**解决方案**：
- 普通卡片：`width: calc(100% - 2rem)` 强制留出左右各1rem边距
- 弹窗组件：无需修改，因为overlay有`padding: 1rem`约束内部宽度

**弹窗vs普通卡片的区别**：
| 组件类型 | 边距来源 | 处理方式 |
|----------|----------|----------|
| 弹窗 | overlay的padding约束子元素width:100% | 天然有边距 |
| 普通卡片 | 父容器无padding约束 | 需用calc自己留边距 |

---

#### - [ ] 任务A.2：诗歌字号自适应

- **核心思想**: 
  - 现代诗以换行分行，单行过长自动换行会与诗人分行混淆
  - 根据最长行宽度自适应缩小字体，确保每行不自动换行
- **问题分析**:
  - `white-space: pre-wrap` 保留`\n`但允许自动换行
  - 读者无法区分：诗人的分行 vs 屏幕太窄导致的自动换行
- **解决方案**:
  - 新建 `shared/services/FontSizeCalculator.ts` 计算自适应字号
  - 测量最长行宽度，计算缩放比，应用到字号
  - 设置最小字号阈值，避免字体过小
- 交付物：
  - `shared/services/FontSizeCalculator.ts` - 新建字号计算服务
  - StanzaDisplay.vue - 集成字号自适应
  - moshi/PoemViewer.vue - 集成字号自适应
  - PoemImageGenerator.ts - 集成字号自适应
- 验收标准：
  - 长行诗歌不产生自动换行（在最小字号限制内）
  - 保留诗人原意的分行
  - 图片生成同样遵循此逻辑
- **风险评估**: 中风险，需处理字体加载时机和性能
- 预期改动文件（预判）：
  - `frontend_vue/src/shared/services/FontSizeCalculator.ts`（新建）
  - `frontend_vue/src/modules/moshi/components/StanzaDisplay.vue`
  - `frontend_vue/src/modules/moshi/components/PoemViewer.vue`
  - `frontend_vue/src/shared/services/PoemImageGenerator.ts`
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
  - [ ] 步骤A.2.1：新建FontSizeCalculator.ts服务
  - [ ] 步骤A.2.2：StanzaDisplay.vue集成字号自适应
  - [ ] 步骤A.2.3：moshi/PoemViewer.vue集成字号自适应
  - [ ] 步骤A.2.4：PoemImageGenerator.ts集成字号自适应
  - [ ] 步骤A.2.5：验证（TypeScript类型检查0错误，Vite构建成功）

---

## 更新日志关联

- **预计更新类型**: 前端优化
- **更新目录**: `documentation/changelog/2025-11-27_摸诗宇宙前端深度优化/`

## 完成后的操作

- [ ] 创建更新目录并移动为 `TODO.md`
- [ ] 创建 `更新日志.md`
- [ ] 提交所有更改到Git
