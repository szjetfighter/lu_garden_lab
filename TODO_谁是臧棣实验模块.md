# 「谁是臧棣」实验模块 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

构建一个关于AI诗歌模仿与"光晕消逝"的社会学实验游戏模块。通过让用户判断诗歌是否为臧棣所写（实际全部由陆家明AI生成），探讨AI模仿能力、诗人风格的可编码性、以及"辨别力"的本质。

## 范围与约束

- 仅限pending宇宙下的实验模块
- 纯前端实现，无需后端支持
- 复用现有Vue3 + TypeScript + UnoCSS技术栈
- 20首预生成诗歌（模仿臧棣风格）
- 中途退出不保存进度

---

## 设计分析

### 1. 概念定位

一个关于AI诗歌模仿与"光晕消逝"的社会学实验游戏。

#### 1.1 核心机制

- 20首诗，全部由陆家明AI生成，模仿臧棣风格
- 用户逐首判断"是否是臧棣写的"
- 选"是" → 告知"不是"（错误）
- 选"不是" → 告知"正确"
- 无论怎么选，答案都指向"这不是臧棣"

#### 1.2 深层结构

- 用户以为自己是"裁判"，实际是"共谋者"
- 入口声明"你可能被冒犯"，但真正被冒犯的是臧棣
- 用户签署的是"共谋契约"，每一次点击都在参与对"诗人光晕"的消解实验

#### 1.3 惩罚机制

- 连续选"是"达5次 → 判定为"无法辨别" → 强制终止并踢出
- 冷却期60秒内无法重新进入
- 被惩罚者恰恰是在用选择投票给AI的模仿能力

---

### 2. 入口与声明设计

#### 2.1 第一层：声明页

```
┌─────────────────────────────────────────┐
│                                         │
│           ⚠️ 先锋实验模块               │
│                                         │
│  本模块是一个先锋性艺术实验。           │
│                                         │
│  其内容可能具有冒犯性。                 │
│                                         │
│  如果您选择继续，即表示您同意           │
│  承担被冒犯的可能。                     │
│                                         │
│              [ 继续 ]                   │
│                                         │
└─────────────────────────────────────────┘
```

**设计意图**：
- 制造悬念，不透露任何具体内容
- 预设"冒犯"期望，为后续反高潮铺垫
- 法律层面形成初步告知

#### 2.2 第二层：二次确认

```
┌─────────────────────────────────────────┐
│                                         │
│           📋 内容边界声明               │
│                                         │
│  本模块不涉及以下内容：                 │
│                                         │
│  ✗ 恐怖或血腥                          │
│  ✗ 宗教敏感                            │
│  ✗ 性别歧视                            │
│  ✗ 种族议题                            │
│  ✗ 色情或暴力                          │
│                                         │
│  但可能包含：                           │
│  ✓ 俚语、俗语                          │
│  ✓ 非传统的艺术表达                    │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  请手动输入以下文字确认进入：           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 我已仔细阅读并确认进入           │   │
│  └─────────────────────────────────┘   │
│                                         │
│              [ 进入 ]（输入匹配后激活）  │
│                                         │
└─────────────────────────────────────────┘
```

**设计意图**：
- 排除法暗示"冒犯"不在常规敏感领域，激发好奇
- 手动输入形成强契约感，筛选用户
- **关键：仍不透露模块内容**

#### 2.3 叙事诡计

用户签署的是"我同意被冒犯"的契约。

进入后发现：**被冒犯的不是我，是臧棣**。

用户从"受害者预期"转为"共谋者身份"。

---

### 3. 惩罚机制

#### 3.1 触发条件

连续选"是"达到5次。

#### 3.2 惩罚流程

```
连续第5次选"是"
         ↓
    触发终止页面（不可操作）
    显示3秒
         ↓
    强制跳转到 /pending
    同时写入冷却状态到 localStorage
         ↓
    用户尝试重新进入 /pending/whoiszd
         ↓
    检测到冷却期 → 显示倒计时页面
         ↓
    60秒后冷却结束 → 允许进入声明页
```

#### 3.3 被踢出提示页

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│    朋友，你似乎不具备                   │
│    鉴别诗人和机器的能力                 │
│                                         │
│    呼，真遗憾呢                         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
         │
         ↓ （3秒后自动跳转到 /pending）
