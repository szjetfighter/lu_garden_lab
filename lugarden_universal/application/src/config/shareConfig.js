/**
 * 微信分享配置
 * 定义各路由的og:meta信息
 */

export const shareConfig = {
  // 默认配置（L0 门户）
  default: {
    title: '陆家花园',
    description: '一个诗歌元宇宙项目，旨在通过数字技术重新诠释和体验诗歌',
    image: '/lujiaming_icon.png'
  },

  // 静态路由配置
  routes: {
    // L1 - 宇宙
    '/zhou': {
      title: '周与春秋 - 陆家花园',
      description: '这里的诗，是你的回答'
    },
    '/maoxiaodou': {
      title: '毛小豆宇宙 - 陆家花园',
      description: '毛小豆故事演绎，演绎了你的故事么？'
    },
    '/pending': {
      title: '匿，腻，溺 - 陆家花园',
      description: '实验，以及冒犯。谁？当然是你'
    },

    // L2 - 子模块
    '/maoxiaodou/moshi': {
      title: '摸诗 - 陆家花园',
      description: '棒子老虎鸡？不如老虎机！'
    },
    '/pending/001_newarrival': {
      title: 'NEW ARRIVAL - 陆家花园',
      description: '贩卖机，卖空气'
    },
    '/pending/002_whoiszd': {
      title: '谁是ZD - 陆家花园',
      description: '炎石做得，陆家明做不得？'
    }
  }
};

/**
 * 根据路径获取分享配置
 * @param {string} path - 请求路径
 * @returns {Object} 分享配置 { title, description, image }
 */
export function getShareConfig(path) {
  // 精确匹配
  if (shareConfig.routes[path]) {
    return {
      ...shareConfig.default,
      ...shareConfig.routes[path]
    };
  }

  // 前缀匹配（按长度降序，优先匹配更具体的路径）
  const sortedRoutes = Object.keys(shareConfig.routes)
    .sort((a, b) => b.length - a.length);

  for (const route of sortedRoutes) {
    if (path.startsWith(route + '/') || path === route) {
      return {
        ...shareConfig.default,
        ...shareConfig.routes[route]
      };
    }
  }

  // 返回默认配置
  return shareConfig.default;
}

/**
 * 检测是否为爬虫（微信、Twitter、Facebook等）
 * @param {string} userAgent - User-Agent字符串
 * @returns {boolean}
 */
export function isCrawler(userAgent) {
  if (!userAgent) return false;
  
  const crawlerPatterns = [
    'MicroMessenger',      // 微信
    'Twitterbot',          // Twitter
    'facebookexternalhit', // Facebook
    'LinkedInBot',         // LinkedIn
    'Slackbot',            // Slack
    'TelegramBot',         // Telegram
    'WhatsApp'             // WhatsApp
  ];

  return crawlerPatterns.some(pattern => 
    userAgent.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * 生成带有og:meta的HTML
 * @param {string} originalHtml - 原始index.html内容
 * @param {Object} config - 分享配置
 * @param {string} url - 完整URL
 * @returns {string} 修改后的HTML
 */
export function injectShareMeta(originalHtml, config, url) {
  const { title, description, image } = config;
  
  // 构建完整图片URL
  const baseUrl = 'https://lugarden.space';
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // 替换title
  let html = originalHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );
  
  // 替换og:meta
  html = html.replace(
    /<meta property="og:title" content=".*?">/,
    `<meta property="og:title" content="${title}">`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?">/,
    `<meta property="og:description" content="${description}">`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?">/,
    `<meta property="og:url" content="${url}">`
  );
  html = html.replace(
    /<meta property="og:image" content=".*?">/,
    `<meta property="og:image" content="${fullImageUrl}">`
  );
  
  // 替换Twitter Card
  html = html.replace(
    /<meta name="twitter:title" content=".*?">/,
    `<meta name="twitter:title" content="${title}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?">/,
    `<meta name="twitter:description" content="${description}">`
  );
  html = html.replace(
    /<meta name="twitter:image" content=".*?">/,
    `<meta name="twitter:image" content="${fullImageUrl}">`
  );
  
  return html;
}
