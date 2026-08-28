<template>
  <div class="page-container bg-dark min-h-screen pb-16">

    <!-- Header -->
    <section class="py-10 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <h1 class="font-heading font-black text-3xl md:text-4xl text-blue-400 mb-1">📝 Phase 2 — Station Scores</h1>
        <p class="font-body text-tertiary">
          Recording scores for <span class="font-bold text-white">{{ groupName }}</span>
        </p>
      </div>
    </section>

    <main class="container-inner mt-8 max-w-xl mx-auto">

      <!-- Group not found -->
      <div v-if="store.loaded && !team" class="card p-8 text-center">
        <p class="text-4xl mb-3">🚫</p>
        <p class="text-white font-bold mb-2">Group "{{ groupName }}" not found.</p>
        <p class="text-sm text-tertiary mb-6">Sync groups from campers on the AI City dashboard first.</p>
        <NuxtLink to="/admin/games/ai-city" class="btn-primary w-auto min-w-0 px-6 inline-block">Back to AI City</NuxtLink>
      </div>

      <div v-else-if="!store.loaded" class="p-12 text-center text-tertiary">Loading…</div>

      <template v-else>

        <!-- Path rule reminder -->
        <div class="mb-5 px-4 py-3 rounded-xl text-xs bg-blue-500/10 border border-blue-500/20 text-tertiary leading-relaxed">
          <span class="font-bold text-blue-400">Path rule:</span> teams that deployed 3+ AI systems in Phase 1 follow the
          🚀 Deployed path; 2 or fewer follow 🚫 Rejected.
          <template v-if="deployedCount !== null">
            {{ groupName }} deployed <span class="font-bold text-white">{{ deployedCount }}</span> —
            locked path: <span class="font-bold text-blue-400">{{ suggestedPath === 'deploy' ? '🚀 Deployed' : '🚫 Rejected' }}</span>.
          </template>
          <template v-else>
            No Phase 1 Council audit found for this group — defaulting to 🚫 Rejected. Run the audit first if this is wrong.
          </template>
        </div>

        <!-- ── Station accordion (one open at a time) ─────────────── -->
        <div class="space-y-3">
          <div
            v-for="(m, idx) in MISSIONS" :key="m.id"
            class="card p-0 border overflow-hidden transition-colors"
            :class="openStation === idx ? 'border-blue-500/50' : stationError(idx) ? 'border-red-500/50' : 'border-white/10'"
          >
            <!-- Header: tap to expand, score input lives here -->
            <div
              class="flex items-center gap-3 p-4 cursor-pointer select-none hover:bg-white/5 transition-colors"
              @click="toggleStation(idx)"
            >
              <span class="text-2xl shrink-0">{{ m.emoji }}</span>
              <div class="flex-1 min-w-0">
                <p class="font-heading font-bold text-white text-sm truncate">S{{ m.id }} · {{ m.title }}</p>
                <p class="text-xs text-tertiary/50 truncate">
                  📍 {{ m.location }} ·
                  <span :class="paths[idx] === 'deploy' ? 'text-blue-400' : ''">
                    {{ paths[idx] === 'deploy' ? '🚀 Deployed' : '🚫 Rejected' }}
                  </span>
                </p>
              </div>
              <div class="shrink-0 w-[4.5rem]" @click.stop>
                <input
                  v-model.number="stations[idx]"
                  type="number" inputmode="numeric" :min="0" :max="store.STATION_MAX"
                  class="input py-2 px-2 text-center text-base font-bold bg-dark/50 transition-colors"
                  :class="stationError(idx) ? 'border-red-500 focus:border-red-500' : ''"
                  placeholder="pts"
                />
              </div>
              <span class="text-tertiary/50 text-sm shrink-0 transition-transform" :class="{ 'rotate-180': openStation === idx }">▼</span>
            </div>

            <p v-if="stationError(idx)" class="text-red-400 text-xs font-bold px-4 pb-3 -mt-1">
              ⚠ {{ stationError(idx) }}
            </p>

            <!-- Expanded body -->
            <div v-if="openStation === idx" class="border-t border-white/10 p-4 sm:p-5 space-y-5">

              <!-- Deploy path (locked in from the Phase 1 Council audit) -->
              <div>
                <p class="text-xs font-bold text-blue-400/80 mb-2">AI path for this station</p>
                <div
                  class="py-2.5 rounded-xl font-bold text-sm border text-center"
                  :class="paths[idx] === 'deploy'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/60'
                    : 'bg-white/15 text-white border-white/40'"
                >
                  {{ paths[idx] === 'deploy' ? '🚀 Deployed AI' : '🚫 Rejected AI' }}
                </div>
                <p class="text-[11px] text-tertiary/40 mt-1.5">
                  Locked in from the Phase 1 Council audit — {{ deployedCount === null ? 'no audit found for this group.' : `deployed ${deployedCount} AI system${deployedCount === 1 ? '' : 's'}.` }}
                </p>
              </div>

              <!-- Cost / meter / time chips -->
              <div class="flex flex-wrap gap-2">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 whitespace-nowrap">
                  💰 Cost: {{ m.cost }}
                </span>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-tertiary whitespace-nowrap">
                  🎯 {{ m.targetMeter }}
                </span>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-tertiary whitespace-nowrap">
                  ⏱ {{ m.time }}
                </span>
              </div>

              <!-- Challenge -->
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-blue-400/60 mb-1.5">The Challenge</p>
                <p class="text-sm text-tertiary leading-relaxed">{{ m.challenge }}</p>
                <p v-if="m.challenge_zh" class="text-sm text-tertiary/60 leading-relaxed mt-1">{{ m.challenge_zh }}</p>
              </div>

              <!-- How to play (variant) -->
              <div class="rounded-xl px-4 py-3" :class="paths[idx] === 'deploy' ? 'bg-blue-500/10' : 'bg-white/5'">
                <p class="text-xs font-bold uppercase tracking-widest mb-1.5" :class="paths[idx] === 'deploy' ? 'text-blue-400/80' : 'text-tertiary/60'">
                  How to play — {{ paths[idx] === 'deploy' ? '🚀 Deployed AI path' : '🚫 Rejected AI path' }}
                </p>
                <p class="text-sm leading-relaxed" :class="paths[idx] === 'deploy' ? 'text-white' : 'text-tertiary'">
                  {{ m[paths[idx]].how }}
                </p>
                <p v-if="m[paths[idx]].how_zh" class="text-sm leading-relaxed mt-1 opacity-60" :class="paths[idx] === 'deploy' ? 'text-white' : 'text-tertiary'">
                  {{ m[paths[idx]].how_zh }}
                </p>
              </div>

              <!-- Auditor's special hint (Deploy path only — currently Mission 4) -->
              <div
                v-if="paths[idx] === 'deploy' && m.auditorHint"
                class="rounded-xl px-4 py-3 bg-purple-500/10 border border-purple-500/30"
              >
                <p class="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1.5">🗣 Auditor's Special Hint</p>
                <p class="text-xs text-tertiary mb-1.5">{{ m.auditorHint.intro }}</p>
                <p class="text-sm text-white leading-relaxed italic">{{ m.auditorHint.text }}</p>
              </div>

              <!-- Mega Data Center bonus (Deploy path only, Missions 2/4/5/6) -->
              <div
                v-if="paths[idx] === 'deploy' && m.megaDataCenterBonus"
                class="rounded-xl px-4 py-3 bg-gradient-to-r from-yellow-500/15 to-amber-500/5 border border-yellow-500/40"
              >
                <p class="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1.5">⚡ Mega Data Center Bonus</p>
                <p class="text-sm text-white leading-relaxed">{{ m.megaDataCenterBonus }}</p>
                <p v-if="m.megaDataCenterBonus_zh" class="text-sm text-yellow-100/60 leading-relaxed mt-1">{{ m.megaDataCenterBonus_zh }}</p>
                <p class="text-[11px] text-yellow-400/60 mt-2">Only applies if this team built the Mega Data Center at Mission 3 (Balance the Grid).</p>
              </div>

              <!-- Score sheet -->
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-blue-400/60 mb-1.5">Score Sheet</p>
                <p class="text-sm text-white leading-relaxed">{{ m[paths[idx]].scoreSheet }}</p>
                <p v-if="m[paths[idx]].scoreSheet_zh" class="text-sm text-tertiary/60 leading-relaxed mt-1">{{ m[paths[idx]].scoreSheet_zh }}</p>
              </div>

              <!-- Win / lose payout -->
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-blue-400/60 mb-2">Win / Lose — Token Payout</p>
                <div class="space-y-1.5">
                  <div
                    v-for="row in m.payout" :key="row.result"
                    class="flex items-center justify-between gap-3 text-sm rounded-lg bg-white/5 px-3 py-2"
                  >
                    <span class="text-tertiary">{{ row.result }}</span>
                    <span
                      class="font-bold whitespace-nowrap"
                      :class="row.gain.startsWith('+') ? 'text-green-400' : row.gain.startsWith('−') ? 'text-red-400' : 'text-tertiary/50'"
                    >{{ row.gain }}</span>
                  </div>
                </div>
                <p class="text-xs text-tertiary/40 mt-2 leading-relaxed">⚠ {{ UNIVERSAL_RULES }}</p>
              </div>

              <!-- Auditor checklist -->
              <div v-if="m.auditorSteps?.length" class="rounded-xl px-4 py-3 bg-amber-500/5 border border-amber-500/20">
                <p class="text-xs font-bold uppercase tracking-widest text-amber-400/80 mb-2">🎤 Auditor — Run of Show</p>
                <ol class="space-y-2 list-decimal list-inside">
                  <li v-for="(step, i) in m.auditorSteps" :key="i" class="text-sm text-white leading-relaxed">
                    {{ step }}
                    <span v-if="m.auditorSteps_zh?.[i]" class="block text-tertiary/60 text-xs mt-0.5 ml-0.5">{{ m.auditorSteps_zh[i] }}</span>
                  </li>
                </ol>
              </div>

              <!-- Answer key -->
              <details v-if="m.answerKey" class="rounded-xl px-4 py-3 bg-green-500/5 border border-green-500/20 group">
                <summary class="text-xs font-bold uppercase tracking-widest text-green-400 cursor-pointer select-none">
                  ✅ Answer Key <span class="text-green-400/50 font-normal normal-case">(tap to show/hide)</span>
                </summary>
                <div class="mt-3 space-y-3">
                  <p v-if="m.answerKey.intro" class="text-xs text-tertiary/70">{{ m.answerKey.intro }}</p>

                  <!-- Case-based (Mission 1) -->
                  <template v-if="m.answerKey.items?.[0]?.case !== undefined">
                    <div class="space-y-1">
                      <div v-for="row in m.answerKey.items" :key="row.case" class="flex items-center justify-between gap-3 text-sm bg-white/5 rounded-lg px-3 py-1.5">
                        <span class="text-tertiary">Case {{ row.case }} — {{ row.name }}</span>
                        <span class="font-bold text-green-400 whitespace-nowrap">{{ row.answer }}</span>
                      </div>
                    </div>
                    <template v-if="m.answerKey.bonusItems?.length">
                      <p class="text-xs text-tertiary/70 mt-2">{{ m.answerKey.bonusIntro }}</p>
                      <div class="space-y-1">
                        <div v-for="row in m.answerKey.bonusItems" :key="row.case" class="flex items-center justify-between gap-3 text-sm bg-white/5 rounded-lg px-3 py-1.5">
                          <span class="text-tertiary">Case {{ row.case }} — {{ row.name }}</span>
                          <span class="font-bold text-green-400 whitespace-nowrap">{{ row.answer }}</span>
                        </div>
                      </div>
                    </template>
                  </template>

                  <!-- Q&A-based (Mission 2) -->
                  <template v-else-if="m.answerKey.items?.[0]?.q !== undefined">
                    <ol class="space-y-1.5 list-decimal list-inside">
                      <li v-for="(row, i) in m.answerKey.items" :key="i" class="text-sm">
                        <span class="text-tertiary">{{ row.q }}</span>
                        <span class="font-bold text-green-400 ml-1">— {{ row.a }}</span>
                      </li>
                    </ol>
                  </template>

                  <!-- Ordered strip list (Mission 5) -->
                  <template v-else-if="Array.isArray(m.answerKey.items)">
                    <ol class="space-y-1 list-decimal list-inside">
                      <li v-for="(row, i) in m.answerKey.items" :key="i" class="text-sm text-white">{{ row }}</li>
                    </ol>
                    <template v-if="m.answerKey.wrongItems?.length">
                      <p class="text-xs text-tertiary/70 mt-2">{{ m.answerKey.wrongIntro }}</p>
                      <ul class="space-y-1 list-disc list-inside">
                        <li v-for="(row, i) in m.answerKey.wrongItems" :key="i" class="text-sm text-red-400">{{ row }}</li>
                      </ul>
                    </template>
                  </template>
                </div>
              </details>

            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="card p-5 border border-blue-500/30 mt-5 flex flex-wrap items-center justify-between gap-2">
          <span class="text-sm font-bold text-tertiary">Total score</span>
          <span class="font-heading font-black text-3xl whitespace-nowrap" :class="hasErrors ? 'text-red-400' : 'text-blue-400'">
            {{ stationTotal }} <span class="text-sm font-normal text-tertiary/50">/ {{ store.STATION_COUNT * store.STATION_MAX }}</span>
          </span>
        </div>

        <div v-if="hasErrors" class="mt-4 px-4 py-3 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20">
          ⚠ Fix the highlighted stations before saving — the maximum is {{ store.STATION_MAX }} points per station.
        </div>

        <div v-if="saved" class="mt-4 px-4 py-3 rounded-xl text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20 text-center">
          ✓ Scores saved.
        </div>

        <div class="flex gap-3 mt-6">
          <NuxtLink
            to="/admin/games/ai-city"
            class="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 text-tertiary hover:bg-white/10 hover:text-white transition-all text-center"
          >
            Cancel
          </NuxtLink>
          <button
            @click="save"
            :disabled="hasErrors || saving"
            class="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
            :class="hasErrors || saving
              ? 'bg-white/10 text-tertiary/40 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'"
          >
            {{ saving ? 'Saving…' : '✓ Save Scores' }}
          </button>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAiCityGameStore } from '~/stores/aiCityGame'
