import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'UniversePortal',
    component: () => import('@/modules/portal/views/UniversePortal.vue'),
    meta: {
      title: '陆家花园 - 宇宙门户',
      requiresAuth: false,
      step: 0
    }
  },
  {
    path: '/zhou',
    name: 'MainProjectSelection',
    component: () => import('@/modules/zhou/views/MainProjectSelection.vue'),
    meta: {
      title: '周与春秋 - 主项目选择',
      requiresAuth: false,
      step: 1
    }
  },
  {
    path: '/project/:projectId?',
    name: 'SubProjectSelection',
    component: () => import('@/modules/zhou/001_lianxi/views/SubProjectSelection.vue'),
    meta: {
      title: '子项目选择',
      requiresAuth: false,
      step: 2,
      requiresProject: true
    }
  },
  {
    path: '/quiz/:chapter?',
    name: 'QuizScreen',
    component: () => import('@/modules/zhou/001_lianxi/views/QuizScreen.vue'),
    beforeEnter: (to, from, next) => {
      // 检测从echo页面返回，重置问答状态避免状态不一致
      if (from.path === '/classical-echo') {
        // 动态导入store并重置状态
        import('@/modules/zhou/stores/zhou').then(({ useZhouStore }) => {
          const zhouStore = useZhouStore()
          zhouStore.resetQuiz()
          console.log('Route guard: 检测到从echo页面返回，已重置问答状态')
        })
      }
      next()
    },
    meta: {
      title: '问答测试',
      requiresAuth: false,
      step: 3,
      requiresChapter: true
    }
  },
  {
    path: '/classical-echo',
    name: 'ClassicalEchoScreen',
    component: () => import('@/modules/zhou/001_lianxi/views/ClassicalEchoScreen.vue'),
    meta: {
      title: '古典回响',
      requiresAuth: false,
      step: 4,
      requiresQuizComplete: true
    }
  },
  {
    path: '/result',
    name: 'ResultScreen',
    component: () => import('@/modules/zhou/001_lianxi/views/ResultScreen.vue'),
    meta: {
      title: '您的诗歌',
      requiresAuth: false,
      step: 5,
      requiresQuizComplete: true
    }
  },
  {
    path: '/gongbi',
    name: 'GongBiView',
    component: () => import('@/modules/zhou/001_lianxi/views/GongBiView.vue'),
    meta: {
      title: '共笔 - 与陆家明一起创作',
      requiresAuth: false,
      step: 6
    }
  },
  // 用户认证
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/core/auth/views/LoginView.vue'),
    meta: {
      title: '登录/注册 - 陆家花园',
      requiresAuth: false
    }
  },
  {
    path: '/my-works',
    name: 'MyWorks',
    component: () => import('@/core/auth/views/MyWorksView.vue'),
    meta: {
      title: '我的作品 - 陆家花园',
      requiresAuth: true
    }
  },
  // 法律文档
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/core/auth/views/TermsView.vue'),
    meta: {
      title: '用户协议 - 陆家花园',
      requiresAuth: false
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/core/auth/views/PrivacyView.vue'),
    meta: {
      title: '隐私政策 - 陆家花园',
      requiresAuth: false
    }
  },
  // 毛小豆宇宙
  {
    path: '/maoxiaodou',
    name: 'MaoxiaodouSelection',
    component: () => import('@/modules/mao/views/MainProjectSelection.vue'),
    meta: {
      title: '毛小豆宇宙 - 陆家花园',
      requiresAuth: false
    }
  },
  {
    path: '/maoxiaodou/moshi',
    name: 'MoshiView',
    component: () => import('@/modules/mao/001_moshi/views/MoshiView.vue'),
    meta: {
      title: '摸诗 - 毛小豆宇宙',
      requiresAuth: false
    }
  },
  // Pending（先锋实验）宇宙 - 授权码门禁
  {
    path: '/pending',
    name: 'PendingAuthGate',
    component: () => import('@/modules/pending/views/AuthGate.vue'),
    meta: {
      title: '授权验证 - 陆家花园',
      requiresAuth: false
    }
  },
  // Pending - L1入口（授权后）
  {
    path: '/pending/home',
    name: 'PendingMainProjectSelection',
    component: () => import('@/modules/pending/views/MainProjectSelection.vue'),
    meta: {
      title: '匿，腻，溺 - 陆家花园',
      requiresAuth: false
    }
  },
  // Pending - NEW ARRIVAL
  {
    path: '/pending/001_newarrival',
    name: 'XinpinView',
    component: () => import('@/modules/pending/001_newarrival/views/XinpinView.vue'),
    meta: {
      title: 'NEW ARRIVAL - ANONYMIZATION',
      requiresAuth: false
    }
  },
  // Pending - 谁是臧棣实验
  {
    path: '/pending/002_whoiszd',
    name: 'WhoIsZD',
    component: () => import('@/modules/pending/002_whoiszd/views/EntryGuard.vue'),
    meta: {
      title: '谁是臧棣 - 先锋实验',
      requiresAuth: false
    }
  },
  // 404 重定向
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 滚动行为：切换路由时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫：处理页面访问权限和状态
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // ================================
  // 认证守卫：检查是否需要登录
  // ================================
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('Route guard: 访问需要认证的页面，但未登录，重定向到登录页')
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }

  // ================================
  // 项目访问守卫
  // ================================
  if (to.meta.requiresProject) {
    // 检查是否已选择项目 - 如果直接访问需要项目的页面，重定向到项目选择
    const projectId = to.params.projectId
    if (!projectId) {
      console.warn('Route guard: 直接访问需要项目的页面，重定向到Zhou项目选择')
      return next('/zhou')
    }
  }
  
  if (to.meta.requiresChapter) {
    // 检查是否已选择章节 - 如果直接访问需要章节的页面，重定向到项目选择
    const chapter = to.params.chapter
    if (!chapter) {
      console.warn('Route guard: 直接访问需要章节的页面，重定向到项目选择')
      return next('/zhou')
    }
  }
  
  if (to.meta.requiresQuizComplete) {
    // 允许直接访问结果页面，由组件内部处理数据获取和验证
    // 这样用户可以直接访问结果页面URL分享
    console.log('Route guard: 允许访问结果页面，由组件处理数据验证')
  }

  // ================================
  // Pending宇宙授权守卫
  // ================================
  // 访问/pending子路由（非授权页本身）需要验证授权码
  if (to.path.startsWith('/pending/') && to.path !== '/pending') {
    const pendingAuthorized = localStorage.getItem('pending_authorized')
    if (pendingAuthorized !== 'true') {
      console.warn('Route guard: 未授权访问pending子模块，重定向到授权页')
      return next('/pending')
    }
  }

  next()
})

// 路由后置守卫：处理页面切换后的操作
router.afterEach((to, from) => {
  // 页面切换动画或其他后处理逻辑
  console.log(`Route changed from ${from.path} to ${to.path}`)
})

export default router