```

**设计要点**：
- 无按钮，无法阻止跳转
- 嘲讽语气，与入口正式感形成落差

#### 3.4 冷却期倒计时页

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│    朋友，审美的事，急不来               │
│                                         │
│    嘻嘻，你说呢？                       │
│                                         │
│                                         │
│                  47                     │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**设计要点**：
- 实时倒计时（秒）
- 无操作按钮
- 倒计时归零后自动进入声明页

---

### 4. 模块位置与路由

**路径**：`modules/pending/whoiszd/`

**路由**：`/pending/whoiszd`

**理由**：
- 实验性项目，不宜挂在主宇宙
- pending目录已有先例（newarrival）
- 保持"地下"状态，可控曝光

---

### 5. 技术栈

| 层面 | 选型 |
|------|------|
| 前端框架 | Vue3 + TypeScript |
| 样式 | UnoCSS（复用项目设计系统） |
| 构建 | Vite |
| 数据存储 | 静态JSON（打包进前端） |
| 后端 | 无（纯前端） |
| 用户状态 | localStorage（仅冷却状态，游戏进度不保存） |

---

### 6. 数据结构

#### 6.1 诗歌数据

```typescript
// types/whoiszd.ts

interface ZangdiPoem {
  id: number              // 1-20
  title: string           // 诗歌标题
  body: string[]          // 诗歌正文（按行）
  generatedAt?: string    // 生成时间（用于最终揭示）
}

interface ZangdiPoemCollection {
  version: string
  generatedBy: string     // "陆家明"
  poems: ZangdiPoem[]
}
```

#### 6.2 用户游戏状态（内存中，不持久化）

```typescript
interface UserGameState {
  currentIndex: number           // 当前诗歌索引
  answers: ('yes' | 'no')[]      // 用户选择历史
  consecutiveYesCount: number    // 连续选"是"计数
  terminated: boolean            // 是否被强制终止
  completed: boolean             // 是否完成全部
  shuffleOrder: number[]         // 随机顺序
}
```

#### 6.3 冷却状态（localStorage持久化）

```typescript
// localStorage key: 'whoiszd_cooldown'

interface CooldownState {
  kickedAt: number       // 被踢出的时间戳（Date.now()）
  reason: 'consecutive'  // 踢出原因
}
```

---

### 7. 界面结构

#### 7.1 页面清单

| 页面 | 文件 | 功能 |
|------|------|------|
| 入口守卫 | EntryGuard.vue | 检测冷却状态，分发到对应页面 |
| 冷却倒计时 | CooldownView.vue | 显示剩余冷却时间 |
| 第一层声明 | DisclaimerView.vue | 先锋实验警告 |
| 第二层确认 | ConfirmView.vue | 手动输入确认 |
| 游戏主界面 | GameView.vue | 诗歌展示与选择 |
| 被踢出提示 | TerminatedView.vue | 3秒提示后强制跳转 |
| 结算揭示 | ResultView.vue | 统计与真相揭示 |

#### 7.2 游戏主界面

```
┌─────────────────────────────────────────┐
│                                         │
│            谁 是 臧 棣 ？               │
│              (7/20)                     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│           《诗歌标题在此》              │
│                                         │
│         第一行诗句                      │
│         第二行诗句                      │
│         第三行诗句                      │
│         ...                             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      [ 是 ]            [ 不是 ]         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    「不是。这首诗由AI生成。」           │
│                 或                      │
│    「正确。这首诗由AI生成。」           │
│                                         │
│            [ 下一首 ]                   │
│                                         │
└─────────────────────────────────────────┘
```

#### 7.3 结算揭示页

```
┌─────────────────────────────────────────┐
│                                         │
│              游 戏 结 束                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  你认为「是臧棣」的次数：8              │
│  你认为「不是」的次数：12               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│              真 相 揭 示                │
│                                         │
│  这20首诗，全部由陆家明AI生成。         │
│                                         │
│  没有一首是臧棣写的。                   │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  你选择「是」的8次，                    │
│  意味着你认为AI成功模仿了臧棣。         │
│                                         │
│  或者，你只是在猜。                     │
│                                         │
│  无论如何，感谢参与这场实验。           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    [ 再来一次 ]      [ 返回陆家花园 ]   │
│                                         │
└─────────────────────────────────────────┘
```

---

### 8. 完整交互流程

```
用户访问 /pending/whoiszd
         ↓
    ┌─ EntryGuard 检测冷却状态 ─┐
    │                           │
    ↓                           ↓
 无冷却                      有冷却
    │                           │
    ↓                           ↓
 DisclaimerView            CooldownView
 「先锋实验警告」          「审美的事，急不来」
    │                       倒计时显示
    ↓                           │
 点击 [ 继续 ]              倒计时归零
    │                           │
    ↓                           ↓
 ConfirmView              自动进入 DisclaimerView
 「手动输入确认」
    │
    ↓
 输入匹配 → [ 进入 ] 激活
    │
    ↓
 GameView
 展示诗歌 + [ 是 ] / [ 不是 ]
    │
    ├─ 选"不是" ─────────────────────────────┐
    │   反馈「正确」                         │
    │   consecutiveYesCount = 0              │
    │   进入下一首                           │
    │                                        │
    └─ 选"是" ──────────────────────────────┐│
        反馈「不是」                        ││
        consecutiveYesCount += 1            ││
        │                                   ││
        ├─ < 5 → 进入下一首 ────────────────┼┘
        │                                   │
        └─ = 5 → TerminatedView             │
                 「朋友，你似乎不具备...」   │
                 3秒后强制跳转 /pending      │
                 写入冷却状态                │
                                            │
    完成20首 ←──────────────────────────────┘
         ↓
    ResultView
    统计 + 真相揭示
         ↓
    [ 再来一次 ] → 清除状态，返回 DisclaimerView
    [ 返回陆家花园 ] → 跳转 /
