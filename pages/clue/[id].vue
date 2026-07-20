<template>
  <div class="min-h-screen bg-dark flex flex-col">

    <!-- Minimal header (no site nav — this page is intentionally a dead end) -->
    <header class="py-4 border-b border-white/10 bg-gradient-dark">
      <div class="container-inner flex items-center justify-between">
        <p class="font-heading font-black text-primary text-lg">🔍 The Final Night</p>
        <span v-if="clue" class="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary/80">
          Stage {{ clue.stage }}
        </span>
      </div>
    </header>

    <main class="flex-1 container-inner py-8 max-w-2xl mx-auto w-full">

      <!-- Loading -->
      <div v-if="loading" class="text-center py-24 text-tertiary">
        <p class="text-4xl mb-4 animate-pulse">🕵️</p>
        <p>Decrypting clue…</p>
      </div>

      <!-- Not found -->
      <div v-else-if="notFound" class="text-center py-24">
        <p class="text-5xl mb-4">🚫</p>
        <h1 class="font-heading font-black text-2xl text-white mb-2">Clue Not Found</h1>
        <p class="text-tertiary mb-8">This clue doesn't exist or has been removed.</p>
        <button @click="goDashboard" class="btn-primary w-auto min-w-0 px-8">Back to Dashboard</button>
      </div>

      <!-- ── Challenge gauntlet ─────────────────────────────────── -->
      <div v-else-if="!unlocked" class="space-y-6">

        <div class="text-center">
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-primary/60 mb-2">Security Checkpoint 安全检查</p>
          <h1 class="font-heading font-black text-2xl text-white">Prove you're a real detective</h1>
          <p class="text-sm text-tertiary mt-1">Clear {{ challenges.length }} challenges to decrypt this clue · 完成挑战才能解锁线索</p>
        </div>

        <!-- Progress dots -->
        <div class="flex justify-center gap-3">
          <span
            v-for="(c, i) in challenges" :key="i"
            :class="[
              'w-3 h-3 rounded-full transition-all',
              i < challengeIndex ? 'bg-green-400' :
              i === challengeIndex ? 'bg-primary animate-pulse scale-125' : 'bg-white/15'
            ]"
          ></span>
        </div>

        <div class="card p-6 border border-primary/30" :class="{ 'challenge-shake': shaking }">
          <p class="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">
            Challenge {{ challengeIndex + 1 }} / {{ challenges.length }}
          </p>
          <h2 class="font-heading font-black text-xl text-white mb-5">{{ current.title }}</h2>

          <!-- Solved flash -->
          <div v-if="solvedFlash" class="text-center py-10">
            <p class="text-5xl mb-3">✅</p>
            <p class="font-heading font-bold text-green-400 text-xl">Solved!</p>
          </div>

          <!-- ── MCQ ── -->
          <div v-else-if="current.type === 'mcq'">
            <p class="text-white text-lg mb-5 leading-relaxed">{{ current.question }}</p>
            <div class="grid grid-cols-1 gap-3">
              <button
                v-for="(opt, i) in mcqOptions" :key="opt.text"
                @click="answerMcq(opt)"
                :disabled="cooldown > 0"
                class="px-4 py-3 rounded-xl text-left font-bold transition-all border"
                :class="cooldown > 0
                  ? 'bg-white/5 text-tertiary/40 border-white/5 cursor-not-allowed'
                  : 'bg-white/5 text-white border-white/10 hover:border-primary/60 hover:bg-primary/10'"
              >
                {{ String.fromCharCode(65 + i) }}. {{ opt.text }}
              </button>
            </div>
            <p v-if="cooldown > 0" class="text-red-400 text-sm font-bold mt-4 text-center">
              ❌ Wrong answer! Wait {{ cooldown }}s… 答错了，等一下！
            </p>
          </div>

          <!-- ── Find the impostor emoji ── -->
          <div v-else-if="current.type === 'findEmoji'">
            <p class="text-tertiary text-sm mb-4">One of these is not like the others. Tap it! 找出不一样的那个！</p>
            <div class="grid gap-1.5" :style="{ gridTemplateColumns: `repeat(${current.size}, minmax(0, 1fr))` }">
              <button
                v-for="(cell, i) in emojiGrid" :key="`${emojiGridKey}-${i}`"
                @click="tapEmoji(cell)"
                class="aspect-square flex items-center justify-center text-2xl rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >{{ cell }}</button>
            </div>
            <p v-if="feedback" class="text-red-400 text-sm font-bold mt-4 text-center">{{ feedback }}</p>
          </div>

          <!-- ── Memory sequence ── -->
          <div v-else-if="current.type === 'memory'">
            <p class="text-tertiary text-sm mb-4">
              {{ memoryPhase === 'show' ? 'Watch the sequence carefully… 记住顺序…' : 'Now repeat the sequence! 重复顺序！' }}
              <span v-if="memoryPhase === 'input'" class="text-primary font-bold ml-1">{{ memoryInput.length }} / {{ memorySequence.length }}</span>
            </p>
            <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <button
                v-for="color in MEMORY_COLORS" :key="color.name"
                @click="tapMemory(color.name)"
                :disabled="memoryPhase !== 'input'"
                class="h-24 rounded-2xl transition-all border-2"
                :class="[
                  color.class,
                  memoryLit === color.name ? 'opacity-100 scale-105 border-white' : 'opacity-40 border-transparent',
                  memoryPhase === 'input' ? 'hover:opacity-80 active:scale-95' : 'cursor-not-allowed'
                ]"
              ></button>
            </div>
            <p v-if="feedback" class="text-red-400 text-sm font-bold mt-4 text-center">{{ feedback }}</p>
          </div>

          <!-- ── Hold for exactly N seconds ── -->
          <div v-else-if="current.type === 'hold'">
            <p class="text-tertiary text-sm mb-6 text-center">
              Hold the button for <span class="text-primary font-bold">exactly {{ current.targetMs / 1000 }} seconds</span>, then release.<br>
              No timer shown — trust your instincts! 凭感觉按住{{ current.targetMs / 1000 }}秒！
            </p>
            <div class="flex justify-center">
              <button
                @pointerdown.prevent="startHold"
                @pointerup.prevent="endHold"
                @pointercancel.prevent="cancelHold"
                @contextmenu.prevent
                class="w-40 h-40 rounded-full font-heading font-black text-xl transition-all select-none touch-none"
                :class="holding ? 'bg-primary text-dark scale-95 shadow-warm' : 'bg-white/10 text-white hover:bg-white/15'"
              >
                {{ holding ? 'HOLDING…' : 'HOLD ME' }}
              </button>
            </div>
            <p v-if="feedback" class="text-red-400 text-sm font-bold mt-6 text-center">{{ feedback }}</p>
          </div>

          <!-- ── Tap numbers in order ── -->
          <div v-else-if="current.type === 'tapOrder'">
            <p class="text-tertiary text-sm mb-4">Tap 1 → {{ current.count }} in order. One mistake resets! 按顺序点击数字！</p>
            <div class="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <button
                v-for="n in tapOrderGrid" :key="n"
                @click="tapNumber(n)"
                class="aspect-square rounded-xl font-heading font-black text-2xl transition-all"
                :class="n <= tapOrderNext - 1
                  ? 'bg-green-500/20 text-green-400 cursor-default'
                  : 'bg-white/5 text-white hover:bg-white/15 active:scale-95'"
              >{{ n }}</button>
            </div>
            <p v-if="feedback" class="text-red-400 text-sm font-bold mt-4 text-center">{{ feedback }}</p>
          </div>

          <!-- ── Type the phrase ── -->
          <div v-else-if="current.type === 'type'">
            <p class="text-tertiary text-sm mb-3">Type this phrase exactly:</p>
            <p class="font-heading font-bold text-primary text-lg mb-5 select-none">“{{ current.phrase }}”</p>
            <input
              v-model="typeInput"
              @keyup.enter="checkTyped"
              @paste.prevent
              type="text"
              class="input py-3 bg-dark/50 mb-4"
              placeholder="Type here… (no copy-paste 😉)"
              autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            />
            <button @click="checkTyped" class="btn-primary w-full">Submit</button>
            <p v-if="feedback" class="text-red-400 text-sm font-bold mt-4 text-center">{{ feedback }}</p>
          </div>

          <!-- ── Reaction test ── -->
          <div v-else-if="current.type === 'reaction'">
            <p class="text-tertiary text-sm mb-4 text-center">
              Tap the box the moment it turns <span class="text-green-400 font-bold">green</span>. Too early = restart round!<br>
              Round {{ reactionRound + 1 }} / {{ current.rounds }}
            </p>
            <button
              @click="tapReaction"
              class="w-full h-48 rounded-2xl font-heading font-black text-2xl transition-colors"
              :class="{
                'bg-white/5 text-tertiary': reactionState === 'idle',
                'bg-red-500/30 text-red-300': reactionState === 'waiting',
                'bg-green-500 text-dark': reactionState === 'go',
              }"
            >
              {{ reactionState === 'idle' ? 'TAP TO START' : reactionState === 'waiting' ? 'WAIT FOR IT…' : 'TAP NOW!' }}
            </button>
            <p v-if="feedback" class="text-red-400 text-sm font-bold mt-4 text-center">{{ feedback }}</p>
          </div>

          <!-- ── Stroop colour trap ── -->
          <div v-else-if="current.type === 'stroop'">
            <p class="text-tertiary text-sm mb-4 text-center">
              Tap the <span class="text-primary font-bold">INK COLOUR</span> of the word — NOT what it says!
              One mistake resets. Round {{ stroopRound + 1 }} / {{ current.rounds }}
            </p>
            <p class="text-center font-heading font-black text-5xl mb-6 select-none" :class="stroopWord.inkClass">
              {{ stroopWord.text }}
            </p>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="c in STROOP_COLORS" :key="c.name"
                @click="answerStroop(c.name)"
                class="px-4 py-3 rounded-xl font-bold bg-white/5 text-white border border-white/10 hover:bg-white/15 transition-all"
              >{{ c.label }}</button>
            </div>
            <p v-if="feedback" class="text-red-400 text-sm font-bold mt-4 text-center">{{ feedback }}</p>
          </div>

        </div>
      </div>

      <!-- ── Clue revealed ──────────────────────────────────────── -->
      <div v-else class="space-y-6">
        <div class="text-center">
          <p class="text-5xl mb-3">🗝️</p>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-green-400 mb-2">Clue Unlocked 线索解锁</p>
          <h1 class="font-heading font-black text-3xl text-primary">{{ clue.title }}</h1>
        </div>

        <div class="card p-6 border border-primary/30">
          <p v-if="clue.description" class="text-white leading-relaxed whitespace-pre-line mb-5">{{ clue.description }}</p>

          <template v-if="clue.fileUrl">
            <img
              v-if="isImage"
              :src="clue.fileUrl"
              :alt="clue.title"
              class="w-full rounded-xl border border-white/10"
            />
            <iframe
              v-else-if="isPdf"
              :src="clue.fileUrl"
              class="w-full h-[70vh] rounded-xl border border-white/10 bg-white"
            ></iframe>
          </template>
        </div>

        <button @click="goDashboard" class="w-full py-3 font-bold text-tertiary hover:text-white transition-colors text-sm">
          ← Back to Dashboard
        </button>
      </div>

    </main>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, layout: false })

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { useDetectiveGameStore } from '~/stores/detectiveGame'
import { useAuthStore } from '~/stores/auth'
import { pickChallenges } from '~/lib/detectiveChallenges'

