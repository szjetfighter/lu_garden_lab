# TODO: 微信分享动态Meta

## 背景
当前所有页面分享到微信时，显示的都是同一个标题和描述（L0门户信息）。需要实现根据不同路由显示对应的分享信息。

## 技术方案
后端中间件检测微信爬虫（User-Agent含`MicroMessenger`），根据路由动态返回带正确og:meta的HTML。

```
请求进入 Express
  ↓
├─ 匹配到配置的路由 + 是爬虫 → 返回动态meta HTML
└─ 其他情况 → 返回原始 index.html（静态meta作为fallback）
```

## 分享配置层级

### L0 - 门户
| 路由 | 标题 | 描述 |
|------|------|------|
| `/` | 陆家花园 | 一个诗歌元宇宙项目，旨在通过数字技术重新诠释和体验诗歌 |

### L1 - 宇宙
| 路由 | 标题 | 描述 |
|------|------|------|
| `/zhou` | 周与春秋 | 这里的诗，是你的回答 |
| `/maoxiaodou` | 毛小豆宇宙 | 毛小豆故事演绎，演绎了你的故事么？ |
| `/pending` | 匿，腻，溺 | 实验，以及冒犯。谁？当然是你 |

### L2 - 子模块/项目
| 路由 | 标题 | 描述 |
|------|------|------|
| `/maoxiaodou/moshi` | 摸诗 | 棒子老虎鸡？不如老虎机！ |
| `/pending/001_newarrival` | NEW ARRIVAL | 贩卖机，卖空气 |
| `/pending/002_whoiszd` | 谁是ZD | 炎石做得，陆家明做不得？ |
| `/project/:id` | *动态从DB读取* | *动态从DB读取* |

### 图片
统一使用 `/lujiaming_icon.png`

---

## 任务清单

### A. 后端实现
- [x] A.1 创建分享配置文件 `application/src/config/shareConfig.js`
- [x] A.2 修改 `server.js`，在SPA路由前添加爬虫检测中间件
- [x] A.3 实现动态HTML生成（带og:meta）

### B. 测试验证
- [ ] B.1 本地测试：模拟微信爬虫User-Agent
- [ ] B.2 部署VPS并验证

### C. 部署
- [ ] C.1 git commit & push
- [ ] C.2 VPS执行：
  ```bash
  git pull
  docker-compose down
  docker-compose build --no-cache app
  docker-compose up -d
  ```
- [ ] C.3 微信实际分享测试

---

## 当前状态
✅ A阶段完成 - 待部署VPS验证
