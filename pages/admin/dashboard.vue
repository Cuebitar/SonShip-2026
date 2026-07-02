<template>
  <div class="page-container bg-dark min-h-screen pb-16">
    <!-- Header -->
    <section class="py-8 md:py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <p class="font-body text-tertiary/60 text-xs md:text-sm mb-1">Admin Control Panel</p>
        <h1 class="font-heading font-black text-2xl md:text-4xl text-primary mb-2">Content Management</h1>
        <p class="font-body text-tertiary text-sm md:text-base">Manage announcements, camp schedules, teams and game marks</p>
      </div>
    </section>

    <!-- Main Content -->
    <section v-if="hasMounted" class="container-inner mt-6 md:mt-8">
      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
        <button 
          @click="activeTab = 'announcements'"
          :class="['px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center gap-2 flex-1 md:flex-none justify-center', 
                  activeTab === 'announcements' ? 'bg-primary text-dark' : 'bg-white/5 text-tertiary hover:bg-white/10']">
          <Bell class="w-4 h-4" />
          Announcements
        </button>
        <button 
          @click="activeTab = 'calendar'"
          :class="['px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center gap-2 flex-1 md:flex-none justify-center', 
                  activeTab === 'calendar' ? 'bg-primary text-dark' : 'bg-white/5 text-tertiary hover:bg-white/10']">
          <CalendarIcon class="w-4 h-4" />
          Plan Calendar
        </button>
        <button 
          @click="activeTab = 'teams'"
          :class="['px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center gap-2 flex-1 md:flex-none justify-center', 
                  activeTab === 'teams' ? 'bg-primary text-dark' : 'bg-white/5 text-tertiary hover:bg-white/10']">
          <Users class="w-4 h-4" />
          Manage Teams
        </button>
        <!-- 新增：Manage Marks 标签 -->
        <button 
          @click="activeTab = 'marks'"
          :class="['px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center gap-2 flex-1 md:flex-none justify-center', 
                  activeTab === 'marks' ? 'bg-primary text-dark' : 'bg-white/5 text-tertiary hover:bg-white/10']">
          <Trophy class="w-4 h-4" />
          Manage Marks
        </button>
      </div>

      <!-- ========================================== -->
      <!-- TAB 1: ANNOUNCEMENTS                       -->
      <!-- ========================================== -->
      <div v-if="activeTab === 'announcements'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 class="font-heading font-bold text-lg md:text-xl text-white">Broadcast Notifications</h2>
          <button @click="openAnnModal()" class="btn-primary btn-sm flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus class="w-4 h-4" /> New Announcement
          </button>
        </div>

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
                <td class="p-4 text-sm text-tertiary">
                  {{ formatPublishTime(ann.createdAt, ann.date) }}
                </td>
                <td class="p-4 text-right">
                  <button @click="openAnnModal(ann)" class="text-primary hover:text-white px-2 transition-colors"><Edit class="w-4 h-4" /></button>
                  <button @click="deleteAnnouncement(ann.id)" class="text-red-400 hover:text-red-300 px-2 transition-colors"><Trash2 class="w-4 h-4" /></button>
                </td>
              </tr>
              <tr v-if="announcements.length === 0">
                <td colspan="3" class="p-8 text-center text-tertiary">No announcements found. Add one to get started!</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-3">
          <div v-if="announcements.length === 0" class="card p-6 text-center text-tertiary text-sm">
            No announcements found.
          </div>
          <div v-for="ann in announcements" :key="'mob-' + ann.id" class="card p-4 bg-white/5 border border-white/10">
            <div class="flex justify-between items-start mb-2">
              <div class="pr-3">
                <h3 class="font-bold text-primary text-sm leading-tight">{{ ann.title }}</h3>
                <p class="text-[10px] text-tertiary/60 mt-1">{{ formatPublishTime(ann.createdAt, ann.date) }}</p>
              </div>
              <div class="flex gap-2 bg-dark/50 rounded-lg p-1">
                <button @click="openAnnModal(ann)" class="text-primary p-1.5"><Edit class="w-3.5 h-3.5" /></button>
                <button @click="deleteAnnouncement(ann.id)" class="text-red-400 p-1.5"><Trash2 class="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p class="text-xs text-tertiary/80 line-clamp-3 mt-2">{{ ann.description }}</p>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 2: CALENDAR SCHEDULE                   -->
      <!-- ========================================== -->
      <div v-if="activeTab === 'calendar'" class="space-y-4">
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
              <select v-model="filterDay" class="input py-1.5 px-2 m text-xs bg-dark/50 border-white/10 w-full">
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
                  <div v-if="event.notes" class="text-xs text-red-400 flex items-center gap-1 bg-red-500/10 inline-flex px-2 py-0.5 rounded">
                    <AlertCircle class="w-3 h-3" /> {{ event.notes }}
                  </div>
                  <span v-else class="text-tertiary/40">-</span>
                </td>
                <td class="p-4 text-right">
                  <button @click="openCalModal(event)" class="text-primary hover:text-white px-2 transition-colors"><Edit class="w-4 h-4" /></button>
                  <button @click="deleteCalendarEvent(event.id)" class="text-red-400 hover:text-red-300 px-2 transition-colors"><Trash2 class="w-4 h-4" /></button>
                </td>
              </tr>
              <tr v-if="filteredCalendarEvents.length === 0">
                <td colspan="5" class="p-8 text-center text-tertiary">No scheduled events match your filters.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="lg:hidden space-y-3">
          <div v-if="filteredCalendarEvents.length === 0" class="card p-6 text-center text-tertiary text-sm">
            No scheduled events match your filters.
          </div>
          <div v-for="event in filteredCalendarEvents" :key="'mob-' + event.id" class="card p-4 bg-white/5 border border-white/10 relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary/50"></div>
            <div class="flex justify-between items-start mb-3">
              <div class="pr-2">
                <h3 class="font-bold text-white text-sm">{{ event.name }}</h3>
                <p class="text-xs font-heading text-primary mt-1">{{ event.day }} ({{ event.date }}) • {{ event.time }}</p>
              </div>
              <div class="flex gap-2 bg-dark/50 rounded-lg p-1 shrink-0">
                <button @click="openCalModal(event)" class="text-primary p-1.5"><Edit class="w-3.5 h-3.5" /></button>
                <button @click="deleteCalendarEvent(event.id)" class="text-red-400 p-1.5"><Trash2 class="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-2 mt-2 pt-2 border-t border-white/5">
              <div class="text-xs text-tertiary flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-tertiary/50"/> {{ event.location || 'TBA' }}
              </div>
              <div class="text-xs text-tertiary flex items-center gap-1">
                <Clock class="w-3.5 h-3.5 text-tertiary/50"/> {{ event.duration }} mins
              </div>
            </div>
            <div v-if="event.notes" class="mt-3 text-[11px] text-red-400 flex items-start gap-1 bg-red-500/10 px-2 py-1.5 rounded w-fit">
              <AlertCircle class="w-3.5 h-3.5 shrink-0" /> <span class="leading-tight">{{ event.notes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 3: MANAGE TEAMS                        -->
      <!-- ========================================== -->
      <div v-if="activeTab === 'teams'" class="space-y-6">
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
                <button 
                  type="button"
                  @click="editTeam(team)" 
                  class="px-2.5 py-1.5 bg-white/5 rounded-lg text-tertiary hover:text-primary hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-bold"
                >
                  <Edit2 class="w-3.5 h-3.5" /> Manage
                </button>
              </div>

              <!-- 队伍成员预览 -->
              <div class="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                <div 
                  v-for="member in team.members" 
                  :key="member.id" 
                  class="flex items-center justify-between bg-dark/40 rounded-lg px-3 py-1.5"
                >
                  <span class="text-xs font-body text-tertiary truncate">{{ member.fullName }}</span>
                  <span v-if="member.gender" class="text-[9px] uppercase bg-white/10 px-1.5 py-0.5 rounded text-tertiary/60">{{ member.gender }}</span>
                </div>
                <div v-if="team.members.length === 0" class="text-xs text-tertiary/40 italic py-4 text-center">
                  No members assigned yet.
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-tertiary/50">
              <span>Total Members</span>
              <strong class="text-white font-heading font-bold bg-white/5 px-2 py-0.5 rounded">{{ team.members.length }}</strong>
            </div>
          </div>

          <div v-if="teamsList.length === 0" class="col-span-full card p-12 text-center text-tertiary/40 italic">
            No teams formed yet. Click "Add Team" to create one.
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 4: MANAGE GAMES MARK                   -->
      <!-- ========================================== -->
      <div v-if="activeTab === 'marks'" class="space-y-8">
  <div>
    <h2 class="font-heading font-bold text-xl text-white">Manage Games Mark</h2>
    <p class="text-xs text-tertiary/60 mt-1">Record scores for teams. The system automatically calculates total scores and independent leaderboards.</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- 左侧：加分/减分主操作面板 -->
    <div class="lg:col-span-2 space-y-6">
      <div class="card p-6 border-primary/20 bg-primary/5">
        <h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">
          <Gamepad2 class="w-5 h-5" /> Score Entry Console
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <!-- 修改 1：变成 Checkbox 多选列表 -->
          <div>
            <label class="block text-xs font-bold text-primary/80 mb-1.5 uppercase">1. Select Team(s)</label>
            <div class="bg-dark border border-white/10 rounded-xl p-3 max-h-[160px] overflow-y-auto grid grid-cols-2 gap-2">
              <label v-for="team in teamsList" :key="team.name" class="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1.5 rounded transition-colors">
                <!-- 绑定到一个数组 selectedScoreTeams -->
                <input 
                  type="checkbox" 
                  :value="team.name" 
                  v-model="selectedScoreTeams" 
                  class="w-4 h-4 rounded border-white/20 bg-dark/50 text-primary focus:ring-primary focus:ring-offset-dark" 
                />
                <span class="text-sm text-white truncate">{{ team.name }}</span>
              </label>
            </div>
            <!-- 小提示：显示当前选中了多少组 -->
            <p class="text-[10px] text-tertiary/60 mt-1 text-right">
              {{ selectedScoreTeams.length }} team(s) selected
            </p>
          </div>
          
          <!-- 游戏选择保持不变 -->
          <div>
            <label class="block text-xs font-bold text-primary/80 mb-1.5 uppercase">2. Select Game</label>
            <select v-model="selectedScoreGame" class="input py-2.5 bg-dark border-white/10 text-white w-full">
              <option v-for="game in GAME_NAMES" :key="game" :value="game">{{ game }}</option>
            </select>
          </div>
        </div>

        <!-- 修改 2：根据数组长度判断是否显示加分按钮 -->
        <div v-if="selectedScoreTeams.length > 0" class="space-y-4">
          <label class="block text-xs font-bold text-primary/80 uppercase">
            3. Adjust Score (Current Game: <span class="text-white">{{ selectedScoreGame }}</span>)
          </label>
          <div class="flex flex-wrap gap-3">
            <button @click="adjustMark(50)" class="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-bold hover:bg-green-500/30 transition-all flex-1 text-center">+50 Pts</button>
            <button @click="adjustMark(10)" class="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-sm font-bold hover:bg-green-500/20 transition-all flex-1 text-center">+10 Pts</button>
            <button @click="adjustMark(-10)" class="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all flex-1 text-center">-10 Pts</button>
            <button @click="adjustMark(-50)" class="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/30 transition-all flex-1 text-center">-50 Pts</button>
          </div>

          <!-- 自定义分值输入 -->
          <div class="flex gap-2 items-center pt-2">
            <input v-model.number="customMarkValue" type="number" class="input py-2 bg-dark/60 text-sm" placeholder="Custom score (e.g. 25 or -15)" />
            <button @click="adjustMark(customMarkValue)" class="btn-primary py-2 px-5 text-sm w-auto shrink-0">Submit</button>
          </div>
        </div>
        <div v-else class="text-sm text-tertiary/40 italic text-center py-6 border border-dashed border-white/10 rounded-xl">
          Please select at least one team above to activate scoring controls.
        </div>
      </div>

      <!-- 下方表格渲染保持完全不变 -->
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
              <td v-for="game in GAME_NAMES" :key="game" class="p-4 text-tertiary">
                {{ getGameScore(team.name, game) }}
              </td>
              <td class="p-4 text-right text-primary font-bold font-heading text-base">
                {{ getTeamTotalScore(team.name) }}
              </td>
            </tr>
            <tr v-if="teamsList.length === 0">
              <td :colspan="GAME_NAMES.length + 2" class="p-8 text-center text-tertiary italic text-xs">No teams available. Create teams first.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 右侧：排行榜渲染保持不变 -->
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
              <span class="w-5 h-5 rounded-full flex items-center justify-center font-heading text-xs font-bold" :class="idx === 0 ? 'bg-yellow-400 text-dark font-black' : idx === 1 ? 'bg-slate-300 text-dark' : idx === 2 ? 'bg-amber-600 text-white' : 'text-tertiary/40'">
                {{ idx + 1 }}
              </span>
              <span class="text-sm text-white font-bold truncate max-w-[120px]">{{ rank.teamName }}</span>
            </div>
            <span class="font-heading font-bold text-sm text-primary">{{ rank.score }} <span class="text-[9px] text-tertiary/40 uppercase">pts</span></span>
          </div>
          <div v-if="sortedLeaderboardData.length === 0" class="text-center py-6 text-xs text-tertiary/30 italic">No ranking data available yet.</div>
        </div>
      </div>
    </div>
  </div>
</div>
      
    </section>

    <section v-else class="container-inner mt-8 text-center py-20">
      <p class="text-tertiary animate-pulse">Loading data from database...</p>
    </section>

    <!-- ========================================== -->
    <!-- MODALS                                     -->
    <!-- ========================================== -->

    <!-- Team Modal (Checkbox 升级版) -->
    <Transition name="modal">
      <div v-if="showTeamModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showTeamModal = false"></div>
        
        <div class="relative card w-full max-w-lg p-6 shadow-2xl border border-primary/30 bg-dark">
          <div class="pb-4 border-b border-white/10 mb-5">
            <h3 class="font-heading font-black text-xl text-primary">
              {{ isEditingExistingTeam ? 'Edit Team: ' + modalTeamName : 'Create New Team' }}
            </h3>
          </div>

          <div class="space-y-4">
            <input 
              v-model="modalTeamName" 
              type="text" 
              class="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold"
              placeholder="Team Name"
            />

            <input 
              v-model="teamModalSearch" 
              type="text" 
              class="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
              placeholder="🔍 Search campers..."
            />

            <div class="border border-white/10 rounded-xl bg-white/5 max-h-[40vh] overflow-y-auto">
              <label class="flex items-center gap-3 p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer">
                <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" class="accent-primary" />
                <span class="text-sm font-bold text-primary">Select All</span>
              </label>
              
              <label 
                v-for="camper in filteredModalCampers" 
                :key="camper.id" 
                class="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
              >
                <input 
                  type="checkbox" 
                  :value="camper.id" 
                  v-model="selectedCamperIds" 
                  class="accent-primary w-4 h-4"
                />
                <div class="flex flex-col">
                  <span class="text-sm text-white font-bold">{{ camper.fullName }}</span>
                  <span class="text-[10px] text-tertiary">{{ camper.group || 'Unassigned' }}</span>
                </div>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button @click="showTeamModal = false" class="text-sm text-tertiary hover:text-white transition-colors">Cancel</button>
            <button @click="saveTeamModal" class="btn-primary px-6 py-2 text-sm">Save Changes</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Announcement Modal -->
    <Transition name="modal">
      <div v-if="showAnnModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showAnnModal = false"></div>
        <div class="relative card w-full max-w-lg p-5 md:p-6 shadow-2xl border-primary/30 max-h-[90vh] overflow-y-auto">
          <h3 class="font-heading font-bold text-lg md:text-xl text-white mb-4">
            {{ annForm.id ? 'Edit Announcement' : 'New Announcement' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1">Title</label>
              <input v-model="annForm.title" type="text" class="input w-full py-2 bg-dark/50 text-sm" placeholder="e.g. Packing list updated!" />
            </div>
            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1">Description</label>
              <textarea v-model="annForm.description" rows="4" class="input w-full py-2 bg-dark/50 text-sm" placeholder="Write your announcement here..."></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="showAnnModal = false" class="px-4 py-2 text-sm font-bold text-tertiary hover:text-white transition-colors" :disabled="isSaving">Cancel</button>
            <button @click="saveAnnouncement" class="btn-primary w-auto min-w-0 px-6 py-2" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save & Publish' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Calendar Modal -->
    <Transition name="modal">
      <div v-if="showCalModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm fixed" @click="showCalModal = false"></div>
        <div class="relative card w-full max-w-2xl p-5 md:p-6 shadow-2xl border-primary/30 max-h-[90vh] overflow-y-auto">
          <h3 class="font-heading font-bold text-lg md:text-xl text-white mb-4">
            {{ calForm.id ? 'Edit Event' : 'Add Event' }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-primary/80 mb-1">Event Name</label>
              <input v-model="calForm.name" type="text" class="input w-full py-2 bg-dark/50 text-sm" placeholder="e.g. Opening Ceremony" />
            </div>
            
            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1">Camp Day</label>
              <select v-model="calForm.day" class="input w-full py-2 bg-dark/50 text-sm">
                <option value="Day 1">Day 1 (28 Aug)</option>
                <option value="Day 2">Day 2 (29 Aug)</option>
                <option value="Day 3">Day 3 (30 Aug)</option>
                <option value="Day 4">Day 4 (31 Aug)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1">Exact Date</label>
              <input v-model="calForm.date" type="date" class="input w-full py-2 bg-dark/50 text-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1">Start Time</label>
              <input v-model="calForm.time" type="time" class="input w-full py-2 bg-dark/50 text-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary/80 mb-1">Duration (Minutes)</label>
              <input v-model="calForm.duration" type="number" min="0" class="input w-full py-2 bg-dark/50 text-sm" placeholder="e.g. 60" />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-primary/80 mb-1">Location</label>
              <input v-model="calForm.location" type="text" class="input w-full py-2 bg-dark/50 text-sm" placeholder="e.g. Main Hall" />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-primary/80 mb-1 text-red-400">Important Notes (User must read)</label>
              <textarea v-model="calForm.notes" rows="2" class="input w-full py-2 bg-dark/50 border-red-500/30 focus:border-red-500/50 text-sm" placeholder="e.g. Please bring your Bible and jacket."></textarea>
            </div>

            <div v-if="calForm.id" class="sm:col-span-2 mt-2">
              <label class="flex items-center gap-2 text-sm text-tertiary cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" v-model="calForm.notifyChange" class="rounded bg-dark border-primary/30 text-primary focus:ring-primary">
                Notify users about this schedule change
              </label>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="showCalModal = false" class="px-4 py-2 text-sm font-bold text-tertiary hover:text-white transition-colors" :disabled="isSaving">Cancel</button>
            <button @click="saveCalendar" class="btn-primary w-auto min-w-0 px-6 py-2" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Schedule' }}
            </button>
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
// 新增引入了 Trophy 和 Gamepad2
import { Bell, Calendar as CalendarIcon, Plus, Edit, Trash2, AlertCircle, MapPin, Clock, Users, Edit2, X, Trophy, Gamepad2 } from 'lucide-vue-next'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { useDb } from '~/composable/firebase' 

const auth = useAuthStore()
const campersStore = useCampersStore() 
const router = useRouter()

const hasMounted = ref(false)
const isSaving = ref(false)
const activeTab = ref('announcements') 

const announcements = ref([])
const calendarEvents = ref([])

// ==========================================
// 🎮 游戏分数管理专属状态 (Marks)
// ==========================================
const GAME_NAMES = ['破冰游戏', '寻宝大作战', '竞技拔河', '终极密室']; 
const firebaseScores = ref([]); 

const selectedScoreTeams = ref([]);
const selectedScoreGame = ref('破冰游戏');
const customMarkValue = ref(null);
const activeLeaderboardView = ref('Total'); 

// ==========================================
// 初始化数据加载
// ==========================================
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
        // 加载分数数据
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
// CALENDAR & ANNOUNCEMENTS LOGIC
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
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

const showAnnModal = ref(false)
const annForm = reactive({ id: null, title: '', description: '', date: '', createdAt: null })
const showCalModal = ref(false)
const calForm = reactive({ 
  id: null, name: '', day: 'Day 1', date: '2026-08-28', 
  time: '', location: '', duration: 60, notes: '', notifyChange: false 
})

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
  const formattedDate = new Date().toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
  })
  const payload = {
    title: annForm.title, description: annForm.description,
    date: annForm.id ? annForm.date : formattedDate,
    createdAt: annForm.id ? (annForm.createdAt || Date.now()) : Date.now()
  }
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
  } catch (error) {
    console.error("Error saving announcement:", error)
  } finally {
    isSaving.value = false
  }
}

async function deleteAnnouncement(id) {
  if (!confirm('Are you sure you want to delete this announcement?')) return
  const db = useDb()
  if (!db) return
  try {
    await deleteDoc(doc(db, "announcements", id))
    announcements.value = announcements.value.filter(a => a.id !== id)
  } catch (error) {
    console.error("Error deleting announcement:", error)
  }
}

function openCalModal(event = null) {
  if (event) {
    Object.assign(calForm, event, { notifyChange: false }) 
  } else {
    Object.assign(calForm, { 
      id: null, name: '', day: 'Day 1', date: '2026-08-28', time: '14:00', location: '', duration: 60, notes: '', notifyChange: false 
    })
  }
  showCalModal.value = true
}

async function saveCalendar() {
  if (!calForm.name || !calForm.date || !calForm.time) return alert("Name, Date, and Time are required!")
  const db = useDb()
  if (!db) return
  isSaving.value = true
  const payload = {
    name: calForm.name, day: calForm.day, date: calForm.date, time: calForm.time,
    location: calForm.location, duration: Number(calForm.duration), notes: calForm.notes
  }
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
  } catch (error) {
    console.error("Error saving schedule:", error)
  } finally {
    isSaving.value = false
  }
}

