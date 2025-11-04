# 用户系统开发 - 阶段B：后端API实现

> **前置条件**：阶段A已完成（auth.db和schema已创建）
> **目标**：实现完整的用户认证和共笔作品管理API
> **预计时间**：2小时

---

## 📊 核心架构

### 技术栈
- **bcrypt**：密码加密（salt rounds = 10）
- **jsonwebtoken**：JWT生成与验证（有效期7天）
- **Express middleware**：认证拦截
- **Prisma Client (auth-prisma)**：数据库操作

### 目录结构
```
application/src/
├── middlewares/
│   └── auth.js              # 认证中间件（新增）
├── routes/
│   └── auth.js              # 认证路由（新增）
├── services/
│   └── authService.js       # 认证业务逻辑（新增）
└── utils/
    ├── password.js          # bcrypt工具（新增）
    └── jwt.js               # JWT工具（新增）
```

---

## 任务清单

### ✅ 已完成
无

### 🔄 进行中
无

### ⏳ 待执行

#### - [ ] 任务B.1：实现密码加密工具

**为什么存在**：
- 密码不能明文存储（法律要求）
- 使用bcrypt行业标准加密

**交付物**：
- `src/utils/password.js`

**功能**：
```javascript
// hashPassword(plainPassword) -> hashedPassword
// comparePassword(plainPassword, hashedPassword) -> boolean
```

**执行步骤**：

- [ ] B.1.1：安装bcrypt依赖
  ```bash
  cd lugarden_universal/application
  npm install bcrypt
  ```

- [ ] B.1.2：创建password.js工具文件
  
  **文件位置**：`src/utils/password.js`
  
  **功能要求**：
  - `hashPassword(plainPassword)`：返回bcrypt hash
  - `comparePassword(plainPassword, hashedPassword)`：返回boolean
  - salt rounds = 10

- [ ] B.1.3：测试密码加密工具
  ```bash
  node -e "
  const { hashPassword, comparePassword } = require('./src/utils/password.js');
  
  (async () => {
    const hash = await hashPassword('test123');
    console.log('Hash:', hash);
    
    const match = await comparePassword('test123', hash);
    console.log('Match:', match);
    
    const notMatch = await comparePassword('wrong', hash);
    console.log('Not Match:', notMatch);
  })();
  "
  ```

**验收标准**：
- [ ] bcrypt已安装
- [ ] password.js文件已创建
- [ ] hashPassword和comparePassword函数正常工作
- [ ] 测试通过：正确密码返回true，错误密码返回false

---

#### - [ ] 任务B.2：实现JWT工具

**为什么存在**：
- 生成和验证JWT令牌
- 实现无状态认证

**交付物**：
- `src/utils/jwt.js`
- `.env`新增JWT_SECRET

**功能**：
```javascript
// generateToken(payload) -> token
// verifyToken(token) -> payload or null
```

**执行步骤**：

- [ ] B.2.1：安装jsonwebtoken依赖
  ```bash
  cd lugarden_universal/application
  npm install jsonwebtoken
  ```

- [ ] B.2.2：在.env中添加JWT_SECRET
  ```bash
  # 在.env文件中添加：
  JWT_SECRET=your_random_secret_key_here_change_in_production
  ```

- [ ] B.2.3：创建jwt.js工具文件
  
  **文件位置**：`src/utils/jwt.js`
  
  **功能要求**：
  - `generateToken(payload)`：返回JWT token（有效期7天）
  - `verifyToken(token)`：返回payload或null
  - 从process.env.JWT_SECRET读取密钥

- [ ] B.2.4：测试JWT工具
  ```bash
  node -e "
  const { generateToken, verifyToken } = require('./src/utils/jwt.js');
  
  const token = generateToken({ userId: 'test-id', username: 'test' });
  console.log('Token:', token);
  
  const payload = verifyToken(token);
  console.log('Payload:', payload);
  
  const invalid = verifyToken('invalid.token.here');
  console.log('Invalid:', invalid);
  "
  ```

