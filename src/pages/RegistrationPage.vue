<template>
  <div class="page-container">
    <!-- Header -->
    <section class="py-24 bg-gradient-dark relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,177,83,0.1),transparent_60%)]"></div>
      <div class="container-inner relative z-10 text-center">
        <h1 class="section-title mb-4">{{ t('register.title') }}</h1>
        <p class="section-subtitle max-w-xl mx-auto">{{ t('register.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-dark">
      <div class="container-inner grid grid-cols-1 lg:grid-cols-3 gap-10">

        <!-- Camp Info Sidebar -->
        <div class="space-y-4">
          <h3 class="font-heading font-bold text-primary text-lg">{{ t('register.info_title') }}</h3>
          <div class="card p-6 space-y-4">
            <div>
              <p class="input-label">📅 {{ t('register.date') }}</p>
              <p class="font-body text-tertiary">April 10–12, 2026</p>
            </div>
            <div class="divider" />
            <div>
              <p class="input-label">📍 {{ t('register.venue') }}</p>
              <p class="font-body text-tertiary">Nature Retreat Centre, Selangor, Malaysia</p>
            </div>
            <div class="divider" />
            <div>
              <p class="input-label">💰 {{ t('register.fee') }}</p>
              <p class="font-body text-primary font-bold text-xl">RM 180</p>
              <p class="font-body text-xs text-tertiary/50 mt-1">{{ t('register.fee_note') }}</p>
            </div>
            <div class="divider" />
            <div class="card bg-primary/10 border-primary/30 p-4">
              <p class="font-body text-sm text-primary">
                ⚠️ Registration closes when 60 spots are filled. Register early to secure your place!
              </p>
            </div>
          </div>
        </div>

        <!-- Registration Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="handleSubmit" class="card p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="input-label">{{ t('register.full_name') }} *</label>
                <input v-model="form.fullName" required type="text" class="input" :placeholder="`e.g. Liam Chen`" />
              </div>
              <div>
                <label class="input-label">{{ t('register.ic_number') }} *</label>
                <input v-model="form.ic" required type="text" class="input" placeholder="e.g. 990101-14-5678" />
              </div>
            </div>
            <div>
              <label class="input-label">{{ t('register.phone') }} *</label>
              <input v-model="form.phone" required type="tel" class="input" placeholder="e.g. 012-3456789" />
            </div>
            <div>
              <label class="input-label">{{ t('register.important_info') }}</label>
              <textarea v-model="form.importantInfo" rows="3" class="input resize-none" placeholder="Any allergies, medical conditions, dietary needs..."></textarea>
            </div>

            <div class="divider" />
            <h4 class="font-heading font-bold text-tertiary">Additional Questions</h4>

            <div>
              <label class="input-label">{{ t('register.q1') }}</label>
              <textarea v-model="form.q1" rows="3" class="input resize-none"></textarea>
            </div>
            <div>
              <label class="input-label">{{ t('register.q2') }}</label>
              <textarea v-model="form.q2" rows="2" class="input resize-none"></textarea>
            </div>
            <div>
              <label class="input-label">{{ t('register.q3') }}</label>
              <input v-model="form.q3" type="text" class="input" placeholder="Instagram, friend, church..." />
            </div>

            <div class="pt-2">
              <button type="submit" class="btn-primary w-full justify-center btn-lg" :disabled="loading">
                <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
                <span v-else>{{ t('register.submit') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <Transition name="modal">
      <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="showSuccess = false"></div>
        <div class="relative card p-10 max-w-md text-center border-primary/30 shadow-warm-lg">
          <div class="text-6xl mb-4 animate-bounce">🎉</div>
          <h3 class="font-heading font-black text-2xl text-primary mb-3">{{ t('register.success_title') }}</h3>
          <p class="font-body text-tertiary/80 leading-relaxed mb-6">{{ t('register.success_msg') }}</p>
          <button @click="showSuccess = false" class="btn-primary w-full justify-center">{{ t('register.success_close') }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loader2 } from 'lucide-vue-next'

const { t } = useI18n()
const loading = ref(false)
const showSuccess = ref(false)

const form = reactive({ fullName: '', ic: '', phone: '', importantInfo: '', q1: '', q2: '', q3: '' })

async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
  showSuccess.value = true
  Object.assign(form, { fullName: '', ic: '', phone: '', importantInfo: '', q1: '', q2: '', q3: '' })
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative.card, .modal-leave-to .relative.card { transform: scale(0.95) translateY(16px); }
</style>
