# 曹僧宇宙Three.js引入探索 前端深度优化 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标
曹僧宇宙新品发布页面3D售货机场景的优化与完善，探索Three.js在前端的深度应用。

## 范围与约束
- 仅限曹僧宇宙新品发布模块
- 使用Three.js + Troika-three-text实现3D场景
- 保持与现有Vue3技术栈的兼容

## 任务列表

---

### **阶段12-03_A：3D售货机基础优化**

#### - [x] 任务A.1：霓虹灯招牌与电子屏分离及滚动文字实现
- **核心思想**: 将NEW ARRIVAL霓虹灯招牌独立到机器上方，电子屏实现诗歌内容横向无缝滚动
- 交付物：
  - 霓虹灯招牌独立组件（y=5）
  - 电子屏滚动文字组件（y=4）
- 验收标准：
  - 霓虹灯招牌正确显示在机器上方
  - 电子屏文字无缝循环滚动
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤A.1.1：将霓虹灯招牌（neonTextGroup）位置调整到y=5
   - [x] 步骤A.1.2：电子屏背板+发光面板保持在y=4
   - [x] 步骤A.1.3：实现双Text对象无缝滚动循环
   - [x] 步骤A.1.4：解决Troika中文字符"一"显示为方框问题（改用"壹"）
   - [x] 步骤A.1.5：启用renderer.localClippingEnabled实现文字裁剪

#### - [x] 任务A.2：电子屏LED点阵效果
- **核心思想**: 为电子屏发光面板添加颗粒感/晶体管质感，模拟真实LED显示屏
- 交付物：
  - ShaderMaterial实现的LED点阵效果
- 验收标准：
  - 电子屏显示明显的像素点阵纹理
  - 保持粉色主色调
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
- 完成状态：✅ 已完成
- 执行步骤：
   - [x] 步骤A.2.1：将MeshBasicMaterial替换为ShaderMaterial
   - [x] 步骤A.2.2：实现网格坐标计算和圆形LED点渲染
   - [x] 步骤A.2.3：添加轻微发光效果增强视觉
- 对应commit: `c467d24`

#### - [x] 任务A.3：视觉优化 - 机身配色与灯光
- **核心思想**: 优化售货机整体视觉效果，提升金属质感
- 交付物：
  - 枪灰色机身材质（0x53565A）
  - 中灰色场景背景（0x808080）
  - SpotLight双光源照明
  - 展示区与底部边框对齐修复
- 验收标准：
  - 机身呈现金属质感
  - 光照突出边缘高光
  - 内部展示区对齐正确
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
- 完成状态：✅ 已完成
- 对应commit: `fe5f141`

#### - [x] 任务A.4：产品分布优化
- **核心思想**: 调整内部产品布局，充分利用展示空间
- 交付物：
  - 优化cellHeight和startY参数
- 验收标准：
  - 产品垂直分布充分利用可用空间
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
- 完成状态：✅ 已完成
- 对应commit: `660cf18`

#### - [x] 任务A.5：玻璃面板脏污效果
- **核心思想**: 为玻璃面板添加动态雨痕和油污纹理，增加真实感
- 交付物：
  - ShaderMaterial实现的脏玻璃效果
  - 世界坐标采样实现跨组件连续纹理
- 验收标准：
  - 玻璃显示动态雨痕效果
  - 纹理在不同组件间连续
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
- 完成状态：✅ 已完成
- 对应commit: `6ee604e`

#### - [x] 任务A.6：外框材质系统重构
- **核心思想**: 实现外部贴图+内部纯色的材质分离，解决贴图拉伸和z-fighting问题
- 交付物：
  - 每个边框6面独立材质（内侧纯色，外侧贴图）
  - 按面尺寸设置repeat实现等比例贴图
  - 蓝色金属板纹理替代锈蚀纹理
  - 背板位置修正（z=-0.99）
  - 上下边框尺寸调整避免角落z-fighting
- 验收标准：
  - 外部显示金属纹理，内部干净纯色
  - 纹理在各个面上比例一致
  - 无闪烁问题
