# 曹僧宇宙 Three.js 前端优化 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标

修复曹僧宇宙3D售货机的显示问题，优化视觉效果。

## 范围与约束

- **技术约束**：基于现有VendingMachine3D.vue修复
- **前置依赖**：曹僧宇宙Three.js引入探索初步完成
- **目标**：产品可见、灯光正确、Bloom恢复

## 任务列表

> **任务编号规范**
> - 阶段12-02_A：3D显示问题修复

---

### **阶段12-02_A：3D显示问题修复**

#### - [x] 任务A.1：修复3D售货机显示与灯光问题 ✅
- **核心思想**: 修复产品被遮挡和灯光位置错误的问题
- 交付物：
  - 14个产品模型正确显示 ✅
  - 灯光从内部照亮产品 ✅
  - 背面遮挡 ✅
  - 模型材质修复 ✅
  - 统一旋转动画 ✅
- 验收标准：
  - 产品模型可见且可点击 ✅
  - 灯光效果自然（内部照明） ✅
  - 从背面看不到内部 ✅
- **风险评估**: 低风险（已诊断清楚）
- 实际改动文件：
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤A.1.1：修复产品遮挡问题
   - [x] 步骤A.1.2：修复灯光位置问题
   - [x] 步骤A.1.3：修复背面可见问题
   - [x] 步骤A.1.4：修复模型材质（透明/双面渲染）
   - [x] 步骤A.1.5：统一产品旋转动画

---

## 实际修复记录

### 步骤A.1.1：修复产品遮挡问题

**问题**：inner实心盒子 + body实心盒子 双重遮挡

**实际修复**：
1. 删除inner → 改为PlaneGeometry背板(z=-0.2)
2. body设置`side: THREE.BackSide`只渲染内侧
3. 添加外框边缘（左右上下四条边）保持售货机外观

---

### 步骤A.1.2：修复灯光位置问题

**问题**：灯光z=2-3在玻璃外部

**实际修复**：灯光z值改到0.5（内部空间）
```typescript
lights = [
  { pos: [0, 2, 0.5] },
  { pos: [0, 3.5, 0.5] },
  { pos: [-1.5, 0, 0.5] },
  { pos: [1.5, 0, 0.5] },
  { pos: [0, -2, 0.5] }
]
```

---

### 步骤A.1.3：修复背面可见问题

**问题**：body设置BackSide后，从背面能看穿到内部

**实际修复**：添加背面遮挡板
```typescript
const backCover = new THREE.Mesh(backCoverGeometry, backCoverMaterial)
backCover.position.set(0, 0, -1)
backCover.rotation.y = Math.PI
```

---

### 步骤A.1.4：修复模型材质问题

**问题**：Glass Jar等透明模型不显示

**实际修复**：加载模型后强制修复材质
```typescript
model.traverse((child) => {
  // 设置双面渲染
  mat.side = THREE.DoubleSide
  // 强制不透明
  mat.transparent = false
  mat.opacity = 1
  // 无颜色时设置默认浅蓝色
  if (!mat.map && mat.color.getHex() === 0xffffff) {
    mat.color.setHex(0x88ccff)
  }
})
```

---

### 步骤A.1.5：统一产品旋转动画

**问题**：来回摆动动画在对称模型上不明显

**实际修复**：改为持续旋转
```typescript
productGroups.forEach((group) => {
  group.rotation.y += 0.005  // 每帧旋转，约12秒一圈
})
```

---

## 当前状态
✅ 已完成

---
*前置依赖：曹僧宇宙Three.js引入探索初步完成*
*诊断时间：2025-12-02*
*完成时间：2025-12-02*
