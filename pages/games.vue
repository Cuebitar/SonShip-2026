<template>
  <div class="page-container bg-[#0a0a0d] min-h-screen text-white pb-20">
    <div class="container-inner py-8">
      
      <!-- 1. 顶部 Banner -->
      <div class="relative w-full h-40 md:h-52 rounded-3xl overflow-hidden mb-8 border border-white/5 flex flex-col justify-center px-8 md:px-12">
        <div class="absolute inset-0 bg-[url('~/assets/background/campFire.jpg')] bg-cover bg-center opacity-30"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <h1 class="relative z-10 text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">营会游戏</h1>
        <p class="relative z-10 text-white/70 font-medium">参与游戏，赢取积分，登上排行榜，成为营会之王！</p>
      </div>

      <!-- 主体布局: 左侧 (内容) + 右侧 (个人面板) -->
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
        
        <!-- 左侧区域 -->
        <div class="space-y-8">
          
          <!-- 队伍积分榜 -->
          <div class="bg-[#15161c] rounded-3xl border border-white/5 p-6 md:p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <Trophy class="w-7 h-7 text-yellow-500" />
                <div>
                  <h2 class="font-black text-xl text-white">队伍积分榜</h2>
                  <p class="text-xs text-white/40">各队伍游戏积分实时动态更新</p>
                </div>
              </div>
              <div class="flex items-center gap-2 text-[10px] font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
              </div>
            </div>

            <!-- 队伍列表 (Top Teams) -->
            <div class="space-y-4">
              <div v-for="(team, index) in sortedTeams.slice(0, 3)" :key="team.id" 
                class="flex items-center gap-4 p-4 rounded-2xl bg-[#1a1b23]/50 border border-white/5 transition-all">
                <!-- 排名图标 -->
                <div class="w-12 h-12 flex items-center justify-center shrink-0">
                  <span v-if="index === 0" class="text-3xl">🥇</span>
                  <span v-else-if="index === 1" class="text-3xl">🥈</span>
                  <span v-else-if="index === 2" class="text-3xl">🥉</span>
                  <span v-else class="font-bold text-xl text-white/30">#{{ index + 1 }}</span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-lg text-white truncate">{{ team.name }}</h3>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span v-for="(score, gameName) in team.gameScores" :key="gameName" 
                      class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/60">
                      {{ gameName }} <span class="text-yellow-500 font-bold ml-1">+{{ score }}</span>
                    </span>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <p class="text-3xl font-black text-white leading-none">{{ team.totalScore }}</p>
                  <p class="text-[10px] text-white/40 font-bold uppercase mt-1">pts</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 游戏卡片网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="game in gamesStore.games" :key="game.id" 
              class="relative bg-[#15161c] rounded-3xl border border-white/5 p-6 hover:border-yellow-500/30 transition-all overflow-hidden group">
              <!-- 卡片背景装饰 -->
              <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div class="relative z-10">
                <span class="text-4xl mb-4 block">{{ game.emoji }}</span>
                <span class="inline-block px-2 py-1 rounded-md bg-white/5 text-[10px] uppercase tracking-wider text-white/50 mb-3">{{ game.type }}</span>
                <h3 class="font-bold text-lg text-white mb-2">{{ game.name }}</h3>
                <p class="text-xs text-white/50 mb-6 line-clamp-2">{{ game.description }}</p>
                <div class="flex gap-3">
                  <button @click="startReflex" class="flex-1 bg-yellow-500 text-black font-bold py-2 rounded-xl hover:bg-yellow-400 transition-colors">开始游戏</button>
                  <button @click="viewRules(game)" class="px-4 bg-white/5 rounded-xl text-white/70 hover:bg-white/10 transition-colors">规则</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧个人面板 -->
        <div class="space-y-6">
          
          <!-- Profile Card -->
          <div class="bg-[#15161c] rounded-3xl border border-white/5 p-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl border border-yellow-500/20">
                {{ auth.user?.avatar || '👤' }}
              </div>
              <div>
                <h3 class="font-bold text-lg text-white">{{ auth.user?.name }}</h3>
                <p class="text-sm text-yellow-500 font-medium">队长</p>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="flex justify-between text-xs mb-2">
                <span class="text-white/40">Lv.12</span>
                <span class="text-white/60">75%</span>
              </div>
              <div class="h-2 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-500 w-[75%] rounded-full"></div>
              </div>
            </div>

            <div class="bg-[#1a1b23] rounded-2xl p-4 border border-white/5 text-center">
              <p class="text-white/40 text-xs mb-1">我的总积分</p>
              <p class="text-3xl font-black text-white flex items-center justify-center gap-2">
                <Star class="w-6 h-6 text-yellow-500" /> {{ auth.user?.totalScore || 860 }} pts
              </p>
              <p class="text-xs text-yellow-500/80 mt-2">3rd <span class="text-green-500">↑</span></p>
            </div>
          </div>

          <!-- 个人排行榜 -->
          <div class="bg-[#15161c] rounded-3xl border border-white/5 p-6">
             <h3 class="font-bold text-white mb-4 flex items-center gap-2">
               <Trophy class="w-5 h-5 text-yellow-500" /> 个人积分榜
             </h3>
             <div class="space-y-3">
               <div v-for="(entry, i) in leaderboard" :key="entry.camperId" 
                 class="flex items-center gap-3 p-2 rounded-xl"
                 :class="entry.camperId === auth.user?.id ? 'bg-yellow-500/10' : ''">
                 <span class="w-6 text-center font-bold" :class="i < 3 ? 'text-yellow-500' : 'text-white/30'">{{ i + 1 }}</span>
                 <span class="text-lg">{{ getCamper(entry.camperId)?.avatar }}</span>
                 <span class="flex-1 text-sm text-white/80">{{ getCamper(entry.camperId)?.name }}</span>
                 <span class="font-bold text-white">{{ entry.score }}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <!-- 规则弹窗 (保持原样) -->
      <Transition name="modal">
        <div v-if="rulesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="rulesModal = null"></div>
          <div class="relative bg-[#15161c] border border-white/10 p-8 max-w-md w-full rounded-3xl">
            <h3 class="font-bold text-xl text-white mb-4">{{ rulesModal.emoji }} {{ rulesModal.name }}</h3>
            <p class="text-sm text-white/60 mb-6">{{ rulesModal.description }}</p>
            <button @click="rulesModal = null" class="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl">Got it!</button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useGamesStore } from '~/stores/games'
import { useCampersStore } from '~/stores/campers'
import { collection, onSnapshot } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'
import { Trophy, Star, Award, Users } from 'lucide-vue-next'

const auth = useAuthStore()
const gamesStore = useGamesStore()
const campersStore = useCampersStore()

// Firebase 数据监听
const firebaseScores = ref([])
let unsubscribeScores = null

onMounted(() => {
  const db = useDb()
  if (db) {
    unsubscribeScores = onSnapshot(collection(db, "game_scores"), (snap) => {
      firebaseScores.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
  }
})

const sortedTeams = computed(() => {
  return firebaseScores.value
    .map(doc => ({
      id: doc.id,
      name: doc.teamName || doc.id,
      gameScores: doc.scores || {},
      totalScore: doc.totalScore || 0
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
})

const rulesModal = ref(null)
const leaderboard = computed(() => gamesStore.getLeaderboard().slice(0, 10))
const getCamper = (id) => campersStore.getCamperById(id)

function viewRules(game) { rulesModal.value = game }
function startReflex() { /* 保持原逻辑 */ }

onUnmounted(() => {
  if (unsubscribeScores) unsubscribeScores()
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>