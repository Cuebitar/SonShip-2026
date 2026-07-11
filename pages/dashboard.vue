<template>
  <div class="page-container bg-[#0f1015] min-h-screen p-4 md:p-8 text-white/80 font-sans selection:bg-yellow-500/30">
    <div class="max-w-[1400px] mx-auto space-y-6">
      
      <!-- ==================== 1. HERO BANNER ==================== -->
      <div class="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[#15161c]">
        
        <!-- Background gradient 动态背景 -->
        <div
          class="absolute inset-0 bg-cover bg-center transition-opacity ease-in-out mix-blend-screen"
          :class="isBackgroundVisible ? 'opacity-60' : 'opacity-0'"
          :style="{ backgroundImage: `url(${currentBg})`, transitionDuration: '1400ms' }"
        ></div>
        
        <!-- 渐变遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#111216] via-[#111216]/60 to-[#111216]/40"></div>
        
        <div class="relative z-10 flex flex-col xl:flex-row justify-between p-8 md:p-10 gap-8">
          <!-- Left Info -->
          <div class="flex flex-col justify-center">
            <p class="text-white/60 mb-1">Good Morning,</p>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              {{ auth.user?.name || 'Camper' }} <span class="wave">👋</span>
            </h1>
            <p class="text-white/50 text-sm mb-6">Welcome back! Ready for a blessed day?</p>
            
            <!-- Badges -->
            <div class="flex flex-wrap gap-3 mb-6">
              <span class="flex items-center gap-2 border border-yellow-500/30 text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-lg text-sm font-semibold">
                <Users class="w-4 h-4" /> {{ auth.user?.group }}
              </span>
              <span class="flex items-center gap-2 border border-yellow-500/30 text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-lg text-sm font-semibold">
                <Ticket class="w-4 h-4" /> Camp Code: {{ auth.user?.campCode}}
              </span>
            </div>

            <!-- Camp Info (Yellow Container) -->
            <div class="inline-flex items-center gap-2 font-bold text-lg mb-3 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-2 rounded-xl w-fit">
              <Flame class="w-5 h-5 text-yellow-500" /> 
              <span class="text-yellow-500">SonShip Camp 2026</span>
            </div>
            <div class="flex flex-col gap-1 text-xs text-white/50 pl-1">
              <p class="flex items-center gap-2"><Calendar class="w-4 h-4" /> August 28 – 31, 2026</p>
              <p class="flex items-center gap-2"><MapPin class="w-4 h-4" /> Nature Retreat Centre, Selangor</p>
            </div>
          </div>

          <!-- Right: Countdown Card -->
          <div class="xl:w-[400px] bg-[#1a1b23]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col justify-center shadow-xl">
            <!-- 标题 Container (Yellow) -->
            <div class="flex justify-between items-center mb-6 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
               <div>
                 <h3 class="font-bold flex items-center gap-2 mb-0.5 text-yellow-500">
                   <Sun class="w-5 h-5" /> DAY 1
                 </h3>
                 <p class="text-yellow-500/60 text-xs">Registration begins in</p>
               </div>
               <Send class="w-6 h-6 text-yellow-500 opacity-80" />
            </div>

            <div class="flex items-center gap-4 text-3xl font-bold text-white mb-8 px-2">
              <div class="flex flex-col items-center">
                <span>{{ countdown.hrs }}</span>
                <span class="text-[10px] text-white/40 font-normal mt-1">HRS</span>
              </div>
              <span class="text-white/20 -mt-5">:</span>
              <div class="flex flex-col items-center">
                <span>{{ countdown.mins }}</span>
                <span class="text-[10px] text-white/40 font-normal mt-1">MINS</span>
              </div>
              <span class="text-white/20 -mt-5">:</span>
              <div class="flex flex-col items-center">
                <span>{{ countdown.secs }}</span>
                <span class="text-[10px] text-white/40 font-normal mt-1">SECS</span>
              </div>
            </div>

            <NuxtLink to="/schedule" class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all">
              View Today's Schedule <ChevronRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ==================== 2. STATS ROW ==================== -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Stat 1 -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#1a1b23] transition-colors">
          <div class="w-12 h-12 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 flex items-center justify-center shrink-0">
            <Calendar class="w-5 h-5" />
          </div>
          <div>
            <p class="text-white/40 text-xs mb-0.5">Today's Events</p>
            <p class="text-xl font-bold text-white leading-none">{{ todayTotalEvents }}</p>
            <p class="text-[10px] text-white/30 mt-1">Events scheduled</p>
          </div>
        </div>
        
        <!-- Stat 2 -->
        <div @click="isGroupModalOpen = true" class="bg-[#15161c] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#1a1b23] transition-colors cursor-pointer group">
          <div class="w-12 h-12 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-500/10 transition-colors">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <p class="text-white/40 text-xs mb-0.5">Group Members</p>
            <p class="text-xl font-bold text-white leading-none">{{ myGroupMembers.length || 0 }}</p>
            <p class="text-[10px] text-white/30 mt-1">Click to view team</p>
          </div>
        </div>

        <!-- ==================== 队友列表弹窗 (Group Modal) ==================== -->
        <div v-if="isGroupModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1015]/80 backdrop-blur-sm" @click.self="isGroupModalOpen = false">
          <div class="bg-[#15161c] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
            <div class="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <Users class="w-5 h-5 text-purple-400" /> {{ auth.user?.group || 'My Group' }}
                </h3>
                <p class="text-xs text-white/40 mt-1">Your assigned teammates</p>
              </div>
              <button @click="isGroupModalOpen = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            
            <div class="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
              <div v-for="member in myGroupMembers" :key="member.id" class="flex items-center gap-3 bg-[#1a1b23] border border-white/5 rounded-xl p-3 hover:border-purple-500/30 transition-colors">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 flex items-center justify-center text-lg shrink-0 border border-white/5">
                  {{ member.avatar || '👤' }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-bold text-white flex items-center gap-2">
                    {{ member.name || member.fullName }}
                    <span v-if="member.id === auth.user.id" class="text-[9px] font-bold bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      You
                    </span>
                  </p>
                  <p v-if="member.gender" class="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">{{ member.gender }}</p>
                </div>
              </div>
              <div v-if="myGroupMembers.length === 0" class="text-center py-6 text-white/40 text-sm italic">
                No members found in your group.
              </div>
            </div>
          </div>
        </div>

        <!-- Stat 3 -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#1a1b23] transition-colors">
          <div class="w-12 h-12 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 flex items-center justify-center shrink-0">
            <Heart class="w-5 h-5" />
          </div>
          <div>
            <p class="text-white/40 text-xs mb-0.5">Secret Angel</p>
            <p class="text-lg font-bold text-white leading-none">Assigned</p>
            <p class="text-[10px] text-white/30 mt-1">Reveal on Night 1</p>
          </div>
        </div>

        <!-- Stat 4 -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#1a1b23] transition-colors">
          <div class="w-12 h-12 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 flex items-center justify-center shrink-0">
            <Megaphone class="w-5 h-5" />
          </div>
          <div>
            <p class="text-white/40 text-xs mb-0.5">Announcements</p>
            <p class="text-xl font-bold text-white leading-none">{{ unreadCount }}</p>
            <p class="text-[10px] text-white/30 mt-1">Unread updates</p>
          </div>
        </div>
      </div>

      <!-- ==================== 3. MAIN CONTENT GRID ==================== -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- COLUMN 1: Today's Schedule -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-6 lg:col-span-1 shadow-lg flex flex-col">
          <!-- 标题 Container (Yellow) -->
          <div class="flex justify-between items-center mb-6 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
            <h2 class="font-bold flex items-center gap-2 text-yellow-500">
              <Clock class="w-5 h-5" /> Today's Schedule
            </h2>
            <NuxtLink to="/schedule" class="text-xs text-white/40 hover:text-yellow-500 flex items-center gap-1 transition-colors">
              Full Schedule <ChevronRight class="w-3 h-3" />
            </NuxtLink>
          </div>

          <div v-if="isLoading" class="text-center py-10 text-white/30 text-sm animate-pulse">
            Loading schedule...
          </div>
          <div v-else-if="mySchedule.length > 0" class="flex-1 space-y-0 relative">
            <div v-for="(slot, index) in mySchedule" :key="slot.id" class="flex gap-4 group">
              <div class="w-10 pt-4 text-xs font-medium text-white/60 shrink-0 text-right">{{ slot.time }}</div>
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full border-2 border-yellow-500 bg-[#15161c] mt-4 z-10 group-hover:bg-yellow-500 transition-colors"></div>
                <div v-if="index !== mySchedule.length - 1" class="w-px bg-white/10 flex-1 my-1"></div>
              </div>
              <div class="bg-[#1a1b23] border border-white/5 rounded-xl p-3 flex-1 flex items-center gap-3 mb-4 hover:border-yellow-500/30 transition-colors cursor-pointer">
                <div class="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <MapPin class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-bold text-white">{{ slot.name }}</p>
                  <p class="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                    <MapPin class="w-3 h-3" /> {{ slot.notes || 'Main Hall' }}
                  </p>
                </div>
                <span class="text-[9px] uppercase border border-green-500/30 text-green-500 px-2 py-0.5 rounded-full shrink-0">Upcoming</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 text-white/30 text-sm">No events scheduled.</div>
        </div>

        <!-- COLUMN 2: Secret Angel -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-6 lg:col-span-1 shadow-lg relative overflow-hidden flex flex-col group">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/10 blur-[80px] rounded-full"></div>
          
          <!-- 标题 Container (Yellow) -->
          <div class="flex justify-center items-center mb-6 relative z-10 w-full bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
            <h2 class="font-bold flex items-center gap-2 text-yellow-500">
              <Heart class="w-5 h-5 text-red-400" /> Secret Angel
            </h2>
          </div>
          
          <div class="flex-1 flex flex-col items-center justify-center text-center relative z-10">
            <div class="text-7xl mb-4 filter drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:scale-110 transition-transform duration-500">
              🎁
            </div>
            
            <h3 class="text-lg font-bold text-white mb-2">Your secret angel<br>has been assigned!</h3>
            <p class="text-xs text-white/50 mb-6">Reveal after the first<br>night of camp.</p>
            
            <div class="relative w-full">
              <button class="w-full border border-yellow-500 text-yellow-500 py-2.5 rounded-lg text-sm font-semibold hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center gap-2 group-hover:opacity-0 absolute inset-0">
                Hover to Reveal 👀
              </button>
              <div class="w-full bg-[#1a1b23] border border-yellow-500/30 py-2.5 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <span class="text-white">{{ angelTarget?.name || 'Loading...' }}</span>
                <span class="text-[10px] text-yellow-500">{{ angelTarget?.group || 'Secret Group' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN 3: Announcements -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl p-6 lg:col-span-1 shadow-lg flex flex-col">
          <!-- 标题 Container (Yellow) -->
          <div class="flex justify-between items-center mb-6 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
            <h2 class="font-bold flex items-center gap-2 text-yellow-500">
              <Megaphone class="w-5 h-5 text-red-400" /> Announcements
            </h2>
            <button class="text-xs text-white/40 hover:text-yellow-500 flex items-center gap-1 transition-colors">
              View All <ChevronRight class="w-3 h-3" />
            </button>
          </div>

          <div v-if="isLoading" class="text-center py-10 text-white/30 text-sm animate-pulse">
            Checking updates...
          </div>
          <div v-else-if="announcements.length > 0" class="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="(ann, index) in announcements" :key="ann.id" @click="markAsRead(ann.id)"
                 class="bg-[#1a1b23] border border-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors flex items-start gap-3">
              <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" 
                   :class="index % 3 === 0 ? 'bg-red-500' : index % 3 === 1 ? 'bg-blue-500' : 'bg-yellow-500'">
              </div>
              <div class="flex-1">
                <p class="text-sm text-white/90 font-medium mb-1 line-clamp-2" :class="readAnnouncements.includes(ann.id) ? 'opacity-60' : ''">
                  {{ ann.title }}
                </p>
                <p class="text-xs text-white/40 line-clamp-1">{{ ann.description }}</p>
              </div>
              <span class="text-[10px] text-white/30 shrink-0 mt-0.5">
                {{ timeAgo(ann.createdAt, ann.date, true) }}
              </span>
            </div>
          </div>
          <div v-else class="text-center py-10 text-white/30 text-sm">No new announcements.</div>
        </div>

      </div>

      <!-- ==================== 4. BOTTOM ROW ==================== -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Bottom Banner -->
        <div class="bg-[#15161c] border border-white/5 rounded-2xl lg:col-span-2 overflow-hidden relative flex flex-col justify-end min-h-[140px] shadow-lg">
          <div class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen" 
               style="background-image: url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2000&auto=format&fit=crop');">
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#111216] to-transparent"></div>
          
          <div class="relative z-10 p-6 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div>
               <!-- 标题 Container (Yellow) -->
               <div class="inline-flex items-center gap-2 mb-3 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-2 rounded-xl w-fit">
                 <Flame class="w-5 h-5 text-yellow-500" /> 
                 <span class="font-bold text-yellow-500">SonShip Camp 2026</span>
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
          <!-- 标题 Container (Yellow) -->
          <div class="flex justify-between items-center mb-4 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-4 py-3 rounded-xl">
            <h2 class="font-bold flex items-center gap-2 text-yellow-500">
              <Zap class="w-5 h-5" /> Quick Access
            </h2>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink to="/games" class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Gamepad2 class="w-4 h-4 text-blue-400 group-hover:text-yellow-500 transition-colors" />
              <span class="text-xs text-white/70 group-hover:text-white">Games</span>
            </NuxtLink>
            <NuxtLink to="/profile" class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <User class="w-4 h-4 text-blue-400 group-hover:text-yellow-500 transition-colors" />
              <span class="text-xs text-white/70 group-hover:text-white">My Profile</span>
            </NuxtLink>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Map class="w-4 h-4 text-green-400 group-hover:text-yellow-500 transition-colors" />
              <span class="text-xs text-white/70 group-hover:text-white">Camp Map</span>
            </button>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Image class="w-4 h-4 text-green-400 group-hover:text-yellow-500 transition-colors" />
              <span class="text-xs text-white/70 group-hover:text-white">Gallery</span>
            </button>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <BookOpen class="w-4 h-4 text-purple-400 group-hover:text-yellow-500 transition-colors" />
              <span class="text-xs text-white/70 group-hover:text-white">Devotion</span>
            </button>
            <button class="bg-[#1a1b23] border border-white/5 hover:border-yellow-500/30 rounded-xl p-3 flex items-center gap-2 transition-colors group">
              <Gift class="w-4 h-4 text-red-400 group-hover:text-yellow-500 transition-colors" />
              <span class="text-xs text-white/70 group-hover:text-white">Secret Angel</span>
            </button>
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
// 新增引入所需要的 Icon
import { 
  Calendar, Users, Heart, Megaphone, Clock, MapPin, 
  ChevronRight, Flame, Ticket, Sun, Send, Zap,
  Gamepad2, User, Map, Image, BookOpen, Gift 
} from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()

// 状态变量
const hasMounted = ref(false)
const isLoading = ref(true)
// 默认背景图片
const currentBg = ref(firecamp) 
// 控制背景渐变显示的开关 (如果你有写轮播逻辑，可以通过这个控制透明度过渡)
const isBackgroundVisible = ref(true)

// 倒计时逻辑
const countdown = ref({ hrs: '00', mins: '00', secs: '00' })
let timer = null;

// 数据源
const announcements = ref([])
const dbSchedules = ref([])
const readAnnouncements = ref([])

const unreadCount = computed(() => {
  return announcements.value.filter(a => !readAnnouncements.value.includes(a.id)).length
})

// 获取当前对应的营会日期 (如果还没到营会，默认显示 Day 1; 如果营会结束，停留在 Day 4)
const currentCampDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const todayStr = `${year}-${month}-${day}`

  const campDates = ['2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31']
  
  // 如果当前系统日期是营会的其中一天，直接返回那天
  if (campDates.includes(todayStr)) {
    return todayStr
  }
  
  // 如果现在还没到 8月28日，默认显示 Day 1 的数据
  if (now.getTime() < new Date('2026-08-28').getTime()) {
    return '2026-08-28'
  }
  
  // 如果已经过了 8月31日，显示最后一天的数据
  return '2026-08-31'
})

// 计算当天总共有多少个 Event
const todayTotalEvents = computed(() => {
  // 从从数据库获取的完整 schedules 中，筛选出等于 currentCampDate 的行程
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

  // ====== 新增：队伍弹窗状态 ======
  const isGroupModalOpen = ref(false)

  // ====== 新增：计算当前用户的队伍成员 ======
  const myGroupMembers = computed(() => {
    // 确保已经加载了 auth 和 campersStore，并且用户有分配小组
    if (!auth.user || !auth.user.group || !campersStore.campers) return []
    
    // 筛选出 group 名字和自己一样的人
    let members = campersStore.campers.filter(c => c.group === auth.user.group)
    
    // (可选) 让 "自己" 排在列表的第一位
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

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
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
  // 只取前三条显示在Dashboard
  announcements.value = valid.slice(0, 3)
}

function processSchedules(data) {
  data.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
  dbSchedules.value = data
}

// 简单的倒计时逻辑
function startCountdown() {
  // 设置目标时间 (假设为 2026-08-28 14:00:00)
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
/* 隐藏自定义滚动条或使其细微 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 179, 8, 0.5); /* yellow-500 */
}

/* 简单的挥手动画 */
.wave {
  display: inline-block;
  animation: wave-animation 2.5s infinite;
  transform-origin: 70% 70%;
}
@keyframes wave-animation {
  0% { transform: rotate( 0.0deg) }
  10% { transform: rotate(14.0deg) }
  20% { transform: rotate(-8.0deg) }
  30% { transform: rotate(14.0deg) }
  40% { transform: rotate(-4.0deg) }
  50% { transform: rotate(10.0deg) }
  60% { transform: rotate( 0.0deg) }
  100% { transform: rotate( 0.0deg) }
}
</style>