<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10">
      <h1 class="section-title mb-8">{{ t('schedule.title') }}</h1>

      <!-- Day Tabs -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button v-for="day in days" :key="day"
          @click="activeDay = day"
          class="badge cursor-pointer text-sm px-5 py-2 transition-all duration-200"
          :class="activeDay === day ? 'bg-primary text-secondary border-primary font-bold' : 'badge-primary hover:bg-primary/30'">
          {{ day }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Schedule Grid -->
        <div class="lg:col-span-2 space-y-3">
          <div v-if="daySchedule.length === 0" class="text-center py-12 card">
            <p class="font-body text-tertiary/50">No sessions on {{ activeDay }}</p>
          </div>
          <div v-for="slot in daySchedule" :key="slot.id"
            class="card p-5 flex items-center gap-5 group transition-all"
            :class="isBooked(slot.id) ? 'border-primary/40 bg-primary/5' : 'hover:border-primary/20'">
            <!-- Time -->
            <div class="flex-shrink-0 text-center w-16">
              <p class="font-heading font-black text-lg text-primary">{{ slot.time }}</p>
              <p class="font-body text-xs text-tertiary/40">{{ slot.duration }}m</p>
            </div>
            <div class="w-px h-12 bg-primary/20 flex-shrink-0"></div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-heading font-bold text-tertiary group-hover:text-primary transition-colors">{{ slot.name }}</h3>
              <p class="font-body text-xs text-tertiary/50 flex items-center gap-1 mt-1">
                <MapPin class="w-3 h-3" /> {{ slot.location }}
              </p>
            </div>
            <!-- Book btn -->
            <button @click="toggleBook(slot.id)"
              class="flex-shrink-0 transition-all"
              :class="isBooked(slot.id) ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'">
              {{ isBooked(slot.id) ? '✓ ' + t('schedule.book') + 'ed' : t('schedule.book') }}
            </button>
          </div>
        </div>

        <!-- My Bookings -->
        <div class="space-y-4">
          <div class="card p-6">
            <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
              <CalendarCheck class="w-5 h-5" /> {{ t('schedule.personal') }}
            </h3>
            <div v-if="myBookedSlots.length === 0" class="text-center py-6">
              <p class="font-body text-xs text-tertiary/40">No sessions booked yet.</p>
            </div>
            <div v-for="slot in myBookedSlots" :key="slot.id" class="mb-3 pb-3 border-b border-primary/10 last:border-0 last:pb-0">
              <p class="font-heading font-semibold text-sm text-tertiary">{{ slot.name }}</p>
              <p class="font-body text-xs text-primary">{{ slot.day }} · {{ slot.time }}</p>
              <p class="font-body text-xs text-tertiary/40">{{ slot.location }}</p>
              <button @click="toggleBook(slot.id)" class="text-red-400 text-xs font-body hover:underline mt-1">
                {{ t('schedule.unbook') }}
              </button>
            </div>
          </div>

          <!-- Legend -->
          <div class="card p-5">
            <h4 class="font-heading font-bold text-sm text-primary mb-3">Camp Dates</h4>
            <div class="space-y-2 text-xs font-body text-tertiary/60">
              <p>📅 Day 1 — April 10, 2026</p>
              <p>📅 Day 2 — April 11, 2026</p>
              <p>📅 Day 3 — April 12, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useScheduleStore } from '../stores/schedule'
import { MapPin, CalendarCheck } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const scheduleStore = useScheduleStore()

const days = scheduleStore.getDays()
const activeDay = ref(days[0])

const daySchedule = computed(() => scheduleStore.getByDay(activeDay.value))
const isBooked = (id) => scheduleStore.isBooked(auth.user?.id, id)
const myBookedSlots = computed(() => {
  const booked = scheduleStore.getUserBookings(auth.user?.id)
  return scheduleStore.schedule.filter(s => booked.includes(s.id))
})
function toggleBook(id) {
  if (isBooked(id)) scheduleStore.unbook(auth.user.id, id)
  else scheduleStore.book(auth.user.id, id)
}
</script>
