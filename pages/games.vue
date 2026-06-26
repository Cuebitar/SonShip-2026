<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10">
      <h1 class="section-title mb-8">{{ t('games.title') }}</h1>

      <!-- ================= 队伍积分榜 (新增) ================= -->
      <div class="card p-6 border-primary/20 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <Podium class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 class="font-heading font-bold text-xl text-primary">队伍积分榜</h2>
            <p class="font-body text-xs text-tertiary/60">各队伍游戏积分实时动态</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-primary/20 text-tertiary/60 text-xs uppercase tracking-wider font-heading">
                <th class="py-3 px-4 font-medium w-20 text-center">排名</th>
                <th class="py-3 px-4 font-medium">队伍名称</th>
                <th class="py-3 px-4 font-medium hidden md:table-cell">各项目得分明细</th>
                <th class="py-3 px-4 font-medium text-right">总积分</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary/10">
              <tr
                v-for="(team, index) in sortedTeams"
                :key="team.id"
                class="hover:bg-primary/5 transition-colors group"
              >
                <!-- 排名 -->
                <td class="py-4 px-4">
                  <div class="flex justify-center">
                    <div 
                      class="flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm font-heading"
                      :class="getRankStyle(index + 1)"
                    >
                      {{ index + 1 }}
                    </div>
                  </div>
                </td>
                
                <!-- 队伍名称 -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="p-1.5 bg-secondary/30 rounded-lg text-tertiary/60">
                      <Users class="w-4 h-4" />
                    </div>
                    <span class="font-heading font-bold text-tertiary text-sm md:text-base">{{ team.name }}</span>
                  </div>
                </td>
                
                <!-- 明细 -->
                <td class="py-4 px-4 hidden md:table-cell">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(score, gameName) in team.gameScores" 
                      :key="gameName" 
                      class="inline-flex items-center px-2 py-1 rounded border border-primary/10 bg-secondary/20 text-[10px] sm:text-xs font-body text-tertiary/80"
                    >
                      {{ gameName }}: 
                      <span :class="score < 0 ? 'text-red-400 ml-1 font-bold' : 'text-primary ml-1 font-bold'">
                        {{ score > 0 ? '+' + score : score }}
                      </span>
                    </span>
                  </div>
                </td>
                
                <!-- 总分 -->
                <td class="py-4 px-4 text-right">
                  <span class="text-xl md:text-2xl font-heading font-black text-primary">
                    {{ team.totalScore }}
                  </span>
                  <span class="text-[10px] text-tertiary/40 ml-1 font-body uppercase">pts</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- ================================================== -->

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Game Catalog + Interactive (原有代码) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="game in gamesStore.games" :key="game.id" class="card-hover p-6 group">
              <div class="flex items-start justify-between mb-3">
                <span class="text-4xl">{{ game.emoji }}</span>
                <span class="badge-primary text-xs capitalize">{{ game.type }}</span>
              </div>
              <h3 class="font-heading font-bold text-tertiary group-hover:text-primary transition-colors mb-1">{{ game.name }}</h3>
              <p class="font-body text-xs text-tertiary/60 mb-4">{{ game.description }}</p>
              <div class="flex gap-2">
                <button v-if="game.type === 'interactive'" @click="startReflex"
                  class="btn-primary btn-sm flex-1 justify-center">{{ t('games.play') }}</button>
                <button @click="viewRules(game)" class="btn-ghost btn-sm flex-1 justify-center">{{ t('games.rules') }}</button>
              </div>
            </div>
          </div>

          <!-- Reflex Rush Game (原有代码) -->
          <div v-if="reflexActive" class="card p-8 border-primary/30 text-center">
            <h3 class="font-heading font-bold text-xl text-primary mb-2">⚡ Reflex Rush</h3>
            <p class="font-body text-sm text-tertiary/60 mb-4">Tap the golden circle! Time: <span class="text-primary font-bold">{{ timeLeft }}s</span></p>
            <div class="relative h-48 bg-secondary/30 rounded-2xl overflow-hidden cursor-pointer" @click="missClick">
              <button v-if="circleVisible"
                :style="`position:absolute;left:${circleX}%;top:${circleY}%;transform:translate(-50%,-50%);`"
                @click.stop="tapCircle"
                class="w-16 h-16 rounded-full bg-primary animate-pulse-warm border-4 border-accent shadow-warm-lg">
              </button>
              <div class="absolute inset-0 flex items-center justify-center" v-if="!circleVisible">
                <p class="font-body text-tertiary/40 text-sm">Get ready... 👀</p>
              </div>
            </div>
            <div class="mt-4 flex justify-center gap-6">
              <div class="text-center">
                <p class="font-heading font-black text-3xl text-primary">{{ gameScore }}</p>
                <p class="font-body text-xs text-tertiary/50">Score</p>
              </div>
              <div class="text-center">
                <p class="font-heading font-black text-3xl text-accent">{{ gameTaps }}</p>
                <p class="font-body text-xs text-tertiary/50">Taps</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Leaderboard + Achievements (原有代码) -->
        <div class="space-y-6">
          <!-- 个人榜单 Leaderboard -->
          <div class="card p-6">
            <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
              <Trophy class="w-5 h-5" /> 个人积分榜
            </h3>
            <div class="space-y-2">
              <div v-for="(entry, i) in leaderboard" :key="entry.camperId"
                class="flex items-center gap-3 p-2 rounded-lg"
                :class="entry.camperId === auth.user?.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-primary/5'">
                <span class="font-heading font-black text-sm w-6 text-center"
                  :class="i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-tertiary/40'">
                  {{ i + 1 }}
                </span>
                <span class="text-lg">{{ getCamper(entry.camperId)?.avatar }}</span>
                <div class="flex-1 min-w-0">
                  <p class="font-body text-xs font-semibold text-tertiary truncate">{{ getCamper(entry.camperId)?.name }}</p>
                </div>
                <span class="font-heading font-bold text-sm text-primary">{{ entry.score }}</span>
              </div>
            </div>
          </div>

          <!-- My Achievements -->
          <div class="card p-6">
            <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
              <Star class="w-5 h-5" /> {{ t('games.achievements') }}
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="ach in gamesStore.achievements" :key="ach.id"
                class="p-2 rounded-lg text-center transition-all duration-200"
                :class="myAchievements.includes(ach.name) ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/20 opacity-40'">
                <div class="text-2xl mb-1">{{ ach.emoji }}</div>
                <p class="font-body text-xs text-tertiary leading-tight">{{ ach.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rules Modal (原有代码) -->
    <Transition name="modal">
      <div v-if="rulesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="rulesModal = null"></div>
        <div class="relative card p-8 max-w-md w-full border-primary/20">
          <h3 class="font-heading font-bold text-xl text-primary mb-1">{{ rulesModal.emoji }} {{ rulesModal.name }}</h3>
          <p class="font-body text-sm text-tertiary/60 mb-5">{{ rulesModal.description }}</p>
          <ul class="space-y-2">
            <li v-for="rule in rulesModal.rules" :key="rule" class="flex gap-2 text-sm font-body text-tertiary/80">
              <span class="text-primary">→</span> {{ rule }}
            </li>
          </ul>
          <button @click="rulesModal = null" class="btn-primary w-full justify-center mt-6">Got it!</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useGamesStore } from '~/stores/games'
import { useCampersStore } from '~/stores/campers'
// 注意这里统一使用了新包 @lucide/vue
import { Trophy, Star, Podium, Users } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const gamesStore = useGamesStore()
const campersStore = useCampersStore()

// ========== 队伍积分榜逻辑 (新增) ==========
const mockTeamsData = ref([
  {
    id: 'team_a',
    name: 'Team A (烈火队)',
    gameScores: { '破冰游戏': 50, '寻宝大作战': 120, '拔河比赛': -10 },
    totalScore: 160
  },
  {
    id: 'team_b',
    name: 'Team B (飞鹰队)',
    gameScores: { '破冰游戏': 60, '寻宝大作战': 100, '拔河比赛': 50 },
    totalScore: 210
  },
  {
    id: 'team_c',
    name: 'Team C (雷霆队)',
    gameScores: { '破冰游戏': 40, '寻宝大作战': 150, '拔河比赛': 30 },
    totalScore: 220
  },
  {
    id: 'team_d',
    name: 'Team D (磐石队)',
    gameScores: { '破冰游戏': 55, '寻宝大作战': 90, '拔河比赛': 40 },
    totalScore: 185
  }
])

const sortedTeams = computed(() => {
  return [...mockTeamsData.value].sort((a, b) => b.totalScore - a.totalScore)
})

const getRankStyle = (rank) => {
  if (rank === 1) return 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]' 
  if (rank === 2) return 'bg-gray-300/20 text-gray-300 border border-gray-300/30' 
  if (rank === 3) return 'bg-amber-600/20 text-amber-500 border border-amber-600/30' 
  return 'bg-secondary/30 text-tertiary/50' 
}
// =========================================