async function deleteCalendarEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return
  const db = useDb()
  if (!db) return
  try {
    await deleteDoc(doc(db, "schedules", id))
    calendarEvents.value = calendarEvents.value.filter(e => e.id !== id)
  } catch (error) {
    console.error("Error deleting event:", error)
  }
}

// ==========================================
// MANAGE TEAMS LOGIC 
// ==========================================

const records = computed(() =>
  campersStore.campers.map((c) => ({
    id               : c.id,
    fullName         : c.name,
    gender           : c.gender,
    group            : c.group || "",
    status           : c.status,
    room_name        : c.room_name,
    transport        : c.transport,
    preferred_language: c.preferred_language,
    secret_identity  : c.secret_identity,
    secretAngel      : c.secret_angel?.id ?? '',
    iceBreakingTarget: c.ice_breaking?.target ?? '',
    iceBreakingRiddle: c.ice_breaking?.riddle ?? '',
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
      if (!map.has(record.group)) { map.set(record.group, { name: record.group, members: [] }); }
      map.get(record.group).members.push(record);
    }
  });
  manualEmptyTeams.value.forEach(tName => {
    if (!map.has(tName)) { map.set(tName, { name: tName, members: [] }); }
  });
  return Array.from(map.values());
});

const filteredModalCampers = computed(() => {
  if (!teamModalSearch.value.trim()) return records.value;
  const query = teamModalSearch.value.toLowerCase();
  return records.value.filter(c => c.fullName.toLowerCase().includes(query));
});

