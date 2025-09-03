export default defineNuxtPlugin(() => {
  // 全局SEO配置
  useHead({
    htmlAttrs: {
      lang: 'zh-CN'
    },
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      
      // Open Graph
      { property: 'og:site_name', content: 'VPS Deals - 超值VPS优惠推荐' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'zh_CN' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      
      // 搜索引擎
      { name: 'robots', content: 'index, follow' },
      { name: 'googlebot', content: 'index, follow' },
      
      // 移动端优化
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ]
  })
})