<template>
  <div class="page-container bg-dark min-h-screen pb-16">
    <!-- Header -->
    <section class="py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10">
      <div class="container-inner relative z-10">
        <h1 class="font-heading font-black text-3xl md:text-4xl text-primary mb-2">Registration Dashboard</h1>
        <p class="font-body text-tertiary">Manage all camp registrations</p>
      </div>
    </section>

    <!-- Content -->
    <section class="container-inner mt-8">
      <!-- Tabs / Filters -->
      <div class="flex flex-col gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button v-for="tab in tabs" :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2 rounded-full font-heading text-sm font-bold transition-all',
              activeTab === tab ? 'bg-primary text-dark' : 'bg-white/5 text-tertiary hover:bg-white/10'
            ]">
            {{ tab }}
          </button>
        </div>
        
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-primary">Group:</label>
            <select v-model="filterGroup" class="input py-1.5 px-3 text-sm bg-dark/50 border-white/10 w-40">
              <option value="All">All Groups</option>
              <option v-for="group in availableGroups" :key="group" :value="group">{{ group }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-primary">Room:</label>
            <select v-model="filterRoom" class="input py-1.5 px-3 text-sm bg-dark/50 border-white/10 w-40">
              <option value="All">All Rooms</option>
              <option v-for="room in availableRooms" :key="room" :value="room">{{ room }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="border-b border-white/10 bg-white/5">
              <th class="p-4 font-heading text-primary font-bold text-sm">Name</th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Date</th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Gender</th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Group</th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Room</th>
              <th class="p-4 font-heading text-primary font-bold text-sm">Status</th>
              <th class="p-4 font-heading text-primary font-bold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredRecords.length > 0 && hasMounted" v-for="record in filteredRecords" :key="record.id" class="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td class="p-4">
                <div class="font-bold text-white">{{ record.fullName }}</div>
                <div class="text-xs text-tertiary/70">{{ record.phone }}</div>
              </td>
              <td class="p-4 text-tertiary text-sm">{{ record.registrationTime }}</td>
              <td class="p-4 text-tertiary text-sm capitalize">{{ record.gender }}</td>
              <td class="p-4 text-tertiary text-sm">{{ record.group || '-' }}</td>
              <td class="p-4 text-tertiary text-sm">{{ record.room_name || '-' }}</td>
              <td class="p-4">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-bold inline-block text-nowrap',
                  record.status === 'Registered' ? 'bg-green-500/20 text-green-400' :
                  record.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                  record.status === 'Pending For Collection' ? 'bg-blue-500/20 text-blue-400' :
                  record.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : ''
                ]">
                  {{ record.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button @click="openModal(record)" class="btn-primary py-1.5 px-3 text-xs w-auto min-w-0">
                  View / Edit
                </button>
              </td>
            </tr>
            <tr v-else-if="hasMounted">
              <td colspan="6" class="p-8 text-center text-tertiary">No records found.</td>
            </tr>
            <tr v-else>
              <td colspan="6" class="p-8 text-center text-tertiary">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="selectedRecord" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative card max-h-[90vh] overflow-y-auto w-full max-w-4xl p-0 flex flex-col shadow-2xl border-primary/30">
          <!-- Modal Header -->
          <div class="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark/95 backdrop-blur z-10">
            <div>
              <h3 class="font-heading font-black text-2xl text-primary">{{ selectedRecord.fullName }}</h3>
              <p class="text-sm text-tertiary mt-1">{{ selectedRecord.email }} &bull; {{ formatedIC }}</p>
            </div>
            <button @click="closeModal" class="text-tertiary hover:text-white p-2 text-2xl leading-none">&times;</button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Read-only info -->
            <div class="space-y-6">
              <div>
                <h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2">Registration Details</h4>
                <div class="space-y-3 text-sm">
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Reg. Time</span> <span class="text-white font-medium">{{ selectedRecord.registrationTime }}</span></div>
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Gender</span> <span class="text-white capitalize font-medium">{{ selectedRecord.gender }}</span></div>
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Phone</span> <span class="text-white font-medium">{{ selectedRecord.phone }}</span></div>
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Important Info</span> <span class="text-white font-medium bg-white/5 p-2 rounded mt-1">{{ selectedRecord.important_info || 'None' }}</span></div>
                </div>
              </div>

              <div>
                <h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2">Emergency Contact</h4>
                <div class="space-y-3 text-sm">
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Name</span> <span class="text-white font-medium">{{ selectedRecord.emergency?.name }}</span></div>
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Phone</span> <span class="text-white font-medium">{{ selectedRecord.emergency?.phone }}</span></div>
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Relationship</span> <span class="text-white capitalize font-medium">{{ selectedRecord.emergency?.relationship }}</span></div>
                </div>
              </div>

              <div>
                <h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2">Questions</h4>
                <div class="space-y-3 text-sm">
                  <div class="bg-white/5 p-3 rounded">
                    <p class="text-tertiary/70 text-xs mb-1">{{ t('register.q1') }}</p>
                    <p class="text-white font-medium">{{ selectedRecord.q1 || '-' }}</p>
                  </div>
                  <div class="bg-white/5 p-3 rounded">
                    <p class="text-tertiary/70 text-xs mb-1">{{ t('register.q2') }}</p>
                    <p class="text-white font-medium">{{ selectedRecord.q2 || '-' }}</p>
                  </div>
                  <div class="bg-white/5 p-3 rounded">
                    <p class="text-tertiary/70 text-xs mb-1">{{ t('register.q3') }}</p>
                    <p class="text-white font-medium">{{ selectedRecord.q3 || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Editable Fields -->
            <div class="space-y-5 bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-widest border-b border-primary/20 pb-2">Admin Controls</h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-xs font-bold text-primary/80 mb-1">Status</label>
                  <select v-model="editForm.status" class="input py-2 bg-dark/50">
                    <option value="Pending">Pending</option>
                    <option value="Pending For Collection">Pending For Collection</option>
                    <option value="Registered">Registered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-primary/80 mb-1">Group</label>
                  <input v-model="editForm.group" type="text" class="input py-2 bg-dark/50" placeholder="e.g. Eagles" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-primary/80 mb-1">Room Number</label>
                  <input v-model="editForm.room_name" type="text" class="input py-2 bg-dark/50" placeholder="e.g. A101" />
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-bold text-primary/80 mb-1">Transportation</label>
                  <select v-model="editForm.transport" class="input py-2 bg-dark/50">
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-bold text-primary/80 mb-1">Secret Identity</label>
                  <input v-model="editForm.secret_identity" type="text" class="input py-2 bg-dark/50" placeholder="e.g. The Flame Keeper" />
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-bold text-primary/80 mb-1">Secret Angel Target</label>
                  <select v-model="editForm.secretAngel" class="input py-2 bg-dark/50">
                    <option value="">None</option>
                    <option v-for="user in recordOptions" :key="user.id" :value="user.fullName">
                      {{ user.fullName }}
                    </option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-bold text-primary/80 mb-1">Ice Breaking Target</label>
                  <select v-model="editForm.iceBreakingTarget" class="input py-2 bg-dark/50">
                    <option value="">None</option>
                    <option v-for="user in recordOptions" :key="user.id" :value="user.fullName">
                      {{ user.fullName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 border-t border-white/10 flex justify-end gap-4 sticky bottom-0 bg-dark/95 backdrop-blur">
            <button @click="closeModal" class="px-4 py-2 font-bold text-tertiary hover:text-white transition-colors">Cancel</button>
            <button @click="saveChanges" class="btn-primary w-auto min-w-0 px-6">Save Changes</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, computed, reactive, onMounted } from 'vue';
import { useCampersStore } from '~/stores/campers';
import { useI18n } from 'vue-i18n'
import { Target } from 'lucide-vue-next';
const { t } = useI18n()

const tabs = ['All', 'Pending', 'Pending For Collection', 'Registered', 'Rejected'];
const activeTab = ref('All');
const filterGroup = ref('All');
const filterRoom = ref('All');
const hasMounted = ref(false);

const campersStore = useCampersStore();

onMounted(() => {
  campersStore.initCampers();
  hasMounted.value = true;
})

// Map from pinia store campers
const records = computed(() =>
  campersStore.campers.map((c, index) => {
    const hour = (8 + (index % 10)).toString().padStart(2, '0');
    const minute = ((index * 13) % 60).toString().padStart(2, '0');
    const day = (1 + (index % 15)).toString().padStart(2, '0');
    const registrationTime = `2026-08-${day} ${hour}:${minute}`;
    return {
      id: c.id,
      fullName: c.name,
      ic: c.ic,
      phone: c.phone,
      email: c.email,
      gender: c.gender,
      transport: c.transport,
      important_info: c.important_info,
      emergency: c.emergency || { name: '', phone: '', relationship: '' },
      q1: c.questions?.place ?? '',
      q2: c.questions?.verse ?? '',
      q3: c.questions?.pain ?? '',
      status: c.status,
      secret_identity: c.secret_identity,
      secretAngel: c.secret_angel?.id ?? '',
      iceBreakingTarget: c.ice_breaking?.target ?? '',
      iceBreakingRiddle: c.ice_breaking?.riddle ?? '',
      group: c.group || "",
      room_name: c.room_name || "",
      registrationTime
    };
  })
);

const availableGroups = computed(() => {
  const groups = new Set(records.value.map(r => r.group).filter(Boolean));
  return Array.from(groups).sort();
});

const availableRooms = computed(() => {
  const rooms = new Set(records.value.map(r => r.room_name).filter(Boolean));
  return Array.from(rooms).sort();
});

const filteredRecords = computed(() => {
  console.log(records.value,12333);
  return records.value.filter(r => {
    const matchTab = activeTab.value === 'All' || r.status === activeTab.value;
    const matchGroup = filterGroup.value === 'All' || r.group === filterGroup.value;
    const matchRoom = filterRoom.value === 'All' || r.room_name === filterRoom.value;
    return matchTab && matchGroup && matchRoom;
  });
});

const recordOptions = computed(() => {
  if (!selectedRecord.value) return [];
  // Exclude current user from targets options
  return records.value.filter(r => r.id !== selectedRecord.value.id);
});

const formatedIC = computed(() => {
  return selectedRecord.value.ic.replace(/(\d{6})(\d{2})(\d{4})/, '$1-$2-$3');
});

const selectedRecord = ref(null);
const editForm = reactive({
  status: '',
  group: '',
  room_name: '',
  transport: '',
  secret_identity: '',
  secretAngel: '',
  iceBreakingTarget: '',
  iceBreakingRiddle: ''
});

function openModal(record) {
  selectedRecord.value = record;
  editForm.status = record.status;
  editForm.group = record.group || '';
  editForm.room_name = record.room_name || '';
  editForm.transport = record.transport;
  editForm.secret_identity = record.secret_identity || '';
  editForm.secretAngel = record.secretAngel || '';
  editForm.iceBreakingTarget = record.iceBreakingTarget || '';
  editForm.iceBreakingRiddle = record.iceBreakingRiddle || '';
}

function closeModal() {
  selectedRecord.value = null;
}

async function saveChanges() {
  hasMounted.value = false;
  if (!selectedRecord.value) return;
  
  // Find index and update
  const index = records.value.findIndex(r => r.id === selectedRecord.value.id);
  if (index !== -1) {
    const updateInfo = {
      status: editForm.status,
      group: editForm.group,
      room_name: editForm.room_name,
      transport: editForm.transport,
      secret_identity: editForm.secret_identity,
      secret_angel: editForm.secretAngel,
      ice_breaking: {
        riddle: editForm.iceBreakingRiddle,
        target: editForm.iceBreakingTarget
      },
      id: selectedRecord.value.id,
    }
    await campersStore.updateCamper(updateInfo);
  }
  
  closeModal();
  hasMounted.value = true;
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

.modal-enter-from .relative.card,
.modal-leave-to .relative.card {
  transform: scale(0.95) translateY(16px);
}
</style>
