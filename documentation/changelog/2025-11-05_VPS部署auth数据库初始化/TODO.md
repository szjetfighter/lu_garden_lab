# VPS部署auth数据库初始化 - TODO

**创建日期**: 2025-11-05  
**状态**: ✅ 已完成  
**负责人**: 西尔 + AI助手  
**关联项目**: 用户系统开发（阶段A-D的后续部署）

---

## 目标

将本地开发完成的用户系统（包含auth.db数据库）完整部署到VPS生产环境，确保：
1. auth.db在VPS上正常初始化
2. Dockerfile支持双Prisma客户端（lugarden.db + auth.db）
3. 用户注册、登录等功能在生产环境正常工作
4. 建立数据库文件的正确管理流程（gitignore）

---

## 背景

- **问题**: VPS只更新到10月31日，缺少11月4-5日开发的用户系统（auth.db、用户认证、共笔功能、合规功能）
- **挑战**: 
  - auth.db是新数据库，VPS上不存在
  - 原Dockerfile只生成一个Prisma客户端，需要支持双客户端
  - 生产环境数据库文件权限问题
  - git管理策略（数据库文件不应长期追踪）

---

## 范围与约束

### 包含内容
- ✅ 本地准备空auth.db并提交git（一次性操作）
- ✅ 更新Dockerfile支持auth-schema.prisma
- ✅ VPS拉取代码并构建新镜像
- ✅ 修复auth.db权限问题
- ✅ 功能验证（注册、登录、实时校验）
- ✅ 建立gitignore规则（停止追踪auth.db）

### 不包含内容
- ❌ 用户数据迁移（生产环境是全新的auth.db）
- ❌ 数据库表结构变更（使用db push直接同步schema）
- ❌ 性能优化（后续单独处理）

### 技术约束
- VPS资源：2c2g（有限资源，需注意构建时间）
- Docker Compose V2.27.1 Standalone版（命令格式`docker-compose`）
- 用户使用GUI工具（ACC FTP + SSH）进行运维

---

## 任务列表

### 阶段A：本地准备

#### ✅ 任务A.1：备份本地开发数据
- **执行时间**: 2025-11-05 13:47
- **操作**:
  ```bash
  cd lugarden_universal/application/data
  cp auth.db auth.db.bak
  ```
- **结果**: 备份文件264KB

#### ✅ 任务A.2：生成空auth.db
- **执行时间**: 2025-11-05 13:48
- **操作**:
  ```bash
  cd lugarden_universal/application
  rm data/auth.db
  npx prisma db push --schema=prisma/auth-schema.prisma --accept-data-loss
  ```
- **结果**: 生成空auth.db，只有schema结构，无数据

#### ✅ 任务A.3：提交空auth.db到git
- **执行时间**: 2025-11-05
- **操作**:
  ```bash
  git add lugarden_universal/application/data/auth.db
  git commit -m "feat: 添加空的auth.db供VPS初始化使用"
  ```
- **Commit**: 48862b7

#### ✅ 任务A.4：提交前端dist
- **执行时间**: 2025-11-05
- **操作**:
  ```bash
  git add lugarden_universal/frontend_vue/dist/
  git commit -m "build: 重新构建前端包含用户注册体验优化"
  ```
- **Commit**: bf3a541
- **变更**: 35个文件，411行增删

#### ✅ 任务A.5：推送到远程
- **执行时间**: 2025-11-05
- **操作**: `git push`
- **结果**: 17个commits，373KB上传成功

---

### 阶段B：Dockerfile更新

#### ✅ 任务B.1：更新Dockerfile支持双Prisma客户端
- **执行时间**: 2025-11-05
- **文件位置**: `VPS_review/Dockerfile`
- **关键修改**:
  ```dockerfile
  # 生成两个数据库的Prisma客户端
  RUN npx prisma generate --schema=prisma/schema.prisma
  RUN npx prisma generate --schema=prisma/auth-schema.prisma
  ```
- **备份**: `VPS_review/Dockerfile.bak`（原版61行）
- **新版**: `VPS_review/Dockerfile`（62行）

#### ✅ 任务B.2：FTP上传Dockerfile到VPS
- **执行时间**: 2025-11-05 13:43
- **工具**: ACC FTP功能
- **目标路径**: `/root/lu_garden_lab/lugarden_universal/application/Dockerfile`
- **验证**: `grep -n "prisma generate" Dockerfile` 看到两行

---

### 阶段C：VPS部署

#### ✅ 任务C.1：拉取最新代码
- **执行时间**: 2025-11-05 14:02 (VPS时间06:02)
- **操作**: `git pull`
- **结果**: 
  - 拉取474个对象，500.46KB
  - 更新82f9fae..bf3a541
  - 102个文件变更

