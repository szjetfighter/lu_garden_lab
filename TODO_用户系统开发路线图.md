# 陆家花园用户系统开发路线图

> **文档性质**：战略层路线图，记录核心决策和任务规划
> **执行方式**：基于本路线图，分阶段创建执行TODO

---

## 一、核心需求

**用户价值**：登录后，共笔产生的内容能够保存并查看

**关键特性**：
- ✅ Modal弹窗登录/注册（用户名+密码）
- ✅ 先共笔，保存时检测登录（降低门槛）
- ✅ 前端暂存共笔结果，登录后保存到数据库
- ✅ "我的作品"页面查看历史记录
- ✅ 删除账户功能（法规合规）

**不包含**：
- ❌ 邮箱/手机号
- ❌ 分享/评论/社交功能
- ❌ 找回密码（初期版本）

---

## 二、核心用户流程

### 流程1：未登录用户首次使用共笔

```
1. 用户阅读诗歌 → 点击"共笔"
2. 直接进入共笔页面（无需登录）
3. 输入50字感受
4. AI生成诗歌 → 前端暂存结果
5. 显示"💾 保存到我的作品集"按钮
6. 点击保存 → 检测未登录 → 弹出登录Modal
7. 用户注册账户（用户名+密码+确认密码）
8. 注册成功 → Modal关闭 → 自动保存刚才的共笔内容
9. 提示"✅ 已保存到我的作品集"
```

### 流程2：已登录用户使用共笔

```
1. 用户阅读诗歌 → 点击"共笔"
2. 输入50字感受
3. AI生成诗歌 → 前端暂存结果
4. 显示"💾 保存到我的作品集"按钮
5. 点击保存 → 检测已登录 → 直接保存到数据库
6. 提示"✅ 已保存到我的作品集"
```

### 流程3：查看我的作品

```
1. Portal右上角显示"用户名 | 我的作品 | 退出"
2. 点击"我的作品" → 跳转到 /my-works
3. 展示所有共笔作品列表（按时间倒序）
4. 每个作品支持复制、分享功能
```

---

## 三、核心架构决策

### 3.1 认证方式：JWT + localStorage

**决策**：使用JWT存储在localStorage

**理由**：
- 单体应用，无需Session管理
- 实现简单，适合快速交付
- 有效期7天

### 3.2 密码加密：bcrypt

**决策**：bcrypt，salt rounds = 10

**理由**：行业标准，安全性足够

### 3.3 目录结构

**后端**（利用现有结构）：
```
application/src/
├── middlewares/auth.js       # 认证中间件
├── routes/auth.js            # 认证路由
├── services/authService.js   # 认证业务逻辑
└── utils/
    ├── password.js           # bcrypt工具
    └── jwt.js                # JWT工具
```

**前端**（使用core/auth）：
```
frontend_vue/src/core/auth/
├── api/authApi.ts            # API调用
├── composables/useAuth.ts    # 认证状态管理
├── components/
│   └── LoginModal.vue        # 登录Modal组件
└── views/
    └── MyWorksView.vue       # 我的作品页面
```

### 3.4 前端暂存机制（核心创新）

**问题**：未登录用户生成共笔后，如何在登录后保存？

**方案**：组件状态暂存 + 登录成功回调

```typescript
// GongBiView.vue
const generatedPoem = ref(null)  // 暂存共笔结果

// 生成共笔（无需登录）
async function generate() {
  const result = await gongBiApi.generate(userInput)
  generatedPoem.value = result  // 前端暂存
}

// 保存共笔（需要登录）
async function save() {
  if (!isLoggedIn) {
    showLoginModal.value = true  // 弹出登录Modal
    return
  }
  await gongBiApi.save(generatedPoem.value)
}

// 登录成功后自动保存
function onLoginSuccess() {
  if (generatedPoem.value) {
    save()
  }
}
```

---

## 四、数据库设计

### 4.1 User表

```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String               // bcrypt hash
  createdAt DateTime @default(now())
  
  gongBiWorks UserGongBiWork[]
}
```

**字段说明**：
- `username`：3-20字符，唯一，允许中文
- `password`：bcrypt加密

### 4.2 UserGongBiWork表

```prisma
model UserGongBiWork {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  poemTitle   String    // AI生成的诗歌标题
  poemContent String    // AI生成的诗歌内容
  poemQuote   String?   // 引文（可选）
  poemQuoteSource String? // 引文出处（可选）
  userInput   String    // 用户输入的50字感受
  
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([createdAt])
}
```

**关键设计**：
- `onDelete: Cascade`：删除用户时自动删除作品
- 只存储已登录用户保存的作品

