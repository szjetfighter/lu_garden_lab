# 模块架构重构 - 宇宙级/子模块级分离 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

解决Modular Monolith架构中的层级混乱问题：
1. **宇宙入口错位**：MainProjectSelection放在子模块views下，应提升到宇宙级
2. **pending缺失入口**：pending是首个多子模块宇宙，缺少统一入口
3. **stores/types耦合**：宇宙级组件穿透到子模块内部目录，违反模块边界原则
4. **目录命名规范**：子模块缺乏编号，不便于排序和扩展

## 范围与约束

- 仅涉及前端Vue项目的模块目录结构调整
- 不改变业务逻辑，仅调整文件位置和导入路径
- 所有改动必须通过type-check和build验证

## 任务列表

---

### **阶段12-05_A：架构重构**

#### - [x] 任务A.1：宇宙入口提升

- **核心思想**: 将MainProjectSelection从子模块提升到宇宙级，建立清晰的L0/L1/L2层级。
- 交付物：
  - `zhou/views/MainProjectSelection.vue`
  - `zhou/views/index.ts`
  - `mao/views/MainProjectSelection.vue`
  - `mao/views/index.ts`
  - `pending/views/PendingSelection.vue`
  - `pending/views/index.ts`
- 验收标准：
  - 所有宇宙都有views/目录和入口组件
  - 路由正确指向宇宙级views
  - 原子模块views下的MainProjectSelection已删除
- **风险评估**: 低风险。纯文件移动和路径更新。
- 实际改动文件:
  - `router/index.ts`
  - `zhou/views/MainProjectSelection.vue` (新建)
  - `mao/views/MainProjectSelection.vue` (新建)
  - `pending/views/PendingSelection.vue` (新建)
  - `zhou/lianxi/views/MainProjectSelection.vue` (删除)
  - `mao/moshi/views/MainProjectSelection.vue` (删除)
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.1.1：创建zhou/views/MainProjectSelection.vue
  - [x] 步骤A.1.2：创建mao/views/MainProjectSelection.vue
  - [x] 步骤A.1.3：创建pending/views/PendingSelection.vue
  - [x] 步骤A.1.4：更新路由配置
  - [x] 步骤A.1.5：删除旧的子模块级MainProjectSelection

#### - [x] 任务A.2：stores/types提升到宇宙级

- **核心思想**: 将共享的stores和types从子模块提升到宇宙级，消除宇宙级组件对子模块内部目录的穿透依赖。
- 交付物：
  - `zhou/stores/zhou.ts`
  - `zhou/types/zhou.ts`
  - `mao/stores/moshiStore.ts`
  - `mao/types/moshi.ts`
- 验收标准：
  - 宇宙级组件只导入宇宙级stores/types
  - 子模块通过re-export方式提供兼容导出
  - 所有导入路径已更新
- **风险评估**: 中风险。涉及大量导入路径更新。
- 实际改动文件:
  - `zhou/stores/` (新建目录和文件)
  - `zhou/types/` (新建目录和文件)
  - `mao/stores/` (新建目录和文件)
  - `mao/types/` (新建目录和文件)
  - `zhou/lianxi/stores/` (删除)
  - `zhou/lianxi/types/` (删除)
  - `mao/moshi/stores/` (删除)
  - `mao/moshi/types/` (删除)
  - 多个组件和视图的导入路径更新
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.2.1：复制zhou stores/types到宇宙级
  - [x] 步骤A.2.2：复制mao stores/types到宇宙级
  - [x] 步骤A.2.3：更新所有导入路径
  - [x] 步骤A.2.4：更新子模块index.ts的re-export
  - [x] 步骤A.2.5：删除旧的子模块级stores/types
  - [x] 步骤A.2.6：验证type-check通过

#### - [x] 任务A.3：子模块编号命名

- **核心思想**: 为子模块添加数字前缀，便于排序和扩展。
- 交付物：
  - `zhou/001_lianxi/`
  - `mao/001_moshi/`
  - `pending/001_newarrival/`
  - `pending/002_whoiszd/`
- 验收标准：
  - 所有子模块目录已重命名
  - 所有引用路径已更新
  - 路由路径已更新
- **风险评估**: 低风险。批量重命名和路径替换。
- 实际改动文件:
  - 目录重命名
  - `router/index.ts`
  - 所有涉及子模块路径的组件
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.3.1：重命名lianxi → 001_lianxi
  - [x] 步骤A.3.2：重命名moshi → 001_moshi
  - [x] 步骤A.3.3：重命名newarrival → 001_newarrival
  - [x] 步骤A.3.4：重命名whoiszd → 002_whoiszd
  - [x] 步骤A.3.5：更新所有导入路径
  - [x] 步骤A.3.6：更新路由配置
  - [x] 步骤A.3.7：验证build通过

---

## 测试与验收

- [x] `npm run type-check` 通过
- [x] `npm run build` 成功

## 更新日志关联

- **预计更新类型**: 架构重构
- **更新目录**: `documentation/changelog/2025-12-05_模块架构重构/`

## 注意事项

- 本次重构不改变任何业务逻辑
- 所有改动都是目录结构和导入路径调整
- 保持Git提交记录清晰

## 最终目录结构

```
modules/
├── portal/
│   └── views/UniversePortal.vue          ← L0 门户
│
├── zhou/
│   ├── views/MainProjectSelection.vue    ← L1 宇宙入口
│   ├── stores/zhou.ts                    ← 宇宙级store
│   ├── types/zhou.ts                     ← 宇宙级types
│   └── 001_lianxi/                       ← L2 子模块
│       ├── components/
│       ├── services/
│       └── views/
│
├── mao/
│   ├── views/MainProjectSelection.vue    ← L1 宇宙入口
│   ├── stores/moshiStore.ts              ← 宇宙级store
│   ├── types/moshi.ts                    ← 宇宙级types
│   └── 001_moshi/                        ← L2 子模块
│       ├── components/
│       ├── services/
│       └── views/
│
└── pending/
    ├── views/PendingSelection.vue        ← L1 宇宙入口
    ├── 001_newarrival/                   ← L2 子模块
    └── 002_whoiszd/                      ← L2 子模块
```

## 当前状态
✅ 已完成

---
*本文档记录2025-12-05架构重构工作*
