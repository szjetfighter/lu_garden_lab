<template>
  <div class="privacy-container">
    <BackButton 
      text="返回"
      @click="goBack"
    />
    
    <div class="privacy-content">
      <h1 class="privacy-title">陆家花园隐私政策</h1>
      <p class="last-updated">最后更新：2025年11月4日</p>
      <p class="intro-text">陆家花园重视并保护您的个人隐私。本政策说明我们如何收集、使用、存储和保护您的个人信息，符合《中华人民共和国个人信息保护法》的要求。</p>

      <section class="section">
        <h2>1. 我们收集哪些信息</h2>
        
        <h3>1.1 账号信息</h3>
        <p>当您注册账号时，我们会收集：</p>
        <ul>
          <li><strong>用户名</strong>：用于登录验证和作品署名</li>
          <li><strong>密码</strong>：经过加密存储，平台无法查看明文密码</li>
        </ul>
        
        <h3>1.2 创作内容</h3>
        <p>当您使用共笔功能创作诗歌时，我们会存储：</p>
        <ul>
          <li>您在共笔过程中的回答和输入</li>
          <li>AI生成的诗歌作品</li>
          <li>创作时间戳</li>
        </ul>
        
        <h3>1.3 我们不收集的信息</h3>
        <p class="highlight"><strong>陆家花园是纯粹的诗歌创作平台，我们只关心您的创作，不关心您是谁。</strong></p>
        <p>我们<strong>不会</strong>收集以下信息：</p>
        <ul class="no-collect-list">
          <li>❌ 真实姓名</li>
          <li>❌ 身份证号码</li>
          <li>❌ 手机号码</li>
          <li>❌ 电子邮箱地址</li>
          <li>❌ 地理位置信息</li>
          <li>❌ IP地址</li>
          <li>❌ 浏览器指纹或设备信息</li>
          <li>❌ Cookie或其他追踪技术</li>
        </ul>
        
        <h3>1.4 为什么收集这么少？</h3>
        <p>我们遵循<strong>最小化数据收集原则</strong>。您只需要一个用户名和密码，就可以在陆家花园自由创作。我们不需要知道您的真实身份，也不会追踪您的行为。</p>
      </section>

      <section class="section">
        <h2>2. 我们如何使用您的信息</h2>
        
        <h3>2.1 账号信息的使用</h3>
        <p><strong>用户名</strong>：</p>
        <ul>
          <li>验证您的登录身份</li>
          <li>作为作品署名的一部分（"陆家明 × [您的用户名]"）</li>
          <li>在"我的作品集"中识别您的作品</li>
        </ul>
        <p><strong>密码</strong>：</p>
        <ul>
          <li>仅用于身份验证</li>
          <li>使用bcrypt算法加密存储</li>
          <li>平台开发者和管理员均无法查看明文密码</li>
        </ul>
        
        <h3>2.2 创作内容的使用</h3>
        <ul>
          <li>存储您的作品，方便您随时查看和下载</li>
          <li>提供"我的作品集"功能</li>
          <li>可能进行匿名统计分析，用于改进AI诗人的创作质量（不涉及个人身份识别）</li>
        </ul>
        
        <h3>2.3 我们不会做什么</h3>
        <p>我们<strong>绝不会</strong>：</p>
        <ul class="no-do-list">
          <li>❌ 向任何第三方出售、出租或交换您的信息</li>
          <li>❌ 用您的信息进行广告推送或营销</li>
          <li>❌ 分析您的个人偏好用于商业目的</li>
          <li>❌ 将您的信息与其他平台的数据关联或交叉分析</li>
          <li>❌ 公开展示您的个人信息（用户名除外，因为它是作品署名的一部分）</li>
        </ul>
      </section>

      <section class="section">
        <h2>3. 信息的存储与安全</h2>
        
        <h3>3.1 存储位置</h3>
        <ul>
          <li>所有用户信息存储在项目服务器的数据库中</li>
          <li>服务器位于中华人民共和国境内</li>
        </ul>
        
        <h3>3.2 安全措施</h3>
        <p>我们采取以下措施保护您的信息安全：</p>
        <ul>
          <li><strong>密码加密</strong>：使用行业标准的bcrypt算法加密存储</li>
          <li><strong>访问控制</strong>：严格限制数据库访问权限</li>
          <li><strong>数据备份</strong>：定期备份数据，防止意外丢失</li>
          <li><strong>传输加密</strong>：使用HTTPS协议保护数据传输安全</li>
        </ul>
        
        <h3>3.3 存储期限</h3>
        <p><strong>账号使用期间</strong>：持续存储您的账号信息和作品</p>
        <p><strong>账号注销后</strong>：</p>
        <ul>
          <li>立即删除您的账号信息（用户名、密码）</li>
          <li>您的创作内容将以匿名形式处理（移除与您账号的关联）</li>
          <li>数据库备份中的个人信息将在合理期限内（通常30天内）彻底删除</li>
        </ul>
        <p class="note"><strong>特别说明</strong>：已被您下载或复制的作品，平台无法控制其后续传播。</p>
      </section>

      <section class="section">
        <h2>4. 您的权利</h2>
        <p>根据《中华人民共和国个人信息保护法》，您享有以下权利：</p>
        
        <h3>4.1 查看权</h3>
        <p>您可以随时登录账号，查看自己的用户名和所有创作的作品。</p>
        
        <h3>4.2 导出权</h3>
        <p>您可以通过作品页面的下载按钮，将自己的诗歌作品导出为：</p>
        <ul>
          <li>图片格式（PNG/JPEG）</li>
          <li>文本格式（纯文本）</li>
        </ul>
        <p>每首作品可单独下载保存。</p>
        
        <h3>4.3 删除权</h3>
        <ul>
          <li>您可以随时联系我们申请注销账号</li>
          <li>注销后，我们会删除您的账号信息（用户名、密码）</li>
          <li>您的创作内容将以匿名形式处理，作品本身可能继续在平台展示（详见《用户协议》第3.2条）</li>
          <li>删除操作不可撤销，请在注销前自行导出重要作品</li>
        </ul>
        
        <h3>4.4 更正权</h3>
        <p>如您的用户名或作品信息有误，可联系我们进行更正。</p>
        
        <h3>4.5 拒绝权</h3>
        <p>您可以随时停止使用陆家花园的服务，并申请注销账号。</p>
      </section>

      <section class="section">
        <h2>5. 信息共享</h2>
        
        <h3>5.1 基本原则</h3>
        <p>我们<strong>不会主动共享</strong>您的个人信息。</p>
        
        <h3>5.2 法律要求</h3>
        <p>在以下极端情况下，我们可能需要披露您的信息：</p>
        <ul>
          <li>根据法律法规、法院命令或政府机构的强制要求</li>
          <li>为维护国家安全、公共安全或他人合法权益所必需</li>
          <li>为应对突发公共卫生事件或紧急情况所必需</li>
        </ul>
        <p>但由于我们收集的信息极少（仅用户名和密码），通常也没有什么有价值的信息可以提供。</p>
        
        <h3>5.3 服务提供商</h3>
        <p>我们可能使用第三方服务提供商来支持平台运行（如云服务器、数据库服务），但我们会要求他们遵守严格的保密义务。</p>
        
        <h3>5.4 业务转让</h3>
        <p>如陆家花园发生合并、收购或资产转让，我们会提前通知您，并要求新的持有者继续遵守本隐私政策。您有权拒绝转让并注销账号。</p>
      </section>

      <section class="section">
        <h2>6. 未成年人保护</h2>
        <p>陆家花园欢迎所有年龄段的诗歌爱好者。</p>
        <ul>
          <li>如您是未满18周岁的未成年人，请在监护人同意和指导下使用本平台</li>
          <li>我们不会故意收集未成年人的额外个人信息</li>
          <li>如监护人发现我们在未获监护人同意的情况下收集了未成年人信息，请联系我们删除</li>
        </ul>
      </section>

      <section class="section">
        <h2>7. 隐私政策的更新</h2>
        
        <h3>7.1 更新通知</h3>
        <ul>
          <li>我们可能根据法律法规变化或服务调整更新本隐私政策</li>
          <li>更新后的政策会在网站公布，生效日期会在文首注明</li>
          <li>如有重大变更，我们会通过站内通知或其他方式提醒您</li>
        </ul>
        
        <h3>7.2 继续使用视为同意</h3>
        <p>继续使用陆家花园即视为您接受更新后的隐私政策。如不接受，请停止使用服务并注销账号。</p>
      </section>

      <section class="section">
        <h2>8. 联系我们</h2>
        
        <p><strong>平台信息</strong></p>
        <ul>
          <li>项目名称：陆家花园</li>
          <li>开发者：西尔（XiEr）</li>
        </ul>
        
        <p><strong>隐私问题咨询</strong></p>
        <p>如您对本隐私政策有任何疑问、意见或建议，或需要行使您的个人信息权利（查看、导出、删除、更正），请联系：</p>
        <p>📧 <a href="mailto:lujiaming@lugarden.space">lujiaming@lugarden.space</a></p>
        <p>我们会在收到您的请求后，尽快（通常在15个工作日内）给予回复。</p>
      </section>

      <p class="farewell">陆家花园承诺保护您的隐私，让您安心创作。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import BackButton from '@/shared/components/BackButton.vue'

