# 曹僧宇宙"新品发布"自动售货机模块开发 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

基于曹僧《新品发布》组诗，创建"自动售货机"交互体验模块。

**核心理念**：
- 《新品发布》是14个"产品"的荒诞发布会
- 交互形态应契合"消费"隐喻，而非"赌博"隐喻
- 用户主动"选购"产品，而非被概率决定
- 保留诗歌的清单属性和整体性

**美学定位**：
- 蒸汽朋克/复古工业风格
- 纯CSS实现（Phase 1，为未来Three.js升级预留空间）

## 范围与约束

- **技术约束**：纯前端实现，无需后端API
- **数据约束**：14个产品为固定数据，使用TypeScript静态定义
- **风格约束**：遵循现有Modular Monolith架构规范
- **时间约束**：Phase 1目标1-2天完成

## 任务列表

> **任务编号规范**
> - 阶段12-02_A：数据结构与模块骨架
> - 阶段12-02_B：核心视觉组件开发
> - 阶段12-02_C：路由配置与集成测试

---

### **阶段12-02_A：数据结构与模块骨架**

#### - [ ] 任务A.1：创建模块目录结构与类型定义
- **核心思想**: 建立曹僧宇宙xinpin模块的标准骨架，定义产品数据类型
- 交付物：
  - `modules/caogong/xinpin/types/xinpin.ts` - 产品类型定义
  - `modules/caogong/xinpin/data/products.ts` - 14个产品结构化数据
  - `modules/caogong/xinpin/index.ts` - 模块导出文件
- 验收标准：
  - TypeScript类型检查通过
  - 14个产品数据完整（标题、副标题、诗行数组）
- **风险评估**: 零风险（纯数据定义）
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/types/xinpin.ts`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/data/products.ts`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/index.ts`
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤A.1.1：创建类型定义文件 `types/xinpin.ts`
   - [ ] 步骤A.1.2：从原诗提取并结构化14个产品数据
   - [ ] 步骤A.1.3：创建模块导出文件 `index.ts`

---

### **阶段12-02_B：核心视觉组件开发**

#### - [ ] 任务B.1：自动售货机主组件开发
- **核心思想**: 创建蒸汽朋克风格的自动售货机视觉容器
- 交付物：
  - `components/VendingMachine.vue` - 售货机主体组件
  - `components/ProductSlot.vue` - 单个产品格子组件
  - `components/ProductModal.vue` - 产品说明书弹窗组件
- 验收标准：
  - 14个产品格子正确展示
  - 点击产品触发弹窗显示诗歌内容
  - 响应式设计（移动端/桌面端）
  - 蒸汽朋克视觉风格（金属质感、铆钉、复古字体）
- **风险评估**: 低风险（纯CSS，无复杂逻辑）
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine.vue`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/ProductSlot.vue`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/ProductModal.vue`
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤B.1.1：创建ProductSlot组件（单个产品按钮）
   - [ ] 步骤B.1.2：创建VendingMachine组件（14格展柜布局）
   - [ ] 步骤B.1.3：创建ProductModal组件（说明书弹窗）
   - [ ] 步骤B.1.4：实现蒸汽朋克CSS样式

#### - [ ] 任务B.2：入口视图页面开发
- **核心思想**: 创建xinpin模块的入口页面
- 交付物：
  - `views/XinpinView.vue` - 模块入口页面
- 验收标准：
  - 页面正确加载VendingMachine组件
  - 页面标题和导航正确
- **风险评估**: 零风险
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/views/XinpinView.vue`
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤B.2.1：创建XinpinView页面组件
   - [ ] 步骤B.2.2：集成VendingMachine组件

---

### **阶段12-02_C：路由配置与集成测试**

#### - [ ] 任务C.1：路由配置与Portal入口
- **核心思想**: 将xinpin模块接入陆家花园路由系统
- 交付物：
  - 路由配置更新
  - Portal门户入口（可选）
- 验收标准：
  - `/caogong/xinpin` 路由可访问
  - 页面标题正确显示
  - TypeScript类型检查0错误
  - Vite构建成功
- **风险评估**: 低风险
- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/router/index.ts`
- 实际改动文件: [待记录]
- 完成状态：🔄 进行中
- 执行步骤：
   - [ ] 步骤C.1.1：添加xinpin路由配置
   - [ ] 步骤C.1.2：运行type-check验证
   - [ ] 步骤C.1.3：运行build验证
   - [ ] 步骤C.1.4：本地预览测试

---

## 测试与验收

### 功能验收
- [ ] 14个产品格子全部正确显示
- [ ] 点击任意产品弹出对应诗歌内容
- [ ] 弹窗可正常关闭
- [ ] 移动端响应式布局正常
- [ ] 蒸汽朋克视觉风格到位

### 技术验收
- [ ] TypeScript类型检查0错误
- [ ] ESLint检查0警告
- [ ] Vite构建成功
- [ ] 路由访问正常

## 更新日志关联
- **预计更新类型**: 功能更新
- **更新目录**: `documentation/changelog/2025-12-02_曹僧宇宙新品发布模块/`
- **更新日志文件**: `更新日志.md`

## 注意事项
- 每完成一个任务都要测试功能
- 如果出现问题立即回滚
- 保持Git提交记录清晰（原子提交、提交信息规范）
- 遵循现有Modular Monolith架构规范

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/2025-12-02_曹僧宇宙新品发布模块/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 更新 `当前进展.md` 文件
- [ ] 提交所有更改到Git

## 当前状态
🔄 进行中

---
*基于陆家花园项目TODO模板创建*
*设计决策来源：2025-12-02专注模式讨论*
