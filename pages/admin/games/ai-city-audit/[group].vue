<template>
  <div class="page-container bg-dark min-h-screen pb-16">

    <!-- Header -->
    <section class="py-10 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <h1 class="font-heading font-black text-3xl md:text-4xl text-blue-400 mb-1">🃏 The Council — Audit</h1>
        <p class="font-body text-tertiary">
          Phase 1 decisions for <span class="font-bold text-white">{{ groupName }}</span>
        </p>
      </div>
    </section>

    <main class="container-inner mt-8 max-w-3xl mx-auto">

      <!-- Group not found -->
      <div v-if="store.loaded && !team" class="card p-8 text-center">
        <p class="text-4xl mb-3">🚫</p>
        <p class="text-white font-bold mb-2">Group "{{ groupName }}" not found.</p>
        <p class="text-sm text-tertiary mb-6">Sync groups from campers on the AI City dashboard first.</p>
        <NuxtLink to="/admin/games/ai-city" class="btn-primary w-auto min-w-0 px-6 inline-block">Back to AI City</NuxtLink>
      </div>

      <div v-else-if="!store.loaded" class="p-12 text-center text-tertiary">Loading…</div>

      <template v-else>

        <!-- Live meters strip -->
        <div class="card p-5 border border-blue-500/30 mb-6">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/80 mb-4">City Meters</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="m in METERS" :key="m.key">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-bold text-tertiary/70">{{ m.emoji }} {{ m.label }}</span>
                <span class="text-sm font-heading font-black text-white">{{ liveMeters[m.key] }}</span>
              </div>
              <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full bg-blue-500 transition-all duration-500"
                  :style="{ width: `${(liveMeters[m.key] / METER_MAX) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card progress chips -->
        <div class="flex justify-center gap-2 mb-6">
          <span
            v-for="(card, i) in COUNCIL_CARDS" :key="card.id"
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all border',
              isCardDone(card.id) ? 'bg-green-500/15 border-green-500/40' :
              i === cardIndex && !finished ? 'bg-blue-500/20 border-blue-500 scale-110' :
              'bg-white/5 border-white/10 opacity-40'
            ]"
            :title="card.title"
          >{{ card.emoji }}</span>
        </div>

        <!-- ── Summary (all 5 cards audited) ─────────────────────── -->
        <div v-if="finished" class="space-y-6">
          <div class="card p-6 border border-blue-500/30">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/80 mb-5">Phase 1 Result</p>

            <table class="w-full text-sm mb-6">
              <tbody>
                <tr v-for="card in COUNCIL_CARDS" :key="card.id" class="border-b border-white/5">
                  <td class="py-2.5 pr-2 text-white font-bold">{{ card.emoji }} {{ card.short }}</td>
                  <td class="py-2.5 text-center">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap',
                      decisions[card.id] === 'deploy' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-tertiary'
                    ]">
                      {{ decisions[card.id] === 'deploy' ? '🚀 Deployed' : '🚫 Rejected' }}
                    </span>
                  </td>
                  <td class="py-2.5 pl-2 text-right text-tertiary/70 whitespace-nowrap">+{{ dqPoints[card.id] ?? 0 }} pts</td>
                </tr>
              </tbody>
            </table>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-tertiary">Meters total ({{ METERS.map(m => result.meters[m.key]).join(' + ') }})</span>
                <span class="font-bold text-white">{{ result.metersTotal }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-tertiary">Balance bonus <span class="text-tertiary/40">(spread {{ result.spread }})</span></span>
                <span class="font-bold text-white">+{{ result.balanceBonus }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-tertiary">Decision quality</span>
                <span class="font-bold text-white">+{{ result.dqTotal }}</span>
              </div>
              <div class="flex justify-between pt-3 border-t border-white/10">
                <span class="font-heading font-bold text-blue-400">Phase 1 Score</span>
                <span class="font-heading font-black text-blue-400 text-2xl">{{ result.total }}</span>
              </div>
            </div>
          </div>

          <div v-if="savedScore" class="px-4 py-3 rounded-xl text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20 text-center">
            ✓ Score saved to the leaderboard.
          </div>

          <div class="flex gap-3">
            <button
              @click="redoAudit"
              class="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 text-tertiary hover:bg-white/10 hover:text-white transition-all"
            >
              ↺ Redo Audit
            </button>
            <button
              v-if="!savedScore"
              @click="saveScore"
              :disabled="saving"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all"
              :class="{ 'opacity-50 cursor-not-allowed': saving }"
            >
              {{ saving ? 'Saving…' : '✓ Confirm & Save Score' }}
            </button>
            <NuxtLink
              v-else
              :to="`/admin/games/ai-city-score/${encodeURIComponent(groupName)}`"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all text-center"
            >
              Phase 2 Station Scores →
            </NuxtLink>
          </div>
        </div>

        <!-- ── Decision step ──────────────────────────────────────── -->
        <div v-else-if="step === 'decision'" class="card p-6 border border-blue-500/30">
          <p class="text-xs font-bold uppercase tracking-widest text-blue-400/60 mb-1">
            Card {{ cardIndex + 1 }} / {{ COUNCIL_CARDS.length }}
          </p>
          <h2 class="font-heading font-black text-2xl text-white mb-4">
            {{ currentCard.emoji }} {{ currentCard.title }}
          </h2>
          <p class="text-tertiary leading-relaxed mb-5">{{ currentCard.narrative }}</p>

          <!-- Meter effects (wraps on narrow screens — no sideways scrolling) -->
          <div class="space-y-2 mb-6">
            <div
              v-for="choice in ['deploy', 'reject']" :key="choice"
              class="flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-xl px-3 py-2.5"
              :class="choice === 'deploy' ? 'bg-blue-500/10' : 'bg-white/5'"
            >
              <span class="font-bold text-sm w-[4.5rem] shrink-0" :class="choice === 'deploy' ? 'text-blue-400' : 'text-tertiary'">
                {{ choice === 'deploy' ? '🚀 Deploy' : '🚫 Reject' }}
              </span>
              <span
                v-for="m in METERS" :key="m.key"
                class="px-2 py-1 rounded-lg text-xs font-bold bg-dark/40 whitespace-nowrap"
                :class="effectClass(currentCard[choice][m.key])"
                :title="m.label"
              >
                {{ m.emoji }} {{ formatEffect(currentCard[choice][m.key]) }}
              </span>
            </div>
          </div>

          <p class="text-sm font-bold text-white mb-3">Did {{ groupName }} deploy this AI?</p>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="chooseDecision('deploy')"
              class="py-4 rounded-xl font-heading font-black text-lg bg-blue-500/15 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 transition-all"
            >
              🚀 Deploy
            </button>
            <button
              @click="chooseDecision('reject')"
              class="py-4 rounded-xl font-heading font-black text-lg bg-white/5 text-tertiary border border-white/15 hover:bg-white/10 hover:text-white transition-all"
            >
              🚫 Reject
            </button>
          </div>
        </div>

        <!-- ── Decision Quality step ──────────────────────────────── -->
        <div v-else class="card p-6 border border-blue-500/30">
          <p class="text-xs font-bold uppercase tracking-widest text-blue-400/60 mb-1">
            Card {{ cardIndex + 1 }} / {{ COUNCIL_CARDS.length }} — Decision Quality
          </p>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
            <h2 class="font-heading font-black text-xl text-white">{{ currentCard.emoji }} {{ currentCard.short }}</h2>
            <span :class="[
              'px-2.5 py-1 rounded-full text-xs font-bold',
              decisions[currentCard.id] === 'deploy' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-tertiary'
            ]">
              {{ decisions[currentCard.id] === 'deploy' ? '🚀 Deployed' : '🚫 Rejected' }}
            </span>
            <button @click="step = 'decision'" class="text-xs text-tertiary/50 hover:text-white underline underline-offset-2 transition-colors">
              change
            </button>
          </div>

          <p class="text-white font-bold mb-4">{{ DQ_QUESTION }}</p>
          <div class="space-y-3">
            <button
              v-for="opt in DQ_OPTIONS" :key="opt.id"
              @click="chooseDq(opt)"
              class="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left font-bold bg-white/5 text-white border border-white/10 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all"
            >
              <span>{{ opt.label }}</span>
              <span :class="[
                'px-2.5 py-1 rounded-full text-xs font-black shrink-0',
                opt.points >= 5 ? 'bg-green-500/20 text-green-400' :
                opt.points >= 3 ? 'bg-blue-500/20 text-blue-400' :
                opt.points >= 2 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-tertiary/60'
              ]">+{{ opt.points }} pts</span>
            </button>
          </div>
        </div>

      </template>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAiCityGameStore } from '~/stores/aiCityGame'
