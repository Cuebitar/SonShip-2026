<template>
  <div class = "page-container">
    <!-- Hero Section -->
    <section class = "relative min-h-screen max-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background gradient -->
      <div class = "absolute inset-0 bg-[url('../assets/bg.JPG')] bg-cover bg-center"></div>
      <div class = "absolute inset-0 bg-gradient-hero opacity-90"></div>
      <!-- Decorative circles -->
      <!-- <div class = "absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 border border-primary/10 animate-spin-slow"></div>
      <div class = "absolute bottom-20 left-10 w-48 h-48 rounded-full bg-accent/5 border border-accent/10 animate-float"></div> -->

      <div class = "relative z-10 container-inner text-center px-4 ">
        <!-- Flame brandmark -->
        <!-- <img class = "mb-12 animate-float inline-block w-40 h-40" :src = "Firelight" alt="Firelight"></img> -->

        <!-- Main title -->
        <Logo class = "md:text-9xl text-7xl pb-2 md:tracking-[-0.7rem] tracking-[-0.4rem]" />

        <!-- Tagline -->
        <p   class=" text-sm md:text-xl mb-6 animate-fade-in mt-[-25px] md:mt-[-30px] mr-[-24px]  md:mr-[-88px]  font-body" style = "animation-delay:0.2s">
          <img class = "inline-block w-6 h-6 mr-[-5px]" :src="Firelight" alt="Firelight"/> reconnecting...
        </p>

        <p class = "font-body text-tertiary/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style = "animation-delay:0.4s">
          {{ t('home.hero_subtitle') }}
        </p>

        <div        class = "flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style = "animation-delay:0.6s">
        <NuxtLink to    = "/register" class                                                       = "btn-primary btn-lg">
            {{ t('home.hero_cta') }}
            <ArrowRight class = "w-5 h-5" />
          </NuxtLink>
          <NuxtLink to = "/about" class = "btn-ghost btn-lg">
            {{ t('home.hero_learn') }}
          </NuxtLink>
        </div>

        <!-- Scroll indicator -->
        <div         class = "absolute -bottom-16 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown class = "w-6 h-6 text-primary/60" />
        </div>
      </div>
    </section>

    <!-- Highlights -->
    <section class = "py-20 bg-dark">
    <div     class = "container-inner">
    <div     class = "text-center mb-14">
    <h2      class = "section-title mb-3">{{ t('home.highlights_title') }}</h2>
    <div     class = "w-16 h-1 bg-gradient-warm mx-auto rounded-full"></div>
        </div>
        <div class = "grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for = "(item, key) in highlights" :key = "key"
             class = "card-hover p-8 text-center group">
        <div class = "text-5xl mb-4 group-hover:animate-bounce inline-block">{{ item.emoji }}</div>
        <h3  class = "font-heading font-bold text-xl text-primary mb-3">{{ t(`home.highlights.${key}.title`) }}</h3>
        <p   class = "font-body text-tertiary/70 text-sm leading-relaxed">{{ t(`home.highlights.${key}.desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class = "py-24 relative overflow-hidden bg-secondary/10">
      <!-- Decorative background elements -->
      <div class = "absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(230,177,83,0.05),transparent_70%)] pointer-events-none"></div>
      
      <div class = "container-inner relative z-10 text-center">
      <div class = "mb-12">
      <h2  class = "section-title mb-4">{{ t('home.sessions_title') }}</h2>
      <div class = "w-16 h-1 bg-gradient-warm mx-auto rounded-full mb-6"></div>
      <p   class = "font-body text-tertiary/60 max-w-lg mx-auto">{{ t('home.sessions_subtitle') }}</p>
        </div>

        <!-- Countdown Timer -->
        <div  class = "flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
        <div  v-for = "(value, unit) in timeLeft" :key = "unit"
              class = "flex flex-col items-center">
        <div  class = "w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-dark/40 backdrop-blur-md border border-primary/20 rounded-2xl shadow-warm">
        <span class = "text-3xl md:text-5xl font-heading font-bold text-primary">{{ value }}</span>
            </div>
            <span class = "mt-3 text-xs md:text-sm font-body font-semibold uppercase tracking-widest text-tertiary/60">{{ unit }}</span>
          </div>
        </div>

        <!-- Registration CTA -->
        <div        class = "flex flex-col items-center space-y-4">
        <NuxtLink to    = "/register" class = "btn-primary btn-xl group">
            {{ t('home.cta_btn') }}
            <ArrowRight class = "w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
          <p class = "text-sm font-body text-tertiary/40">{{ t('home.cta_subtitle') }}</p>
        </div>
      </div>
    </section>



    <!-- Group Photo Banner -->
    <section class = "py-20 bg-secondary/30">
    <div     class = "container-inner">
    <div     class = "rounded-3xl overflow-hidden relative bg-gradient-hero min-h-64 flex items-center justify-center p-10">
    <div     class = "absolute inset-0 opacity-20 flex items-center justify-center select-none">
          </div>
          <div  class = "relative text-center">
          <p    class = "font-script text-primary text-3xl md:text-5xl mb-4">{{ t('home.gallery_title') }}</p>
          <p    class = "font-body text-tertiary/70 mb-6">{{ t('home.gallery_subtitle') }}</p>
          <div  class = "flex flex-wrap justify-center gap-2 text-4xl">
          <span v-for = "i in 12" :key = "i" class = "animate-pulse" :style = "`animation-delay: ${i*0.1}s`">
                {{ ['🦁','🌸','⚡','🌙','🌊','✨','🔥','🌺','🕊️','🌟','🦅','🌈'][i-1] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section    class = "py-20 bg-dark">
    <div        class = "container-inner text-center">
    <h2         class = "section-title mb-4">{{ t('home.cta_title') }}</h2>
    <p          class = "section-subtitle mb-8 max-w-xl mx-auto">{{ t('home.cta_subtitle') }}</p>
    <NuxtLink to    = "/register" class = "btn-primary btn-lg">
          {{ t('home.cta_btn') }}
          <ArrowRight class = "w-5 h-5" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivitiesStore } from '~/stores/activities'
import { ArrowRight, ChevronDown, Calendar, MapPin, Users } from 'lucide-vue-next'
import Logo from '~/components/Logo.vue'
import Firelight from '../assets/firelight.svg'
const { t }           = useI18n()
const activitiesStore = useActivitiesStore()

useHead({
  title: 'Home'
})

  // Countdown Logic
const targetDate = new Date('2026-08-28T09:00:00').getTime()
const timeLeft   = ref({
  days   : 0,
  hours  : 0,
  minutes: 0,
  seconds: 0
})

let timer = null

const updateCountdown = () => {
  const now      = new Date().getTime()
  const distance = targetDate - now

  if (distance < 0) {
    if (timer) clearInterval(timer)
    return
  }

  timeLeft.value = {
    days   : Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours  : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  }
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const highlights = {
  community: { emoji: '🤝' },
  growth   : { emoji: '🌱' },
  adventure: { emoji: '⛰️' },
}

const sessions = [
  { id: 1, name: 'SonShip Camp 2026', date: 'August 28–31, 2026', location: 'Nature Retreat Centre', spots: 28, status: 'Registration Open', emoji: '🏕️' },
  { id: 2, name: 'Pre-Camp Orientation', date: 'August 23, 2026', location: 'Online / Zoom', spots: 50, status: 'Coming Soon', emoji: '💻' },
  { id: 3, name: 'SonShip 2027 (Early)', date: 'TBA 2027', location: 'TBA', spots: '∞', status: 'Interested?', emoji: '🗓️' },
]

const featuredActivities = activitiesStore.activities.slice(0, 8)
</script>
