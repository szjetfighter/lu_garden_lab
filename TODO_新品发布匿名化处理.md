# TODO：新品发布匿名化处理

> **背景**：曹僧撤回了对新品发布功能的授权，需要对该模块进行匿名化处理和隐藏
> **创建时间**：2025-12-04
> **关联模块**：xinpin（3D售货机）

---

## 任务列表

### A. 模块迁移与隐藏

#### - [x] 任务A.1：路径迁移至pending目录
- **核心思想**: 将xinpin模块从caogong命名空间迁移到pending，为后续匿名化做准备
- 交付物：
  - 目录迁移：`modules/caogong/xinpin` → `modules/pending/xinpin`
  - 路由更新：`/caogong/xinpin` → `/pending/xinpin`
  - 删除空的caogong目录
- 验收标准：
  - 类型检查通过
  - 构建成功
  - 新路径可访问
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/pending/xinpin/` (整个目录)
  - `lugarden_universal/frontend_vue/src/router/index.ts`
- 完成状态：✅ 已完成

#### - [x] 任务A.2：诗歌内容字符池随机化
- **核心思想**: 将所有硬编码诗歌文字替换为字符池动态随机生成，每次刷新页面内容不同
- 交付物：
  - `utils/randomFill.ts` - 字符池（从原素材提取）+ 随机填充函数
  - `data/skeleton.ts` - 长度骨架（保留原结构：14个产品、每行字数）
  - `data/products.ts` - 改为动态生成，314行诗歌 → 46行生成器
  - 滚动文字格式：`NEW ARRIVAL ◆ [产品名◇连接] _◆ ◆ ◆_`
  - 弹窗标题与滚动条对应（统一使用catalogName）
- 验收标准：
  - 每次刷新页面，所有文字都是新的随机组合
  - 原诗歌内容完全消除
  - 滚动条产品名与点击后弹窗标题一致
- **风险评估**: 低风险
- 实际改动文件:
  - `lugarden_universal/frontend_vue/src/modules/pending/xinpin/utils/randomFill.ts` (新建)
  - `lugarden_universal/frontend_vue/src/modules/pending/xinpin/data/skeleton.ts` (新建)
  - `lugarden_universal/frontend_vue/src/modules/pending/xinpin/data/products.ts`
  - `lugarden_universal/frontend_vue/src/modules/pending/xinpin/components/VendingMachine3D.vue`
  - `lugarden_universal/frontend_vue/src/modules/pending/xinpin/components/ProductModal.vue`
- 完成状态：✅ 已完成

---

## 后续任务（待规划）

- [ ] 移除导航入口
- [ ] 类型名匿名化（CaogongProduct → ?）
- [ ] 评估是否保留路由或完全隐藏

---

## 注意事项

- 代码逻辑保留，仅做路径和命名调整
- 技术积累（WebGL优化、Three.js经验）保留在技术笔记中
