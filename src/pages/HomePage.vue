<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-hero opacity-90"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,177,83,0.15),transparent_60%)]"></div>
      <!-- Decorative circles -->
      <div class="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 border border-primary/10 animate-spin-slow"></div>
      <div class="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-accent/5 border border-accent/10 animate-float"></div>

      <div class="relative z-10 container-inner text-center px-4">
        <!-- Flame brandmark -->
        <img class="mb-6 animate-float inline-block w-40 h-40" :src="Firelight"></img>

        <!-- Main title -->
        <Logo size="9xl" />

        <!-- Tagline -->
        <p class="font-script text-accent text-2xl md:text-3xl mb-6 animate-fade-in" style="animation-delay:0.2s">
          <img class="inline-block w-10 h-10" :src="Firelight"></img> Reconnecting...
        </p>

        <p class="font-body text-tertiary/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style="animation-delay:0.4s">
          {{ t('home.hero_subtitle') }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay:0.6s">
          <RouterLink to="/register" class="btn-primary btn-lg">
            {{ t('home.hero_cta') }}
            <ArrowRight class="w-5 h-5" />
          </RouterLink>
          <RouterLink to="/about" class="btn-ghost btn-lg">
            {{ t('home.hero_learn') }}
          </RouterLink>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown class="w-6 h-6 text-primary/60" />
        </div>
      </div>
    </section>

    <!-- Highlights -->
    <section class="py-20 bg-dark">
      <div class="container-inner">
        <div class="text-center mb-14">
          <h2 class="section-title mb-3">{{ t('home.highlights_title') }}</h2>
          <div class="w-16 h-1 bg-gradient-warm mx-auto rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(item, key) in highlights" :key="key"
            class="card-hover p-8 text-center group">
            <div class="text-5xl mb-4 group-hover:animate-bounce inline-block">{{ item.emoji }}</div>
            <h3 class="font-heading font-bold text-xl text-primary mb-3">{{ t(`home.highlights.${key}.title`) }}</h3>
            <p class="font-body text-tertiary/70 text-sm leading-relaxed">{{ t(`home.highlights.${key}.desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Sessions -->
    <section class="py-20 bg-secondary/20">
      <div class="container-inner">
        <div class="text-center mb-14">
          <h2 class="section-title mb-3">{{ t('home.sessions_title') }}</h2>
          <div class="w-16 h-1 bg-gradient-warm mx-auto rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="session in sessions" :key="session.id"
            class="card p-6 hover:border-primary/40 hover:shadow-warm transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
              <div>
                <span class="badge-primary mb-2 inline-flex">{{ session.status }}</span>
                <h3 class="font-heading font-bold text-lg text-tertiary">{{ session.name }}</h3>
              </div>
              <span class="text-3xl">{{ session.emoji }}</span>
            </div>
            <div class="space-y-2 text-sm font-body text-tertiary/60">
              <p class="flex items-center gap-2"><Calendar class="w-4 h-4 text-primary" />{{ session.date }}</p>
              <p class="flex items-center gap-2"><MapPin class="w-4 h-4 text-primary" />{{ session.location }}</p>
              <p class="flex items-center gap-2"><Users class="w-4 h-4 text-primary" />{{ session.spots }} spots left</p>
            </div>
            <div class="mt-5 pt-4 border-t border-primary/10">
              <RouterLink to="/register" class="btn-primary btn-sm w-full justify-center">Register →</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Activities Showcase -->
    <section class="py-20 bg-dark">
      <div class="container-inner">
        <div class="text-center mb-14">
          <h2 class="section-title mb-3">{{ t('home.activities_title') }}</h2>
          <div class="w-16 h-1 bg-gradient-warm mx-auto rounded-full"></div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <RouterLink v-for="act in featuredActivities" :key="act.id"
            :to="`/activities/${act.id}`"
            class="card-hover p-5 text-center group cursor-pointer">
            <div class="text-4xl mb-3">{{ act.image }}</div>
            <h4 class="font-heading font-semibold text-sm text-tertiary group-hover:text-primary transition-colors">{{ act.name }}</h4>
            <span class="badge-primary mt-2 text-xs">{{ act.category }}</span>
          </RouterLink>
        </div>
        <div class="text-center mt-8">
          <RouterLink to="/activities" class="btn-secondary">View All Activities</RouterLink>
        </div>
      </div>
    </section>

    <!-- Group Photo Banner -->
    <section class="py-20 bg-secondary/30">
      <div class="container-inner">
        <div class="rounded-3xl overflow-hidden relative bg-gradient-hero min-h-64 flex items-center justify-center p-10">
          <div class="absolute inset-0 opacity-20 flex items-center justify-center select-none">
          </div>
          <div class="relative text-center">
            <p class="font-script text-primary text-3xl md:text-5xl mb-4">{{ t('home.gallery_title') }}</p>
            <p class="font-body text-tertiary/70 mb-6">This could be you — join us this April!</p>
            <div class="flex flex-wrap justify-center gap-2 text-4xl">
              <span v-for="i in 12" :key="i" class="animate-pulse" :style="`animation-delay: ${i*0.1}s`">
                {{ ['🦁','🌸','⚡','🌙','🌊','✨','🔥','🌺','🕊️','🌟','🦅','🌈'][i-1] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="py-20 bg-dark">
      <div class="container-inner text-center">
        <h2 class="section-title mb-4">{{ t('home.cta_title') }}</h2>
        <p class="section-subtitle mb-8 max-w-xl mx-auto">{{ t('home.cta_subtitle') }}</p>
        <RouterLink to="/register" class="btn-primary btn-lg">
          {{ t('home.cta_btn') }}
          <ArrowRight class="w-5 h-5" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useActivitiesStore } from '../stores/activities'
import { ArrowRight, ChevronDown, Calendar, MapPin, Users } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'
import Firelight from '../assets/firelight.svg'
const { t } = useI18n()
const activitiesStore = useActivitiesStore()

const highlights = {
  community: { emoji: '🤝' },
  growth: { emoji: '🌱' },
  adventure: { emoji: '⛰️' },
}

const sessions = [
  { id: 1, name: 'SonShip Camp 2026', date: 'April 10–12, 2026', location: 'Nature Retreat Centre', spots: 28, status: 'Registration Open', emoji: '🏕️' },
  { id: 2, name: 'Pre-Camp Orientation', date: 'April 5, 2026', location: 'Online / Zoom', spots: 50, status: 'Coming Soon', emoji: '💻' },
  { id: 3, name: 'SonShip 2027 (Early)', date: 'TBA 2027', location: 'TBA', spots: '∞', status: 'Interested?', emoji: '🗓️' },
]

const featuredActivities = activitiesStore.activities.slice(0, 8)
</script>