---

## 五、阶段任务规划

### 阶段A：数据库设计与迁移（30分钟）

#### 任务A.1：设计User和UserGongBiWork表

**为什么存在**：建立用户身份与共笔作品的数据关联

**交付物**：
- `prisma/schema.prisma` 更新

**关键点**：
- User表：id, username(@unique), password, createdAt
- UserGongBiWork表：完整的共笔作品信息
- 关系：一对多，onDelete: Cascade

#### 任务A.2：执行Prisma迁移

**为什么存在**：将schema应用到数据库

**交付物**：
- Prisma迁移文件
- 更新后的SQLite数据库

**验收**：
- 迁移成功，无错误
- 表结构正确

---

### 阶段B：后端API实现（2小时）

#### 任务B.1：实现密码加密工具

**为什么存在**：密码不能明文存储（法律要求）

**交付物**：
- `src/utils/password.js`（hashPassword、comparePassword）

#### 任务B.2：实现JWT工具

**为什么存在**：生成和验证JWT令牌

**交付物**：
- `src/utils/jwt.js`（generateToken、verifyToken）
- `.env`新增JWT_SECRET

#### 任务B.3：实现认证中间件

**为什么存在**：统一的JWT验证逻辑

**交付物**：
- `src/middlewares/auth.js`（requireAuth中间件）

#### 任务B.4：实现用户注册API

**为什么存在**：让用户可以创建账户

**交付物**：
- `POST /api/auth/register` API

**验证规则**：
- username：3-20字符，唯一
- password：至少6字符
- confirmPassword：与password一致

#### 任务B.5：实现用户登录API

**为什么存在**：验证用户身份，颁发JWT

**交付物**：
- `POST /api/auth/login` API

**返回**：
- token（JWT）
- user信息（id, username, createdAt）

#### 任务B.6：实现保存共笔API

**为什么存在**：登录后保存共笔内容

**交付物**：
- `POST /api/my-works/save` API（需要requireAuth）

**关键点**：
- 从JWT获取userId
- 保存到UserGongBiWork表

#### 任务B.7：实现查询我的作品API

**为什么存在**：让用户查看自己的作品历史

**交付物**：
- `GET /api/my-works` API（需要requireAuth）

**返回**：
- 用户的所有作品，按创建时间倒序

#### 任务B.8：实现删除账户API

**为什么存在**：法规合规，用户有权删除数据

**交付物**：
- `DELETE /api/auth/delete-account` API（需要requireAuth）

**安全措施**：
- 需要再次输入密码确认
- Cascade自动删除所有作品

---

### 阶段C：前端界面开发（2小时）

#### 任务C.1：创建LoginModal组件

**为什么存在**：提供Modal弹窗登录/注册

**交付物**：
- `src/core/auth/components/LoginModal.vue`

**功能**：
- 两个tab：登录、注册
- 登录表单：username + password
- 注册表单：username + password + confirmPassword
- 调用后端API
- 成功后emit success事件

**设计风格**：
- 毛玻璃蒙版
- 居中白色卡片
- 响应式设计

#### 任务C.2：集成useAuth composable

**为什么存在**：统一的认证状态管理

**交付物**：
- `src/core/auth/composables/useAuth.ts`

**功能**：
- `isLoggedIn`：检测登录状态
- `login()`：登录逻辑
- `logout()`：退出登录
- `currentUser`：当前用户信息

#### 任务C.3：在Portal添加登录入口

**为什么存在**：让用户可以在Portal登录

**交付物**：
- `UniversePortal.vue` 更新

**功能**：
- 右上角导航栏
- 未登录：显示"登录"按钮 → 点击弹出LoginModal
- 已登录：显示"用户名 | 我的作品 | 退出"

#### 任务C.4：修改GongBiView，支持前端暂存

**为什么存在**：实现"先共笔后保存"的核心逻辑

**交付物**：
- `GongBiView.vue` 更新

**关键逻辑**：
```typescript
const generatedPoem = ref(null)  // 暂存
const showLoginModal = ref(false)

// 生成共笔（无需登录）
async function generate() {
  const result = await gongBiApi.generate(userInput)
  generatedPoem.value = result
}

// 保存共笔（需要登录）
async function save() {
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  await gongBiApi.save(generatedPoem.value)
}

// 登录成功后自动保存
function onLoginSuccess() {
  if (generatedPoem.value) {
    save()
  }
}
```

**UI改动**：
- 生成诗歌后，显示"💾 保存到我的作品集"按钮
- 点击按钮触发save()
- 未登录：弹出LoginModal
- 已登录：直接保存，提示"✅ 已保存"

