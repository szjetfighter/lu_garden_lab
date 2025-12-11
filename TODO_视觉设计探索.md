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
