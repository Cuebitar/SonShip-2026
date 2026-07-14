<template>
  <div class="page-container bg-[#0a0a0d] min-h-screen pb-16 font-sans">
    
    <!-- ========================================== -->
    <!-- HERO HEADER (完美还原截图顶部)                -->
    <!-- ========================================== -->
    <div class="relative w-full h-[280px] md:h-[320px] overflow-hidden flex flex-col justify-center border-b border-white/10">
      <div class="absolute inset-0 bg-[url('~/assets/background/campFire.jpg')] bg-cover bg-center opacity-30 mask-image-b"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#0a0a0d] via-[#0a0a0d]/90 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] to-transparent"></div>
      
      <div class="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 max-w-[1600px] mx-auto w-full px-6 md:px-12 mt-8">
        
        <!-- Left: Titles -->
        <div class="text-center xl:text-left">
          <p class="text-tertiary/60 text-xs font-bold tracking-widest uppercase mb-2">Admin Control Panel</p>
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tight uppercase leading-none drop-shadow-lg" style="font-family: impact, sans-serif; letter-spacing: 2px;">
            CAMP GAMES
          </h1>
          <h2 class="text-3xl md:text-5xl font-black text-yellow-500 italic mt-[-5px] md:mt-[-10px] drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            Control Center
          </h2>
          <p class="text-tertiary/60 text-sm mt-3">Manage announcements, camp schedules, teams and game marks.</p>
        </div>
        
        <!-- Right: Stats Cards -->
        <div class="flex flex-wrap justify-center xl:justify-end gap-4 mt-6 xl:mt-0">
          <div class="bg-[#111218]/80 border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md shadow-lg min-w-[160px]">
            <Users class="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div>
              <div class="text-2xl font-black text-white leading-none">{{ teamsList.length }}</div>
              <div class="text-xs text-white/50 mt-1">Teams<br><span class="text-yellow-500 font-bold">Active</span></div>
            </div>
          </div>
          <div class="bg-[#111218]/80 border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md shadow-lg min-w-[160px]">
            <Swords class="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div>
              <div class="text-2xl font-black text-white leading-none">{{ GAME_NAMES.length }}</div>
              <div class="text-xs text-white/50 mt-1">Games<br><span class="text-yellow-500 font-bold">Ongoing</span></div>
            </div>
          </div>
          <div class="bg-[#111218]/80 border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md shadow-lg min-w-[160px]">
            <CalendarIcon class="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div>
              <div class="text-2xl font-black text-white leading-none">{{ calendarEvents.length }}</div>
              <div class="text-xs text-white/50 mt-1">Events<br><span class="text-yellow-500 font-bold">Scheduled</span></div>
            </div>
          </div>
          <div class="bg-[#111218]/80 border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md shadow-lg min-w-[180px]">
            <Trophy class="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div>
              <div class="text-2xl font-black text-white leading-none">{{ totalPointsAwarded }}</div>
              <div class="text-xs text-white/50 mt-1">Total Points<br><span class="text-yellow-500 font-bold">Awarded</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TABS NAVIGATION                            -->
    <!-- ========================================== -->
    <div class="max-w-[1600px] mx-auto px-6 mt-8">
      <div class="flex flex-wrap gap-2 bg-[#111218] p-2 rounded-2xl border border-white/5 w-fit shadow-xl">
        <button @click="activeTab = 'overview'" :class="['px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2', activeTab === 'overview' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-tertiary hover:bg-white/5']">
          <LayoutDashboard class="w-4 h-4" /> Overview
        </button>
        <button @click="activeTab = 'announcements'" :class="['px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2', activeTab === 'announcements' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-tertiary hover:bg-white/5']">
          <Megaphone class="w-4 h-4" /> Announcements
        </button>
        <button @click="activeTab = 'calendar'" :class="['px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2', activeTab === 'calendar' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-tertiary hover:bg-white/5']">
          <CalendarIcon class="w-4 h-4" /> Plan Calendar
        </button>
        <button @click="activeTab = 'teams'" :class="['px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2', activeTab === 'teams' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-tertiary hover:bg-white/5']">
          <Users class="w-4 h-4" /> Manage Teams
        </button>
        <button @click="activeTab = 'marks'" :class="['px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2', activeTab === 'marks' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-tertiary hover:bg-white/5']">
          <Trophy class="w-4 h-4" /> Manage Marks
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB: OVERVIEW (完美还原截图的 Dashboard)    -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'overview' && hasMounted" class="max-w-[1600px] mx-auto px-6 mt-8 space-y-6">
      
      <div class="grid grid-cols-1 xl:grid-cols-[400px_1fr] 2xl:grid-cols-[480px_1fr] gap-6">
        
        <!-- Left: TEAM SCOREBOARD -->
        <div class="bg-[#111218] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col">
          <div class="flex items-center gap-2 mb-8">
            <Trophy class="w-5 h-5 text-yellow-500" />
            <h3 class="font-bold text-yellow-500 uppercase tracking-widest text-sm">Team Scoreboard</h3>
          </div>

          <!-- Top 3 Podium (Mini Version) -->
          <div v-if="sortedLeaderboardData.length >= 3" class="flex items-end justify-center gap-3 mb-8">
            <!-- Rank 2 -->
            <div class="w-[30%] bg-gradient-to-b from-[#1a1c29] to-transparent border border-gray-400/30 rounded-2xl p-4 flex flex-col items-center text-center relative pt-8">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-gray-300 to-gray-500 flex items-center justify-center font-bold text-black clip-ribbon text-xs shadow-lg">2</div>
              <Shield class="w-8 h-8 text-gray-400 mb-2" />
              <p class="font-bold text-white text-xs truncate w-full">{{ sortedLeaderboardData[1].teamName }}</p>
              <p class="font-black text-gray-300 text-sm mt-1">{{ sortedLeaderboardData[1].score }} <span class="text-[8px] font-normal text-white/50">PTS</span></p>
            </div>
            <!-- Rank 1 -->
            <div class="w-[35%] bg-gradient-to-b from-[#2a2215] to-transparent border border-yellow-500/50 rounded-2xl p-5 flex flex-col items-center text-center relative pt-10 shadow-[0_0_30px_rgba(234,179,8,0.1)] z-10 -translate-y-2">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-10 bg-gradient-to-b from-yellow-300 to-yellow-600 flex items-center justify-center font-black text-black clip-ribbon-center text-sm shadow-lg shadow-yellow-500/50">1</div>
              <Crown class="w-10 h-10 text-yellow-500 mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <p class="font-bold text-white text-sm truncate w-full">{{ sortedLeaderboardData[0].teamName }}</p>
              <p class="font-black text-yellow-500 text-lg mt-1">{{ sortedLeaderboardData[0].score }} <span class="text-[9px] font-normal text-white/50">PTS</span></p>
            </div>
            <!-- Rank 3 -->
            <div class="w-[30%] bg-gradient-to-b from-[#241a16] to-transparent border border-orange-700/50 rounded-2xl p-4 flex flex-col items-center text-center relative pt-8">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-orange-400 to-orange-700 flex items-center justify-center font-bold text-black clip-ribbon text-xs shadow-lg">3</div>
              <Shield class="w-8 h-8 text-orange-500 mb-2" />
              <p class="font-bold text-white text-xs truncate w-full">{{ sortedLeaderboardData[2].teamName }}</p>
              <p class="font-black text-orange-500 text-sm mt-1">{{ sortedLeaderboardData[2].score }} <span class="text-[8px] font-normal text-white/50">PTS</span></p>
            </div>
          </div>

          <!-- Rank 4+ -->
          <div class="space-y-2 flex-1">
            <div v-for="(rank, idx) in sortedLeaderboardData.slice(3, 8)" :key="rank.teamName" class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div class="flex items-center gap-4">
                <span class="w-4 text-center font-bold text-white/30">{{ idx + 4 }}</span>
                <Shield class="w-5 h-5 text-white/10" />
                <span class="font-bold text-white/90 text-sm">{{ rank.teamName }}</span>
              </div>
              <span class="font-black text-white/60 text-sm">{{ rank.score }} <span class="text-[9px] font-normal">PTS</span></span>
            </div>
          </div>

          <button @click="activeTab = 'marks'" class="w-full mt-6 py-4 border-t border-white/5 text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors flex items-center justify-center gap-2">
            <Trophy class="w-4 h-4" /> View Full Leaderboard <ChevronRight class="w-3 h-3" />
          </button>
        </div>

        <!-- Right Column: Announcements & Events -->
        <div class="space-y-6">
          
          <!-- RECENT ANNOUNCEMENTS -->
          <div class="bg-[#111218] border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <Megaphone class="w-5 h-5 text-yellow-500" />
                <h3 class="font-bold text-yellow-500 uppercase tracking-widest text-sm">Recent Announcements</h3>
              </div>
              <button @click="activeTab = 'announcements'; openAnnModal()" class="text-xs font-bold text-yellow-500 hover:text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 transition-all">
                <Plus class="w-3 h-3" /> New Announcement
              </button>
            </div>

            <div class="space-y-1">
              <div v-for="(ann, idx) in recentAnnouncements" :key="ann.id" class="flex items-start justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                <div class="flex items-start gap-4 flex-1">
                  <div class="mt-1 p-2 bg-dark rounded-lg border border-white/10 shrink-0">
                    <Megaphone class="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-sm flex items-center gap-2">
                      {{ ann.title }}
                      <span v-if="idx === 0" class="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
                    </h4>
                    <p class="text-xs text-white/50 mt-1 line-clamp-1 max-w-md">{{ ann.description }}</p>
                  </div>
                </div>
                <div class="flex flex-col items-end shrink-0 pl-4 gap-2">
                  <span class="text-[11px] text-white/40 text-right">{{ formatPublishTime(ann.createdAt, ann.date) }}</span>
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openAnnModal(ann)" class="text-yellow-500 hover:text-yellow-400"><Edit class="w-3.5 h-3.5" /></button>
                    <button @click="deleteAnnouncement(ann.id)" class="text-red-500 hover:text-red-400"><Trash2 class="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
              <div v-if="recentAnnouncements.length === 0" class="text-center py-8 text-white/40 text-sm">No recent announcements.</div>
            </div>

            <div class="mt-2 text-right">
              <button @click="activeTab = 'announcements'" class="text-xs font-bold text-white/40 hover:text-white transition-colors">
                View All Announcements <ChevronRight class="w-3 h-3 inline" />
              </button>
            </div>
          </div>

          <!-- UPCOMING EVENTS -->
          <div class="bg-[#111218] border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <CalendarIcon class="w-5 h-5 text-yellow-500" />
                <h3 class="font-bold text-yellow-500 uppercase tracking-widest text-sm">Upcoming Events</h3>
              </div>
              <button @click="activeTab = 'calendar'; openCalModal()" class="text-xs font-bold text-yellow-500 hover:text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 transition-all">
                <Plus class="w-3 h-3" /> Add Event
              </button>
            </div>

            <div class="space-y-1">
              <div v-for="event in upcomingEvents" :key="event.id" class="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                <div class="flex items-center gap-5 flex-1">
                  <!-- Date Block -->
                  <div class="flex flex-col items-center justify-center bg-dark border border-white/10 rounded-xl w-12 h-12 shrink-0">
                    <span class="text-[9px] text-yellow-500 font-bold uppercase">{{ getMonthStr(event.date) }}</span>
                    <span class="text-lg font-black text-white leading-none">{{ getDayStr(event.date) }}</span>
                  </div>
                  <!-- Details -->
                  <div class="flex-1">
                    <h4 class="font-bold text-white text-sm">{{ event.name }}</h4>
                    <p class="text-[11px] text-white/50 mt-1 flex items-center gap-1"><MapPin class="w-3 h-3" /> {{ event.location || 'TBA' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6 shrink-0 pl-4">
                  <span class="text-xs text-white/70 w-32 hidden sm:block">{{ event.time }} <span class="text-[10px] text-white/30 ml-1">({{ event.duration }}m)</span></span>
                  <span class="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Upcoming</span>
                  <div class="flex items-center gap-2 w-12 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openCalModal(event)" class="text-yellow-500 hover:text-yellow-400"><Edit class="w-3.5 h-3.5" /></button>
                    <button @click="deleteCalendarEvent(event.id)" class="text-red-500 hover:text-red-400"><Trash2 class="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
              <div v-if="upcomingEvents.length === 0" class="text-center py-8 text-white/40 text-sm">No upcoming events scheduled.</div>
            </div>

            <div class="mt-2 text-right">
              <button @click="activeTab = 'calendar'" class="text-xs font-bold text-white/40 hover:text-white transition-colors">
                View Full Calendar <ChevronRight class="w-3 h-3 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom: MARKS OVERVIEW -->
      <div class="bg-[#111218] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl mt-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div class="flex-1 w-full">
          <div class="flex items-center gap-2 mb-6">
            <LineChart class="w-5 h-5 text-yellow-500" />
            <h3 class="font-bold text-yellow-500 uppercase tracking-widest text-sm">Marks Overview</h3>
            <span class="text-[10px] text-white/40 ml-2">Total points distribution by game</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div v-for="game in GAME_NAMES" :key="game" class="flex items-center gap-4">
              <div class="w-12 h-12 bg-dark rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                <Gamepad2 class="w-6 h-6 text-white/40" />
              </div>
              <div>
                <p class="font-bold text-white text-sm truncate">{{ game }}</p>
                <p class="font-black text-white text-lg mt-0.5">{{ getTotalPointsForGame(game) }} <span class="text-[9px] font-normal text-white/40">PTS</span></p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-l border-white/10 pl-8 flex items-center gap-6 shrink-0 w-full lg:w-auto justify-center lg:justify-start">
          <div class="text-right">
            <p class="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">Total Points Awarded</p>
            <p class="text-5xl font-black text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">{{ totalPointsAwarded }} <span class="text-sm font-normal text-white/60">PTS</span></p>
          </div>
          <Trophy class="w-20 h-20 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)] opacity-80" />
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 下方内容：保持原本的后台管理功能组件         -->
    <!-- 仅在进入对应 Tab 时显示                     -->
    <!-- ========================================== -->
    <section v-if="hasMounted && activeTab !== 'overview'" class="max-w-[1600px] mx-auto px-6 mt-6">
      
      <!-- TAB 1: ANNOUNCEMENTS -->
      <div v-if="activeTab === 'announcements'" class="space-y-4">
        <!-- 保持原有 Announcement 管理代码不变 -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 class="font-heading font-bold text-lg md:text-xl text-white">Broadcast Notifications</h2>
          <button @click="openAnnModal()" class="btn-primary btn-sm flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus class="w-4 h-4" /> New Announcement
          </button>
        </div>
        <!-- 列表... -->
        <div class="card p-0 overflow-x-auto hidden md:block">
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="p-4 font-heading text-primary font-bold text-sm">Title</th>
                <th class="p-4 font-heading text-primary font-bold text-sm">Publish Date</th>
                <th class="p-4 font-heading text-primary font-bold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ann in announcements" :key="ann.id" class="border-b border-white/5 hover:bg-white/5">
                <td class="p-4">
                  <div class="font-bold text-white">{{ ann.title }}</div>
                  <div class="text-xs text-tertiary/70 truncate max-w-md">{{ ann.description }}</div>
                </td>
                <td class="p-4 text-sm text-tertiary">{{ formatPublishTime(ann.createdAt, ann.date) }}</td>
                <td class="p-4 text-right">
                  <button @click="openAnnModal(ann)" class="text-primary hover:text-white px-2 transition-colors"><Edit class="w-4 h-4" /></button>
                  <button @click="deleteAnnouncement(ann.id)" class="text-red-400 hover:text-red-300 px-2 transition-colors"><Trash2 class="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: CALENDAR SCHEDULE -->
      <div v-if="activeTab === 'calendar'" class="space-y-4">
        <!-- 保持原有 Calendar 管理代码不变 -->
        <div class="flex flex-col gap-4 mb-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 class="font-heading font-bold text-lg md:text-xl text-white">Camp Schedule</h2>
            <button @click="openCalModal()" class="btn-primary btn-sm flex items-center justify-center gap-2 w-full sm:w-auto">
              <Plus class="w-4 h-4" /> Add Event
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <div class="flex items-center gap-2 flex-1 min-w-[120px]">
              <label class="text-xs font-bold text-primary">Day:</label>
              <select v-model="filterDay" class="input py-1.5 px-2 text-xs bg-dark/50 border-white/10 w-full">
                <option value="All">All Days</option>
                <option v-for="day in availableDays" :key="day" :value="day">{{ day }}</option>
              </select>
            </div>
            <div class="flex items-center gap-2 flex-1 min-w-[130px]">
              <label class="text-xs font-bold text-primary">Location:</label>
              <select v-model="filterLocation" class="input py-1.5 px-2 text-xs bg-dark/50 border-white/10 w-full">
                <option value="All">All Locations</option>
                <option v-for="loc in availableLocations" :key="loc" :value="loc">{{ loc || 'TBA' }}</option>
              </select>
            </div>
          </div>
        </div>
        <!-- 表格... -->
        <div class="card p-0 overflow-x-auto hidden lg:block">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="p-4 font-heading text-primary font-bold text-sm">Day & Time</th>
                <th class="p-4 font-heading text-primary font-bold text-sm">Event Name</th>
                <th class="p-4 font-heading text-primary font-bold text-sm">Location & Duration</th>
                <th class="p-4 font-heading text-primary font-bold text-sm">Notes</th>
                <th class="p-4 font-heading text-primary font-bold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filteredCalendarEvents" :key="event.id" class="border-b border-white/5 hover:bg-white/5">
                <td class="p-4">
                  <div class="font-bold text-white">{{ event.day }} <span class="text-xs text-tertiary/70 ml-1">({{ event.date }})</span></div>
                  <div class="text-sm text-primary">{{ event.time }}</div>
                </td>
                <td class="p-4 font-bold text-white">{{ event.name }}</td>
                <td class="p-4">
                  <div class="text-sm text-tertiary flex items-center gap-1"><MapPin class="w-3 h-3"/> {{ event.location || 'TBA' }}</div>
                  <div class="text-xs text-tertiary/60 mt-1">{{ event.duration }} mins</div>
                </td>
                <td class="p-4">
                  <div v-if="event.notes" class="text-xs text-red-400 flex items-center gap-1 bg-red-500/10 inline-flex px-2 py-0.5 rounded"><AlertCircle class="w-3 h-3" /> {{ event.notes }}</div>
                  <span v-else class="text-tertiary/40">-</span>
                </td>
                <td class="p-4 text-right">
                  <button @click="openCalModal(event)" class="text-primary hover:text-white px-2 transition-colors"><Edit class="w-4 h-4" /></button>
                  <button @click="deleteCalendarEvent(event.id)" class="text-red-400 hover:text-red-300 px-2 transition-colors"><Trash2 class="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: MANAGE TEAMS -->
      <div v-if="activeTab === 'teams'" class="space-y-6">
        <!-- 保持原有 Team 管理代码不变 -->
        <div class="flex items-center justify-between mb-2">
          <div>
            <h2 class="font-heading font-bold text-lg md:text-xl text-white">Manage Teams</h2>
            <p class="text-sm text-tertiary/60 font-body mt-1">Review existing teams or create a new one.</p>
          </div>
          <button type="button" @click="addNewTeam" class="btn-primary py-2 px-4 text-sm w-auto flex items-center gap-2">
            <Plus class="w-4 h-4" /> Add Team
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="team in teamsList" :key="team.name" class="card p-5 border border-white/10 bg-white/5 flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 class="text-lg font-heading font-bold text-primary truncate" :title="team.name">{{ team.name }}</h3>
                <button @click="editTeam(team)" class="px-2.5 py-1.5 bg-white/5 rounded-lg text-tertiary hover:text-primary hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-bold"><Edit2 class="w-3.5 h-3.5" /> Manage</button>
              </div>
              <div class="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                <div v-for="member in team.members" :key="member.id" class="flex items-center justify-between bg-dark/40 rounded-lg px-3 py-1.5">
                  <span class="text-xs font-body text-tertiary truncate">{{ member.fullName }}</span>
                  <span v-if="member.gender" class="text-[9px] uppercase bg-white/10 px-1.5 py-0.5 rounded text-tertiary/60">{{ member.gender }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-tertiary/50">
              <span>Total Members</span>
              <strong class="text-white font-heading font-bold bg-white/5 px-2 py-0.5 rounded">{{ team.members.length }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: MANAGE MARKS -->
      <div v-if="activeTab === 'marks'" class="space-y-8">
        <!-- 保持原有分数管理代码完全不变 -->
        <div>
          <h2 class="font-heading font-bold text-xl text-white">Manage Games Mark</h2>
          <p class="text-xs text-tertiary/60 mt-1">Record scores for teams. The system automatically calculates total scores and independent leaderboards.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="card p-6 border-primary/20 bg-primary/5">
              <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2"><Gamepad2 class="w-5 h-5" /> Score Entry Console</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="block text-xs font-bold text-primary/80 mb-1.5 uppercase">1. Select Team(s)</label>
                  <div class="bg-dark border border-white/10 rounded-xl p-3 max-h-[160px] overflow-y-auto grid grid-cols-2 gap-2">
                    <label v-for="team in teamsList" :key="team.name" class="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1.5 rounded transition-colors">
                      <input type="checkbox" :value="team.name" v-model="selectedScoreTeams" class="w-4 h-4 rounded border-white/20 bg-dark/50 text-primary focus:ring-primary focus:ring-offset-dark" />
                      <span class="text-sm text-white truncate">{{ team.name }}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-primary/80 mb-1.5 uppercase">2. Select Game</label>
                  <select v-model="selectedScoreGame" class="input py-2.5 bg-dark border-white/10 text-white w-full">
                    <option v-for="game in GAME_NAMES" :key="game" :value="game">{{ game }}</option>
                  </select>
                </div>
              </div>

              <div v-if="selectedScoreTeams.length > 0" class="space-y-4">
                <label class="block text-xs font-bold text-primary/80 uppercase">3. Adjust Score (Current Game: <span class="text-white">{{ selectedScoreGame }}</span>)</label>
                <div class="flex flex-wrap gap-3">
                  <button @click="adjustMark(50)" class="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-bold hover:bg-green-500/30 transition-all flex-1 text-center">+50 Pts</button>
                  <button @click="adjustMark(10)" class="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-sm font-bold hover:bg-green-500/20 transition-all flex-1 text-center">+10 Pts</button>
                  <button @click="adjustMark(-10)" class="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all flex-1 text-center">-10 Pts</button>
                  <button @click="adjustMark(-50)" class="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-all flex-1 text-center">-50 Pts</button>
                </div>
                <div class="flex gap-2 items-center pt-2">
                  <input v-model.number="customMarkValue" type="number" class="input py-2 bg-dark/60 text-sm" placeholder="Custom score (e.g. 25 or -15)" />
                  <button @click="adjustMark(customMarkValue)" class="btn-primary py-2 px-5 text-sm w-auto shrink-0">Submit</button>
                </div>
              </div>
            </div>

            <div class="card p-0 overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-white/10 bg-white/5 font-heading text-primary">
                    <th class="p-4">Team</th>
                    <th v-for="game in GAME_NAMES" :key="game" class="p-4 font-normal text-xs">{{ game }}</th>
                    <th class="p-4 text-right">Total Score</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5 font-body">
                  <tr v-for="team in teamsList" :key="team.name" class="hover:bg-white/5">
                    <td class="p-4 font-bold text-white">{{ team.name }}</td>
                    <td v-for="game in GAME_NAMES" :key="game" class="p-4 text-tertiary">{{ getGameScore(team.name, game) }}</td>
                    <td class="p-4 text-right text-primary font-bold font-heading text-base">{{ getTeamTotalScore(team.name) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="space-y-6">
            <div class="card p-4 border border-white/10">
              <label class="block text-xs font-bold text-primary mb-2 uppercase">📊 Switch Leaderboard View</label>
              <select v-model="activeLeaderboardView" class="w-full bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-tertiary focus:text-white outline-none">
                <option value="Total">🏆 Total Score Leaderboard</option>
                <option v-for="game in GAME_NAMES" :key="game" :value="game">🎮 {{ game }} Leaderboard</option>
              </select>
            </div>
            <div class="card p-5 border border-white/5 bg-white/5">
              <h3 class="font-heading font-black text-sm text-primary uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                {{ activeLeaderboardView === 'Total' ? '🏆 Overall Leaderboard' : `🎮 ${activeLeaderboardView} Ranking` }}
              </h3>
              <div class="space-y-2">
                <div v-for="(rank, idx) in sortedLeaderboardData" :key="rank.teamName" class="flex items-center justify-between p-2.5 rounded-xl bg-dark/40 border border-white/5">
                  <div class="flex items-center gap-3">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center font-heading text-xs font-bold" :class="idx === 0 ? 'bg-yellow-400 text-dark font-black' : idx === 1 ? 'bg-slate-300 text-dark' : idx === 2 ? 'bg-amber-600 text-white' : 'text-tertiary/40'">{{ idx + 1 }}</span>
                    <span class="text-sm text-white font-bold truncate max-w-[120px]">{{ rank.teamName }}</span>
                  </div>
                  <span class="font-heading font-bold text-sm text-primary">{{ rank.score }} <span class="text-[9px] text-tertiary/40 uppercase">pts</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="!hasMounted" class="text-center py-20 text-tertiary animate-pulse">
      Loading data from database...
    </section>

    <!-- Modals (保持原有 Modal 代码不变) -->
    <!-- Announcement Modal -->
    <Transition name="modal">
      <div v-if="showAnnModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showAnnModal = false"></div>
        <div class="relative card w-full max-w-lg p-5 shadow-2xl border-primary/30 z-50 bg-[#111218]">
          <h3 class="font-bold text-lg text-white mb-4">{{ annForm.id ? 'Edit Announcement' : 'New Announcement' }}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-primary mb-1">Title</label>
              <input v-model="annForm.title" type="text" class="input w-full bg-dark/50" />
            </div>
            <div>
              <label class="block text-xs font-bold text-primary mb-1">Description</label>
              <textarea v-model="annForm.description" rows="4" class="input w-full bg-dark/50"></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="showAnnModal = false" class="px-4 py-2 text-sm text-tertiary">Cancel</button>
            <button @click="saveAnnouncement" class="btn-primary px-6 py-2">Save</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Calendar Modal -->
    <Transition name="modal">
      <div v-if="showCalModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showCalModal = false"></div>
        <div class="relative card w-full max-w-2xl p-5 shadow-2xl border-primary/30 z-50 bg-[#111218] max-h-[90vh] overflow-y-auto">
          <h3 class="font-bold text-lg text-white mb-4">{{ calForm.id ? 'Edit Event' : 'Add Event' }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-primary mb-1">Event Name</label>
              <input v-model="calForm.name" type="text" class="input w-full bg-dark/50" />
            </div>
            <div>
              <label class="block text-xs font-bold text-primary mb-1">Camp Day</label>
              <select v-model="calForm.day" class="input w-full bg-dark/50">
                <option value="Day 1">Day 1 (28 Aug)</option>
                <option value="Day 2">Day 2 (29 Aug)</option>
                <option value="Day 3">Day 3 (30 Aug)</option>
                <option value="Day 4">Day 4 (31 Aug)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-primary mb-1">Exact Date</label>
              <input v-model="calForm.date" type="date" class="input w-full bg-dark/50" />
            </div>
            <div>
              <label class="block text-xs font-bold text-primary mb-1">Start Time</label>
              <input v-model="calForm.time" type="time" class="input w-full bg-dark/50" />
            </div>
            <div>
              <label class="block text-xs font-bold text-primary mb-1">Duration (Minutes)</label>
              <input v-model="calForm.duration" type="number" class="input w-full bg-dark/50" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-primary mb-1">Location</label>
              <input v-model="calForm.location" type="text" class="input w-full bg-dark/50" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-red-400 mb-1">Important Notes</label>
              <textarea v-model="calForm.notes" rows="2" class="input w-full bg-dark/50 border-red-500/30"></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="showCalModal = false" class="px-4 py-2 text-sm text-tertiary">Cancel</button>
            <button @click="saveCalendar" class="btn-primary px-6 py-2">Save</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Team Modal -->
    <Transition name="modal">
      <div v-if="showTeamModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showTeamModal = false"></div>
        <div class="relative card w-full max-w-lg p-6 shadow-2xl border-primary/30 z-50 bg-[#111218]">
          <h3 class="font-bold text-xl text-primary mb-4">{{ isEditingExistingTeam ? 'Edit Team: ' + modalTeamName : 'Create New Team' }}</h3>
          <div class="space-y-4">
            <input v-model="modalTeamName" type="text" class="input w-full bg-dark/50 text-white font-bold" placeholder="Team Name" />
            <input v-model="teamModalSearch" type="text" class="input w-full bg-dark/50 text-sm" placeholder="🔍 Search campers..." />
            <div class="border border-white/10 rounded-xl bg-white/5 max-h-[40vh] overflow-y-auto">
              <label class="flex items-center gap-3 p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer">
                <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" class="accent-primary" />
                <span class="text-sm font-bold text-primary">Select All</span>
              </label>
              <label v-for="camper in filteredModalCampers" :key="camper.id" class="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0">
                <input type="checkbox" :value="camper.id" v-model="selectedCamperIds" class="accent-primary w-4 h-4" />
                <div class="flex flex-col">
                  <span class="text-sm text-white font-bold">{{ camper.fullName }}</span>
                  <span class="text-[10px] text-tertiary">{{ camper.group || 'Unassigned' }}</span>
                </div>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button @click="showTeamModal = false" class="text-sm text-tertiary">Cancel</button>
            <button @click="saveTeamModal" class="btn-primary px-6 py-2 text-sm">Save Changes</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false }) 

import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useCampersStore } from '~/stores/campers'
import { 
  Bell, Calendar as CalendarIcon, Plus, Edit, Trash2, AlertCircle, 
  MapPin, Clock, Users, Edit2, X, Trophy, Gamepad2, Megaphone, LayoutDashboard,
  Shield, Crown, ChevronRight, Swords, LineChart
} from 'lucide-vue-next'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { useDb } from '~/composable/firebase' 

const auth = useAuthStore()
const campersStore = useCampersStore() 
const router = useRouter()

const hasMounted = ref(false)
const isSaving = ref(false)
// 默认进入概览界面
const activeTab = ref('overview') 

const announcements = ref([])
const calendarEvents = ref([])

// 新增 Dashboard 专用的 Computed Properties
const recentAnnouncements = computed(() => announcements.value.slice(0, 3))
const upcomingEvents = computed(() => calendarEvents.value.slice(0, 3))

function getMonthStr(dateStr) {
  if(!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', { month: 'short' }).toUpperCase();
}
function getDayStr(dateStr) {
  if(!dateStr) return '';
  return new Date(dateStr).getDate();
}

const GAME_NAMES = ['破冰游戏', '寻宝大作战', '竞技拔河', '终极密室']; 
const firebaseScores = ref([]); 

const selectedScoreTeams = ref([]);
const selectedScoreGame = ref('破冰游戏');
const customMarkValue = ref(null);
const activeLeaderboardView = ref('Total'); 

// 顶部总分统计
const totalPointsAwarded = computed(() => {
  return firebaseScores.value.reduce((sum, team) => sum + (team.totalScore || 0), 0)
})

function getTotalPointsForGame(gameName) {
  return firebaseScores.value.reduce((sum, team) => sum + (team.scores?.[gameName] || 0), 0)
}

onMounted(async () =>  {
  if (!auth.user?.is_admin) {
    return router.replace('/dashboard')
  }
  const db = useDb()
  try {
    const promises = [campersStore.initCampers()] 
    if (db) {
      promises.push(
        getDocs(collection(db, "announcements")).then(snap => {
          announcements.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          announcements.value.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        }),
        getDocs(collection(db, "schedules")).then(snap => {
          calendarEvents.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          calendarEvents.value.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
        }),
        getDocs(collection(db, "game_scores")).then(snap => {
          firebaseScores.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        })
      )
    }
    await Promise.all(promises)
  } catch (error) {
    console.error("Error fetching data:", error)
  }
  hasMounted.value = true
})

// ==========================================
// 逻辑部分 (保留原有功能完全不变)
// ==========================================
const filterDay = ref('All')
const filterLocation = ref('All')

const availableDays = computed(() => {
  const days = new Set(calendarEvents.value.map(e => e.day).filter(Boolean))
  return Array.from(days).sort((a, b) => a.localeCompare(b))
})

const availableLocations = computed(() => {
  const locs = new Set(calendarEvents.value.map(e => e.location).filter(Boolean))
  return Array.from(locs).sort((a, b) => a.localeCompare(b))
})

const filteredCalendarEvents = computed(() => {
  return calendarEvents.value.filter(e => {
    const matchDay = filterDay.value === 'All' || e.day === filterDay.value
    const matchLocation = filterLocation.value === 'All' || e.location === filterLocation.value
    return matchDay && matchLocation
  })
})

function formatPublishTime(timestamp, fallbackDate) {
  if (!timestamp) return fallbackDate || '';
  return new Date(timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

const showAnnModal = ref(false)
const annForm = reactive({ id: null, title: '', description: '', date: '', createdAt: null })
const showCalModal = ref(false)
const calForm = reactive({ id: null, name: '', day: 'Day 1', date: '2026-08-28', time: '', location: '', duration: 60, notes: '', notifyChange: false })

function openAnnModal(ann = null) {
  if (ann) Object.assign(annForm, ann)
  else Object.assign(annForm, { id: null, title: '', description: '', date: '', createdAt: null })
  showAnnModal.value = true
}

async function saveAnnouncement() {
  if (!annForm.title || !annForm.description) return alert("Title and Description are required!")
  const db = useDb()
  if (!db) return
  isSaving.value = true
  const formattedDate = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
  const payload = { title: annForm.title, description: annForm.description, date: annForm.id ? annForm.date : formattedDate, createdAt: annForm.id ? (annForm.createdAt || Date.now()) : Date.now() }
  try {
    if (annForm.id) {
      await updateDoc(doc(db, "announcements", annForm.id), payload)
      const index = announcements.value.findIndex(a => a.id === annForm.id)
      if (index !== -1) announcements.value[index] = { id: annForm.id, ...payload }
    } else {
      const docRef = await addDoc(collection(db, "announcements"), payload)
      announcements.value.unshift({ id: docRef.id, ...payload }) 
    }
    announcements.value.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    showAnnModal.value = false
  } catch (error) { console.error("Error saving announcement:", error) } finally { isSaving.value = false }
}

async function deleteAnnouncement(id) {
  if (!confirm('Are you sure you want to delete this announcement?')) return
  const db = useDb()
  if (!db) return
  try { await deleteDoc(doc(db, "announcements", id)); announcements.value = announcements.value.filter(a => a.id !== id) } catch (error) {}
}

function openCalModal(event = null) {
  if (event) Object.assign(calForm, event, { notifyChange: false }) 
  else Object.assign(calForm, { id: null, name: '', day: 'Day 1', date: '2026-08-28', time: '14:00', location: '', duration: 60, notes: '', notifyChange: false })
  showCalModal.value = true
}

async function saveCalendar() {
  if (!calForm.name || !calForm.date || !calForm.time) return alert("Name, Date, and Time are required!")
  const db = useDb()
  if (!db) return
  isSaving.value = true
  const payload = { name: calForm.name, day: calForm.day, date: calForm.date, time: calForm.time, location: calForm.location, duration: Number(calForm.duration), notes: calForm.notes }
  try {
    if (calForm.id) {
      await updateDoc(doc(db, "schedules", calForm.id), payload)
      const index = calendarEvents.value.findIndex(e => e.id === calForm.id)
      if (index !== -1) calendarEvents.value[index] = { id: calForm.id, ...payload }
    } else {
      const docRef = await addDoc(collection(db, "schedules"), payload)
      calendarEvents.value.push({ id: docRef.id, ...payload })
    }
    calendarEvents.value.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
    showCalModal.value = false
  } catch (error) {} finally { isSaving.value = false }
}

async function deleteCalendarEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return
  const db = useDb()
  if (!db) return
  try { await deleteDoc(doc(db, "schedules", id)); calendarEvents.value = calendarEvents.value.filter(e => e.id !== id) } catch (error) {}
}

const records = computed(() =>
  campersStore.campers.map((c) => ({
    id: c.id, fullName: c.name, gender: c.gender, group: c.group || "", status: c.status, room_name: c.room_name, transport: c.transport, preferred_language: c.preferred_language, secret_identity: c.secret_identity, secretAngel: c.secret_angel?.id ?? '', iceBreakingTarget: c.ice_breaking?.target ?? '', iceBreakingRiddle: c.ice_breaking?.riddle ?? '',
  }))
);

const showTeamModal = ref(false);
const modalTeamName = ref('');
const teamModalSearch = ref('');
const selectedCamperIds = ref([]);
const isEditingExistingTeam = ref(false);
const originalTeamName = ref('');
const manualEmptyTeams = ref([]);

const teamsList = computed(() => {
  const map = new Map();
  records.value.forEach(record => {
    if (record.group) {
      if (!map.has(record.group)) map.set(record.group, { name: record.group, members: [] });
      map.get(record.group).members.push(record);
    }
  });
  manualEmptyTeams.value.forEach(tName => { if (!map.has(tName)) map.set(tName, { name: tName, members: [] }); });
  return Array.from(map.values());
});

const filteredModalCampers = computed(() => {
  if (!teamModalSearch.value.trim()) return records.value;
  return records.value.filter(c => c.fullName.toLowerCase().includes(teamModalSearch.value.toLowerCase()));
});

function addNewTeam() {
  isEditingExistingTeam.value = false; originalTeamName.value = ''; modalTeamName.value = ''; teamModalSearch.value = ''; selectedCamperIds.value = []; showTeamModal.value = true;
}

function editTeam(team) {
  isEditingExistingTeam.value = true; originalTeamName.value = team.name; modalTeamName.value = team.name; teamModalSearch.value = ''; selectedCamperIds.value = team.members.map(m => m.id); showTeamModal.value = true;
}

const allSelected = computed(() => filteredModalCampers.value.length > 0 && selectedCamperIds.value.length === filteredModalCampers.value.length);
function toggleSelectAll(event) {
  const ids = filteredModalCampers.value.map(c => c.id);
  selectedCamperIds.value = event.target.checked ? [...new Set([...selectedCamperIds.value, ...ids])] : selectedCamperIds.value.filter(id => !ids.includes(id));
}

async function saveTeamModal() {
  const targetTeamName = modalTeamName.value.trim();
  if (!targetTeamName) return alert('Please enter a team name!');
  hasMounted.value = false; 
  if (isEditingExistingTeam.value && targetTeamName !== originalTeamName.value) {
    const oldMembers = records.value.filter(r => r.group === originalTeamName.value);
    for (const om of oldMembers) if (!selectedCamperIds.value.includes(om.id)) await updateCamperGroupInDB(om, '');
    manualEmptyTeams.value = manualEmptyTeams.value.filter(n => n !== originalTeamName.value);
  }
  for (const camper of records.value) {
    if (selectedCamperIds.value.includes(camper.id)) { if (camper.group !== targetTeamName) await updateCamperGroupInDB(camper, targetTeamName); }
    else { if (camper.group === targetTeamName || (isEditingExistingTeam.value && camper.group === originalTeamName.value)) await updateCamperGroupInDB(camper, ''); }
  }
  if (selectedCamperIds.value.length === 0) { if (!manualEmptyTeams.value.includes(targetTeamName)) manualEmptyTeams.value.push(targetTeamName); }
  else { manualEmptyTeams.value = manualEmptyTeams.value.filter(n => n !== targetTeamName); }
  const db = useDb();
  if (db) await setDoc(doc(db, "teams", targetTeamName), { teamName: targetTeamName, updatedAt: new Date(), memberCount: selectedCamperIds.value.length });
  showTeamModal.value = false;
  hasMounted.value = true; 
}

async function updateCamperGroupInDB(record, newGroupName) {
  await campersStore.updateCamper({ status: record.status, group: newGroupName, room_name: record.room_name, transport: record.transport, preferred_language: record.preferred_language, secret_identity: record.secret_identity, secret_angel: record.secretAngel, ice_breaking: { riddle: record.iceBreakingRiddle, target: record.iceBreakingTarget }, id: record.id });
}

function getGameScore(teamName, gameName) {
  const record = firebaseScores.value.find(s => s.id === teamName);
  return (record && record.scores && record.scores[gameName] !== undefined) ? record.scores[gameName] : 0; 
}
function getTeamTotalScore(teamName) {
  return firebaseScores.value.find(s => s.id === teamName)?.totalScore || 0;
}

async function adjustMark(value) {
  const val = parseInt(value);
  if (isNaN(val) || val === 0) return alert('请输入有效的非零整数分值！');
  if (!selectedScoreTeams.value || selectedScoreTeams.value.length === 0) return;
  if (!selectedScoreGame.value) return alert('请选择要加分的游戏！');
  const db = useDb(); if (!db) return;
  const gameName = selectedScoreGame.value;
  try {
    await Promise.all(selectedScoreTeams.value.map(async (teamName) => {
      const updatedScoresMap = {};
      GAME_NAMES.forEach(g => { updatedScoresMap[g] = g === gameName ? getGameScore(teamName, gameName) + val : getGameScore(teamName, g); });
      const newTotalScore = Object.values(updatedScoresMap).reduce((sum, score) => sum + score, 0);
      const payload = { teamName: teamName, scores: updatedScoresMap, totalScore: newTotalScore, updatedAt: Date.now() };
      await setDoc(doc(db, "game_scores", teamName), payload);
      const existIdx = firebaseScores.value.findIndex(s => s.id === teamName);
      if (existIdx > -1) firebaseScores.value[existIdx] = { id: teamName, ...payload };
      else firebaseScores.value.push({ id: teamName, ...payload });
    }));
    selectedScoreTeams.value = []; customMarkValue.value = null; 
  } catch (err) { alert('加分过程中发生错误，请重试'); } 
}

const sortedLeaderboardData = computed(() => {
  const view = activeLeaderboardView.value;
  return teamsList.value.map(team => ({ teamName: team.name, score: view === 'Total' ? getTeamTotalScore(team.name) : getGameScore(team.name, view) })).sort((a, b) => b.score - a.score);
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .card, .modal-leave-to .card { transform: scale(0.95) translateY(10px); }

/* Custom properties for background fading effect */
.mask-image-b {
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
}

.clip-ribbon { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%); }
.clip-ribbon-center { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>