function addNewTeam() {
  isEditingExistingTeam.value = false;
  originalTeamName.value = '';
  modalTeamName.value = '';
  teamModalSearch.value = '';
  selectedCamperIds.value = [];
  showTeamModal.value = true;
}

function editTeam(team) {
  isEditingExistingTeam.value = true;
  originalTeamName.value = team.name;
  modalTeamName.value = team.name;
  teamModalSearch.value = '';
  selectedCamperIds.value = team.members.map(m => m.id);
  showTeamModal.value = true;
}

const allSelected = computed(() => {
  return filteredModalCampers.value.length > 0 && 
         selectedCamperIds.value.length === filteredModalCampers.value.length;
});

function toggleSelectAll(event) {
  if (event.target.checked) {
    const ids = filteredModalCampers.value.map(c => c.id);
    selectedCamperIds.value = [...new Set([...selectedCamperIds.value, ...ids])];
  } else {
    const ids = filteredModalCampers.value.map(c => c.id);
    selectedCamperIds.value = selectedCamperIds.value.filter(id => !ids.includes(id));
  }
}

async function saveTeamModal() {
  const targetTeamName = modalTeamName.value.trim();
  if (!targetTeamName) return alert('Please enter a team name!');

  hasMounted.value = false; 

  if (isEditingExistingTeam.value && targetTeamName !== originalTeamName.value) {
    const oldMembers = records.value.filter(r => r.group === originalTeamName.value);
    for (const om of oldMembers) {
      if (!selectedCamperIds.value.includes(om.id)) await updateCamperGroupInDB(om, '');
    }
    manualEmptyTeams.value = manualEmptyTeams.value.filter(n => n !== originalTeamName.value);
  }

  for (const camper of records.value) {
    if (selectedCamperIds.value.includes(camper.id)) {
      if (camper.group !== targetTeamName) await updateCamperGroupInDB(camper, targetTeamName);
    } else {
      if (camper.group === targetTeamName || (isEditingExistingTeam.value && camper.group === originalTeamName.value)) {
        await updateCamperGroupInDB(camper, '');
      }
    }
  }

  if (selectedCamperIds.value.length === 0) {
    if (!manualEmptyTeams.value.includes(targetTeamName)) manualEmptyTeams.value.push(targetTeamName);
  } else {
    manualEmptyTeams.value = manualEmptyTeams.value.filter(n => n !== targetTeamName);
  }

  // 修复了 db 未定义的问题
  const db = useDb();
  if (db) {
    await setDoc(doc(db, "teams", targetTeamName), {
      teamName: targetTeamName,
      updatedAt: new Date(),
      memberCount: selectedCamperIds.value.length
    });
  }

  showTeamModal.value = false;
  hasMounted.value = true; 
}

