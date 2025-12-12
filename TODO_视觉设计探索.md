# Portal视觉设计探索 TODO

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标
探索和实现Portal宇宙卡片的视觉增强设计，为每个宇宙卡片添加特色背景图，提升视觉识别度和用户体验。

## 范围与约束
- **范围**: Portal模块的UniverseCard组件视觉增强
- **约束**: 
  - 遵循Modular Monolith架构，资源放在模块内部
  - 保持文字可读性
  - 保持与现有设计系统的一致性

## 任务列表

> **任务编号规范**
> - 阶段A使用前缀"A"：任务A.1、任务A.2 …；步骤使用"A.1.x"的三级编号

---

### **阶段2025-12-11_A：卡片背景图实现**

#### - [x] 任务A.1：UniverseCard背景图功能实现
- **核心思想**: 为Portal宇宙卡片添加背景图支持，使用玻璃态+底图叠加方案，增强视觉识别度
- 交付物：
  - 背景图资源目录 `src/modules/portal/assets/images/`
  - UniverseCard组件backgroundImage prop支持
  - 内容区域磨砂遮罩效果
- 验收标准：
  - 周与春秋、毛小豆、匿腻溺三个宇宙各有独立背景图
  - 背景图清晰可见（透明度5%-10%）
  - 文字区域有磨砂遮罩确保可读性（80%白色）
  - 四边有背景图边框效果
- **风险评估**: 低风险，纯视觉增强，不影响功能
- 预期改动文件（预判）：
  - `src/modules/portal/assets/images/` - 新建目录
  - `src/modules/portal/components/UniverseCard.vue` - 添加背景图支持
  - `src/modules/portal/views/UniversePortal.vue` - 传入背景图
- 实际改动文件:
  - `src/modules/portal/assets/images/portal-mao@0.33x.png` - 毛小豆宇宙背景
  - `src/modules/portal/assets/images/portal-zhou@0.33x.png` - 周与春秋背景
  - `src/modules/portal/assets/images/portal-pending@0.33x.png` - pending状态背景
  - `src/modules/portal/components/UniverseCard.vue` - 添加backgroundImage prop、content-overlay遮罩层、相关CSS
  - `src/modules/portal/views/UniversePortal.vue` - 导入图片、getCardBackground函数、传入prop
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.1.1：创建 `src/modules/portal/assets/images/` 目录
  - [x] 步骤A.1.2：移动3张背景图到新目录
  - [x] 步骤A.1.3：UniverseCard添加backgroundImage prop
  - [x] 步骤A.1.4：实现卡片背景图CSS（玻璃态+底图叠加，透明度0.05-0.1）
  - [x] 步骤A.1.5：添加content-overlay包装层
  - [x] 步骤A.1.6：实现内容区域磨砂遮罩效果（80%白色+blur 8px）
  - [x] 步骤A.1.7：UniversePortal导入图片并实现getCardBackground映射
  - [x] 步骤A.1.8：调整卡片padding从--spacing-lg到--spacing-base（24px→16px）
  - [x] 步骤A.1.9：视觉效果验证和参数微调

#### - [x] 任务A.2：各宇宙MainProjectSelection背景图扩展
- **核心思想**: 将背景图功能扩展到各宇宙的子模块选择页面，保持视觉一致性
- 交付物：
  - zhou/mao/pending三个模块的MainProjectSelection背景图支持
- 验收标准：
  - 周与春秋练习卡片显示module-lianxi背景图
  - 摸诗卡片显示module-moshi背景图
  - NEW ARRIVAL卡片显示module-newarrival背景图
- **风险评估**: 低风险
- 实际改动文件:
  - `src/modules/zhou/views/MainProjectSelection.vue` - 添加背景图支持，按项目名称匹配
  - `src/modules/mao/views/MainProjectSelection.vue` - 添加背景图支持
  - `src/modules/pending/views/MainProjectSelection.vue` - 添加背景图支持（仅NEW ARRIVAL）
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.2.1：zhou模块添加content-overlay和背景图CSS
  - [x] 步骤A.2.2：mao模块添加content-overlay和背景图CSS
  - [x] 步骤A.2.3：pending模块添加content-overlay和背景图CSS
  - [x] 步骤A.2.4：修复zhou项目ID问题，改用项目名称匹配

