# 曹僧宇宙"新品发布"自动售货机模块开发 TODO（POC）

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

基于曹僧《新品发布》组诗，创建"自动售货机"交互体验模块的POC（概念验证）。

**核心理念**：
- 《新品发布》是14个"产品"的荒诞发布会
- 交互形态应契合"消费"隐喻，而非"赌博"隐喻（区别于刮刮乐/老虎机）
- 用户主动"选购"产品，而非被概率决定
- 保留诗歌的清单属性和整体性

**美学定位**：
- 赛博朋克/霓虹风格（青色#0ff + 粉色#ff6b9d）
- 纯CSS实现（Phase 1，为未来Three.js升级预留空间）

## 范围与约束

- **技术约束**：纯前端实现，无需后端API
- **数据约束**：14个产品为固定数据，使用TypeScript静态定义
- **风格约束**：遵循现有Modular Monolith架构规范
- **POC范围**：验证交互形态和视觉风格的可行性

## 任务列表

---

### **阶段12-02_A：数据结构与模块骨架**

#### - [x] 任务A.1：创建模块目录结构与类型定义
- **核心思想**: 建立曹僧宇宙xinpin模块的标准骨架，定义产品数据类型
- 交付物：
  - `modules/caogong/xinpin/types/xinpin.ts` - 产品类型定义
  - `modules/caogong/xinpin/data/products.ts` - 14个产品结构化数据
  - `modules/caogong/xinpin/index.ts` - 模块导出文件
- 验收标准：
  - TypeScript类型检查通过 ✅
  - 14个产品数据完整（标题、副标题、诗行数组） ✅
- **风险评估**: 零风险（纯数据定义）
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/types/xinpin.ts`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/data/products.ts`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/index.ts`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤A.1.1：创建类型定义文件 `types/xinpin.ts`
   - [x] 步骤A.1.2：从原诗提取并结构化14个产品数据
   - [x] 步骤A.1.3：创建模块导出文件 `index.ts`

---

### **阶段12-02_B：核心视觉组件开发**

#### - [x] 任务B.1：自动售货机主组件开发
- **核心思想**: 创建赛博朋克风格的自动售货机视觉容器
- 交付物：
  - `components/VendingMachine.vue` - 售货机主体组件（霓虹招牌+展示柜+出货口）
  - `components/ProductSlot.vue` - 单个产品展示柜组件（玻璃柜+emoji图标+灯条）
  - `components/ProductModal.vue` - 产品说明书弹窗组件
- 验收标准：
  - 14个产品展示柜正确展示 ✅
  - 点击产品触发出货动画+弹窗显示诗歌内容 ✅
  - 响应式设计（移动端/桌面端） ✅
  - 赛博朋克视觉风格（霓虹灯、透明玻璃柜、出货口） ✅
- **风险评估**: 低风险（纯CSS，无复杂逻辑）
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine.vue`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/ProductSlot.vue`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/ProductModal.vue`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤B.1.1：创建ProductSlot组件（玻璃展示柜+emoji图标+霓虹灯条）
   - [x] 步骤B.1.2：创建VendingMachine组件（霓虹招牌+14格展柜+出货口）
   - [x] 步骤B.1.3：创建ProductModal组件（复古说明书弹窗）
   - [x] 步骤B.1.4：实现赛博朋克CSS样式

#### - [x] 任务B.2：入口视图页面开发
- **核心思想**: 创建xinpin模块的入口页面
- 交付物：
  - `views/XinpinView.vue` - 模块入口页面
- 验收标准：
  - 页面正确加载VendingMachine组件 ✅
  - 页面标题和导航正确 ✅
- **风险评估**: 零风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/views/XinpinView.vue`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤B.2.1：创建XinpinView页面组件
   - [x] 步骤B.2.2：集成VendingMachine组件

---

### **阶段12-02_C：路由配置与集成测试**

#### - [x] 任务C.1：路由配置与验证
- **核心思想**: 将xinpin模块接入陆家花园路由系统
- 交付物：
  - 路由配置更新
- 验收标准：
  - `/caogong/xinpin` 路由可访问 ✅
  - 页面标题正确显示 ✅
  - TypeScript类型检查0错误 ✅
  - Vite构建成功 ✅
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/router/index.ts`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤C.1.1：添加xinpin路由配置
   - [x] 步骤C.1.2：运行type-check验证
   - [x] 步骤C.1.3：运行build验证
   - [x] 步骤C.1.4：本地预览测试

---

## 测试与验收

### 功能验收
- [x] 14个产品展示柜全部正确显示
- [x] 点击任意产品触发出货动画并弹出对应诗歌内容
- [x] 弹窗可正常关闭
- [x] 移动端响应式布局正常
- [x] 赛博朋克视觉风格到位

### 技术验收
- [x] TypeScript类型检查0错误
- [x] Vite构建成功
- [x] 路由访问正常

## 更新日志关联
- **预计更新类型**: 功能更新（POC）
- **更新目录**: `documentation/changelog/2025-12-02_曹僧宇宙新品发布POC/`
- **更新日志文件**: `更新日志.md`

## 当前状态
✅ POC已完成

---
*基于陆家花园项目TODO模板创建*
*设计决策来源：2025-12-02专注模式讨论*
*核心洞察：自动售货机隐喻契合《新品发布》的消费主义批判，优于刮刮乐/老虎机的赌博隐喻*
