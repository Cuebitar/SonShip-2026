<template>
  <div id="app" :class="{ 'font-zh': locale === 'zh' }">
    <AppNavbar />
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter v-if="showFooter($route)" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppNavbar from './components/layout/AppNavbar.vue'
import AppFooter from './components/layout/AppFooter.vue'

const { locale } = useI18n();

useHead({
  titleTemplate: (title) => title ? `${title} | SonShip 2026` : 'SonShip 2026',
  meta: [
    { name: 'description', content: 'The official youth camp for CMC Subang. Join us this August 28-31 for a time of spiritual growth and fun!' },
    { property: 'og:title', content: 'SonShip 2026 Camp' },
    { property: 'og:description', content: 'The official youth camp for CMC Subang. Join us this August 28-31.' },
    { name: 'theme-color', content: '#1a1a1a' }
  ]
})

const showFooter = (route) => {
  return route.path !== '/login' && route.path !== '/register'
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
