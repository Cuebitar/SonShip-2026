/**
 * Ice-Breaking Round 2 admin tool
 *
 * Usage:
 *   node scripts/icebreaking_r2.mjs assign               — assign R2 by group (dry run)
 *   node scripts/icebreaking_r2.mjs assign --write        — assign R2 by group (commit to Firestore)
 *   node scripts/icebreaking_r2.mjs rematch ID1 ID2 ...  — rematch R2 excluding absent IDs (dry run)
 *   node scripts/icebreaking_r2.mjs rematch --write ID1  — rematch and commit
 *
 * Only campers with status "Registered" or "Pending For Collection" are included.
 * Groups "abc" and "(no group)" are skipped.
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(readFileSync(resolve(__dir, '../firebase_admin_sdk.json'), 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const VALID_STATUSES = new Set(['Registered', 'Pending For Collection'])
const SKIP_GROUPS = new Set(['abc', '(no group)', ''])

// ── helpers ──────────────────────────────────────────────────────────────────

function circularAssign(members) {
  // Returns [{from, to}] pairs where each member targets the next in the list
  return members.map((m, i) => ({ from: m, to: members[(i + 1) % members.length] }))
}

async function loadGroups(absentIds = new Set()) {
  const snap = await db.collection('campers').get()
  const groups = {}

  for (const doc of snap.docs) {
    const d = doc.data()
    const g = d.group || ''
    if (SKIP_GROUPS.has(g)) continue
    if (!VALID_STATUSES.has(d.status)) continue
    if (absentIds.has(doc.id)) continue

    if (!groups[g]) groups[g] = []
    groups[g].push({ id: doc.id, name: d.name })
  }

  return groups
}

async function commitAssignments(pairs, write) {
  const batch = db.batch()

  for (const { from, to } of pairs) {
    const ref = db.collection('campers').doc(from.id)
    const targetRef = db.collection('campers').doc(to.id)
    if (write) batch.update(ref, { 'ice_breaking.target2': targetRef })
    console.log(`  ${from.name.padEnd(30)} → ${to.name}`)
  }

  if (write) {
    await batch.commit()
    console.log(`  ✓ ${pairs.length} assignments written to Firestore`)
  } else {
    console.log(`  (dry run — pass --write to commit)`)
  }
}

// ── commands ─────────────────────────────────────────────────────────────────

async function assignByGroup(write) {
  console.log(`\n=== Assign R2 by group ${write ? '[WRITING]' : '[DRY RUN]'} ===\n`)
  const groups = await loadGroups()

  for (const [groupName, members] of Object.entries(groups).sort()) {
    if (members.length < 2) {
      console.log(`${groupName}: only ${members.length} member(s) — skipped\n`)
      continue
    }

    // Shuffle for randomness
    for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [members[i], members[j]] = [members[j], members[i]]
    }

    const pairs = circularAssign(members)
    console.log(`${groupName} (${members.length} members):`)
    await commitAssignments(pairs, write)
    console.log()
  }
}

async function rematchExcluding(absentIds, write) {
  if (absentIds.length === 0) {
    console.error('No absent IDs provided. Usage: rematch [--write] ID1 ID2 ...')
    process.exit(1)
  }

  const absentSet = new Set(absentIds)
  console.log(`\n=== Rematch R2 (excluding ${absentSet.size} absent) ${write ? '[WRITING]' : '[DRY RUN]'} ===`)

  // Print absent names for confirmation
  const absentSnaps = await Promise.all([...absentSet].map(id => db.collection('campers').doc(id).get()))
  console.log('Absent:', absentSnaps.map(s => s.data()?.name ?? s.id).join(', '))
  console.log()

  const groups = await loadGroups(absentSet)

  for (const [groupName, members] of Object.entries(groups).sort()) {
    if (members.length < 2) {
      console.log(`${groupName}: only ${members.length} member(s) after removals — skipped\n`)
      continue
    }

    // Keep existing order from Firestore (no re-shuffle on rematch for stability)
    const pairs = circularAssign(members)
    console.log(`${groupName} (${members.length} remaining):`)
    await commitAssignments(pairs, write)
    console.log()
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

const [,, command, ...rest] = process.argv
const write = rest.includes('--write')
const ids = rest.filter(a => !a.startsWith('--'))

if (command === 'assign') {
  await assignByGroup(write)
} else if (command === 'rematch') {
  await rematchExcluding(ids, write)
} else {
  console.log('Usage:')
  console.log('  node scripts/icebreaking_r2.mjs assign [--write]')
  console.log('  node scripts/icebreaking_r2.mjs rematch [--write] ID1 ID2 ...')
  process.exit(1)
}
