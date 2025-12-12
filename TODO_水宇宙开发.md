# 水宇宙开发 TODO（增强版）

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标
建立水宇宙（Shui Universe）的基础设施，实现 L1 门户页面、L2 项目选择页面与 L3 海图页面。
核心体验：以ECharts中国地图为载体，呈现6个故事集的地理分布与时间脉络。

## 范围与约束
- **技术栈**：Vue 3 + TypeScript + UnoCSS + Prisma + ECharts
- **架构对齐**：镜像 `zhou` 模块的层级结构 Universe (L1) -> Project (L2) -> Experience (L3)
- **目录结构**：
  - `modules/shui/views/MainProjectSelection.vue` (L1)
  - `modules/shui/001_12tales/views/SubProjectSelection.vue` (L2)
  - `modules/shui/001_12tales/views/ShuiMap.vue` (L3)

## 任务列表

---

### **阶段2025-12-12_A：基础设施搭建 (Infrastructure Setup)**

#### - [x] 任务A.1：后端API与服务层实现
- **核心思想**: 建立后端数据通道，让前端能获取到水宇宙的故事集数据
- 交付物：
  - `lugarden_universal/application/src/services/shuiService.js`
  - `lugarden_universal/application/src/routes/universes.js`
- 验收标准：
  - 调用 `GET /api/universes/shui/collections` 返回符合预期的 JSON 数组
  - 调用 `GET /api/universes/shui/map` 返回含诗歌摘要的故事集数据
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/application/src/services/shuiService.js`
  - `lugarden_universal/application/src/routes/universes.js`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.1.1：创建 `shuiService.js`，实现数据查询方法
  - [x] 步骤A.1.2：配置 API 路由端点
  - [x] 步骤A.1.3：验证 API 响应格式

#### - [x] 任务A.2：前端路由与状态管理
- **核心思想**: 搭建前端的基础页面结构和数据管理机制
- 交付物：
  - `router/index.ts` (更新)
  - `stores/shuiStore.ts` (新建)
- 验收标准：
  - 访问 `/shui` 能进入 L1 页面
  - Pinia Store 能成功从 API 获取数据并存储
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/stores/shuiStore.ts`
  - `lugarden_universal/frontend_vue/src/router/index.ts`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.2.1：注册 `/shui` 相关路由
  - [x] 步骤A.2.2：创建 `shuiStore.ts`
  - [x] 步骤A.2.3：创建模块目录结构

---

### **阶段2025-12-12_B：页面实现 (View Implementation)**

#### - [x] 任务B.1：L1/L2 架构铺设
- **核心思想**: 搭建通往 L3 核心体验的完整路由链
- 交付物：
  - `modules/shui/views/MainProjectSelection.vue` (L1)
  - `modules/shui/001_12tales/views/SubProjectSelection.vue` (L2)
- 验收标准：
  - L1 页面展示"十二个故事集"卡片
  - L2 页面展示模式选择（海图等）
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/shui/views/MainProjectSelection.vue`
  - `lugarden_universal/frontend_vue/src/modules/shui/001_12tales/views/SubProjectSelection.vue`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤B.1.1：创建目录结构
  - [x] 步骤B.1.2：实现 L1 页面
  - [x] 步骤B.1.3：实现 L2 页面
  - [x] 步骤B.1.4：配置路由链

#### - [x] 任务B.2：L3 海图页面实现
- **核心思想**: 实现"海图"沉浸式页面，以ECharts中国地图呈现故事集地理分布
- 交付物：
  - `modules/shui/001_12tales/views/ShuiMap.vue`
  - `modules/shui/components/ShuiCollectionCard.vue`
  - `modules/shui/components/ChinaMapSvg.vue`
- 验收标准：
  - ECharts中国地图正常渲染（阿里云DataV GeoJSON）
  - 6个故事集位置标记带涟漪效果
  - 底部横向时间轴与地图双向联动
  - 诗歌列表侧边栏正常展示
- **风险评估**: 中风险（外部GeoJSON依赖）
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/shui/001_12tales/views/ShuiMap.vue`
  - `lugarden_universal/frontend_vue/src/modules/shui/components/ShuiCollectionCard.vue`
  - `lugarden_universal/frontend_vue/src/modules/shui/components/ChinaMapSvg.vue`
  - `lugarden_universal/frontend_vue/package.json` (新增 echarts, vue-echarts)
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤B.2.1：安装 echarts + vue-echarts 依赖
  - [x] 步骤B.2.2：创建 ChinaMapSvg.vue（ECharts版）
  - [x] 步骤B.2.3：实现 ShuiMap.vue 布局（地图+时间轴+侧边栏）
  - [x] 步骤B.2.4：实现地图与时间轴联动交互
  - [x] 步骤B.2.5：添加地图容器卡片
  - [x] 步骤B.2.6：TypeScript检查 + 构建验证通过

---

### **阶段2025-12-12_C：交互增强（待定）**

#### - [ ] 任务C.1：诗歌详情弹窗优化
#### - [ ] 任务C.2：地图配色/风格微调
#### - [ ] 任务C.3：移动端响应式适配

---

## 测试与验收
- [x] 后端 API 测试：`/api/universes/shui/map` 正常返回
- [x] 路由测试：`/shui` -> `/shui/project/001_12tales` -> `/shui/project/001_12tales/map`
- [x] TypeScript检查：0错误
- [x] 构建验证：成功

## 更新日志关联
- **预计更新类型**: [功能更新]
- **更新目录**: `documentation/changelog/2025-12-12_水宇宙开发/`
- **更新日志文件**: `更新日志.md`
- **测试验证点**: 
  - [x] L1 页面正常显示
  - [x] L2 页面正常跳转
  - [x] L3 海图页面ECharts地图正常渲染

## 注意事项
- ECharts地图依赖阿里云DataV GeoJSON，需网络可用
- 6个故事集经纬度坐标为近似值，可后续微调

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/2025-12-12_水宇宙开发/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git

## 当前状态
✅ 阶段A/B 已完成

---
*本文档基于陆家花园项目TODO模板（增强版）创建*
