// Local mock activities carry parallel English/Chinese fields (name/name_zh,
// description/description_zh, difficulty/difficulty_zh, requirements/requirements_zh).
// These pick the right one for the current locale, falling back to English.
export function activityName(activity, locale) {
  if (!activity) return ''
  return locale === 'zh' ? (activity.name_zh || activity.name) : activity.name
}

export function activityDescription(activity, locale) {
  if (!activity) return ''
  return locale === 'zh' ? (activity.description_zh || activity.description) : activity.description
}

export function activityDifficulty(activity, locale) {
  if (!activity) return ''
  return locale === 'zh' ? (activity.difficulty_zh || activity.difficulty) : activity.difficulty
}

export function activityRequirements(activity, locale) {
  if (!activity) return []
  return locale === 'zh' ? (activity.requirements_zh || activity.requirements || []) : (activity.requirements || [])
}
