<template>
  <footer class="bg-secondary/50 border-t border-primary/10 py-12 mt-0">
    <div class="container-inner">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">🔥</span>
            <Logo size="2xl" />
          </div>
          <p class="font-body text-sm text-tertiary/60 leading-relaxed max-w-xs">
            {{ t('home.hero_subtitle') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.to">
              <RouterLink :to="link.to" class="font-body text-sm text-tertiary/60 hover:text-primary transition-colors">
                {{ t(link.label) }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Camp Info -->
        <div>
          <h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Camp Info</h4>
          <ul class="space-y-2 font-body text-sm text-tertiary/60">
            <li class="flex items-center gap-2"><span>📅</span> April 10–12, 2026</li>
            <li class="flex items-center gap-2"><span>📍</span> Nature Retreat Centre, Malaysia</li>
            <li class="flex items-center gap-2"><span>✉️</span> hello@sonship.camp</li>
          </ul>
        </div>
      </div>

      <div class="divider" />

      <div class="flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-body text-tertiary/40">
        <p>© 2026 SonShip Camp. Made with ❤️ for the Kingdom.</p>
        <p>reconnecting...</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Logo from '../Logo.vue'

const { t } = useI18n()

const quickLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/about', label: 'nav.about' },
  { to: '/activities', label: 'nav.activities' },
  { to: '/register', label: 'nav.register' },
  { to: '/login', label: 'nav.login' },
]
</script>
