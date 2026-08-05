<template>
  <div class="page-container bg-[#0a0a0d] min-h-screen text-white pb-20 font-sans">
    
    <!-- 背景氛围 -->
    <div class="absolute top-0 left-0 w-full h-[500px] bg-[url('~/assets/background/campFire.jpg')] bg-cover bg-center opacity-20 pointer-events-none mask-image-b"></div>
    <div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0a0a0d]/50 via-[#0a0a0d]/80 to-[#0a0a0d] pointer-events-none"></div>

    <div class="container-inner relative z-10 py-12">
      
      <!-- 1. 页面标题 -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-3 tracking-wide">
          营会游戏
        </h1>
        <p class="text-white/60 font-medium">团队协作，挑战任务，赢取积分，登上排行榜！</p>
      </div>

      <!-- 3. 游戏挑战 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pb-4">

        <!-- The Final Night (Detective) -->
        <div class="bg-[#111218] rounded-2xl border border-white/5 p-6 flex flex-col hover:border-yellow-500/30 transition-all">
          <div class="h-32 relative flex items-center justify-center mb-4">
            <span class="text-6xl">🔍</span>
          </div>
          <h3 class="font-bold text-lg text-white mb-2">The Final Night 终极密室</h3>
          <p class="text-xs text-white/50 mb-6 flex-1">
            侦探悬疑游戏。团队通过扫描营地各处的 QR 码 / NFC 标签解锁 5 个阶段的线索，每个线索揭晓前需完成小游戏挑战。
            Scan QR codes / NFC tags around camp to unlock clues across 5 stages. Each clue is gated behind a mini-game challenge.
          </p>
          <NuxtLink
            to="/detective-report"
            class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-yellow-500 text-black text-sm font-bold hover:bg-yellow-400 transition-colors"
          >
            ✍️ 提交最终报告 / Submit Final Report
          </NuxtLink>
        </div>

        <!-- AI City -->
        <div class="bg-[#111218] rounded-2xl border border-white/5 p-6 flex flex-col hover:border-yellow-500/30 transition-all">
          <div class="h-32 relative flex items-center justify-center mb-4">
            <span class="text-6xl">🤖</span>
          </div>
          <h3 class="font-bold text-lg text-white mb-2">AI City 人工智能城市</h3>
          <p class="text-xs text-white/50 mb-6 flex-1">
            团队治理一座新城市。第一阶段：决定是否部署 5 种 AI 系统。第二阶段：在 6 个任务站完成挑战赚取代币。
            Your team governs a city. Phase 1: decide whether to deploy 5 AI systems. Phase 2: complete 6 mission stations to earn tokens.
          </p>
          <p class="text-xs text-white/40 border-t border-white/5 pt-4">
            在营地现场跟随主持人参与，分数由工作人员现场记录。
            <br>Played in person at camp, led by facilitators — scores are recorded live by staff.
          </p>
        </div>

      </div>

      <!-- 2. 团队积分榜 -->
      <div class="bg-[#111218]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-6 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-yellow-500/10 blur-[100px] pointer-events-none"></div>
        
        <div class="flex items-start justify-between mb-12 relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30">
              <Trophy class="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 class="font-black text-2xl text-white tracking-wide">团队积分榜</h2>
              <p class="text-xs text-white/50 mt-1">实时更新，每 30 秒会更新</p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE
          </div>
        </div>

        <!-- 领奖台 -->
        <div v-if="sortedTeams.length > 0" class="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 mb-12 relative z-10">
          <!-- 第二名 -->
          <div v-if="sortedTeams[1]" class="order-2 md:order-1 w-full md:w-[30%] bg-gradient-to-b from-[#1a1c29] to-[#111218] border border-gray-400/30 rounded-2xl p-6 relative flex flex-col items-center text-center pt-12">
            <div class="absolute -top-4 left-6 w-8 h-10 bg-gradient-to-b from-gray-300 to-gray-500 flex items-center justify-center font-bold text-black clip-ribbon shadow-lg">2</div>
            <Shield class="w-8 h-8 text-gray-400 mb-3" />
            <h3 class="text-lg font-bold text-white">{{ sortedTeams[1].name }}</h3>
            <p class="text-3xl font-black text-gray-300 mb-4">{{ sortedTeams[1].totalScore }} <span class="text-[10px] font-normal text-white/40">PTS</span></p>
            <div class="w-full border-t border-white/5 pt-4 mt-auto">
              <div class="flex flex-wrap justify-center gap-1.5 max-h-[70px] overflow-y-auto custom-scrollbar">
                <span v-for="(score, name) in sortedTeams[1].gameScores" :key="name" class="inline-flex text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                  {{ name }}: <span :class="score < 0 ? 'text-red-400' : 'text-gray-300'">{{ score > 0 ? '+'+score : score }}</span>
                </span>
              </div>
            </div>
          </div>
          <!-- 第一名 -->
          <div v-if="sortedTeams[0]" class="order-1 md:order-2 w-full md:w-[35%] bg-gradient-to-b from-[#2a2215] to-[#111218] border border-yellow-500/50 rounded-2xl p-6 relative flex flex-col items-center text-center z-20 md:-translate-y-4 pt-14">
            <div class="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-14 bg-gradient-to-b from-yellow-300 to-yellow-600 flex items-center justify-center font-black text-xl text-black clip-ribbon-center shadow-lg shadow-yellow-500/50">1</div>
            <Crown class="w-12 h-12 text-yellow-500 mb-4" />
            <h3 class="text-2xl font-black text-white">{{ sortedTeams[0].name }}</h3>
            <p class="text-5xl font-black text-yellow-500 mb-6">{{ sortedTeams[0].totalScore }} <span class="text-xs font-normal text-white/60">PTS</span></p>
            <div class="w-full border-t border-yellow-500/20 pt-5 mt-auto">
              <div class="flex flex-wrap justify-center gap-1.5 max-h-[90px] overflow-y-auto custom-scrollbar">
                <span v-for="(score, name) in sortedTeams[0].gameScores" :key="name" class="inline-flex text-[10px] px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-white/80">
                  {{ name }}: <span :class="score < 0 ? 'text-red-400' : 'text-yellow-400'">{{ score > 0 ? '+'+score : score }}</span>
                </span>
              </div>
            </div>
          </div>
          <!-- 第三名 -->
          <div v-if="sortedTeams[2]" class="order-3 w-full md:w-[30%] bg-gradient-to-b from-[#241a16] to-[#111218] border border-orange-700/50 rounded-2xl p-6 relative flex flex-col items-center text-center pt-12">
            <div class="absolute -top-4 right-6 w-8 h-10 bg-gradient-to-b from-orange-400 to-orange-700 flex items-center justify-center font-bold text-black clip-ribbon shadow-lg">3</div>
            <Shield class="w-8 h-8 text-orange-500 mb-3" />
            <h3 class="text-lg font-bold text-white">{{ sortedTeams[2].name }}</h3>
            <p class="text-3xl font-black text-orange-500 mb-4">{{ sortedTeams[2].totalScore }} <span class="text-[10px] font-normal text-white/40">PTS</span></p>
            <div class="w-full border-t border-white/5 pt-4 mt-auto">
              <div class="flex flex-wrap justify-center gap-1.5 max-h-[70px] overflow-y-auto custom-scrollbar">
                <span v-for="(score, name) in sortedTeams[2].gameScores" :key="name" class="inline-flex text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                  {{ name }}: <span :class="score < 0 ? 'text-red-400' : 'text-orange-400'">{{ score > 0 ? '+'+score : score }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 排名 4+ -->
        <div v-if="sortedTeams.length > 3" class="space-y-3 pt-6 border-t border-white/10 relative z-10">
          <div v-for="(team, i) in sortedTeams.slice(3)" :key="team.id" class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#1a1b23]/50 border border-white/5">
            <div class="flex items-center gap-4 w-full md:w-[200px]">
              <span class="text-xl font-bold text-white/30 w-6 text-center">{{ i + 4 }}</span>
              <span class="font-bold text-white text-sm">{{ team.name }}</span>
            </div>
            <div class="flex-1 flex flex-wrap gap-1.5">
              <span v-for="(score, name) in team.gameScores" :key="name" class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/60">
                {{ name }}: <span class="text-yellow-500 font-bold">{{ score > 0 ? '+'+score : score }}</span>
              </span>
            </div>
            <div class="text-right"><span class="text-xl font-black text-yellow-500">{{ team.totalScore }}</span><span class="text-[10px] text-white/30 ml-1">PTS</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'
import { Trophy, Shield, Crown } from 'lucide-vue-next'

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
    .map(doc => ({ id: doc.id, name: doc.teamName || doc.id, gameScores: doc.scores || {}, totalScore: doc.totalScore || 0 }))
    .sort((a, b) => b.totalScore - a.totalScore)
})

onUnmounted(() => { if (unsubscribeScores) unsubscribeScores() })
</script>

<style scoped>
.mask-image-b { mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%); }
.clip-ribbon { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%); }
.clip-ribbon-center { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
</style>