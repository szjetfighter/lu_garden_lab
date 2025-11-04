# 用户系统开发 - 阶段C：前端界面开发 TODO（增强版）

> **🤖 AI 助手注意 (AI Assistant Attention)**
> 在执行本文件中的任务前，你必须首先阅读并严格遵守位于 `documentation/ai-collaboration-guide.md` 的全局协作指南。

## 目标
实现用户认证与共笔作品管理的完整前端界面，打通"用户注册→登录→创作共笔→查看作品"的完整体验链路。通过Vue3组合式API和现有组件复用，快速实现生产级的用户界面，提升用户粘性和归属感。

**业务价值**：
- 让用户的共笔创作有归属感（我的作品集）
- 提升用户粘性（登录后可查看历史作品）
- 符合法律合规要求（隐私保护、数据权利）

**技术价值**：
- 建立完整的前端认证体系（JWT、路由守卫、状态管理）
- 验证组件复用架构的有效性（PoemViewer复用）
- 实践响应式设计和诗学化UI原则

## 范围与约束

### 范围
- ✅ 登录/注册页面（单页tab切换）
- ✅ "我的作品"页面（作品列表展示）
- ✅ 路由守卫（未登录自动跳转）
- ✅ 共笔结果页保存提示（已登录/未登录状态）
- ✅ Portal首页导航栏（用户状态显示）
- ❌ 不包含：忘记密码、修改密码、邮箱验证（阶段D）

### 约束
- **设计约束**：必须复用现有UnoCSS样式和组件（PoemViewer、LoadingSpinner等）
- **技术约束**：使用Vue3组合式API + TypeScript，严格遵守`vue-typescript-standards`规范
- **体验约束**：所有页面必须响应式设计，移动端优先
- **安全约束**：Token存储在localStorage，前端+后端双重验证

## 前期决策记录

**决策时间**：2025-11-04
**决策参与者**：用户（西尔）+ AI助手

### 已确认的9项决策

1. ✅ **UI模式**：方案A - 单页面tab切换（登录/注册）
   - 理由：用户体验更好，切换无需跳转

2. ✅ **设计风格**：复用现有UnoCSS样式和毛玻璃卡片
   - 理由：保持视觉一致性，开发效率高

3. ✅ **作品展示组件**：方案A - 复用PoemViewer组件
   - 理由：已有复制、分享功能，避免重复开发

4. ✅ **空状态设计**：需要"去创作"按钮，跳转到周与春秋首页
   - 理由：引导用户产生内容，提升活跃度

5. ✅ **Token过期处理**：方案B - 等API返回401，在axios拦截器统一处理
   - 理由：可靠性高（服务器权威判断）、实现简单、可维护性好
   - 优化措施：做好loading状态、清晰的跳转提示、保留跳转前路由

6. ✅ **提示文案**：
   - 已登录："✅ 已保存到我的作品集"
   - 未登录："💡 登录后可以保存作品 [去登录]"
   - 理由：清晰、友好、有行动召唤

7. ✅ **提示位置**：共笔诗歌下方，不干扰主要内容
   - 理由：自然、不突兀、符合阅读流

8. ✅ **导航栏设计**：
   - 已登录：显示"用户名 | 我的作品 | 退出"
   - 未登录：显示"登录/注册"
   - 位置：顶部右上角
   - 理由：符合用户习惯，信息层级清晰

9. ✅ **移动端响应式**：简化为图标显示
   - 理由：移动端空间有限，图标化更优雅

---

## 任务列表

> **任务编号规范**
> - 本TODO使用单一阶段：阶段11-04_C（前端界面开发）
> - 任务编号：任务C.1、任务C.2、任务C.3、任务C.4、任务C.5
> - 步骤编号：步骤C.1.1、步骤C.1.2……步骤C.5.x

---

### **阶段11-04_C：前端界面开发**

#### - [ ] 任务C.1：创建登录注册页面（LoginView.vue）

- **核心思想**：提供用户进入认证体系的入口，单页面tab切换设计，简洁友好，降低用户注册门槛。

- 交付物：
  - `lugarden_universal/frontend_vue/src/core/auth/views/LoginView.vue`
  - 路由配置更新（`/login`）

