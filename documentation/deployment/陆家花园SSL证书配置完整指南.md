# 陆家花园 SSL/TLS 证书配置完整指南（零基础版）

> **文档目标**：让网络架构师通过第一性原理理解HTTPS工作机制，并完成Let's Encrypt免费证书的申请与自动续期配置

---

## 目录

- [第零部分：为什么需要HTTPS](#第零部分为什么需要https)
- [第一部分：SSL/TLS基础概念（网络架构师视角）](#第一部分ssltls基础概念网络架构师视角)
- [第二部分：Let&#39;s Encrypt工作原理](#第二部分lets-encrypt工作原理)
- [第三部分：实战配置步骤](#第三部分实战配置步骤)
  - [3.7 添加新子域名（以chat.lugarden.space为例）](#37-添加新子域名以chatlugardensspace为例)
- [第四部分：故障排查案例](#第四部分故障排查案例)
- [第五部分：维护与监控](#第五部分维护与监控)

---

## 第零部分：为什么需要HTTPS

### HTTP的致命缺陷

HTTP协议是明文传输的，这在网络架构中相当于：

```
HTTP (明文传输):
用户 ──────→ [所有数据可见] ──────→ 服务器
        ↑
    任何中间节点都能：
    1. 窃听数据（密码、Token）
    2. 篡改数据（注入恶意代码）
    3. 冒充身份（中间人攻击）
```

### HTTPS的本质

HTTPS = HTTP + TLS/SSL加密层

```
HTTPS (加密传输):
用户 ──────→ [TLS加密隧道] ──────→ 服务器
        ↑
    中间节点只能看到：
    - 目标IP和端口（类似VPN外层包头）
    - 无法解密内容（除非破解2048位RSA）
```

**类比网络架构**：HTTPS相当于在应用层建立了一个类似IPSec VPN的加密隧道。

---

## 第一部分：SSL/TLS基础概念（网络架构师视角）

### 1.1 核心概念映射

| TLS概念                      | 网络架构类比       | 说明                          |
| ---------------------------- | ------------------ | ----------------------------- |
| **数字证书**           | 设备证书（802.1X） | 证明服务器身份的凭证          |
| **CA（证书颁发机构）** | 根CA服务器         | 可信的第三方认证机构          |
| **公钥/私钥**          | SSH密钥对          | 非对称加密的密钥对            |
| **证书链**             | 信任链             | 从根CA到终端证书的信任路径    |
| **ACME协议**           | 自动化配置协议     | Let's Encrypt的自动化验证协议 |

### 1.2 TLS握手过程（OSI模型视角）

```
应用层(L7): HTTP请求/响应
    ↓
TLS层: 
    1. Client Hello    → 发送支持的加密套件
    2. Server Hello    ← 选择加密算法 + 发送证书
    3. 证书验证        → 客户端验证证书链
    4. 密钥交换        ↔ 使用公钥加密对称密钥
    5. 建立加密通道    ↔ 后续所有数据用对称密钥加密
    ↓
传输层(L4): TCP连接
```

**关键理解**：

- **非对称加密**（RSA/ECDSA）：只用于握手阶段（慢但安全）
- **对称加密**（AES）：用于数据传输（快但需要安全分发密钥）
- TLS巧妙地用非对称加密来安全分发对称密钥

### 1.3 证书的本质

**证书是什么？**

证书是一个包含以下信息的文件：

```
数字证书内容:
┌─────────────────────────────────┐
│ 1. 域名 (lugarden.space)       │
│ 2. 公钥 (2048位RSA)             │
│ 3. 颁发者 (Let's Encrypt)       │
│ 4. 有效期 (2025-11-01 ~ 2026-01-29) │
│ 5. 数字签名 (CA的私钥签名)      │
└─────────────────────────────────┘
```

**验证逻辑**：

```
浏览器验证证书:
1. 检查域名是否匹配 → 防止证书被盗用
2. 检查有效期 → 防止过期证书
3. 检查CA签名 → 用CA的公钥验证签名（公钥内置在浏览器/操作系统中）
4. 检查证书链 → 从根CA到中间CA到终端证书
5. 检查吊销列表 (OCSP) → 证书是否被撤销
```

---

## 第二部分：Let's Encrypt工作原理

### 2.1 为什么选择Let's Encrypt

| 对比项               | 传统CA（Symantec/DigiCert） | Let's Encrypt          |
| -------------------- | --------------------------- | ---------------------- |
| **费用**       | $50-300/年                  | 完全免费               |
| **验证方式**   | 人工审核（DV/OV/EV）        | 自动化验证（ACME协议） |
| **证书有效期** | 1-2年                       | 90天（强制自动续期）   |
| **适用场景**   | 企业级（需要OV/EV）         | 个人/中小企业          |

### 2.2 ACME协议工作流程

**ACME = Automatic Certificate Management Environment（自动证书管理环境）**

#### Webroot验证方式（本次使用）

```
验证流程:
1. 你的服务器 → Let's Encrypt: 
   "我想为 lugarden.space 申请证书"

2. Let's Encrypt → 你的服务器:
   "好的，请在 http://lugarden.space/.well-known/acme-challenge/随机字符串 
    放一个包含特定内容的文件"

3. 你的服务器 → 文件系统:
   在 /var/www/certbot/.well-known/acme-challenge/ 创建验证文件

4. Let's Encrypt → 你的服务器:
   从公网访问 http://lugarden.space/.well-known/acme-challenge/随机字符串
   验证内容是否正确

5. 验证通过 → Let's Encrypt颁发证书
```

**关键点**：

- 验证必须通过**公网HTTP(80端口)**访问
- 证明了你对该域名有控制权
- 不需要停止现有服务

#### 其他验证方式

| 验证方式             | 原理                      | 适用场景                    |
| -------------------- | ------------------------- | --------------------------- |
| **Webroot**    | HTTP文件验证              | 已有Web服务运行（本次使用） |
| **Standalone** | Certbot临时启动HTTP服务器 | 80端口空闲                  |
| **DNS-01**     | 添加DNS TXT记录           | 没有公网服务器/通配符证书   |

---

## 第三部分：实战配置步骤

### 3.1 前置条件检查

**必需满足**：

```bash
# 1. 域名已解析到VPS
ping lugarden.space  # 应返回你的VPS IP

# 2. 80端口可从公网访问
curl -I http://lugarden.space  # 应返回200 OK

# 3. Docker和docker-compose已安装
docker --version
docker-compose --version
```

### 3.2 目录结构准备

```bash
# 在项目根目录执行
cd /root/lu_garden_lab

# 创建certbot所需目录
mkdir -p nginx/certbot/conf
mkdir -p nginx/certbot/www
```

**目录说明**：

```
nginx/
├── certbot/
│   ├── conf/          # 证书存储目录（映射到容器的 /etc/letsencrypt）
│   └── www/           # ACME验证文件目录（映射到 /var/www/certbot）
└── nginx.conf         # Nginx配置文件
```

### 3.3 配置nginx支持ACME验证

**关键配置**（必须在HTTP服务器块中添加）：

```nginx
server {
    listen       80;
    server_name  lugarden.space www.lugarden.space;

    # ★★★ 关键：Let's Encrypt验证路径 ★★★
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;  # 对应docker-compose中的volume挂载
        allow all;
    }

    # 其他配置...
}
```

**为什么需要这个配置？**

```
缺少此配置的后果:
Let's Encrypt → http://lugarden.space/.well-known/acme-challenge/xxx
                         ↓
                    Nginx收到请求
                         ↓
                  找不到location规则
                         ↓
                   返回404错误
                         ↓
                ★ 证书申请失败 ★

添加配置后:
Let's Encrypt → http://lugarden.space/.well-known/acme-challenge/xxx
                         ↓
                    匹配 ^~ /.well-known/acme-challenge/
                         ↓
                从 /var/www/certbot 目录查找文件
                         ↓
                   返回验证文件
                         ↓
                ★ 证书申请成功 ★
```

### 3.4 配置docker-compose.yml

**Certbot服务配置**：

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./lugarden_universal/frontend_vue/dist:/usr/share/nginx/html:ro
      - ./nginx/certbot/conf:/etc/letsencrypt:ro      # ← 证书目录（只读）
      - ./nginx/certbot/www:/var/www/certbot:ro       # ← 验证文件目录（只读）
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app

  certbot:
    image: certbot/certbot:latest
    volumes:
      - ./nginx/certbot/conf:/etc/letsencrypt         # ← 证书目录（读写）
      - ./nginx/certbot/www:/var/www/certbot          # ← 验证文件目录（读写）
    # 自动续期任务（每12小时检查一次）
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

**Volume挂载说明**：

| 宿主机路径               | 容器路径             | 权限                   | 用途         |
| ------------------------ | -------------------- | ---------------------- | ------------ |
| `./nginx/certbot/conf` | `/etc/letsencrypt` | certbot: rw, nginx: ro | 证书存储     |
| `./nginx/certbot/www`  | `/var/www/certbot` | certbot: rw, nginx: ro | ACME验证文件 |

### 3.5 申请证书

#### Step 1: 启动服务

```bash
docker-compose up -d
```

#### Step 2: 验证HTTP访问

```bash
# 在VPS上测试
curl -I http://lugarden.space

# 应看到：
# HTTP/1.1 200 OK
# Server: nginx/1.27.5
```

#### Step 3: 测试ACME路径（可选但强烈推荐）

```bash
# 创建测试文件
echo "test" > nginx/certbot/www/test.txt

# 测试能否从公网访问
curl http://lugarden.space/.well-known/acme-challenge/test.txt

# 应输出: test

# 测试成功后删除
rm nginx/certbot/www/test.txt
```

#### Step 4: 申请证书

```bash
docker-compose run --rm --entrypoint certbot certbot \
  certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email 你的邮箱@example.com \
  --agree-tos \
  --no-eff-email \
  -d lugarden.space \
  -d www.lugarden.space
```

**参数说明**：

| 参数                     | 说明                             |
| ------------------------ | -------------------------------- |
| `--rm`                 | 运行后删除容器                   |
| `--entrypoint certbot` | 覆盖docker-compose中的entrypoint |
| `certonly`             | 只获取证书，不修改配置           |
| `--webroot`            | 使用webroot验证方式              |
| `--webroot-path`       | 验证文件存放目录                 |
| `--email`              | 用于接收证书过期提醒             |
| `--agree-tos`          | 同意Let's Encrypt服务条款        |
| `--no-eff-email`       | 不订阅EFF邮件列表                |
| `-d`                   | 指定域名（可多次使用）           |

**成功输出示例**：

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/lugarden.space/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/lugarden.space/privkey.pem
This certificate expires on 2026-01-29.
```

#### Step 5: 验证证书文件

```bash
ls -la nginx/certbot/conf/live/lugarden.space/

# 应看到4个符号链接:
# cert.pem       → 证书本身
# chain.pem      → 中间证书链
# fullchain.pem  → 完整证书链（cert + chain）
# privkey.pem    → 私钥
```

### 3.6 配置HTTPS

#### Step 1: 修改nginx配置

**完整HTTPS配置示例**：

```nginx
http {
    # ... 其他配置 ...

    # HTTP服务器（仅用于重定向和ACME验证）
    server {
        listen       80;
        server_name  lugarden.space www.lugarden.space;

        # Let's Encrypt验证路径（必须保留，用于证书续期）
        location ^~ /.well-known/acme-challenge/ {
            root /var/www/certbot;
            allow all;
        }

        # 其他所有请求重定向到HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS服务器
    server {
        listen       443 ssl http2;
        server_name  lugarden.space www.lugarden.space;

        # ★★★ SSL证书配置 ★★★
        ssl_certificate /etc/letsencrypt/live/lugarden.space/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/lugarden.space/privkey.pem;
      
        # SSL安全配置（推荐）
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
      
        # 会话缓存（提高性能）
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # HSTS（强制HTTPS）
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # 其他配置（API代理、静态文件等）...
    }
}
```

**关键配置解释**：

| 配置项                            | 说明               | 安全影响                         |
| --------------------------------- | ------------------ | -------------------------------- |
| `ssl_protocols TLSv1.2 TLSv1.3` | 只允许TLS 1.2和1.3 | 禁用不安全的SSL 3.0、TLS 1.0/1.1 |
| `ssl_ciphers`                   | 加密套件列表       | 只允许安全的加密算法             |
| `ssl_session_cache`             | 会话缓存           | 减少握手次数，提高性能           |
| `Strict-Transport-Security`     | HSTS头             | 强制浏览器只用HTTPS访问          |

#### Step 2: 测试配置并重新加载

```bash
# 1. 备份当前配置
cp nginx/nginx.conf nginx/nginx.conf.backup

# 2. 使用HTTPS配置
cp nginx/nginx-step2-https.conf nginx/nginx.conf

# 3. 测试配置语法
docker-compose exec nginx nginx -t

# 应看到:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# 4. 重新加载配置
docker-compose exec nginx nginx -s reload
```

#### Step 3: 验证HTTPS

```bash
# 测试HTTPS访问
curl -I https://lugarden.space

# 应看到:
# HTTP/1.1 200 OK
# Strict-Transport-Security: max-age=31536000; includeSubDomains

# 测试HTTP自动跳转
curl -I http://lugarden.space

# 应看到:
# HTTP/1.1 301 Moved Permanently
# Location: https://lugarden.space/
```

**浏览器测试**：

打开 `https://lugarden.space`，检查：

- ✅ 地址栏显示锁图标
- ✅ 证书信息显示"由 Let's Encrypt 颁发"
- ✅ 有效期到2026-01-29

---

### 3.7 添加新子域名（以chat.lugarden.space为例）

#### 场景说明

当你需要为项目添加新的子域名时（如 `chat.lugarden.space`），有两种方案可选：

**方案A：扩展现有证书（推荐）**

- 一个证书覆盖多个域名（SAN - Subject Alternative Name）
- 证书统一管理，续期一次全部更新
- 符合Let's Encrypt最佳实践

**方案B：单独申请新证书**

- 每个子域名独立证书
- 续期复杂度增加
- 不推荐（除非有特殊安全隔离需求）

**陆家花园项目选择**：方案A

---

#### Step 1: 配置DNS解析

```bash
# 在DNS提供商添加A记录
chat.lugarden.space → VPS IP地址（与lugarden.space相同）

# 验证解析生效
ping chat.lugarden.space  # 应返回VPS IP
```

---

#### Step 2: 配置Nginx

**添加新的server块**（以iframe方案为例）：

```nginx
http {
    # ... 现有配置 ...

    # ====== chat子域名 - HTTP ======
    server {
        listen       80;
        server_name  chat.lugarden.space;

        # Let's Encrypt验证路径（必须）
        location ^~ /.well-known/acme-challenge/ {
            root /var/www/certbot;
            allow all;
        }

        # 其他请求重定向到HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # ====== chat子域名 - HTTPS ======
    server {
        listen       443 ssl http2;
        server_name  chat.lugarden.space;

        # SSL证书（与主域名共享）
        ssl_certificate /etc/letsencrypt/live/lugarden.space/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/lugarden.space/privkey.pem;
      
        # SSL安全配置
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        # 静态文件目录（iframe页面）
        root /usr/share/nginx/chat;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "chat proxy healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

**关键点**：

1. ✅ HTTP server块必须包含ACME验证路径
2. ✅ HTTPS server块使用相同的证书路径（`lugarden.space/`）
3. ✅ 证书文件会在后续步骤中更新为包含新子域名

---

#### Step 3: 配置docker-compose.yml

**添加chat静态文件挂载**：

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./lugarden_universal/frontend_vue/dist:/usr/share/nginx/html:ro
      - ./nginx/html/chat:/usr/share/nginx/chat:ro  # ← 新增：chat子域名静态文件
      - ./nginx/certbot/conf:/etc/letsencrypt:ro
      - ./nginx/certbot/www:/var/www/certbot:ro
```

**注意挂载路径**：

- ❌ 不能挂载到 `/usr/share/nginx/html/chat`（父目录是只读的）
- ✅ 必须挂载到独立路径 `/usr/share/nginx/chat`

---

#### Step 4: 创建chat静态文件

**创建目录**：

```bash
mkdir -p nginx/html/chat
```

**创建 `nginx/html/chat/index.html`**：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陆家花园 - AI聊天</title>
    <meta name="description" content="陆家花园AI聊天助手">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }
        .loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="loading">正在加载聊天界面...</div>
    <iframe
        src="https://udify.app/chat/Wb9Ud7yFza2aMHni"
        allowfullscreen
        allow="camera; microphone; clipboard-read; clipboard-write"
        onload="document.querySelector('.loading').style.display='none'">
    </iframe>
</body>
</html>
```

---

#### Step 5: 重启服务验证配置

```bash
# 1. 测试配置语法
docker-compose exec nginx nginx -t

# 2. 如果配置正确，重启服务
docker-compose down
docker-compose up -d

# 3. 验证HTTP访问（应返回200）
curl -I http://chat.lugarden.space

# 4. 验证ACME路径（应返回200）
curl -I http://chat.lugarden.space/.well-known/acme-challenge/test
```

---

#### Step 6: 扩展SSL证书

**关键理解**：你需要**删除旧证书并重新申请**，而不是"续期"。

##### 6.1 停止certbot容器

```bash
# 停止所有服务（但保持nginx运行）
docker-compose stop certbot
```

**为什么要停止certbot？**

- certbot容器的默认entrypoint是自动续期
- 如果不停止，它会用旧配置覆盖新证书

##### 6.2 删除旧证书

```bash
docker-compose run --rm --entrypoint "certbot" certbot \
  delete --cert-name lugarden.space
```

**输出示例**：

```
The following certificate(s) are selected for deletion:
  * lugarden.space

WARNING: Before continuing, ensure that the listed certificates 
are not being used...

Are you sure you want to delete the above certificate(s)?
(Y)es/(N)o: y                           # ← 输入 y 确认

Deleted all files relating to certificate lugarden.space.
```

**删除操作会清理**：

- `/etc/letsencrypt/live/lugarden.space/` 目录
- `/etc/letsencrypt/renewal/lugarden.space.conf` 配置文件

##### 6.3 重新申请包含新子域名的证书

```bash
docker-compose run --rm --entrypoint "certbot" certbot \
  certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email 402323607@qq.com \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d lugarden.space \
  -d www.lugarden.space \
  -d chat.lugarden.space
```

**参数说明**：

- `--entrypoint "certbot"`：覆盖docker-compose中的默认entrypoint
- `--force-renewal`：强制重新申请（即使未到期）
- `-d` 多次使用：一个证书包含多个域名（SAN）

**成功输出**：

```
Requesting a certificate for lugarden.space and 2 more domains

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/lugarden.space/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/lugarden.space/privkey.pem
This certificate expires on 2026-01-29.
```

##### 6.4 验证新证书内容

```bash
# 方法1：查看证书域名列表
docker-compose exec certbot certbot certificates

# 应显示:
# Certificate Name: lugarden.space
#   Domains: lugarden.space chat.lugarden.space www.lugarden.space
#   Expiry Date: 2026-01-29 (VALID: 89 days)

# 方法2：查看证书SAN字段
docker-compose exec certbot openssl x509 \
  -in /etc/letsencrypt/live/lugarden.space/chain.pem \
  -noout -text | grep -A 1 "Subject Alternative Name"

# 应显示:
# X509v3 Subject Alternative Name:
#   DNS:chat.lugarden.space, DNS:lugarden.space, DNS:www.lugarden.space
```

---

#### Step 7: 启动certbot自动续期

```bash
docker-compose up -d certbot
```

**验证自动续期配置**：

```bash
# 检查renewal配置文件
cat nginx/certbot/conf/renewal/lugarden.space.conf

# 应包含所有三个域名:
# [[webroot_map]]
# lugarden.space = /var/www/certbot
# www.lugarden.space = /var/www/certbot
# chat.lugarden.space = /var/www/certbot
```

---

#### Step 8: 重启Nginx并验证

```bash
# 1. 重启nginx加载证书
docker-compose restart nginx

# 2. 验证HTTPS访问
curl -I https://chat.lugarden.space

# 应看到:
# HTTP/1.1 200 OK
# Server: nginx/1.27.5

# 3. 验证证书有效性（浏览器测试）
```

**浏览器验证**：

- 访问 `https://chat.lugarden.space`
- 点击地址栏锁图标 → 查看证书
- 确认：
  - ✅ 主题备用名称（SAN）包含 `chat.lugarden.space`
  - ✅ 颁发者：Let's Encrypt
  - ✅ 有效期正常

---

#### 关键技术决策：为什么不能直接续期？

**Let's Encrypt的证书机制**：

```
SAN（主题备用名称）是证书的固有属性，不可修改

旧证书:
┌─────────────────────────────┐
│ SAN:                        │
│   - lugarden.space          │
│   - www.lugarden.space      │
└─────────────────────────────┘
      ↓ 尝试 --expand
      ❌ 无法修改，必须删除重建

新证书:
┌─────────────────────────────┐
│ SAN:                        │
│   - lugarden.space          │
│   - www.lugarden.space      │
│   - chat.lugarden.space  ← 新增
└─────────────────────────────┘
```

**为什么 `--expand`失败？**

1. **Certbot的entrypoint冲突**：

   - docker-compose中配置的entrypoint是 `certbot renew`
   - 即使命令行指定 `--expand`，也会被覆盖
   - 解决方案：`--entrypoint "certbot"`
2. **renewal配置文件干扰**：

   - `/etc/letsencrypt/renewal/lugarden.space.conf` 记录了旧配置
   - `certbot renew` 读取此文件，发现"未到期"就跳过
   - 解决方案：先 `delete` 删除旧配置，再重新申请
3. **最佳实践**：

   ```bash
   # ❌ 错误方式（会失败）
   docker-compose run certbot certonly --expand ...

   # ✅ 正确方式（成功）
   docker-compose run --rm --entrypoint "certbot" certbot \
     delete --cert-name lugarden.space
   docker-compose run --rm --entrypoint "certbot" certbot \
     certonly --force-renewal -d ... -d ... -d ...
   ```

---

#### 自动续期的保障

**续期时会发生什么？**

```
60天后，certbot定时任务触发:

1. 读取 /etc/letsencrypt/renewal/lugarden.space.conf
   → 发现配置包含 3 个域名

2. 对每个域名执行 HTTP-01 验证:
   http://lugarden.space/.well-known/acme-challenge/xxx
   http://www.lugarden.space/.well-known/acme-challenge/xxx
   http://chat.lugarden.space/.well-known/acme-challenge/xxx
   
3. 所有域名验证通过后，颁发新证书（包含所有3个域名）

4. Nginx自动加载新证书（因为路径不变）
```

**为什么可以放心？**

| 关键点                 | 保障机制                                       |
| ---------------------- | ---------------------------------------------- |
| **配置持久化**   | `renewal/lugarden.space.conf` 已包含所有域名 |
| **HTTP验证路径** | 所有server块都配置了ACME location              |
| **Nginx不中断**  | 续期只替换文件，不需要重启                     |
| **失败通知**     | 邮件提醒（402323607@qq.com）                   |

**验证自动续期**（测试模式）：

```bash
# 模拟续期（不会真正更新证书）
docker-compose exec certbot certbot renew --dry-run

# 应显示:
# Processing /etc/letsencrypt/renewal/lugarden.space.conf
# - - - - - - - - - - - - - - - - - - - - - - - - - - - 
# Congratulations, all simulated renewals succeeded
```

---

#### 总结：添加子域名的标准流程

```bash
# 1. DNS解析
ping chat.lugarden.space  # 验证解析

# 2. 更新Nginx配置
# - 添加HTTP/HTTPS server块
# - 包含ACME验证路径

# 3. 更新docker-compose.yml
# - 添加静态文件挂载（如需要）

# 4. 创建静态文件
mkdir -p nginx/html/chat
# 创建 index.html

# 5. 重启服务验证HTTP
docker-compose down && docker-compose up -d

# 6. 扩展SSL证书
docker-compose stop certbot
docker-compose run --rm --entrypoint "certbot" certbot delete --cert-name lugarden.space
docker-compose run --rm --entrypoint "certbot" certbot certonly --force-renewal \
  -d lugarden.space -d www.lugarden.space -d chat.lugarden.space

# 7. 验证并启动自动续期
docker-compose exec certbot certbot certificates  # 确认3个域名
docker-compose up -d certbot
docker-compose restart nginx

# 8. 浏览器验证
# https://chat.lugarden.space
```

**操作时间**：约10分钟

**风险**：低（旧证书删除后，新证书申请失败会导致HTTPS暂时不可用，但HTTP访问不受影响）

**回滚方案**：

```bash
# 如果新证书申请失败，恢复旧配置
git checkout nginx/nginx.conf  # 恢复旧的Nginx配置
docker-compose run --rm --entrypoint "certbot" certbot certonly \
  -d lugarden.space -d www.lugarden.space  # 重新申请旧证书
```

---

## 第四部分：故障排查案例

### 4.1 证书申请失败："No renewals were attempted"

**现象**：

```bash
docker-compose run --rm certbot certonly ...
# 输出: No renewals were attempted.
```

**原因分析**：

docker-compose.yml中的certbot服务有自定义entrypoint：

```yaml
entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

这个entrypoint会覆盖 `docker-compose run`的命令。

**解决方案**：

使用 `--entrypoint`参数覆盖：

```bash
docker-compose run --rm --entrypoint certbot certbot certonly ...
```

---

### 4.2 证书申请失败："Timeout during connect"

**完整错误信息**：

```
Certbot failed to authenticate some domains (authenticator: webroot). 
The Certificate Authority reported these problems:
  Domain: lugarden.space
  Type:   connection
  Detail: Timeout during connect (likely firewall problem)
```

**故障树分析**：

```
超时原因层次:
1. 网络层
   ├── 域名未解析到VPS
   ├── 防火墙阻止80端口
   └── 云服务商安全组未开放

2. Nginx层
   ├── Nginx未监听80端口
   ├── 缺少 /.well-known/acme-challenge/ location配置
   └── webroot路径配置错误

3. Docker层
   ├── nginx容器未运行
   ├── Volume挂载路径错误
   └── certbot无法写入www目录
```

**逐步排查**：

#### 排查1: 域名解析

```bash
# 在本地Windows执行
nslookup lugarden.space

# 应返回你的VPS IP
```

#### 排查2: 防火墙/安全组

**阿里云安全组检查**：

```
控制台 → ECS实例 → 安全组 → 配置规则
检查入方向规则:
- 协议: TCP
- 端口: 80, 443
- 授权对象: 0.0.0.0/0
```

**VPS防火墙检查**：

```bash
# 检查firewalld状态
systemctl status firewalld

# 如果启用，添加规则
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

#### 排查3: Nginx配置

```bash
# 检查nginx是否监听80端口
docker-compose exec nginx netstat -tuln | grep :80

# 应看到: tcp  0  0  0.0.0.0:80  0.0.0.0:*  LISTEN

# 检查nginx配置中是否有 /.well-known/acme-challenge/
docker-compose exec nginx cat /etc/nginx/nginx.conf | grep -A 3 "well-known"

# 应看到 location ^~ /.well-known/acme-challenge/ 配置
```

#### 排查4: 手动测试ACME路径

```bash
# 1. 创建测试文件
echo "test" > nginx/certbot/www/test.txt

# 2. 从VPS内部测试
curl http://localhost/.well-known/acme-challenge/test.txt
# 应输出: test

# 3. 从本地Windows测试（公网访问）
curl http://lugarden.space/.well-known/acme-challenge/test.txt
# 应输出: test

# 4. 如果步骤2成功但步骤3失败 → 防火墙/安全组问题
# 5. 如果步骤2失败 → nginx配置问题
```

---

### 4.3 证书申请失败："404 Not Found"

**错误信息**：

```
Detail: Fetching http://lugarden.space/.well-known/acme-challenge/xxx: 
Error getting validation data
```

**根因**：nginx配置缺少 `/.well-known/acme-challenge/` location块。

**解决方案**：

在nginx.conf的HTTP server块中添加：

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/certbot;
    allow all;
}
```

**注意**：

- `^~` 表示优先匹配，避免被其他location规则覆盖
- `root` 指令指向docker-compose中挂载的volume路径

---

### 4.4 HTTPS配置后nginx无法启动

**现象**：

```bash
docker-compose up -d
# nginx容器反复重启
```

**检查日志**：

```bash
docker-compose logs nginx

# 可能的错误:
# nginx: [emerg] cannot load certificate "/etc/letsencrypt/live/lugarden.space/fullchain.pem": 
# BIO_new_file() failed (SSL: error:02001002:system library:fopen:No such file or directory)
```

**原因**：证书文件不存在或路径错误。

**排查步骤**：

```bash
# 1. 检查宿主机证书文件
ls -la nginx/certbot/conf/live/lugarden.space/

# 2. 检查docker-compose volume挂载
docker-compose config | grep -A 5 "volumes:"

# 3. 进入nginx容器检查
docker-compose exec nginx ls -la /etc/letsencrypt/live/lugarden.space/
```

**解决方案**：

- 如果证书不存在 → 先申请证书再切换HTTPS配置
- 如果路径错误 → 修正nginx.conf中的 `ssl_certificate`路径

---

## 第五部分：维护与监控

### 5.1 证书自动续期

**Let's Encrypt证书有效期只有90天**，必须配置自动续期。

#### 自动续期机制

docker-compose.yml中已配置：

```yaml
certbot:
  entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

**工作流程**：

```
每12小时执行一次:
┌──────────────────────────────────────┐
│ 1. certbot renew                     │ ← 检查所有证书
│    ├─ 如果距离过期 < 30天            │
│    │   └─ 执行续期流程               │
│    │       ├─ ACME验证               │
│    │       ├─ 下载新证书             │
│    │       └─ 替换旧证书             │
│    └─ 如果距离过期 > 30天            │
│        └─ 跳过续期                   │
│                                      │
│ 2. sleep 12h                         │ ← 等待12小时
│                                      │
│ 3. 循环                              │
└──────────────────────────────────────┘
```

**注意**：续期后需要重新加载nginx：

```bash
# 方式1: 手动重新加载
docker-compose exec nginx nginx -s reload

# 方式2: 在docker-compose中配置自动reload（推荐）
# 在certbot服务的entrypoint中添加:
certbot renew --deploy-hook "docker exec lugarden-nginx nginx -s reload"
```

#### 优化后的自动续期配置

```yaml
certbot:
  image: certbot/certbot:latest
  container_name: lugarden-certbot
  volumes:
    - ./nginx/certbot/conf:/etc/letsencrypt
    - ./nginx/certbot/www:/var/www/certbot
    - /var/run/docker.sock:/var/run/docker.sock:ro  # ← 允许certbot容器控制其他容器
  entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew --deploy-hook \"docker exec lugarden-nginx nginx -s reload\"; sleep 12h & wait $${!}; done;'"
```

#### 手动测试续期

```bash
# 测试续期流程（不会真正续期，只是测试）
docker-compose run --rm --entrypoint certbot certbot renew --dry-run

# 应看到:
# Congratulations, all simulated renewals succeeded:
#   /etc/letsencrypt/live/lugarden.space/fullchain.pem (success)
```

### 5.2 证书监控

#### 检查证书有效期

```bash
# 方式1: 使用openssl
echo | openssl s_client -servername lugarden.space -connect lugarden.space:443 2>/dev/null | openssl x509 -noout -dates

# 输出:
# notBefore=Oct 31 00:00:00 2025 GMT
# notAfter=Jan 29 00:00:00 2026 GMT

# 方式2: 使用certbot
docker-compose run --rm --entrypoint certbot certbot certificates

# 输出:
# Certificate Name: lugarden.space
#   Domains: lugarden.space www.lugarden.space
#   Expiry Date: 2026-01-29 00:00:00+00:00 (VALID: 89 days)
```

#### 设置过期告警

**方式1：使用Let's Encrypt的邮件提醒**

申请证书时提供的邮箱会在证书过期前30天、7天、1天收到提醒邮件。

**方式2：使用监控服务**

- [SSL Labs](https://www.ssllabs.com/ssltest/) - 免费SSL测试
- [CertificateMonitor](https://certificatemonitor.org/) - 证书监控服务

**方式3：自建监控脚本**

```bash
#!/bin/bash
# 文件: /root/check-ssl-expiry.sh

DOMAIN="lugarden.space"
DAYS_WARNING=30

# 获取证书过期时间
EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null \
         | openssl x509 -noout -enddate | cut -d= -f2)

# 转换为秒数
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

if [ $DAYS_LEFT -lt $DAYS_WARNING ]; then
    echo "WARNING: SSL certificate for $DOMAIN expires in $DAYS_LEFT days!"
    # 可以在这里添加邮件/钉钉通知
fi
```

**添加到crontab（每天检查）**：

```bash
# 编辑crontab
crontab -e

# 添加一行
0 9 * * * /root/check-ssl-expiry.sh
```

### 5.3 证书吊销与替换

#### 何时需要吊销证书

- 私钥泄露
- 服务器被入侵
- 不再使用该域名

#### 吊销证书

```bash
docker-compose run --rm --entrypoint certbot certbot revoke \
  --cert-path /etc/letsencrypt/live/lugarden.space/cert.pem

# 吊销后重新申请
docker-compose run --rm --entrypoint certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email 你的邮箱@example.com \
  --agree-tos \
  --no-eff-email \
  -d lugarden.space \
  -d www.lugarden.space \
  --force-renewal
```

### 5.4 备份与恢复

#### 备份证书

```bash
# 备份整个证书目录
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz nginx/certbot/conf/

# 上传到远程存储（示例）
# scp ssl-backup-*.tar.gz user@backup-server:/backups/
```

**重要**：私钥文件（privkey.pem）必须安全保管！

#### 恢复证书

```bash
# 解压备份
tar -xzf ssl-backup-20251031.tar.gz

# 重启nginx
docker-compose restart nginx
```

---

## 第六部分：安全加固建议

### 6.1 SSL配置强化

**Mozilla SSL配置生成器**：https://ssl-config.mozilla.org/

**推荐配置（Modern）**：

```nginx
# 只支持TLS 1.3（最安全，但可能不兼容旧浏览器）
ssl_protocols TLSv1.3;

# 中级配置（推荐，兼容性好）
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

# 禁用不安全的协议（防止降级攻击）
ssl_prefer_server_ciphers off;

# 启用OCSP Stapling（加速证书验证）
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/lugarden.space/chain.pem;
resolver 8.8.8.8 8.8.4.4 valid=300s;
```

### 6.2 安全头配置

```nginx
# HSTS（强制HTTPS，有效期1年）
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# 防止点击劫持
add_header X-Frame-Options "SAMEORIGIN" always;

# 防止MIME类型嗅探
add_header X-Content-Type-Options "nosniff" always;

# XSS保护
add_header X-XSS-Protection "1; mode=block" always;

# 内容安全策略（根据实际情况调整）
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

### 6.3 SSL测试工具

**在线测试**：

```bash
# 1. SSL Labs (最权威，评级A+为最佳)
https://www.ssllabs.com/ssltest/analyze.html?d=lugarden.space

# 2. 安全头检查
https://securityheaders.com/?q=lugarden.space&followRedirects=on
```

**本地测试**：

```bash
# 测试TLS版本支持
nmap --script ssl-enum-ciphers -p 443 lugarden.space

# 测试特定TLS版本
openssl s_client -connect lugarden.space:443 -tls1_2
openssl s_client -connect lugarden.space:443 -tls1_3
```

---

## 附录A：配置文件完整示例

### docker-compose.yml

```yaml
version: '3.8'

networks:
  web:
    driver: bridge

services:
  app:
    build:
      context: ./lugarden_universal/application
      dockerfile: Dockerfile
    container_name: lugarden-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/lugarden.db
    volumes:
      - ./lugarden_universal/application/data:/app/data
    networks:
      - web
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:1.27-alpine
    container_name: lugarden-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./lugarden_universal/frontend_vue/dist:/usr/share/nginx/html:ro
      - ./nginx/certbot/conf:/etc/letsencrypt:ro
      - ./nginx/certbot/www:/var/www/certbot:ro
    depends_on:
      - app
    networks:
      - web

  certbot:
    image: certbot/certbot:latest
    container_name: lugarden-certbot
    volumes:
      - ./nginx/certbot/conf:/etc/letsencrypt
      - ./nginx/certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
    networks:
      - web
```

### nginx.conf（HTTPS版本）

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" '
                      'rt=$request_time uct="$upstream_connect_time" '
                      'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    keepalive_requests 1000;
  
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 上游服务器配置
    upstream app_upstream {
        server app:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # 限流配置
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=static:10m rate=30r/s;

    # HTTP服务器（重定向到HTTPS + ACME验证）
    server {
        listen       80;
        server_name  lugarden.space www.lugarden.space;

        # Let's Encrypt验证路径（必须保留）
        location ^~ /.well-known/acme-challenge/ {
            root /var/www/certbot;
            allow all;
        }

        # 其他所有请求重定向到HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS服务器
    server {
        listen       443 ssl http2;
        server_name  lugarden.space www.lugarden.space;

        # SSL证书配置
        ssl_certificate /etc/letsencrypt/live/lugarden.space/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/lugarden.space/privkey.pem;
      
        # SSL安全配置
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_session_tickets off;
      
        # OCSP Stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/letsencrypt/live/lugarden.space/chain.pem;
        resolver 8.8.8.8 8.8.4.4 valid=300s;
        resolver_timeout 5s;

        # 安全头
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        root /usr/share/nginx/html;
        index index.html;

        # Vue静态资源缓存
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            try_files $uri =404;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
            limit_req zone=static burst=20 nodelay;
        }

        # API限流和代理
        location /api/ {
            limit_req zone=api burst=20 nodelay;
          
            proxy_pass http://app_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_cache_bypass $http_upgrade;
          
            # 超时配置
            proxy_connect_timeout 10s;
            proxy_send_timeout 120s;
            proxy_read_timeout 320s;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Vue Router - SPA模式
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

---

## 附录B：常见问题FAQ

### Q1: Let's Encrypt证书和商业证书的区别？

| 对比项               | Let's Encrypt              | 商业证书              |
| -------------------- | -------------------------- | --------------------- |
| **加密强度**   | 相同（2048位RSA）          | 相同                  |
| **浏览器信任** | 相同（所有主流浏览器信任） | 相同                  |
| **验证类型**   | DV（域名验证）             | DV/OV/EV              |
| **地址栏显示** | 绿锁                       | 绿锁/公司名（EV证书） |
| **适用场景**   | 个人/中小企业              | 大型企业/金融机构     |
| **通配符证书** | 支持（需DNS验证）          | 支持                  |

**结论**：对于陆家花园项目，Let's Encrypt完全够用。

### Q2: 为什么证书有效期只有90天？

**Let's Encrypt的设计哲学**：

1. **强制自动化**：90天逼迫用户使用自动续期，减少人为错误
2. **降低泄露风险**：即使私钥泄露，影响时间也较短
3. **快速吊销**：更短的有效期意味着吊销证书的紧迫性降低

**商业证书为何是1-2年？**

- 历史遗留：早期证书续期是手动流程，太短会增加工作量
- 商业模式：证书是按年收费的商品

### Q3: 为什么需要同时申请 lugarden.space 和 www.lugarden.space？

**DNS解析层面**：

```
lugarden.space      → A记录 → 8.130.184.32
www.lugarden.space  → A记录 → 8.130.184.32
```

这是**两个不同的域名**，尽管它们指向同一个IP。

**SSL证书层面**：

证书的 `CN`（Common Name）字段必须与域名完全匹配：

```
访问 https://lugarden.space
→ 证书CN: lugarden.space ✅

访问 https://www.lugarden.space
→ 证书CN: lugarden.space ❌ (浏览器报错："证书域名不匹配")
```

**解决方案**：

申请证书时添加多个域名（SAN - Subject Alternative Name）：

```bash
-d lugarden.space \
-d www.lugarden.space
```

这样一个证书可以同时覆盖多个域名。

### Q4: 可以用通配符证书吗？

**通配符证书**：`*.lugarden.space`

**优点**：一个证书覆盖所有子域名

**缺点**：

1. 必须使用DNS-01验证（不能用webroot）
2. 需要DNS提供商API支持
3. 风险更高（私钥泄露影响所有子域名）

**配置示例**：

```bash
docker-compose run --rm --entrypoint certbot certbot \
  certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /path/to/cloudflare.ini \
  -d '*.lugarden.space' \
  -d lugarden.space
```

**对于陆家花园项目**：没有大量子域名，不需要通配符证书。

### Q5: 如何在多台服务器间共享证书？

**场景**：负载均衡后有多台Web服务器。

**方案1：每台服务器独立申请**

- 优点：简单，故障隔离
- 缺点：每台服务器都要暴露80端口

**方案2：集中申请，分发证书**

```bash
# 在主服务器申请证书
certbot certonly ...

# 打包证书
tar -czf cert.tar.gz /etc/letsencrypt/

# 分发到其他服务器
scp cert.tar.gz user@server2:/tmp/
ssh user@server2 "tar -xzf /tmp/cert.tar.gz -C /"
```

**方案3：使用共享存储（NFS/Ceph）**

```yaml
certbot:
  volumes:
    - /mnt/nfs/letsencrypt:/etc/letsencrypt
```

---

## 总结：SSL配置检查清单

### 部署前检查

- [ ] 域名已解析到VPS
- [ ] 80端口可从公网访问
- [ ] Docker和docker-compose已安装
- [ ] 目录结构已创建（nginx/certbot/conf, nginx/certbot/www）

### 配置检查

- [ ] nginx.conf包含 `/.well-known/acme-challenge/` location
- [ ] docker-compose.yml正确挂载certbot volumes
- [ ] docker-compose.yml配置了自动续期entrypoint

### 申请证书

- [ ] 测试HTTP访问正常
- [ ] 测试ACME路径可访问（可选）
- [ ] 执行certbot certonly命令
- [ ] 验证证书文件存在

### 启用HTTPS

- [ ] 备份原nginx.conf
- [ ] 修改nginx.conf添加SSL配置
- [ ] 测试配置语法（nginx -t）
- [ ] 重新加载nginx
- [ ] 验证HTTPS访问
- [ ] 验证HTTP自动跳转

### 运维维护

- [ ] 证书自动续期已配置
- [ ] 监控证书有效期（邮件/脚本）
- [ ] 定期备份证书文件
- [ ] SSL Labs测试评级A+

---

**文档版本**：v1.1
**最后更新**：2025-10-31
**维护者**：西尔(XiEr)
**项目**：陆家花园诗歌元宇宙

**更新记录**：

- v1.1 (2025-10-31): 新增3.7节"添加新子域名"，详细说明chat.lugarden.space的配置流程
- v1.0 (2025-10-31): 初始版本，完整的SSL证书配置指南
