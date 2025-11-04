<template>
  <div class="terms-container">
    <BackButton 
      text="返回"
      @click="goBack"
    />
    
    <div class="terms-content">
      <h1 class="terms-title">陆家花园用户协议</h1>
      <p class="last-updated">最后更新：2025年11月4日</p>
      <p class="welcome-text">欢迎来到陆家花园！在使用我们的服务之前，请仔细阅读本协议。</p>

      <section class="section">
        <h2>1. 服务说明</h2>
        
        <h3>1.1 平台介绍</h3>
        <p>陆家花园是一个诗歌元宇宙平台，旨在通过数字技术重新诠释和体验诗歌。平台的主理人是AI诗人陆家明，他将陪伴您探索诗歌的数字世界。</p>
        
        <h3>1.2 我们提供的服务</h3>
        <ul>
          <li><strong>诗歌数字化展示</strong>：以创新的数字形式呈现经典诗歌作品</li>
          <li><strong>AI诗歌解读</strong>：陆家明为您解读诗歌的深层含义</li>
          <li><strong>AI诗歌朗读</strong>：聆听AI诗人的诗歌演绎</li>
          <li><strong>AI诗歌创作（共笔功能）</strong>：与陆家明共同创作新的诗歌作品</li>
          <li><strong>作品保存与管理</strong>：妥善保存您的创作成果</li>
          <li><strong>作品下载</strong>：将您的作品以图片或文本形式下载保存</li>
        </ul>
        
        <h3>1.3 服务性质声明</h3>
        <ul>
          <li>本平台为个人非营利项目</li>
          <li>AI生成的内容（包括解读、朗读、创作）不保证质量，仅供参考和娱乐</li>
          <li>服务可能因维护、升级、故障等原因暂时中断</li>
          <li>平台处于持续开发中，功能和界面可能会更新调整</li>
        </ul>
      </section>

      <section class="section">
        <h2>2. 账号注册与使用</h2>
        
        <h3>2.1 注册要求</h3>
        <ul>
          <li><strong>用户名</strong>：3-20个字符，仅限字母、数字、下划线</li>
          <li><strong>密码</strong>：至少6个字符，建议使用字母和数字组合</li>
          <li><strong>一人一号</strong>：每位用户仅可注册一个账号</li>
        </ul>
        
        <h3>2.2 账号安全</h3>
        <ul>
          <li>请妥善保管您的密码，不要向他人透露</li>
          <li>如发现账号被盗用，请立即联系平台</li>
          <li>平台不会主动索要您的密码</li>
        </ul>
        
        <h3>2.3 使用规范</h3>
        <p>您在使用陆家花园时，不得：</p>
        <ul>
          <li>发布违法、暴力、色情、诽谤等不良内容</li>
          <li>恶意攻击系统或干扰其他用户正常使用</li>
          <li>批量注册账号或使用自动化工具滥用服务</li>
          <li>将平台用于商业推广或其他盈利目的</li>
        </ul>
        <p>如违反上述规定，平台有权暂停或终止您的账号。</p>
      </section>

      <section class="section">
        <h2>3. 作品版权与授权</h2>
        
        <h3>3.1 版权归属</h3>
        <p>您通过陆家花园创作的作品，版权归您所有。您对作品拥有完整的著作权。</p>
        
        <h3>3.2 平台授权</h3>
        <p>为了提供和改进服务，当您使用陆家花园创作并保存作品时，即表示您不可撤销地授予平台（及开发者西尔）一项永久性的、全球范围内的、免费的、可转让的、可再许可的许可，以在陆家花园平台范围内展示、存储、使用和传播您的作品。</p>
        <p>该授权包括但不限于：</p>
        <ul>
          <li>在平台上公开展示您的作品</li>
          <li>为改进服务质量进行技术性使用（如格式转换、备份等）</li>
          <li>在平台宣传材料中使用您的作品（需匿名化处理）</li>
        </ul>
        <p>该授权不因账号注销而失效。如您注销账号，您的个人信息将被删除，但作品将继续以匿名形式在平台展示。</p>
        <p class="important"><strong>重要说明</strong>：</p>
        <ul>
          <li>您保留作品的所有其他权利（修改、在其他平台发布、商业使用等）</li>
          <li>平台不会将您的作品用于商业目的</li>
          <li>如果您不同意此授权条款，请不要保存作品到平台</li>
        </ul>
        
        <h3>3.3 账号注销后的处理</h3>
        <ul>
          <li>注销账号后，您的账号信息（用户名、密码）将被删除</li>
          <li>您的作品将以匿名形式处理，继续在平台展示</li>
          <li>已被您下载或复制的内容，平台无法控制其后续传播</li>
        </ul>
        
        <h3>3.4 作品署名</h3>
        <p>我们默认在您在线保存作品时，署名为"陆家明 × [您的用户名]"，以体现人机共创的特色。</p>
      </section>

      <section class="section">
        <h2>4. AI生成内容说明</h2>
        
        <h3>4.1 AI创作特性</h3>
        <ul>
          <li>平台的诗歌解读、朗读、创作均由AI诗人陆家明完成</li>
          <li>AI生成的内容可能存在不准确、不完整、不适当或偏离预期的情况</li>
          <li>我们会持续优化AI质量，但无法保证每一次生成都符合您的期望</li>
        </ul>
        
        <h3>4.2 AI标识</h3>
        <p>根据相关法律法规要求，平台会在AI生成的内容上明确标注"AI生成内容"标识。</p>
        
        <h3>4.3 内容责任</h3>
        <ul>
          <li>AI生成的内容不代表平台的立场或观点</li>
          <li>您对使用AI生成内容的行为自负责任</li>
          <li>如AI生成的内容涉及侵权或不当内容，请停止使用并通知我们</li>
        </ul>
      </section>

      <section class="section">
        <h2>5. 免责声明</h2>
        
        <h3>5.1 服务可用性</h3>
        <ul>
          <li>服务可能因维护、升级、网络故障、不可抗力等原因暂停或终止</li>
          <li>平台不对因服务中断、数据丢失造成的任何损失承担责任</li>
          <li>建议您及时下载保存重要作品</li>
        </ul>
        
        <h3>5.2 内容质量</h3>
        <ul>
          <li>平台不保证AI生成内容的准确性、完整性、适用性</li>
          <li>用户应自行判断内容的适用性和可靠性</li>
        </ul>
        
        <h3>5.3 用户行为</h3>
        <ul>
          <li>用户对自己发布的内容和创作输入负责</li>
          <li>如用户内容侵犯他人权利，用户承担相应法律责任</li>
        </ul>
        
        <h3>5.4 第三方链接</h3>
        <ul>
          <li>平台可能包含第三方网站的链接</li>
          <li>平台不对第三方内容的准确性和安全性负责</li>
        </ul>
      </section>

      <section class="section">
        <h2>6. 服务变更与终止</h2>
        
        <h3>6.1 协议变更</h3>
        <ul>
          <li>平台可能根据需要更新本协议</li>
          <li>更新后的协议会在网站公布，生效日期会在文首注明</li>
          <li>继续使用服务即视为接受新协议</li>
          <li>如不接受新协议，请停止使用服务并注销账号</li>
        </ul>
        
        <h3>6.2 账号注销</h3>
        <ul>
          <li>您可以随时通过联系我们申请注销账号</li>
          <li>注销后，您的个人信息将被删除（详见《陆家花园隐私政策》）</li>
        </ul>
        
        <h3>6.3 服务暂停或终止</h3>
        <ul>
          <li>如您违反本协议，平台有权暂停或终止您的账号</li>
          <li>如平台决定停止运营，会提前通知用户导出数据</li>
        </ul>
      </section>

      <section class="section">
        <h2>7. 争议解决</h2>
        
        <h3>7.1 适用法律</h3>
        <p>本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。</p>
        
        <h3>7.2 争议处理</h3>
        <ul>
          <li>因本协议产生的任何争议，双方应首先友好协商解决</li>
          <li>协商不成的，任何一方可向平台所在地人民法院提起诉讼</li>
        </ul>
      </section>

      <section class="section">
        <h2>8. 联系我们</h2>
        
        <p><strong>平台信息</strong></p>
        <ul>
          <li>项目名称：陆家花园</li>
          <li>开发者：西尔（XiEr）</li>
        </ul>
        
        <p><strong>反馈与联系</strong></p>
        <p>如有问题、建议或投诉，请联系：<a href="mailto:lujiaming@lugarden.space">lujiaming@lugarden.space</a></p>
      </section>

      <p class="farewell">感谢您来到陆家花园，陆家明愿您，宾至如归</p>
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
.terms-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem;
  position: relative;
}

.terms-content {
  max-width: 800px;
  margin: 4rem auto 2rem;
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  line-height: 1.8;
  color: var(--text-primary);
}

.terms-title {
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

.welcome-text {
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

.important {
  margin-top: 1rem;
  color: var(--text-primary);
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
  .terms-container {
    padding: 1rem;
  }

  .terms-content {
    margin: 3rem auto 1rem;
    padding: 1.5rem;
  }

  .terms-title {
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

