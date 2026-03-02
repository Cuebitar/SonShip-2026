<template>
  <div class="page-container bg-dark">
    <div class="container-inner py-10 max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="section-title">{{ t('letters.write_title') }}</h1>
          <p class="font-body text-sm text-tertiary/50 mt-1">Write something meaningful to a fellow camper 💌</p>
        </div>
        <RouterLink to="/letters" class="btn-ghost btn-sm">
          <Mail class="w-4 h-4" /> My Letters
        </RouterLink>
      </div>

      <div class="card p-8 bg-[#fdf8f0] border-primary/20 relative overflow-hidden">
        <!-- Paper texture lines -->
        <div class="absolute inset-0 pointer-events-none" style="background: repeating-linear-gradient(transparent, transparent 31px, rgba(230,177,83,0.12) 31px, rgba(230,177,83,0.12) 32px); background-position: 0 40px;"></div>
        <!-- Left margin line -->
        <div class="absolute top-0 bottom-0 left-16 w-px bg-primary/20 pointer-events-none"></div>

        <div class="relative space-y-5">
          <!-- Recipient -->
          <div class="flex items-center gap-4">
            <label class="input-label text-secondary min-w-[60px] mb-0 flex-shrink-0">{{ t('letters.recipient') }}:</label>
            <select v-model="form.toId" class="flex-1 bg-transparent border-b border-secondary/30 text-secondary font-body text-sm focus:outline-none focus:border-primary/60 pb-1">
              <option value="" disabled>Select a camper...</option>
              <option v-for="c in otherCampers" :key="c.id" :value="c.id">{{ c.avatar }} {{ c.name }}</option>
            </select>
          </div>

          <!-- From toggle -->
          <div class="flex items-center gap-4">
            <label class="input-label text-secondary min-w-[60px] mb-0 flex-shrink-0">From:</label>
            <div class="flex gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.anonymous" :value="false" class="accent-secondary" />
                <span class="font-body text-sm text-secondary">{{ auth.user?.name }} ({{ t('letters.named') }})</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.anonymous" :value="true" class="accent-secondary" />
                <span class="font-body text-sm text-secondary">{{ t('letters.anonymous') }} 🎭</span>
              </label>
            </div>
          </div>

          <!-- Letter body -->
          <div class="pt-2">
            <textarea
              v-model="form.body"
              rows="12"
              placeholder="Dear friend,&#10;&#10;I just wanted to say..."
              class="w-full bg-transparent text-secondary font-body text-sm leading-8 resize-none focus:outline-none placeholder-secondary/30"
              style="line-height: 32px;"
            ></textarea>
          </div>

          <!-- Signature -->
          <div class="flex items-center justify-between pt-4 border-t border-secondary/20">
            <p class="font-script text-secondary/60 text-lg">
              {{ form.anonymous ? 'Your Secret Friend 🎭' : auth.user?.name }}
            </p>
            <button @click="submit" :disabled="!form.toId || !form.body.trim()" class="btn-primary">
              <Send class="w-4 h-4" /> {{ t('letters.submit') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Success toast -->
      <Transition name="toast">
        <div v-if="sent" class="fixed bottom-6 right-6 z-50 card p-4 border-primary/30 shadow-warm-lg flex items-center gap-3">
          <span class="text-2xl">💌</span>
          <span class="font-body text-sm text-tertiary">{{ t('letters.sent_success') }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useCampersStore } from '../stores/campers'
import { useLettersStore } from '../stores/letters'
import { Mail, Send } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const campersStore = useCampersStore()
const lettersStore = useLettersStore()

const form = reactive({ toId: '', body: '', anonymous: false })
const sent = ref(false)

const otherCampers = computed(() => campersStore.campers.filter(c => c.id !== auth.user?.id))

function submit() {
  lettersStore.send({ fromId: auth.user.id, toId: form.toId, body: form.body, anonymous: form.anonymous })
  Object.assign(form, { toId: '', body: '', anonymous: false })
  sent.value = true
  setTimeout(() => sent.value = false, 3000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px); }
</style>
