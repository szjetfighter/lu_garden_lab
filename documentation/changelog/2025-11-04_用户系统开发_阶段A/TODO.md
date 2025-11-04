# 用户系统开发 - 阶段A：数据库设计与迁移（分离数据库方案）

> **前置条件**：路线图已完成并封版（包含3.3节数据库分离决策）
> **目标**：创建独立的auth.db，建立User和UserGongBiWork两张表
> **核心变更**：用户数据独立到auth.db，与lugarden.db分离
> **预计时间**：45分钟

## 📊 **关键设计决策**

### 0. 数据库分离策略（核心架构）

**为什么分离？** 详见路线图3.3节，核心原因：
1. **运维隔离**：auth.db故障不影响诗歌展示
2. **Git管理**：用户密码hash不入Git
3. **开源友好**：lugarden.db开箱即用
4. **备份分离**：静态内容(Git) vs 用户数据(定时备份)

**文件结构**：
```
data/
├── lugarden.db      # 内容数据库（Git跟踪）
└── auth.db          # 用户数据库（Git忽略，新建）

prisma/
├── schema.prisma       # lugarden.db的schema（已存在）
└── auth-schema.prisma  # auth.db的schema（新建）
```

**外键约束缺失的处理**：
- SQLite不支持跨数据库外键
- UserGongBiWork无法直接引用ZhouPoem和ZhouMapping
- **解决方案**：应用层校验 + 冗余关键字段（见下文表设计）

### 1. 完整记录共笔全流程数据

**共笔的完整链路**：
1. 用户读到原始诗歌（sourcePoem）
2. 用户输入感受（userInput）
3. 陆家明基于原诗+感受创作新诗（生成的poem）

**表结构设计原则**：
- ✅ **原始诗歌引用**：`sourcePoemId`存储ID（无外键）+ 冗余关键字段
- ✅ **答题组合引用**：`mappingId`存储ID（无外键）+ 冗余关键字段
- ✅ **用户输入**：`userInput` - 用户的感受
- ✅ **生成诗歌**：`poemTitle`, `poemContent`等 - 陆家明写了什么
- ✅ **Dify追溯**：`conversationId`, `messageId` - 可回溯对话
- ✅ **成本分析**：完整`usageMetadata`（JSON）

**为什么要冗余存储关键字段？**
- auth.db和lugarden.db分离，无法使用外键JOIN
- 冗余字段用于独立展示用户作品（无需连接lugarden.db）
- 作为历史快照：即使原诗被修改/删除，用户作品记录保持不变
- 存储成本极低：每条多100字节，10万条=10MB

### 2. 完整保存Dify Usage Metadata

**为什么要完整保存？**
- Dify API返回了丰富的usage数据（prompt_tokens、completion_tokens、total_price、latency等）
- 存储成本极低：10万行仅需35MB，100万行约1.2GB
- 真正的成本在API调用：100万次约$32,000（￥23万）
- 完整的metadata是未来成本分析、性能优化、用户行为分析的基础数据

**Dify实际返回的usage结构**（已验证）：
```json
{
  "prompt_tokens": 1691,
  "prompt_unit_price": "1.25",
  "prompt_price_unit": "0.000001",
  "prompt_price": "0.0015219",
  "completion_tokens": 3447,
  "completion_unit_price": "10",
  "completion_price_unit": "0.000001",
  "completion_price": "0.030345",
  "total_tokens": 5138,
  "total_price": "0.0318669",
  "currency": "USD",
  "latency": 30.482436504000134
}
```

**设计原则**：Dify提供的能力，不在数据库设计阶段舍弃。后续分析时可选择使用，但数据必须完整保留。

---

## 任务清单

### ✅ 已完成

#### - [x] 任务A.1：创建auth-schema.prisma并设计User和UserGongBiWork表结构

**完成时间**：2025-11-04

**交付物**：
- ✅ `lugarden_universal/application/prisma/auth-schema.prisma`（已创建）
- ✅ Schema验证通过：`npx prisma validate --schema prisma/auth-schema.prisma`

**验收确认**：
- ✅ auth-schema.prisma文件已创建
- ✅ datasource指向`file:../data/auth.db`
- ✅ generator output指向`../generated/auth-prisma`
- ✅ User model包含username（@unique）、password、createdAt
- ✅ UserGongBiWork model包含完整字段组（外部引用、冗余字段、用户输入、生成作品、Dify追溯）
- ✅ 正确的索引：userId、createdAt、conversationId
- ✅ Prisma验证通过

#### - [x] 任务A.2：执行数据库迁移并生成Prisma Client

**完成时间**：2025-11-04

**交付物**：
- ✅ Prisma迁移文件：`prisma/migrations/20251104021652_init_auth_db/`
- ✅ 新建的auth.db数据库文件：`data/auth.db`
- ✅ generated/auth-prisma Prisma Client

