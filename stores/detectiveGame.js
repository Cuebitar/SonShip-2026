import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, getDoc, updateDoc,
  arrayUnion, serverTimestamp,
} from 'firebase/firestore'
import { getApps, getApp } from 'firebase/app'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
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

function useStorageSafe() {
  if (getApps().length === 0) return null
  return getStorage(getApp())
}

export const useDetectiveGameStore = defineStore('detectiveGame', () => {
  const scores = ref({})
  const gameState = ref({ miniGamesEnabled: true })
  const loaded = ref(false)
  const clues = ref({})
  const cluesLoaded = ref(false)
  let _unsubState = null
  let _unsubScores = null
  let _unsubClues = null

  async function subscribe() {
    if (import.meta.server) return
    const db = await waitForDb()
    if (!db) return

    _unsubState = onSnapshot(
      doc(db, 'game_state', 'detective'),
      (snap) => { if (snap.exists()) gameState.value = snap.data() },
      (err) => console.error('[detective] state error', err),
    )

    // Detective scores/reports live on the shared game_scores/{team} doc
    // (detectiveStages + detectiveReport fields) so they roll into the
    // cross-game leaderboard instead of a detective-only collection.
    _unsubScores = onSnapshot(
      collection(db, 'game_scores'),
      (snap) => {
        const next = {}
        snap.docs.forEach(d => {
          const data = d.data()
          const stages = data.detectiveStages || {}
          next[d.id] = {
            stage3: stages.stage3 ?? 0,
            stage4: stages.stage4 ?? 0,
            stage5: stages.stage5 ?? 0,
            report: data.detectiveReport ?? null,
          }
        })
        scores.value = next
        loaded.value = true
      },
      (err) => console.error('[detective] scores error', err),
    )
  }

  function unsubscribe() {
    _unsubState?.(); _unsubState = null
    _unsubScores?.(); _unsubScores = null
    _unsubClues?.(); _unsubClues = null
  }

  // ─── Clues ─────────────────────────────────────────────────────────

  async function subscribeClues() {
    if (import.meta.server) return
    if (_unsubClues) return
    const db = await waitForDb()
    if (!db) return

    _unsubClues = onSnapshot(
      collection(db, 'game_detective_clues'),
      (snap) => {
        const next = {}
        snap.docs.forEach(d => { next[d.id] = { id: d.id, ...d.data() } })
        clues.value = next
        cluesLoaded.value = true
      },
      (err) => console.error('[detective] clues error', err),
    )
  }

  async function addClue({ stage, title, description, file }) {
    const db = await waitForDb()
    const storage = useStorageSafe()
    if (!db || !storage) throw new Error('Firebase not initialized')

    let fileUrl = null
    let fileName = null
    let fileType = null
    let storagePath = null

    if (file) {
      storagePath = `detective-clues/${Date.now()}-${file.name}`
      const fileRef = storageRef(storage, storagePath)
      await uploadBytes(fileRef, file, { contentType: file.type })
      fileUrl = await getDownloadURL(fileRef)
      fileName = file.name
      fileType = file.type
    }

    const docRef = await addDoc(collection(db, 'game_detective_clues'), {
      stage,
      title,
      description,
      fileUrl,
      fileName,
      fileType,
      storagePath,
      viewers: [],
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }

  async function updateClue(clueId, { stage, title, description, file }) {
    const db = await waitForDb()
    if (!db) throw new Error('Firebase not initialized')

    const patch = { stage, title, description }

    if (file) {
      const storage = useStorageSafe()
      if (!storage) throw new Error('Firebase not initialized')

      const storagePath = `detective-clues/${Date.now()}-${file.name}`
      const fileRef = storageRef(storage, storagePath)
      await uploadBytes(fileRef, file, { contentType: file.type })
      patch.fileUrl = await getDownloadURL(fileRef)
      patch.fileName = file.name
      patch.fileType = file.type
      patch.storagePath = storagePath

      // Best-effort cleanup of the document being replaced
      const oldPath = clues.value[clueId]?.storagePath
      if (oldPath && oldPath !== storagePath) {
        try {
          await deleteObject(storageRef(storage, oldPath))
        } catch (err) {
          console.warn('[detective] could not delete replaced clue file', err)
        }
      }
    }

    await updateDoc(doc(db, 'game_detective_clues', clueId), patch)
  }

  async function deleteClue(clueId) {
    const db = await waitForDb()
    if (!db) return
    const clue = clues.value[clueId]
    await deleteDoc(doc(db, 'game_detective_clues', clueId))
    // Best-effort cleanup of the stored document
    if (clue?.storagePath) {
      try {
        const storage = useStorageSafe()
        if (storage) await deleteObject(storageRef(storage, clue.storagePath))
      } catch (err) {
        console.warn('[detective] could not delete clue file', err)
      }
    }
  }

  // One-off read of game_state/detective (used by the camper clue page,
  // which doesn't keep a live subscription)
  async function fetchGameState() {
    const db = await waitForDb()
    if (!db) return null
    const snap = await getDoc(doc(db, 'game_state', 'detective'))
    return snap.exists() ? snap.data() : null
  }

  async function fetchClue(clueId) {
    const db = await waitForDb()
    if (!db) return null
    const snap = await getDoc(doc(db, 'game_detective_clues', clueId))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
  }

  // Records that a camper opened the clue URL (first visit per email only)
  async function recordClueView(clueId, viewer) {
    if (!viewer?.email) return
    const db = await waitForDb()
    if (!db) return
    const clueRef = doc(db, 'game_detective_clues', clueId)
    const snap = await getDoc(clueRef)
    if (!snap.exists()) return
    const viewers = snap.data().viewers || []
    if (viewers.some(v => v.email === viewer.email)) return
    await updateDoc(clueRef, {
      viewers: arrayUnion({
        name: viewer.name || viewer.email,
        email: viewer.email,
        group: viewer.group || null,
        at: new Date().toISOString(),
      }),
    })
  }

  const clueList = computed(() =>
    Object.values(clues.value).sort((a, b) =>
      (a.stage - b.stage) || ((a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)),
    ),
  )

  async function setGameState(patch) {
    const db = await waitForDb()
    if (!db) return
    await setDoc(doc(db, 'game_state', 'detective'), patch, { merge: true })
  }

  // Writes the stage scores into game_scores/{groupName}, keeping
  // scores['The Final Night'] (and totalScore) in sync so this game shows
  // up correctly on the cross-game leaderboard (pages/games.vue).
  async function upsertGroupScore(groupName, stageData) {
    const db = await waitForDb()
    if (!db) return
    const ref = doc(db, 'game_scores', groupName)
    const snap = await getDoc(ref)
    const data = snap.exists() ? snap.data() : {}

    const stage3 = stageData.stage3 ?? 0
    const stage4 = stageData.stage4 ?? 0
    const stage5 = stageData.stage5 ?? 0

    const scoresMap = { ...(data.scores || {}), 'The Final Night': stage3 + stage4 + stage5 }
    const totalScore = Object.values(scoresMap).reduce((sum, v) => sum + (Number(v) || 0), 0)

    await setDoc(ref, {
      teamName: groupName,
      detectiveStages: { stage3, stage4, stage5 },
      scores: scoresMap,
      totalScore,
      updatedAt: Date.now(),
    }, { merge: true })
  }

  // Final Night's written report: two free-text answers submitted by a team,
  // stored alongside its stage scores on the same game_scores/{groupName} doc.
  async function submitReport(groupName, { q1, q2, submittedBy }) {
    const db = await waitForDb()
    if (!db) return
    await setDoc(doc(db, 'game_scores', groupName), {
      teamName: groupName,
      detectiveReport: {
        q1: q1 || '',
        q2: q2 || '',
        submittedBy: submittedBy || null,
        submittedAt: serverTimestamp(),
      },
    }, { merge: true })
  }

  const leaderboard = computed(() =>
    Object.entries(scores.value)
      .map(([name, d]) => ({
        name,
        stage3: d.stage3 ?? 0,
        stage4: d.stage4 ?? 0,
        stage5: d.stage5 ?? 0,
        total: (d.stage3 ?? 0) + (d.stage4 ?? 0) + (d.stage5 ?? 0),
      }))
      .sort((a, b) => b.total - a.total),
  )

  return {
    scores, gameState, loaded, leaderboard,
    clues, cluesLoaded, clueList,
    subscribe, unsubscribe, setGameState, upsertGroupScore, submitReport,
    subscribeClues, addClue, updateClue, deleteClue, fetchClue, recordClueView, fetchGameState,
  }
})
