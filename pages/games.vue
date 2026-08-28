<template>
  <div class="page-container bg-[#0a0a0d] min-h-screen text-white pb-20 font-sans">
    
    <!-- 背景氛围 -->
    <div class="absolute top-0 left-0 w-full h-[500px] bg-[url('~/assets/background/campFire.jpg')] bg-cover bg-center opacity-20 pointer-events-none mask-image-b"></div>
    <div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0a0a0d]/50 via-[#0a0a0d]/80 to-[#0a0a0d] pointer-events-none"></div>

    <div class="container-inner relative z-10 py-12">
      
      <!-- 1. 页面标题 -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-3 tracking-wide">
          {{ t('games.page_title') }}
        </h1>
        <p class="text-white/60 font-medium">{{ t('games.page_subtitle') }}</p>
      </div>

      <!-- 2. 侦探报告入口 (由 admin/games/detective.vue 的 Report Submission 开关控制) -->
      <NuxtLink
        v-if="detectiveReportsOpen"
        to="/detective-report"
        class="group flex items-center justify-between gap-4 bg-gradient-to-r from-red-950/40 to-[#111218]/80 backdrop-blur-xl rounded-2xl border border-red-500/20 p-5 md:p-6 mb-10 shadow-xl hover:border-red-500/40 transition-all"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-2xl shrink-0">🔍</div>
          <div>
            <h3 class="font-black text-lg text-white">{{ t('games.detective_entry_title') }}</h3>
            <p class="text-xs text-white/50">{{ t('games.detective_entry_hint') }}</p>
          </div>
        </div>
        <span class="shrink-0 px-4 py-2 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 group-hover:bg-red-500/30 transition-all">
          {{ t('games.detective_entry_button') }} →
        </span>
      </NuxtLink>

      <!-- 3. 团队积分榜 -->
      <div class="bg-[#111218]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-6 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-yellow-500/10 blur-[100px] pointer-events-none"></div>
        
        <div class="flex items-start justify-between mb-12 relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30">
              <Trophy class="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 class="font-black text-2xl text-white tracking-wide">{{ t('games.team_leaderboard') }}</h2>
              <p class="text-xs text-white/50 mt-1">{{ t('games.live_update_hint') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {{ t('games.live_badge') }}
          </div>
        </div>

        <!-- 领奖台 -->
        <div v-if="sortedTeams.length > 0" class="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 mb-12 relative z-10">
          <!-- 第二名 -->
          <div v-if="sortedTeams[1]" class="order-2 md:order-1 w-full md:w-[30%] bg-gradient-to-b from-[#1a1c29] to-[#111218] border border-gray-400/30 rounded-2xl p-6 relative flex flex-col items-center text-center pt-12">
            <div class="absolute -top-4 left-6 w-8 h-10 bg-gradient-to-b from-gray-300 to-gray-500 flex items-center justify-center font-bold text-black clip-ribbon shadow-lg">2</div>
            <Shield class="w-8 h-8 text-gray-400 mb-3" />
            <h3 class="text-lg font-bold text-white">{{ sortedTeams[1].name }}</h3>
            <p class="text-3xl font-black text-gray-300 mb-4">{{ sortedTeams[1].totalScore }} <span class="text-[10px] font-normal text-white/40">{{ t('games.pts') }}</span></p>
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
            <p class="text-5xl font-black text-yellow-500 mb-6">{{ sortedTeams[0].totalScore }} <span class="text-xs font-normal text-white/60">{{ t('games.pts') }}</span></p>
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
            <p class="text-3xl font-black text-orange-500 mb-4">{{ sortedTeams[2].totalScore }} <span class="text-[10px] font-normal text-white/40">{{ t('games.pts') }}</span></p>
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
            <div class="text-right"><span class="text-xl font-black text-yellow-500">{{ team.totalScore }}</span><span class="text-[10px] text-white/30 ml-1">{{ t('games.pts') }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'
import { Trophy, Shield, Crown } from 'lucide-vue-next'

const { t } = useI18n()
const firebaseScores = ref([])
const detectiveReportsOpen = ref(true)
let unsubscribeScores = null
let unsubscribeDetectiveState = null

onMounted(() => {
  const db = useDb()
  if (db) {
    unsubscribeScores = onSnapshot(collection(db, "game_scores"), (snap) => {
      firebaseScores.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
    unsubscribeDetectiveState = onSnapshot(doc(db, 'game_state', 'detective'), (snap) => {
      detectiveReportsOpen.value = snap.exists() ? snap.data().reportsOpen !== false : true
    })
  }
})

const sortedTeams = computed(() => {
  return firebaseScores.value
    .map(doc => ({ id: doc.id, name: doc.teamName || doc.id, gameScores: doc.scores || {}, totalScore: doc.totalScore || 0 }))
    .sort((a, b) => b.totalScore - a.totalScore)
})

onUnmounted(() => {
  if (unsubscribeScores) unsubscribeScores()
  if (unsubscribeDetectiveState) unsubscribeDetectiveState()
})
</script>

<style scoped>
.mask-image-b { mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%); }
.clip-ribbon { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%); }
.clip-ribbon-center { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
</style>