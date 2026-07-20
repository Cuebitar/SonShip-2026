import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'

const ROUND_LABELS = {
  0: 'Standby',
  1: 'Riddle Hunt',
}

// Wait for the Firebase client plugin to initialise (it runs async on first load).
// Returns the Firestore db instance, or null after timeout.
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

export const useIceBreakingStore = defineStore('iceBreaking', () => {
  const gameState = ref({ round: 0, label: 'Standby', active: false })
  const targetData = ref(null)
  const targetLoading = ref(false)
  const targetError = ref('')
  let _unsubscribe = null
  let _refCount = 0

  // ── Real-time game state ────────────────────────────────────────────────────
  // Reference-counted so two pages can share the same listener without
  // the old page's onUnmounted tearing down the new page's subscription.
  // (In Vue Router, new component onMounted fires before old onUnmounted.)
  async function subscribeGameState() {
    if (import.meta.server) return
    _refCount++
    if (_refCount > 1) return  // listener already running
    const db = await waitForDb()
    if (!db) { _refCount = 0; return }
    _unsubscribe = onSnapshot(
      doc(db, 'game_state', 'ice_breaking'),
      (snap) => { if (snap.exists()) gameState.value = snap.data() },
      (err) => console.error('[iceBreaking] snapshot error', err),
    )
  }

  function unsubscribeGameState() {
    if (_refCount > 0) _refCount--
    if (_refCount === 0 && _unsubscribe) { _unsubscribe(); _unsubscribe = null }
  }

  // ── Admin: set round ────────────────────────────────────────────────────────
  async function setRound(round) {
    const db = await waitForDb()
    if (!db) return
    await updateDoc(doc(db, 'game_state', 'ice_breaking'), {
      round,
      label: ROUND_LABELS[round] ?? `Round ${round}`,
      active: round > 0,
      updatedAt: new Date().toISOString(),
    })
  }

  // ── Fetch the riddle target for a given camperId ───────────────────────────
  // targetData — riddle-hunt target (found by riddle → name reveal + password)
  async function fetchTargetData(camperId) {
    if (!camperId) return
    const db = await waitForDb()
    if (!db) return

    targetLoading.value = true
    targetError.value = ''
    targetData.value = null

    try {
      const camperSnap = await getDoc(doc(db, 'campers', camperId))
      if (!camperSnap.exists()) {
        targetError.value = 'Camper not found.'
        return
      }

      const tRef = camperSnap.data().ice_breaking?.target2

      const isRef = r => typeof r === 'object' && typeof r.path === 'string'

      if (!tRef || !isRef(tRef)) {
        targetError.value = 'Target not configured.'
        return
      }

      const tSnap = await getDoc(tRef)

      if (!tSnap.exists()) {
        targetError.value = 'Target record missing.'
        return
      }

      const td = tSnap.data()
      targetData.value = {
        id: tSnap.id,
        riddle: td.ice_breaking?.riddle || '',
        name: td.name || '',
        password: td.password || '',
      }
    } catch (err) {
      console.error('[iceBreaking] fetchTargetData error', err)
      targetError.value = 'Failed to load target data.'
    } finally {
      targetLoading.value = false
    }
  }

  return {
    gameState,
    targetData,
    targetLoading,
    targetError,
    subscribeGameState,
    unsubscribeGameState,
    fetchTargetData,
    setRound,
    ROUND_LABELS,
  }
})
