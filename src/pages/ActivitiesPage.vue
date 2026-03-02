<template>
  <div class="page-container">
    <!-- Header -->
    <section class="py-24 bg-gradient-dark relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(230,177,83,0.1),transparent_60%)]"></div>
      <div class="container-inner relative z-10 text-center">
        <h1 class="section-title mb-4">{{ t('activities.title') }}</h1>
        <p class="section-subtitle max-w-xl mx-auto">{{ t('activities.subtitle') }}</p>

        <!-- Search -->
        <div class="mt-8 max-w-md mx-auto relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary/40" />
          <input v-model="searchQuery" type="text"
            :placeholder="t('activities.search_placeholder')"
            class="input pl-11 text-center" />
        </div>

        <!-- Category filters -->
        <div class="flex flex-wrap gap-2 justify-center mt-6">
          <button v-for="cat in categories" :key="cat.value"
            @click="activeCategory = cat.value"
            class="badge cursor-pointer transition-all duration-200"
            :class="activeCategory === cat.value ? 'bg-primary text-secondary border-primary' : 'badge-primary hover:bg-primary/30'">
            {{ t(`activities.${cat.value}`) }}
          </button>
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="py-16 bg-dark">
      <div class="container-inner">
        <TransitionGroup name="activity-list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink v-for="act in filteredActivities" :key="act.id"
            :to="`/activities/${act.id}`"
            class="card-hover p-6 group block">
            <div class="flex items-start justify-between mb-4">
              <span class="text-5xl">{{ act.image }}</span>
              <span class="badge-primary capitalize text-xs">{{ act.category }}</span>
            </div>
            <h3 class="font-heading font-bold text-lg text-tertiary group-hover:text-primary transition-colors mb-2">{{ act.name }}</h3>
            <p class="font-body text-sm text-tertiary/60 leading-relaxed mb-4 line-clamp-2">{{ act.description }}</p>
            <div class="flex flex-wrap gap-3 text-xs font-body text-tertiary/50">
              <span class="flex items-center gap-1"><Clock class="w-3.5 h-3.5" />{{ act.duration }}</span>
              <span class="flex items-center gap-1"><MapPin class="w-3.5 h-3.5" />{{ act.location }}</span>
              <span class="flex items-center gap-1"><Users class="w-3.5 h-3.5" />{{ act.capacity }}</span>
            </div>
            <div class="mt-4 pt-4 border-t border-primary/10">
              <span class="font-heading font-semibold text-primary text-sm group-hover:underline">{{ t('activities.view_details') }} →</span>
            </div>
          </RouterLink>
        </TransitionGroup>

        <div v-if="filteredActivities.length === 0" class="text-center py-20">
          <p class="text-5xl mb-4">🔍</p>
          <p class="font-body text-tertiary/60">No activities found. Try a different search.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivitiesStore } from '../stores/activities'
import { Search, Clock, MapPin, Users } from 'lucide-vue-next'

const { t } = useI18n()
const store = useActivitiesStore()

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { value: 'all' }, { value: 'sports' }, { value: 'arts' }, { value: 'devotion' }, { value: 'teambuilding' },
]

const filteredActivities = computed(() => {
  let list = store.activities
  if (activeCategory.value !== 'all') list = list.filter(a => a.category === activeCategory.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
  }
  return list
})
</script>

<style scoped>
.activity-list-enter-active, .activity-list-leave-active { transition: all 0.3s ease; }
.activity-list-enter-from, .activity-list-leave-to { opacity: 0; transform: translateY(12px); }
.activity-list-move { transition: transform 0.3s ease; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