- **风险评估**: 中风险（涉及材质系统重构）
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/assets/texture/blue_metal_plate_diff_1k.jpg`（新增）
  - `.gitignore`（添加.blend/忽略）
- 完成状态：✅ 已完成
- 对应commit: `894012d`

#### - [x] 任务A.7：3D场景结构优化与视觉增强
- **核心思想**: 优化售货机各组件的位置对齐、添加支架结构、增强霓虹灯效果
- 交付物：
  - 电子屏位置调整（宽度5.0与主体一致，y=4.1紧贴顶部，z=0.75前端对齐）
  - LED背景黑块增强对比度
  - LED/文字宽度4.6（与上下边距等宽0.2）
  - 霓虹灯招牌支架（立杆+横梁，锈蚀纹理，BoxGeometry）
  - 霓虹灯文字厚度（6层堆叠模拟，DoubleSide双面渲染）
  - 霓虹灯文字渐变（ShaderMaterial，因Troika UV映射产生字符级微渐变效果）
  - 霓虹边框一体式重构（Shape+ExtrudeGeometry+四角支架，BufferGeometryUtils合并）
  - 侧面玻璃罩（左右上下四面，与支架深度一致）
  - 脏玻璃效果优化（移除动画，降低强度：opacity=0.04, grime=0.015）
  - Bloom辉光效果启用（UnrealBloomPass）
- 验收标准：
  - 电子屏与主体对齐
  - 霓虹灯有厚度感和辉光效果
  - 霓虹边框一体式无接缝
  - 玻璃罩完整包裹展示区
- **风险评估**: 中风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
- 完成状态：✅ 已完成
- 对应commit: `fdf0423`

#### - [x] 任务A.8：代码清理与UI优化
- **核心思想**: 移除2D降级方案，简化代码结构，优化视觉效果
- 交付物：
  - 删除2D组件（VendingMachine.vue, ProductSlot.vue）
  - 删除2D/3D切换按钮
  - 简化XinpinView.vue（只保留3D组件）
  - 更新index.ts导出（移除2D组件）
  - 移除底部footer渐变阴影效果
  - 移除外部box-shadow阴影
  - 品牌文字改为"CAOSENG @ LUGARDEN"
- 验收标准：
  - 只有3D模式，无切换按钮
  - 无多余阴影效果
  - 构建通过
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine.vue`（删除）
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/ProductSlot.vue`（删除）
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/index.ts`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/views/XinpinView.vue`
- 完成状态：✅ 已完成
- 对应commit: `51925f1`

#### - [x] 任务A.9：ProductModal统一风格与3D模型预览
- **核心思想**: 将ProductModal统一为项目通用Modal风格，并添加3D模型预览功能
- 交付物：
  - 统一Modal风格（白色渐变背景、1rem圆角、XMarkIcon关闭按钮）
  - 统一颜色系（蓝灰色调）
  - 诗歌正文居中对齐
  - 移除旧版复古说明书装饰（底部◆◇◆）
  - 添加水印"曹僧 Ⓒ 陆家花园"
  - 嵌入3D模型预览（Three.js场景，透明背景）
  - 模型自动旋转，支持用户拖动交互
  - 3D预览取代序号位置，紧凑布局（80px高度）
  - 材质修复逻辑与主体一致
- 验收标准：
  - Modal风格与项目其他Modal统一
  - 3D模型正确加载显示
  - 模型可交互旋转
- **风险评估**: 中风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/ProductModal.vue`
- 完成状态：✅ 已完成
- 对应commit: `0d9d8d8`

#### - [x] 任务A.10：VendingMachine3D视觉优化与背景渐变
- **核心思想**: 统一卡片样式、优化灯光辉光、添加同心矩形渐变背景
- 交付物：
  - 应用unified-content-card玻璃态卡片样式
  - Three.js场景背景改为64层同心矩形渐变（3:4比例）
    - 外层 #f5f1e8 → 第8层 #454442 → 中心 #0a0a0a
  - Bloom辉光参数优化（strength=0.1, radius=0.2, threshold=0.8）
  - 外部光源强度降低（避免过曝）
  - 相机设置为正面水平视角 (0, 0, 18)
  - XinpinView添加径向渐变背景
- 验收标准：
  - 卡片样式与项目统一
  - 渐变背景自然过渡
  - 辉光效果适中不过曝
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/components/VendingMachine3D.vue`
  - `lugarden_universal/frontend_vue/src/modules/caogong/xinpin/views/XinpinView.vue`
- 完成状态：✅ 已完成
- 对应commit: `0d9d8d8`

---

## 测试与验收
- 浏览器预览验证3D场景渲染正常
- 文字滚动无缝循环无跳帧

## 更新日志关联
- **预计更新类型**: 功能更新
- **更新目录**: `documentation/changelog/2025-12-03_曹僧宇宙Three.js引入探索_前端深度优化/`

## 注意事项
- Troika-three-text默认字体对部分中文字符支持有问题（如"一"）
- 滚动文字需要用两个Text对象实现真正无缝循环

## 当前状态
🔄 进行中

---
*本模板基于陆家花园项目Git开发指南创建（增强版）*
