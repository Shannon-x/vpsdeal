export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://your-domain.com'
  
  const robotsTxt = `# VPS Deals Robots.txt
# Allow all bots
User-agent: *
Allow: /

# Disallow admin areas
Disallow: /admin/
Disallow: /api/admin/

# Sitemap location
Sitemap: ${siteUrl}/api/sitemap.xml

# Crawl delay (in seconds)
Crawl-delay: 1`
  
  // 设置响应头
  setHeader(event, 'Content-Type', 'text/plain')
  setHeader(event, 'Cache-Control', 'max-age=3600, s-maxage=3600')
  
  return robotsTxt
})