#### - [x] 任务A.3：对角线渐变遮罩优化
- **核心思想**: 实现背景框和内容遮罩的对角线渐变效果，左上角融入背景，右下角展示背景图
- 交付物：
  - 背景框对角线渐变遮罩（右下0→左上1）
  - 内容遮罩伪元素实现对角线渐变消失效果
  - 统一去除造成偏移的装饰样式
- 验收标准：
  - 背景框遮罩与卡片边缘严丝合缝
  - 左上角文字区域融入背景，右下角背景图清晰
  - 所有卡片样式统一
- **风险评估**: 低风险
- 实际改动文件:
  - `src/modules/portal/components/UniverseCard.vue` - 背景框对角线渐变、内容遮罩伪元素、去除border和inset shadow
  - `src/assets/styles/components.css` - 统一unified-content-card去除border和inset shadow
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.3.1：统一内容遮罩层透明度为0.5
  - [x] 步骤A.3.2：背景框遮罩改为对角线渐变（右下0→左上1）
  - [x] 步骤A.3.3：内容遮罩改为::before伪元素，使用mask-image实现对角线渐变消失
  - [x] 步骤A.3.4：去除inset 0 1px 0内阴影（消除1px偏移）
  - [x] 步骤A.3.5：去除border: 1px solid（消除剩余偏移）
  - [x] 步骤A.3.6：统一components.css的unified-content-card样式

#### - [x] 任务A.4：对角线渐变效果统一推广与参数优化
- **核心思想**: 将对角线渐变效果推广到所有Selection卡片，并优化遮罩参数
- 交付物：
  - 所有Selection卡片统一对角线渐变效果
  - pending模块新增3张背景图（whoiszd、fourseasons、toxicology）
  - 内容遮罩透明度优化为1（完全不透明白色）
  - 背景框遮罩左上角优化为0.9
- 验收标准：
  - Portal、zhou、mao、pending四个模块视觉效果统一
  - 左上角保留微透效果（0.9），右下角背景图清晰
- **风险评估**: 低风险
- 实际改动文件:
  - `src/modules/portal/components/UniverseCard.vue` - 内容遮罩透明度1、背景框0.9
  - `src/modules/zhou/views/MainProjectSelection.vue` - 对角线渐变效果、背景框0.9
  - `src/modules/mao/views/MainProjectSelection.vue` - 对角线渐变效果、背景框0.9
  - `src/modules/pending/views/MainProjectSelection.vue` - 对角线渐变效果、新增3张背景图、背景框0.9
  - `src/modules/pending/assets/image/` - 新增whoiszd、fourseasons、toxicology背景图
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.4.1：内容遮罩透明度改为1（完全不透明白色）
  - [x] 步骤A.4.2：pending模块添加whoiszd、fourseasons、toxicology背景图
  - [x] 步骤A.4.3：pending全部4个卡片启用对角线渐变效果
  - [x] 步骤A.4.4：zhou模块CSS改为对角线渐变效果
  - [x] 步骤A.4.5：mao模块CSS改为对角线渐变效果
  - [x] 步骤A.4.6：背景框遮罩左上角统一优化为0.9

---

## 技术实现记录

### 核心CSS方案

```css
/* 卡片背景图 - 极低透明度覆盖层 */
.universe-card.has-bg-image {
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(248, 250, 252, 0.1) 100%),
    var(--card-bg-image) center/cover no-repeat;
}

/* 内容区域磨砂遮罩 */
.universe-card.has-bg-image .content-overlay {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  padding: 1rem;
}
```

### 图片映射逻辑

```typescript
const getCardBackground = (universe: Universe): string => {
  const bgMap: Record<string, string> = {
    'zhou': portalZhou,
    'maoxiaodou': portalMao
  }
  return bgMap[universe.id] || portalPending
}
```

---

## 更新日志关联
- **预计更新类型**: [视觉增强/用户体验优化]
- **更新目录**: `documentation/changelog/2025-12-11_Portal视觉设计探索/`
- **测试验证点**: 
  - [x] 三个宇宙卡片背景图正确显示
  - [x] 文字可读性良好
  - [x] 响应式布局正常

## 当前状态
✅ 阶段A已完成

---
*本TODO基于陆家花园项目技术笔记_视觉设计探索.md创建*
