<template>
  <div class="page-container bg-dark min-h-screen">
    <div class="container-inner py-10">

      <!-- 页面标题 -->
      <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="section-title">{{ t('schedule.title') }}</h1>
          <p class="font-body text-tertiary/50 text-sm mt-1">Camp Itinerary</p>
        </div>

        <div class="flex items-center gap-2">
          <button @click="goToToday" class="badge badge-primary text-xs px-4 py-2 hover:bg-primary/30 transition-colors">
            今天
          </button>
          <button @click="shiftMonth(-1)" class="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ChevronLeft class="w-4 h-4 text-tertiary/70" />
          </button>
          <button @click="shiftMonth(1)" class="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ChevronRight class="w-4 h-4 text-tertiary/70" />
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <p class="text-tertiary animate-pulse">Loading schedule from database...</p>
      </div>

      <div v-else>
        <!-- 日期切换按钮 -->
        <div class="flex flex-wrap gap-2 mb-8">
          <button v-for="day in days" :key="day"
            @click="selectDay(day)"
            class="badge cursor-pointer text-sm px-5 py-2 transition-all duration-200"
            :class="activeDay === day ? 'bg-primary text-secondary border-primary font-bold' : 'badge-primary hover:bg-primary/30'">
            {{ day }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          <!-- ============ 左侧：行程内容 ============ -->
          <div>

            <!-- ---- 桌面版：多天并排时间轴 (lg 以上显示) ---- -->
            <div :class="sectionContainer" class="hidden lg:block">

              <!-- 渐层 banner 标题栏 -->
              <div :class="sectionHeader">
                <div :class="titleWrapper">
                  <Clock :class="sectionIcon" />
                  <h2 :class="sectionTitle">营会时间表</h2>
                </div>
                <span :class="sectionAction">{{ activeDay }} · {{ dayDateLabel(activeDay) }}</span>
              </div>

              <div class="grid" :style="{ gridTemplateColumns: `72px repeat(${days.length}, 1fr)` }">

                <!-- 时间轴表头空白格 -->
                <div class="border-b border-r border-primary/10 px-2 py-4">
                  <p class="font-body text-[10px] text-tertiary/40 tracking-wider">时间 / Time</p>
                </div>

                <!-- 每天的表头 -->
                <div v-for="day in days" :key="`head-${day}`"
                  class="border-b border-r border-primary/10 last:border-r-0 px-4 py-4 text-center"
                  :class="day === activeDay ? 'bg-primary/10' : ''">
                  <p class="font-heading font-black text-tertiary" :class="day === activeDay ? 'text-primary' : ''">{{ day }}</p>
                  <p v-if="dayDateLabel(day)" class="font-body text-[11px] text-tertiary/40 mt-0.5">{{ dayDateLabel(day) }}</p>
                </div>

                <!-- 时间刻度列 -->
                <div class="relative border-r border-primary/10" :style="{ height: `${timelineHeight}px` }">
                  <div v-for="hour in timelineHours" :key="`h-${hour}`"
                    class="absolute left-0 right-0 px-2"
                    :style="{ top: `${hourToTop(hour)}px` }">
                    <p class="font-body text-[10px] text-tertiary/40 -translate-y-1/2 text-right pr-1">{{ formatHour(hour) }}</p>
                  </div>
                </div>

                <!-- 每天一列 -->
                <div v-for="day in days" :key="`col-${day}`"
                  class="relative border-r border-primary/10 last:border-r-0"
                  :style="{ height: `${timelineHeight}px` }">

                  <!-- 每小时的横向参考线 -->
                  <div v-for="hour in timelineHours" :key="`line-${day}-${hour}`"
                    class="absolute left-0 right-0 border-t border-primary/5"
                    :style="{ top: `${hourToTop(hour)}px` }" />

                  <!-- 事件卡片（已做防重叠处理） -->
                  <div v-for="item in layoutForDay(day)" :key="item.slot.id"
                    @click="openEventDetails(item.slot)"
                    class="absolute rounded-lg border overflow-hidden transition-transform hover:-translate-y-0.5 hover:z-20 hover:shadow-lg hover:shadow-black/40 cursor-pointer"
                    :class="[typeStyle(item.slot).badge, isBooked(item.slot.id) ? 'ring-1 ring-primary/50' : '']"
                    :style="{
                      top: `${item.top}px`,
                      height: `${item.height}px`,
                      left: `${6 + item.indent * 10}px`,
                      right: '6px',
                      zIndex: 10 + item.indent
                    }">

                    <!-- 紧凑模式 -->
                    <div v-if="item.compact" class="h-full flex items-center gap-1.5 px-2.5">
                      <component :is="typeStyle(item.slot).icon" class="w-3 h-3 flex-shrink-0" />
                      <span class="font-body text-[10px] font-bold flex-shrink-0">{{ item.slot.time }}</span>
                      <span class="font-heading font-bold text-[11px] text-tertiary truncate">{{ item.slot.name }}</span>
                    </div>

                    <!-- 标准模式 -->
                    <div v-else class="px-2.5 py-2">
                      <div class="flex items-center gap-1 mb-0.5">
                        <component :is="typeStyle(item.slot).icon" class="w-3 h-3 flex-shrink-0" />
                        <span class="font-body text-[10px] font-bold tracking-wide">{{ item.slot.time }}</span>
                        <span class="font-body text-[9px] text-tertiary/40 ml-auto">{{ item.slot.duration }}m</span>
                      </div>
                      <p class="font-heading font-bold text-[12px] leading-tight text-tertiary truncate">{{ item.slot.name }}</p>
                      <p v-if="item.height >= 68" class="font-body text-[10px] text-tertiary/50 truncate flex items-center gap-1 mt-0.5">
                        <MapPin class="w-2.5 h-2.5 flex-shrink-0" />{{ item.slot.location || 'TBA' }}
                      </p>
                    </div>
                  </div>

                  <!-- 空状态 -->
                  <div v-if="scheduleByDay(day).length === 0" class="absolute inset-0 flex items-center justify-center">
                    <p class="font-body text-[11px] text-tertiary/30">No sessions</p>
                  </div>

                  <!-- 未解锁遮罩 -->
                  <div v-if="isDayLocked(day)" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-dark/85 backdrop-blur-sm">
                    <Lock class="w-6 h-6 text-primary mb-2" />
                    <p class="font-heading font-bold text-tertiary text-xs text-center px-2">内容未解锁</p>
                    <p class="font-body text-[10px] text-tertiary/60 text-center px-2 mt-1">{{ day }} 早上 6:00 开放</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ---- 手机版：单天 calendar 时间轴 (lg 以下显示) ---- -->
            <div :class="sectionContainer" class="lg:hidden relative">
              <div :class="[
                isDayLocked(activeDay) ? 'blur-md opacity-30 pointer-events-none select-none' : 'opacity-100',
                'transition-opacity duration-150 ease-in-out'
              ]">

                <!-- 渐层 banner 标题栏 -->
                <div :class="sectionHeader">
                  <div :class="titleWrapper">
                    <Clock :class="sectionIcon" />
                    <h2 :class="sectionTitle">{{ activeDay }} 时间表</h2>
                  </div>
                  <span :class="sectionAction">{{ dayDateLabel(activeDay) }}</span>
                </div>

                <div v-if="scheduleByDay(activeDay).length === 0" class="text-center py-16">
                  <p class="font-body text-tertiary/50">No sessions scheduled for {{ activeDay }} yet.</p>
                </div>

                <!-- 时间轴主体 -->
                <div v-else class="grid grid-cols-[56px_1fr]">

                  <!-- 时间刻度列 -->
                  <div class="relative border-r border-primary/10" :style="{ height: `${mobileTimelineHeight}px` }">
                    <div v-for="hour in mobileTimelineHours" :key="`mh-${hour}`"
                      class="absolute left-0 right-0"
                      :style="{ top: `${mobileHourToTop(hour)}px` }">
                      <p class="font-body text-[10px] text-tertiary/40 -translate-y-1/2 text-right pr-2">{{ formatHour(hour) }}</p>
                    </div>
                  </div>

                  <!-- 事件列 -->
                  <div class="relative" :style="{ height: `${mobileTimelineHeight}px` }">
                    <div v-for="hour in mobileTimelineHours" :key="`mline-${hour}`"
                      class="absolute left-0 right-0 border-t border-primary/5"
                      :style="{ top: `${mobileHourToTop(hour)}px` }" />

                    <div v-for="item in mobileLayout" :key="item.slot.id"
                      @click="openEventDetails(item.slot)"
                      class="absolute rounded-lg border overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                      :class="[typeStyle(item.slot).badge, isBooked(item.slot.id) ? 'ring-1 ring-primary/50' : '']"
                      :style="{
                        top: `${item.top}px`,
                        height: `${item.height}px`,
                        left: `${8 + item.indent * 12}px`,
                        right: '8px',
                        zIndex: 10 + item.indent
                      }">

                      <div v-if="item.compact" class="h-full flex items-center gap-1.5 px-3">
                        <component :is="typeStyle(item.slot).icon" class="w-3.5 h-3.5 flex-shrink-0" />
                        <span class="font-body text-[11px] font-bold flex-shrink-0">{{ item.slot.time }}</span>
                        <span class="font-heading font-bold text-[12px] text-tertiary truncate">{{ item.slot.name }}</span>
                      </div>

                      <div v-else class="px-3 py-2">
                        <div class="flex items-center gap-1.5 mb-0.5">
                          <component :is="typeStyle(item.slot).icon" class="w-3.5 h-3.5 flex-shrink-0" />
                          <span class="font-body text-[11px] font-bold tracking-wide">{{ item.slot.time }}</span>
                          <span class="font-body text-[10px] text-tertiary/40 ml-auto">{{ item.slot.duration }} mins</span>
                        </div>
                        <p class="font-heading font-bold text-[13px] leading-tight text-tertiary truncate">{{ item.slot.name }}</p>
                        <p v-if="item.height >= 72" class="font-body text-[11px] text-tertiary/50 truncate flex items-center gap-1 mt-1">
                          <MapPin class="w-3 h-3 flex-shrink-0" />{{ item.slot.location || 'TBA' }}
                        </p>
                        <div v-if="item.slot.notes && item.height >= 100" class="mt-1.5 inline-flex items-center gap-1 bg-red-500/10 px-1.5 py-1 rounded text-red-400 max-w-full">
                          <AlertCircle class="w-3 h-3 flex-shrink-0" />
                          <span class="font-body text-[10px] leading-tight truncate">{{ item.slot.notes }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 未解锁时的浮层提示 -->
              <div v-if="isDayLocked(activeDay)" class="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div class="bg-dark/80 backdrop-blur-sm p-6 rounded-xl border border-primary/30 text-center shadow-lg shadow-black/50 mx-6">
                  <Lock class="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 class="font-heading font-bold text-tertiary text-lg mb-2">内容未解锁</h3>
                  <p class="font-body text-sm text-tertiary/70">
                    {{ activeDay }} 的行程将在当日早上 6:00 开放
                  </p>
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
              <div class="p-5 pt-4 space-y-2">
                <div v-for="(meta, key) in TYPE_STYLES" :key="key" class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="meta.dot"></span>
                  <span class="font-body text-xs text-tertiary/60">{{ meta.label }} ({{ meta.labelEn }})</span>
                </div>
              </div>
            </div>

            <!-- 营会日期 -->
            <div :class="sectionContainer">
              <div :class="sectionHeader">
                <div :class="titleWrapper">
                  <Tent :class="sectionIcon" />
                  <h4 :class="sectionTitle">营会日期</h4>
                </div>
                <span :class="sectionAction">Camp Dates</span>
              </div>
              <div class="p-5 pt-4 space-y-2 text-xs font-body text-tertiary/60">
                <p v-for="c in campDates" :key="c.iso">📅 {{ c.label }} — {{ c.dateLabel }} · {{ c.theme }}</p>
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
                <p class="font-body text-xs text-tertiary/60 leading-relaxed">
                  请准时出席所有必到活动，并遵守营会规则。
                </p>
                <p class="font-body text-xs text-tertiary/60 leading-relaxed mt-1">
                  Please attend all must-attend events on time and follow camp rules.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p class="font-body text-[11px] text-tertiary/30 mt-6">* 行程可能会根据实际情况有所调整 / The itinerary is subject to change.</p>
      </div>
    </div>

    <!-- ==================== 弹窗：单日整天行程详情 (Calendar Modal) ==================== -->
    <Transition name="fade">
      <div v-if="isCalendarModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f1015]/80 backdrop-blur-sm" @click.self="isCalendarModalOpen = false">
        <div class="bg-[#15161c] border border-primary/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col transform transition-all">
          
          <!-- Modal 标题 -->
          <div class="p-5 border-b border-primary/10 flex items-center justify-between bg-primary/5">
            <div class="flex items-center gap-3">
              <h3 class="font-heading font-black text-primary text-xl tracking-wide">{{ modalActiveDay }}</h3>
              <span class="font-body text-xs text-tertiary/50">{{ dayDateLabel(modalActiveDay) }}</span>
            </div>
            <button @click="isCalendarModalOpen = false" class="text-tertiary/50 hover:text-tertiary transition-colors">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Modal 内容 (可滚动) -->
          <div class="relative flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3 min-h-[350px] max-h-[60vh]">
            
            <!-- 未解锁状态 -->
            <div v-if="isDayLocked(modalActiveDay)" class="absolute inset-0 flex flex-col items-center justify-center bg-[#15161c]/95 z-10">
              <Lock class="w-12 h-12 text-primary mb-4" />
              <h4 class="font-heading font-bold text-tertiary text-lg">内容未解锁</h4>
              <p class="font-body text-sm text-tertiary/50 mt-1">{{ modalActiveDay }} 早上 6:00 开放</p>
            </div>

            <!-- 行程列表 -->
            <template v-else>
              <div v-if="modalEvents.length === 0" class="text-center text-tertiary/50 py-10">
                当天没有安排行程 / No sessions scheduled.
              </div>
              
              <!-- 列表中的行程卡片，点击也会弹出单个详情 -->
              <div v-for="event in modalEvents" :key="event.id" 
                @click="openEventDetails(event)"
                class="flex gap-4 p-4 rounded-xl border border-primary/10 bg-[#1a1b23] hover:border-primary/30 hover:bg-[#1a1b23]/80 transition-colors cursor-pointer">
                <!-- 左侧时间 -->
                <div class="w-14 flex-shrink-0 text-right pt-0.5">
                  <p class="font-body font-bold text-primary text-sm">{{ event.time }}</p>
                  <p class="font-body text-[10px] text-tertiary/40 mt-1">{{ event.duration }}m</p>
                </div>
                
                <!-- 分割线 -->
                <div class="w-px bg-primary/10 my-1"></div>
                
                <!-- 右侧内容 -->
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-3 mb-1.5">
                    <h4 class="font-heading font-bold text-tertiary text-sm leading-snug">{{ event.name }}</h4>
                    <span :class="typeStyle(event).badge" class="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap flex-shrink-0">
                      {{ typeStyle(event).label }}
                    </span>
                  </div>
                  <p v-if="event.location" class="font-body text-[11px] text-tertiary/60 flex items-center gap-1.5 mt-2">
                    <MapPin class="w-3.5 h-3.5 text-primary/70" /> {{ event.location }}
                  </p>
                  <p v-if="event.notes" class="font-body text-[11px] text-red-400/90 bg-red-500/10 px-2 py-1.5 rounded mt-2 flex items-start gap-1.5">
                    <AlertCircle class="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {{ event.notes }}
                  </p>
                </div>
              </div>
            </template>
          </div>

          <!-- Modal 底部导航 (上一天 / 下一天) -->
          <div class="p-4 border-t border-primary/10 flex items-center justify-between bg-[#15161c]">
            <button @click="prevModalDay" :disabled="!hasPrevModalDay" 
              class="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft class="w-4 h-4" /> 上一天
            </button>
            <button @click="nextModalDay" :disabled="!hasNextModalDay" 
              class="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              下一天 <ChevronRight class="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ==================== 弹窗：单个行程详情 (Event Modal) ==================== -->
    <Transition name="fade">
      <div v-if="isEventModalOpen && selectedEvent" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f1015]/80 backdrop-blur-sm" @click.self="isEventModalOpen = false">
        <div class="bg-[#15161c] border border-primary/20 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col transform transition-all">
          
          <!-- Modal 头部 (根据活动类型自动变色) -->
          <div :class="typeStyle(selectedEvent).badge" class="p-5 flex items-start justify-between border-b border-white/10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20 shrink-0">
                <component :is="typeStyle(selectedEvent).icon" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-heading font-black text-lg leading-tight drop-shadow-md">{{ selectedEvent.name }}</h3>
                <p class="font-body text-xs opacity-90 mt-1 font-semibold">{{ typeStyle(selectedEvent).label }}</p>
              </div>
            </div>
            <button @click="isEventModalOpen = false" class="text-white/70 hover:text-white transition-colors bg-black/20 rounded-full p-1.5 shrink-0">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Modal 内容 -->
          <div class="p-6 space-y-5">
            <!-- 时间 -->
            <div class="flex items-start gap-3">
              <Clock class="w-5 h-5 text-tertiary/40 mt-0.5 shrink-0" />
              <div>
                <p class="font-body text-sm text-tertiary font-bold">{{ selectedEvent.time }}</p>
                <p class="font-body text-xs text-tertiary/50 mt-0.5">Duration: {{ selectedEvent.duration }} mins</p>
              </div>
            </div>

            <!-- 地点 -->
            <div class="flex items-start gap-3">
              <MapPin class="w-5 h-5 text-tertiary/40 mt-0.5 shrink-0" />
              <p class="font-body text-sm text-tertiary font-bold">{{ selectedEvent.location || 'TBA (待定)' }}</p>
            </div>

            <!-- 备注/提醒 (红色高亮) -->
            <div v-if="selectedEvent.notes" class="flex items-start gap-3 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mt-2">
              <AlertCircle class="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <p class="font-body text-sm text-red-400 leading-relaxed">{{ selectedEvent.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, onMounted, onUnmounted } from 'vue'
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

