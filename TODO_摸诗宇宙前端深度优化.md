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
  - [X] 步骤A.1.1：SlotMachine.vue `.slot-machine` 添加宽度限制
  - [X] 步骤A.1.2：StanzaDisplay.vue `.stanza-display` 改为 48rem
  - [X] 步骤A.1.3：moshi/PoemViewer.vue `.poem-viewer-modal` 改为 48rem
  - [X] 步骤A.1.4：SlotMachine.vue 移除 `.win-info` 内嵌卡片
  - [X] 步骤A.1.5：新建 WinModal.vue 弹窗组件
  - [X] 步骤A.1.6：MoshiView.vue 集成 WinModal
  - [X] 步骤A.1.7：验证（TypeScript类型检查0错误，Vite构建成功）
  - [X] 步骤A.1.8（追加）：修复小屏幕宽度问题，width改为calc(100%-2rem)

##### 技术分析记录

**问题**：初次实现后，手机端卡片仍撑满屏幕，圆角不可见。

**根因分析**：

- `max-width: 48rem` (768px) 对430px手机屏幕不生效
- `width: 100%` 会填满父容器，导致无边距

**解决方案**：

- 普通卡片：`width: calc(100% - 2rem)` 强制留出左右各1rem边距
- 弹窗组件：无需修改，因为overlay有 `padding: 1rem`约束内部宽度

**弹窗vs普通卡片的区别**：

| 组件类型 | 边距来源                             | 处理方式           |
| -------- | ------------------------------------ | ------------------ |
| 弹窗     | overlay的padding约束子元素width:100% | 天然有边距         |
| 普通卡片 | 父容器无padding约束                  | 需用calc自己留边距 |

---

#### - [x] 任务A.2：诗歌字号自适应

- **核心思想**:
  - 现代诗以换行分行，单行过长自动换行会与诗人分行混淆
  - 根据最长行宽度自适应缩小字体，确保每行不自动换行
- **问题分析**:
  - `white-space: pre-wrap` 保留 `\n`但允许自动换行
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
- 实际改动文件:
  - `frontend_vue/src/shared/services/FontSizeCalculator.ts` - 新建字号计算服务
  - `frontend_vue/src/modules/moshi/components/StanzaDisplay.vue` - 集成字号自适应，white-space改为pre
  - `frontend_vue/src/modules/moshi/components/PoemViewer.vue` - 集成字号自适应，white-space改为pre
  - `frontend_vue/src/shared/services/PoemImageGenerator.ts` - 集成字号自适应
- 完成状态：✅ 已完成
- 执行步骤：
  - [X] 步骤A.2.1：新建FontSizeCalculator.ts服务
  - [X] 步骤A.2.2：StanzaDisplay.vue集成字号自适应
  - [X] 步骤A.2.3：moshi/PoemViewer.vue集成字号自适应
  - [X] 步骤A.2.4：PoemImageGenerator.ts集成字号自适应
  - [X] 步骤A.2.5：验证（TypeScript类型检查0错误，Vite构建成功）

---

#### - [x] 任务A.3：老虎机列级特效增强

- **核心思想**:
  - 参考Slotomania等行业标准老虎机，为滚动中的列添加视觉特效
  - 区分「滚动中」「停止瞬间」「静止」「中奖」四个状态的视觉层次
- **特效清单**:
  1. **运动模糊**: 滚动中的符号添加纵向blur，强化"在转"的质感
  2. **光带扫过（改进版）**: 脉冲式闪烁而非匀速扫过，更窄更亮更快（0.25s周期）
  3. **停止回弹增强**: overshoot + 多阶段bounce物理感
  4. **滚动时列边框发光（多色动态版）**: 5列各有不同主题色（金/青/粉/紫/橙）+ 亮度呼吸动画
  5. **中奖图标动态效果**: PNG图标scale放大 + rotateY 3D翻转效果
- 交付物：
  - SlotMachine.vue - 添加五种视觉特效
- 验收标准：
  - 滚动中的列与静止列有明显视觉区分
  - 光带效果是脉冲式闪烁，不是匀速扫过
  - 5列各有不同颜色的发光效果
  - 中奖图标有放大+旋转动画
  - TypeScript类型检查0错误，Vite构建成功
