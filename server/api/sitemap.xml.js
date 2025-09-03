export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://your-domain.com'
  
  // 获取所有页面数据（实际应从数据库获取）
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/deals', priority: 0.9, changefreq: 'daily' },
    { url: '/categories', priority: 0.8, changefreq: 'weekly' },
    { url: '/about', priority: 0.5, changefreq: 'monthly' }
  ]
  
  // 获取所有分类页面
  const categories = [
    'under_15_year',
    'under_25_year', 
    'monthly_2_under',
    'free_vps',
    'vds',
    'nat_openvz',
    'high_performance',
    'latest_deals'
  ]
  
  const categoryPages = categories.map(cat => ({
    url: `/deals?category=${cat}`,
    priority: 0.7,
    changefreq: 'daily'
  }))
  
  // 获取所有VPS详情页（实际应从数据库获取）
  const vpsPages = [
    { url: '/vps/1', priority: 0.6, changefreq: 'weekly' },
    { url: '/vps/2', priority: 0.6, changefreq: 'weekly' },
    { url: '/vps/3', priority: 0.6, changefreq: 'weekly' }
  ]
  
  // 合并所有页面
  const allPages = [...staticPages, ...categoryPages, ...vpsPages]
  
  // 生成sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
  
  // 设置响应头
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'max-age=3600, s-maxage=3600')
  
  return sitemap
})