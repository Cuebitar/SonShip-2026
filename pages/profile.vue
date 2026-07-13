<template>
  <div class="page-container bg-dark">
    <!-- Banner Image (新增的顶部风景图) -->
    <!-- 请将 url 替换为你实际的背景图路径 -->
    <div class="w-full h-48 bg-cover bg-center" 
     :style="{ backgroundImage: `linear-gradient(to bottom, transparent, var(--color-bg-dark, #111)), url(${firecamp})` }">
    </div>
    <div class="container-inner max-w-7xl mx-auto px-4 -mt-20 relative z-10 pb-10">

      <!-- Header (保留了你原本的翻译和按钮类名) -->
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

      <!-- Main grid: 三列布局以匹配设计图 -->
      <div class="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px] gap-6">

        <!-- Left: Avatar + QR (保留大头像和原本的变量) -->
        <div class="card p-6 flex flex-col items-center text-center relative overflow-hidden h-full">
          <div class="relative z-10 w-full">
            <h2 class="font-heading font-bold text-lg text-primary mb-1">Hello, Camper! 👋</h2>
            <p class="font-body text-xs text-tertiary/70 mb-6">Ready for your next adventure?</p>

            <!-- 保留原本的大头像 -->
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
          
          <!-- 底部风景剪影装饰 (可通过 CSS 或 img 实现) -->
          <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>

        <!-- Middle: Info cards (保留原本的类名与结构，加入 Icon) -->
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

        <!-- Right: Quick Info (新增的第三列，使用你的 .card 样式) -->
        <div class="card p-6 overflow-hidden h-fit relative">
          <div class="flex items-center gap-3 mb-6 relative z-10">
            <Tent class="w-5 h-5 text-primary" />
            <h3 class="font-heading font-bold text-primary">Quick Info</h3>
          </div>
          
          <div class="space-y-6 relative z-10">
            <div class="flex gap-4 items-start">
              <CalendarDays class="w-5 h-5 text-tertiary/50 mt-0.5 shrink-0" />
              <div class="flex flex-col min-w-0">
                <span class="input-label mb-0.5">Member Since</span>
                <span class="font-body text-tertiary truncate">May 2024</span>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <IdCard class="w-5 h-5 text-tertiary/50 mt-0.5 shrink-0" />
              <div class="flex flex-col min-w-0">
                <span class="input-label mb-0.5">Member ID</span>
                <span class="font-body text-tertiary truncate">CMP-2024-006</span>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <Mountain class="w-5 h-5 text-tertiary/50 mt-0.5 shrink-0" />
              <div class="flex flex-col min-w-0">
                <span class="input-label mb-0.5">Total Trips</span>
                <span class="font-body text-tertiary truncate">3</span>
              </div>
            </div>

            <div class="flex gap-4 items-start">
              <MapPin class="w-5 h-5 text-tertiary/50 mt-0.5 shrink-0" />
              <div class="flex flex-col min-w-0">
                <span class="input-label mb-0.5">Favourite Spot</span>
                <span class="font-body text-tertiary truncate">Pine Hill Campsite</span>
              </div>
            </div>
          </div>

          <!-- Share Button (Bottom Right) -->
          <button class="absolute bottom-5 right-5 w-10 h-10 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 text-primary transition-colors z-10 backdrop-blur-sm">
            <Share class="w-4 h-4" />
          </button>

          <!-- 底部风景剪影装饰 -->
          <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
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