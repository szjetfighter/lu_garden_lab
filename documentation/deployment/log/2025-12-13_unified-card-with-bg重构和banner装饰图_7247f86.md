# 部署日志：unified-card-with-bg重构和banner装饰图

## 基本信息

- **部署时间**: 2025-12-13 12:32
- **关联commit**: `7247f86`
- **分支**: experimental → main
- **改动类型**: 仅前端

## 改动内容

### 任务B.9：unified-card-with-bg全局类

- 在 `components.css` 中创建 `unified-card-with-bg` 全局类
- 统一所有带背景图卡片的样式（背景渐变、遮罩、padding等）
- Zhou/Mao/Pending 卡片使用新类，删除重复样式
- UniverseCard 也重构使用 `unified-card-with-bg`

### 任务B.10：四宇宙banner装饰图

- Portal: `lu-banner.svg`
- Zhou: `zhou-banner.svg`
- Mao: `mao-banner.svg`
- Pending: `pending-banner.svg`

### banner滚动逻辑

- 二值状态：第一张显示，其他隐藏
- `progress > 0.01` → 飞出 + 淡出
- `progress ≤ 0.01` → 显示

## VPS部署命令

```bash
cd /var/www/lu_garden_lab
git pull origin main
cd lugarden_universal/frontend_vue && npm run build && cd ../..
docker-compose restart nginx
```

## 验证

- [ ] https://lugarden.space Portal页面banner显示
- [ ] Zhou/Mao/Pending banner显示
- [ ] 滑动时banner正确淡出
- [ ] 卡片样式统一

## 改动文件

- `lugarden_universal/frontend_vue/src/assets/styles/components.css`
- `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`
- `lugarden_universal/frontend_vue/src/modules/portal/components/UniverseCard.vue`
- `lugarden_universal/frontend_vue/src/modules/zhou/views/MainProjectSelection.vue`
- `lugarden_universal/frontend_vue/src/modules/mao/views/MainProjectSelection.vue`
- `lugarden_universal/frontend_vue/src/modules/pending/views/MainProjectSelection.vue`
- `lugarden_universal/frontend_vue/public/lu-banner.svg`
- `lugarden_universal/frontend_vue/public/zhou-banner.svg`
- `lugarden_universal/frontend_vue/public/mao-banner.svg`
- `lugarden_universal/frontend_vue/public/pending-banner.svg`
