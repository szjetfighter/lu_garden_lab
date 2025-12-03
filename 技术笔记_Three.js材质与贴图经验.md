# Three.js 材质与贴图经验总结

> 来源：曹僧宇宙3D售货机开发（2025-12-03）
> 这是一份"踩坑记录"，记录了实际开发中遇到的问题和解决方案。

---

## 1. BoxGeometry 多材质系统

### 问题
BoxGeometry默认所有6个面使用同一材质，无法区分内外侧。

### 解决方案
使用材质数组，6个元素对应6个面：

```typescript
// 面顺序: [+X, -X, +Y, -Y, +Z, -Z]
const materials = [
  materialForPlusX,   // index 0: +X面
  materialForMinusX,  // index 1: -X面
  materialForPlusY,   // index 2: +Y面
  materialForMinusY,  // index 3: -Y面
  materialForPlusZ,   // index 4: +Z面（前）
  materialForMinusZ   // index 5: -Z面（后）
]
const mesh = new THREE.Mesh(geometry, materials)
```

### 应用场景
- 售货机边框：外侧贴图，内侧纯色
- 左边框内侧是+X面，外侧是-X面
- 右边框内侧是-X面，外侧是+X面

---

## 2. 纹理贴图等比例问题

### 问题
不同尺寸的面使用同一纹理时，会产生拉伸。例如0.3x7的窄长面 vs 4.4x0.5的宽扁面。

### 方案对比

| 方案 | 实现方式 | 优点 | 缺点 |
|------|----------|------|------|
| **方案1：单独repeat** | 每面创建独立材质，根据尺寸设置repeat | 可控、稳定 | 材质数量多 |
| **方案2：世界坐标采样** | ShaderMaterial + 三平面映射 | 代码简洁 | 有方向性纹理会出现条纹 |

### 推荐：方案1

```typescript
const scale = 0.5  // 每世界单位重复0.5次
function createMaterial(width: number, height: number) {
  const tex = baseTexture.clone()
  tex.needsUpdate = true
  tex.repeat.set(width * scale, height * scale)
  return new THREE.MeshStandardMaterial({ map: tex })
}
```

### 三平面映射（备用）

适用于需要跨组件连续纹理的场景：

```glsl
// Fragment Shader
vec3 blending = abs(vNormal);
blending = pow(blending, vec3(4.0));  // 锐化
blending /= (blending.x + blending.y + blending.z);

vec4 texX = texture2D(uTexture, vWorldPosition.zy * uScale);
vec4 texY = texture2D(uTexture, vWorldPosition.xz * uScale);
vec4 texZ = texture2D(uTexture, vWorldPosition.xy * uScale);

vec4 color = texX * blending.x + texY * blending.y + texZ * blending.z;
```

**注意**：如果纹理有明显的方向性图案（如锈蚀条纹），从特定角度看会出现条纹效果。使用各向同性的纹理可避免此问题。

---

## 3. Z-Fighting 闪烁问题

### 问题
两个几何体在同一位置或非常接近时，渲染会闪烁。

### 解决方案

**方案1：调整几何体尺寸避免重叠**（推荐）
```typescript
// 上下边框宽度从5缩至4.4，避免与左右边框(0.3宽)角落重叠
const topFrame = new THREE.Mesh(
  new THREE.BoxGeometry(4.4, 0.5, 2),  // 不是5
  material
)
```

**方案2：使用polygonOffset**
```typescript
const material = new THREE.MeshStandardMaterial({
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
})
```

---

## 4. gl_FrontFacing 的局限性

### 问题
尝试用`gl_FrontFacing`区分边框的"机身内侧"和"机身外侧"，失败。

### 原因
`gl_FrontFacing`只能判断当前片元是面的正面还是背面（基于法线方向和观察方向），无法判断"这个面是否朝向机身中心"。

BoxGeometry的每个面法线都朝外，从任何角度看，可见面的`gl_FrontFacing`都是true。

### 正确做法
使用材质数组，为每个边框的每个面单独指定材质（见第1节）。

---

## 5. 纹理选择建议

| 纹理类型 | 适用场景 | 注意事项 |
|----------|----------|----------|
| **各向同性纹理** | 三平面映射 | 无明显方向性图案 |
| **方向性纹理** | 单独repeat | 需为每面调整repeat |
| **程序化噪声** | 需要完全均匀 | 用Shader生成 |

本项目最终选择**蓝色金属板纹理**（各向同性），配合**单独repeat方案**。

---

## 6. 异步纹理加载

### 问题
纹理未加载完就渲染会导致闪烁或空白。

### 解决方案
```typescript
const texture = await new Promise<THREE.Texture>((resolve) => {
  textureLoader.load(url, (tex) => {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    resolve(tex)
  })
})
```

函数需标记为`async`，调用处使用`await`。

---

## 总结

这次开发的核心教训：**"头疼医头"有时是对的**。

Three.js材质系统提供了多种方案，但没有银弹：
- 需要内外区分 → 材质数组
- 需要等比例贴图 → 单独repeat或世界坐标采样
- 需要避免闪烁 → 调整几何体或polygonOffset

关键是理解每种方案的适用边界，根据实际需求组合使用。