- 验收标准：
  - [ ] 页面可访问（/login）
  - [ ] 登录功能正常（正确密码返回token并跳转）
  - [ ] 注册功能正常（成功注册后切换到登录tab）
  - [ ] 输入验证生效（用户名3-20字符，密码至少6字符，确认密码一致）
  - [ ] 错误提示友好（中文错误信息）
  - [ ] 移动端显示正常（响应式布局）
  - [ ] 登录成功保存token到localStorage
  - [ ] 登录成功后跳转到"我的作品"或redirect参数指定页面

- **风险评估**：低风险（新增页面，不影响现有功能）

- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/core/auth/views/LoginView.vue`（新增）
  - `lugarden_universal/frontend_vue/src/router/index.ts`（路由配置）
  - `lugarden_universal/frontend_vue/src/core/auth/index.ts`（可能需要创建auth模块入口）

- 实际改动文件：[待记录]

- 完成状态：⏳ 待执行

- 执行步骤：
  - [ ] 步骤C.1.1：创建auth模块目录结构
    ```bash
    mkdir -p lugarden_universal/frontend_vue/src/core/auth/views
    mkdir -p lugarden_universal/frontend_vue/src/core/auth/services
    mkdir -p lugarden_universal/frontend_vue/src/core/auth/stores
    mkdir -p lugarden_universal/frontend_vue/src/core/auth/types
    ```
  
  - [ ] 步骤C.1.2：创建LoginView.vue组件
    - 功能要求：
      - 单页面，两个tab（登录/注册）
      - 登录表单：用户名+密码
      - 注册表单：用户名+密码+确认密码
      - 前端验证：用户名3-20字符，密码至少6字符
      - 调用API：`POST /api/auth/login` 和 `POST /api/auth/register`
      - 成功处理：登录成功保存token，跳转；注册成功切换tab
      - 错误处理：显示友好的中文错误信息
    - 设计要求：
      - 复用现有UnoCSS样式
      - 毛玻璃卡片效果
      - 响应式设计（移动端友好）
  
  - [ ] 步骤C.1.3：在router/index.ts中注册/login路由
    ```typescript
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/core/auth/views/LoginView.vue'),
      meta: {
        title: '登录/注册 - 陆家花园',
        requiresAuth: false
      }
    }
    ```
  
  - [ ] 步骤C.1.4：创建authApi.ts服务层
    - 文件位置：`src/core/auth/services/authApi.ts`
    - 功能：封装登录、注册API调用
  
  - [ ] 步骤C.1.5：测试登录注册功能
    - 注册新用户
    - 登录成功
    - 错误密码提示
    - 移动端显示验证

---

#### - [ ] 任务C.2：创建"我的作品"页面（MyWorksView.vue）

- **核心思想**：展示用户的共笔创作历史，给用户成就感和归属感，复用PoemViewer组件保持视觉一致性。

- 交付物：
  - `lugarden_universal/frontend_vue/src/core/auth/views/MyWorksView.vue`
  - 路由配置更新（`/my-works`）

- 验收标准：
  - [ ] 页面可访问（/my-works，需登录）
  - [ ] 作品列表正常展示（使用PoemViewer组件）
  - [ ] 空状态显示正常（"去创作"按钮）
  - [ ] 顶部导航显示用户名和退出按钮
  - [ ] 退出登录功能正常（清除token，跳转登录页）
  - [ ] 移动端显示正常

- **风险评估**：低风险（新增页面，复用现有组件）

- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/core/auth/views/MyWorksView.vue`（新增）
  - `lugarden_universal/frontend_vue/src/router/index.ts`（路由配置）
  - `lugarden_universal/frontend_vue/src/core/auth/services/authApi.ts`（添加查询作品API）

- 实际改动文件：[待记录]

- 完成状态：⏳ 待执行

- 执行步骤：
  - [ ] 步骤C.2.1：创建MyWorksView.vue组件
    - 功能要求：
      - 从localStorage获取token
      - 调用`GET /api/my-works`获取作品列表
      - 使用PoemViewer组件展示作品
      - 空状态：显示提示+去创作按钮
      - 顶部导航：用户名+退出登录
    - 设计要求：
      - 作品卡片使用PoemViewer组件
      - 瀑布流或列表布局
      - 响应式设计
  
  - [ ] 步骤C.2.2：在router/index.ts中注册/my-works路由
    ```typescript
    {
      path: '/my-works',
      name: 'MyWorks',
      component: () => import('@/core/auth/views/MyWorksView.vue'),
      meta: {
        title: '我的作品 - 陆家花园',
        requiresAuth: true  // 标记需要登录
      }
    }
    ```
  
  - [ ] 步骤C.2.3：在authApi.ts添加查询作品API
    ```typescript
    export async function getMyWorks() {
      const token = localStorage.getItem('token');
      return api.get('/api/my-works', {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    ```
  
  - [ ] 步骤C.2.4：测试我的作品页面
    - 登录后查看作品列表
    - 空状态显示验证
    - 退出登录功能验证
    - 移动端显示验证

