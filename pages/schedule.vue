<template>
  <div class="page-container bg-dark min-h-screen">
    <div class="container-inner py-10">
      <h1 class="section-title mb-8">{{ t('schedule.title') }}</h1>

      <div v-if="isLoading" class="text-center py-20">
        <p class="text-tertiary animate-pulse">Loading schedule from database...</p>
      </div>

      <div v-else>
        <div class="flex flex-wrap gap-2 mb-8">
          <button v-for="day in days" :key="day"
            @click="activeDay = day"
            class="badge cursor-pointer text-sm px-5 py-2 transition-all duration-200"
            :class="activeDay === day ? 'bg-primary text-secondary border-primary font-bold' : 'badge-primary hover:bg-primary/30'">
            {{ day }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-3">
            <div v-if="daySchedule.length === 0" class="text-center py-12 card">
              <p class="font-body text-tertiary/50">No sessions scheduled for {{ activeDay }} yet.</p>
            </div>
            
            <div v-for="slot in daySchedule" :key="slot.id"
              class="card p-5 flex items-center gap-4 md:gap-5 group transition-all"
              :class="isBooked(slot.id) ? 'border-primary/40 bg-primary/5' : 'hover:border-primary/20'">
              
              <div class="flex-shrink-0 text-center w-24"> 
                <p class="font-body text-[10px] text-tertiary/60 tracking-wider mb-1">{{ slot.date }}</p>
                <p class="font-heading font-black text-lg text-primary leading-none">{{ slot.time }}</p>
                <p class="font-body text-[11px] text-tertiary/40 mt-1.5">{{ slot.duration }} mins</p>
              </div>
              
              <div class="w-px self-stretch min-h-[4rem] bg-primary/20 flex-shrink-0 hidden md:block"></div>
              
              <div class="flex-1 min-w-0 flex flex-col justify-center py-1">
                <h3 class="font-heading font-bold text-tertiary group-hover:text-primary transition-colors">{{ slot.name }}</h3>
                <p class="font-body text-xs text-tertiary/50 flex items-center gap-1 mt-1">
                  <MapPin class="w-3.5 h-3.5" /> {{ slot.location || 'TBA' }}
                </p>
                
                <div v-if="slot.notes" class="mt-2.5 inline-flex items-center gap-1.5 bg-red-500/10 px-2 py-1.5 rounded text-red-400 w-fit">
                  <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
                  <span class="font-body text-[11px] leading-tight">{{ slot.notes }}</span>
                </div>
              </div>
              
              <!-- <button @click="toggleBook(slot.id)"
                class="flex-shrink-0 transition-all"
                :class="isBooked(slot.id) ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'">
                {{ isBooked(slot.id) ? '✓ ' + t('schedule.book') + 'ed' : t('schedule.book') }}
              </button> -->
            </div>
          </div>

          <div class="space-y-4">
            <div class="card p-6">
              <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
                <CalendarCheck class="w-5 h-5" /> {{ t('schedule.personal') }}
              </h3>
              <div v-if="myBookedSlots.length === 0" class="text-center py-6">
                <p class="font-body text-xs text-tertiary/40">No sessions booked yet.</p>
              </div>
              <div v-for="slot in myBookedSlots" :key="slot.id" class="mb-4 pb-4 border-b border-primary/10 last:border-0 last:pb-0">
                <p class="font-heading font-semibold text-sm text-tertiary">{{ slot.name }}</p>
                <p class="font-body text-xs text-primary mt-1">{{ slot.date }} · {{ slot.time }}</p>
                <p class="font-body text-xs text-tertiary/50 mt-1 flex items-center gap-1"><MapPin class="w-3 h-3"/>{{ slot.location || 'TBA' }}</p>

                <button @click="toggleBook(slot.id)" class="text-red-400 text-xs font-body hover:underline mt-2">
                  {{ t('schedule.unbook') }}
                </button>
              </div>
            </div>

            <div class="card p-5">
              <h4 class="font-heading font-bold text-sm text-primary mb-3">Camp Dates</h4>
              <div class="space-y-2 text-xs font-body text-tertiary/60">
                <p>📅 Day 1 — 28 Aug 2026 · 建立关系</p>
                <p>📅 Day 2 — 29 Aug 2026 · 建立关系</p>
                <p>📅 Day 3 — 30 Aug 2026 · 灵命</p>
                <p>📅 Day 4 — 31 Aug 2026 · Action Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useScheduleStore } from '~/stores/schedule'
import { MapPin, CalendarCheck, AlertCircle } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const scheduleStore = useScheduleStore()

const isLoading = ref(true)
const activeDay = ref('')

const days = computed(() => {
  let uniqueDays = scheduleStore.getDays()
  return uniqueDays.sort((a, b) => a.localeCompare(b))
})

const daySchedule = computed(() => {
  let slots = scheduleStore.getByDay(activeDay.value)
  
  return slots.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime()
    const timeB = new Date(`${b.date}T${b.time}`).getTime()
    return timeA - timeB 
  })
})

const isBooked = (id) => scheduleStore.isBooked(auth.user?.id, id)

const myBookedSlots = computed(() => {
  const booked = scheduleStore.getUserBookings(auth.user?.id)
  let slots = scheduleStore.schedule.filter(s => booked.includes(s.id))
  
  return slots.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime()
    const timeB = new Date(`${b.date}T${b.time}`).getTime()
    return timeA - timeB
  })
})

// function toggleBook(id) {
//   if (isBooked(id)) scheduleStore.unbook(auth.user.id, id)
//   else scheduleStore.book(auth.user.id, id)
// }

onMounted(async () => {
  await scheduleStore.initSchedule()
  
  if (days.value.length > 0) {
    activeDay.value = days.value[0]
  }

  isLoading.value = false
})
</script>