const route = useRoute()
const store = useDetectiveGameStore()
const auth = useAuthStore()

const loading = ref(true)
const notFound = ref(false)
const clue = ref(null)
const unlocked = ref(false)

const isImage = computed(() => clue.value?.fileType?.startsWith('image/'))
const isPdf = computed(() => clue.value?.fileType === 'application/pdf')

// ─── Navigation lockdown ────────────────────────────────────────────
// This page is a dead end: back button and route-leave both go to /dashboard.

function goDashboard() {
  allowLeave = true
  navigateTo('/dashboard', { replace: true })
}

let allowLeave = false

function onPopState() {
  goDashboard()
}

onBeforeRouteLeave((to) => {
  if (allowLeave || to.path === '/dashboard' || to.path === '/login') return true
  goDashboard()
  return false
})

// ─── Load clue + record the viewer ──────────────────────────────────

onMounted(async () => {
  history.pushState(null, '', location.href)
  window.addEventListener('popstate', onPopState)

  const [found, state] = await Promise.all([
    store.fetchClue(route.params.id),
    store.fetchGameState().catch(() => null),
  ])
  if (!found) {
    notFound.value = true
    loading.value = false
    return
  }
  clue.value = found

  // Record who opened this clue URL (fire-and-forget)
  const u = auth.user
  if (u?.email) {
    store.recordClueView(found.id, { name: u.name, email: u.email, group: u.group })
      .catch(err => console.error('[clue] view record failed', err))
  }

  // Admin can turn the mini-game gate off from the Clues tab
  if (state?.miniGamesEnabled === false) {
    unlocked.value = true
  } else {
    initChallenge()
  }
  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('popstate', onPopState)
  clearInterval(cooldownTimer)
  clearTimeout(memoryTimer)
  clearTimeout(reactionTimer)
})