**验收确认**：
- ✅ 迁移执行成功，无报错
- ✅ `data/auth.db`文件已创建
- ✅ auth.db中存在User和UserGongBiWork两张表
- ✅ 表结构与auth-schema.prisma定义一致
- ✅ `generated/auth-prisma` Prisma Client已生成
- ✅ 验证脚本通过：User表0条记录，UserGongBiWork表0条记录

### 🔄 进行中
无

### ⏳ 待执行
无

**为什么存在**：
- 创建独立的auth.db数据库和schema
- User表存储用户凭证（用户名+密码）
- UserGongBiWork表存储用户的共笔作品（含冗余字段）

**交付物**：
- `lugarden_universal/application/prisma/auth-schema.prisma`（新建）

**执行步骤**：

- [ ] A.1.1：创建auth-schema.prisma文件，包含完整schema定义

  **文件位置**：`lugarden_universal/application/prisma/auth-schema.prisma`
  
  **完整内容**：
  ```prisma
  // 用户数据库 Schema - auth.db
  // 独立于lugarden.db，专门管理用户认证和作品数据
  
  datasource db {
    provider = "sqlite"
    url      = "file:../data/auth.db"
  }
  
  generator client {
    provider = "prisma-client-js"
    output   = "../generated/auth-prisma"
  }
  
  // 用户表
  model User {
    id        String   @id @default(uuid())
    username  String   @unique
    password  String               // bcrypt hash
    createdAt DateTime @default(now())
    
    gongBiWorks UserGongBiWork[]
  }
  
  // 用户共笔作品表
  model UserGongBiWork {
    id          String   @id @default(uuid())
    userId      String
    user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    // 外部引用（无外键约束，仅存ID）
    sourcePoemId String       // 关联到lugarden.db的ZhouPoem.id
    mappingId    String       // 关联到lugarden.db的ZhouMapping.id
    
    // 冗余字段（来自ZhouPoem）
    sourcePoemTitle String     // 原诗标题
    sourcePoemChapter String   // 章节（如"河仲"）
    
    // 冗余字段（来自ZhouMapping）
    mappingChapter String      // 章节（如"河仲"）
    mappingCombination String  // 答题组合（如"AA", "AB"）
    mappingMeaning String?     // 用户原型解读
    
    // 用户输入
    userInput   String    // 用户输入的50字感受
    
    // 陆家明生成的共笔作品
    poemTitle   String
    poemContent String
    poemQuote   String?   // 可选：前端支持无引文展示
    poemQuoteSource String?   // 可选：引文来源可能为空
    
    // Dify API追溯字段（必填，确保数据可追溯）
    conversationId  String
    messageId       String
    
    // 完整的Dify usage metadata (JSON)
    usageMetadata   String    // JSON格式存储完整usage数据
    
    createdAt   DateTime @default(now())
    
    @@index([userId])
    @@index([createdAt])
    @@index([conversationId])
  }
  ```

- [ ] A.1.2：验证schema语法
  ```bash
  cd lugarden_universal/application
  npx prisma validate --schema prisma/auth-schema.prisma
  ```

**验收标准**：
- [ ] auth-schema.prisma文件已创建
- [ ] datasource指向`file:../data/auth.db`
- [ ] generator output指向`../generated/auth-prisma`
- [ ] User model包含username（@unique）、password、createdAt
- [ ] UserGongBiWork model包含以下字段组：
  - [ ] 外部引用：sourcePoemId, mappingId（仅ID，无外键）
  - [ ] ZhouPoem冗余字段：sourcePoemTitle, sourcePoemChapter
  - [ ] ZhouMapping冗余字段：mappingChapter, mappingCombination, mappingMeaning?
  - [ ] 用户输入：userInput
  - [ ] 生成作品：poemTitle, poemContent, poemQuote?, poemQuoteSource?
  - [ ] Dify追溯：conversationId, messageId, usageMetadata
- [ ] 正确的索引：userId、createdAt、conversationId
- [ ] `npx prisma validate --schema prisma/auth-schema.prisma` 通过

**实际改动文件**：
- `lugarden_universal/application/prisma/auth-schema.prisma`（新建）

**重要提示**：
- ⚠️ **不修改schema.prisma**：lugarden.db保持不变
- ⚠️ **不在ZhouPoem/ZhouMapping添加反向关系**：跨数据库，不需要

---

#### - [ ] 任务A.2：执行数据库迁移并生成Prisma Client

**为什么存在**：
- 将auth-schema定义应用到auth.db
- 创建auth.db数据库文件
- 创建User和UserGongBiWork两张表
- 生成auth-prisma Client

**交付物**：
- Prisma迁移文件（`prisma/migrations/` 目录）
- 新建的auth.db数据库文件
- generated/auth-prisma Prisma Client

