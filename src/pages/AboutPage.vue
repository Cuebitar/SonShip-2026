<template>
  <div class="page-container">
    <!-- Hero -->
    <section class="relative py-28 bg-gradient-dark overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(230,177,83,0.1),transparent_60%)]"></div>
      <div class="container-inner relative z-10 text-center">
        <span class="badge-primary mb-4 inline-flex">{{ t('about.title') }}</span>
        <h1 class="section-title mb-4">{{ t('about.title') }}</h1>
        <p class="section-subtitle max-w-2xl mx-auto">{{ t('about.mission') }}</p>
      </div>
    </section>

    <!-- Story -->
    <section class="py-20 bg-dark">
      <div class="container-inner">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="section-title mb-6">{{ t('about.story_title') }}</h2>
            <p class="font-body text-tertiary/75 leading-relaxed text-lg mb-6">{{ t('about.story') }}</p>
            <p class="font-body text-tertiary/75 leading-relaxed">
              Each year, dozens of young people leave transformed — with a clearer sense of identity, deeper relationships, and a heart set on fire for God.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="stat in stats" :key="stat.label" class="card p-6 text-center">
              <div class="text-4xl font-heading font-black text-primary mb-1">{{ stat.value }}</div>
              <div class="text-sm font-body text-tertiary/60">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="py-20 bg-secondary/20">
      <div class="container-inner text-center max-w-3xl mx-auto">
        <span class="text-5xl mb-6 block">🎯</span>
        <h2 class="section-title mb-6">{{ t('about.mission_title') }}</h2>
        <blockquote class="font-script text-2xl md:text-3xl text-primary/90 leading-relaxed">
          "{{ t('about.mission') }}"
        </blockquote>
      </div>
    </section>

    <!-- Timeline -->
    <section class="py-20 bg-dark">
      <div class="container-inner">
        <h2 class="section-title text-center mb-14">{{ t('about.timeline_title') }}</h2>
        <div class="relative max-w-2xl mx-auto">
          <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent"></div>
          <div v-for="(item, i) in timeline" :key="i"
            class="relative pl-12 md:pl-0 mb-10"
            :class="i % 2 === 0 ? 'md:pr-[calc(50%+2rem)] md:text-right' : 'md:pl-[calc(50%+2rem)]'">
            <div class="absolute left-0 md:left-1/2 top-1 -translate-x-1/2 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-secondary font-heading font-black text-sm shadow-warm z-10">
              {{ item.year.slice(-2) }}
            </div>
            <div class="card p-5">
              <div class="font-heading font-bold text-primary text-sm mb-1">{{ item.year }}</div>
              <div class="font-heading font-semibold text-tertiary mb-1">{{ item.title }}</div>
              <div class="font-body text-sm text-tertiary/60">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20 bg-secondary/20">
      <div class="container-inner">
        <h2 class="section-title text-center mb-14">{{ t('about.team_title') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="member in team" :key="member.name" class="card-hover p-6 text-center group">
            <div class="text-5xl mb-3 group-hover:animate-bounce inline-block">{{ member.emoji }}</div>
            <h4 class="font-heading font-bold text-tertiary text-sm mb-1">{{ member.name }}</h4>
            <p class="font-body text-primary text-xs">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const stats = [
  { value: '500+', label: 'Lives Touched' },
  { value: '8', label: 'Years Running' },
  { value: '3', label: 'Days of Camp' },
  { value: '12', label: 'Small Groups' },
]

const timeline = [
  { year: '2018', title: 'The Spark', desc: 'SonShip began with 30 young people and a big dream.' },
  { year: '2019', title: 'Growing Flames', desc: 'Doubled in size, introduced small groups and worship nights.' },
  { year: '2020', title: 'Digital Pivot', desc: 'Moved online during the pandemic — God still showed up.' },
  { year: '2021', title: t('home.hero_tagline'), desc: 'First hybrid camp. The theme "Reconnect" was born.' },
  { year: '2022', title: 'Back with Fire', desc: 'Fully in-person with 120 campers — the best year yet.' },
  { year: '2023', title: 'Expanding', desc: 'Partnered with 5 churches across Malaysia.' },
  { year: '2025', title: 'Identity', desc: 'Camp theme: Who are you as a son/daughter of God?' },
  { year: '2026', title: 'This Year!', desc: 'SonShip 2026 — join us as we go deeper.' },
]

const team = [
  { name: 'Pastor Jason', role: 'Camp Director', emoji: '👨‍💼' },
  { name: 'Sarah Tan', role: 'Worship Lead', emoji: '🎤' },
  { name: 'Marcus Lee', role: 'Activities Head', emoji: '🏃' },
  { name: 'Grace Ng', role: 'Pastoral Care', emoji: '💚' },
  { name: 'David Lim', role: 'Tech & Media', emoji: '🎬' },
  { name: 'Priya R.', role: 'Small Groups', emoji: '👥' },
  { name: 'Ethan K.', role: 'Logistics', emoji: '📦' },
  { name: 'Mei Chen', role: 'Registration', emoji: '📋' },
]

const certs = [
  'First Aid Certified Staff',
  'Safe Church Policy',
  'Child Protection Trained',
  'Emergency Response Plan',
  'Licensed Camp Facility',
]
</script>
