# 部署日志

> **文件命名**: `YYYY-MM-DD_部署描述_commit短hash.md`
> **存放位置**: `documentation/deployment/log/`

---

> **部署时间**: YYYY-MM-DD HH:MM
> **部署环境**: VPS (lugarden.space)
> **关联commit**: [commit hash]

## 部署内容

[简要描述本次部署的内容]

## 部署步骤

```bash
# 1. 拉取代码
git pull

# 2. 前端构建（如有前端变更）
cd lugarden_universal/frontend_vue
npm run build
cd ../..

# 3. 后端重建（如有后端变更）
docker-compose down
docker-compose build --no-cache app
docker-compose up -d

# 4. 验证
docker-compose ps
curl -s https://lugarden.space/api/health
```

## 执行记录

| 步骤 | 命令 | 结果 |
|------|------|------|
| git pull | `git pull` | ✅/❌ |
| 前端构建 | `npm run build` | ✅/❌ (耗时: Xs) |
| 容器重建 | `docker-compose build` | ✅/❌ |
| 启动服务 | `docker-compose up -d` | ✅/❌ |
| 健康检查 | `curl .../api/health` | ✅/❌ |

## 验证结果

- [ ] 主站访问正常 (https://lugarden.space)
- [ ] API健康检查通过
- [ ] 新功能验证通过
- [ ] 移动端显示正常

## 问题与解决

[如有问题记录在此，无则删除此节]

---
*模板位置: documentation/templates/部署日志_TEMPLATE.md*
