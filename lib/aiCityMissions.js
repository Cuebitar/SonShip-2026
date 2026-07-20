// Phase 2 — City Exchange: the 6 station missions.
// Source: Notion "City Exchange - All 6 Missions (Full Content)" +
// "Mission Challenge Content - Print Ready".
//
// Path rule: teams that deployed 3+ AI systems in Phase 1 follow the
// Deployed AI path; 2 or fewer follow the Rejected AI path. The auditor
// can override per station. Every mission maxes at 20 pts on both paths.

export const UNIVERSAL_RULES =
  'Pay the token cost when starting the station. Tokens are never refunded on failure. ' +
  'If a team cannot afford the cost, they must trade for chips or sit the mission out (0 pts).'

export const MISSIONS = [
  {
    id: 1,
    emoji: '🧠',
    title: 'The Triage Run',
    location: 'Hospital',
    cost: '2 People chips',
    targetMeter: 'Wisdom',
    time: '10 min',
    challenge: 'The team are doctors in the emergency department. AI has recommended Approve ICU or Deny ICU for each patient. They mark each card OVERRIDE or UPHOLD.',
    deploy: {
      how: 'Patient cards are AI-summarised (names removed, critical context stripped) — harder per card. BUT they unlock the Mass Casualty extra cards because their AI can process volume: 10 cards in total.',
      scoreSheet: '10 cards × 2 pts each = max 20 pts.',
    },
    reject: {
      how: 'Full human-written patient case notes with names, family details, and nurse notes — easier per card. But their human process is too slow for volume: only the 5 base cards.',
      scoreSheet: '5 cards × 4 pts each = max 20 pts.',
    },
    payout: [
      { result: '18–20 pts', gain: '+2 Wisdom chips' },
      { result: '14–17 pts', gain: '+1 Wisdom chip' },
      { result: 'Below 14 pts', gain: 'No chips' },
    ],
  },
  {
    id: 2,
    emoji: '🔍',
    title: 'Spot the AI',
    location: 'Classroom',
    cost: '1 Wisdom chip',
    targetMeter: 'Humanity',
    time: '10 min',
    challenge: 'The team reads an article about the immune system, then answers 20 comprehension questions.',
    deploy: {
      how: 'The article is shown on an iPad/laptop that locks down after 5 minutes — their citizens rely on AI, so access to source material is limited. Read fast, verify faster; questions are answered from memory.',
      scoreSheet: '20 questions × 1 pt each = max 20 pts.',
    },
    reject: {
      how: 'The article is printed on paper and available for the full 10 minutes — the team can refer back to the text while answering.',
      scoreSheet: '20 questions × 1 pt each = max 20 pts.',
    },
    payout: [
      { result: '16–20 pts', gain: '+2 People chips' },
      { result: '12–15 pts', gain: '+1 People chip' },
      { result: 'Below 12 pts', gain: 'No chips' },
    ],
  },
  {
    id: 3,
    emoji: '⚡',
    title: 'Balance the Grid',
    location: 'Power Plant',
    cost: 'Free — mandatory for all teams',
    targetMeter: 'Planet',
    time: '10 min',
    challenge: 'Allocate exactly 100 power units across city services (hospital backup, school heating, water treatment, solar, forest reserve…). Every cut service has a printed consequence.',
    deploy: {
      how: 'Must build around a 60-unit AI Data Center — a much harder puzzle. BUT the team passively earns +2 Energy chips at the start of every rotation block regardless.',
      scoreSheet: 'Score = (Humanity value of funded services × 2) + (Planet value × 2), capped at 20. Bands: 16–20 → 20 pts · 12–15 → 16 pts · 8–11 → 12 pts · 4–7 → 8 pts · 0–3 → 4 pts.',
    },
    reject: {
      how: 'The data center only needs 30 units — an easier puzzle. No passive Energy income.',
      scoreSheet: 'Score = (Humanity value of funded services × 2) + (Planet value × 2), capped at 20. Bands: 16–20 → 20 pts · 12–15 → 16 pts · 8–11 → 12 pts · 4–7 → 8 pts · 0–3 → 4 pts.',
    },
    payout: [
      { result: '16–20 pts', gain: '+2 Land chips' },
      { result: '12–15 pts', gain: '+1 Land chip' },
      { result: '4–11 pts', gain: 'No chips' },
      { result: '0–3 pts', gain: '−1 Land chip' },
    ],
  },
  {
    id: 4,
    emoji: '💪',
    title: 'Bob the Builder',
    location: 'Construction Site',
    cost: '1 Energy + 1 Land chip',
    targetMeter: 'Humanity',
    time: '10 min',
    challenge: 'Build a tower in 5 minutes, then transport it to an unknown destination. Rain strikes during transport — the auditor sprays the tower with a water gun.',
    deploy: {
      how: 'AI weather forecast warns them BEFORE building that it will rain, so they can design for waterproofing. BUT limited manpower: transport with only 3–4 pairs of feet on the ground (half the team).',
      scoreSheet: 'Moved from Point A to B = 10 pts. Tower integrity: 100% = 10 · 75% = 7.5 · 50% = 5 · 25% = 2.5 · collapsed = 0. Max 20 pts.',
    },
    reject: {
      how: 'No forecast — the thunderstorm is a surprise during transport. Injured teammates mean transport with 4–5 pairs of feet on the ground (three-quarters of the team).',
      scoreSheet: 'Moved from Point A to B = 10 pts. Tower integrity: 100% = 10 · 75% = 7.5 · 50% = 5 · 25% = 2.5 · collapsed = 0. Max 20 pts.',
    },
    payout: [
      { result: '16–20 pts', gain: '+1 People + 1 Land chip' },
      { result: '10–15 pts', gain: '+1 People chip' },
      { result: 'Below 10 pts', gain: 'No chips' },
    ],
  },
  {
    id: 5,
    emoji: '📖',
    title: 'Podcast Bible?',
    location: 'Church',
    cost: '1 Wisdom chip',
    targetMeter: 'Wisdom',
    time: '10 min',
    challenge: 'Memorise John 15:1–13 (The Vine and the Branches, NIV), then rearrange shuffled verse strips into the correct order. A physical Bible stays at the table — checking Scripture is allowed and encouraged.',
    deploy: {
      how: 'The passage is read aloud ONCE (podcast-style) — they never see the text. Then rearrange 13 verse strips in whatever time remains. No re-reads.',
      scoreSheet: 'Score = (correct strips ÷ 13) × 20, rounded. Max 20 pts.',
    },
    reject: {
      how: 'They read the printed passage themselves for 5 minutes, then rearrange 15 strips (13 verses + 2 distractors to spot and exclude) in the remaining 5 minutes.',
      scoreSheet: 'Score = (correct strips ÷ 15) × 20, rounded. Max 20 pts.',
    },
    payout: [
      { result: '16–20 pts', gain: '+2 Wisdom chips' },
      { result: '12–15 pts', gain: '+1 Wisdom chip' },
      { result: 'Below 12 pts', gain: 'No chips' },
    ],
  },
  {
    id: 6,
    emoji: '🪢',
    title: 'Not that Knot',
    location: 'Electric Wiring Factory',
    cost: '1 Energy + 1 People chip',
    targetMeter: 'Efficiency',
    time: '10 min',
    challenge: 'Team stands in a circle holding overlapping strings (one end in each hand) and must untangle themselves without letting go before the wiring overheats.',
    deploy: {
      how: 'The AI-automated factory runs hotter — only 4 minutes. BUT they may ask the auditor to cut any ONE string of their choice at any moment.',
      scoreSheet: 'Untangled by time mark: 100% = 20 pts · 75% = 15 · 50% = 10 · 25% = 5 · less = 0.',
    },
    reject: {
      how: '5 minutes on the clock. They get scissors on one piece of string at the start.',
      scoreSheet: 'Untangled by time mark: 100% = 20 pts · 75% = 15 · 50% = 10 · 25% = 5 · less = 0.',
    },
    payout: [
      { result: '100% untangled (20 pts)', gain: '+2 Energy chips' },
      { result: '75% untangled (15 pts)', gain: '+1 Energy chip' },
      { result: 'Below 75%', gain: 'No chips' },
    ],
  },
]
