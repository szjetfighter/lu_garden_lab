# 曹僧宇宙 Three.js 引入探索 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

将曹僧宇宙"新品发布"模块从纯CSS升级为Three.js 3D体验，实现接近概念图的视觉效果。

**目标效果**（参考Gemini生成的概念图）：
- 3D立体售货机，带透视角度
- 真实3D产品模型展示（已有14个GLB文件）
- 金属质感、玻璃反光、霓虹灯光
- 蒸汽/烟雾粒子效果
- 废土朋克+赛博朋克混合美学

**现有资源**：
- 14个GLB模型文件（`modules/caogong/xinpin/assets/GLB/`）
  - Tomato.glb, shy fly.glb, Ship.glb, Bread Roll.glb
  - Sandwich.glb, bird.glb, Teeth.glb, Magnet.glb
  - Egg sunny side up.glb, Glass Jar.glb, Cup Of Tea.glb
  - Shoes.glb, Mirror.glb, Watch.glb

## 范围与约束

- **技术栈**：Three.js + Vue 3（TresJS或原生集成）
- **学习成本**：用户无Three.js经验，需要渐进式学习
- **性能约束**：移动端需要可用
- **回退方案**：保留CSS版本作为降级方案

## 技术选型决定

**选择：原生Three.js**
- 完全控制渲染流程
- 学习价值高
- 与Vue集成通过shallowRef管理Three.js对象

## 任务列表

---

### **阶段12-02_A：Three.js基础环境搭建**

#### - [x] 任务A.1：技术选型与依赖安装 ✅
- **核心思想**: 确定Three.js集成方案，安装必要依赖
- 实际改动文件：
  - `package.json` — 添加 `three`, `@types/three`
- 完成状态：✅ 已完成

#### - [x] 任务A.2：GLB模型加载验证 ✅
- **核心思想**: 验证现有14个GLB模型能否正确加载和显示
- 实际改动文件：
  - `VendingMachine3D.vue` — GLTFLoader加载14个模型
- 完成状态：✅ 已完成（14个模型全部可加载）

---

### **阶段12-02_B：3D售货机场景构建**

#### - [x] 任务B.1：售货机3D框架 ✅
- **核心思想**: 创建3D售货机的基础几何结构
- 交付物：
  - 售货机外壳（BoxGeometry）
  - 玻璃面板（MeshPhysicalMaterial + transmission）
  - 霓虹边框
  - 出货口
  - 装饰铆钉
- 完成状态：✅ 已完成

#### - [x] 任务B.2：产品模型集成 ✅
- **核心思想**: 将14个GLB模型放入对应展示格子
- 交付物：
  - 14个产品模型正确放置
  - 圆形展示台 + 发光环
  - 自动缩放和居中
- 完成状态：✅ 已完成

---

### **阶段12-02_C：交互与视觉增强**

#### - [x] 任务C.1：点击交互实现 ✅
- **核心思想**: 实现3D场景中的点击检测和交互反馈
- 交付物：
  - Raycaster点击检测
  - 悬停放大效果（1.15x）
  - OrbitControls拖拽旋转
  - 与ProductModal弹窗集成
- 完成状态：✅ 已完成

#### - [x] 任务C.2：视觉效果增强 ✅（基础完成）
- **核心思想**: 添加霓虹灯、粒子效果等视觉增强
- 交付物：
  - ✅ 霓虹灯光效果（PointLight）
  - ✅ Bloom后处理（UnrealBloomPass）
  - ⏳ 蒸汽/烟雾粒子（待优化）
  - ⏳ 环境贴图（待优化）
- 完成状态：🔄 基础完成，待优化

---

## 待优化项目

| 优化项 | 优先级 | 说明 |
|--------|--------|------|
| 售货机外壳模型 | 高 | 当前用BoxGeometry，可替换为专业建模 |
| 产品模型材质 | 中 | 部分模型材质显示不佳 |
| 粒子效果 | 低 | 蒸汽/烟雾氛围 |
| 环境贴图 | 中 | HDR环境增强金属反射 |
| 移动端性能 | 高 | 模型LOD、降级策略 |
| 加载优化 | 中 | 模型压缩、渐进加载 |

## 学习资源

- Three.js官方文档：https://threejs.org/docs/
- TresJS文档：https://tresjs.org/
- GLB/GLTF加载：https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- Raycaster交互：https://threejs.org/docs/#api/en/core/Raycaster

## 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 学习曲线陡峭 | 高 | 中 | 渐进式学习，先跑通基础 |
| 移动端性能问题 | 中 | 高 | 降级方案（保留CSS版） |
| GLB模型兼容性 | 低 | 中 | 逐个测试，必要时重新导出 |
| 与Vue集成复杂 | 中 | 中 | 使用TresJS简化 |

## 当前状态
🔄 **初步完成，待优化**

### 已实现
- ✅ Three.js环境搭建
- ✅ 14个GLB模型加载
- ✅ 3D售货机场景（几何体构建）
- ✅ OrbitControls交互
- ✅ Raycaster点击检测
- ✅ Bloom后处理
- ✅ 2D/3D模式切换

### 待优化
- ⏳ 售货机外壳专业建模
- ⏳ 粒子效果
- ⏳ 移动端性能优化
- ⏳ 模型加载优化

---
*基于陆家花园项目TODO模板创建*
*前置依赖：曹僧宇宙新品发布POC已完成*
*初步完成时间：2025-12-02*
