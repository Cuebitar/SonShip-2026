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
            <tr v-for="record in filteredRecords" :key="record.id" class="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td class="p-4">
                <div class="font-bold text-white">{{ record.fullName }}</div>
                <div class="text-xs text-tertiary/70">{{ record.phone }}</div>
              </td>
              <td class="p-4 text-tertiary text-sm">{{ record.registrationTime }}</td>
              <td class="p-4 text-tertiary text-sm capitalize">{{ record.gender }}</td>
              <td class="p-4 text-tertiary text-sm">{{ record.group || '-' }}</td>
              <td class="p-4 text-tertiary text-sm">{{ record.roomNumber || '-' }}</td>
              <td class="p-4">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-bold inline-block',
                  record.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                  record.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
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
            <tr v-if="filteredRecords.length === 0">
              <td colspan="6" class="p-8 text-center text-tertiary">No records found.</td>
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
              <p class="text-sm text-tertiary mt-1">{{ selectedRecord.email }} &bull; {{ selectedRecord.ic }}</p>
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
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Important Info</span> <span class="text-white font-medium bg-white/5 p-2 rounded mt-1">{{ selectedRecord.importantInfo || 'None' }}</span></div>
                </div>
              </div>

              <div>
                <h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2">Emergency Contact</h4>
                <div class="space-y-3 text-sm">
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Name</span> <span class="text-white font-medium">{{ selectedRecord.emergencyContactName }}</span></div>
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Phone</span> <span class="text-white font-medium">{{ selectedRecord.emergencyContactPhone }}</span></div>
                  <div class="flex flex-col"><span class="text-tertiary/70 text-xs">Relationship</span> <span class="text-white capitalize font-medium">{{ selectedRecord.emergencyContactRelationship }}</span></div>
                </div>
              </div>

              <div>
                <h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2">Questions</h4>
                <div class="space-y-3 text-sm">
                  <div class="bg-white/5 p-3 rounded">
                    <p class="text-tertiary/70 text-xs mb-1">Q1: How did you hear about us?</p>
                    <p class="text-white font-medium">{{ selectedRecord.q1 || '-' }}</p>
                  </div>
                  <div class="bg-white/5 p-3 rounded">
                    <p class="text-tertiary/70 text-xs mb-1">Q2: Expectations?</p>
                    <p class="text-white font-medium">{{ selectedRecord.q2 || '-' }}</p>
                  </div>
                  <div class="bg-white/5 p-3 rounded">
                    <p class="text-tertiary/70 text-xs mb-1">Q3: Referral</p>
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
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-primary/80 mb-1">Group</label>
                  <input v-model="editForm.group" type="text" class="input py-2 bg-dark/50" placeholder="e.g. Eagles" />
                </div>

                <div>
                  <label class="block text-xs font-bold text-primary/80 mb-1">Room Number</label>
                  <input v-model="editForm.roomNumber" type="text" class="input py-2 bg-dark/50" placeholder="e.g. A101" />
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-bold text-primary/80 mb-1">Transportation</label>
                  <select v-model="editForm.transportation" class="input py-2 bg-dark/50">
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-xs font-bold text-primary/80 mb-1">Secret Identity</label>
                  <input v-model="editForm.secretIdentity" type="text" class="input py-2 bg-dark/50" placeholder="e.g. The Flame Keeper" />
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
import { ref, computed, reactive } from 'vue';
import { useCampersStore } from '../stores/campers';

const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
const activeTab = ref('All');
const filterGroup = ref('All');
const filterRoom = ref('All');

const campersStore = useCampersStore();

// Map from pinia store campers
console.log(campersStore.campers,12333);
const records = ref(
  campersStore.campers.map((c, index) => {
    const secretAngel = campersStore.getCamperById(c.secretAngelTargetId);
    
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
      transportation: c.transportation,
      // importantInfo: c.medicalInfo?.allergies !== 'None' ? c.medicalInfo?.allergies : 'None',
      emergencyContactName: c.emergencyContact?.name || '',
      emergencyContactPhone: c.emergencyContact?.phone || '',
      emergencyContactRelationship: c.emergencyContact?.relation?.toLowerCase() || 'parent',
      q1: c.questions?.place ?? '',
      q2: c.questions?.verse ?? '',
      q3: c.questions?.pain ?? '',
      status: c.status != "3" ? "Pending" : "Approved",
      secretIdentity: c.secret_identity,
      secretAngel: secretAngel ? secretAngel.name : "",
      iceBreakingTarget: "Liam Chen",
      group: c.group || "",
      roomNumber: `R${100 + c.id}`,
      registrationTime
    };
  })
);

const availableGroups = computed(() => {
  const groups = new Set(records.value.map(r => r.group).filter(Boolean));
  return Array.from(groups).sort();
});

const availableRooms = computed(() => {
  const rooms = new Set(records.value.map(r => r.roomNumber).filter(Boolean));
  return Array.from(rooms).sort();
});

const filteredRecords = computed(() => {
  return records.value.filter(r => {
    const matchTab = activeTab.value === 'All' || r.status === activeTab.value;
    const matchGroup = filterGroup.value === 'All' || r.group === filterGroup.value;
    const matchRoom = filterRoom.value === 'All' || r.roomNumber === filterRoom.value;
    return matchTab && matchGroup && matchRoom;
  });
});

const recordOptions = computed(() => {
  if (!selectedRecord.value) return [];
  // Exclude current user from targets options
  return records.value.filter(r => r.id !== selectedRecord.value.id);
});

const selectedRecord = ref(null);
const editForm = reactive({
  status: '',
  group: '',
  roomNumber: '',
  transportation: '',
  secretIdentity: '',
  secretAngel: '',
  iceBreakingTarget: ''
});

function openModal(record) {
  selectedRecord.value = record;
  editForm.status = record.status;
  editForm.group = record.group || '';
  editForm.roomNumber = record.roomNumber || '';
  editForm.transportation = record.transportation;
  editForm.secretIdentity = record.secretIdentity || '';
  editForm.secretAngel = record.secretAngel || '';
  editForm.iceBreakingTarget = record.iceBreakingTarget || '';
}

function closeModal() {
  selectedRecord.value = null;
}

function saveChanges() {
  if (!selectedRecord.value) return;
  
  // Find index and update
  const index = records.value.findIndex(r => r.id === selectedRecord.value.id);
  if (index !== -1) {
    records.value[index] = {
      ...records.value[index],
      status: editForm.status,
      group: editForm.group,
      roomNumber: editForm.roomNumber,
      transportation: editForm.transportation,
      secretIdentity: editForm.secretIdentity,
      secretAngel: editForm.secretAngel,
      iceBreakingTarget: editForm.iceBreakingTarget
    };
  }
  
  closeModal();
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
