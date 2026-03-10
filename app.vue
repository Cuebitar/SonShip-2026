<template>
  <div id="app" :class="{ 'font-zh': locale === 'zh' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { locale } = useI18n()

useHead({
  titleTemplate: (title) => title ? `${title} | SonShip 2026` : 'SonShip 2026',
  meta: [
    { name: 'description', content: 'The official youth camp for CMC Subang. Join us this August 28-31 for a time of spiritual growth and fun!' },
    { property: 'og:title', content: 'SonShip 2026 Camp' },
    { property: 'og:description', content: 'The official youth camp for CMC Subang. Join us this August 28-31.' },
    { name: 'theme-color', content: '#1a1a1a' }
  ]
})
</script>
