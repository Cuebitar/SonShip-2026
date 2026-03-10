<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10 max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="section-title">{{ t('profile.title') }}</h1>
        <button v-if="!editing" @click="editing = true" class="btn-secondary btn-sm">
          <Pencil class="w-4 h-4" /> {{ t('profile.edit') }}
        </button>
        <div v-else class="flex gap-2">
          <button @click="save" class="btn-primary btn-sm"><Save class="w-4 h-4" /> {{ t('profile.save') }}</button>
          <button @click="cancel" class="btn-ghost btn-sm"><X class="w-4 h-4" /> {{ t('profile.cancel') }}</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left: QR Card -->
        <div class="space-y-4">
          <div class="card p-6 text-center">
            <div class="text-6xl mb-3">{{ profile.avatar }}</div>
            <h2 class="font-heading font-bold text-lg text-tertiary">{{ profile.name }}</h2>
            <p class="font-body text-sm text-primary">{{ profile.group }}</p>
          </div>

          <div class="card p-6 text-center">
            <h3 class="font-heading font-bold text-primary mb-3 text-sm">{{ t('profile.qr_title') }}</h3>
            <!-- CSS QR Code visual -->
            <div class="qr-wrapper mx-auto mb-3" style="width:120px;height:120px;background:#F6E9D7;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:10px">
              <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;width:100%">
                <div v-for="cell in qrPattern" :key="cell.id"
                  :style="`background:${cell.filled ? '#3A2620' : '#F6E9D7'};border-radius:1px;aspect-ratio:1`"></div>
              </div>
            </div>
            <p class="font-heading font-black text-xl text-primary">{{ profile.campCode }}</p>
            <p class="font-body text-xs text-tertiary/50 mt-1">{{ t('profile.qr_subtitle') }}</p>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="md:col-span-2 space-y-5">
          <!-- Personal -->
          <div class="card p-6">
            <h3 class="font-heading font-bold text-primary mb-4">{{ t('profile.personal') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="input-label">{{ t('common.name') }}</label>
                <input v-if="editing" v-model="draft.name" class="input" />
                <p v-else class="font-body text-tertiary">{{ profile.name }}</p>
              </div>
              <div>
                <label class="input-label">Email</label>
                <p class="font-body text-tertiary">{{ profile.email }}</p>
              </div>
              <div>
                <label class="input-label">Phone</label>
                <input v-if="editing" v-model="draft.phone" class="input" />
                <p v-else class="font-body text-tertiary">{{ profile.phone }}</p>
              </div>
              <div>
                <label class="input-label">{{ t('common.group') }}</label>
                <p class="font-body text-primary font-semibold">{{ profile.group }}</p>
              </div>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="card p-6">
            <h3 class="font-heading font-bold text-primary mb-4">{{ t('profile.emergency') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="input-label">Name</label>
                <input v-if="editing" v-model="draft.emergencyContact.name" class="input" />
                <p v-else class="font-body text-tertiary">{{ profile.emergencyContact?.name }}</p>
              </div>
              <div>
                <label class="input-label">Phone</label>
                <input v-if="editing" v-model="draft.emergencyContact.phone" class="input" />
                <p v-else class="font-body text-tertiary">{{ profile.emergencyContact?.phone }}</p>
              </div>
              <div>
                <label class="input-label">Relation</label>
                <input v-if="editing" v-model="draft.emergencyContact.relation" class="input" />
                <p v-else class="font-body text-tertiary">{{ profile.emergencyContact?.relation }}</p>
              </div>
            </div>
          </div>

          <!-- Medical -->
          <div class="card p-6">
            <h3 class="font-heading font-bold text-primary mb-4">{{ t('profile.medical') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div v-for="field in ['allergies', 'medications', 'conditions']" :key="field">
                <label class="input-label capitalize">{{ field }}</label>
                <input v-if="editing" v-model="draft.medicalInfo[field]" class="input" />
                <p v-else class="font-body text-tertiary">{{ profile.medicalInfo?.[field] }}</p>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="card p-6">
            <h3 class="font-heading font-bold text-primary mb-4">{{ t('profile.preferences') }}</h3>
            <div>
              <label class="input-label">Dietary Preference</label>
              <select v-if="editing" v-model="draft.dietary" class="input">
                <option>No restrictions</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Halal</option>
                <option>Gluten-free</option>
              </select>
              <p v-else class="font-body text-tertiary">{{ profile.dietary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true })

import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useCampersStore } from '~/stores/campers'
import { Pencil, Save, X } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()

const profile = computed(() => campersStore.getCamperById(auth.user?.id) || auth.user)
const editing = ref(false)
const draft = reactive({
  name: '', phone: '',
  emergencyContact: { name: '', phone: '', relation: '' },
  medicalInfo: { allergies: '', medications: '', conditions: '' },
  dietary: '',
})

function startEdit() {
  const p = profile.value
  draft.name = p.name; draft.phone = p.phone; draft.dietary = p.dietary
  Object.assign(draft.emergencyContact, p.emergencyContact)
  Object.assign(draft.medicalInfo, p.medicalInfo)
}

function save() {
  const camper = campersStore.getCamperById(auth.user?.id)
  if (camper) {
    camper.name = draft.name; camper.phone = draft.phone; camper.dietary = draft.dietary
    Object.assign(camper.emergencyContact, draft.emergencyContact)
    Object.assign(camper.medicalInfo, draft.medicalInfo)
  }
  editing.value = false
}

function cancel() { editing.value = false }

// Generate a simple QR-like pattern from campCode
const qrPattern = computed(() => {
  const code = profile.value?.campCode || 'SC001'
  let seed = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return Array.from({ length: 49 }, (_, i) => {
    const row = Math.floor(i / 7), col = i % 7
    // Corner QR markers
    const isMarker = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2)
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return { id: i, filled: isMarker || (seed % 3 !== 0) }
  })
})

import { watch } from 'vue'
watch(editing, (v) => { if (v) startEdit() })
</script>
