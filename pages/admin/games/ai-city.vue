<template>
  <div class="page-container bg-dark min-h-screen pb-16">

    <!-- Header -->
    <section class="py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <NuxtLink to="/admin/games" class="text-xs text-blue-400/60 hover:text-blue-400 transition-colors mb-3 inline-flex items-center gap-1">
          ← Games Dashboard
        </NuxtLink>
        <h1 class="font-heading font-black text-3xl md:text-4xl text-blue-400 mb-2">🤖 AI City</h1>
        <p class="font-body text-tertiary">Phase control, AI deployment &amp; station score management</p>
      </div>
    </section>

    <!-- Phase Control (admins only — Auditors get read-only score/audit access) -->
    <section v-if="isAdmin" class="container-inner mt-8">
      <div class="card p-5 border border-blue-500/30 bg-blue-500/5 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-2 h-2 rounded-full" :class="store.gameState.active ? 'bg-green-400 animate-pulse' : 'bg-white/20'"></span>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/80">
            Phase Control
            <span class="ml-2 text-tertiary/50 normal-case tracking-normal font-normal">
              — {{ phaseLabel(store.gameState.currentPhase) }}
            </span>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="phase in [0, 1, 2]"
            :key="phase"
            @click="setPhase(phase)"
            :class="[
              'px-4 py-2 rounded-full font-heading text-sm font-bold transition-all',
              store.gameState.currentPhase === phase
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-tertiary hover:bg-white/10'
            ]"
          >
            {{ phase === 0 ? 'Off' : phase === 1 ? 'Phase 1 — AI Deploy' : 'Phase 2 — Stations' }}
          </button>
        </div>
        <p class="text-xs text-tertiary/40 mt-3">
          Phase 1: teams choose an AI (0–65 pts) · Phase 2: scorekeeper records per-station scores (0–20 pts × 6)
        </p>
      </div>

      <NuxtLink
        to="/admin/immune-system"
        class="card p-4 border border-blue-500/30 hover:border-blue-500/70 hover:bg-blue-500/5 transition-all flex items-center justify-between gap-3 mb-6"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">🧬</div>
          <div>
            <p class="font-heading font-bold text-white text-sm">Immune System Briefing</p>
            <p class="text-xs text-tertiary/50">Reveal the article on screen for a timed 4-minute read</p>
          </div>
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-blue-400/60 shrink-0">Open →</span>
      </NuxtLink>
    </section>

    <!-- Tabs -->
    <section class="container-inner">
      <div class="flex flex-wrap gap-2 mb-6 mt-6">
        <template v-for="tab in TABS" :key="tab">
        <button
          v-if="tab === 'Overview' ? isAdmin : true"
          @click="activeTab = tab"
          :class="[
            'px-4 py-2 rounded-full font-heading text-sm font-bold transition-all',
            activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white/5 text-tertiary hover:bg-white/10'
            ]"
          >{{ tab }}</button>
        </template>
      </div>

      <!-- ── OVERVIEW TAB ── -->
      <div v-show="activeTab === 'Overview'">
        <div class="card overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="p-4 font-heading text-blue-400 font-bold text-sm w-14">Rank</th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm">Group</th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm">AI Deployed</th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-center">
                  Phase 1
                  <span class="block text-blue-400/40 font-normal text-xs">/{{ store.PHASE1_MAX }}</span>
                </th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-center">
                  Stations
                  <span class="block text-blue-400/40 font-normal text-xs">/{{ store.STATION_COUNT * store.STATION_MAX }}</span>
                </th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-center">
                  Total
                  <span class="block text-blue-400/40 font-normal text-xs">/{{ store.PHASE1_MAX + store.STATION_COUNT * store.STATION_MAX }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!store.loaded">
                <td colspan="6" class="p-8 text-center text-tertiary">Loading…</td>
              </tr>
              <tr v-else-if="store.leaderboard.length === 0">
                <td colspan="6" class="p-8 text-center text-tertiary">No groups yet.</td>
              </tr>
              <tr
                v-else
                v-for="(entry, i) in store.leaderboard"
                :key="entry.name"
                class="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td class="p-4">
                  <span :class="['font-heading font-black text-xl', rankColorClass(i)]">{{ i + 1 }}</span>
                </td>
                <td class="p-4 font-bold text-white">{{ entry.name }}</td>
                <td class="p-4">
                  <span v-if="entry.phase1_ai && entry.phase1_ai !== '—'" class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                    {{ entry.phase1_ai }}
                  </span>
                  <span v-else class="text-tertiary/30 text-xs">—</span>
                </td>
                <td class="p-4 text-center">
                  <span :class="scoreColorClass(entry.phase1_score, store.PHASE1_MAX)">{{ entry.phase1_score }}</span>
                </td>
                <td class="p-4 text-center">
                  <span :class="scoreColorClass(entry.stationTotal, store.STATION_COUNT * store.STATION_MAX)">{{ entry.stationTotal }}</span>
                </td>
                <td class="p-4 text-center">
                  <span class="font-heading font-black text-blue-400 text-xl">{{ entry.total }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── PHASE 1 TAB ── -->
      <div v-show="activeTab === 'Phase 1'">
        <p class="text-xs text-tertiary/50 mb-4">
          The Council: use <strong class="text-blue-400">Audit</strong> to walk each group through the 5 AI deploy/reject decisions and decision-quality questions.
          Score = meters + balance bonus + decision quality (max ~{{ store.PHASE1_MAX }} pts).
        </p>
        <div class="card overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[480px]">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="p-4 font-heading text-blue-400 font-bold text-sm">Group</th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm">AI Deployed</th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-center">
                  Score
                  <span class="block text-blue-400/40 font-normal text-xs">/{{ store.PHASE1_MAX }}</span>
                </th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-right">Audit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!store.loaded">
                <td colspan="4" class="p-8 text-center text-tertiary">Loading…</td>
              </tr>
              <tr v-else-if="store.leaderboard.length === 0">
                <td colspan="4" class="p-8 text-center text-tertiary">No groups yet.</td>
              </tr>
              <tr
                v-else
                v-for="entry in store.leaderboard"
                :key="entry.name"
                class="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td class="p-4 font-bold text-white">{{ entry.name }}</td>
                <td class="p-4">
                  <span v-if="entry.phase1_ai && entry.phase1_ai !== '—'" class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                    {{ entry.phase1_ai }}
                  </span>
                  <span v-else class="text-tertiary/30 text-xs">Not set</span>
                </td>
                <td class="p-4 text-center">
                  <span :class="scoreColorClass(entry.phase1_score, store.PHASE1_MAX)">{{ entry.phase1_score }}</span>
                </td>
                <td class="p-4 text-right">
                  <NuxtLink
                    :to="`/admin/games/ai-city-audit/${encodeURIComponent(entry.name)}`"
                    class="bg-blue-500/15 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 py-1.5 px-3 text-xs font-bold rounded-xl transition-all inline-block"
                  >
                    🃏 Audit
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── PHASE 2 TAB ── -->
      <div v-show="activeTab === 'Phase 2'">
        <p class="text-xs text-tertiary/50 mb-4">Scorekeeper records each station result. Score range: 0–{{ store.STATION_MAX }} pts per station.</p>
        <div class="card overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="p-4 font-heading text-blue-400 font-bold text-sm">Group</th>
                <th
                  v-for="s in store.STATION_COUNT"
                  :key="s"
                  class="p-4 font-heading text-blue-400 font-bold text-sm text-center"
                >
                  S{{ s }}
                  <span class="block text-blue-400/40 font-normal text-xs">/{{ store.STATION_MAX }}</span>
                </th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-center">
                  Total
                  <span class="block text-blue-400/40 font-normal text-xs">/{{ store.STATION_COUNT * store.STATION_MAX }}</span>
                </th>
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!store.loaded">
                <td :colspan="store.STATION_COUNT + 3" class="p-8 text-center text-tertiary">Loading…</td>
              </tr>
              <tr v-else-if="store.leaderboard.length === 0">
                <td :colspan="store.STATION_COUNT + 3" class="p-8 text-center text-tertiary">No groups yet.</td>
              </tr>
              <tr
                v-else
                v-for="entry in store.leaderboard"
                :key="entry.name"
                class="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td class="p-4 font-bold text-white">{{ entry.name }}</td>
                <td
                  v-for="(score, idx) in entry.stations"
                  :key="idx"
                  class="p-4 text-center"
                >
                  <span :class="scoreColorClass(score, store.STATION_MAX)">{{ score }}</span>
                </td>
                <td class="p-4 text-center">
                  <span class="font-heading font-black text-blue-400">{{ entry.stationTotal }}</span>
                </td>
                <td class="p-4 text-right">
                  <NuxtLink
                    :to="`/admin/games/ai-city-score/${encodeURIComponent(entry.name)}`"
                    class="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 text-xs font-bold rounded-xl transition-all inline-block"
                  >
                    📝 Record
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAiCityGameStore } from '~/stores/aiCityGame'
import { useAuthStore } from '~/stores/auth'

const TABS = ['Overview', 'Phase 1', 'Phase 2']

const store = useAiCityGameStore()
const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.is_admin === true)
const activeTab = ref('Phase 1')

onMounted(() => store.subscribe())

onUnmounted(() => store.unsubscribe())

function phaseLabel(phase) {
  if (phase === 0) return 'Off'
  if (phase === 1) return 'Phase 1 — AI Deploy'
  return 'Phase 2 — Stations'
}

async function setPhase(phase) {
  await store.setGameState({ currentPhase: phase, active: phase > 0 })
}

function rankColorClass(i) {
  if (i === 0) return 'text-yellow-400'
  if (i === 1) return 'text-slate-400'
  if (i === 2) return 'text-amber-600'
  return 'text-tertiary/30'
}

function scoreColorClass(score, max) {
  if (!score || score === 0) return 'text-tertiary/30 font-normal'
  const pct = score / max
  if (pct >= 0.8) return 'text-green-400 font-bold'
  if (pct >= 0.5) return 'text-yellow-400 font-bold'
  return 'text-white font-medium'
}

</script>
