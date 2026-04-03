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
    <h4      class = "font-heading font-bold text-tertiary text-sm mb-1">{{ t(member.name) }}</h4>
    <p       class = "font-body text-primary text-xs">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const campersStore = ref(null);
const seoTitle = ref('About Us');
const seoDescription = ref('Learn about SonShip 2026, the annual youth camp organized by CMC Subang. Discover our mission, story, and the passionate team behind the event.');
const stats = [
  { value: '50+', label: 'Our Attendees' },
  { value: '2019', label: 'Running Since' },
  { value: '4', label: 'Days of Camp' },
  { value: '6', label: 'Small Groups' },
]


const team = ref([
    { name: 'names.elson', role: 'Camp Consultant', emoji: '💼' },
    { name: 'names.hao', role: 'Superior Camp Coordinator', emoji: '👨' },
    { name: 'names.jolin', role: 'Camp Coordinator who assists with every details', emoji: '📄' },
    { name: 'names.alvin', role: 'Camp Coordinator who does all the physical work', emoji: '🏃' },
    { name: 'names.ruth', role: 'Worship Lead', emoji: '🎤' },
    { name: 'names.shawn', role: 'Activities Head', emoji: '🏆' },
    { name: 'names.jonathan', role: 'Game Head', emoji: '🎮' },
    { name: 'names.florance', role: 'Tech & Media', emoji: '🎬' },
    { name: 'names.jack', role: '3M', emoji: '🔉' },
]);

const requestUrl          = useRequestURL()
const canonicalUrl        = computed(() => new URL('/', requestUrl.origin).toString());
const structuredData      = computed(() => ({
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
      key: 'about-structured-data',
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
onMounted(() => {

})
</script>