```

---

### 9. 文件结构

```
modules/pending/whoiszd/
├── index.ts                        # 模块导出
├── types/
│   └── whoiszd.ts                  # 类型定义
├── data/
│   └── poems.json                  # 20首预生成诗歌
├── composables/
│   ├── useGameState.ts             # 游戏状态管理
│   └── useCooldown.ts              # 冷却状态管理
├── components/
│   ├── PoemDisplay.vue             # 诗歌展示组件
│   ├── ChoiceButtons.vue           # 是/不是按钮
│   ├── FeedbackMessage.vue         # 反馈消息
│   └── ManualInput.vue             # 手动输入确认组件
└── views/
    ├── EntryGuard.vue              # 入口守卫（冷却检测）
    ├── CooldownView.vue            # 冷却倒计时
    ├── DisclaimerView.vue          # 第一层声明
    ├── ConfirmView.vue             # 第二层确认
    ├── GameView.vue                # 游戏主界面
    ├── TerminatedView.vue          # 被踢出提示
    └── ResultView.vue              # 结算揭示
```

---

## 任务列表

> **任务编号规范**
> - 阶段12-04_A使用前缀"A"：任务A.1、任务A.2 …；步骤使用"A.1.x"的三级编号

---

### **阶段12-04_A：模块基础架构**

#### - [x] 任务A.1：模块目录结构与路由配置

- **核心思想**: 建立whoiszd模块的骨架，使其能够被Vue Router识别并正确加载。这是所有后续开发的前提——没有路由入口，所有页面都无法访问。
- 交付物：
  - `modules/pending/whoiszd/` 目录结构
  - `types/whoiszd.ts` 类型定义文件
  - `index.ts` 模块导出
  - 路由配置（注册到pending宇宙下）
  - `data/poems.json` 占位文件（含2-3首mock诗歌用于开发）
- 验收标准：
  - 访问 `/pending/whoiszd` 能够加载模块入口组件（可以是空白页）
  - TypeScript类型检查通过
  - 构建无报错
- **风险评估**: 低风险。纯结构性工作，不涉及复杂逻辑。
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/index.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/types/whoiszd.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/data/poems.json`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/views/EntryGuard.vue`
  - `lugarden_universal/frontend_vue/src/router/index.ts`（或对应的pending路由文件）
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/index.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/types/whoiszd.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/data/poems.json`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/views/EntryGuard.vue`
  - `lugarden_universal/frontend_vue/src/router/index.ts`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.1.1：创建模块目录结构
  - [x] 步骤A.1.2：编写类型定义（ZangdiPoem, UserGameState, CooldownState）
  - [x] 步骤A.1.3：创建占位poems.json（3首mock诗歌）
  - [x] 步骤A.1.4：创建EntryGuard.vue入口组件（含冷却检测和声明页）
  - [x] 步骤A.1.5：注册路由到pending宇宙
  - [x] 步骤A.1.6：验证路由可访问并构建通过

#### - [x] 任务A.2：完整游戏流程实现

- **核心思想**: 实现完整的游戏流程，包括入口声明、手动确认、诗歌展示、答案判定、惩罚机制和结算揭示。
- 交付物：
  - `composables/useCooldown.ts` 冷却状态管理
  - `composables/useGameState.ts` 游戏状态管理
  - `views/ConfirmView.vue` 第二层确认页（手动输入）
  - `views/GameView.vue` 游戏主界面
  - `views/TerminatedView.vue` 惩罚/终止页
  - `views/ResultView.vue` 结算揭示页
  - 更新 `views/EntryGuard.vue` 整合流程
- 验收标准：
  - 完整游戏流程可走通（声明→确认→游戏→结算）
  - 连续5次选"是"触发惩罚机制
  - 冷却期60秒倒计时正常工作
  - TypeScript类型检查通过
  - 构建无报错
- **风险评估**: 低风险。
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/composables/useCooldown.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/composables/useGameState.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/views/ConfirmView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/views/GameView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/views/TerminatedView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/views/ResultView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/views/EntryGuard.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/index.ts`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.2.1：创建useCooldown.ts（冷却状态管理）
  - [x] 步骤A.2.2：创建useGameState.ts（游戏状态管理）
  - [x] 步骤A.2.3：创建ConfirmView.vue（第二层确认页）
  - [x] 步骤A.2.4：创建GameView.vue（游戏主界面）
  - [x] 步骤A.2.5：创建TerminatedView.vue（惩罚终止页）
  - [x] 步骤A.2.6：创建ResultView.vue（结算揭示页）
  - [x] 步骤A.2.7：更新EntryGuard.vue整合流程
  - [x] 步骤A.2.8：更新index.ts模块导出
  - [x] 步骤A.2.9：验证TypeScript类型检查通过
  - [x] 步骤A.2.10：验证构建成功

