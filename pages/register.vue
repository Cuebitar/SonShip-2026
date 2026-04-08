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
        <div class="space-y-4 lg:sticky lg:top-24 lg:self-start">
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
            <div class="space-y-3">
              <p class="input-label">💰 {{ t('register.fee') }}</p>
              <div class="p-4 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-between shadow-warm shadow-primary/5">
                <div>
                  <p class="font-heading font-bold text-sm text-primary">{{ t('register.early_bird') }}</p>
                  <p class="text-xs text-tertiary/70 mt-1">before 31th May</p>
                </div>
                <p class="font-heading text-primary font-bold text-2xl">RM 200</p>
              </div>
              <div class="p-3 rounded-lg border border-primary/10 bg-dark/50 flex items-center justify-between hover:border-primary/20 transition-colors">
                <div>
                  <p class="font-heading font-bold text-sm text-tertiary">{{ t('register.normal') }}</p>
                  <p class="text-xs text-tertiary/50 mt-1">before 30th June</p>
                </div>
                <p class="font-heading text-primary font-bold text-xl">RM 230</p>
              </div>
              <div class="p-3 rounded-lg border border-primary/10 bg-dark/50 flex items-center justify-between hover:border-primary/20 transition-colors">
                <div>
                  <p class="font-heading font-bold text-sm text-tertiary">{{ t('register.super_late_bird') }}</p>
                  <p class="text-xs text-tertiary/50 mt-1">from 1st July</p>
                </div>
                <p class="font-heading text-primary font-bold text-xl">RM 280</p>
              </div>
              <p class="font-body text-xs text-tertiary/50 !mt-4">{{ t('register.fee_note') }}</p>
            </div>
            <div class="divider" />
            <div class="card bg-primary/10 border-primary/30 p-4">
              <p class="font-body text-sm text-primary">{{ t('register.warning') }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <form @submit.prevent="handleSubmit" novalidate class="card p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="input-label">{{ t('register.full_name') }} *</label>
                <input
                  v-model="form.fullName"
                  required
                  data-field="fullName"
                  :placeholder="'e.g. Liam Chen'"
                  :aria-invalid="Boolean(fieldErrors.fullName)"
                  :class="getInputClasses('fullName')"
                  @input="clearFieldError('fullName')"
                />
                <p v-if="fieldErrors.fullName" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.fullName }}</p>
              </div>
              <div>
                <label class="input-label">{{ t('register.ic_number') }} *</label>
                <input
                  v-model="form.ic"
                  required
                  data-field="ic"
                  inputmode="tel"
                  maxlength="14"
                  placeholder="e.g. 990101-14-5678"
                  :aria-invalid="Boolean(fieldErrors.ic)"
                  :class="getInputClasses('ic')"
                  @input="clearFieldError('ic')"
                />
                <p v-if="fieldErrors.ic" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.ic }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="input-label">{{ t('register.phone') }} *</label>
                <input
                  v-model="form.phone"
                  required
                  data-field="phone"
                  type="tel"
                  inputmode="tel"
                  placeholder="e.g. 012-3456789"
                  :aria-invalid="Boolean(fieldErrors.phone)"
                  :class="getInputClasses('phone')"
                  @input="clearFieldError('phone')"
                />
                <p v-if="fieldErrors.phone" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.phone }}</p>
              </div>
              <div>
                <label class="input-label">{{ t('register.email') }} *</label>
                <input
                  v-model="form.email"
                  required
                  data-field="email"
                  type="email"
                  autocomplete="email"
                  placeholder="e.g. sonship@megasubangcmc.org.my"
                  :aria-invalid="Boolean(fieldErrors.email)"
                  :class="getInputClasses('email')"
                  @input="clearFieldError('email')"
                />
                <p v-if="fieldErrors.email" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.email }}</p>
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
                  v-model="form.transport" 
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
              <textarea v-model="form.important_info" :rows="3" class="w-full input" placeholder="Any allergies, medical conditions, dietary needs..." />
            </div>

            <div class="divider" />
            <h4 class="font-heading font-bold text-tertiary">Emergency Contact</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="input-label">{{ t('register.emergency_contact_name') }} *</label>
                <input
                  v-model="form.emergency.name"
                  required
                  data-field="emergency_name"
                  :placeholder="'e.g. Liam Chen'"
                  :aria-invalid="Boolean(fieldErrors.emergency_name)"
                  :class="getInputClasses('emergency_name')"
                  @input="clearFieldError('emergency_name')"
                />
                <p v-if="fieldErrors.emergency_name" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.emergency_name }}</p>
              </div>
              <div>
                <label class="input-label">{{ t('register.emergency_contact_phone') }} *</label>
                <input
                  v-model="form.emergency.phone"
                  required
                  data-field="emergency_phone"
                  type="tel"
                  inputmode="tel"
                  placeholder="e.g. 012-3456789"
                  :aria-invalid="Boolean(fieldErrors.emergency_phone)"
                  :class="getInputClasses('emergency_phone')"
                  @input="clearFieldError('emergency_phone')"
                />
                <p v-if="fieldErrors.emergency_phone" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.emergency_phone }}</p>
              </div>
            </div>

            <div>
              <label class="input-label">{{ t('register.emergency_contact_relationship') }} *</label>
              <select 
                v-model="form.emergency.relationship" 
                data-field="emergency_relationship"
                :class="getInputClasses('emergency_relationship')" 
                placeholder="Choose One Relationship"
                :aria-invalid="Boolean(fieldErrors.emergency_relationship)"
                required
                @change="clearFieldError('emergency_relationship')"
              >
                <option value="" disabled>{{ t('register.select_relationship') }}</option>
                <option v-for="option in relationshipOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <p v-if="fieldErrors.emergency_relationship" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.emergency_relationship }}</p>
            </div>

            <div class="divider" />
            <h4 class="font-heading font-bold text-tertiary">Additional Questions</h4>

            <div>
              <label class="input-label">{{ t('register.q3') }}</label>
              <input
                v-model="form.q3"
                required
                data-field="q3"
                placeholder="Playing Guitar..."
                :aria-invalid="Boolean(fieldErrors.q3)"
                :class="getInputClasses('q3')"
                @input="clearFieldError('q3')"
              />
              <p v-if="fieldErrors.q3" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.q3 }}</p>
            </div>
            <div>
              <label class="input-label">{{ t('register.q1') }}</label>
              <input
                v-model="form.q1"
                required
                data-field="q1"
                :rows="3"
                placeholder="The Prodigal Son..."
                :aria-invalid="Boolean(fieldErrors.q1)"
                :class="getInputClasses('q1')"
                @input="clearFieldError('q1')"
              />
              <p v-if="fieldErrors.q1" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.q1 }}</p>
            </div>
            <div>
              <label class="input-label">{{ t('register.q2') }}</label>
              <input
                v-model="form.q2"
                required
                data-field="q2"
                :rows="2"
                placeholder="Words of Encouragement..."
                :aria-invalid="Boolean(fieldErrors.q2)"
                :class="getInputClasses('q2')"
                @input="clearFieldError('q2')"
              />
              <p v-if="fieldErrors.q2" class="font-body text-xs text-red-400 mt-2">{{ fieldErrors.q2 }}</p>
            </div>

            <div class="pt-2">
              <p v-if="submitError" class="font-body text-sm text-red-400 mb-3">{{ submitError }}</p>
              <UButton type="submit" block size="lg" :loading="loading">
                {{ t('register.submit') }}
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </section>

    <UModal v-model="showSuccess" class="rounded-lg">
      <div class="success-modal">
        <div class="success-modal__glow success-modal__glow--top" />
        <div class="success-modal__glow success-modal__glow--bottom" />
        <div class="success-modal__inner">
          <div class="success-modal__icon">
            <TicketCheck class="w-10 h-10 text-primary" />
          </div>
          <p class="success-modal__badge">{{ t('register.success_badge') }}</p>
          <h3 class="font-heading font-black text-3xl text-primary mb-3">{{ t('register.success_title') }} 🎉</h3>
          <p class="font-body text-tertiary/90 leading-relaxed mb-5">{{ t('register.success_msg') }}</p>

          <UButton block size="lg" class="success-modal__cta" @click="closeRegistration">
            {{ t('register.success_close') }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { Info, TicketCheck } from 'lucide-vue-next'
import { nextTick, onMounted } from 'vue';
import { useCampersStore } from '~/stores/campers'
const { t, locale } = useI18n()

const campersStore = useCampersStore();
const loading        = ref(false)
const showSuccess    = ref(false)
const submitError    = ref('')
const seoTitle       = ref('Registration | SonShip 2026');
const seoDescription = ref('Register for the SonShip 2026 Youth Camp hosted by CMC Subang. Join us from August 28-31 at Radiant Retreats in Janda Baik for an unforgettable experience. Secure your spot today!');

const requestUrl          = useRequestURL()
const canonicalUrl        = computed(() => new URL('/register', requestUrl.origin).toString());

const structuredData      = computed(() => ({
  '@context': 'https://schema.org',
  '@type'   : 'WebPage',
  name      : seoTitle.value,
  description: seoDescription.value,
  url       : canonicalUrl.value,
  inLanguage: locale.value
}))

useHead(() => ({
  title: seoTitle.value,
  script: [
    {
      key: 'register-structured-data',
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))

useSeoMeta({
  title             : () => seoTitle.value,
  description       : () => seoDescription.value,
  ogTitle           : () => seoTitle.value,
  ogDescription     : () => seoDescription.value,
  ogImage           : () => `${requestUrl.origin}/firelight.svg`,
  ogImageAlt        : 'SonShip 2026',
  ogType            : 'website',
  ogUrl             : () => canonicalUrl.value,
  twitterTitle      : () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage      : () => `${requestUrl.origin}/firelight.svg`
})

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
  transport: 'bus',
  emergency: {
    name: '',
    phone: '',
    relationship: '',
  },
  important_info: '',
  q1: '',
  q2: '',
  q3: '',
})

const fieldOrder = [
  'fullName',
  'ic',
  'phone',
  'email',
  'emergency_name',
  'emergency_phone',
  'emergency_relationship',
  'q3',
  'q1',
  'q2',
]

const fieldLabels = {
  fullName: 'register.full_name',
  ic: 'register.ic_number',
  phone: 'register.phone',
  email: 'register.email',
  emergency_name: 'register.emergency_contact_name',
  emergency_phone: 'register.emergency_contact_phone',
  emergency_relationship: 'register.emergency_contact_relationship',
  q1: 'register.q1',
  q2: 'register.q2',
  q3: 'register.q3',
}

const fieldErrors = reactive(
  fieldOrder.reduce((errors, field) => {
    errors[field] = ''
    return errors
  }, {})
)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeIc(value) {
  return value.replace(/\D/g, '')
}

function normalizePhone(value) {
  return value.replace(/[\s()-]/g, '')
}

function isValidPhoneNumber(value) {
  if (!/^\+?\d+$/.test(value)) return false

  const digits = value.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 12
}

function clearFieldError(field) {
  fieldErrors[field] = ''
  submitError.value = ''
}

function resetFieldErrors() {
  fieldOrder.forEach((field) => {
    fieldErrors[field] = ''
  })
}

function getInputClasses(field) {
  return [
    'w-full input',
    fieldErrors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : '',
  ]
}

async function focusFirstInvalidField() {
  const firstInvalidField = fieldOrder.find((field) => fieldErrors[field])
  if (!firstInvalidField) return

  await nextTick()
  const fieldElement = document.querySelector(`[data-field="${firstInvalidField}"]`)
  if (fieldElement instanceof HTMLElement) {
    fieldElement.focus()
    fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function validateForm() {
  resetFieldErrors()

  const normalized = {
    fullName: form.fullName.trim(),
    ic: normalizeIc(form.ic),
    phone: normalizePhone(form.phone),
    email: form.email.trim().toLowerCase(),
    emergency_name: form.emergency.name.trim(),
    emergency_phone: normalizePhone(form.emergency.phone),
    emergency_relationship: form.emergency.relationship,
    important_info: form.important_info.trim(),
    q1: form.q1.trim(),
    q2: form.q2.trim(),
    q3: form.q3.trim(),
  }

  fieldOrder.forEach((field) => {
    if (!normalized[field]) {
      fieldErrors[field] = t('register.validation.required', {
        field: t(fieldLabels[field]),
      })
    }
  })

  if (!fieldErrors.ic && !/^\d{12}$/.test(normalized.ic)) {
    fieldErrors.ic = t('register.validation.ic')
  }

  if (!fieldErrors.email && !EMAIL_REGEX.test(normalized.email)) {
    fieldErrors.email = t('register.validation.email')
  }

  if (!fieldErrors.phone && !isValidPhoneNumber(normalized.phone)) {
    fieldErrors.phone = t('register.validation.phone')
  }

  if (!fieldErrors.emergency_phone && !isValidPhoneNumber(normalized.emergency_phone)) {
    fieldErrors.emergency_phone = t('register.validation.phone')
  }

  const campersReady = await campersStore.initCampers()
  if (campersReady) {
    const hasDuplicateIc = campersStore.campers.some((camper) => normalizeIc(camper.ic || '') === normalized.ic)
    const hasDuplicateEmail = campersStore.campers.some((camper) => (camper.email || '').trim().toLowerCase() === normalized.email)

    if (!fieldErrors.ic && hasDuplicateIc) {
      fieldErrors.ic = t('register.validation.ic_taken')
    }

    if (!fieldErrors.email && hasDuplicateEmail) {
      fieldErrors.email = t('register.validation.email_taken')
    }
  }

  const isValid = fieldOrder.every((field) => !fieldErrors[field])

  if (!isValid) {
    await focusFirstInvalidField()
  }

  return { isValid, normalized }
}

async function handleSubmit() {
  submitError.value = ''

  const { isValid, normalized } = await validateForm()
  if (!isValid) return

  loading.value = true
  await new Promise((r) => setTimeout(r, 1200))

  const baseString = normalized.fullName.split(' ').slice(0, 5).join('').toLowerCase() + normalized.ic.slice(0, 6);
  const password = baseString.split('').sort(() => 0.5 - Math.random()).join('');
  const camper = {
    transport: form.transport,
    ic: normalized.ic,
    important_info: normalized.important_info,
    phone: normalized.phone,
    emergency: {
      name: normalized.emergency_name,
      relationship: normalized.emergency_relationship,
      phone: normalized.emergency_phone
    },
    name: normalized.fullName,
    is_admin: false,
    password: password,
    changed_password: false,
    questions: {
      place: normalized.q1,
      pain: normalized.q2,
      verse: normalized.q3
    },
    gender: form.gender,
    email: normalized.email,
    status: 'Pending',
    registrationTime: new Date().toISOString(),
  };
  // Assign a random people or animal emoji avatar
  const emojiAvatars = [
    "👦","👧","👨","👩","🧑","👱‍♂️","👱‍♀️","🧔","🧒","👶",
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
    "🦁","🐮","🐷","🐸","🐵","🦄","🐔","🐧","🐦","🐤",
    "🐥","🦆","🦉","🦅","🐴","🐢","🐍","🐬","🐳","🐙"
  ];
  camper.avatar = emojiAvatars[Math.floor(Math.random() * emojiAvatars.length)];

  try {
    await campersStore.registerCamper(camper);
    showSuccess.value = true;
  } catch (error) {
    if (error?.code === 'auth/email-already-in-use' || error?.code === 'campers/email-already-exists') {
      fieldErrors.email = t('register.validation.email_taken')
      await focusFirstInvalidField()
    } else if (error?.code === 'campers/ic-already-exists') {
      fieldErrors.ic = t('register.validation.ic_taken')
      await focusFirstInvalidField()
    } else {
      submitError.value = t('register.validation.submit_error')
    }
    window.reload();
    console.error(error);
  } finally {
    loading.value = false
  }
}

function closeRegistration() {
  showSuccess.value = false;
  navigateTo('/');
}
onMounted(() => {
  campersStore.initCampers();
})
</script>

<style scoped>
.success-modal {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  max-width: 38rem;
  border: 1px solid rgba(230, 177, 83, 0.28);
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 186, 90, 0.24), transparent 36%),
    radial-gradient(circle at 92% 86%, rgba(255, 119, 73, 0.15), transparent 42%),
    linear-gradient(145deg, rgba(33, 29, 26, 0.96), rgba(24, 20, 18, 0.96));
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 199, 122, 0.08) inset;
}

.success-modal__inner {
  position: relative;
  padding: 2.1rem 2.3rem 2rem;
  text-align: center;
}

.success-modal__glow {
  position: absolute;
  width: 16rem;
  height: 16rem;
  border-radius: 9999px;
  filter: blur(22px);
  pointer-events: none;
}

.success-modal__glow--top {
  top: -8rem;
  left: -4.5rem;
  background: rgba(255, 162, 64, 0.34);
}

.success-modal__glow--bottom {
  right: -5.5rem;
  bottom: -9rem;
  background: rgba(255, 106, 74, 0.26);
}

.success-modal__icon {
  display: flex;
  width: 5rem;
  height: 5rem;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(230, 177, 83, 0.45);
  background: linear-gradient(145deg, rgba(230, 177, 83, 0.22), rgba(230, 177, 83, 0.08));
  box-shadow: 0 12px 28px rgba(230, 177, 83, 0.2);
  animation: success-pop 2.3s ease-in-out infinite;
}

.success-modal__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9rem;
  padding: 0.35rem 0.95rem;
  border-radius: 9999px;
  border: 1px solid rgba(230, 177, 83, 0.33);
  background: rgba(230, 177, 83, 0.14);
  color: #f7c06f;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

:deep(.success-modal__cta) {
  border: 0;
  border-radius: 0.95rem;
  color: #fff7ef;
  font-weight: 800;
  background: linear-gradient(135deg, #ffab2e, #ff7a3d);
  box-shadow: 0 16px 28px rgba(255, 125, 45, 0.36);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

:deep(.success-modal__cta:hover) {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 20px 30px rgba(255, 125, 45, 0.42);
}

@keyframes success-pop {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 640px) {
  .success-modal {
    margin-inline: 0.5rem;
    border-radius: 1.25rem;
  }

  .success-modal__inner {
    padding: 1.4rem 1.1rem 1.25rem;
  }
}
</style>
