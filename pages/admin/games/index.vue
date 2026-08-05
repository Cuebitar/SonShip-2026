<template>
  <div class="page-container bg-dark min-h-screen pb-16">

    <!-- Header -->
    <section class="py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <NuxtLink to="/admin/dashboard" class="text-xs text-primary/60 hover:text-primary transition-colors mb-3 inline-flex items-center gap-1">
          ← Admin Dashboard
        </NuxtLink>
        <h1 class="font-heading font-black text-3xl md:text-4xl text-primary mb-2">Games Dashboard</h1>
        <p class="font-body text-tertiary">Manage camp games, scores, and live game state</p>
      </div>
    </section>

    <!-- Game Cards -->
    <section class="container-inner mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

      <NuxtLink
        to="/admin/games/detective"
        class="card p-6 border border-primary/30 hover:border-primary/70 hover:bg-primary/5 transition-all group block"
      >
        <div class="flex items-start justify-between mb-5">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">🔍</div>
          <span class="text-xs font-bold uppercase tracking-widest text-primary/40 group-hover:text-primary/80 transition-colors mt-1">Manage →</span>
        </div>
        <h2 class="font-heading font-black text-2xl text-white mb-2">The Final Night</h2>
        <p class="text-sm text-tertiary/70 mb-5 leading-relaxed">
          Detective mystery game. Campers collect clues via QR/NFC across 5 stages, gated behind mini-game challenges.
        </p>

        <div class="space-y-1.5 mb-5">
          <div v-if="!detectiveStore.loaded" class="text-xs text-tertiary/40 py-2">Loading leaderboard…</div>
          <div v-else-if="detectiveStore.leaderboard.length === 0" class="text-xs text-tertiary/40 py-2">No groups scored yet.</div>
          <div
            v-for="(entry, i) in detectiveStore.leaderboard.slice(0, 3)" :key="entry.name"
            class="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2"
          >
            <span class="flex items-center gap-2 text-white font-bold truncate">
              <span :class="['font-heading font-black', i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-400' : 'text-amber-600']">{{ i + 1 }}</span>
              {{ entry.name }}
            </span>
            <span class="font-heading font-black text-primary shrink-0">{{ entry.total }} <span class="text-[9px] font-normal text-primary/40">/300</span></span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-tertiary/60">5 Stages</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-tertiary/60">QR / NFC Clues</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-tertiary/60">100 pts / stage</span>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/games/ai-city"
        class="card p-6 border border-blue-500/30 hover:border-blue-500/70 hover:bg-blue-500/5 transition-all group block"
      >
        <div class="flex items-start justify-between mb-5">
          <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl">🤖</div>
          <span class="text-xs font-bold uppercase tracking-widest text-blue-400/40 group-hover:text-blue-400/80 transition-colors mt-1">Manage →</span>
        </div>
        <h2 class="font-heading font-black text-2xl text-white mb-2">AI City</h2>
        <p class="text-sm text-tertiary/70 mb-5 leading-relaxed">
          Phase 1 — The Council (AI deploy/reject decisions). Phase 2 — City Exchange (6 station missions).
        </p>

        <div class="space-y-1.5 mb-5">
          <div v-if="!aiCityStore.loaded" class="text-xs text-tertiary/40 py-2">Loading leaderboard…</div>
          <div v-else-if="aiCityStore.leaderboard.length === 0" class="text-xs text-tertiary/40 py-2">No groups scored yet.</div>
          <div
            v-for="(entry, i) in aiCityStore.leaderboard.slice(0, 3)" :key="entry.name"
            class="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2"
          >
            <span class="flex items-center gap-2 text-white font-bold truncate">
              <span :class="['font-heading font-black', i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-400' : 'text-amber-600']">{{ i + 1 }}</span>
              {{ entry.name }}
            </span>
            <span class="font-heading font-black text-blue-400 shrink-0">{{ entry.total }} <span class="text-[9px] font-normal text-blue-400/40">/{{ aiCityStore.PHASE1_MAX + aiCityStore.STATION_COUNT * aiCityStore.STATION_MAX }}</span></span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400/60">2 Phases</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400/60">6 Stations</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400/60">5 AI options</span>
        </div>
      </NuxtLink>

    </section>

  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { onMounted, onUnmounted } from 'vue'
import { useDetectiveGameStore } from '~/stores/detectiveGame'
import { useAiCityGameStore } from '~/stores/aiCityGame'

const detectiveStore = useDetectiveGameStore()
const aiCityStore = useAiCityGameStore()

onMounted(() => {
  detectiveStore.subscribe()
  aiCityStore.subscribe()
})

onUnmounted(() => {
  detectiveStore.unsubscribe()
  aiCityStore.unsubscribe()
})
</script>