#### - [x] 任务A.3：臧棣风格诗歌生成与研究文档

- **核心思想**: 研究臧棣诗歌风格特征，生成20首模仿诗歌作为游戏内容。
- 交付物：
  - `docs/臧棣研究报告.md` 臧棣诗学研究文档
  - `data/poems.json` 20首臧棣风格诗歌
- 验收标准：
  - 研究报告覆盖臧棣的核心标签、技法分类、代表作
  - 20首诗歌采用臧棣标志性命名法（XX入门/丛书/协会/简史）
  - 每首诗有"XX不XX"的收尾句式
  - JSON格式正确，构建通过
- **风险评估**: 低风险。
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/docs/臧棣研究报告.md`
  - `lugarden_universal/frontend_vue/src/modules/pending/whoiszd/data/poems.json`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.3.1：使用Firecrawl搜索臧棣诗歌研究资料
  - [x] 步骤A.3.2：整理研究报告（身份、特征、技法、代表作）
  - [x] 步骤A.3.3：创建臧棣研究报告.md
  - [x] 步骤A.3.4：生成20首臧棣风格诗歌
  - [x] 步骤A.3.5：更新poems.json并修复日期

---

### **阶段12-05_B：pending宇宙整合与UI规范化**

#### - [x] 任务B.1：pending宇宙L0/L1入口配置与文案调整

- **核心思想**: 将whoiszd模块正式整合到pending宇宙的导航体系中，配置L0门户入口和L1宇宙选择页面，并调整各入口的文案风格。
- 交付物：
  - `portal/stores/portal.ts` 添加pending宇宙到L0门户
  - `pending/views/MainProjectSelection.vue` L1入口页面（统一命名）
  - `pending/views/index.ts` 更新导出
  - `router/index.ts` 更新pending路由
  - `pending/001_newarrival/views/XinpinView.vue` 添加返回按钮
  - `pending/002_whoiszd/views/EntryGuard.vue` 简化警告文本
- 验收标准：
  - L0门户显示pending宇宙卡片（匿，腻，溺）
  - 点击可进入L1入口页面，显示两个子模块
  - 各子模块入口文案符合实验性定位
  - 返回按钮可正常导航
  - TypeScript类型检查通过
- **风险评估**: 低风险。
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/portal/stores/portal.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/views/MainProjectSelection.vue` (新建)
  - `lugarden_universal/frontend_vue/src/modules/pending/views/index.ts`
  - `lugarden_universal/frontend_vue/src/router/index.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/001_newarrival/views/XinpinView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/002_whoiszd/views/EntryGuard.vue`
  - `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue` (统一mb-2)
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤B.1.1：在portal.ts添加pending宇宙导航配置和硬编码数据
  - [x] 步骤B.1.2：创建pending/views/MainProjectSelection.vue（L1入口）
  - [x] 步骤B.1.3：更新路由配置（/pending指向MainProjectSelection）
  - [x] 步骤B.1.4：更新L1入口文案（匿，腻，溺 / 可能是实验，更可能是冒犯）
  - [x] 步骤B.1.5：更新子模块入口文案（NEW ARRIVAL: 贩卖机，卖空气 / 谁是ZD: 炎石做得，陆家明做不得？）
  - [x] 步骤B.1.6：为XinpinView添加返回按钮
  - [x] 步骤B.1.7：简化EntryGuard警告文本（删除"先锋实验模块"，保留⚠️）
  - [x] 步骤B.1.8：统一三个宇宙MainProjectSelection的h2 margin为mb-2