---

#### - [ ] 任务C.3：实现路由守卫（401拦截+未登录重定向）

- **核心思想**：统一的认证拦截机制，未登录用户自动跳转登录页，Token过期时axios拦截器统一处理401响应。

- 交付物：
  - 路由守卫逻辑（`router/index.ts`中的`beforeEach`）
  - axios拦截器增强（`shared/services/interceptors.ts`）

- 验收标准：
  - [ ] 未登录访问/my-works，自动跳转到/login?redirect=/my-works
  - [ ] 登录成功后，自动跳转回redirect参数指定的页面
  - [ ] Token过期时，API返回401，axios拦截器清除token并跳转登录页
  - [ ] 跳转时显示友好提示："登录已过期，请重新登录"

- **风险评估**：低风险（纯前端逻辑，不影响后端）

- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/router/index.ts`（路由守卫）
  - `lugarden_universal/frontend_vue/src/shared/services/interceptors.ts`（axios拦截器）

- 实际改动文件：[待记录]

- 完成状态：⏳ 待执行

- 执行步骤：
  - [ ] 步骤C.3.1：在router/index.ts添加路由守卫逻辑
    ```typescript
    router.beforeEach((to, from, next) => {
      // 检查是否需要登录
      if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
          // 未登录，跳转登录页，保留redirect参数
          return next({
            path: '/login',
            query: { redirect: to.fullPath }
          });
        }
      }
      next();
    });
    ```
  
  - [ ] 步骤C.3.2：在LoginView.vue处理redirect参数
    - 登录成功后，检查URL的redirect参数
    - 如有redirect，跳转到指定页面
    - 如无redirect，跳转到/my-works
  
  - [ ] 步骤C.3.3：在interceptors.ts添加401拦截器
    ```typescript
    api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Token过期或无效
          localStorage.removeItem('token');
          // 显示提示
          // 跳转登录页
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );
    ```
  
  - [ ] 步骤C.3.4：测试路由守卫
    - 未登录访问/my-works，验证跳转
    - 登录后自动回到/my-works
    - 模拟token过期（删除token或使用过期token），验证401拦截

---

#### - [x] 任务C.4：在共笔结果页添加"保存到我的作品"提示

- **核心思想**：让用户知道作品已保存（如果已登录），引导未登录用户注册/登录，提升用户转化率。

- 交付物：
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/GongBiView.vue`更新
  - `lugarden_universal/frontend_vue/src/core/auth/services/authApi.ts`更新
  - `lugarden_universal/frontend_vue/src/modules/zhou/services/gongBiApi.ts`更新

- 验收标准：
  - [x] 已登录显示"✅ 已保存到我的作品集"
  - [x] 未登录显示"💡 登录后可以保存作品 [去登录]"
  - [x] 点击"去登录"跳转到/login
  - [x] 提示样式不突兀，位于诗歌下方
  - [x] 移动端显示正常

- **风险评估**：低风险（纯UI提示，不影响核心功能）

- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/GongBiView.vue`

- 实际改动文件：
  - `lugarden_universal/frontend_vue/src/core/auth/services/authApi.ts` (saveGongBiWork函数)
  - `lugarden_universal/frontend_vue/src/modules/zhou/services/gongBiApi.ts` (metadata支持)
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/GongBiView.vue` (自动保存+UI)

- 完成状态：✅ 已完成
- Git提交：17b58ce "feat: 完成用户系统阶段C任务4-共笔作品自动保存"
- 测试报告：共笔功能测试报告.md

- 执行步骤：
  - [ ] 步骤C.4.1：在GongBiView.vue添加保存状态提示组件
    - 位置：共笔诗歌展示下方
    - 逻辑：检查localStorage是否有token
    - 已登录：绿色提示，带勾图标
    - 未登录：蓝色提示，带登录链接
  
  - [ ] 步骤C.4.2：添加样式
    - 简洁、不突兀
    - 响应式设计
  
  - [ ] 步骤C.4.3：测试保存提示
    - 已登录状态验证
    - 未登录状态验证
    - 点击"去登录"跳转验证

