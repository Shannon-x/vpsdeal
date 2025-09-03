// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 开发工具配置
  devtools: { enabled: true },
  
  // 应用配置
  app: {
    head: {
      title: 'VPS Deals - 超值VPS优惠推荐',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '发现最优惠的VPS主机方案，包括香港、美国、日本等全球各地的VPS优惠信息' },
        { name: 'keywords', content: 'VPS, VPS优惠, 便宜VPS, 香港VPS, 美国VPS, 日本VPS, 云服务器' },
        { property: 'og:title', content: 'VPS Deals - 超值VPS优惠推荐' },
        { property: 'og:description', content: '发现最优惠的VPS主机方案' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'VPS Deals - 超值VPS优惠推荐' },
        { name: 'twitter:description', content: '发现最优惠的VPS主机方案' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://your-domain.com' }
      ]
    }
  },

  // CSS样式文件
  css: ['~/assets/css/main.css'],

  // 插件配置
  plugins: [],

  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss',    // Tailwind CSS框架
    '@nuxtjs/google-fonts',   // Google字体
    '@nuxtjs/color-mode',     // 颜色主题模式
    '@pinia/nuxt',            // Pinia状态管理
    'nuxt-icon',              // 图标组件
  ],

  // Google字体配置
  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700, 800, 900],
      'Space Grotesk': [300, 400, 500, 600, 700],
    }
  },

  // 服务器端渲染配置
  ssr: true,

  // Nitro服务器配置
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false,
      routes: []
    },
    experimental: {
      tasks: true
    }
  },

  // 运行时配置（环境变量）
  runtimeConfig: {
    // 私有配置（仅服务器端可访问）
    // 数据库配置
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'vps_deals',
    
    // JWT配置
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    
    // 管理员配置
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'your-admin-password',
    
    // Redis配置
    redisHost: process.env.REDIS_HOST || '',
    redisPort: process.env.REDIS_PORT || '6379',
    redisPassword: process.env.REDIS_PASSWORD || '',
    redisDb: process.env.REDIS_DB || '0',
    
    // 公共配置（客户端和服务器端都可访问）
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
      siteName: process.env.SITE_NAME || 'VPS Deals',
      siteUrl: process.env.SITE_URL || 'https://your-domain.com',
      siteDescription: process.env.SITE_DESCRIPTION || '发现最优惠的VPS主机方案',
    }
  },

  // 构建配置
  build: {
    transpile: ['vue-toastification']
  },

  // 实验性功能
  experimental: {
    payloadExtraction: false,
    appManifest: false
  },
  
  // 路由规则
  routeRules: {
    '/api/sitemap.xml': { headers: { 'content-type': 'application/xml' } },
    '/api/robots.txt': { headers: { 'content-type': 'text/plain' } }
  }
})