const router = useRouter()
const route = useRoute()

const goBack = () => {
  // 如果是从注册页面来的，返回到注册tab
  if (route.query.from === 'register') {
    router.push({ path: '/login', query: { tab: 'register' } })
  } else {
    router.back()
  }
}
</script>

<style scoped>
.privacy-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem;
  position: relative;
}

.privacy-content {
  max-width: 800px;
  margin: 4rem auto 2rem;
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  line-height: 1.8;
  color: var(--text-primary);
}

.privacy-title {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.last-updated {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.intro-text {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.section {
  margin: 2.5rem 0;
}

.section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--text-primary);
}

.section p {
  margin: 0.75rem 0;
  color: var(--text-secondary);
}

.section ul {
  margin: 0.5rem 0 0.5rem 1.5rem;
  padding: 0;
}

.section li {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

.section li strong {
  color: var(--text-primary);
}

.highlight {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid var(--color-primary);
  margin: 1rem 0;
}

.no-collect-list li,
.no-do-list li {
  color: #666;
}

.note {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-secondary);
}

.farewell {
  text-align: center;
  margin-top: 3rem;
  font-style: italic;
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.section a {
  color: var(--color-primary);
  text-decoration: none;
}

.section a:hover {
  text-decoration: underline;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .privacy-container {
    padding: 1rem;
  }

  .privacy-content {
    margin: 3rem auto 1rem;
    padding: 1.5rem;
  }

  .privacy-title {
    font-size: 1.5rem;
  }

  .section h2 {
    font-size: 1.25rem;
  }

  .section h3 {
    font-size: 1rem;
  }

  .section ul {
    margin-left: 1rem;
  }
}
</style>

