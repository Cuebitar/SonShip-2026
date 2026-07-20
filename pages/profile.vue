<template>
  <div class="page-container bg-dark">
    <!-- Banner Image (顶部风景图) -->
    <div class="w-full h-48 bg-cover bg-center" 
     :style="{ backgroundImage: `linear-gradient(to bottom, transparent, var(--color-bg-dark, #111)), url(${firecamp})` }">
    </div>
    
    <!-- 调整 1：将 max-w-7xl 改为 max-w-5xl，让整个版面更紧凑并完美居中 -->
    <div class="container-inner max-w-5xl mx-auto px-4 -mt-20 relative z-10 pb-10">

      <!-- Header -->
      <div class="flex items-end justify-between mb-8 gap-2">
        <div>
          <h1 class="section-title truncate text-4xl mb-1">{{ t('profile.title') }}</h1>
          <p class="font-body text-tertiary/70 text-sm">Manage your camp profile and important information</p>
        </div>
        <div class="flex-shrink-0">
          <button v-if="!editing" @click="editing = true" class="btn-secondary btn-sm flex items-center gap-2">
            <Pencil class="w-4 h-4" /> {{ t('profile.edit') }}
          </button>
          <div v-else class="flex gap-2">
            <button @click="save" class="btn-primary btn-sm flex items-center gap-2">
              <Save class="w-4 h-4" /> {{ t('profile.save') }}
            </button>
            <button @click="cancel" class="btn-ghost btn-sm flex items-center gap-2">
              <X class="w-4 h-4" /> {{ t('profile.cancel') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 调整 2：改为两列布局 (左侧 280px，右侧自适应) -->
      <div class="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-8">

        <!-- Left: Avatar + QR -->
        <div class="card p-6 flex flex-col items-center text-center relative overflow-hidden h-full">
          <div class="relative z-10 w-full">
            <h2 class="font-heading font-bold text-lg text-primary mb-1">Hello, Camper! 👋</h2>
            <p class="font-body text-xs text-tertiary/70 mb-6">Ready for your next adventure?</p>

            <div class="text-6xl mb-4">{{ profile.avatar }}</div>
            
            <h2 class="font-heading font-bold text-lg text-tertiary truncate">{{ profile.name }}</h2>
            <p class="font-body text-sm text-primary truncate font-semibold mb-8">{{ profile.group }}</p>

            <h3 class="font-heading font-bold text-primary mb-3 text-sm">{{ t('profile.qr_title') }}</h3>
            <div class="qr-wrapper mx-auto mb-3"
              style="width:120px;height:120px;background:#F6E9D7;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:8px">
              <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;width:100%">
                <div v-for="cell in qrPattern" :key="cell.id"
                  :style="`background:${cell.filled ? '#3A2620' : '#F6E9D7'};border-radius:1px;aspect-ratio:1`">
                </div>
              </div>
            </div>
            <p class="font-heading font-black text-xl text-primary">{{ profile.campCode }}</p>
            <p class="font-body text-xs text-tertiary/50 mt-1 leading-tight">{{ t('profile.qr_subtitle') }}</p>
          </div>
          
          <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>

        <!-- Right: Info cards -->
        <div class="space-y-5 min-w-0">
          
          <!-- Personal -->
          <div class="card p-6 overflow-hidden">
            <div class="flex items-center gap-3 mb-5">
              <User class="w-5 h-5 text-primary" />
              <h3 class="font-heading font-bold text-primary">{{ t('profile.personal') }}</h3>
            </div>
            <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
              <div class="min-w-0">
                <label class="input-label">{{ t('common.name') }}</label>
                <input v-if="editing" v-model="draft.name" class="input w-full min-w-0" />
                <p v-else class="font-body text-tertiary truncate">{{ profile.name }}</p>
              </div>
              <div class="min-w-0">
                <label class="input-label">Email</label>
                <p class="font-body text-tertiary truncate">{{ profile.email }}</p>
              </div>
              <div class="min-w-0">
                <label class="input-label">Phone</label>
                <input v-if="editing" v-model="draft.phone" class="input w-full min-w-0" />
                <p v-else class="font-body text-tertiary truncate">{{ profile.phone }}</p>
              </div>
              <div class="min-w-0">
                <label class="input-label">{{ t('common.group') }}</label>
                <p class="font-body text-primary font-semibold truncate">{{ profile.group }}</p>
              </div>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="card p-6 overflow-hidden">
            <div class="flex items-center gap-3 mb-5">
              <Phone class="w-5 h-5 text-primary" />
              <h3 class="font-heading font-bold text-primary">{{ t('profile.emergency') }}</h3>
            </div>
            <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
              <div class="min-w-0">
                <label class="input-label">Name</label>
                <input v-if="editing" v-model="draft.emergency.name" class="input w-full min-w-0" />
                <p v-else class="font-body text-tertiary truncate">{{ profile.emergency?.name || '-' }}</p>
              </div>
              <div class="min-w-0">
                <label class="input-label">Phone</label>
                <input v-if="editing" v-model="draft.emergency.phone" class="input w-full min-w-0" />
                <p v-else class="font-body text-tertiary truncate">{{ profile.emergency?.phone || '-' }}</p>
              </div>
              <div class="min-w-0">
                <label class="input-label">Relation</label>
                <input v-if="editing" v-model="draft.emergency.relationship" class="input w-full min-w-0" />
                <p v-else class="font-body text-tertiary truncate">{{ profile.emergency?.relationship || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Medical -->
          <div class="card p-6 overflow-hidden">
            <div class="flex items-center gap-3 mb-5">
              <Heart class="w-5 h-5 text-primary" />
              <h3 class="font-heading font-bold text-primary">{{ t('profile.medical') }}</h3>
            </div>
            <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
              <div v-for="field in ['allergies', 'medications', 'conditions']" :key="field" class="min-w-0">
                <label class="input-label capitalize">{{ field }}</label>
                <input v-if="editing" v-model="draft.medicalInfo[field]" class="input w-full min-w-0" />
                <p v-else class="font-body text-tertiary truncate">{{ profile.medicalInfo?.[field] || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="card p-6 overflow-hidden">
            <div class="flex items-center gap-3 mb-5">
              <Utensils class="w-5 h-5 text-primary" />
              <h3 class="font-heading font-bold text-primary">{{ t('profile.preferences') }}</h3>
            </div>
            <div class="min-w-0 w-full sm:w-1/2">
              <label class="input-label">Dietary Preference</label>
              <select v-if="editing" v-model="draft.dietary" class="input w-full min-w-0">
                <option>No restrictions</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Halal</option>
                <option>Gluten-free</option>
              </select>
              <p v-else class="font-body text-tertiary">{{ profile.dietary || '-' }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCampersStore } from '~/stores/campers'
// 确保引入了新增的图标
import { 
  Pencil, Save, X, User, Phone, Heart, Utensils, 
  Tent, CalendarDays, IdCard, Mountain, MapPin, Share 
} from 'lucide-vue-next'
import firecamp from '~/assets/background/campFire.jpg'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()

const profile = computed(() => campersStore.getCamperById(auth.user?.id) || auth.user)
const editing = ref(false)
const draft = reactive({
  name: '',
  phone: '',
  emergency: { name: '', phone: '', relationship: '' },
  medicalInfo: { allergies: '', medications: '', conditions: '' },
  dietary: '',
})

function startEdit() {
  const p = profile.value
  draft.name = p.name ?? ''
  draft.phone = p.phone ?? ''
  draft.dietary = p.dietary ?? ''
  
  draft.emergency.name = p.emergency?.name ?? ''
  draft.emergency.phone = p.emergency?.phone ?? ''
  draft.emergency.relationship = p.emergency?.relationship ?? ''
  
  draft.medicalInfo.allergies = p.medicalInfo?.allergies ?? ''
  draft.medicalInfo.medications = p.medicalInfo?.medications ?? ''
  draft.medicalInfo.conditions = p.medicalInfo?.conditions ?? ''
}

function save() {
  const camper = campersStore.getCamperById(auth.user?.id)
  const target = camper ?? auth.user

  if (target) {
    target.name = draft.name
    target.phone = draft.phone
    target.dietary = draft.dietary

    if (!target.emergency) target.emergency = {}
    target.emergency.name = draft.emergency.name
    target.emergency.phone = draft.emergency.phone
    target.emergency.relationship = draft.emergency.relationship

    if (!target.medicalInfo) target.medicalInfo = {}
    target.medicalInfo.allergies = draft.medicalInfo.allergies
    target.medicalInfo.medications = draft.medicalInfo.medications
    target.medicalInfo.conditions = draft.medicalInfo.conditions
  }
  editing.value = false
}

function cancel() {
  editing.value = false
}

const qrPattern = computed(() => {
  const code = profile.value?.campCode || 'SC001'
  let seed = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return Array.from({ length: 49 }, (_, i) => {
    const row = Math.floor(i / 7), col = i % 7
    const isMarker = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2)
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return { id: i, filled: isMarker || (seed % 3 !== 0) }
  })
})

watch(editing, (v) => { if (v) startEdit() })
</script>