#### ✅ 任务C.2：备份旧镜像
- **执行时间**: 2025-11-05
- **操作**:
  ```bash
  docker tag lu_garden_lab-app:latest lu_garden_lab-app:backup-20251105
  ```
- **旧镜像**: 3656a35c395c (327MB, 4天前)

#### ✅ 任务C.3：重新构建镜像
- **执行时间**: 2025-11-05
- **操作**: `docker-compose build app`
- **耗时**: 57.5秒
- **关键步骤**:
  - `npx prisma generate --schema=prisma/schema.prisma` (6.9s)
  - `npx prisma generate --schema=prisma/auth-schema.prisma` (5.6s) ← 新增
- **新镜像**: c88d1a50d6a9 (348MB, +21MB)

#### ✅ 任务C.4：重启服务
- **执行时间**: 2025-11-05 14:02
- **操作**: `docker-compose up -d`
- **结果**: 
  - lugarden-app: Healthy (31.3s后健康)
  - lugarden-nginx: Started
  - lugarden-certbot: Running

---

### 阶段D：问题排查与修复

#### ✅ 任务D.1：发现auth.db权限问题
- **问题**: 注册失败，报错"attempt to write a readonly database"
- **原因**: git拉取的auth.db权限不对，容器内nodejs用户无法写入

#### ✅ 任务D.2：修复权限
- **执行时间**: 2025-11-05 14:07
- **操作**:
  ```bash
  chmod 666 lugarden_universal/application/data/auth.db
  docker-compose restart app
  ```
- **结果**: 权限修复，注册功能正常

---

### 阶段E：功能验证

#### ✅ 任务E.1：健康检查
- **命令**: `curl http://localhost:3000/api/health`
- **结果**: ✅ 正常，lugarden.db连接正常

#### ✅ 任务E.2：用户名校验API测试
- **命令**: `curl "http://localhost:3000/api/auth/check-username?username=test"`
- **结果**: ✅ 正常，返回`{"available":true,"message":"用户名可用"}`

#### ✅ 任务E.3：浏览器注册测试
- **操作**: 在 https://lugarden.space 注册账号"lujiaming"
- **结果**: ✅ 成功
  - 用户名实时校验显示绿色"用户名可用"
  - 注册成功
  - 自动登录
  - 进入"我的作品"页面

---

### 阶段F：善后工作 ✅

#### ✅ 任务F.1：本地恢复开发数据
- **执行时间**: 2025-11-05 14:15
- **操作**:
  ```bash
  cp lugarden_universal/application/data/auth.db.bak lugarden_universal/application/data/auth.db
  ```
- **结果**: ✅ 开发数据已恢复（264KB，包含开发测试用户）

#### ✅ 任务F.2：停止追踪auth.db
- **执行时间**: 2025-11-05 14:15
- **操作**:
  ```bash
  git rm --cached lugarden_universal/application/data/auth.db
  ```
- **结果**: ✅ 已从Git索引移除

#### ✅ 任务F.3：添加gitignore规则
- **执行时间**: 2025-11-05 14:16
- **操作**:
  ```bash
  echo "" >> .gitignore
  echo "# 数据库文件（包含用户数据，不应提交）" >> .gitignore
  echo "lugarden_universal/application/data/auth.db" >> .gitignore
  echo "lugarden_universal/application/data/auth.db-journal" >> .gitignore
  ```
- **结果**: ✅ gitignore规则已添加

#### ✅ 任务F.4：提交gitignore
- **执行时间**: 2025-11-05 14:16
- **操作**:
  ```bash
  git add .gitignore
  git commit -m "chore: 停止追踪auth.db，避免覆盖生产数据"
  git push
  ```
- **结果**: 
  - ✅ Commit 9faf9e8
  - ✅ 推送成功，2个文件变更，4行新增

#### ✅ 任务F.5：验证安全性
- **执行时间**: 2025-11-05 14:17
- **操作**:
  ```bash
  # 修改auth.db，确认Git不再追踪
  echo "test" >> lugarden_universal/application/data/auth.db
  git status | grep auth.db
  ```
- **结果**: ✅ 无输出，说明Git不再追踪auth.db，安全性验证通过

---

## 测试与验收

### 功能测试
- ✅ 用户注册：成功创建账号"lujiaming"
- ✅ 用户名实时校验：显示绿色"用户名可用"
- ✅ 自动登录：注册后自动登录
- ✅ 我的作品页面：正常显示用户信息
- ✅ auth.db写入：数据成功写入数据库

