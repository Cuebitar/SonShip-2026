<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10">
      <!-- Welcome header -->
      <div class="mb-10">
        <p class="font-body text-tertiary/60 text-sm mb-1">{{ t('dashboard.welcome') }}</p>
        <h1 class="section-title">{{ auth.user?.name }} {{ auth.user?.avatar }}</h1>
        <div class="flex flex-wrap gap-2 mt-3">
          <span class="badge-primary">{{ auth.user?.group }}</span>
          <span class="badge-accent">Camp Code: {{ auth.user?.campCode }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <!-- Upcoming Session -->
        <div class="card p-6">
          <h2 class="font-heading font-bold text-primary mb-4 flex items-center gap-2"><Calendar class="w-5 h-5" />{{ t('dashboard.upcoming') }}</h2>
          <div class="space-y-3">
            <div class="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <p class="font-heading font-bold text-tertiary mb-1">SonShip Camp 2026</p>
              <p class="text-xs font-body text-tertiary/60">📅 August 28–31, 2026</p>
              <p class="text-xs font-body text-tertiary/60">📍 Nature Retreat Centre, Selangor</p>
            </div>
            <RouterLink to="/schedule" class="btn-ghost btn-sm w-full justify-center">View Schedule</RouterLink>
          </div>
        </div>

        <!-- Announcements -->
        <div class="card p-6">
          <h2 class="font-heading font-bold text-primary mb-4 flex items-center gap-2"><Bell class="w-5 h-5" />{{ t('dashboard.announcements') }}</h2>
          <div class="space-y-3">
            <div v-for="ann in announcements" :key="ann.id" class="border-b border-primary/10 pb-3 last:border-0 last:pb-0">
              <p class="font-body text-sm text-tertiary">{{ ann.title }}</p>
              <p class="font-body text-xs text-tertiary/50 mt-1">{{ ann.date }}</p>
            </div>
          </div>
        </div>

        <!-- My Schedule Preview -->
        <div class="card p-6">
          <h2 class="font-heading font-bold text-primary mb-4 flex items-center gap-2"><Clock class="w-5 h-5" />{{ t('dashboard.my_schedule') }}</h2>
          <div class="space-y-2">
            <div v-for="slot in mySchedule.slice(0,3)" :key="slot.id"
              class="flex items-center gap-3 bg-primary/5 rounded-lg p-3">
              <span class="text-xs font-heading font-bold text-primary w-14">{{ slot.time }}</span>
              <div>
                <p class="font-body text-xs text-tertiary font-semibold">{{ slot.name }}</p>
                <p class="font-body text-xs text-tertiary/50">{{ slot.day }}</p>
              </div>
            </div>
          </div>
          <RouterLink to="/schedule" class="btn-ghost btn-sm w-full justify-center mt-3">Full Schedule</RouterLink>
        </div>

        <!-- Secret Angel -->
        <div class="card p-6 border-primary/30">
          <h2 class="font-heading font-bold text-primary mb-2 flex items-center gap-2">
            <Heart class="w-5 h-5 text-red-400" />{{ t('dashboard.secret_angel') }}
          </h2>
          <p class="font-body text-xs text-tertiary/50 mb-4">{{ t('dashboard.secret_angel_hint') }}</p>
          <div class="relative group">
            <div class="bg-secondary/50 rounded-xl p-5 border border-primary/20 text-center filter blur-sm group-hover:blur-none transition-all duration-500 cursor-pointer">
              <div class="text-5xl mb-2">{{ angelTarget?.avatar }}</div>
              <p class="font-heading font-bold text-tertiary">{{ angelTarget?.name }}</p>
              <p class="font-body text-xs text-primary">{{ angelTarget?.group }}</p>
            </div>
            <div class="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity pointer-events-none">
              <div class="bg-dark/70 backdop-blur rounded-xl px-4 py-2">
                <p class="font-heading font-bold text-primary text-sm">Hover to reveal 👀</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Secret Identity -->
        <div class="card p-6 border-accent/30">
          <h2 class="font-heading font-bold text-accent mb-2 flex items-center gap-2">
            <Sparkles class="w-5 h-5" />{{ t('dashboard.secret_identity') }}
          </h2>
          <p class="font-body text-xs text-tertiary/50 mb-4">{{ t('dashboard.secret_identity_hint') }}</p>

          <div v-if="!identityRevealed">
            <div class="bg-secondary/50 rounded-xl p-5 text-center mb-4 border border-accent/20">
              <div class="text-5xl mb-2 filter blur-sm">👤</div>
              <p class="font-heading font-bold text-tertiary filter blur-sm">???</p>
            </div>
            <div class="flex gap-2">
              <input v-model="revealCode" type="text" class="input flex-1 text-sm"
                :placeholder="t('dashboard.reveal_code')" />
              <button @click="tryReveal" class="btn-secondary btn-sm px-4">{{ t('dashboard.reveal_btn') }}</button>
            </div>
            <p v-if="wrongCode" class="font-body text-xs text-red-400 mt-2">{{ t('dashboard.wrong_code') }}</p>
          </div>
          <div v-else class="bg-accent/10 rounded-xl p-5 text-center border border-accent/30">
            <div class="text-5xl mb-2">✨</div>
            <p class="font-heading font-bold text-accent text-lg">{{ auth.user?.secretIdentity }}</p>
            <p class="font-body text-xs text-tertiary/50 mt-2">{{ t('dashboard.identity_revealed') }}</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="card p-6">
          <h2 class="font-heading font-bold text-primary mb-4">Quick Access</h2>
          <div class="grid grid-cols-2 gap-3">
            <RouterLink v-for="link in quickLinks" :key="link.to" :to="link.to"
              class="card-hover p-4 text-center group">
              <span class="text-2xl mb-1 block">{{ link.emoji }}</span>
              <span class="font-body text-xs text-tertiary group-hover:text-primary transition-colors">{{ t(link.label) }}</span>
            </RouterLink>
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
import { useCampersStore } from '../stores/campers'
import { useScheduleStore } from '../stores/schedule'
import { Calendar, Bell, Clock, Heart, Sparkles } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()
const scheduleStore = useScheduleStore()

const revealCode = ref('')
const identityRevealed = ref(false)
const wrongCode = ref(false)

const angelTarget = computed(() => {
  if (!auth.user) return null
  return campersStore.getCamperById(auth.user.secretAngelTargetId)
})

const mySchedule = computed(() => scheduleStore.schedule.slice(0, 3))

function tryReveal() {
  wrongCode.value = false
  if (revealCode.value.trim().toUpperCase() === auth.user?.revealCode) {
    identityRevealed.value = true
  } else {
    wrongCode.value = true
    revealCode.value = ''
  }
}

const announcements = [
  { id: 1, title: '🎒 Packing list has been sent to your email!', date: 'Aug 10, 2026' },
  { id: 2, title: '📋 Pre-camp form due by August 15', date: 'Aug 1, 2026' },
  { id: 3, title: '🚌 Bus pickup details — check your group chat', date: 'July 25, 2026' },
]

const quickLinks = [
  { to: '/games', label: 'nav.games', emoji: '🎮' },
  { to: '/messages', label: 'nav.messages', emoji: '💬' },
  { to: '/letters', label: 'nav.letters', emoji: '💌' },
  { to: '/friends', label: 'nav.friends', emoji: '👥' },
  { to: '/gallery', label: 'nav.gallery', emoji: '📷' },
  { to: '/profile', label: 'nav.profile', emoji: '👤' },
]
</script>
