/**
 * 毒理学报告 (The Toxicology Report)
 * 
 * 代号: 004_toxicology
 * 诗人: 冯铗
 * 诗集: 《一剂》
 * 
 * 核心隐喻: 离心机 (The Centrifuge)
 * 通过"算法离心"暴力剥离诗歌中的修辞杂质，
 * 只保留极高纯度的"有效成分"。
 */

import type { RouteRecordRaw } from 'vue-router'

export const toxicologyRoutes: RouteRecordRaw[] = [
  {
    path: '/pending/004_toxicology',
    name: 'toxicology-entry',
    component: () => import('./views/ToxicologyEntry.vue'),
    meta: {
      title: '毒理学报告',
      subtitle: '冯铗《一剂》',
      status: 'experimental'
    }
  },
  {
    path: '/pending/004_toxicology/report',
    name: 'toxicology-report',
    component: () => import('./views/ToxicologyView.vue'),
    meta: {
      title: '毒理学报告 - 离心机',
      subtitle: '冯铗《一剂》',
      status: 'experimental'
    }
  }
]

export default toxicologyRoutes
