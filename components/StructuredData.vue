<template>
  <div />
</template>

<script setup lang="ts">
interface VpsProduct {
  id: number
  productName: string
  providerName: string
  price: number
  originalPrice?: number
  description?: string
  location: string
  cpu: string
  memory: string
  storage: string
  bandwidth: string
  rating?: number
  reviewCount?: number
  affiliateLink: string
}

interface Props {
  type: 'website' | 'product' | 'breadcrumb' | 'organization'
  data?: any
}

const props = defineProps<Props>()
const config = useRuntimeConfig()

// 生成结构化数据
const generateStructuredData = () => {
  const siteUrl = config.public.siteUrl || 'https://your-domain.com'
  
  switch (props.type) {
    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'VPS Deals',
        url: siteUrl,
        description: '精选全球最优惠的VPS主机方案',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/deals?search={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
      
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'VPS Deals',
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@vpsdeals.com'
        },
        sameAs: [
          'https://twitter.com/vpsdeals',
          'https://facebook.com/vpsdeals'
        ]
      }
      
    case 'product':
      const product = props.data as VpsProduct
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.productName,
        description: product.description || `${product.cpu} • ${product.memory} • ${product.storage} • ${product.bandwidth}`,
        brand: {
          '@type': 'Brand',
          name: product.providerName
        },
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/vps/${product.id}`,
          priceCurrency: 'USD',
          price: product.price,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: product.providerName
          }
        },
        ...(product.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 0,
            bestRating: 5,
            worstRating: 1
          }
        })
      }
      
    case 'breadcrumb':
      const items = props.data || []
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${siteUrl}${item.url}`
        }))
      }
      
    default:
      return null
  }
}

// 注入结构化数据到页面头部
const structuredData = generateStructuredData()
if (structuredData) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData)
      }
    ]
  })
}
</script>