- **风险评估**: 低风险，纯CSS动画改动
- 预期改动文件：
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
- 实际改动文件:
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue` - 模板添加动态col-N类绑定 + CSS添加五种特效
- 完成状态：✅ 已完成
- 执行步骤：
  - [X] 步骤A.3.1：添加运动模糊效果（.spin-strip filter: blur(1.2px)）
  - [X] 步骤A.3.2：添加脉冲式光带闪烁效果（flash-pulse动画，0.25s周期，opacity脉冲）
  - [X] 步骤A.3.3：增强停止回弹效果（enhanced-bounce，5阶段overshoot+bounce）
  - [X] 步骤A.3.4：添加多色动态列边框发光（5列5色：金/青/粉/紫/橙，glow-pulse呼吸动画）
  - [X] 步骤A.3.5：添加中奖图标scale+rotateY动画（icon-celebrate，1.2s周期，±15°晃动+1.2x放大）
  - [X] 步骤A.3.6：验证（TypeScript类型检查0错误，Vite构建成功1.45s）

---

#### - [x] 任务A.4：中奖统计更新时机优化

- **核心思想**:
  - 统计数字应在动画结束后才更新，与视觉同步
  - 修改MoshiView的watch：监听isSpinning而非spinCount，解耦状态重置和统计更新
- 交付物：
  - moshiStore.ts - 添加pendingWin和commitStats方法
  - MoshiView.vue - watch改为监听isSpinning
  - SlotMachine.vue - 动画结束时调用commitStats
- 验收标准：
  - 统计在动画结束后更新
  - 弹窗正常显示
  - TypeScript类型检查0错误，Vite构建成功
- **风险评估**: 中风险，涉及状态管理逻辑
- 预期改动文件：
  - `frontend_vue/src/modules/moshi/stores/moshiStore.ts`
  - `frontend_vue/src/modules/moshi/views/MoshiView.vue`
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
- 实际改动文件:
  - `frontend_vue/src/modules/moshi/stores/moshiStore.ts` - 添加pendingWin和commitStats
  - `frontend_vue/src/modules/moshi/views/MoshiView.vue` - watch改为监听isSpinning开始
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue` - 动画结束调用commitStats
- 完成状态：✅ 已完成
- 执行步骤：
  - [X] 步骤A.4.1：store添加pendingWin和commitStats
  - [X] 步骤A.4.2：MoshiView watch改为监听isSpinning（从false→true时重置）
  - [X] 步骤A.4.3：SlotMachine动画结束时调用commitStats
  - [X] 步骤A.4.4：验证（TypeScript类型检查0错误，Vite构建成功1.20s）

---

#### - [x] 任务A.5：智能演出系统 - 动态延迟+分层特效

- **核心思想**:
  - 利用"结果已知"的事实，根据连线潜力动态调整每列停止延迟
  - 连上的列触发递进式视觉特效，越往后越fancy
  - 没连上的列快速结束，不浪费用户时间
- **动态延迟策略**（逐步揭示）:
  - 第1列：固定250ms
  - 第2列：有匹配→500ms，无→250ms
  - 第3列：有匹配→1000ms，无→250ms
  - 第4列：有匹配→2000ms+轻微抖动+两侧紫色光柱，无→250ms
  - 第5列：有匹配→3500ms+剧烈抖动+两侧超级赛亚人闪电，无→250ms
