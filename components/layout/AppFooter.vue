<template>
  <footer class="bg-secondary/50 border-t border-primary/10 py-12 mt-0">
    <div class="container-inner">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">🔥</span>
            <Logo class="text-xl md:text-2xl " />
          </div>
          <p class="font-body text-sm text-tertiary/60 leading-relaxed max-w-xs">
            {{ t('home.hero_subtitle') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">{{ t('footer.quick_links') }}</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.to">
              <NuxtLink :to="link.to" class="font-body text-sm text-tertiary/60 hover:text-primary transition-colors" :aria-label="link.label" :title="link.label">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Camp Info -->
        <div>
          <h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">{{ t('footer.camp_info') }}</h4>
          <ul class="space-y-2 font-body text-sm text-tertiary/60">
            <li class="flex items-center gap-2"><span>📅</span> August 28–31, 2026</li>
            <li class="flex items-center gap-2"><span>📍</span> Radiant Retreats Site B, Jalan Utama Janda Baik, Kampung Chemperoh, 28750 Bentong, Pahang</li>
            <li class="flex items-center gap-2"><span>✉️</span> sonship2026@megasubangcmc.org.my</li>
          </ul>
        </div>
      </div>

      <div class="divider" />

      <div class="flex flex-col items-center justify-between gap-3 text-xs font-body text-tertiary/40">
        <p>© 2026 SonShip Camp. Made with ❤️ for the Kingdom.</p>
        <p>{{ t('home.hero_tagline') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Logo from '../Logo.vue'

const { t } = useI18n()

const quickLinks = [
  { to: '/', label: t('nav.home') },
  { to: '/about', label: t('nav.about') },
  { to: '/register', label: t('nav.register') },
  { to: '/login', label: t('nav.login') },
  { to: '/admin/registrations', label: 'Admin (Registrations)' },
]
</script>