// ─── Challenge engine ───────────────────────────────────────────────

const challenges = ref(pickChallenges())
const challengeIndex = ref(0)
const current = computed(() => challenges.value[challengeIndex.value] || {})
const solvedFlash = ref(false)
const shaking = ref(false)
const feedback = ref('')

function fail(msg) {
  feedback.value = msg
  shaking.value = true
  setTimeout(() => { shaking.value = false }, 500)
}

function solve() {
  feedback.value = ''
  solvedFlash.value = true
  setTimeout(() => {
    solvedFlash.value = false
    if (challengeIndex.value + 1 >= challenges.value.length) {
      unlocked.value = true
    } else {
      challengeIndex.value++
      initChallenge()
    }
  }, 1000)
}

function initChallenge() {
  feedback.value = ''
  const c = current.value
  if (c.type === 'mcq') setupMcq()
  else if (c.type === 'findEmoji') setupEmojiGrid()
  else if (c.type === 'memory') startMemory()
  else if (c.type === 'tapOrder') setupTapOrder()
  else if (c.type === 'type') { typeInput.value = '' }
  else if (c.type === 'reaction') { reactionRound.value = 0; reactionState.value = 'idle' }
  else if (c.type === 'stroop') { stroopRound.value = 0; nextStroop() }
}

