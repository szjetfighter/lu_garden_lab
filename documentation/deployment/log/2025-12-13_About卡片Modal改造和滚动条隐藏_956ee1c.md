# 部署日志：About卡片Modal改造 + 所有Modal隐藏滚动条

## 基本信息

- **部署时间**: 2025-12-13 13:02
- **关联commit**: `956ee1c`
- **分支**: experimental → main
- **改动类型**: 仅前端

## 改动内容

### 任务B.11：About卡片改为Modal弹窗

- 解决About卡片放入Swiper后无法拖动的问题
- 技术探索：`touch-action: pan-y` 和 `swiper-no-swiping` 均失败
- 最终方案：展开内容改为Modal弹窗，使用Teleport渲染到body
- About卡片放入Swiper紧随项目卡片，点击打开Modal

### 任务B.12：所有Modal隐藏滚动条

统一8个Modal组件的滚动条样式：
- `scrollbar-width: none` (Firefox)
- `-ms-overflow-style: none` (IE/Edge)
- `::-webkit-scrollbar { display: none }` (Chrome/Safari)

涉及文件：
- AboutExpandableCard.vue
- AboutModal.vue
- PoemViewer.vue
- ToxicologyReportModal.vue
- AboutAuthor.vue (fourseasons)
- AboutAuthor.vue (toxicology)
- ProductModal.vue
- MyWorksView.vue

## VPS部署命令

```bash
cd /var/www/lu_garden_lab
git pull origin main
cd lugarden_universal/frontend_vue && npm run build && cd ../..
```

## 验证

- [ ] Zhou页面About卡片紧随项目卡片
- [ ] 点击About打开Modal弹窗
- [ ] Modal内容可滚动但无滚动条
- [ ] Swiper可正常拖动