### 技术验证
- ✅ 双Prisma客户端：lugarden.db和auth.db都正常
- ✅ Docker镜像：新镜像348MB，包含auth-prisma
- ✅ 健康检查：/api/health返回正常
- ✅ API端点：/api/auth/check-username正常响应

### 回滚准备
- ✅ 备份镜像：lu_garden_lab-app:backup-20251105 (327MB)
- ✅ 保留期：建议1-2周后删除
- ✅ 回滚命令：
  ```bash
  docker-compose down
  docker tag lu_garden_lab-app:backup-20251105 lu_garden_lab-app:latest
  docker-compose up -d
  ```

---

## 技术细节

### Dockerfile关键变更
- **Before**: 只生成1个Prisma客户端（schema.prisma）
- **After**: 生成2个Prisma客户端
  - `prisma/schema.prisma` → lugarden.db
  - `prisma/auth-schema.prisma` → auth.db

### 数据库权限
- **问题**: Git拉取的文件默认权限可能不允许容器写入
- **解决**: `chmod 666 auth.db`
- **影响**: 只需修复一次，以后auth.db不再通过git管理

### Git管理策略
- **短期**: auth.db提交到git（仅用于VPS初始化）
- **长期**: 
  - 停止追踪auth.db
  - Schema变化通过migration管理
  - 数据库文件永远不提交

---

## 经验教训

### ✅ 做得好的地方
1. **备份优先**: 先备份旧镜像再构建新的
2. **分步验证**: 每个阶段完成后立即验证
3. **权限问题快速定位**: 通过日志准确找到错误原因
4. **GUI工具适配**: 考虑用户不熟悉Linux，使用ACC工具进行运维

### ⚠️ 需要改进的地方
1. **权限预判**: 应该在部署前就预测到git拉取文件的权限问题
2. **文档先行**: Dockerfile变更应该先更新文档再操作
3. **镜像命名**: docker-compose生成的镜像名`lu_garden_lab-app`与预期`lugarden-app`不一致，造成困惑

### 📝 后续规范
1. **数据库文件管理**: 
   - 永远不提交.db文件到git
   - Schema变化通过`prisma migrate`管理
   - 生产环境使用`prisma migrate deploy`应用迁移
2. **Dockerfile管理**:
   - 放在`VPS_review/`目录作为本地备份
   - 需要更新时FTP上传
   - 不纳入git（基础设施配置）
3. **部署流程**:
   - 本地开发 → 测试 → git push
   - VPS: git pull → docker-compose build → docker-compose up -d
   - 验证 → 保留备份镜像1-2周

---

## 关联文档

- `TODO_auth_db_部署准备.md`（操作指南，完成后可删除）
- `documentation/changelog/2025-11-05_用户注册体验优化/`（本次部署的功能内容）
- `documentation/changelog/2025-11-04_用户系统开发_阶段A-D/`（用户系统开发历史）
- `.cursor/rules/production-vps-workflow.mdc`（VPS运维流程规范）

---

## 更新日志关联

本次部署对应的更新日志文件：`更新日志.md`（待创建）

---

## 注意事项

1. **备份镜像**: lu_garden_lab-app:backup-20251105 建议保留1-2周
2. **本地善后**: 完成阶段F任务（恢复数据+gitignore）
3. **监控观察**: 观察生产环境1-2天，确认无异常
4. **TODO清理**: `TODO_auth_db_部署准备.md`可以删除

---

## 完成后的操作

- ✅ 创建本TODO文档
- ✅ 创建详细的更新日志
- ✅ 完成本地善后工作（阶段F）
- ✅ 删除临时TODO文档

---

## 当前状态

✅ **全部完成** (2025-11-05 14:20)

### 生产环境状态
- 服务状态：✅ 正常运行
- 用户功能：✅ 注册、登录正常
- 实时校验：✅ 正常工作
- Docker镜像：✅ 已更新到最新版（348MB，支持双数据库）
- 数据库：✅ auth.db + lugarden.db都正常

### 本地环境状态
- 开发数据：✅ 已恢复（auth.db.bak → auth.db）
- Git管理：✅ auth.db已停止追踪
- 安全防护：✅ gitignore已配置，不会误提交

### 文档状态
- ✅ TODO.md：完整记录所有操作
- ✅ 更新日志.md：详细的技术文档
- ✅ 临时文档：已清理

### 项目状态
**🎉 本次VPS部署auth数据库初始化工作已全部完成！**

---

**部署负责人**: 西尔  
**AI协作**: Claude (Cursor AI)  
**完成时间**: 2025-11-05 14:20  
**总耗时**: 约2.5小时（包括问题排查和文档编写）

