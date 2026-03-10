<template>
  <div class="page-container" v-if="activity">
    <!-- Hero -->
    <section class="py-24 bg-gradient-dark relative overflow-hidden">
      <div class="absolute inset-0" :style="`background: radial-gradient(circle at 60% 40%, ${categoryColors[activity.category]}22, transparent 60%)`"></div>
      <div class="container-inner relative z-10">
        <NuxtLink to="/activities" class="inline-flex items-center gap-2 text-sm font-body text-tertiary/60 hover:text-primary mb-8 transition-colors">
          <ArrowLeft class="w-4 h-4" /> {{ t('common.back') }}
        </NuxtLink>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span class="badge-primary mb-4 inline-flex capitalize">{{ activity.category }}</span>
            <h1 class="section-title mb-4">{{ activity.name }}</h1>
            <p class="font-body text-tertiary/75 text-lg leading-relaxed mb-6">{{ activity.description }}</p>
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2 text-sm font-body text-tertiary/60">
                <Clock class="w-4 h-4 text-primary" /> {{ activity.duration }}
              </div>
              <div class="flex items-center gap-2 text-sm font-body text-tertiary/60">
                <MapPin class="w-4 h-4 text-primary" /> {{ activity.location }}
              </div>
              <div class="flex items-center gap-2 text-sm font-body text-tertiary/60">
                <Users class="w-4 h-4 text-primary" /> Max {{ activity.capacity }}
              </div>
              <div class="flex items-center gap-2 text-sm font-body text-tertiary/60">
                <Zap class="w-4 h-4 text-primary" /> {{ activity.difficulty }}
              </div>
            </div>
          </div>
          <div class="text-center">
            <div class="text-[10rem] animate-float inline-block">{{ activity.image }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Details -->
    <section class="py-16 bg-dark">
      <div class="container-inner grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Requirements -->
        <div class="card p-6">
          <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
            <CheckCircle class="w-5 h-5" /> {{ t('activities.requirements') }}
          </h3>
          <ul class="space-y-2">
            <li v-for="req in activity.requirements" :key="req" class="flex items-center gap-2 text-sm font-body text-tertiary/70">
              <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span> {{ req }}
            </li>
            <li v-if="!activity.requirements.length" class="text-sm font-body text-tertiary/50">No special requirements.</li>
          </ul>
        </div>

        <!-- Schedule -->
        <div class="card p-6">
          <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5" /> {{ t('activities.schedule') }}
          </h3>
          <div v-for="slot in actSchedule" :key="slot.id" class="mb-3 pb-3 border-b border-primary/10 last:border-0">
            <p class="font-heading font-semibold text-sm text-tertiary">{{ slot.day }} • {{ slot.time }}</p>
            <p class="text-xs font-body text-tertiary/50">{{ slot.location }}</p>
          </div>
          <p v-if="!actSchedule.length" class="text-sm font-body text-tertiary/50">Schedule TBA.</p>
        </div>

        <!-- Tags -->
        <div class="card p-6">
          <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
            <Tag class="w-5 h-5" /> Tags
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in activity.tags" :key="tag" class="badge-accent capitalize">{{ tag }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Activities -->
    <section class="py-16 bg-secondary/20">
      <div class="container-inner">
        <h2 class="section-title mb-8">{{ t('activities.related') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink v-for="rel in related" :key="rel.id" :to="`/activities/${rel.id}`"
            class="card-hover p-5 text-center group">
            <div class="text-4xl mb-2">{{ rel.image }}</div>
            <p class="font-heading font-semibold text-sm text-tertiary group-hover:text-primary transition-colors">{{ rel.name }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="page-container flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-6xl mb-4">😕</p>
      <p class="font-body text-tertiary/60">Activity not found.</p>
      <NuxtLink to="/activities" class="btn-primary mt-4 inline-flex">Back to Activities</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useActivitiesStore } from '~/stores/activities'
import { useScheduleStore } from '~/stores/schedule'
import { ArrowLeft, Clock, MapPin, Users, Zap, CheckCircle, Calendar, Tag } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const store = useActivitiesStore()
const scheduleStore = useScheduleStore()

const activity = computed(() => store.getById(route.params.id))
const actSchedule = computed(() =>
  scheduleStore.schedule.filter(s => s.activityId === activity.value?.id)
)
const related = computed(() =>
  store.activities.filter(a => a.id !== activity.value?.id && a.category === activity.value?.category).slice(0, 4)
)

const categoryColors = {
  sports: '#FF6F1E', arts: '#941708', devotion: '#E6B153', teambuilding: '#3E7C17'
}
</script>
