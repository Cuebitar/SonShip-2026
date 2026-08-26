/**
 * Export camper names + IC numbers to an Excel workbook.
 *
 * Usage:
 *   node scripts/export_campers_ic.mjs                    — all campers
 *   node scripts/export_campers_ic.mjs --registered-only  — only Registered / Pending For Collection
 *   node scripts/export_campers_ic.mjs --out path.xlsx    — custom output path
 *
 * Output defaults to campers_ic.xlsx in the project root.
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import ExcelJS from 'exceljs'

const __dir = dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(readFileSync(resolve(__dir, '../firebase_admin_sdk.json'), 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const args = process.argv.slice(2)
const registeredOnly = args.includes('--registered-only')
const outFlag = args.indexOf('--out')
const outPath = outFlag !== -1 && args[outFlag + 1]
  ? resolve(process.cwd(), args[outFlag + 1])
  : resolve(__dir, '../campers_ic.xlsx')

const VALID_STATUSES = new Set(['Registered', 'Pending For Collection'])

// Malaysian IC: 123456-78-9012
function formatIc(ic) {
  const digits = String(ic ?? '').replace(/\D/g, '')
  if (digits.length !== 12) return String(ic ?? '').trim()
  return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`
}

const snapshot = await db.collection('campers').get()

const rows = snapshot.docs
  .map((doc) => ({ id: doc.id, ...doc.data() }))
  .filter((c) => (registeredOnly ? VALID_STATUSES.has(c.status) : true))
  .map((c) => ({
    name: (c.name || '').trim(),
    ic: formatIc(c.ic),
    status: c.status || '',
    group: c.group || '',
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet('Campers')

sheet.columns = [
  { header: 'No.', key: 'no', width: 6 },
  { header: 'Name', key: 'name', width: 34 },
  { header: 'IC Number', key: 'ic', width: 20 },
  { header: 'Status', key: 'status', width: 24 },
  { header: 'Group', key: 'group', width: 14 },
]

rows.forEach((row, index) => {
  const added = sheet.addRow({ no: index + 1, ...row })
  // Keep the IC as literal text so Excel never reformats it as a number.
  added.getCell('ic').numFmt = '@'
})

sheet.getRow(1).font = { bold: true }
sheet.views = [{ state: 'frozen', ySplit: 1 }]
sheet.autoFilter = { from: 'A1', to: `E${rows.length + 1}` }

await workbook.xlsx.writeFile(outPath)

const missingIc = rows.filter((r) => !r.ic).length
console.log(`Exported ${rows.length} campers -> ${outPath}`)
if (missingIc) console.log(`Warning: ${missingIc} camper(s) have no IC on record.`)
