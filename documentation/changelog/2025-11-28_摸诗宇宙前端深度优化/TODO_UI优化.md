# 摸诗UI优化 TODO

> **🤖 AI 助手注意**
> 在执行本文件中的任何任务前，必须先阅读 `documentation/ai-collaboration-guide.md`

---

## 任务列表

### - [x] 任务A.10：ULTRA WIN特效优化

- **核心思想**: 手机端ULTRA WIN文字不够醒目，需要增强可见性
- 交付物：
  - 字体颜色调深（同色系内，从亮金到深琥珀金）
  - 随机缩放效果增强
- 验收标准：
  - 手机端ULTRA WIN文字清晰可辨
  - 缩放动画更加明显
- **风险评估**: 低
- 实际改动文件:
  - `frontend_vue/src/modules/moshi/components/WinModal.vue`
- 完成状态：✅ 已完成
- 执行步骤：
  - [x] 步骤A.10.1：字体颜色从#fbbf24改为#d97706
  - [x] 步骤A.10.2：random-scale范围从0.95-1.15扩大到0.85-1.25
