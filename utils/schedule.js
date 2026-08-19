// Schedule docs store separate English/Chinese titles (name_en / name_zh).
// Legacy docs only have a single `name` field (often "English (中文)" jammed
// together) — fall back to it, and cross-fall-back between languages so a
// half-translated event still shows something instead of going blank.
export function scheduleTitle(slot, locale) {
  if (!slot) return ''
  const en = slot.name_en || slot.name || ''
  const zh = slot.name_zh || ''
  return locale === 'zh' ? (zh || en) : (en || zh)
}

// Stable identity for an event's title, independent of the viewer's current
// locale — used when grouping/merging the same event across days.
export function scheduleTitleKey(slot) {
  if (!slot) return ''
  return slot.name_en || slot.name_zh || slot.name || ''
}
