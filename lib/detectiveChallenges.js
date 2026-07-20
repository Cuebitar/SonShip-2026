// Mini-game pool for the detective clue pages.
// Campers must clear a few of these before a clue is revealed — they exist to stall time.
//
// Challenge types (mechanics implemented in pages/clue/[id].vue):
//   mcq       — multiple-choice question (riddles, 脑筋急转弯, trivia, emoji puzzles, math)
//   findEmoji — spot the one different emoji in a grid
//   memory    — repeat a flashing colour sequence
//   hold      — hold a button for exactly N seconds (timer hidden)
//   tapOrder  — tap numbers 1-9 in ascending order
//   type      — type a phrase exactly
//   reaction  — tap as soon as the screen turns green (multiple rounds)
//   stroop    — tap the INK colour of a colour word, not the word itself

export const CHALLENGE_POOL = [
  // ── 脑筋急转弯 ──────────────────────────────────────────────
  {
    type: 'mcq', title: '脑筋急转弯',
    question: '什么东西越洗越脏？',
    options: ['水', '衣服', '脸', '手'], answer: 0,
  },
  {
    type: 'mcq', title: '脑筋急转弯',
    question: '什么门永远关不上？',
    options: ['家门', '球门', '校门', '车门'], answer: 1,
  },
  {
    type: 'mcq', title: '脑筋急转弯',
    question: '小明的妈妈有三个儿子，大儿子叫大毛，二儿子叫二毛，三儿子叫什么？',
    options: ['三毛', '小毛', '毛毛', '小明'], answer: 3,
  },
  {
    type: 'mcq', title: '脑筋急转弯',
    question: '什么车寸步难行？',
    options: ['坏掉的车', '风车', '纸做的车', '玩具车'], answer: 1,
  },
  {
    type: 'mcq', title: '脑筋急转弯',
    question: '一年四季都盛开的花是什么花？',
    options: ['塑料花', '太阳花', '玫瑰花', '喇叭花'], answer: 0,
  },
  {
    type: 'mcq', title: '脑筋急转弯',
    question: '什么东西有头无脚？',
    options: ['蛇', '砖头', '鱼', '床'], answer: 1,
  },

  // ── Quick math & logic ─────────────────────────────────────
  {
    type: 'mcq', title: 'Quick Math',
    question: 'A farmer has 17 sheep. All but 9 run away. How many are left?',
    options: ['8', '9', '17', '0'], answer: 1,
  },
  {
    type: 'mcq', title: 'Quick Math',
    question: 'What is 7 × 8 + 12 ÷ 4?',
    options: ['17', '23', '59', '68'], answer: 2,
  },
  {
    type: 'mcq', title: 'Logic Riddle',
    question: 'I speak without a mouth and hear without ears. What am I?',
    options: ['A ghost', 'The wind', 'An echo', 'A phone'], answer: 2,
  },
  {
    type: 'mcq', title: 'Logic Riddle',
    question: 'The more you take, the more you leave behind. What are they?',
    options: ['Memories', 'Footsteps', 'Photos', 'Coins'], answer: 1,
  },
  {
    type: 'mcq', title: 'Logic Riddle',
    question: 'What has hands but cannot clap?',
    options: ['A statue', 'A glove', 'A clock', 'A robot'], answer: 2,
  },

  // ── Emoji Bible puzzles ────────────────────────────────────
  {
    type: 'mcq', title: 'Emoji Puzzle',
    question: 'Guess the Bible story: 🌊🌊🚶🚶🌊🌊',
    options: ["Noah's Ark", 'Crossing the Red Sea', 'Jonah and the fish', 'Jesus calms the storm'], answer: 1,
  },
  {
    type: 'mcq', title: 'Emoji Puzzle',
    question: 'Guess the Bible story: 🍞🍞🐟🐟 ➕ 5000🧑',
    options: ['The Last Supper', 'Manna from heaven', 'Feeding of the 5000', 'Fishers of men'], answer: 2,
  },
  {
    type: 'mcq', title: 'Odd One Out',
    question: 'Which one does NOT belong?',
    options: ['Matthew', 'Mark', 'Moses', 'Luke'], answer: 2,
  },

  // ── Interactive mechanics ──────────────────────────────────
  { type: 'findEmoji', title: 'Spot the Impostor', target: '🐸', decoy: '🐢', size: 6 },
  { type: 'findEmoji', title: 'Spot the Impostor', target: '😸', decoy: '😺', size: 7 },
  { type: 'memory', title: 'Memory Sequence', length: 5 },
  { type: 'hold', title: 'Steady Hands', targetMs: 5000, toleranceMs: 700 },
  { type: 'tapOrder', title: 'Number Rush', count: 9 },
  { type: 'type', title: 'Type It Right', phrase: 'The truth will set you free' },
  { type: 'reaction', title: 'Lightning Reflex', rounds: 3 },
  { type: 'stroop', title: 'Colour Trap', rounds: 4 },
]

// How many challenges a camper must clear before the clue unlocks
export const REQUIRED_CHALLENGES = 3

export function pickChallenges(count = REQUIRED_CHALLENGES) {
  const shuffled = [...CHALLENGE_POOL].sort(() => Math.random() - 0.5)
  // Ensure variety: at most one challenge of each type when possible
  const picked = []
  const usedTypes = new Set()
  for (const c of shuffled) {
    if (picked.length >= count) break
    if (!usedTypes.has(c.type)) {
      picked.push(c)
      usedTypes.add(c.type)
    }
  }
  // Backfill if the type filter left us short
  for (const c of shuffled) {
    if (picked.length >= count) break
    if (!picked.includes(c)) picked.push(c)
  }
  return picked
}