---

#### - [x] 任务FIX4.1：修复未登录共笔后登录诗歌丢失问题

- **问题来源**：测试报告场景1-2
  - 未登录生成诗歌，提示"登录后可以保存作品"
  - 用户登录后，诗歌永久丢失
  - 提示语与实际行为不符，用户体验差

- **核心思想**：未登录时将诗歌临时存储在浏览器，登录后自动保存到服务器。

- 交付物：
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/GongBiView.vue`更新
  - `lugarden_universal/frontend_vue/src/core/auth/views/LoginView.vue`更新

- 验收标准：
  - [x] 未登录生成诗歌后，数据存储到localStorage（临时key）
  - [x] 用户点击"去登录"，完成登录
  - [x] 登录成功后，检测到临时数据，自动调用保存API
  - [x] 保存成功后，清除临时数据
  - [x] 跳转到/my-works，能看到刚才生成的诗歌
  - [x] 临时数据包含时间戳，超过30分钟自动过期

- **风险评估**：低风险（客户端localStorage，不涉及服务端缓存）

- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/GongBiView.vue`
  - `lugarden_universal/frontend_vue/src/core/auth/views/LoginView.vue`

- 实际改动文件：
  - `lugarden_universal/frontend_vue/src/modules/zhou/views/GongBiView.vue` (storePendingWork函数)
  - `lugarden_universal/frontend_vue/src/core/auth/views/LoginView.vue` (checkAndSavePendingWork函数)

- 完成状态：✅ 已完成
- Git提交：7064eb9 "fix: 修复未登录共笔后登录诗歌丢失问题（FIX4.1）"
- 测试报告：fix4.1完整测试

- 执行步骤：
  - [ ] 步骤FIX4.1.1：GongBiView存储临时数据
    - 在handleSubmit生成诗歌后，存储到localStorage
    - key: `pending_gongbi_work`
    - value: `{ poem, urlParams, timestamp }`
  
  - [ ] 步骤FIX4.1.2：LoginView检测并保存
    - 登录成功后，检测localStorage的`pending_gongbi_work`
    - 如果存在且未过期（30分钟内），调用saveGongBiWork
    - 保存成功后，清除临时数据
  
  - [ ] 步骤FIX4.1.3：测试完整流程
    - 未登录生成诗歌 → 登录 → 验证诗歌已保存
    - 验证临时数据过期机制（30分钟）
    - 验证localStorage隔离（不同浏览器/用户）

---

#### - [ ] 任务C.5：在Portal首页添加"我的作品"入口

- **核心思想**：让用户可以方便地访问作品集，提升用户粘性，建立完整的导航体系。

- 交付物：
  - `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`更新

- 验收标准：
  - [ ] 已登录显示导航栏（用户名 | 我的作品 | 退出）
  - [ ] 未登录显示"登录/注册"按钮
  - [ ] 点击"我的作品"跳转到/my-works
  - [ ] 点击"退出"清除token，刷新页面
  - [ ] 移动端简化为图标显示

- **风险评估**：低风险（UI改动，不影响现有功能）

- 预期改动文件（预判）：
  - `lugarden_universal/frontend_vue/src/modules/portal/views/UniversePortal.vue`

- 实际改动文件：[待记录]

- 完成状态：⏳ 待执行

- 执行步骤：
  - [ ] 步骤C.5.1：在UniversePortal.vue添加顶部导航栏
    - 位置：页面右上角
    - 逻辑：检查localStorage是否有token
    - 已登录：显示用户名+我的作品+退出
    - 未登录：显示登录/注册按钮
  
  - [ ] 步骤C.5.2：实现退出登录功能
    ```typescript
    function logout() {
      localStorage.removeItem('token');
      router.push('/');  // 或刷新页面
    }
    ```
  
  - [ ] 步骤C.5.3：添加响应式样式
    - 桌面端：完整文字显示
    - 移动端：简化为图标
  
  - [ ] 步骤C.5.4：测试Portal导航
    - 已登录显示验证
    - 未登录显示验证
    - 跳转功能验证
    - 退出登录验证
    - 移动端显示验证

---

## 测试与验收

### 端到端测试场景

