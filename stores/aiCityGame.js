import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'

async function waitForDb(maxMs = 3000) {
  const interval = 50
  let elapsed = 0
  while (elapsed < maxMs) {
    const db = useDb()
    if (db) return db
    await new Promise(r => setTimeout(r, interval))
    elapsed += interval
  }
  return null
}

export const AI_OPTIONS = ['ChatGPT', 'Gemini', 'Claude', 'Copilot', 'DeepSeek']
export const STATION_COUNT = 6
// Phase 1 (The Council): meters total (baseline 28, optimal ~29-32) + balance bonus (≤40) + decision quality (≤25)
export const PHASE1_MAX = 105
export const STATION_MAX = 20

export const useAiCityGameStore = defineStore('aiCityGame', () => {
  const teams = ref({})
  const gameState = ref({ currentPhase: 0, active: false })
  const loaded = ref(false)
  let _unsubState = null
  let _unsubTeams = null

  async function subscribe() {
    if (import.meta.server) return
    const db = await waitForDb()
    if (!db) return

    _unsubState = onSnapshot(
      doc(db, 'game_state', 'ai_city'),
      (snap) => { if (snap.exists()) gameState.value = snap.data() },
      (err) => console.error('[ai_city] state error', err),
    )

    _unsubTeams = onSnapshot(
      collection(db, 'game_ai_city'),
      (snap) => {
        const next = {}
        snap.docs.forEach(d => { next[d.id] = d.data() })
        teams.value = next
        loaded.value = true
      },
      (err) => console.error('[ai_city] teams error', err),
    )
  }

  function unsubscribe() {
    _unsubState?.(); _unsubState = null
    _unsubTeams?.(); _unsubTeams = null
  }

  async function setGameState(patch) {
    const db = await waitForDb()
    if (!db) return
    await setDoc(doc(db, 'game_state', 'ai_city'), patch, { merge: true })
  }

  async function upsertTeam(groupName, data) {
    const db = await waitForDb()
    if (!db) return
    await setDoc(doc(db, 'game_ai_city', groupName), { groupName, ...data }, { merge: true })
  }

  // Replaces the council audit data wholesale (mergeFields so a redo
  // actually clears previous decisions instead of deep-merging into them)
  async function saveCouncil(groupName, council) {
    const db = await waitForDb()
    if (!db) return
    await setDoc(
      doc(db, 'game_ai_city', groupName),
      { groupName, council },
      { mergeFields: ['groupName', 'council'] },
    )
  }

  const leaderboard = computed(() =>
    Object.entries(teams.value).map(([name, d]) => {
      const stations = d.stations ?? Array(STATION_COUNT).fill(0)
      const stationTotal = stations.reduce((s, v) => s + (v || 0), 0)
      const p1 = d.phase1_score ?? 0
      return {
        name,
        phase1_ai: d.phase1_ai || '—',
        phase1_score: p1,
        stations,
        stationTotal,
        total: p1 + stationTotal,
      }
    }).sort((a, b) => b.total - a.total),
  )

  return {
    teams, gameState, loaded, leaderboard,
    subscribe, unsubscribe, setGameState, upsertTeam, saveCouncil,
    AI_OPTIONS, STATION_COUNT, PHASE1_MAX, STATION_MAX,
  }
})
