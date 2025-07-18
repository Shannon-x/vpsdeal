// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // App configuration
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
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // Plugins
  plugins: [],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'nuxt-icon',
  ],

  // Google Fonts
  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700, 800, 900],
      'Space Grotesk': [300, 400, 500, 600, 700],
    }
  },

  // Server-side rendering
  ssr: true,

  // Nitro configuration
  nitro: {
    preset: 'node-server'
  },

  // Runtime config
  runtimeConfig: {
    // Private keys
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'your-admin-password',
    
    // Public keys
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
    }
  },

  // Build configuration
  build: {
    transpile: ['vue-toastification']
  },

  // Experimental features
  experimental: {
    payloadExtraction: false
  }
})