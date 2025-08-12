# 陆家花园 统一后台（中央控制室）方案A实施 TODO（增强版）

> 🤖 AI 助手注意 (AI Assistant Attention)
> 在执行本文件中的任何任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标
以“统一后台 + 适配器模式”（方案A）实施"陆家花园项目发展路线图"第二阶段子阶段 A：统一管理后台开发，实现：
- 统一只读聚合（跨宇宙列表/详情）与顶部“宇宙切换器”
- 按宇宙逐步开放写能力（受特性开关与权限控制）
- 与现有“周春秋专用后台”灰度并行+可回退
- 统一契约与字段抽象、缓存策略、健康检查与可观测性

## 范围与约束
- 契约冻结（必须）:
  - 统一后台对外/对内契约：登录鉴权、宇宙切换、只读/读写边界
  - 契约参考：`documentation/backend/api-contracts.md`
- 字段映射（必须）:
  - 主宇宙层/子宇宙层字段抽象与映射策略
  - 参考：`documentation/backend/field-mapping.md`
- 风险与兼容（建议）:
  - 与“周春秋专用后台”并行灰度；保留兼容端点（no-op/redirect）并制定淘汰计划
- 健康检查（建议）:
  - 认证/缓存/数据库/适配器就绪摘要为健康项
- 缓存策略（建议）:
  - 只读接口缓存键命名与写后失效策略（跨宇宙读取一致性）
- 可观测性（可选）:
  - 最小指标集：RPS、P95、缓存命中率、错误率

## 任务列表

> 任务编号规范
> - 第一阶段使用前缀“1”：任务1.1、任务1.2 …；步骤使用“1.1.x”
> - 第二阶段使用前缀“2”：任务2.1、任务2.2 …；步骤使用“2.1.x”
> - 第三阶段使用前缀“3”：任务3.1、任务3.2 …；步骤使用“3.1.x”

### 第一阶段：架构基线与统一抽象（骨架先行）
- [ ] 任务1.1：定义 `UniverseAdapter` 与核心领域抽象
  - 交付物：
    - `UniverseAdapter` 最小方法集定义（列表/详情读取、写操作占位）
    - `ContentItem` 最小字段集（id/title/type/status/universeId/timestamps）
    - 适配器注册与选择机制设计
  - 验收：
    - 通过内部评审；形成书面接口说明并落盘
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/services/adapters/UniverseAdapter.js`
    - `lugarden_universal/application/src/services/adapters/index.js`
    - `lugarden_universal/application/src/services/mappers.js`
    - `documentation/backend/field-mapping.md`
  - 完成状态：🔄
  - （可选）执行步骤：
    - 步骤1.1.1：以 JSDoc/类型描述声明接口形状
    - 步骤1.1.2：定义 `ContentItem` 与跨宇宙必要元信息
    - 步骤1.1.3：实现适配器发现与选择（基于 `universeId`）

- [ ] 任务1.2：统一后台路由骨架与契约冻结
  - 交付物：
    - `/:universe/admin/api/...` 路由网关与控制器骨架（读/写占位）
    - 契约冻结记录（接口清单与状态码规范）
  - 验收：
    - 契约对齐至 `documentation/backend/api-contracts.md`；有自动化合同测试雏形
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/routes/admin.js`
    - `lugarden_universal/application/server.js`
    - `lugarden_universal/application/tests/admin-api.contract.test.js`
    - `documentation/backend/api-contracts.md`
  - 完成状态：🔄

