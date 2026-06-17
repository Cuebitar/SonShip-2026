<template>
  <div class="page-container bg-dark min-h-screen pb-16">
    <!-- Header -->
    <section class="py-8 md:py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <p class="font-body text-tertiary/60 text-xs md:text-sm mb-1">Admin Control Panel</p>
        <h1 class="font-heading font-black text-2xl md:text-4xl text-primary mb-2">Content Management</h1>
        <p class="font-body text-tertiary text-sm md:text-base">Manage announcements and camp schedules</p>
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

        <!-- Desktop Table (Hidden on mobile) -->
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

        <!-- Mobile Cards (Hidden on desktop) -->
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
          <!-- Title & Add Button -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 class="font-heading font-bold text-lg md:text-xl text-white">Camp Schedule</h2>
            <button @click="openCalModal()" class="btn-primary btn-sm flex items-center justify-center gap-2 w-full sm:w-auto">
              <Plus class="w-4 h-4" /> Add Event
            </button>
          </div>
          
          <!-- Filters (Mobile Friendly) -->
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

        <!-- Desktop Table (Hidden on small screens) -->
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

        <!-- Mobile Cards (Hidden on desktop) -->
        <div class="lg:hidden space-y-3">
          <div v-if="filteredCalendarEvents.length === 0" class="card p-6 text-center text-tertiary text-sm">
            No scheduled events match your filters.
          </div>
          <div v-for="event in filteredCalendarEvents" :key="'mob-' + event.id" class="card p-4 bg-white/5 border border-white/10 relative overflow-hidden">
            <!-- Left accent line -->
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
    </section>

    <section v-else class="container-inner mt-8 text-center py-20">
      <p class="text-tertiary animate-pulse">Loading data from database...</p>
    </section>

    <!-- ========================================== -->
    <!-- MODALS                                     -->
    <!-- ========================================== -->

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

            <!-- 删除了 Short Description 输入框，仅保留 Notes -->
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
import { Bell, Calendar as CalendarIcon, Plus, Edit, Trash2, AlertCircle, MapPin, Clock } from 'lucide-vue-next'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useDb } from '~/composable/firebase' 

const auth = useAuthStore()
const router = useRouter()
const hasMounted = ref(false)
const isSaving = ref(false)
const activeTab = ref('announcements') 

const announcements = ref([])
const calendarEvents = ref([])

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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

onMounted(async () =>  {
  if (!auth.user?.is_admin) {
    return router.replace('/dashboard')
  }

  const db = useDb()
  if (db) {
    try {
      const annSnapshot = await getDocs(collection(db, "announcements"))
      announcements.value = annSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      announcements.value.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

      const calSnapshot = await getDocs(collection(db, "schedules"))
      calendarEvents.value = calSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      calendarEvents.value.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  hasMounted.value = true
})

// === 弹窗状态 ===
const showAnnModal = ref(false)
const annForm = reactive({ id: null, title: '', description: '', date: '', createdAt: null })

const showCalModal = ref(false)
// 移除了 description
const calForm = reactive({ 
  id: null, 
  name: '', 
  day: 'Day 1', 
  date: '2026-08-28', 
  time: '', 
  location: '', 
  duration: 60, 
  notes: '', 
  notifyChange: false 
})

// ==========================================
// ANNOUNCEMENT METHODS
// ==========================================
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
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  })

  const payload = {
    title: annForm.title,
    description: annForm.description,
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

// ==========================================
// CALENDAR METHODS
// ==========================================
function openCalModal(event = null) {
  if (event) {
    Object.assign(calForm, event, { notifyChange: false }) 
  } else {
    // 移除了 description
    Object.assign(calForm, { 
      id: null, 
      name: '', 
      day: 'Day 1', 
      date: '2026-08-28', 
      time: '14:00', 
      location: '', 
      duration: 60, 
      notes: '', 
      notifyChange: false 
    })
  }
  showCalModal.value = true
}

async function saveCalendar() {
  if (!calForm.name || !calForm.date || !calForm.time) return alert("Name, Date, and Time are required!")

  const db = useDb()
  if (!db) return
  isSaving.value = true

  // 移除了 description
  const payload = {
    name: calForm.name,
    day: calForm.day,
    date: calForm.date,
    time: calForm.time,
    location: calForm.location,
    duration: Number(calForm.duration),
    notes: calForm.notes
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