async function updateCamperGroupInDB(record, newGroupName) {
  const updateInfo = {
    status            : record.status,
    group             : newGroupName,
    room_name         : record.room_name,
    transport         : record.transport,
    preferred_language: record.preferred_language,
    secret_identity   : record.secret_identity,
    secret_angel      : record.secretAngel,
    ice_breaking      : { riddle: record.iceBreakingRiddle, target: record.iceBreakingTarget },
    id                : record.id,
  }
  await campersStore.updateCamper(updateInfo);
}

// ==========================================
// 📊 分数运算与排行榜核心算法 (Marks Methods)
// ==========================================

function getGameScore(teamName, gameName) {
  const record = firebaseScores.value.find(s => s.id === teamName);
  if (record && record.scores && record.scores[gameName] !== undefined) {
    return record.scores[gameName];
  }
  return 0; 
}

function getTeamTotalScore(teamName) {
  const record = firebaseScores.value.find(s => s.id === teamName);
  return record?.totalScore || 0;
}

async function adjustMark(value) {
  const val = parseInt(value);
  if (isNaN(val) || val === 0) return alert('请输入有效的非零整数分值！');
  if (!selectedScoreTeams.value || selectedScoreTeams.value.length === 0) return;
  if (!selectedScoreGame.value) return alert('请选择要加分的游戏！');

  const db = useDb();
  if (!db) return;

  const gameName = selectedScoreGame.value;

  try {
    // ❌ 删掉这行：hasMounted.value = false;

    await Promise.all(selectedScoreTeams.value.map(async (teamName) => {
      const currentScore = getGameScore(teamName, gameName);
      const newGameScore = currentScore + val;

      const updatedScoresMap = {};
      GAME_NAMES.forEach(g => {
        updatedScoresMap[g] = g === gameName ? newGameScore : getGameScore(teamName, g);
      });
      const newTotalScore = Object.values(updatedScoresMap).reduce((sum, score) => sum + score, 0);

      const payload = {
        teamName: teamName,
        scores: updatedScoresMap,
        totalScore: newTotalScore,
        updatedAt: Date.now()
      };

      await setDoc(doc(db, "game_scores", teamName), payload);
      
      const existIdx = firebaseScores.value.findIndex(s => s.id === teamName);
      if (existIdx > -1) {
        firebaseScores.value[existIdx] = { id: teamName, ...payload };
      } else {
        firebaseScores.value.push({ id: teamName, ...payload });
      }
    }));
    
    selectedScoreTeams.value = [];
    customMarkValue.value = null; 
    
  } catch (err) {
    console.error('Error saving score:', err);
    alert('加分过程中发生错误，请重试');
  } 
  // ❌ 删掉 finally 区块里面的：hasMounted.value = true;
}

const sortedLeaderboardData = computed(() => {
  const view = activeLeaderboardView.value;
  const mapped = teamsList.value.map(team => {
    return {
      teamName: team.name,
      score: view === 'Total' ? getTeamTotalScore(team.name) : getGameScore(team.name, view)
    };
  });
  return mapped.sort((a, b) => b.score - a.score);
});

</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .card,
.modal-leave-to .card {
  transform: scale(0.95) translateY(10px);
}
</style>