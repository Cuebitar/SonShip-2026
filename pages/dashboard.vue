<template>
  <div class="page-container bg-dark min-h-screen p-4 md:p-8 text-white/80 font-sans selection:bg-yellow-500/30">
    <div class="max-w-[1400px] mx-auto space-y-6">
      
      <!-- ==================== 1. HERO BANNER ==================== -->
      <div class="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#15161c]">
        <div class="absolute inset-0 bg-cover bg-center transition-opacity ease-in-out mix-blend-screen" :class="isBackgroundVisible ? 'opacity-60' : 'opacity-0'" :style="{ backgroundImage: `url(${currentBg})`, transitionDuration: '1400ms' }"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#111216] via-[#111216]/60 to-[#111216]/40"></div>
        
        <div class="relative z-10 flex flex-col xl:flex-row justify-between p-6 md:p-10 gap-8">
          <div class="flex flex-col justify-center mt-12 lg:mt-20">
            <p class="text-white/60 mb-1">Good Morning,</p>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight flex flex-wrap items-center gap-3">
              <span>{{ auth.user?.name || 'Camper' }}</span>
              <span class="wave pb-1">👋</span>
            </h1>
            <p class="text-white/50 text-sm mb-6">Welcome back! Ready for a blessed day?</p>
            
            <div class="flex flex-wrap gap-3 mb-6">
              <span class="flex items-center gap-2 border border-yellow-500/30 text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-lg text-sm font-semibold"><Users class="w-4 h-4" /> {{ auth.user?.group }}</span>
            </div>

            <div class="inline-flex items-center gap-2 font-bold text-lg mb-3 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-2 rounded-xl w-fit">
              <Flame class="w-5 h-5 text-yellow-500" /> <span class="text-yellow-500">SonShip Camp 2026</span>
            </div>
          </div>

          <div class="xl:w-[400px] w-full bg-[#1a1b23]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col justify-center shadow-xl">
            <div class="flex justify-between items-center mb-6 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
              <div>
                <h3 class="font-bold flex items-center gap-2 mb-0.5 text-yellow-500"><Sun class="w-5 h-5" /> DAY 1</h3>
                <p class="text-yellow-500/60 text-xs">Registration begins in</p>
              </div>
              <Send class="w-6 h-6 text-yellow-500 opacity-80" />
            </div>

            <div class="flex items-center justify-center gap-6 text-3xl font-bold text-white mb-8 w-full">
              <div class="flex flex-col items-center"><span>{{ countdown.hrs }}</span><span class="text-[10px] text-white/40 font-normal mt-1">HRS</span></div>
              <span class="text-white/20 -mt-5">:</span>
              <div class="flex flex-col items-center"><span>{{ countdown.mins }}</span><span class="text-[10px] text-white/40 font-normal mt-1">MINS</span></div>
              <span class="text-white/20 -mt-5">:</span>
              <div class="flex flex-col items-center"><span>{{ countdown.secs }}</span><span class="text-[10px] text-white/40 font-normal mt-1">SECS</span></div>
            </div>

            <NuxtLink to="/schedule" class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all">
              View Today's Schedule <ChevronRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ==================== 2. STATS ROW ==================== -->
     <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-[#15161c] border border-white/5 rounded-2xl p-5 hover:bg-[#1a1b23] transition-colors flex flex-col justify-between">
            <div class="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-3 py-1.5 rounded-xl mb-4 w-fit">
              <Calendar class="w-4 h-4 text-yellow-500" />
              <span class="text-xs font-bold text-yellow-500">Today's Events</span>
            </div>
            <div>
              <p class="text-3xl font-bold text-white leading-none">{{ todayTotalEvents }}</p>
              <p class="text-[11px] text-white/40 mt-2">Events scheduled</p>
            </div>
          </div>
          
          <div @click="isGroupModalOpen = true" class="bg-[#15161c] border border-white/5 rounded-2xl p-5 hover:border-yellow-500/30 transition-all cursor-pointer group flex flex-col justify-between">
            <div class="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-3 py-1.5 rounded-xl mb-4 w-fit group-hover:bg-yellow-500/20 transition-colors">
              <Users class="w-4 h-4 text-yellow-500" />
              <span class="text-xs font-bold text-yellow-500">Group Members</span>
            </div>
            <div>
              <p class="text-3xl font-bold text-white leading-none">{{ myGroupMembers.length || 0 }}</p>
              <p class="text-[11px] text-yellow-500/70 mt-2 group-hover:text-yellow-500 transition-colors">Click to view team →</p>
            </div>
          </div>

          <!-- Group Modal -->
          <div v-if="isGroupModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1015]/80 backdrop-blur-sm" @click.self="isGroupModalOpen = false">
            <div class="bg-[#15161c] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
              <div class="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <div>
                  <h3 class="text-lg font-bold text-white flex items-center gap-2"><Users class="w-5 h-5 text-yellow-500" /> {{ auth.user?.group || 'My Group' }}</h3>
                  <p class="text-xs text-white/40 mt-1">Your assigned teammates</p>
                </div>
                <button @click="isGroupModalOpen = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">✕</button>
              </div>
              <div class="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <div v-for="member in myGroupMembers" :key="member.id" class="flex items-center gap-3 bg-[#1a1b23] border border-white/5 rounded-xl p-3 hover:border-yellow-500/30 transition-colors">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 text-yellow-500 flex items-center justify-center text-lg shrink-0 border border-yellow-500/20">
                    {{ member.avatar || '👤' }}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-white flex items-center gap-2">
                      {{ member.name || member.fullName }}
                      <span v-if="member.id === auth.user.id" class="text-[9px] font-bold bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>
                    </p>
                    <p v-if="member.gender" class="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">{{ member.gender }}</p>
                  </div>
                </div>
                <div v-if="myGroupMembers.length === 0" class="text-center py-6 text-white/40 text-sm italic">No members found.</div>
              </div>
            </div>
          </div>
        </div>
      
      <!-- ==================== 3. MAIN CONTENT GRID ==================== -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- COLUMN 1: Today's Schedule -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-6 lg:col-span-1 shadow-lg flex flex-col">
          <div class="flex justify-between items-center mb-6 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
            <h2 class="font-bold flex items-center gap-2 text-yellow-500"><Clock class="w-5 h-5" /> Today's Schedule</h2>
            <NuxtLink to="/schedule" class="text-xs text-white/40 hover:text-yellow-500 flex items-center gap-1 transition-colors">
              Full Schedule <ChevronRight class="w-3 h-3" />
            </NuxtLink>
          </div>

          <div v-if="isLoading" class="text-center py-10 text-white/30 text-sm animate-pulse">Loading schedule...</div>
          <div v-else-if="mySchedule.length > 0" class="flex-1 space-y-0 relative">
            <div v-for="(slot, index) in mySchedule" :key="slot.id" class="flex gap-4 group">
              <div class="w-10 pt-4 text-xs font-medium text-white/60 shrink-0 text-right">{{ slot.time }}</div>
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full border-2 border-yellow-500 bg-[#15161c] mt-4 z-10 group-hover:bg-yellow-500 transition-colors"></div>
                <div v-if="index !== mySchedule.length - 1" class="w-px bg-white/10 flex-1 my-1"></div>
              </div>
              <div class="bg-[#1a1b23] border border-white/5 rounded-xl p-3 flex-1 flex items-center gap-3 mb-4 hover:border-yellow-500/30 transition-colors cursor-pointer">
                <div class="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0"><MapPin class="w-5 h-5" /></div>
                <div class="flex-1">
                  <p class="text-sm font-bold text-white">{{ slot.name }}</p>
                  <p class="text-[10px] text-white/40 flex items-center gap-1 mt-0.5"><MapPin class="w-3 h-3" /> {{ slot.notes || 'Main Hall' }}</p>
                </div>
                <span class="text-[9px] uppercase border border-green-500/30 text-green-500 px-2 py-0.5 rounded-full shrink-0">Upcoming</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 text-white/30 text-sm">No events scheduled.</div>
        </div>
      </div>

      <!-- ==================== 4. BOTTOM ROW ==================== -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Bottom Banner -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl lg:col-span-2 overflow-hidden relative flex flex-col justify-end min-h-[140px] shadow-lg">
          <div class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen" style="background-image: url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2000&auto=format&fit=crop');"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#111216] to-transparent"></div>
          
          <div class="relative z-10 p-6 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div>
               <div class="inline-flex items-center gap-2 mb-3 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-2 rounded-xl w-fit">
                 <Flame class="w-5 h-5 text-yellow-500" /> <span class="font-bold text-yellow-500">SonShip Camp 2026</span>
               </div>
               
               <div class="flex flex-wrap gap-6 pl-1">
                 <div>
                   <p class="text-white text-sm font-semibold flex items-center gap-1.5"><Calendar class="w-4 h-4 text-red-400"/> Aug 28 – 31, 2026</p>
                   <p class="text-[10px] text-white/50 mt-1">4 Days 3 Nights</p>
                 </div>
                 <div>
                   <p class="text-white text-sm font-semibold flex items-center gap-1.5"><MapPin class="w-4 h-4 text-green-400"/> Nature Retreat Centre</p>
                   <p class="text-[10px] text-white/50 mt-1">Selangor</p>
                 </div>
                 <div>
                   <p class="text-white text-sm font-semibold flex items-center gap-1.5"><Users class="w-4 h-4 text-purple-400"/> Expect Great Things</p>
                   <p class="text-[10px] text-white/50 mt-1">See you at camp!</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Quick Access -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-6 lg:col-span-1 shadow-lg">
          <div class="flex justify-between items-center mb-4 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
            <h2 class="font-bold flex items-center gap-2 text-yellow-500"><Zap class="w-5 h-5" /> Quick Access</h2>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink to="/games" class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Gamepad2 class="w-4 h-4 text-blue-400 group-hover:text-yellow-500 transition-colors" /><span class="text-xs text-white/70 group-hover:text-white">Games</span>
            </NuxtLink>
            <NuxtLink to="/profile" class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <User class="w-4 h-4 text-blue-400 group-hover:text-yellow-500 transition-colors" /><span class="text-xs text-white/70 group-hover:text-white">My Profile</span>
            </NuxtLink>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Map class="w-4 h-4 text-green-400 group-hover:text-yellow-500 transition-colors" /><span class="text-xs text-white/70 group-hover:text-white">Camp Map</span>
            </button>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Image class="w-4 h-4 text-green-400 group-hover:text-yellow-500 transition-colors" /><span class="text-xs text-white/70 group-hover:text-white">Gallery</span>
            </button>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <BookOpen class="w-4 h-4 text-purple-400 group-hover:text-yellow-500 transition-colors" /><span class="text-xs text-white/70 group-hover:text-white">Devotion</span>
            </button>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Gift class="w-4 h-4 text-red-400 group-hover:text-yellow-500 transition-colors" /><span class="text-xs text-white/70 group-hover:text-white">Secret Angel</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ==================== 5. CAMP GUIDELINES (展开的静态注意事项) ==================== -->
      <div class="bg-[#15161c] border border-yellow-500/20 rounded-2xl p-6 md:p-8 shadow-[0_0_15px_rgba(234,179,8,0.05)] mt-6">
        
        <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <div class="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <AlertTriangle class="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-white tracking-wide">營會注意事項</h2>
            <p class="text-xs text-white/50 mt-1">Please read the camp guidelines carefully</p>
          </div>
        </div>
        
        <!-- 卡片式网格排版 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <IdCard class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">請 <strong class="text-yellow-500 font-bold">全程配戴名牌</strong> (含休息時間)，並妥善保管入場憑證。</p>
          </div>
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <Ban class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">除白開水與用餐外，會場內 <strong class="text-yellow-500 font-bold">禁止飲食</strong>。請於指定空間用餐。</p>
          </div>
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <UtensilsCrossed class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">特會 <strong class="text-yellow-500 font-bold">無提供學員餐點</strong>，請各教會與學員自行安排午、晚餐。</p>
          </div>
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <DoorClosed class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">各場地及教室開放狀況請以大會公布為主，<strong class="text-yellow-500 font-bold">請勿擅自闖入</strong>。</p>
          </div>
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <Smartphone class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">聚會中請將手機調成 <strong class="text-yellow-500 font-bold">靜音模式</strong>，請勿對內容進行錄音錄影。</p>
          </div>
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <Users class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">特會進行中，<strong class="text-yellow-500 font-bold">請勿打擾節目執行人員</strong> (燈光、音響等)。</p>
          </div>
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <ArrowUpSquare class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">請學員 <strong class="text-yellow-500 font-bold">多走樓梯</strong>，電梯保留給行動不便、年長者等需求用。</p>
          </div>
          <div class="flex items-start gap-3 bg-[#1a1b23] p-4 rounded-xl border border-white/5">
            <Clock class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p class="text-sm text-white/80 leading-snug">聚會進場時間及會場使用狀況 <strong class="text-yellow-500 font-bold">依大會現場公布為主</strong>。</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCampersStore } from '~/stores/campers'
import { collection, getDocs } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'
import firecamp from '~/assets/background/campFire.jpg'

import { 
  AlertTriangle, IdCard, Ban, UtensilsCrossed, DoorClosed, 
  Smartphone, ArrowUpSquare, Calendar, Users, Heart, Megaphone, Clock, MapPin, 
  ChevronRight, Flame, Ticket, Sun, Send, Zap,
  Gamepad2, User, Map, Image, BookOpen, Gift 
} from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()

const hasMounted = ref(false)
const isLoading = ref(true)
const currentBg = ref(firecamp) 
const isBackgroundVisible = ref(true)

const countdown = ref({ hrs: '00', mins: '00', secs: '00' })
let timer = null;

const announcements = ref([])
const dbSchedules = ref([])
const readAnnouncements = ref([])

const unreadCount = computed(() => {
  return announcements.value.filter(a => !readAnnouncements.value.includes(a.id)).length
})

const currentCampDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const todayStr = `${year}-${month}-${day}`

  const campDates = ['2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31']
  
  if (campDates.includes(todayStr)) return todayStr
  if (now.getTime() < new Date('2026-08-28').getTime()) return '2026-08-28'
  return '2026-08-31'
})