/* ---------------- 统一的标题字体样式（参考 Dashboard 风格） ---------------- */
const sectionContainer = 'card overflow-hidden'
const sectionHeader = 'flex items-center justify-between gap-3 px-5 py-5'
const titleWrapper = 'inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 px-3 py-1.5 rounded-xl w-fit'
const sectionIcon = 'w-4 h-4 text-primary flex-shrink-0'
const sectionTitle = 'font-bold text-primary text-sm tracking-wide'
const sectionAction = 'font-body text-xs text-tertiary/50 flex-shrink-0'

const isLoading = ref(true)
const activeDay = ref('')

const currentTime = ref(new Date().getTime())
let timeInterval = null

const unlockSchedules = {
  'Day 2': new Date('2026-08-29T06:00:00+08:00').getTime(),
  'Day 3': new Date('2026-08-30T06:00:00+08:00').getTime(),
  'Day 4': new Date('2026-08-31T06:00:00+08:00').getTime(),
  '2026-08-29': new Date('2026-08-29T06:00:00+08:00').getTime(),
  '2026-08-30': new Date('2026-08-30T06:00:00+08:00').getTime(),
  '2026-08-31': new Date('2026-08-31T06:00:00+08:00').getTime(),
}

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

function selectDay(day) {
  activeDay.value = day
}

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

