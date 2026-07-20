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

    <!-- Phase Control -->
    <section class="container-inner mt-8">
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
    </section>

    <!-- Tabs -->
    <section class="container-inner">
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="tab in TABS"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-4 py-2 rounded-full font-heading text-sm font-bold transition-all',
            activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white/5 text-tertiary hover:bg-white/10'
          ]"
        >{{ tab }}</button>
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
                <th class="p-4 font-heading text-blue-400 font-bold text-sm text-right">Edit</th>
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
                  <div class="inline-flex gap-2">
                    <NuxtLink
                      :to="`/admin/games/ai-city-audit/${encodeURIComponent(entry.name)}`"
                      class="bg-blue-500/15 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 py-1.5 px-3 text-xs font-bold rounded-xl transition-all"
                    >
                      🃏 Audit
                    </NuxtLink>
                    <button @click="openEdit(entry)" class="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 text-xs font-bold rounded-xl transition-all">
                      Edit
                    </button>
                  </div>
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

    <!-- Edit Modal -->
    <Transition name="modal">
      <div v-if="editTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="closeEdit"></div>
        <div class="relative card max-w-sm w-full p-0 shadow-2xl border-blue-500/30 max-h-[90vh] overflow-y-auto">

          <div class="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark/95 backdrop-blur z-10">
            <div>
              <h3 class="font-heading font-black text-xl text-blue-400">{{ editTarget.name }}</h3>
              <p class="text-xs text-tertiary mt-0.5">Phase 1 — AI Deploy &amp; Score</p>
            </div>
            <button @click="closeEdit" class="text-tertiary hover:text-white text-2xl leading-none p-1">&times;</button>
          </div>

          <div class="p-6 space-y-4">

            <!-- Phase 1 Fields -->
            <div>
              <label class="block text-xs font-bold text-blue-400/80 mb-1.5">AI Deployed</label>
              <select v-model="editForm.phase1_ai" class="input py-2 bg-dark/50">
                <option value="">— Not set —</option>
                <option v-for="ai in store.AI_OPTIONS" :key="ai" :value="ai">{{ ai }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-blue-400/80 mb-1.5">
                Phase 1 Score
                <span class="text-tertiary/40 font-normal ml-1">(0–{{ store.PHASE1_MAX }})</span>
              </label>
              <input
                v-model.number="editForm.phase1_score"
                type="number" :min="0" :max="store.PHASE1_MAX"
                class="input py-2 bg-dark/50"
                :placeholder="`0–${store.PHASE1_MAX}`"
              />
            </div>

          </div>

          <div class="p-6 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-dark/95 backdrop-blur">
            <button @click="closeEdit" class="px-4 py-2 font-bold text-tertiary hover:text-white transition-colors text-sm">
              Cancel
            </button>
            <button @click="saveEdit" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl font-bold text-sm transition-all">
              Save Scores
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAiCityGameStore } from '~/stores/aiCityGame'

const TABS = ['Overview', 'Phase 1', 'Phase 2']

const store = useAiCityGameStore()
const activeTab = ref('Overview')

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

const editTarget = ref(null)
const editForm = reactive({
  phase1_ai: '',
  phase1_score: 0,
})

function openEdit(entry) {
  editTarget.value = entry
  editForm.phase1_ai = (entry.phase1_ai === '—') ? '' : (entry.phase1_ai || '')
  editForm.phase1_score = entry.phase1_score ?? 0
}

function closeEdit() {
  editTarget.value = null
}

async function saveEdit() {
  if (!editTarget.value) return
  await store.upsertTeam(editTarget.value.name, {
    phase1_ai: editForm.phase1_ai,
    phase1_score: Number(editForm.phase1_score) || 0,
  })
  closeEdit()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative.card,
.modal-leave-to .relative.card {
  transform: scale(0.95) translateY(16px);
}
</style>