// ── MCQ ──
const mcqOptions = ref([])
const cooldown = ref(0)
let cooldownTimer = null

function setupMcq() {
  const c = current.value
  mcqOptions.value = c.options
    .map((text, i) => ({ text, correct: i === c.answer }))
    .sort(() => Math.random() - 0.5)
  cooldown.value = 0
}

function answerMcq(opt) {
  if (opt.correct) { solve(); return }
  cooldown.value = 3
  clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(cooldownTimer)
  }, 1000)
  setupMcqReshuffle()
}

function setupMcqReshuffle() {
  mcqOptions.value = [...mcqOptions.value].sort(() => Math.random() - 0.5)
}

// ── Find emoji ──
const emojiGrid = ref([])
const emojiGridKey = ref(0)

function setupEmojiGrid() {
  const c = current.value
  const total = c.size * c.size
  const grid = Array(total).fill(c.decoy)
  grid[Math.floor(Math.random() * total)] = c.target
  emojiGrid.value = grid
  emojiGridKey.value++
}

function tapEmoji(cell) {
  if (cell === current.value.target) { solve(); return }
  fail('❌ Not that one! The grid has been reshuffled… 重新找！')
  setupEmojiGrid()
}

// ── Memory ──
const MEMORY_COLORS = [
  { name: 'red', class: 'bg-red-500' },
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'yellow', class: 'bg-yellow-400' },
]
const memorySequence = ref([])
const memoryInput = ref([])
const memoryPhase = ref('show')
const memoryLit = ref(null)
let memoryTimer = null

function startMemory() {
  const len = current.value.length || 5
  memorySequence.value = Array.from({ length: len }, () =>
    MEMORY_COLORS[Math.floor(Math.random() * MEMORY_COLORS.length)].name)
  memoryInput.value = []
  memoryPhase.value = 'show'
  playSequence(0)
}