- **分层特效设计**（逐步揭示，每列停止后才检测下一列）:| 连线状态 | 触发条件    | 视觉特效                            |
  | -------- | ----------- | ----------------------------------- |
  | 无连线   | 该列断开    | 无光带无发光，快速停止(250ms)       |
  | 2连      | 第1-2列匹配 | 基础光带闪烁+边框发光(500ms)        |
  | 3连      | 第1-3列匹配 | 光带+边框呼吸增强(1000ms)           |
  | 4连      | 第1-4列匹配 | 两侧紫色光柱+轻微抖动(2000ms)       |
  | 5连      | 全部匹配    | 两侧超级赛亚人闪电+剧烈抖动(3500ms) |
  | 中奖格子 | 动画结束后  | 淡黄色背景(#fffbeb)+金边+图标动画   |
- 交付物：
  - SlotMachine.vue - 链式动态延迟+连线检测+分层特效+中奖高亮
- 验收标准：
  - 效果逐步揭示（每列停止后才检测下一列潜力）
  - 连上的列延迟大幅递增（最长3.5秒制造悬念）
  - 4连/5连有两侧气场特效
  - 没连上时快速结束（~1.25秒）
  - 中奖格子淡黄色背景
  - TypeScript类型检查0错误，Vite构建成功
- **风险评估**: 中高风险，涉及动画逻辑重构+新特效实现
- 预期改动文件：
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue`
- 实际改动文件:
  - `frontend_vue/src/modules/moshi/components/SlotMachine.vue` - 链式动态延迟+连线检测+分层特效+中奖高亮
- 完成状态：✅ 已完成
- 执行步骤：
  - [X] 步骤A.5.1：实现连线检测函数 - `calculateChainLevels`和 `hasChainPotential`
  - [X] 步骤A.5.2：实现链式动态延迟 - 逐步揭示，每列停止后检测下一列潜力
  - [X] 步骤A.5.3：实现条件性光带特效 - no-chain无光带，chain-1/2/3有光带
  - [X] 步骤A.5.4：实现4连特效 - 轻微抖动shake-light + 两侧紫色光柱star-side-pulse
  - [X] 步骤A.5.5：实现5连特效 - 剧烈抖动shake-heavy + 两侧超级赛亚人闪电lightning-crackle
  - [X] 步骤A.5.6：中奖格子淡黄色背景 - `.slot-cell.winning { background: #fffbeb }`
  - [X] 步骤A.5.7：验证（TypeScript类型检查0错误，Vite构建成功1.20s）

---

#### - [x] 任务A.6：中奖弹窗动态标题 - 根据连线数量显示不同特效

- **核心思想**:
  - 根据连线数量（3/4/5连）显示不同的中奖标题和动画效果
  - 配色与对应column特效色系一致，形成视觉统一
- **标题设计**:
  | 连线 | 标题 | 图标 | 配色 | 动画特效 |
  |------|------|------|------|----------|
  | 3连 | BIG WIN | 🎉 | 粉色(#ec4899) | 字符弹跳+呼吸发光 |
  | 4连 | MEGA WIIIN | ✦ | 紫色(#a855f7) | 字符弹跳+发光+抖动 |
  | 5连 | ULTRA WIIIIIIIN | ⚡ | 金色(#fbbf24) | 字符弹跳+强发光+剧烈抖动 |
- 交付物：
  - WinModal.vue - 动态标题逻辑+分级动画
- 验收标准：
  - 根据winDetail.columns显示不同标题
  - 字符逐个弹跳出现
  - 配色与slot machine特效一致
  - TypeScript类型检查0错误，Vite构建成功
- **风险评估**: 低风险，仅修改展示层
- 实际改动文件:
  - `frontend_vue/src/modules/moshi/components/WinModal.vue` - 动态标题+分级动画
  - `frontend_vue/src/modules/moshi/components/StanzaDisplay.vue` - 隐藏"查看全诗"按钮
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.6.1：添加winLevel computed根据columns返回标题/样式/图标
  - [x] 步骤A.6.2：模板改为动态渲染，字符逐个显示
  - [x] 步骤A.6.3：添加3连粉色/4连紫色/5连金色的CSS动画
  - [x] 步骤A.6.4：隐藏"查看全诗"按钮（v-if="false"）
  - [x] 步骤A.6.5：验证（TypeScript类型检查0错误，Vite构建成功1.31s）

---

## 更新日志关联

- **预计更新类型**: 前端优化
- **更新目录**: `documentation/changelog/2025-11-27_摸诗宇宙前端深度优化/`

## 完成后的操作

- [ ] 创建更新目录并移动为 `TODO.md`
- [ ] 创建 `更新日志.md`
- [ ] 提交所有更改到Git
