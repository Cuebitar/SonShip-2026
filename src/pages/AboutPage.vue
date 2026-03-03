<template>
  <div class = "page-container">
    <!-- Hero -->
    <section class = "relative py-28 bg-gradient-dark overflow-hidden">
    <div     class = "absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(230,177,83,0.1),transparent_60%)]"></div>
    <div     class = "container-inner relative z-10 text-center">
    <span    class = "badge-primary mb-4 inline-flex">{{ t('about.title') }}</span>
    <h1      class = "section-title mb-4">{{ t('about.title') }}</h1>
    <p       class = "section-subtitle max-w-2xl mx-auto">{{ t('about.mission') }}</p>
      </div>
    </section>

    <!-- Story -->
    <section class = "py-20 bg-dark">
    <div     class = "container-inner">
    <div     class = "grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class = "section-title mb-6">{{ t('about.story_title') }}</h2>
            <p  class = "font-body text-tertiary/75 leading-relaxed text-lg mb-6">{{ t('about.story') }}</p>
            <p  class = "font-body text-tertiary/75 leading-relaxed">
              Each year, dozens of young people leave transformed — with a clearer sense of identity, deeper relationships, and a heart set on fire for God.
            </p>
          </div>
          <div class = "grid grid-cols-2 gap-4">
          <div v-for = "stat in stats" :key = "stat.label" class = "card p-6 text-center">
          <div class = "text-4xl font-heading font-black text-primary mb-1">{{ stat.value }}</div>
          <div class = "text-sm font-body text-tertiary/60">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section    class = "py-20 bg-secondary/20">
    <div        class = "container-inner text-center max-w-3xl mx-auto">
    <span       class = "text-5xl mb-6 block">🎯</span>
    <h2         class = "section-title mb-6">{{ t('about.mission_title') }}</h2>
    <blockquote class = "font-script text-2xl md:text-3xl text-primary/90 leading-relaxed">
          "{{ t('about.mission') }}"
        </blockquote>
      </div>
    </section>

    <!-- Team -->
    <section class = "py-20 bg-dark">
    <div     class = "container-inner">
    <h2      class = "section-title text-center mb-14">{{ t('about.team_title') }}</h2>
    <div     class = "grid grid-cols-2 md:grid-cols-4 gap-6">
    <div     v-for = "member in team" :key = "member.name" class = "card-hover p-6 text-center group">
    <div     class = "text-5xl mb-3 group-hover:animate-bounce inline-block">{{ member.emoji }}</div>
    <h4      class = "font-heading font-bold text-tertiary text-sm mb-1">{{ member.name }}</h4>
    <p       class = "font-body text-primary text-xs">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const stats = [
  { value: '500+', label: 'Lives Touched' },
  { value: '8', label: 'Years Running' },
  { value: '3', label: 'Days of Camp' },
  { value: '12', label: 'Small Groups' },
]


const team = [
  { name: 'Pastor Elson', role: 'Camp Consultant', emoji: '💼' },
  { name: 'Hao', role: 'Superior Camp Coordinator', emoji: '👨' },
  { name: 'Jolin', role: 'Camp Coordinator who assists with every details', emoji: '📄' },
  { name: 'Alvin', role: 'Camp Coordinator who does all the physical work', emoji: '🏃' },
  { name: 'Ruth L.', role: 'Worship Lead', emoji: '🎤' },
  { name: 'Shawn L.', role: 'Activities Head', emoji: '🏆' },
  { name: 'Jonathan L.', role: 'Game Head', emoji: '🎮' },
  { name: 'Florance T.', role: 'Tech & Media', emoji: '🎬' },
  { name: 'Jack', role: '3M', emoji: '🔉' },
]


</script>