import {
  COUNCIL_CARDS, METERS, METER_MAX, DQ_QUESTION, DQ_OPTIONS,
  computeMeters, computePhase1Score,
} from '~/lib/aiCityCouncil'

const route = useRoute()
const store = useAiCityGameStore()

const groupName = decodeURIComponent(route.params.group)
const team = computed(() => store.teams[groupName])

const cardIndex = ref(0)
const step = ref('decision')
const decisions = ref({})
const dqPoints = ref({})
const savedScore = ref(false)
const saving = ref(false)

const currentCard = computed(() => COUNCIL_CARDS[cardIndex.value])
const finished = computed(() => COUNCIL_CARDS.every(c => isCardDone(c.id)))
const liveMeters = computed(() => computeMeters(decisions.value))
const result = computed(() => computePhase1Score(decisions.value, dqPoints.value))

function isCardDone(cardId) {
  return decisions.value[cardId] !== undefined && dqPoints.value[cardId] !== undefined
}

let loadedExisting = false

onMounted(async () => {
  await store.subscribe()
  // Resume any audit that was already in progress for this group
  const stop = setInterval(() => {
    if (!store.loaded) return
    clearInterval(stop)
    if (loadedExisting) return
    loadedExisting = true
    const council = team.value?.council
    if (council?.decisions) {
      decisions.value = { ...council.decisions }
      dqPoints.value = { ...(council.dq || {}) }
      savedScore.value = !!council.completedAt
      // Jump to the first unfinished card
      const idx = COUNCIL_CARDS.findIndex(c => !isCardDone(c.id))
      if (idx >= 0) {
        cardIndex.value = idx
        step.value = decisions.value[COUNCIL_CARDS[idx].id] === undefined ? 'decision' : 'dq'
      }
    }
  }, 100)
})

