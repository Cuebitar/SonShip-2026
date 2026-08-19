// Detective clue titles are the only field campers actually see rendered
// (description is fetched but never displayed anywhere in the UI).
export function clueTitle(clue, locale) {
  if (!clue) return ''
  const en = clue.title_en || clue.title || ''
  const zh = clue.title_zh || ''
  return locale === 'zh' ? (zh || en) : (en || zh)
}