#### 场景1：新用户完整流程
1. 访问Portal首页 → 未登录状态，显示"登录/注册"按钮
2. 点击"登录/注册" → 跳转到/login
3. 切换到注册tab → 注册新用户（username: testuser, password: test123456）
4. 注册成功 → 自动切换到登录tab
5. 登录 → 成功，跳转到/my-works
6. 我的作品页 → 空状态，显示"去创作"按钮
7. 点击"去创作" → 跳转到周与春秋首页
8. 完成共笔创作 → 看到"✅ 已保存到我的作品集"提示
9. 返回/my-works → 看到刚才创作的作品
10. Portal首页 → 显示用户名和"我的作品"入口

#### 场景2：未登录用户访问保护页面
1. 直接访问/my-works → 自动跳转到/login?redirect=/my-works
2. 登录成功 → 自动跳转回/my-works

#### 场景3：Token过期处理
1. 登录状态下访问/my-works → 正常显示
2. 手动清除token或等待过期
3. 刷新页面或调用API → 401错误，自动跳转到/login
4. 显示提示："登录已过期，请重新登录"

#### 场景4：移动端响应式验证
1. 切换到移动端视口
2. 验证登录页响应式布局
3. 验证我的作品页响应式布局
4. 验证Portal导航简化为图标

### 质量检查清单
- [ ] TypeScript类型检查通过：`npm run type-check`
- [ ] ESLint检查通过：`npm run lint`
- [ ] 构建成功：`npm run build`
- [ ] 所有页面移动端显示正常
- [ ] 所有错误提示为中文
- [ ] Token存储和清除逻辑正确
- [ ] 路由跳转逻辑正确

---

## 更新日志关联
- **预计更新类型**：功能更新
- **更新目录**：`documentation/changelog/2025-11-04_用户系统开发_阶段C/`
- **更新日志文件**：`更新日志.md`
- **测试验证点**：
  - [ ] 新用户完整流程测试通过
  - [ ] 未登录访问保护页面测试通过
  - [ ] Token过期处理测试通过
  - [ ] 移动端响应式验证通过
  - [ ] TypeScript/ESLint/Build全部通过

---

## 注意事项
1. **组件复用优先**：必须复用PoemViewer、LoadingSpinner、EmptyState等现有组件
2. **响应式设计**：所有页面必须支持移动端和桌面端，移动端优先
3. **错误提示友好**：所有错误信息必须是中文，易于理解
4. **用户体验优先**：避免突兀的弹窗，使用渐进式提示
5. **Token存储**：统一使用localStorage存储JWT token
6. **安全性**：前端验证+后端验证，双重保障
7. **代码规范**：严格遵守Vue3组合式API和TypeScript标准
8. **Git提交**：原子提交，每个任务完成后提交一次

---

## 完成后的操作
- [ ] 创建更新目录：`documentation/changelog/2025-11-04_用户系统开发_阶段C/`
- [ ] 将本TODO文件移动到更新目录并重命名为 `TODO.md`
- [ ] 创建对应的更新日志文档：`更新日志.md`
- [ ] 提交所有更改到Git
  ```bash
  git add src/core/auth/ src/router/ src/modules/zhou/views/GongBiView.vue src/modules/portal/views/UniversePortal.vue
  git commit -m "feat: 完成用户系统阶段C-前端界面开发
  
  前端认证界面：
  - 登录/注册页面：单页tab切换，输入验证，友好错误提示
  - 我的作品页面：作品列表展示，复用PoemViewer组件
  - 空状态设计：引导用户创作
  
  路由与认证：
  - 路由守卫：未登录自动跳转，保留redirect参数
  - axios拦截器：统一处理401，Token过期自动跳转
  
  用户体验优化：
  - 共笔结果页：保存状态提示
  - Portal首页：用户导航入口
  - 移动端响应式：图标简化显示
  
  技术实现：
  - Vue3组合式API + TypeScript
  - 组件复用：PoemViewer、LoadingSpinner
  - localStorage管理Token
  - 完整的认证流程和状态管理
  
  文档：documentation/changelog/2025-11-04_用户系统开发_阶段C/"
  ```
- [ ] 创建 `TODO_用户系统开发_阶段D.md`（合规功能完善）

---

## 当前状态
⏳ 待开始

---

## 里程碑
- **创建时间**：2025-11-04
- **开始时间**：[待更新]
- **完成时间**：[待更新]
- **预计工时**：1.5-2小时
- **实际工时**：[待更新]

---

*本TODO基于陆家花园项目Git开发指南创建（增强版）*