**验收标准**：
- [ ] jsonwebtoken已安装
- [ ] .env中已添加JWT_SECRET
- [ ] jwt.js文件已创建
- [ ] generateToken和verifyToken函数正常工作
- [ ] 测试通过：有效token返回payload，无效token返回null

---

#### - [ ] 任务B.3：实现认证中间件

**为什么存在**：
- 统一的JWT验证逻辑
- 保护需要登录的API端点

**交付物**：
- `src/middlewares/auth.js`

**功能**：
```javascript
// requireAuth(req, res, next)
// 从请求头获取token，验证后将userId挂载到req.user
```

**执行步骤**：

- [ ] B.3.1：创建middlewares目录（如不存在）
  ```bash
  mkdir -p src/middlewares
  ```

- [ ] B.3.2：创建auth.js中间件文件
  
  **文件位置**：`src/middlewares/auth.js`
  
  **功能要求**：
  - 从`Authorization: Bearer <token>`获取token
  - 调用`verifyToken(token)`验证
  - 验证通过：将userId挂载到`req.userId`，调用`next()`
  - 验证失败：返回401 Unauthorized

**验收标准**：
- [ ] auth.js文件已创建
- [ ] requireAuth中间件实现正确
- [ ] 能正确处理有效token、无效token、缺失token三种情况

---

#### - [ ] 任务B.4：实现用户注册API

**为什么存在**：
- 让用户可以创建账户

**交付物**：
- `POST /api/auth/register` API

**执行步骤**：

- [ ] B.4.1：创建authService.js服务层
  
  **文件位置**：`src/services/authService.js`
  
  **功能**：
  ```javascript
  // registerUser({ username, password })
  // - 检查用户名是否已存在
  // - 密码加密
  // - 创建User记录
  // - 返回用户信息（不含密码）
  ```

- [ ] B.4.2：创建auth.js路由文件
  
  **文件位置**：`src/routes/auth.js`
  
  **注册API**：
  ```javascript
  POST /api/auth/register
  Body: { username, password, confirmPassword }
  
  验证规则：
  - username：3-20字符，唯一
  - password：至少6字符
  - confirmPassword：与password一致
  
  返回：
  - 成功：{ success: true, user: { id, username, createdAt } }
  - 失败：{ success: false, error: "错误信息" }
  ```

- [ ] B.4.3：在server.js中注册auth路由
  ```javascript
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  ```

- [ ] B.4.4：测试注册API
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","password":"test123","confirmPassword":"test123"}'
  ```

**验收标准**：
- [ ] authService.js已创建
- [ ] auth.js路由已创建
- [ ] 注册API正常工作
- [ ] 验证规则正确执行
- [ ] 密码加密后存储
- [ ] 用户名唯一性检查有效
- [ ] 返回格式正确

---

#### - [ ] 任务B.5：实现用户登录API

**为什么存在**：
- 验证用户身份，颁发JWT

**交付物**：
- `POST /api/auth/login` API

**执行步骤**：

- [ ] B.5.1：在authService.js添加loginUser函数
  ```javascript
  // loginUser({ username, password })
  // - 查找用户
  // - 验证密码
  // - 生成JWT
  // - 返回token和用户信息
  ```

- [ ] B.5.2：在auth.js路由添加登录端点
  ```javascript
  POST /api/auth/login
  Body: { username, password }
  
  返回：
  - 成功：{ success: true, token, user: { id, username, createdAt } }
  - 失败：{ success: false, error: "用户名或密码错误" }
  ```

- [ ] B.5.3：测试登录API
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","password":"test123"}'
  ```

**验收标准**：
- [ ] loginUser函数已实现
- [ ] 登录API正常工作
- [ ] 正确密码返回token
- [ ] 错误密码返回错误信息
- [ ] 不泄露敏感信息（统一返回"用户名或密码错误"）

---

#### - [ ] 任务B.6：实现保存共笔API

**为什么存在**：
- 登录后保存共笔内容到数据库

**交付物**：
- `POST /api/my-works/save` API（需要requireAuth）

**执行步骤**：