**执行步骤**：

- [ ] A.2.1：创建并执行迁移（针对auth.db）
  ```bash
  cd lugarden_universal/application
  npx prisma migrate dev --name init_auth_db --schema prisma/auth-schema.prisma
  ```

- [ ] A.2.2：验证迁移成功
  - 查看控制台输出，确认无错误
  - 检查`data/auth.db`文件是否已创建
  - 检查`prisma/migrations/`目录是否生成了新的迁移文件夹

- [ ] A.2.3：验证auth.db表结构
  ```bash
  cd lugarden_universal/application
  node -e "
  const { PrismaClient } = require('./generated/auth-prisma');
  const prisma = new PrismaClient();
  
  Promise.all([
    prisma.\$queryRaw\`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\`,
    prisma.\$queryRaw\`SELECT COUNT(*) as count FROM User\`,
    prisma.\$queryRaw\`SELECT COUNT(*) as count FROM UserGongBiWork\`
  ])
  .then(([tables, userCount, workCount]) => {
    console.log('✅ 数据库表:');
    tables.forEach(t => console.log('  -', t.name));
    console.log('\n📊 初始数据:');
    console.log('  User表记录数:', userCount[0].count);
    console.log('  UserGongBiWork表记录数:', workCount[0].count);
    return prisma.\$disconnect();
  })
  .catch(e => {
    console.error('❌ 错误:', e.message);
    prisma.\$disconnect();
  });
  "
  ```

**验收标准**：
- [ ] 迁移执行成功，无报错
- [ ] `data/auth.db`文件已创建
- [ ] auth.db中存在User和UserGongBiWork两张表
- [ ] 表结构与auth-schema.prisma定义一致
- [ ] `generated/auth-prisma` Prisma Client已生成
- [ ] 可以在代码中使用`require('./generated/auth-prisma')`

**实际改动文件**：
- `lugarden_universal/application/prisma/migrations/YYYYMMDDHHMMSS_init_auth_db/` （新增）
- `lugarden_universal/application/data/auth.db` （新增）
- `lugarden_universal/application/generated/auth-prisma/` （新增）

---

## 完成标准

- [x] 所有任务的执行步骤全部完成 ✅
- [x] 验收标准全部通过 ✅
- [x] 功能验证通过 ✅
- [x] 无遗留问题 ✅

**阶段A完成确认**：
- ✅ auth-schema.prisma已创建并验证通过
- ✅ auth.db已创建，包含User和UserGongBiWork两张表
- ✅ Prisma Client已生成到generated/auth-prisma
- ✅ Git跟踪策略已明确记录
- ✅ 预计45分钟，实际完成时间：30分钟

---

## 完成后操作

### Git跟踪策略决策记录

**决策**：初始化阶段将空的auth.db纳入Git跟踪

**理由**：
1. ✅ 开发友好：其他开发者clone后无需手动运行迁移
2. ✅ 状态干净：当前auth.db只有表结构，无用户数据
3. ✅ 快速启动：新开发环境可以直接启动

**风险控制**：
- ⚠️ VPS首次部署后，立即执行：`git update-index --skip-worktree data/auth.db`
- ⚠️ 确保VPS的auth.db不会被`git pull`覆盖
- ⚠️ 在Docker部署指南中新增"auth.db保护"章节

**Git跟踪文件**：
- ✅ `prisma/auth-schema.prisma` - schema定义
- ✅ `prisma/migrations/20251104021652_init_auth_db/` - 迁移文件
- ✅ `data/auth.db` - 空数据库（仅表结构）
- ❌ `generated/auth-prisma/` - 已在.gitignore中排除

- [x] 将本TODO移动到 `documentation/changelog/2025-11-04_用户系统开发_阶段A/TODO.md`
  
- [ ] 提交Git：
  ```bash
  git add prisma/auth-schema.prisma prisma/migrations/ .gitignore
  git commit -m "feat: 完成任务A.1-A.2 - 创建独立auth.db用户数据库

  - 新增auth-schema.prisma：独立用户数据库schema
  - 新增User表：username, password（bcrypt）
  - 新增UserGongBiWork表：用户共笔作品（含冗余字段）
  - 数据库分离：lugarden.db（静态内容）+ auth.db（用户数据）
  - 外键处理：应用层校验 + 冗余关键字段
  - 完整追溯：conversationId, messageId, usageMetadata
  - 更新.gitignore：auth.db不入Git
  
  任务文档：TODO_用户系统开发_阶段A.md"
  
  git push origin main
  ```
  
- [ ] 创建 `TODO_用户系统开发_阶段B.md`（后端API实现）

---

**当前状态：✅ 已完成**

*创建时间：2025-11-03*  
*更新时间：2025-11-04（阶段A完成）*
*完成时间：2025-11-04*
*预计45分钟，实际30分钟*