onUnmounted(() => store.unsubscribe())

function chooseDecision(choice) {
  decisions.value = { ...decisions.value, [currentCard.value.id]: choice }
  step.value = 'dq'
}

async function chooseDq(opt) {
  dqPoints.value = { ...dqPoints.value, [currentCard.value.id]: opt.points }
  savedScore.value = false
  await persistProgress()
  const idx = COUNCIL_CARDS.findIndex(c => !isCardDone(c.id))
  if (idx >= 0) {
    cardIndex.value = idx
    step.value = 'decision'
  }
}

async function persistProgress(extra = {}) {
  await store.saveCouncil(groupName, {
    decisions: decisions.value,
    dq: dqPoints.value,
    updatedAt: new Date().toISOString(),
    ...extra,
  })
}

async function saveScore() {
  if (saving.value) return
  saving.value = true
  try {
    const deployed = COUNCIL_CARDS.filter(c => decisions.value[c.id] === 'deploy').map(c => c.short)
    await persistProgress({ completedAt: new Date().toISOString() })
    await store.upsertTeam(groupName, {
      phase1_score: result.value.total,
      phase1_ai: deployed.length > 0 ? deployed.join(', ') : 'None deployed',
    })
    savedScore.value = true
    // Continue straight into this group's Phase 2 station score page
    await navigateTo(`/admin/games/ai-city-score/${encodeURIComponent(groupName)}`)
  } catch (err) {
    console.error('[council] save failed', err)
    alert(`Save failed: ${err.message}`)
  } finally {
    saving.value = false
  }
}

async function redoAudit() {
  if (!confirm(`Restart the audit for ${groupName}? All 5 decisions will be cleared.`)) return
  decisions.value = {}
  dqPoints.value = {}
  savedScore.value = false
  cardIndex.value = 0
  step.value = 'decision'
  await persistProgress()
}

function formatEffect(v) {
  if (v > 0) return `+${v}`
  if (v < 0) return `${v}`
  return '0'
}

function effectClass(v) {
  if (v > 0) return 'text-green-400'
  if (v < 0) return 'text-red-400'
  return 'text-tertiary/40'
}
</script>