const todayTotalEvents = computed(() => {
  return dbSchedules.value.filter(s => s.date === currentCampDate.value).length
})

const angelTarget = computed(() => {
  if (!auth.user) return null
  return campersStore.getCamperById(auth.user.secret_angel_id)
})

const mySchedule = computed(() => {
  const now = new Date().getTime()

  let upcoming = dbSchedules.value.filter(s => {
    const eventTime = new Date(`${s.date}T${s.time}`).getTime()
    return eventTime >= now - (60 * 60 * 1000) 
  })

  if (upcoming.length === 0 && dbSchedules.value.length > 0) {
    upcoming = dbSchedules.value.slice(-3)
  }

  return upcoming.slice(0, 3).map(s => ({
    id: s.id,
    time: s.time,
    name: s.name || s.title || 'Untitled Event', 
    day: s.date,
    notes: s.notes || '' 
  }))
})

const isGroupModalOpen = ref(false)

const myGroupMembers = computed(() => {
  if (!auth.user || !auth.user.group || !campersStore.campers) return []
  let members = campersStore.campers.filter(c => c.group === auth.user.group)
  members.sort((a, b) => {
    if (a.id === auth.user.id) return -1
    if (b.id === auth.user.id) return 1
    return 0
  })
  return members
})

function timeAgo(timestamp, fallbackDate, short = false) {
  if (!timestamp) return fallbackDate || '';
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  if (seconds < 60) return short ? 'now' : 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return short ? `${minutes}m ago` : `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return short ? `${hours}h ago` : `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return short ? `${days}d ago` : `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function markAsRead(id) {
  if (!readAnnouncements.value.includes(id)) {
    readAnnouncements.value.push(id)
    localStorage.setItem(`read_announcements_${auth.user?.id}`, JSON.stringify(readAnnouncements.value))
  }
}

function processAnnouncements(data) {
  const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
  const nowTime = Date.now();
  let valid = data.filter(ann => {
    const annTime = ann.createdAt || (ann.date ? new Date(ann.date).getTime() : 0);
    return (nowTime - annTime) <= TWO_DAYS_MS;
  });
  valid.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  announcements.value = valid.slice(0, 3)
}

function processSchedules(data) {
  data.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
  dbSchedules.value = data
}

function startCountdown() {
  const targetDate = new Date('2026-08-28T14:00:00').getTime();
  timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) {
      clearInterval(timer);
      countdown.value = { hrs: '00', mins: '00', secs: '00' };
      return;
    }
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdown.value = {
      hrs: hours.toString().padStart(2, '0'),
      mins: minutes.toString().padStart(2, '0'),
      secs: seconds.toString().padStart(2, '0')
    };
  }, 1000);
}

onMounted(async () => {
  const db = useDb()
  const storedRead = localStorage.getItem(`read_announcements_${auth.user?.id}`)
  if (storedRead) readAnnouncements.value = JSON.parse(storedRead)

  const cachedAnn = localStorage.getItem('cache_announcements')
  const cachedSched = localStorage.getItem('cache_schedules')
  
  if (cachedAnn && cachedSched) {
    processAnnouncements(JSON.parse(cachedAnn))
    processSchedules(JSON.parse(cachedSched))
    isLoading.value = false 
  }
  
  startCountdown()

  if (db) {
    try {
      const [annSnap, schedSnap] = await Promise.all([
        getDocs(collection(db, "announcements")),
        getDocs(collection(db, "schedules"))
      ])
      const fetchedAnnouncements = annSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const fetchedSchedules = schedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      localStorage.setItem('cache_announcements', JSON.stringify(fetchedAnnouncements))
      localStorage.setItem('cache_schedules', JSON.stringify(fetchedSchedules))

      processAnnouncements(fetchedAnnouncements)
      processSchedules(fetchedSchedules)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      isLoading.value = false
      hasMounted.value = true
    }
  } else {
    isLoading.value = false
    hasMounted.value = true
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 179, 8, 0.5); }

.wave { display: inline-block; animation: wave-animation 2.5s infinite; transform-origin: 70% 70%; }
@keyframes wave-animation {
  0% { transform: rotate( 0.0deg) } 10% { transform: rotate(14.0deg) } 20% { transform: rotate(-8.0deg) }
  30% { transform: rotate(14.0deg) } 40% { transform: rotate(-4.0deg) } 50% { transform: rotate(10.0deg) }
  60% { transform: rotate( 0.0deg) } 100% { transform: rotate( 0.0deg) }
}
</style>