### 第二阶段：只读聚合 MVP（跨宇宙列表/详情 + 宇宙切换器）
- [ ] 任务2.1：`ZhouAdapter` 只读实现
  - 交付物：
    - `ZhouAdapter` 支持列表、详情读取与基础映射
  - 验收：
    - 通过合同测试；列表/详情响应满足 `ContentItem` 最小集
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/services/adapters/ZhouAdapter.js`
    - `poeject_zhou_spring_autumn/data/**`
    - `lugarden_universal/application/tests/public-api.contract.test.js`
  - 完成状态：🔄

- [ ] 任务2.2：`MaoxiaodouAdapter` 只读实现
  - 交付物：
    - `MaoxiaodouAdapter` 支持列表、详情读取（只读即可）
  - 验收：
    - 合同测试通过；字段映射与 `ContentItem` 一致
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/services/adapters/MaoxiaodouAdapter.js`
    - `poeject_maoxiaodou_universe/data/**`
  - 完成状态：🔄

- [ ] 任务2.3：顶部“宇宙切换器”与只读视图
  - 交付物：
    - `admin.html` 宇宙切换器低保真实现
    - 提供 `/admin/universes` 列表端点
  - 验收：
    - 切换不同 `universeId` 能正确请求只读接口并渲染
  - 预期改动文件（预判）:
    - `lugarden_universal/public/admin.html`
    - `lugarden_universal/public/admin-styles.css`
    - `lugarden_universal/application/src/routes/admin.js`
  - 完成状态：🔄

- [ ] 任务2.4：缓存与一致性（读路径）
  - 交付物：
    - 缓存键命名规范（含 `universeId:type:id`）
    - 写后失效策略占位（MVP 可手动失效）
  - 验收：
    - 命中率指标可观测；缓存不影响正确性
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/utils/cache.js`
    - `lugarden_universal/application/src/routes/admin.js`
  - 完成状态：🔄

### 第三阶段：写能力最小集 + 权限与审计（灰度开启）
- [ ] 任务3.1：权限与会话统一
  - 交付物：
    - 登录鉴权流程对齐；最小权限模型（按宇宙/功能域）
  - 验收：
    - `tests/admin-auth.contract.test.js` 通过；未授权阻断写操作
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/middlewares/errorHandler.js`
    - `lugarden_universal/application/src/routes/admin.js`
    - `lugarden_universal/application/tests/admin-auth.contract.test.js`
  - 完成状态：🔄

- [ ] 任务3.2：写接口 MVP（受特性开关）
  - 交付物：
    - 针对单一宇宙（优先 Zhou）开放1-2个安全写接口（如状态变更）
    - 特性开关与回退脚本
  - 验收：
    - 写路径不破既有契约；可一键关闭
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/routes/admin.js`
    - `lugarden_universal/application/src/services/adapters/ZhouAdapter.js`
    - `lugarden_universal/application/.env[.example]`
  - 完成状态：🔄

- [ ] 任务3.3：审计日志与基础风控
  - 交付物：
    - 写操作审计记录（who/when/what/before-after）
  - 验收：
    - 审计可检索；异常操作可追踪
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/utils/*`
    - `lugarden_universal/application/prisma/schema.prisma`（如需）
  - 完成状态：🔄

### 第四阶段：兼容与灰度并行（双入口）
- [ ] 任务4.1：兼容端点与跳转策略
  - 交付物：
    - 旧入口 no-op/redirect；淘汰计划与时间表
  - 验收：
    - 现网按钮无 404；用户路径清晰
  - 预期改动文件（预判）:
    - `poeject_zhou_spring_autumn/archive/*`
    - `lugarden_universal/application/src/routes/admin.js`
  - 完成状态：🔄

- [ ] 任务4.2：灰度方案与回滚剧本
  - 交付物：
    - 双入口并行说明；回滚步骤脚本化
  - 验收：
    - 演练通过；回滚时间 < 10 分钟
  - 预期改动文件（预判）:
    - `lugarden_universal/launch/start*.bat`
    - `lugarden_universal/launch/stop.bat`
  - 完成状态：🔄

### 第五阶段：健康检查与可观测性
- [ ] 任务5.1：健康检查聚合端点
  - 交付物：
    - `/admin/health` 汇总认证/缓存/数据库/适配器状态
  - 验收：
    - 非 200 明确指出子系统异常
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/routes/admin.js`
  - 完成状态：🔄

- [ ] 任务5.2：基础指标埋点
  - 交付物：
    - RPS、P95、缓存命中率、错误率
  - 验收：
    - 指标可在控制台/日志汇总查看
  - 预期改动文件（预判）:
    - `lugarden_universal/application/src/middlewares/*`
    - `lugarden_universal/application/server.js`
  - 完成状态：🔄

### 第六阶段：测试覆盖与合同验证
- [ ] 任务6.1：合同测试完善
  - 交付物：
    - 读/写合同测试集、鉴权测试、缓存一致性测试
  - 验收：
    - `application/tests/*.contract.test.js` 全绿
  - 预期改动文件（预判）:
    - `lugarden_universal/application/tests/public-api.contract.test.js`
    - `lugarden_universal/application/tests/admin-api.contract.test.js`
    - `lugarden_universal/application/tests/admin-auth.contract.test.js`
  - 完成状态：🔄

- [ ] 任务6.2：E2E 验收
  - 交付物：
    - 按里程碑用例走通（宇宙切换、只读聚合、受限写）
  - 验收：
    - 关键路径稳定；回归无新增阻塞缺陷
  - 预期改动文件（预判）:
    - `lugarden_universal/application/tests/**`
  - 完成状态：🔄

### 第七阶段：文档与发布
- [ ] 任务7.1：文档与治理
  - 交付物：
    - 更新 `api-contracts.md`、`field-mapping.md`、运维手册、灰度与回滚说明
  - 验收：
    - 文档齐全、可依文档独立完成部署
  - 预期改动文件（预判）:
    - `documentation/backend/api-contracts.md`
    - `documentation/backend/field-mapping.md`
    - `documentation/docs-management-guide.md`
  - 完成状态：🔄

- [ ] 任务7.2：发布与公告
  - 交付物：
    - 版本说明、更新日志、对外公告
  - 验收：
    - 目录结构与模板一致；变更已签收
  - 预期改动文件（预判）:
    - `documentation/changelog/YYYY-MM-DD_统一后台方案A上线/更新日志.md`
  - 完成状态：🔄

### 任务块模板（复制使用）
#### 任务X.Y：[任务标题]
- 交付物：
  - [列出应产出的文件/接口/脚本/文档]
- 验收：
  - [列出可验证条件：页面可用、接口契约一致、特定用例通过等]
- 预期改动文件（预判）：
  - `path/to/fileA`
  - `path/to/fileB`
- 完成状态：🔄 进行中 / ✅ 已完成 / ❌ 遇到问题
- 独立审计意见（可选）：
  - 质量评级：优秀 / 良好 / 一般 / 待改进
  - 审计结论：[一句话结论]
- （可选）执行步骤：
  - 步骤X.Y.1：[具体步骤]
  - 步骤X.Y.2：[具体步骤]

## 测试与验收
- 合同测试（必须）:
  - 读/写契约一致性；鉴权与错误码校验；缓存一致性
- DB 写测试（建议）:
  - 以 `RUN_DB_WRITE_TESTS=1` 环境门控执行
- E2E 验收（建议）:
  - 读路径统一、宇宙切换可用、受限写能力可控

## 更新日志关联
- 预计更新类型: 架构重构/功能更新/项目治理
- 更新目录: `documentation/changelog/YYYY-MM-DD_统一后台方案A上线/`
- 更新日志文件: `更新日志.md`
- 测试验证点:
  - [ ] 跨宇宙只读聚合完成并有合同测试
  - [ ] 宇宙切换器可用且切换正确
  - [ ] 至少一个受控写接口灰度可用且可回退

## 注意事项
- 小步快跑，受特性开关保护；每步具备回退方案
- 保持 Git 原子提交与清晰说明（功能分支、合并前评审）
- 优先稳定读路径，再引入写能力

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/YYYY-MM-DD_统一后台方案A上线/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git
- [ ] 更新项目状态

## 当前状态
🔄 进行中

---
*本清单基于增强模板与“统一后台（中央控制室）决策”文档生成，用于“方案A实施”。*