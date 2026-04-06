<template>
  <div class = "page-container">
    <!-- Hero Section -->
    <section class = "relative min-h-screen max-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background gradient -->
      <div
        class="absolute inset-0 bg-cover bg-center transition-opacity ease-in-out"
        :class="isBackgroundVisible ? 'opacity-100' : 'opacity-0'"
        :style="{ backgroundImage: `url(${currentBg})`, transitionDuration: '1400ms' }"
      ></div>
      <div class = "absolute inset-0 bg-gradient-hero opacity-90"></div>
      <!-- Decorative circles -->
      <!-- <div class = "absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 border border-primary/10 animate-spin-slow"></div>
      <div class = "absolute bottom-20 left-10 w-48 h-48 rounded-full bg-accent/5 border border-accent/10 animate-float"></div> -->

      <div class = "relative z-10 container-inner text-center px-4 ">
        <h1 class="sr-only">{{ seoTitle }}</h1>

        <!-- Flame brandmark -->
        <!-- <img class = "mb-12 animate-float inline-block w-40 h-40" :src = "Firelight" alt="Firelight"></img> -->

        <!-- Main title -->
        <Logo class = "md:text-9xl text-7xl pb-2 md:tracking-[-0.6rem] tracking-[-0.2rem]" />

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
        <div class = "text-5xl mb-4 group-hover:animate-bounce inline-block"><img :src="item.emoji" :alt="key" class="w-12 h-12"></div>
        <h3  class = "font-heading font-bold text-xl text-primary mb-3">{{ t(`home.highlights.${key}.title`) }}</h3>
        <p   class = "font-body text-tertiary/70 text-sm leading-relaxed">{{ t(`home.highlights.${key}.desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Topics Section -->
    <section class="py-24 bg-gradient-to-b from-dark to-secondary/10 relative overflow-hidden border-t border-primary/10">
      <!-- Decorative element -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div class="container-inner relative z-10">
        <div class="text-center mb-16">
          <h2 class="section-title mb-3">{{ t('home.topics_title') }}</h2>
          <div class="w-16 h-1 bg-gradient-warm mx-auto rounded-full"></div>
          <p class="font-body text-tertiary/70 max-w-2xl mx-auto mt-6">
            {{ t('home.topics_subtitle') }}
          </p>
        </div>
        
        <div class="space-y-6 max-w-4xl mx-auto">
          <div v-for="(item, key, index) in topics" :key="key"
               class="group relative bg-dark/40 backdrop-blur-sm border border-primary/10 hover:border-primary/30 rounded-3xl p-6 md:p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(230,177,83,0.1)] hover:-translate-y-1 overflow-hidden flex flex-col sm:flex-row items-center gap-6"
               :class="{ 'sm:flex-row-reverse': index % 2 !== 0 }">
            
            <!-- Large faint emoji in background -->
            <div class="absolute -right-10 -bottom-10 text-[10rem] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500 pointer-events-none z-0 select-none">
              {{ item.emoji }}
            </div>

            <div class="w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex items-center justify-center text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-500 relative z-10 shadow-lg">
              {{ item.emoji }}
            </div>
            
            <div class="flex-1 text-center sm:text-left relative z-10" :class="{ 'sm:text-right': index % 2 !== 0 }">
              <h3 class="font-heading font-bold text-2xl text-primary mb-3">{{ t(`home.topics.${key}.title`) }}</h3>
              <p class="font-body text-tertiary/80 text-base leading-relaxed">{{ t(`home.topics.${key}.desc`) }}</p>
            </div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivitiesStore } from '~/stores/activities'
import { ArrowRight, ChevronDown } from 'lucide-vue-next'
import Logo from '~/components/Logo.vue'
import Firelight from '../assets/firelight.svg'
import FellowshipIcon from '../assets/icon/Fellowship.svg'
import GrowthIcon from '../assets/icon/Growth.svg'
import AdventureIcon from '../assets/icon/Adventure.svg'

const backgroundImages = Object.values(import.meta.glob('~/assets/background/*.{JPG,JPEG,jpg,jpeg,png,webp}', {
  eager : true,
  import: 'default'
})).sort()

const { locale, t }       = useI18n()
const requestUrl          = useRequestURL()
const canonicalUrl        = computed(() => new URL('/', requestUrl.origin).toString())
const backgroundIndex     = ref(0)
const currentBg           = computed(() => backgroundImages[backgroundIndex.value] ?? '')
const isBackgroundVisible = ref(true)
const seoTitle            = computed(() => locale.value === 'zh'
  ? 'Home'
  : 'Home')

const seoDescription = computed(() => locale.value === 'zh'
  ? 'SonShip 2026 是 CMC Subang 青年营会官网。营会将于 2026 年 8 月 28 日至 31 日举行，欢迎报名参加这段与神、与人、与自己重新连接的旅程。'
  : 'SonShip 2026 is the official CMC Subang youth camp. Join us from August 28 to 31, 2026 for a meaningful journey of reconnecting with God, others, and yourself.')

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type'   : 'WebSite',
      name      : 'SonShip 2026',
      url       : canonicalUrl.value,
      inLanguage: locale.value
    },
    {
      '@type': 'Organization',
      name   : 'CMC Subang',
      url    : canonicalUrl.value,
      logo   : `${requestUrl.origin}/logo.svg`
    },
    {
      '@type'            : 'Event',
      name               : 'SonShip 2026 Youth Camp',
      startDate          : '2026-08-28T09:00:00+08:00',
      endDate            : '2026-08-31T18:00:00+08:00',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus        : 'https://schema.org/EventScheduled',
      image              : [`${requestUrl.origin}/logo.svg`],
      organizer          : {
        '@type': 'Organization',
        name   : 'CMC Subang'
      },
      description: seoDescription.value,
      url        : canonicalUrl.value
    }
  ]
}))

useHead(() => ({
  title: seoTitle.value,
  script: [
    {
      key: 'home-structured-data',
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))

useSeoMeta({
  title             : () => seoTitle.value,
  description       : () => seoDescription.value,
  ogTitle           : () => seoTitle.value,
  ogDescription     : () => seoDescription.value,
  ogImage           : () => `${requestUrl.origin}/assets/firelight.svg`,
  ogImageAlt        : 'SonShip 2026',
  ogType            : 'website',
  ogUrl             : () => canonicalUrl.value,
  twitterTitle      : () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage      : () => `${requestUrl.origin}/assets/firelight.svg`
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
let backgroundTimer = null
let backgroundTransitionTimer = null

const BACKGROUND_CHANGE_INTERVAL = 6000
const BACKGROUND_FADE_DURATION = 900

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

  if (backgroundImages.length > 1) {
    backgroundTimer = setInterval(() => {
      isBackgroundVisible.value = false

      if (backgroundTransitionTimer) clearTimeout(backgroundTransitionTimer)

      backgroundTransitionTimer = setTimeout(() => {
        backgroundIndex.value = (backgroundIndex.value + 1) % backgroundImages.length
        isBackgroundVisible.value = true
      }, BACKGROUND_FADE_DURATION)
    }, BACKGROUND_CHANGE_INTERVAL)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (backgroundTimer) clearInterval(backgroundTimer)
  if (backgroundTransitionTimer) clearTimeout(backgroundTransitionTimer)
})

const highlights = {
  community: { emoji: FellowshipIcon },
  growth   : { emoji: GrowthIcon },
  adventure: { emoji: AdventureIcon },
}

const topics = {
  bgr: { emoji: '❤️' },
  ai: { emoji: '🤖' },
  prodigal: { emoji: '📖' },
}
</script>