function isDayLocked(day) {
  const unlockTime = unlockSchedules[day]
  if (!unlockTime) return false
  return currentTime.value < unlockTime
}

const isBooked = (id) => scheduleStore.isBooked(auth.user?.id, id)

/* ---------------- 活动类型识别与配色 ---------------- */
const TYPE_STYLES = {
  devotion: { label: '灵修时间', labelEn: 'Devotion', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-500', icon: Sparkles },
  meal: { label: '用餐时间', labelEn: 'Meal Time', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-500', icon: Utensils },
  learning: { label: '学习时间', labelEn: 'Learning', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30', dot: 'bg-violet-500', icon: BookOpen },
  free: { label: '自由时间', labelEn: 'Free Time', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', dot: 'bg-orange-500', icon: Coffee },
  departure: { label: '离营安排', labelEn: 'Departure', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-500', icon: Bus },
  must: { label: '必到活动', labelEn: 'Must Attend', badge: 'bg-red-500/15 text-red-300 border-red-500/30', dot: 'bg-red-500', icon: Users },
}

function inferType(slot) {
  const text = `${slot.name || ''} ${slot.notes || ''}`
  if (/灵修|devotion/i.test(text)) return 'devotion'
  if (/早餐|午餐|晚餐|用餐|breakfast|lunch|dinner|meal/i.test(text)) return 'meal'
  if (/查经|圣经|工作坊|团队建立|分组|分享|workshop|bible|study|team\s?building|sharing/i.test(text)) return 'learning'
  if (/自由时间|放松|free\s?time|relax/i.test(text)) return 'free'
  if (/巴士|depart|bus/i.test(text)) return 'departure'
  return 'must'
}

function typeStyle(slot) {
  const key = slot.type || inferType(slot)
  return TYPE_STYLES[key] || TYPE_STYLES.must
}

/* ---------------- 时间轴几何计算 ---------------- */
const HOUR_START = 7
const HOUR_END = 23.5
const GAP = 3

const HOUR_HEIGHT_DESKTOP = 76
const HOUR_HEIGHT_MOBILE = 88

const COMPACT_THRESHOLD = 48
const MIN_CARD_HEIGHT = 30

function timeToMinutes(timeStr) {
  const [h, m] = (timeStr || '0:0').split(':').map(Number)
  return h * 60 + m
}
function formatHour(hour) {
  return `${String(Math.floor(hour)).padStart(2, '0')}:00`
}

function buildLayout(slots, hourHeight) {
  const items = slots.map(slot => {
    const startMin = timeToMinutes(slot.time) - HOUR_START * 60
    const duration = Number(slot.duration) || 30
    const top = Math.max(0, (startMin / 60) * hourHeight)
    const naturalHeight = (duration / 60) * hourHeight - GAP
    return { slot, top, height: Math.max(MIN_CARD_HEIGHT, naturalHeight), indent: 0, compact: false }
  })

  const maxHeight = (HOUR_END - HOUR_START) * hourHeight

  for (let i = 0; i < items.length; i++) {
    const cur = items[i]
    const next = items[i + 1]

    if (cur.top + cur.height > maxHeight) {
      cur.height = Math.max(MIN_CARD_HEIGHT, maxHeight - cur.top - GAP)
    }

    if (next) {
      const available = next.top - cur.top - GAP
      if (available >= MIN_CARD_HEIGHT) {
        if (cur.height > available) cur.height = available
      } else {
        next.indent = cur.indent + 1
        if (cur.height > Math.max(available, MIN_CARD_HEIGHT)) {
          cur.height = Math.max(MIN_CARD_HEIGHT, available > 0 ? available : MIN_CARD_HEIGHT)
        }
      }
    }

    cur.compact = cur.height < COMPACT_THRESHOLD
  }

  return items
}

const timelineHours = computed(() => {
  const arr = []
  for (let h = Math.ceil(HOUR_START); h <= Math.floor(HOUR_END); h += 2) arr.push(h)
  return arr
})
const timelineHeight = computed(() => (HOUR_END - HOUR_START) * HOUR_HEIGHT_DESKTOP)
function hourToTop(hour) {
  return (hour - HOUR_START) * HOUR_HEIGHT_DESKTOP
}
const layoutCache = computed(() => {
  const map = {}
  for (const day of days.value) {
    map[day] = buildLayout(scheduleByDay(day), HOUR_HEIGHT_DESKTOP)
  }
  return map
})
function layoutForDay(day) {
  return layoutCache.value[day] || []
}

const mobileTimelineHours = computed(() => {
  const arr = []
  for (let h = Math.ceil(HOUR_START); h <= Math.floor(HOUR_END); h += 1) arr.push(h)
  return arr
})
const mobileTimelineHeight = computed(() => (HOUR_END - HOUR_START) * HOUR_HEIGHT_MOBILE)
function mobileHourToTop(hour) {
  return (hour - HOUR_START) * HOUR_HEIGHT_MOBILE
}
const mobileLayout = computed(() => {
  return buildLayout(scheduleByDay(activeDay.value), HOUR_HEIGHT_MOBILE)
})

/* ---------------- 迷你日历 ---------------- */
const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']
const calendarMonth = ref(new Date(2026, 7, 1))

const calendarMonthLabel = computed(() => {
  return `${calendarMonth.value.getFullYear()}年${calendarMonth.value.getMonth() + 1}月`
})

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
  if (match && days.value[campDates.indexOf(match)]) {
    activeDay.value = days.value[campDates.indexOf(match)]
  }
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

  if (isActiveCampDay) return 'bg-primary text-secondary font-bold'
  if (isCampDay) return 'border border-primary/50 text-primary'
  if (isToday) return 'border border-tertiary/40 text-tertiary'
  return 'text-tertiary/40'
}

/* ---------------- 弹窗逻辑 (Calendar Modal & Event Modal) ---------------- */
const isCalendarModalOpen = ref(false)
const modalActiveDay = ref('')

const isEventModalOpen = ref(false)
const selectedEvent = ref(null)

// 日历弹窗内容
const modalEvents = computed(() => {
  if (!modalActiveDay.value) return []
  return scheduleByDay(modalActiveDay.value)
})

// 处理日历点击
function handleCalendarClick(cell) {
  if (!cell) return
  const campIdx = campDates.findIndex(c => c.iso === cell.iso)
  
  if (campIdx !== -1 && days.value[campIdx]) {
    modalActiveDay.value = days.value[campIdx]
    isCalendarModalOpen.value = true
  }
}

// 底部导航
const currentModalDayIndex = computed(() => days.value.indexOf(modalActiveDay.value))
const hasPrevModalDay = computed(() => currentModalDayIndex.value > 0)
const hasNextModalDay = computed(() => currentModalDayIndex.value < days.value.length - 1)

function prevModalDay() {
  if (hasPrevModalDay.value) {
    modalActiveDay.value = days.value[currentModalDayIndex.value - 1]
  }
}

function nextModalDay() {
  if (hasNextModalDay.value) {
    modalActiveDay.value = days.value[currentModalDayIndex.value + 1]
  }
}

// 打开单个事件详情
function openEventDetails(slot) {
  selectedEvent.value = slot
  isEventModalOpen.value = true
}


/* ---------------- 生命周期 ---------------- */
onMounted(async () => {
  await scheduleStore.initSchedule()

  if (days.value.length > 0) {
    activeDay.value = days.value[0]
  }

  timeInterval = setInterval(() => {
    currentTime.value = new Date().getTime()
  }, 10000)

  isLoading.value = false
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
/* 自定义滚动条 (与弹窗内部滚动相关) */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(234, 179, 8, 0.3); /* 使用主色调透明度 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 179, 8, 0.6);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active .transform, .fade-leave-active .transform {
  transition: transform 0.3s ease;
}
.fade-enter-from .transform, .fade-leave-to .transform {
  transform: scale(0.95) translateY(10px);
}
</style>