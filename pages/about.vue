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
          <div class = "text-sm font-body text-tertiary/60">{{ t(stat.label) }}</div>
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
    <p       class = "font-body text-primary text-xs">{{ t(member.role) }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { buildCanonicalUrl, normalizeSiteUrl } from '~/lib/site'

const { locale, t } = useI18n()
const config = useRuntimeConfig()
const siteUrl = normalizeSiteUrl(config.public.siteUrl)
const campersStore   = ref(null);
const seoTitle       = computed(() => locale.value === 'zh' ? '关于我们' : 'About Us');
const seoDescription = computed(() => locale.value === 'zh'
  ? '了解 SonShip 2026 的故事、使命与团队。由 CMC Subang 主办的青年营会，2026 年 8 月 28 日至 31 日于彭亨吉兰丹举行，诚邀你同行。'
  : 'Learn about SonShip 2026, the annual youth camp organized by CMC Subang. Discover our mission, story, and the passionate team behind the event.')
const stats = [
  { value: '50+', label: 'about.stats.attendees' },
  { value: '2019', label: 'about.stats.running_since' },
  { value: '4', label: 'about.stats.days' },
  { value: '6', label: 'about.stats.small_groups' },
]


const team = ref([
    { name: 'names.elson', role: 'about.roles.consultant', emoji: '💼' },
    { name: 'names.hao', role: 'about.roles.superior_coordinator', emoji: '👨' },
    { name: 'names.jolin', role: 'about.roles.coordinator_details', emoji: '📄' },
    { name: 'names.alvin', role: 'about.roles.coordinator_physical', emoji: '🏃' },
    { name: 'names.ruth', role: 'about.roles.worship_lead', emoji: '🎤' },
    { name: 'names.shawn', role: 'about.roles.activities_head', emoji: '🏆' },
    { name: 'names.jonathan', role: 'about.roles.game_head', emoji: '🎮' },
    { name: 'names.florance', role: 'about.roles.tech_media', emoji: '🎬' },
    { name: 'names.jack', role: 'about.roles.mmm', emoji: '🔉' },
]);
const canonicalUrl = computed(() => buildCanonicalUrl(siteUrl, '/about'));

useHead(() => ({
  title: seoTitle.value,
}))

useSeoMeta({
  title             : () => seoTitle.value,
  description       : () => seoDescription.value,
  ogTitle           : () => seoTitle.value,
  ogDescription     : () => seoDescription.value,
  ogImage           : () => `${siteUrl}/og-image.png`,
  ogImageAlt        : 'SonShip 2026',
  ogType            : 'website',
  ogUrl             : () => canonicalUrl.value,
  twitterTitle      : () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage      : () => `${siteUrl}/og-image.png`
})
onMounted(() => {

})
</script>