- [ ] B.6.1：创建myWorksService.js服务层
  
  **文件位置**：`src/services/myWorksService.js`
  
  **功能**：
  ```javascript
  // saveGongBiWork({ userId, ...workData })
  // - 验证必填字段
  // - 从lugarden.db查询原诗和mapping信息（冗余字段）
  // - 创建UserGongBiWork记录
  // - 返回保存的作品
  ```

- [ ] B.6.2：创建myWorks.js路由文件
  
  **文件位置**：`src/routes/myWorks.js`
  
  **保存API**：
  ```javascript
  POST /api/my-works/save
  Headers: Authorization: Bearer <token>
  Body: {
    sourcePoemId,
    mappingId,
    userInput,
    poemTitle,
    poemContent,
    poemQuote?,
    poemQuoteSource?,
    conversationId,
    messageId,
    usageMetadata  // JSON对象
  }
  
  返回：
  - 成功：{ success: true, work: { id, ...workData } }
  - 失败：{ success: false, error: "错误信息" }
  ```

- [ ] B.6.3：在server.js中注册myWorks路由
  ```javascript
  const myWorksRoutes = require('./src/routes/myWorks');
  app.use('/api/my-works', myWorksRoutes);
  ```

- [ ] B.6.4：测试保存共笔API
  ```bash
  # 先登录获取token
  TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","password":"test123"}' \
    | jq -r '.token')
  
  # 保存共笔
  curl -X POST http://localhost:3000/api/my-works/save \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "sourcePoemId": "poem-id-here",
      "mappingId": "mapping-id-here",
      "userInput": "测试用户输入",
      "poemTitle": "测试诗歌",
      "poemContent": "测试内容",
      "conversationId": "conv-123",
      "messageId": "msg-456",
      "usageMetadata": "{\"total_tokens\":100}"
    }'
  ```

**验收标准**：
- [ ] myWorksService.js已创建
- [ ] myWorks.js路由已创建
- [ ] 保存API需要认证（无token返回401）
- [ ] 从lugarden.db正确查询并冗余字段
- [ ] UserGongBiWork记录正确创建
- [ ] 测试通过：可以成功保存共笔作品

**关键实现细节**：
```javascript
// 从lugarden.db查询原诗和mapping，填充冗余字段
const { PrismaClient: LugardenPrisma } = require('../generated/prisma');
const lugardenDb = new LugardenPrisma();

const sourcePoem = await lugardenDb.zhouPoem.findUnique({
  where: { id: sourcePoemId }
});

const mapping = await lugardenDb.zhouMapping.findUnique({
  where: { id: mappingId }
});

// 保存到auth.db，包含冗余字段
const { PrismaClient: AuthPrisma } = require('../generated/auth-prisma');
const authDb = new AuthPrisma();

const work = await authDb.userGongBiWork.create({
  data: {
    userId,
    sourcePoemId,
    mappingId,
    // 冗余字段
    sourcePoemTitle: sourcePoem.title,
    sourcePoemChapter: sourcePoem.chapter,
    mappingChapter: mapping.chapter,
    mappingCombination: mapping.combination,
    mappingMeaning: mapping.meaning,
    // 用户输入和生成内容
    userInput,
    poemTitle,
    poemContent,
    poemQuote,
    poemQuoteSource,
    // Dify追溯
    conversationId,
    messageId,
    usageMetadata: JSON.stringify(usageMetadata)
  }
});
```

---

#### - [ ] 任务B.7：实现查询我的作品API

**为什么存在**：
- 让用户查看自己的作品历史

**交付物**：
- `GET /api/my-works` API（需要requireAuth）

**执行步骤**：

- [ ] B.7.1：在myWorksService.js添加getUserWorks函数
  ```javascript
  // getUserWorks(userId)
  // - 查询该用户的所有UserGongBiWork记录
  // - 按createdAt倒序排列
  // - 返回作品列表
  ```

- [ ] B.7.2：在myWorks.js路由添加查询端点
  ```javascript
  GET /api/my-works
  Headers: Authorization: Bearer <token>
  
  返回：
  - 成功：{ success: true, works: [...] }
  - 失败：{ success: false, error: "错误信息" }
  ```