#### 任务C.5：创建MyWorksView页面

**为什么存在**：展示用户的作品历史

**交付物**：
- `src/core/auth/views/MyWorksView.vue`
- 路由配置（/my-works）

**功能**：
- 调用`GET /api/my-works`
- 展示作品列表（复用PoemViewer组件）
- 空状态："您还没有创作作品"
- 顶部："用户名 | 退出"

#### 任务C.6：实现路由守卫

**为什么存在**：未登录访问/my-works时跳转登录

**交付物**：
- 路由配置更新

**逻辑**：
- 访问/my-works → 检测localStorage的token
- 无token → 重定向到Portal首页，自动弹出LoginModal

---

### 阶段D：合规与用户体验完善（30分钟）

#### 任务D.1：创建用户须知文案

**为什么存在**：法规合规，告知义务

**交付物**：
- 用户须知文案（嵌入LoginModal）

**内容**：
```
【陆家花园用户须知】

1. 我们收集什么：您的用户名、密码和共笔作品内容
2. 用于什么：让您可以登录查看自己的作品
3. 谁能看到：只有您自己能看到您的作品
4. 数据安全：密码会加密存储
5. 您的权利：您可以随时删除账户和所有数据

点击"注册"即表示您同意以上说明。
```

#### 任务D.2：在MyWorksView添加删除账户功能

**为什么存在**：法规合规，数据删除权

**交付物**：
- MyWorksView.vue 更新

**功能**：
- 页面底部"删除账户"按钮（红色警告）
- 点击 → 确认对话框"此操作不可恢复"
- 输入密码确认
- 调用`DELETE /api/auth/delete-account`
- 成功 → 清除localStorage，跳转首页

#### 任务D.3：优化各处登录入口的提示文案

**为什么存在**：引导用户登录，提升转化率

**交付物**：
- 各页面的文案优化

**场景1：共笔完成后（未登录）**
- 提示："💡 登录后可以保存作品到作品集 [去登录]"

**场景2：共笔完成后（已登录）**
- 提示："✅ 已保存到我的作品集 [查看]"

**场景3：访问/my-works（未登录）**
- 自动弹出LoginModal，提示："查看作品需要登录"

---

## 六、测试验收

### 端到端场景测试

**场景1：新用户首次使用**
1. 访问Portal → 点击"周与春秋" → 完成问答 → 阅读诗歌
2. 点击"共笔" → 输入感受 → AI生成诗歌
3. 点击"保存" → 弹出LoginModal
4. 注册账户 → 自动保存 → 提示"✅ 已保存"
5. 点击Portal右上角"我的作品" → 看到刚才的作品

**场景2：已登录用户使用**
1. Portal右上角显示"用户名 | 我的作品 | 退出"
2. 完成共笔 → 点击"保存" → 直接保存成功
3. 访问"我的作品" → 看到所有历史作品

**场景3：删除账户**
1. 访问"我的作品" → 点击"删除账户"
2. 输入密码确认 → 删除成功
3. 使用原账户登录 → 提示"用户名或密码错误"

### 安全性验证

- [ ] 密码在数据库中是bcrypt加密
- [ ] JWT_SECRET存储在.env，不提交Git
- [ ] 删除账户需要密码确认
- [ ] API错误信息不泄露敏感信息

### 合规性验证

- [ ] 注册时显示用户须知
- [ ] 提供删除账户功能
- [ ] 只收集必要信息

---

## 七、技术亮点

1. **前端暂存机制**：未登录用户可以先体验共笔，降低门槛
2. **Modal弹窗登录**：不打断用户体验，流畅自然
3. **自动保存**：登录成功后自动保存刚才的内容，无缝衔接
4. **最小合规**：符合法规要求，不过度设计

---

## 八、预计工作量

| 阶段 | 预计时间 | 核心任务 |
|------|---------|---------|
| 阶段A | 30分钟 | 数据库设计+迁移 |
| 阶段B | 2小时 | 后端8个API |
| 阶段C | 2小时 | 前端6个组件/页面 |
| 阶段D | 30分钟 | 合规+体验优化 |
| **总计** | **5小时** | 21个任务 |

---

## 九、下一步行动

**现在**：
1. 你复审本路线图
2. 确认是否遗漏关键功能

**通过后**：
3. 创建`TODO_用户系统开发_阶段A.md`（数据库设计）
4. 执行阶段A任务
5. 完成后依次执行B、C、D阶段

---

**当前状态：🔄 路线图待复审**

*创建时间：2025-11-03*  
*预计总开发时间：5小时*

