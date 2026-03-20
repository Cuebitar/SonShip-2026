<template>
  <div class="page-container">
    <section class="py-24 bg-gradient-dark relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,177,83,0.1),transparent_60%)]" />
      <div class="container-inner relative z-10 text-center">
        <h1 class="section-title mb-4">{{ t('register.title') }}</h1>
        <p class="section-subtitle max-w-xl mx-auto">{{ t('register.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-dark">
      <div class="container-inner grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="space-y-4">
          <h3 class="font-heading font-bold text-primary text-lg">{{ t('register.info_title') }}</h3>
          <div class="card p-6 space-y-4">
            <div>
              <p class="input-label">📅 {{ t('register.date') }}</p>
              <p class="font-body text-tertiary">August 28–31, 2026</p>
            </div>
            <div class="divider" />
            <div>
              <p class="input-label">📍 {{ t('register.venue') }}</p>
              <p class="font-body text-tertiary">Radiant Retreats Site B, Jalan Utama Janda Baik, Kampung Chemperoh, 28750 Bentong, Pahang</p>
            </div>
            <div class="divider" />
            <div>
              <p class="input-label">💰 {{ t('register.fee') }}</p>
              <p class="font-body text-primary font-bold text-xl">RM 200 ({{ t('register.early_bird') }}, before 31th May)</p>
              <p class="font-body text-primary font-bold text-xl">RM 230 ({{ t('register.normal') }}, before 30th June)</p>
              <p class="font-body text-primary font-bold text-xl">RM 280 ({{ t('register.super_late_bird') }}, from 1st July)</p>
              <p class="font-body text-xs text-tertiary/50 mt-1">{{ t('register.fee_note') }}</p>
            </div>
            <div class="divider" />
            <div class="card bg-primary/10 border-primary/30 p-4">
              <p class="font-body text-sm text-primary">{{ t('register.warning') }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <form @submit.prevent="handleSubmit" class="card p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="input-label">{{ t('register.full_name') }} *</label>
                <input v-model="form.fullName" required :placeholder="'e.g. Liam Chen'" class="w-full input" />
              </div>
              <div>
                <label class="input-label">{{ t('register.ic_number') }} *</label>
                <input v-model="form.ic" required placeholder="e.g. 990101-14-5678" class="w-full input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="input-label">{{ t('register.phone') }} *</label>
                <input v-model="form.phone" required type="tel" placeholder="e.g. 012-3456789" class="w-full input" />
              </div>
              <div>
                <label class="input-label">{{ t('register.email') }} *</label>
                <input v-model="form.email" required type="email" placeholder="e.g. sonship@megasubangcmc.org.my" class="w-full input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1">
                <label class="input-label">{{ t('register.gender') }} *</label>
                <URadioGroup 
                  color="primary"
                  v-model="form.gender" 
                  :options="genderOptions" 
                  option-attribute="label" 
                  value-attribute="value" 
                  required
                  :uiRadio="{
                    label: 'cursor-pointer input-label',
                    strategy: 'override'
                }"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="input-label flex items-center gap-1">
                  {{ t('register.transportation') }} *
                  <UTooltip text="Car: Drop off at 4:00 PM. Bus: Pick up at 2:30 PM.">
                    <Info class="w-3 h-3" />
                  </UTooltip>
                </label>
                <URadioGroup 
                  v-model="form.transportation" 
                  :options="transportOptions" 
                  option-attribute="label" 
                  value-attribute="value" 
                  required
                  :uiRadio="{
                    label: 'cursor-pointer input-label',
                    strategy: 'override'
                }"
                />
              </div>
            </div>

            <div>
              <label class="input-label">{{ t('register.important_info') }}</label>
              <textarea v-model="form.importantInfo" :rows="3" class="w-full input" placeholder="Any allergies, medical conditions, dietary needs..." />
            </div>

            <div class="divider" />
            <h4 class="font-heading font-bold text-tertiary">Emergency Contact</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="input-label">{{ t('register.emergency_contact_name') }} *</label>
                <input v-model="form.emergencyContactName" required :placeholder="'e.g. Liam Chen'" class="w-full input" />
              </div>
              <div>
                <label class="input-label">{{ t('register.emergency_contact_phone') }} *</label>
                <input v-model="form.emergencyContactPhone" required placeholder="e.g. 012-3456789" class="w-full input" />
              </div>
            </div>

            <div>
              <label class="input-label">{{ t('register.emergency_contact_relationship') }} *</label>
              <select 
                v-model="form.emergencyContactRelationship" 
                class="w-full input" 
                placeholder="Choose One Relationship"
                required
              >
                <option v-for="option in relationshipOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </div>

            <div class="divider" />
            <h4 class="font-heading font-bold text-tertiary">Additional Questions</h4>

            <div>
              <label class="input-label">{{ t('register.q3') }}</label>
              <input v-model="form.q3" required placeholder="Playing Guitar..." class="w-full input" />
            </div>
            <div>
              <label class="input-label">{{ t('register.q1') }}</label>
              <input v-model="form.q1" required :rows="3" class="w-full input" placeholder="The Prodigal Son..." />
            </div>
            <div>
              <label class="input-label">{{ t('register.q2') }}</label>
              <input v-model="form.q2" required :rows="2" class="w-full input" placeholder="Words of Encouragement..."/>
            </div>

            <div class="pt-2">
              <UButton type="submit" block size="lg" :loading="loading">
                {{ t('register.submit') }}
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </section>

    <UModal v-model="showSuccess">
      <div class="card p-10 max-w-md text-center border-primary/30 shadow-warm-lg mx-auto">
        <div class="text-6xl mb-4 animate-bounce">🎉</div>
        <h3 class="font-heading font-black text-2xl text-primary mb-3">{{ t('register.success_title') }}</h3>
        <p class="font-body text-tertiary/80 leading-relaxed mb-6">{{ t('register.success_msg') }}</p>
        <UButton block @click="showSuccess = false">{{ t('register.success_close') }}</UButton>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { Info } from 'lucide-vue-next'
import { onMounted } from 'vue';
import { useCampersStore } from '~/stores/campers'
const { t, locale } = useI18n()

const campersStore = useCampersStore();
const loading = ref(false)
const showSuccess = ref(false)

const genderOptions = computed(() => [
  { label: t('register.male'), value: 'male' },
  { label: t('register.female'), value: 'female' },
])

const transportOptions = computed(() => [
  { label: t('register.bus'), value: 'bus' },
  { label: t('register.car'), value: 'car' },
])

const relationshipOptions = computed(() => [
  { label: t('register.father'), value: 'father' },
  { label: t('register.mother'), value: 'mother' },
  { label: t('register.guardian'), value: 'guardian' },
  { label: t('register.sibling'), value: 'sibling' },
  { label: t('register.partner'), value: 'partner' },
])

const form = reactive({
  fullName: '',
  ic: '',
  phone: '',
  email: '',
  gender: 'male',
  transportation: 'car',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  importantInfo: '',
  q1: '',
  q2: '',
  q3: '',
})

async function handleSubmit() {
  
  loading.value = true
  await new Promise((r) => setTimeout(r, 1200))

  const baseString = form.fullName.split(' ').slice(0, 5).join('').toLowerCase() + form.ic.slice(0, 6);
  const password = baseString.split('').sort(() => 0.5 - Math.random()).join('');
  
  const camper = {
    transport: form.transportation,
    ic: form.ic,
    important_info: form.importantInfo,
    phone: form.phone,
    emergency: {
      name: form.emergencyContactName,
      relationship: form.emergencyContactRelationship,
      phone: form.emergencyContactPhone
    },
    name: form.fullName,
    is_admin: false,
    password: password,
    changed_password: false,
    questions: {
      place: form.q1,
      pain: form.q2,
      verse: form.q3
    },
    gender: form.gender,
    email: form.email
  };

  try {
    await campersStore.registerCamper(camper);
    showSuccess.value = true;
  } catch (error) {

    console.error(error);
  }
  loading.value = false
}

onMounted(() => {
  campersStore.initCampers();
})
</script>

<style scoped>
</style>