const rulesModal = ref(null)
const reflexActive = ref(false)
const circleVisible = ref(false)
const circleX = ref(50)
const circleY = ref(50)
const timeLeft = ref(30)
const gameScore = ref(0)
const gameTaps = ref(0)
let gameTimer = null, circleTimer = null

const leaderboard = computed(() => gamesStore.getLeaderboard().slice(0, 10))
const myAchievements = computed(() => gamesStore.getCamperScore(auth.user?.id)?.achievements || [])
const getCamper = (id) => campersStore.getCamperById(id)

function viewRules(game) { rulesModal.value = game }

function startReflex() {
  reflexActive.value = true; gameScore.value = 0; gameTaps.value = 0; timeLeft.value = 30
  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(gameTimer); clearTimeout(circleTimer)
      circleVisible.value = false
      gamesStore.addScore(auth.user.id, gameScore.value)
    }
  }, 1000)
  scheduleCircle()
}

function scheduleCircle() {
  const delay = 600 + Math.random() * 1200
  circleTimer = setTimeout(() => {
    if (timeLeft.value > 0) {
      circleX.value = 10 + Math.random() * 80
      circleY.value = 10 + Math.random() * 80
      circleVisible.value = true
      circleTimer = setTimeout(() => { circleVisible.value = false; scheduleCircle() }, 800)
    }
  }, delay)
}

function tapCircle() { circleVisible.value = false; gameScore.value += 10; gameTaps.value++; scheduleCircle() }
function missClick() { gameScore.value = Math.max(0, gameScore.value - 5) }

onUnmounted(() => { clearInterval(gameTimer); clearTimeout(circleTimer) })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>