# Three.js 开发探索手册

> 来源：曹僧宇宙3D售货机开发（2025-12-03 ~ 至今）
> 这是一份"踩坑记录"，分门别类记录实际开发中遇到的问题和解决方案。

---

# 一、材质与贴图

## 1.1 BoxGeometry 多材质系统

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

## 1.2 纹理贴图等比例问题

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

## 1.3 Z-Fighting 闪烁问题

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

## 1.4 gl_FrontFacing 的局限性

### 问题
尝试用`gl_FrontFacing`区分边框的"机身内侧"和"机身外侧"，失败。

### 原因
`gl_FrontFacing`只能判断当前片元是面的正面还是背面（基于法线方向和观察方向），无法判断"这个面是否朝向机身中心"。

BoxGeometry的每个面法线都朝外，从任何角度看，可见面的`gl_FrontFacing`都是true。

### 正确做法
使用材质数组，为每个边框的每个面单独指定材质（见第1节）。

---

## 1.5 纹理选择建议

| 纹理类型 | 适用场景 | 注意事项 |
|----------|----------|----------|
| **各向同性纹理** | 三平面映射 | 无明显方向性图案 |
| **方向性纹理** | 单独repeat | 需为每面调整repeat |
| **程序化噪声** | 需要完全均匀 | 用Shader生成 |

本项目最终选择**蓝色金属板纹理**（各向同性），配合**单独repeat方案**。

---

## 1.6 异步纹理加载

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

## 1.7 材质与贴图小结

核心教训：**"头疼医头"有时是对的**。

Three.js材质系统提供了多种方案，但没有银弹：
- 需要内外区分 → 材质数组
- 需要等比例贴图 → 单独repeat或世界坐标采样
- 需要避免闪烁 → 调整几何体或polygonOffset

关键是理解每种方案的适用边界，根据实际需求组合使用。

---

# 二、资源管理与生命周期

## 2.1 WebGL上下文限制与释放

### 问题
浏览器对WebGL上下文数量有**硬性限制**（通常8-16个）。当上下文耗尽时：
```
WARNING: Too many active WebGL contexts. Oldest context will be lost.
THREE.WebGLRenderer: Context Lost.
```
然后页面白屏。

### 根本原因
- 每次 `new THREE.WebGLRenderer()` 占用一个上下文
- `renderer.dispose()` **不会自动释放上下文**
- Vue组件卸载时，上下文累积到达限制后被强制丢弃

### 解决方案
```typescript
// 在组件卸载时调用
renderer.dispose()
renderer.forceContextLoss()  // 关键：强制释放WebGL上下文
```

`forceContextLoss()` 会：
1. 触发 `webglcontextlost` 事件
2. 强制浏览器立即回收该WebGL上下文
3. 使上下文槽位可被后续使用

---

## 2.2 深度资源清理

### 问题
仅调用 `renderer.dispose()` 不会释放GPU内存中的几何体、材质、纹理。

### 解决方案
遍历场景，逐一释放：

```typescript
scene.traverse((object: THREE.Object3D) => {
  if (object instanceof THREE.Mesh) {
    object.geometry?.dispose()
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => mat.dispose())
      } else {
        object.material.dispose()
      }
    }
  }
})

// 清理背景纹理
if (scene.background instanceof THREE.Texture) {
  scene.background.dispose()
}

scene.clear()
```

---

## 2.3 Vue组件完整清理流程

### 推荐模式
```typescript
onUnmounted(() => {
  // 1. 停止动画循环
  if (animationId) cancelAnimationFrame(animationId)
  
  // 2. 移除事件监听
  window.removeEventListener('resize', handleResize)
  
  // 3. 清理控制器
  controls?.dispose()
  
  // 4. 清理后处理
  composer?.dispose()
  
  // 5. 深度清理场景（见2.2）
  
  // 6. 清理渲染器并释放上下文
  renderer.dispose()
  renderer.forceContextLoss()
  container.removeChild(renderer.domElement)
})
```

