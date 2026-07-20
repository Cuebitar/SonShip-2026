// Phase 1 — The Council: card data & scoring for the AI City game.
// Source: Notion "🃏 Phase 1 - The Council".
// Teams start with all 4 meters at 10 (capped 0–20). Each Deploy/Reject
// decision shifts the meters; the goal is balance, not a single high meter.

export const START_METER = 10
export const METER_MIN = 0
export const METER_MAX = 20

export const METERS = [
  { key: 'efficiency', label: 'Efficiency', emoji: '⚡' },
  { key: 'humanity', label: 'Humanity', emoji: '💛' },
  { key: 'planet', label: 'Planet', emoji: '🌍' },
  { key: 'wisdom', label: 'Wisdom', emoji: '🦉' },
]

export const COUNCIL_CARDS = [
  {
    id: 'triage',
    title: 'AI Medical Triage System',
    short: 'Triage',
    emoji: '🏥',
    narrative: "Your city's hospitals are overwhelmed. An AI system can triage patients instantly, prioritising those with the highest survival probability. It will reduce wait times by 60% and treat far more patients — but it makes life-and-death decisions algorithmically, and waitlist deaths are real if you refuse it.",
    deploy: { efficiency: 2, humanity: 1, planet: -1, wisdom: -2 },
    reject: { efficiency: -1, humanity: -1, planet: 0, wisdom: 2 },
  },
  {
    id: 'tutor',
    title: 'AI Tutor for All Schools',
    short: 'Tutor',
    emoji: '🎓',
    narrative: 'Every student receives a personalised AI tutor available 24/7. Academic performance projected to rise by 40%. However, teachers flag that students are no longer learning to struggle through problems independently — and cities that refuse will watch their students fall behind.',
    deploy: { efficiency: 2, humanity: -2, planet: -1, wisdom: 0 },
    reject: { efficiency: -1, humanity: 1, planet: 0, wisdom: 1 },
  },
  {
    id: 'datacenter',
    title: 'Mega Data Center Construction',
    short: 'Data Center',
    emoji: '🏗️',
    narrative: 'To power all AI systems, your city proposes building a national data center. It will make your city a technological leader with abundant energy — but will consume enormous resources and displace a forest reserve for cooling infrastructure.',
    deploy: { efficiency: 3, humanity: 0, planet: -3, wisdom: 0 },
    reject: { efficiency: -2, humanity: 0, planet: 2, wisdom: 0 },
  },
  {
    id: 'workforce',
    title: 'AI Workforce Automation',
    short: 'Workforce',
    emoji: '🏭',
    narrative: 'Manufacturing, logistics, and administrative jobs can be fully automated by AI. Productivity will surge dramatically. However, an estimated 30% of the working population will be displaced within 3 years — and cities that refuse will fall behind automated competitors.',
    deploy: { efficiency: 3, humanity: -3, planet: 0, wisdom: -1 },
    reject: { efficiency: -2, humanity: 2, planet: 0, wisdom: 1 },
  },
  {
    id: 'governance',
    title: 'AI Governance Advisor',
    short: 'Governance',
    emoji: '🏛️',
    narrative: 'All city policies will now be drafted by an AI trained on global governance data. Human officials review and sign — but in practice, few have time to read the full documents. Decision speed increases by 80%.',
    deploy: { efficiency: 2, humanity: 0, planet: 0, wisdom: -3 },
    reject: { efficiency: -1, humanity: 0, planet: 0, wisdom: 2 },
  },
]

// Decision Quality Question — asked after every card
export const DQ_QUESTION = 'How did the team make this decision?'
export const DQ_OPTIONS = [
  { id: 'debate_principle', label: 'Debated + brought a principle', points: 5 },
  { id: 'debate_or_principle', label: 'Debated OR brought a principle', points: 3 },
  { id: 'uncertain_committed', label: 'Uncertain but committed', points: 2 },
  { id: 'fastest_majority', label: 'Fastest or followed majority', points: 0 },
]

export function balanceBonus(spread) {
  if (spread <= 2) return 40
  if (spread <= 5) return 30
  if (spread <= 8) return 20
  if (spread <= 12) return 10
  return 0
}

// decisions: { [cardId]: 'deploy' | 'reject' }
export function computeMeters(decisions) {
  const meters = { efficiency: START_METER, humanity: START_METER, planet: START_METER, wisdom: START_METER }
  for (const card of COUNCIL_CARDS) {
    const choice = decisions[card.id]
    if (!choice) continue
    const effects = card[choice]
    for (const m of METERS) meters[m.key] += effects[m.key]
  }
  for (const m of METERS) {
    meters[m.key] = Math.min(METER_MAX, Math.max(METER_MIN, meters[m.key]))
  }
  return meters
}

// decisions: { [cardId]: 'deploy' | 'reject' }, dq: { [cardId]: points }
export function computePhase1Score(decisions, dq) {
  const meters = computeMeters(decisions)
  const values = METERS.map(m => meters[m.key])
  const metersTotal = values.reduce((s, v) => s + v, 0)
  const spread = Math.max(...values) - Math.min(...values)
  const bonus = balanceBonus(spread)
  const dqTotal = COUNCIL_CARDS.reduce((s, c) => s + (dq[c.id] ?? 0), 0)
  return { meters, metersTotal, spread, balanceBonus: bonus, dqTotal, total: metersTotal + bonus + dqTotal }
}