- [ ] B.7.3：测试查询我的作品API
  ```bash
  curl -X GET http://localhost:3000/api/my-works \
    -H "Authorization: Bearer $TOKEN"
  ```

**验收标准**：
- [ ] getUserWorks函数已实现
- [ ] 查询API需要认证
- [ ] 返回该用户的所有作品，按时间倒序
- [ ] 测试通过：可以查看之前保存的作品

---

#### - [ ] 任务B.8：实现删除账户API

**为什么存在**：
- 法规合规，用户有权删除数据

**交付物**：
- `DELETE /api/auth/delete-account` API（需要requireAuth）

**执行步骤**：

- [ ] B.8.1：在authService.js添加deleteAccount函数
  ```javascript
  // deleteAccount({ userId, password })
  // - 查找用户
  // - 验证密码
  // - 删除用户（Cascade自动删除所有作品）
  // - 返回成功信息
  ```

- [ ] B.8.2：在auth.js路由添加删除账户端点
  ```javascript
  DELETE /api/auth/delete-account
  Headers: Authorization: Bearer <token>
  Body: { password }
  
  返回：
  - 成功：{ success: true, message: "账户已删除" }
  - 失败：{ success: false, error: "密码错误" }
  ```

- [ ] B.8.3：测试删除账户API
  ```bash
  curl -X DELETE http://localhost:3000/api/auth/delete-account \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"password":"test123"}'
  ```

**验收标准**：
- [ ] deleteAccount函数已实现
- [ ] 删除API需要认证
- [ ] 需要密码二次确认
- [ ] Cascade删除验证：用户删除后，UserGongBiWork自动删除
- [ ] 测试通过：删除后无法再登录

---

## 完成标准

- [ ] 所有8个任务的执行步骤全部完成
- [ ] 验收标准全部通过
- [ ] 端到端测试通过
- [ ] 无遗留问题

---

## 端到端测试场景

### 场景1：新用户注册→登录→保存共笔→查看作品
```bash
# 1. 注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"alice123","confirmPassword":"alice123"}'

# 2. 登录
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"alice123"}' \
  | jq -r '.token')

# 3. 保存共笔
curl -X POST http://localhost:3000/api/my-works/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{...}'

# 4. 查看作品
curl -X GET http://localhost:3000/api/my-works \
  -H "Authorization: Bearer $TOKEN"
```

### 场景2：删除账户
```bash
# 删除账户
curl -X DELETE http://localhost:3000/api/auth/delete-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"password":"alice123"}'

# 验证无法再登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"alice123"}'
```

---

## 完成后操作

- [ ] 将本TODO移动到 `documentation/changelog/2025-11-04_用户系统开发_阶段B/TODO.md`
  
- [ ] 创建更新日志 `documentation/changelog/2025-11-04_用户系统开发_阶段B/更新日志.md`

- [ ] 提交Git：
  ```bash
  git add src/utils/ src/middlewares/ src/routes/ src/services/ .env
  git commit -m "feat: 完成阶段B - 用户认证和共笔作品管理API
  
  认证功能：
  - 密码加密工具：bcrypt，salt rounds = 10
  - JWT工具：生成和验证，有效期7天
  - 认证中间件：requireAuth保护API
  - 用户注册API：用户名唯一性校验
  - 用户登录API：密码验证，颁发JWT
  
  共笔作品管理：
  - 保存共笔API：冗余字段填充，完整追溯
  - 查询我的作品API：按时间倒序返回
  - 删除账户API：密码二次确认，Cascade删除
  
  技术实现：
  - 两个Prisma Client：lugarden-prisma（查询）+ auth-prisma（写入）
  - 应用层冗余字段填充：历史快照价值
  - 完整Dify metadata保存：支持成本分析
  
  文档：documentation/changelog/2025-11-04_用户系统开发_阶段B/"
  
  git push origin main
  ```

---

**当前状态：⏳ 待开始**

*创建时间：2025-11-04*  
*预计完成时间：2小时*