function playSequence(i) {
  if (i >= memorySequence.value.length) {
    memoryLit.value = null
    memoryPhase.value = 'input'
    return
  }
  memoryLit.value = memorySequence.value[i]
  memoryTimer = setTimeout(() => {
    memoryLit.value = null
    memoryTimer = setTimeout(() => playSequence(i + 1), 250)
  }, 550)
}

function tapMemory(name) {
  if (memoryPhase.value !== 'input') return
  memoryInput.value.push(name)
  const idx = memoryInput.value.length - 1
  if (memorySequence.value[idx] !== name) {
    memoryPhase.value = 'show'
    fail('❌ Wrong sequence! Watch again… 记错了，再看一次！')
    setTimeout(startMemory, 900)
    return
  }
  if (memoryInput.value.length === memorySequence.value.length) solve()
}

// ── Hold ──
const holding = ref(false)
let holdStart = 0

function startHold() {
  holding.value = true
  holdStart = performance.now()
}

function endHold() {
  if (!holding.value) return
  holding.value = false
  const elapsed = performance.now() - holdStart
  const { targetMs, toleranceMs } = current.value
  if (Math.abs(elapsed - targetMs) <= toleranceMs) { solve(); return }
  fail(`❌ You held for ${(elapsed / 1000).toFixed(2)}s — aim for ${targetMs / 1000}s. Try again!`)
}

function cancelHold() {
  holding.value = false
}

// ── Tap order ──
const tapOrderGrid = ref([])
const tapOrderNext = ref(1)

function setupTapOrder() {
  const count = current.value.count || 9
  tapOrderGrid.value = Array.from({ length: count }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
  tapOrderNext.value = 1
}

function tapNumber(n) {
  if (n < tapOrderNext.value) return
  if (n !== tapOrderNext.value) {
    fail('❌ Wrong number! Back to 1… 错了，重新开始！')
    tapOrderNext.value = 1
    return
  }
  tapOrderNext.value++
  if (tapOrderNext.value > tapOrderGrid.value.length) solve()
}

// ── Type ──
const typeInput = ref('')

function checkTyped() {
  const want = current.value.phrase.trim().toLowerCase()
  const got = typeInput.value.trim().toLowerCase().replace(/\s+/g, ' ')
  if (got === want) { solve(); return }
  fail('❌ Not quite — check every word! 打错了，再看清楚！')
}

// ── Reaction ──
const reactionState = ref('idle')
const reactionRound = ref(0)
let reactionTimer = null

function tapReaction() {
  if (reactionState.value === 'idle') {
    feedback.value = ''
    reactionState.value = 'waiting'
    reactionTimer = setTimeout(() => {
      reactionState.value = 'go'
    }, 1500 + Math.random() * 3000)
    return
  }
  if (reactionState.value === 'waiting') {
    clearTimeout(reactionTimer)
    reactionState.value = 'idle'
    fail('❌ Too early! Round restarted… 太快了！')
    return
  }
  // go
  reactionRound.value++
  if (reactionRound.value >= current.value.rounds) { solve(); return }
  reactionState.value = 'idle'
  feedback.value = ''
}

// ── Stroop ──
const STROOP_COLORS = [
  { name: 'red', label: 'Red 红', inkClass: 'text-red-500' },
  { name: 'blue', label: 'Blue 蓝', inkClass: 'text-blue-500' },
  { name: 'green', label: 'Green 绿', inkClass: 'text-green-500' },
  { name: 'yellow', label: 'Yellow 黄', inkClass: 'text-yellow-400' },
]
const stroopRound = ref(0)
const stroopWord = ref({ text: '', ink: '', inkClass: '' })

function nextStroop() {
  const word = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  let ink = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  while (ink.name === word.name) {
    ink = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)]
  }
  stroopWord.value = { text: word.label.split(' ')[0].toUpperCase(), ink: ink.name, inkClass: ink.inkClass }
}

function answerStroop(name) {
  if (name === stroopWord.value.ink) {
    stroopRound.value++
    if (stroopRound.value >= current.value.rounds) { solve(); return }
    feedback.value = ''
    nextStroop()
    return
  }
  fail('❌ You read the word! Back to round 1… 被骗了，重来！')
  stroopRound.value = 0
  nextStroop()
}
</script>

<style scoped>
.challenge-shake {
  animation: shake 0.4s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
</style>
