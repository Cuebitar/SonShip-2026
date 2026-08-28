// Phase 1 — The Council: card data & scoring for the AI City game.
// Source: Notion "🃏 Phase 1 - The Council".
// Teams start with all 4 meters at 7 (capped 0–15). Each Deploy/Reject
// decision shifts the meters; the goal is balance, not a single high meter.

export const START_METER = 7
export const METER_MIN = 0
export const METER_MAX = 15

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
    narrative: "Every day, your city's hospitals turn people away. Emergency wards are overwhelmed. Patients wait hours in pain while doctors manually review files, weigh survival odds, and make calls under pressure. The most vulnerable — the elderly, the uninsured, the ones who cannot advocate for themselves — often wait the longest. This AI system is changing that. It processes every incoming patient in seconds, analyzing their survival probability, pre-existing conditions, and urgency level, and automatically assigns them to the right care pathway. Wait times drop by 60%. More people get seen. More people survive. Hospitals using this system consistently outperform those without it on every measurable health outcome. The question before your council is not whether AI can save lives — that much is clear. The real question is: what do we lose when the decision is handed to a number? Is your city willing to pay that price?",
    narrative_zh: '每天，你所在城市的医院都要把病人拒之门外。急诊室人满为患。病人忍痛等待数小时，而医生则要人工审阅病历、权衡生存几率，并在压力下做出判断。最脆弱的群体——老年人、没有保险的人、无法为自己发声的人——往往等待的时间最长。这套人工智能系统正在改变这一切。它能在数秒内处理每一位新入院的病人，分析其生存概率、既往病史和紧急程度，并自动将其分配到合适的诊疗路径。等待时间因此缩短了60%。更多人得到及时救治，更多人得以存活。采用这套系统的医院，在各项可衡量的健康指标上，表现始终优于未采用的医院。摆在市议会面前的问题，不是人工智能能否拯救生命——这一点显而易见。真正的问题是：当决策权交给一个数字时，我们失去了什么？你所在的城市，是否愿意承担这样的代价？',
    deploy: { efficiency: 2, humanity: 1, planet: -1, wisdom: -2 },
    reject: { efficiency: -1, humanity: -1, planet: 0, wisdom: 2 },
  },
  {
    id: 'tutor',
    title: 'AI Tutor for All Schools',
    short: 'Tutor',
    emoji: '🎓',
    narrative: "Right now, the quality of a child's education in your city depends almost entirely on which school they attend and which teacher they're assigned. A child in a well-resourced school gets personalized attention and instant feedback. A child in an underfunded school shares one teacher with 30 classmates. This AI system ends that inequality. Regardless of postcode, family income, or school budget, every student gets a personalized AI tutor available 24 hours a day, 7 days a week. It adapts to the child's pace, identifies exactly where their understanding breaks down, and never runs out of patience. Academic performance citywide is projected to rise by 40%, with children from the poorest families gaining the most. The question isn't whether this raises grades — it clearly does. The question is: what kind of mind are you shaping when a child never has to sit alone with a hard problem, never has to carry the discomfort of not knowing the answer?",
    narrative_zh: '现在，你所在城市孩子的教育质量，几乎完全取决于他们就读哪所学校、被分配到哪位老师。在资源充足的学校，孩子能获得个性化关注和即时反馈。而在资金不足的学校，30个学生共用一位老师。这套人工智能系统终结了这种不平等。无论邮政编码、家庭收入或学校预算如何，每一位学生都能拥有一位全天24小时、每周7天随时可用的个性化AI导师。这位导师会配合孩子的学习节奏，找出理解上的薄弱环节，而且永远不会失去耐心。预计全城的学业成绩将提升40%，而来自最贫困家庭的孩子将获益最大。问题不在于这是否能提高成绩——它确实可以。问题在于：当孩子不再需要独自面对一道难题、独自承受不知道答案的过程时，你正在塑造出怎样的心智？',
    deploy: { efficiency: 2, humanity: -2, planet: -1, wisdom: 0 },
    reject: { efficiency: -1, humanity: 1, planet: 0, wisdom: 1 },
  },
  {
    id: 'datacenter',
    title: 'Mega Data Center Construction',
    short: 'Data Center',
    emoji: '🏗️',
    narrative: "Your city cannot run the AI systems it needs without the infrastructure to support them. This proposal is simple: build a national-grade data center on the outskirts of the city — the backbone for every AI system your council deploys, now and in the future. Cities that own their own compute infrastructure attract technology investment, reduce dependence on foreign cloud providers, and gain a significant economic edge. Your city becomes a regional tech leader. Businesses relocate here, talent follows, and tax revenue grows. The energy demands are substantial, and the land required is currently a protected forest reserve. But no major city that has made this investment has ever regretted it. The question is not whether your city needs this infrastructure — if you're serious about the future, it does. The real question is: what are you willing to give up to build it?",
    narrative_zh: '你所在的城市若没有相应的基础设施，就无法运行所需的人工智能系统。这项提案很简单：在城市郊区建造一座国家级数据中心。它将成为市议会未来部署的每一套人工智能系统的核心支撑。拥有自主算力基础设施的城市，能够吸引科技投资、减少对外国云服务商的依赖，并获得显著的经济优势。你所在的城市将成为区域科技领导者。企业会迁址于此，人才随之而来，税收也将增长。能源需求相当可观，而所需的土地目前是一片森林保护区。但每一座做出这项投资的主要城市，都从未后悔过。问题不在于你所在的城市是否需要这套基础设施——如果你真心为未来着想，答案是肯定的。真正的问题是：为了建造它，你愿意付出什么代价？',
    deploy: { efficiency: 3, humanity: 0, planet: -3, wisdom: 0 },
    reject: { efficiency: -2, humanity: 0, planet: 2, wisdom: 0 },
  },
  {
    id: 'church',
    title: 'AI Sermon and Content System',
    short: 'Church AI',
    emoji: '⛪',
    narrative: "Your city's churches, cell groups, and faith communities are trying hard to reach people in need — and struggling. Attendance is declining. Younger members drift out of contact between Sunday services. Pastors are exhausted, producing quality content every week while also shepherding their congregation through real crises. This AI system changes that. It generates personalized devotionals, sermon summaries, Bible study guides, and follow-up content for every member — delivered at the right moment, in the format they prefer. Church engagement rises sharply. No one falls through the cracks between services. Pastoral teams are freed from content production to focus on caring for people. The spiritual content is theologically sound, consistent, and always available. The question isn't whether people will engage with it — they will. The real question is: is receiving the Word handed to you the same as seeking it out yourself? And what does a congregation lose when it no longer has to seek?",
    narrative_zh: '你所在城市的教会、小组和信仰群体，正努力想触及那些身处需要之地的人，却力不从心。出席人数正在下降，年轻会友在主日崇拜之间逐渐失联。牧者们疲于每周制作高质量内容，同时还要在真实的危机中牧养会众，身心俱疲。这套人工智能系统改变了这一切。它能为每位会友生成个性化的灵修材料、讲道摘要、查经指南和跟进内容——在合适的时机，以他们偏好的形式送达。教会的参与度指标显著上升。没有人会在主日之间被遗漏。牧养团队得以从内容制作中解放，专注于关顾会众。属灵内容在神学上稳健、前后一致，并且随时可得。问题不在于人们是否会参与其中——他们一定会。真正的问题是：被动接收传递到你面前的话语，与主动去寻求神的话语，是否是同一回事？而当会众不再需要亲自去寻求时，他们又失去了什么？',
    deploy: { efficiency: 2, humanity: -2, planet: 0, wisdom: -1 },
    reject: { efficiency: -1, humanity: 1, planet: 0, wisdom: 2 },
  },
  {
    id: 'construction',
    title: 'AI Construction and Site Management System',
    short: 'Construction AI',
    emoji: '🏗',
    narrative: "Your city is growing faster than it can build. Infrastructure projects run over time and over budget, again and again. Construction sites are dangerous, coordination between teams is poor, and no one has a clear real-time picture of every active site at once. This AI system changes that. It monitors every construction site in real time, tracks materials, schedules teams, predicts weather and environmental conditions, flags safety risks before they become accidents, and optimizes workflow city-wide. Project delivery times drop by 60%, cost overruns shrink dramatically, and the city builds faster, more, and more safely. Workers using the system say it removes the guesswork and lets them focus on the craft itself. The question isn't whether this makes the city more productive — it clearly does. The real question is: once a workforce has outsourced its thinking, planning, and coordination to a system, can it still function on its own if that system is gone?",
    narrative_zh: '你所在城市的发展速度，已经超过了它所能建设的速度。基础设施项目频频延期超支。工地危险重重，团队之间协调不畅，也没有人能实时清楚掌握所有在建工地的整体状况。这套人工智能系统改变了这一切。它能实时监控每一个建筑工地，追踪物料、安排团队、预测天气和环境状况，在安全隐患演变成事故之前就发出预警，并优化全城建设计划的工作流程。项目交付时间缩短了60%，成本超支大幅减少，城市建设变得更快、更多、更安全。使用这套系统的工人们表示，它消除了猜测，让他们能够专注于手艺本身。问题不在于这是否能提高城市的生产力——它显然可以。真正的问题是：当一支劳动力队伍把思考、规划和协调都外包给了系统之后，一旦系统不在了，他们是否还能独立运作？',
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