import { MISSIONS, UNIVERSAL_RULES } from '~/lib/aiCityMissions'
import { COUNCIL_CARDS } from '~/lib/aiCityCouncil'

const route = useRoute()
const store = useAiCityGameStore()

const groupName = decodeURIComponent(route.params.group)
const team = computed(() => store.teams[groupName])

const stations = ref(Array(MISSIONS.length).fill(0))
const openStation = ref(0)
const saved = ref(false)
const saving = ref(false)
let prefilled = false

onMounted(() => store.subscribe())
onUnmounted(() => store.unsubscribe())

// Only one container open at a time; tapping the open one closes it
function toggleStation(idx) {
  openStation.value = openStation.value === idx ? null : idx
}

// How many AIs this group deployed in the Phase 1 Council audit
const deployedCount = computed(() => {
  const decisions = team.value?.council?.decisions
  if (!decisions) return null
  return COUNCIL_CARDS.filter(c => decisions[c.id] === 'deploy').length
})

const suggestedPath = computed(() =>
  (deployedCount.value ?? 0) >= 3 ? 'deploy' : 'reject',
)

// Every station follows the same path — locked in by the Phase 1 Council
// audit, not editable per station.
const paths = computed(() => Array(MISSIONS.length).fill(suggestedPath.value))

// Prefill scores from Firestore once the team doc arrives
watch(team, (t) => {
  if (prefilled || !t) return
  prefilled = true
  stations.value = [...(t.stations ?? Array(store.STATION_COUNT).fill(0))]
}, { immediate: true })

function stationError(idx) {
  const v = stations.value[idx]
  if (v === '' || v === null || v === undefined) return null
  if (Number(v) > store.STATION_MAX) return `Maximum is ${store.STATION_MAX} points.`
  if (Number(v) < 0) return 'Score cannot be negative.'
  return null
}

const hasErrors = computed(() =>
  stations.value.some((_, idx) => stationError(idx) !== null),
)

const stationTotal = computed(() =>
  stations.value.reduce((s, v) => s + (Number(v) || 0), 0),
)

async function save() {
  if (hasErrors.value || saving.value) return
  saving.value = true
  saved.value = false
  try {
    await store.upsertTeam(groupName, {
      stations: stations.value.map(v => Math.min(store.STATION_MAX, Math.max(0, Number(v) || 0))),
      stationPaths: [...paths.value],
    })
    saved.value = true
  } catch (err) {
    console.error('[ai_city] save stations failed', err)
    alert(`Save failed: ${err.message}`)
  } finally {
    saving.value = false
  }
}
</script>
