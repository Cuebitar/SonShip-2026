<template>
  <div class="page-container bg-dark min-h-screen">
    <div class="container-inner py-10">

      <!-- 页面标题 -->
      <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="section-title text-white font-black text-3xl tracking-wide">{{ t('schedule.title') }} <span class="text-xl text-tertiary/50 ml-2">聚會流程</span></h1>
          <p class="font-body text-tertiary/50 text-sm mt-1">Camp Itinerary</p>
        </div>

        <div class="flex items-center gap-2">
          <button @click="goToToday" class="badge badge-primary text-xs px-4 py-2 hover:bg-primary/30 transition-colors">
            今天
          </button>
          <button @click="shiftMonth(-1)" class="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center hover:bg-primary/10 transition-colors bg-white/5">
            <ChevronLeft class="w-4 h-4 text-tertiary/70" />
          </button>
          <button @click="shiftMonth(1)" class="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center hover:bg-primary/10 transition-colors bg-white/5">
            <ChevronRight class="w-4 h-4 text-tertiary/70" />
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <p class="text-tertiary animate-pulse">Loading schedule from database...</p>
      </div>

      <div v-else>
        <!-- 日期切换按钮 (手机端使用) -->
        <div class="flex flex-wrap gap-2 mb-8 lg:hidden">
          <button v-for="day in days" :key="day"
            @click="selectDay(day)"
            class="badge cursor-pointer text-sm px-5 py-2 transition-all duration-200"
            :class="activeDay === day ? 'bg-primary text-secondary border-primary font-bold' : 'badge-primary hover:bg-primary/30'">
            {{ day }}
          </button>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">

          <!-- ============ 左侧：行程内容 (区块化网格设计) ============ -->
          <div class="overflow-x-auto custom-scrollbar pb-4">

            <!-- ---- 桌面版：多天并排区块化时间轴 (自动合并) (lg 以上显示) ---- -->
            <div class="hidden lg:block min-w-[700px]">
              
              <!-- 表头 -->
              <div class="flex gap-2 mb-2">
                <div class="w-24 flex-shrink-0 bg-white/10 rounded-xl flex items-center justify-center py-4 border border-white/5">
                  <span class="font-bold text-sm text-white/80">时间/日期</span>
                </div>
                <div v-for="day in days" :key="day" class="flex-1 bg-white/10 rounded-xl flex flex-col items-center justify-center py-3 border border-white/5 relative overflow-hidden">
                  <div v-if="activeDay === day" class="absolute inset-0 bg-primary/20"></div>
                  <span class="font-black text-white relative z-10 text-lg">{{ day }}</span>
                  <span class="text-xs text-white/50 relative z-10">{{ dayDateLabel(day) }}</span>
                </div>
              </div>

              <!-- 主体网格 -->
              <div class="flex gap-2 relative" :style="{ height: `${timelineHeight}px` }">
                
                <!-- 时间轴块 (左侧) -->
                <div class="w-24 flex-shrink-0 relative">
                  <div v-for="hour in timelineHours" :key="hour" class="absolute w-full" :style="{ top: `${hourToTop(hour)}px`, height: `${HOUR_HEIGHT_DESKTOP}px` }">
                    <div class="w-full h-[calc(100%-6px)] mt-[3px] bg-white/5 rounded-xl flex flex-col items-center justify-center text-white/60 text-xs font-bold font-mono tracking-wider">
                      <span>{{ formatHour(hour) }}</span>
                      <span class="text-[10px] text-white/20 my-0.5">|</span>
                      <span>{{ formatHour(hour + 1) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 统一的事件容器 (背景格 + 悬浮合并区块) -->
                <div class="flex-1 relative flex gap-2">
                  <!-- 每天的背景列 -->
                  <div v-for="day in days" :key="`bg-${day}`" class="flex-1 bg-white/[0.02] rounded-xl border border-white/5 p-1 pointer-events-none"></div>

                  <!-- 智能合并后的事件区块 -->
                  <div v-for="item in mergedLayout" :key="item.slot.id + '-' + item.startDayIndex"
                    @click="openEventDetails(item.slot)"
                    class="absolute rounded-xl flex flex-col items-center justify-center text-center p-1.5 transition-all hover:scale-[1.02] hover:z-20 cursor-pointer shadow-lg overflow-hidden border"
                    :class="[typeStyle(item.slot).badge, isBooked(item.slot.id) ? 'ring-2 ring-primary shadow-[0_0_15px_rgba(234,179,8,0.3)]' : '']"
                    :style="getMergedEventStyle(item, days.length)">
                    
                    <!-- 时间区间 -->
                    <div v-if="item.height >= 60" class="text-[10px] sm:text-[11px] font-mono font-bold opacity-90 mb-1 px-1.5 py-0.5 bg-black/20 rounded-md shrink-0">
                      {{ item.slot.time }} - {{ getEndTime(item.slot.time, item.slot.duration) }}
                    </div>
                    
                    <!-- 标题 (根据高度智能截断) -->
                    <div class="font-black leading-tight w-full px-1 flex-1 flex items-center justify-center" 
                         :class="item.height < 50 ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'">
                      <span :class="item.height < 50 ? 'line-clamp-1' : 'line-clamp-2'">{{ item.slot.name }}</span>
                    </div>
                    
                    <!-- 备注/地点 (只在高度足够时显示，防止撑爆) -->
                    <div v-if="item.slot.location && item.height >= 90" class="text-[10px] opacity-75 mt-1 flex items-center justify-center gap-1 w-full shrink-0 px-1">
                      <MapPin class="w-3 h-3 shrink-0" /> <span class="truncate">{{ item.slot.location }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- ---- 手机版：单天区块化时间轴 (lg 以下显示) ---- -->
            <div class="lg:hidden relative">
              <div class="transition-opacity">
                <!-- 手机端表头 -->
                <div class="flex gap-2 mb-2">
                  <div class="w-[72px] flex-shrink-0 bg-white/10 rounded-xl flex items-center justify-center py-3 border border-white/5">
                    <span class="font-bold text-xs text-white/80">时间</span>
                  </div>
                  <div class="flex-1 bg-primary/20 rounded-xl flex flex-col items-center justify-center py-3 border border-primary/30">
                    <span class="font-black text-white text-base">{{ activeDay }}</span>
                    <span class="text-[10px] text-white/70">{{ dayDateLabel(activeDay) }}</span>
                  </div>
                </div>

                <div v-if="scheduleByDay(activeDay).length === 0" class="text-center py-16 bg-white/5 rounded-xl border border-white/5">
                  <p class="text-white/50 text-sm">No sessions scheduled.</p>
                </div>

                <!-- 手机端时间轴 -->
                <div v-else class="flex gap-2 relative" :style="{ height: `${mobileTimelineHeight}px` }">
                  <div class="w-[72px] flex-shrink-0 relative">
                    <div v-for="hour in mobileTimelineHours" :key="`mh-${hour}`" class="absolute w-full" :style="{ top: `${mobileHourToTop(hour)}px`, height: `${HOUR_HEIGHT_MOBILE}px` }">
                      <div class="w-full h-[calc(100%-4px)] mt-[2px] bg-white/5 rounded-xl flex flex-col items-center justify-center text-white/60 text-[10px] font-bold font-mono">
                        <span>{{ formatHour(hour) }}</span>
                        <span class="text-[8px] text-white/20 my-0.5">|</span>
                        <span>{{ formatHour(hour + 1) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 事件列 -->
                  <div class="flex-1 relative bg-white/[0.02] rounded-xl border border-white/5 p-1">
                    <div v-for="item in mobileLayout" :key="item.slot.id"
                      @click="openEventDetails(item.slot)"
                      class="absolute rounded-xl flex flex-col items-center justify-center text-center p-1.5 transition-transform active:scale-95 cursor-pointer shadow-md overflow-hidden border"
                      :class="[typeStyle(item.slot).badge, isBooked(item.slot.id) ? 'ring-2 ring-primary shadow-[0_0_15px_rgba(234,179,8,0.3)]' : '']"
                      :style="{
                        top: `${item.top + 2}px`,
                        height: `${Math.max(item.height - 4, 30)}px`,
                        left: `${4 + item.indent * 8}px`,
                        right: '4px',
                        zIndex: 10 + item.indent
                      }">
                      
                      <!-- 紧凑时间 -->
                      <div v-if="item.height >= 55" class="text-[9px] font-mono font-bold opacity-90 mb-1 px-1.5 py-0.5 bg-black/20 rounded-md shrink-0">
                        {{ item.slot.time }} - {{ getEndTime(item.slot.time, item.slot.duration) }}
                      </div>
                      
                      <!-- 紧凑标题 -->
                      <div class="font-black leading-tight w-full px-1 flex-1 flex items-center justify-center" 
                           :class="item.height < 45 ? 'text-[10px]' : 'text-[13px]'">
                        <span :class="item.height < 45 ? 'line-clamp-1' : 'line-clamp-2'">{{ item.slot.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ============ 右侧：日历 / 图例 / 提醒 ============ -->
          <div class="space-y-4">
            <!-- 迷你日历 -->
            <div :class="sectionContainer">
              <div :class="sectionHeader">
                <div :class="titleWrapper">
                  <CalendarDays :class="sectionIcon" />
                  <h4 :class="sectionTitle">日历</h4>
                </div>
                <span :class="sectionAction">{{ calendarMonthLabel }}</span>
              </div>
              <div class="p-5 pt-4">
                <div class="grid grid-cols-7 gap-y-1 text-center">
                  <span v-for="wd in weekdayLabels" :key="wd" class="font-body text-[10px] text-tertiary/30 py-1">{{ wd }}</span>
                  <template v-for="(cell, idx) in calendarCells" :key="idx">
                    <div class="flex items-center justify-center py-1">
                      <span v-if="cell"
                        @click="handleCalendarClick(cell)"
                        class="w-6 h-6 flex items-center justify-center rounded-full font-body text-[11px] transition-colors"
                        :class="[calendarCellClass(cell), isCampDate(cell) ? 'cursor-pointer hover:bg-primary/20 hover:scale-110' : '']">
                        {{ cell.day }}
                      </span>
                    </div>
                  </template>
                </div>
                <p class="text-center text-[10px] text-tertiary/40 mt-3">* 点击营会日期查看详情</p>
              </div>
            </div>

            <!-- 活动类型图例 -->
            <div :class="sectionContainer">
              <div :class="sectionHeader">
                <div :class="titleWrapper">
                  <Tags :class="sectionIcon" />
                  <h4 :class="sectionTitle">活动类型</h4>
                </div>
                <span :class="sectionAction">Event Type</span>
              </div>
              <div class="p-5 pt-4 space-y-3">
                <div v-for="(meta, key) in TYPE_STYLES" :key="key" class="flex items-center gap-3 p-2 rounded-lg border" :class="meta.badge">
                  <component :is="meta.icon" class="w-4 h-4 shrink-0" />
                  <span class="font-bold text-xs">{{ meta.label }} <span class="opacity-60 ml-1">({{ meta.labelEn }})</span></span>
                </div>
              </div>
            </div>

            <!-- 温馨提醒 -->
            <div :class="sectionContainer">
              <div :class="sectionHeader">
                <div :class="titleWrapper">
                  <Star :class="sectionIcon" />
                  <h4 :class="sectionTitle">温馨提醒</h4>
                </div>
                <span :class="sectionAction">Reminder</span>
              </div>
              <div class="p-5 pt-4">
                <p class="font-body text-xs text-tertiary/70 leading-relaxed mb-2">请准时出席所有必到活动，并遵守营会规则。</p>
                <p class="font-body text-[11px] text-tertiary/50 leading-relaxed">Please attend all must-attend events on time and follow camp rules.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ==================== 弹窗：单日整天行程详情 (Calendar Modal) ==================== -->
    <Transition name="fade">
      <div v-if="isCalendarModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f1015]/80 backdrop-blur-sm" @click.self="isCalendarModalOpen = false">
        <div class="bg-[#15161c] border border-primary/20 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col transform transition-all">
          <div class="p-5 border-b border-primary/10 flex items-center justify-between bg-primary/5">
            <div class="flex items-center gap-3">
              <h3 class="font-black text-primary text-xl tracking-wide">{{ modalActiveDay }}</h3>
              <span class="text-xs text-white/50">{{ dayDateLabel(modalActiveDay) }}</span>
            </div>
            <button @click="isCalendarModalOpen = false" class="text-white/50 hover:text-white transition-colors"><X class="w-6 h-6" /></button>
          </div>
          <div class="relative flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3 min-h-[350px] max-h-[60vh]">
            <div v-if="modalEvents.length === 0" class="text-center text-white/40 py-10">当天没有安排行程</div>
            <div v-for="event in modalEvents" :key="event.id" @click="openEventDetails(event)" class="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-primary/30 transition-colors cursor-pointer">
              <div class="w-14 flex-shrink-0 text-right pt-0.5">
                <p class="font-bold text-primary text-sm">{{ event.time }}</p>
                <p class="text-[10px] text-white/40 mt-1">{{ event.duration }}m</p>
              </div>
              <div class="w-px bg-white/10 my-1"></div>
              <div class="flex-1">
                <div class="flex items-start justify-between gap-3 mb-1.5">
                  <h4 class="font-bold text-white text-sm leading-snug">{{ event.name }}</h4>
                  <span :class="typeStyle(event).badge" class="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">{{ typeStyle(event).label }}</span>
                </div>
                <p v-if="event.location" class="text-[11px] text-white/60 flex items-center gap-1.5 mt-2"><MapPin class="w-3.5 h-3.5 text-primary/70" /> {{ event.location }}</p>
              </div>
            </div>
          </div>
          <div class="p-4 border-t border-white/5 flex items-center justify-between bg-[#15161c]">
            <button @click="prevModalDay" :disabled="!hasPrevModalDay" class="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/70 disabled:opacity-30 transition-colors"><ChevronLeft class="w-4 h-4" /> 上一天</button>
            <button @click="nextModalDay" :disabled="!hasNextModalDay" class="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/70 disabled:opacity-30 transition-colors">下一天 <ChevronRight class="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ==================== 弹窗：单个行程详情 (Event Modal) ==================== -->
    <Transition name="fade">
      <div v-if="isEventModalOpen && selectedEvent" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f1015]/80 backdrop-blur-sm" @click.self="isEventModalOpen = false">
        <div class="bg-[#15161c] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col transform transition-all">
          <div :class="typeStyle(selectedEvent).badge" class="p-6 flex items-start justify-between border-b border-white/10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-md shrink-0">
                <component :is="typeStyle(selectedEvent).icon" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-black text-lg leading-tight drop-shadow-md">{{ selectedEvent.name }}</h3>
                <p class="text-xs opacity-90 mt-1 font-bold">{{ typeStyle(selectedEvent).label }}</p>
              </div>
            </div>
            <button @click="isEventModalOpen = false" class="text-white/70 hover:text-white transition-colors bg-black/20 rounded-full p-1.5 shrink-0"><X class="w-4 h-4" /></button>
          </div>
          <div class="p-6 space-y-5">
            <div class="flex items-start gap-3">
              <Clock class="w-5 h-5 text-white/40 mt-0.5 shrink-0" />
              <div>
                <p class="text-sm text-white font-bold">{{ selectedEvent.time }} - {{ getEndTime(selectedEvent.time, selectedEvent.duration) }}</p>
                <p class="text-xs text-white/50 mt-0.5">Duration: {{ selectedEvent.duration }} mins</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <MapPin class="w-5 h-5 text-white/40 mt-0.5 shrink-0" />
              <p class="text-sm text-white font-bold">{{ selectedEvent.location || 'TBA (待定)' }}</p>
            </div>
            <div v-if="selectedEvent.notes" class="flex items-start gap-3 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mt-2">
              <AlertCircle class="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <p class="text-sm text-red-400 leading-relaxed font-bold">{{ selectedEvent.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useScheduleStore } from '~/stores/schedule'
import {
  MapPin, AlertCircle, Lock, ChevronLeft, ChevronRight,
  Sparkles, Utensils, BookOpen, Coffee, Bus, Users,
  Clock, CalendarDays, Tags, Tent, Star, X
} from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const scheduleStore = useScheduleStore()

const sectionContainer = 'bg-[#15161c] border border-white/5 rounded-2xl overflow-hidden shadow-lg'
const sectionHeader = 'flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5'
const titleWrapper = 'inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 px-3 py-1.5 rounded-xl w-fit'
const sectionIcon = 'w-4 h-4 text-yellow-500 flex-shrink-0'
const sectionTitle = 'font-bold text-yellow-500 text-sm tracking-wide'
const sectionAction = 'font-body text-xs text-white/40 flex-shrink-0'

const isLoading = ref(true)
const activeDay = ref('')

const campDates = [
  { iso: '2026-08-28', label: 'Day 1', dateLabel: '28 Aug 2026', theme: '建立关系' },
  { iso: '2026-08-29', label: 'Day 2', dateLabel: '29 Aug 2026', theme: '建立关系' },
  { iso: '2026-08-30', label: 'Day 3', dateLabel: '30 Aug 2026', theme: '灵命' },
  { iso: '2026-08-31', label: 'Day 4', dateLabel: '31 Aug 2026', theme: 'Action Plan' },
]

const days = computed(() => {
  let uniqueDays = scheduleStore.getDays()
  return uniqueDays.sort((a, b) => a.localeCompare(b))
})

function selectDay(day) { activeDay.value = day }

function scheduleByDay(day) {
  let slots = scheduleStore.getByDay(day)
  return [...slots].sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime()
    const timeB = new Date(`${b.date}T${b.time}`).getTime()
    return timeA - timeB
  })
}

function dayDateLabel(day) {
  const idx = days.value.indexOf(day)
  return campDates[idx] ? campDates[idx].dateLabel : ''
}

const isBooked = (id) => scheduleStore.isBooked(auth.user?.id, id)

// Helper: 计算结束时间
function getEndTime(timeStr, durationMins) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const totalMins = h * 60 + m + (Number(durationMins) || 30);
  const endH = Math.floor(totalMins / 60);
  const endM = totalMins % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

const TYPE_STYLES = {
  devotion: { label: '灵修时间', labelEn: 'Devotion', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: Sparkles },
  meal: { label: '用餐时间', labelEn: 'Meal Time', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Utensils },
  learning: { label: '学习时间', labelEn: 'Learning', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30', icon: BookOpen },
  free: { label: '休息/自由', labelEn: 'Free Time', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', icon: Coffee },
  departure: { label: '离营安排', labelEn: 'Departure', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: Bus },
  must: { label: '必到活动', labelEn: 'Must Attend', badge: 'bg-red-500/15 text-red-300 border-red-500/30', icon: Users },
}

function inferType(slot) {
  const text = `${slot.name || ''} ${slot.notes || ''}`
  if (/灵修|devotion/i.test(text)) return 'devotion'
  if (/早餐|午餐|晚餐|用餐|breakfast|lunch|dinner|meal/i.test(text)) return 'meal'
  if (/查经|圣经|工作坊|团队建立|分组|分享|workshop|bible|study|team\s?building|sharing/i.test(text)) return 'learning'
  if (/自由时间|休息|放松|free\s?time|relax/i.test(text)) return 'free'
  if (/巴士|返家|depart|bus/i.test(text)) return 'departure'
  return 'must'
}

function typeStyle(slot) {
  const key = slot.type || inferType(slot)
  return TYPE_STYLES[key] || TYPE_STYLES.must
}

/* ---------------- 时间轴计算与智能合并 (Auto Merge Logic) ---------------- */
const HOUR_START = 7
const HOUR_END = 23

// 增加了每小时的高度比例，拉开空间防止拥挤
const HOUR_HEIGHT_DESKTOP = 120
const HOUR_HEIGHT_MOBILE = 110

function timeToMinutes(timeStr) {
  const [h, m] = (timeStr || '0:0').split(':').map(Number)
  return h * 60 + m
}
function formatHour(hour) {
  return `${String(Math.floor(hour)).padStart(2, '0')}:00`
}

const timelineHours = computed(() => {
  const arr = []
  for (let h = Math.ceil(HOUR_START); h < Math.floor(HOUR_END); h += 1) arr.push(h)
  return arr
})
const timelineHeight = computed(() => (HOUR_END - HOUR_START) * HOUR_HEIGHT_DESKTOP)
function hourToTop(hour) { return (hour - HOUR_START) * HOUR_HEIGHT_DESKTOP }

// 获取动态合并的排版 (Desktop 使用)
const mergedLayout = computed(() => {
  let allSlots = []
  days.value.forEach((day, index) => {
    const slots = scheduleStore.getByDay(day).map(s => ({ ...s, day, dayIndex: index }))
    allSlots.push(...slots)
  })

  // 按 [时间+时长] 分组
  const timeGroups = {}
  allSlots.forEach(slot => {
    const key = `${slot.time}-${slot.duration}`
    if (!timeGroups[key]) timeGroups[key] = []
    timeGroups[key].push(slot)
  })

  const mergedItems = []
  Object.values(timeGroups).forEach(group => {
    // 确保按天数顺序排列
    group.sort((a, b) => a.dayIndex - b.dayIndex)
    let currentMerge = null
    
    group.forEach(slot => {
      if (!currentMerge) {
        currentMerge = { slot, startDayIndex: slot.dayIndex, colSpan: 1 }
      } else {
        // 如果是连续的一天，且行程名称相同（无视备注的差异）
        if (slot.dayIndex === currentMerge.startDayIndex + currentMerge.colSpan && slot.name === currentMerge.slot.name) {
          currentMerge.colSpan += 1
        } else {
          mergedItems.push(currentMerge)
          currentMerge = { slot, startDayIndex: slot.dayIndex, colSpan: 1 }
        }
      }
    })
    if (currentMerge) mergedItems.push(currentMerge)
  })

  // 计算 Y 轴的位置与高度
  mergedItems.forEach(item => {
    const startMin = timeToMinutes(item.slot.time) - HOUR_START * 60
    const duration = Number(item.slot.duration) || 30
    item.top = (startMin / 60) * HOUR_HEIGHT_DESKTOP
    item.height = (duration / 60) * HOUR_HEIGHT_DESKTOP
    item.indent = 0
  })

  // 简单的防重叠（针对同一天不同事件重叠）
  mergedItems.sort((a, b) => a.startDayIndex - b.startDayIndex || a.top - b.top)
  for(let i=0; i<mergedItems.length; i++) {
    for(let j=0; j<i; j++) {
      const cur = mergedItems[i]
      const prev = mergedItems[j]
      const overlapX = cur.startDayIndex < prev.startDayIndex + prev.colSpan && cur.startDayIndex + cur.colSpan > prev.startDayIndex
      const overlapY = cur.top < prev.top + prev.height && cur.top + cur.height > prev.top
      if (overlapX && overlapY) {
        cur.indent = Math.max(cur.indent, prev.indent + 1)
      }
    }
  }

  return mergedItems
})

// CSS 计算：横向动态跨越 (ColSpan)
function getMergedEventStyle(item, totalDays) {
  const gap = 8; // p-1 equivalent gap logic
  const top = item.top + 3;
  const height = Math.max(item.height - 6, 30);

  const colWidthExpr = `((100% - ${(totalDays - 1) * gap}px) / ${totalDays})`;
  const leftExpr = `calc(${item.startDayIndex} * (${colWidthExpr} + ${gap}px) + 4px + ${item.indent * 12}px)`;
  const widthExpr = `calc(${item.colSpan} * ${colWidthExpr} + ${(item.colSpan - 1) * gap}px - 8px)`;

  return {
    top: `${top}px`,
    height: `${height}px`,
    left: leftExpr,
    width: widthExpr,
    zIndex: 10 + (item.indent || 0)
  };
}


// Mobile 端单列计算
const mobileTimelineHours = computed(() => {
  const arr = []
  for (let h = Math.ceil(HOUR_START); h < Math.floor(HOUR_END); h += 1) arr.push(h)
  return arr
})
const mobileTimelineHeight = computed(() => (HOUR_END - HOUR_START) * HOUR_HEIGHT_MOBILE)
function mobileHourToTop(hour) { return (hour - HOUR_START) * HOUR_HEIGHT_MOBILE }

const mobileLayout = computed(() => {
  const slots = scheduleByDay(activeDay.value)
  const items = slots.map(slot => {
    const startMin = timeToMinutes(slot.time) - HOUR_START * 60
    const duration = Number(slot.duration) || 30
    return { slot, top: (startMin / 60) * HOUR_HEIGHT_MOBILE, height: (duration / 60) * HOUR_HEIGHT_MOBILE, indent: 0 }
  })
  for (let i = 0; i < items.length; i++) {
    const cur = items[i], next = items[i + 1]
    if (next && cur.top + cur.height > next.top) next.indent = cur.indent + 1
  }
  return items
})

/* ---------------- 迷你日历 ---------------- */
const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']
const calendarMonth = ref(new Date(2026, 7, 1))

const calendarMonthLabel = computed(() => `${calendarMonth.value.getFullYear()}年${calendarMonth.value.getMonth() + 1}月`)

const calendarCells = computed(() => {
  const year = calendarMonth.value.getFullYear()
  const month = calendarMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, iso })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
})

function shiftMonth(delta) {
  const d = calendarMonth.value
  calendarMonth.value = new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

function goToToday() {
  const now = new Date()
  calendarMonth.value = new Date(now.getFullYear(), now.getMonth(), 1)
  const todayIso = now.toISOString().slice(0, 10)
  const match = campDates.find(c => c.iso === todayIso)
  if (match && days.value[campDates.indexOf(match)]) activeDay.value = days.value[campDates.indexOf(match)]
}

function isCampDate(cell) {
  if (!cell) return false
  return campDates.findIndex(c => c.iso === cell.iso) !== -1
}

function calendarCellClass(cell) {
  if (!cell) return ''
  const campIdx = campDates.findIndex(c => c.iso === cell.iso)
  const isActiveCampDay = campIdx !== -1 && days.value[campIdx] === activeDay.value
  const isCampDay = campIdx !== -1
  const todayIso = new Date().toISOString().slice(0, 10)
  const isToday = cell.iso === todayIso

  if (isActiveCampDay) return 'bg-yellow-500 text-black font-bold'
  if (isCampDay) return 'border border-yellow-500/50 text-yellow-500'
  if (isToday) return 'border border-white/40 text-white'
  return 'text-white/40'
}

/* ---------------- 弹窗逻辑 ---------------- */
const isCalendarModalOpen = ref(false)
const modalActiveDay = ref('')

const isEventModalOpen = ref(false)
const selectedEvent = ref(null)

const modalEvents = computed(() => modalActiveDay.value ? scheduleByDay(modalActiveDay.value) : [])

function handleCalendarClick(cell) {
  if (!cell) return
  const campIdx = campDates.findIndex(c => c.iso === cell.iso)
  if (campIdx !== -1 && days.value[campIdx]) {
    modalActiveDay.value = days.value[campIdx]
    isCalendarModalOpen.value = true
  }
}

const currentModalDayIndex = computed(() => days.value.indexOf(modalActiveDay.value))
const hasPrevModalDay = computed(() => currentModalDayIndex.value > 0)
const hasNextModalDay = computed(() => currentModalDayIndex.value < days.value.length - 1)

function prevModalDay() { if (hasPrevModalDay.value) modalActiveDay.value = days.value[currentModalDayIndex.value - 1] }
function nextModalDay() { if (hasNextModalDay.value) modalActiveDay.value = days.value[currentModalDayIndex.value + 1] }

function openEventDetails(slot) {
  selectedEvent.value = slot
  isEventModalOpen.value = true
}

onMounted(async () => {
  await scheduleStore.initSchedule()
  if (days.value.length > 0) activeDay.value = days.value[0]
  isLoading.value = false
})

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 179, 8, 0.5); }

/* 强制隐藏超出文本并在结尾显示省略号 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active .transform, .fade-leave-active .transform { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from .transform, .fade-leave-to .transform { transform: scale(0.95) translateY(10px); }
</style>