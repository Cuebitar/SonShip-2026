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
    challenge: 'The team are emergency department doctors. Based on each patient\'s card, decide whether to send the patient to the ICU (Intensive Care Unit), or uphold the original decision.',
    challenge_zh: '你们是一组急诊科医生，需要根据病人的资料卡，决定是否将病人送入 ICU（重症监护室），或维持原来的决定。',
    deploy: {
      how: 'Every patient\'s file is automatically organized by AI, letting doctors and nurses judge faster whether ICU admission is needed — so the team can process more patients. You get a simplified patient profile. Because you can now handle more patients, extra patient cards are also provided; completing them earns bonus points.',
      how_zh: '使用 AI 医疗分诊后，每位病人的资料卡都会被自动整理，让医生和护士更快判断是否需要送入 ICU，从而可以处理更多病人。系统会提供一份简化后的病人资料。因为现在可以处理更多病人，所以会额外提供病人卡，完成这些卡可以获得额外分数。',
      scoreSheet: 'Each patient card answered correctly: 4 pts. Extra patient cards (AI mode only): 2 pts each.',
      scoreSheet_zh: '每张病人卡答对：4 分；每张额外病人卡：2 分。',
    },
    reject: {
      how: 'The system provides complete handwritten medical records with patient names and family details, making each judgment easier and more humane — complete patient information, with notes from nurses and doctors.',
      how_zh: '没有 AI 总结时，系统会提供完整的手写病历和病人姓名、家庭资料，让每次判断都更容易，也更有人情味。完整的病人资料，包含更多细节及护士和医生的备注。',
      scoreSheet: 'Each patient card answered correctly: 4 pts.',
      scoreSheet_zh: '每张病人卡答对：4 分。',
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
    cost: '2 Wisdom chips',
    targetMeter: 'Humanity',
    time: '10 min',
    challenge: 'The team are students in the city. Answer 20 comprehension questions based on the provided article.',
    challenge_zh: '你们是一组城市里的学生，任务是根据提供的文章回答 20 道问题。',
    deploy: {
      how: 'You rely on a summarized article rather than the full original text. Read the question sheet for 30 seconds, then read the article on an iPad — it auto-locks after 4 minutes. Answer 20 questions from memory. You may ask the Auditor for the answer to 1 question.',
      how_zh: '使用 AI 导师后，我们会更多依赖总结后的文章来回答问题，而不是阅读完整的原文。因为文章已经被总结，我们也会花更少时间仔细学习内容。提供一份总结后的文章。游戏步骤：阅读问题纸 30 秒，在 iPad 上阅读文章（4 分钟后会自动锁定），回答 20 道问题，可以向审计员（Auditor）询问 1 道题的答案。',
      scoreSheet: '1 pt per correct answer; maximum 20 pts.',
      scoreSheet_zh: '每答对 1 题：1 分；最高 20 分。',
    },
    reject: {
      how: 'You get a longer printed article and may refer back to it at any time while answering the questions.',
      how_zh: '没有 AI 导师时，需要花更多时间阅读完整文章，并找出回答问题所需的重要内容。提供较长的纸本文章，回答问题时可以随时参考纸本文章。',
      scoreSheet: '1 pt per correct answer; maximum 20 pts.',
      scoreSheet_zh: '每答对 1 题：1 分；最高 20 分。',
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
    challenge: 'The team are city planners. The city council has already decided to build / not build the Mega Data Center — this decision affects the city\'s power usage. ⚠ Limited service slots: the number of services each city can offer is limited, first come first served!',
    challenge_zh: '你们是一组城市规划师。市议会已经决定建造／不建造大型数据中心（Mega Data Center），这项决定影响了城市的电力使用。⚠ 服务名额有限：不同城市可提供的服务数量有限，先到先得！',
    deploy: {
      how: 'Must build around a 60-unit AI Data Center — a much harder puzzle. BUT the team passively earns +2 Energy chips at the start of every rotation block regardless.',
      scoreSheet: 'Score = (Happiness/Humanity Index × 2) + (Green/Planet Index × 2), capped at 20.',
      scoreSheet_zh: '（幸福指数 × 2）＋（绿色指数 × 2），最高 20 分。',
    },
    reject: {
      how: 'The data center only needs 30 units — an easier puzzle. No passive Energy income.',
      scoreSheet: 'Score = (Happiness/Humanity Index × 2) + (Green/Planet Index × 2), capped at 20.',
      scoreSheet_zh: '（幸福指数 × 2）＋（绿色指数 × 2），最高 20 分。',
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
    cost: '2 Energy chips',
    targetMeter: 'Humanity',
    time: '10 min',
    challenge: 'The team are a crew of Bobs. Build a three-story tower at Point A, then move it together as a full team to Point B within 10 minutes.',
    challenge_zh: '你们是一组 Bob，目标是在 A 点搭建一座三层高的塔，然后在 10 分钟内由全队一起将它移动到 B 点。',
    deploy: {
      how: 'Fewer people are assigned for building and transport — only 4 pairs of feet may move during transport. The Auditor will provide a special hint.',
      how_zh: '由于使用了 AI 建筑系统，管理层决定减少人手来进行建造和搬运。搬运过程中，只能有 4 双脚移动。审计员（Auditor）会提供一个特别提示。',
      scoreSheet: 'Successful completion: 10 pts. Tower condition: 0–10 pts at the Auditor\'s judgment. Maximum 20 pts.',
      scoreSheet_zh: '成功完成：10 分；塔的状况：根据审计员（Auditor）的判断获得 0–10 分；最高 20 分。',
    },
    reject: {
      how: 'More manpower is assigned for building and transport — only 6 pairs of feet may move/touch the ground during transport.',
      how_zh: '由于没有使用 AI 建筑系统，施工管理层决定安排更多人手进行建造和搬运。搬运过程中，只能有 6 双脚移动／接触地面。',
      scoreSheet: 'Successful completion: 10 pts. Tower condition: 0–10 pts at the Auditor\'s judgment. Maximum 20 pts.',
      scoreSheet_zh: '成功完成：10 分；塔的状况：根据审计员（Auditor）的判断获得 0–10 分；最高 20 分。',
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
    cost: '2 Wisdom chips',
    targetMeter: 'Wisdom',
    time: '10 min',
    challenge: 'The team represents the city in a Bible knowledge competition. Arrange a passage of Scripture into the correct order.',
    challenge_zh: '你们是一支代表城市参加圣经知识比赛的队伍。你们的目标是将一段圣经经文按照正确的顺序排列。',
    deploy: {
      how: 'You listen to the passage through screens, short videos (Reels), or podcast — rather than reading the Bible. The passage may only be heard once, no replay. Arrange 20 verse cards into the correct order from memory.',
      how_zh: '更多时间是通过屏幕、短视频（Reels）或 Podcast 聆听神的话语，而不是阅读圣经。只能听一次经文，不能重播，凭记忆将 20 张经文卡片排列成正确顺序。',
      scoreSheet: '1 pt per correctly placed verse card; maximum approximately 20 pts.',
      scoreSheet_zh: '每张经文卡片排列正确：1 分；最高约 20 分。',
    },
    reject: {
      how: 'You read God\'s Word through a physical Bible. Read the passage for 5 minutes, then arrange 18 verse cards, finding and removing the 2 incorrect ones.',
      how_zh: '更多时间是通过实体圣经阅读神的话语。阅读经文 5 分钟，排列 18 张经文卡片，并找出及移除 2 张错误的经文卡片。',
      scoreSheet: '1 pt per correctly placed verse card; maximum approximately 20 pts.',
      scoreSheet_zh: '每张经文卡片排列正确：1 分；最高约 20 分。',
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
    cost: '2 People chips',
    targetMeter: 'Efficiency',
    time: '10 min',
    challenge: 'The team are city electricians. Untangle the team\'s knot — without releasing your grip on the connecting rope — and arrange the team into a circle, correctly connecting the city\'s homes and service facilities.',
    challenge_zh: '你们是一组城市电工。你们的目标是通过解开队伍的结，在不松开连接（麻绳）的情况下，将队伍整理成一个圆圈，并正确连接城市里的住宅和服务设施。',
    deploy: {
      how: 'The AI-automated factory runs hotter, so you need to complete the task faster — only 4 minutes to untangle. The team may ask the Auditor to cut one rope of their choice.',
      how_zh: '由于使用了 AI 建筑系统，你们需要更快完成任务。有 4 分钟时间解开，队伍可以请审计员（Auditor）剪断其中一条绳子。',
      scoreSheet: 'Untangled by time mark: 100% = 20 pts · 75% = 15 · 50% = 10 · 25% = 5 · less = 0.',
      scoreSheet_zh: '100%=20 分 | 75%=15 分 | 50%=10 分 | 25%=5 分 | <25%=0 分。',
    },
    reject: {
      how: 'Management allows more time to complete the task — 5 minutes to untangle, giving the team more time for teamwork and discussion.',
      how_zh: '没有使用 AI 建筑系统时，管理层会提供更多时间来完成任务。有 5 分钟时间解开，队伍有更多时间进行团队合作与讨论。',
      scoreSheet: 'Untangled by time mark: 100% = 20 pts · 75% = 15 · 50% = 10 · 25% = 5 · less = 0.',
      scoreSheet_zh: '100%=20 分 | 75%=15 分 | 50%=10 分 | 25%=5 分 | <25%=0 分。',
    },
    payout: [
      { result: '100% untangled (20 pts)', gain: '+2 Energy chips' },
      { result: '75% untangled (15 pts)', gain: '+1 Energy chip' },
      { result: 'Below 75%', gain: 'No chips' },
    ],
  },
]
