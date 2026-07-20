/**
 * Remove Ice-Breaking Round 1 (ID Hunt) data from Firestore
 *
 * Usage:
 *   node scripts/icebreaking_remove_r1.mjs           — dry run
 *   node scripts/icebreaking_remove_r1.mjs --write   — commit to Firestore
 *
 * - Deletes ice_breaking.target from every camper doc that has it
 * - Renumbers game_state/ice_breaking: old round 2 (Riddle Hunt) → 1,
 *   old round 1 (ID Hunt) → 0 (Standby)
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(readFileSync(resolve(__dir, '../firebase_admin_sdk.json'), 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const write = process.argv.includes('--write')
console.log(`\n=== Remove Ice-Breaking R1 ${write ? '[WRITING]' : '[DRY RUN]'} ===\n`)

// ── 1. Delete ice_breaking.target from campers ───────────────────────────────
const snap = await db.collection('campers').get()
const withTarget = snap.docs.filter(d => d.data().ice_breaking?.target !== undefined)

console.log(`Campers with ice_breaking.target: ${withTarget.length} / ${snap.size}`)
for (const doc of withTarget) {
  console.log(`  ${doc.id}  ${doc.data().name ?? ''}`)
}

if (write && withTarget.length > 0) {
  // Firestore batches cap at 500 writes
  for (let i = 0; i < withTarget.length; i += 500) {
    const batch = db.batch()
    for (const doc of withTarget.slice(i, i + 500)) {
      batch.update(doc.ref, { 'ice_breaking.target': FieldValue.delete() })
    }
    await batch.commit()
  }
  console.log(`  ✓ deleted ice_breaking.target from ${withTarget.length} docs`)
}

// ── 2. Renumber game_state/ice_breaking ──────────────────────────────────────
const stateRef = db.doc('game_state/ice_breaking')
const stateSnap = await stateRef.get()

if (stateSnap.exists) {
  const { round } = stateSnap.data()
  const newRound = round === 2 ? 1 : round === 1 ? 0 : round
  const newState = {
    round: newRound,
    label: newRound === 1 ? 'Riddle Hunt' : 'Standby',
    active: newRound > 0,
    updatedAt: new Date().toISOString(),
  }
  console.log(`\ngame_state/ice_breaking: round ${round} → ${newRound} (${newState.label})`)
  if (write) {
    await stateRef.update(newState)
    console.log('  ✓ game state updated')
  }
} else {
  console.log('\ngame_state/ice_breaking: doc not found — skipped')
}

if (!write) console.log('\n(dry run — pass --write to commit)')
