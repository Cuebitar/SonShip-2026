<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { buildCanonicalUrl, normalizeSiteUrl } from '~/lib/site'
const { locale } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = normalizeSiteUrl(config.public.siteUrl)

const localizedDescription = computed(() => locale.value === 'zh'
  ? 'SonShip 2026 是 Mega Subang CMC 青年营会官网，帮助你与神、与人、与自己重新连接。'
  : 'SonShip 2026 is the official Mega Subang CMC youth camp website, helping you reconnect with God, others, and yourself.')

const localizedSiteName = computed(() => locale.value === 'zh' ? 'SonShip 2026 青年营会' : 'SonShip 2026 Youth Camp')
const canonicalUrl = computed(() => buildCanonicalUrl(siteUrl, route.path))
const robotsPolicy = computed(() => {
  if (route.meta.requiresAuth || route.meta.guestOnly || route.path.startsWith('/admin')) {
    return 'noindex, nofollow'
  }

  return 'index, follow, max-image-preview:large'
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value === 'zh' ? 'zh-Hans' : 'en'
  },
  titleTemplate: (title) => title ? `Sonship Firelight Camp 2026 | ${title} | Firelight Youth Service` : 'Sonship Firelight Camp 2026',
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'zh-Hans', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'en', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl.value },
  ],
  script: [
    {
      key: 'global-structured-data',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            name: localizedSiteName.value,
            url: siteUrl,
            inLanguage: locale.value === 'zh' ? 'zh-Hans' : 'en'
          },
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'CMC Subang',
            url: siteUrl,
            logo: `${siteUrl}/og-image.png`,
            email: 'sonship2026@megasubangcmc.org.my',
            sameAs: ['https://www.megasubangcmc.org.my']
          }
        ]
      })
    }
  ]
}))

useSeoMeta({
  applicationName: 'Sonship Firelight Camp 2026',
  description: () => localizedDescription.value,
  ogDescription: () => localizedDescription.value,
  ogImage: () => `${siteUrl}/og-image.png`,
  ogImageAlt: () => localizedSiteName.value,
  ogLocale: () => locale.value === 'zh' ? 'zh_CN' : 'en_US',
  ogSiteName: () => localizedSiteName.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  robots: () => robotsPolicy.value,
  themeColor: '#1a1a1a',
  twitterCard: 'summary_large_image',
  twitterDescription: () => localizedDescription.value,
  twitterImage: () => `${siteUrl}/og-image.png`,
  twitterTitle: () => localizedSiteName.value
})

onMounted(() => {
  auth.init()
})
</script>
