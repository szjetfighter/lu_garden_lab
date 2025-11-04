import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { apiClient } from './shared/services/api'

// 导入样式系统
import './assets/styles/main.css'
// 导入UnoCSS虚拟模块
import 'virtual:uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// ================================
// 全局401拦截器：处理认证失败
// ================================
apiClient.set401Handler(() => {
  const currentPath = window.location.pathname + window.location.search
  if (currentPath !== '/login') {
    console.warn('[401拦截器] Token已失效，跳转到登录页')
    router.push({
      path: '/login',
      query: { redirect: currentPath }
    })
  }
})

app.mount('#app')