---

# 三、交互控制

## 3.1 OrbitControls触摸配置

### 默认行为
| 触摸方式 | 默认操作 |
|----------|----------|
| 单指 | ROTATE（旋转） |
| 双指 | DOLLY_PAN（缩放+平移） |

### 自定义配置
```typescript
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,       // 单指：旋转
  TWO: THREE.TOUCH.DOLLY_ROTATE  // 双指：缩放+旋转
}
```

可选值：
- `THREE.TOUCH.ROTATE` - 旋转
- `THREE.TOUCH.PAN` - 平移
- `THREE.TOUCH.DOLLY_PAN` - 缩放+平移
- `THREE.TOUCH.DOLLY_ROTATE` - 缩放+旋转

---

## 3.2 触摸事件边缘情况

### 问题
```
Uncaught TypeError: Cannot read properties of undefined (reading 'x')
at OrbitControls._handleTouchStartDolly
```

### 原因
OrbitControls处理双指缩放时，期望 `pointers` 数组有2个触摸点，但在某些边缘情况下（DevTools模拟触摸、快速触摸切换），`pointers[1]` 可能是 `undefined`。

### 解决方案
将双指操作从 `DOLLY_PAN` 改为 `DOLLY_ROTATE`，避开有bug的代码路径：
```typescript
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_ROTATE
}
```

---

# 四、后处理与效果

> 占位：后续补充Bloom辉光、色调映射等内容

---

# 五、性能优化

> 占位：后续补充模型缓存、懒加载、LOD等内容

---

# 六、Troika 3D文字

## 6.1 中文字体加载问题

### 问题
Troika默认从CDN加载字体，中文字体（如思源宋体）体积巨大（10-20MB），导致：
- 移动端加载极慢（可能超时）
- 首次渲染延迟明显
- 流量浪费

### 解决方案：字体子集化

只保留实际用到的字符，大幅减小文件体积。

**工具**：`pyftsubset`（fonttools包）

```bash
# 安装
pip install fonttools

# 子集化
pyftsubset "思源宋体.ttf" \
  --text-file=chars.txt \
  --output-file="思源宋体-subset.ttf"
```

**效果**：
- 原始字体：11.8MB
- 子集化后：208-210KB（约56倍压缩）

### 项目实践

创建交互式工具 `tools/subset-font.py`，支持：
1. 从代码文件提取中文字符
2. 从字符文件读取
3. 直接输入字符串

```typescript
// 使用本地子集字体
import fontUrl from '../assets/fonts/思源宋体-subset.ttf?url'

const text = new Text()
text.font = fontUrl
```

---

## 6.2 SDF渲染原理

### 什么是SDF（Signed Distance Field）

传统字体渲染存储像素位图，放大会模糊。

**SDF方式**：存储每个像素到字形边缘的"有符号距离值"：
- 正值 = 在字形内部
- 负值 = 在字形外部
- 0 = 正好在边缘

### Shader采样

```glsl
float dist = texture2D(sdfTexture, uv).a;
float alpha = smoothstep(0.5 - edge, 0.5 + edge, dist);
```

**优势**：无论放大多少倍，边缘都是锐利的（数学计算而非像素插值）。

### 透视极小字的黑框问题

当文字在屏幕上变得极小（透视压缩到几个像素）：

1. **采样精度不足**：一个屏幕像素覆盖了SDF纹理的多个texel
2. **距离值混淆**：内部和外部的距离值被平均，阈值判断失效
3. **结果**：shader认为整个区域都是"边缘"或"内部"，渲染成黑色方块

### 解决方案

| 方案 | 实现 | 适用场景 |
|------|------|----------|
| 限制相机角度 | `controls.maxPolarAngle` | 固定视角应用 |
| 增大sdfGlyphSize | `text.sdfGlyphSize = 128` | 需要极端缩放 |
| 改用正交相机 | `OrthographicCamera` | 无透视需求 |

### 类比

