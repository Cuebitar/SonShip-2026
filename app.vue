<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
const { locale } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const requestUrl = useRequestURL()

const localizedDescription = computed(() => locale.value === 'zh'
  ? 'SonShip 2026 是 CMC Subang 青年营会官网，帮助你与神、与人、与自己重新连接。'
  : 'SonShip 2026 is the official CMC Subang youth camp website, helping you reconnect with God, others, and yourself.')

const localizedSiteName = computed(() => locale.value === 'zh' ? 'SonShip 2026 青年营会' : 'SonShip 2026 Youth Camp')
const canonicalUrl = computed(() => new URL(route.fullPath || '/', requestUrl.origin).toString())
const robotsPolicy = computed(() => {
  if (route.meta.requiresAuth || route.meta.guestOnly || route.path.startsWith('/admin')) {
    return 'noindex, nofollow'
  }

  return 'index, follow, max-image-preview:large'
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  },
  titleTemplate: (title) => title ? `${title} | SonShip 2026` : 'SonShip 2026',
  link: [
    { rel: 'canonical', href: canonicalUrl.value }
  ]
}))

useSeoMeta({
  applicationName: 'SonShip 2026',
  description: () => localizedDescription.value,
  ogDescription: () => localizedDescription.value,
  ogImage: () => `${requestUrl.origin}/logo.svg`,
  ogImageAlt: () => localizedSiteName.value,
  ogLocale: () => locale.value === 'zh' ? 'zh_TW' : 'en_US',
  ogSiteName: () => localizedSiteName.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  robots: () => robotsPolicy.value,
  themeColor: '#1a1a1a',
  twitterCard: 'summary_large_image',
  twitterDescription: () => localizedDescription.value,
  twitterImage: () => `${requestUrl.origin}/logo.svg`,
  twitterTitle: () => localizedSiteName.value
})

onMounted(() => {
  auth.init()
})
</script>