#### - [x] 任务B.2：pending宇宙授权码门禁

- **核心思想**: 为pending宇宙添加访问控制，用户首次进入时需输入授权码验证，验证通过后记录到localStorage，后续访问无需重复验证。
- 交付物：
  - `pending/views/AuthGate.vue` 授权码输入页面（SHA-256哈希验证）
  - 路由守卫防止直接访问子路由绕过授权
  - localStorage验证状态管理
- 验收标准：
  - 首次访问/pending时显示授权码输入页面
  - 输入正确授权码后进入L1入口
  - 验证状态持久化到localStorage
  - 已验证用户直接进入L1入口
  - 直接访问/pending/*子路由会被路由守卫拦截重定向到授权页
  - TypeScript类型检查通过
- **风险评估**: 低风险。
- 授权码：`niduoniyema@Lugarden.space`（SHA-256哈希存储，源码不暴露明文）
- 完成状态：✅ 已完成
- 实际改动文件：
  - `lugarden_universal/frontend_vue/src/modules/pending/views/AuthGate.vue` (新建)
  - `lugarden_universal/frontend_vue/src/modules/pending/views/index.ts`
  - `lugarden_universal/frontend_vue/src/router/index.ts` (路由+守卫)
  - `lugarden_universal/frontend_vue/src/modules/pending/001_newarrival/views/XinpinView.vue`
- 执行步骤：
  - [x] 步骤B.2.1：创建AuthGate.vue授权码输入页面
  - [x] 步骤B.2.2：实现授权码验证逻辑和localStorage持久化
  - [x] 步骤B.2.3：更新路由配置，/pending指向AuthGate，/pending/home指向MainProjectSelection
  - [x] 步骤B.2.4：更新子模块返回路径到/pending/home
  - [x] 步骤B.2.5：添加路由守卫，防止直接访问子路由绕过授权
  - [x] 步骤B.2.6：实现SHA-256哈希验证，源码不暴露明文授权码
  - [x] 步骤B.2.7：使用SVG图标替换emoji
  - [x] 步骤B.2.8：验证TypeScript类型检查通过

#### - [ ] 任务B.3：whoiszd模块UI设计系统统一化

- **核心思想**: whoiszd模块可保持深色配色以形成反差，但必须复用全局设计系统（统一卡片、按钮、动画、字体），而非完全自定义样式。
- 交付物：
  - 深色主题CSS变量（scoped或全局）
  - 使用unified-content-card的深色变体
  - 使用btn-primary的深色变体
  - 使用animate-fadeInUp动画
  - 使用全局字体系统
- 验收标准：
  - 视觉上保持深色反差风格
  - 但卡片、按钮、动画、字体与主站统一
  - TypeScript类型检查通过
  - 构建无报错
- **风险评估**: 中风险。需要平衡设计统一性与风格差异。
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/pending/002_whoiszd/views/EntryGuard.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/002_whoiszd/views/ConfirmView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/002_whoiszd/views/GameView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/002_whoiszd/views/TerminatedView.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/002_whoiszd/views/ResultView.vue`
  - 可能需要新增：`assets/styles/theme-dark.css` 或 scoped变量
- 完成状态：⏳ 待执行
- 执行步骤：
  - [ ] 步骤B.3.1：分析当前whoiszd模块的自定义样式
  - [ ] 步骤B.3.2：设计深色主题CSS变量方案
  - [ ] 步骤B.3.3：重构EntryGuard.vue使用设计系统
  - [ ] 步骤B.3.4：重构ConfirmView.vue使用设计系统
  - [ ] 步骤B.3.5：重构GameView.vue使用设计系统
  - [ ] 步骤B.3.6：重构TerminatedView.vue使用设计系统
  - [ ] 步骤B.3.7：重构ResultView.vue使用设计系统
  - [ ] 步骤B.3.8：验证视觉效果和功能完整性

---

## 测试与验收

- 待定

## 更新日志关联

- **预计更新类型**: 功能更新
- **更新目录**: `documentation/changelog/YYYY-MM-DD_谁是臧棣实验模块/`

## 注意事项

- 20首诗歌需要预先使用陆家明AI生成
- 诗歌顺序每次随机打乱
- 中途退出（关闭页面/刷新）不保存进度，重新进入从头开始
- 仅冷却状态持久化到localStorage

## 当前状态

🔄 进行中 - 阶段A已完成，阶段B任务B.1（pending宇宙整合）已完成，任务B.2（UI设计系统统一化）待执行

---
*本模板基于陆家花园项目Git开发指南创建（增强版）*