用放大镜看地图上的城市边界线：
- 正常大小：边界清晰
- 缩小到极限：城市变成一个小点，边界消失

Troika的SDF纹理分辨率是固定的（默认64x64 per glyph），当屏幕尺寸小于这个精度时就会崩溃。

---

## 6.3 Troika Text与Raycaster的限制

### 问题
尝试用Three.js的Raycaster检测单个Troika Text字符时，检测失败。

### 原因
Troika Text使用**SDF渲染**，其内部结构是：
- **一个简单平面几何体**（Quad）
- 所有字符形状完全由**shader在GPU上渲染**
- CPU端没有每个字符的独立几何信息

Raycaster的工作原理：
```
射线 → 遍历物体的几何顶点 → 计算三角形交点
```

由于Troika只有一个平面几何体，Raycaster只能检测到"是否碰到整个文本块"，无法知道具体碰到了哪个字符。

### 解决方案
使用**间接检测**：

1. **检测承载卡片**（标准Mesh，Raycaster可检测）
2. 获取**触碰点的世界坐标**（`intersects[0].point`）
3. 计算触碰点与每个字符位置的**距离**
4. 找出**最近的字符**

```typescript
// 检测卡片
const intersects = raycaster.intersectObject(cardMesh)
if (intersects.length > 0) {
  const hitPoint = intersects[0].point  // 触碰点世界坐标
  
  // 计算每个粒子的距离
  const distances = particles.map(p => ({
    particle: p,
    dist: Math.hypot(p.position.x - hitPoint.x, p.position.y - hitPoint.y)
  }))
  
  // 找最近的
  const minDist = Math.min(...distances.map(d => d.dist))
  const hitParticles = distances.filter(d => d.dist <= minDist + 0.05)
}
```

### 适用场景
- 需要检测"哪个字符被触碰"
- 粒子化文字效果（每个字符独立响应）

---

## 6.4 Troika Text的正确清理

### 问题
将`fillOpacity`设为0后，从侧面仍能看到黑色残影。

### 原因
Troika的SDF shader在低透明度时仍可能渲染边缘伪影，且`dispose()`不一定完全清理内部缓存。

### 完整清理流程

```typescript
// 1. Three.js级别隐藏
p.mesh.visible = false

// 2. Troika透明度归零
p.mesh.fillOpacity = 0

// 3. 清空文本内容（释放SDF渲染数据）
p.mesh.text = ''

// 4. 从场景移除
scene.remove(p.mesh)

// 5. 调用dispose释放GPU资源
if (p.mesh.dispose) p.mesh.dispose()
```

### 关键点
- `visible = false`：渲染器完全跳过该对象
- `text = ''`：触发Troika清空内部SDF数据
- 两者配合才能确保从任何角度都不可见

---

# 七、传感器与交互

## 7.1 触摸检测的坐标系问题

### 问题
触摸/鼠标位置检测不准确，点击位置与实际响应位置有偏移。

### 原因
事件监听器绑定在`window`上，坐标计算使用的是**窗口尺寸**：

```typescript
// 错误：使用窗口坐标
pointer.x = (e.clientX / window.innerWidth) * 2 - 1
pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
```

当Canvas不是全屏时（有header、sidebar等），计算结果偏移。

### 正确做法
使用**Canvas的相对坐标**：

```typescript
function getCanvasPointer(clientX: number, clientY: number) {
  const canvas = containerRef.value?.querySelector('canvas')
  if (canvas) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1,
    }
  }
  // 降级
  return { x: 0, y: 0 }
}
```

### 核心公式
```
NDC.x = ((clientX - rect.left) / rect.width) * 2 - 1
NDC.y = -((clientY - rect.top) / rect.height) * 2 + 1
```

- `rect.left/top`：Canvas在页面中的偏移
- `rect.width/height`：Canvas实际尺寸
- 结果范围：-1 到 +1（NDC坐标）

### 适用场景
- Canvas不是全屏
- 页面有固定header/sidebar
- 响应式布局中Canvas尺寸动态变化
