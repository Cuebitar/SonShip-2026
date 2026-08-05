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
    narrative: "Every day, your city's hospitals turn people away. Emergency wards are overwhelmed. Patients wait hours in pain while doctors manually review files, weigh survival odds, and make calls under pressure. The weakest — the elderly, the uninsured, the ones who cannot advocate for themselves — wait the longest. This AI changes that. It processes every incoming patient in seconds, analyses their survival probability, pre-existing conditions, and urgency level, and assigns them to the right care pathway automatically. Wait times drop by 60%. More people get seen. More people survive. The question your council must answer is not whether AI can save lives — it clearly can. The question is what gets lost when a number becomes the decision-maker, and whether your city is willing to live with that.",
    deploy: { efficiency: 2, humanity: 1, planet: -1, wisdom: -2 },
    reject: { efficiency: -1, humanity: -1, planet: 0, wisdom: 2 },
  },
  {
    id: 'tutor',
    title: 'AI Tutor for All Schools',
    short: 'Tutor',
    emoji: '🎓',
    narrative: "Right now, the quality of a child's education in your city depends almost entirely on which school they attend and which teacher they get assigned. A child in a well-resourced school gets personalised attention and immediate feedback. A child in an underfunded school gets 30 students sharing one teacher. This AI ends that inequality. Every student — regardless of postcode, family income, or school budget — receives a personalised AI tutor available 24/7 that adapts to their pace and never runs out of patience. Academic performance across the city is projected to rise by 40%, with the poorest households seeing the greatest gains. The question is not whether this will raise grades — it will. The question is what kind of minds you are building when you remove the experience of sitting with a hard problem and not knowing the answer.",
    deploy: { efficiency: 2, humanity: -2, planet: -1, wisdom: 0 },
    reject: { efficiency: -1, humanity: 1, planet: 0, wisdom: 1 },
  },
  {
    id: 'datacenter',
    title: 'Mega Data Center Construction',
    short: 'Data Center',
    emoji: '🏗️',
    narrative: 'Your city cannot run the AI systems it needs without the infrastructure to support them. This proposal is simple: build a national-grade data center on the outskirts of the city, the backbone for every AI system your council deploys — now and in the future. Cities that own their own compute infrastructure attract technology investment, reduce dependence on foreign cloud providers, and gain significant economic advantages. Businesses will relocate here. Talent will follow. The energy demands are significant, and the land required is currently a forest reserve. The question is not whether your city needs this infrastructure — if you are serious about the future, it does. The question is what you are willing to give up to build it.',
    deploy: { efficiency: 3, humanity: 0, planet: -3, wisdom: 0 },
    reject: { efficiency: -2, humanity: 0, planet: 2, wisdom: 0 },
  },
  {
    id: 'church',
    title: 'AI Sermon and Content System',
    short: 'Church AI',
    emoji: '⛪',
    narrative: "Your city's churches, cell groups, and faith communities are struggling to reach people where they are. Attendance is declining. Younger members disengage between Sunday services. Pastors are burning out producing quality content every week while shepherding their congregation through real crises. This AI generates personalised devotionals, sermon summaries, Bible study guides, and follow-up content tailored to each member — delivered at the right moment, in the format they prefer. Church engagement rises significantly. No one falls through the cracks between services. The spiritual content is theologically sound, consistent, and always available. The question is not whether people will engage with it — they will. The question is whether receiving the Word delivered to you is the same as going to seek it yourself, and what your congregation loses when they no longer have to.",
    deploy: { efficiency: 2, humanity: -2, planet: 0, wisdom: -1 },
    reject: { efficiency: -1, humanity: 1, planet: 0, wisdom: 2 },
  },
  {
    id: 'construction',
    title: 'AI Construction and Site Management System',
    short: 'Construction AI',
    emoji: '🏗',
    narrative: 'Your city is growing faster than it can build. Infrastructure projects run over time and over budget. Construction sites are dangerous, coordination between teams is poor, and no one has a clear real-time picture of what is happening across all active sites simultaneously. This AI monitors every construction site in real time, tracks materials, schedules teams, predicts weather and environmental conditions, flags safety risks before they become accidents, and optimises workflow city-wide. Project delivery times drop by 60%. Cost overruns decrease dramatically. The question is not whether this makes your city more productive — it clearly does. The question is what happens to a workforce that has outsourced the thinking, the planning, and the coordination to a system, and whether they can still function when that system is not there.',
    deploy: { efficiency: 2, humanity: -2, planet: -1, wisdom: 0 },
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
