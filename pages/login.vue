<template>
  <div class="page-container min-h-screen flex items-center justify-center bg-dark p-4">
    <div class="w-full max-w-md">
      <!-- Brand -->
      <div class="text-center mb-8 sm:pt-16">
        <span class="text-3xl">🔥</span>
        <Logo size="3xl" />
        <p class="font-heading font-bold text-xl text-tertiary mt-4">{{ t('login.title') }}</p>
        <p class="font-body text-sm text-tertiary/60 mt-1">{{ t('login.subtitle') }}</p>
      </div>

      <!-- Demo hint -->
      <div class="card bg-primary/10 border-primary/20 p-3 mb-6 text-center">
        <p class="font-body text-xs text-primary">💡 {{ t('login.demo_hint') }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="card p-8 space-y-5">
        <div v-if="error" class="badge-danger w-full justify-center py-3 rounded-xl">{{ error }}</div>

        <div>
          <label class="input-label">{{ t('login.email') }}</label>
          <input v-model="form.email" type="email" required class="input" placeholder="liam@sonship.com" />
        </div>
        <div>
          <label class="input-label">{{ t('login.password') }}</label>
          <div class="relative">
            <input v-model="form.password" :type="showPw ? 'text' : 'password'" required class="input pr-11" placeholder="••••••••" />
            <button type="button" @click="showPw = !showPw"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary/40 hover:text-primary transition-colors">
              <Eye v-if="!showPw" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="text-right">
          <button type="button" @click="forgotModal = true" class="font-body text-xs text-primary/70 hover:text-primary transition-colors">
            {{ t('login.forgot') }}
          </button>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full justify-center btn-lg">
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>{{ t('login.submit') }}</span>
        </button>
      </form>

      <!-- Social Login (visual only) -->
      <div class="mt-6">
        <div class="flex items-center gap-3 text-xs font-body text-tertiary/40 mb-4">
          <div class="flex-1 h-px bg-primary/10"></div>
          {{ t('login.or') }}
          <div class="flex-1 h-px bg-primary/10"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button class="btn-ghost btn-sm flex items-center gap-2 justify-center" @click="socialNotice">
            <span>🇬</span> Google
          </button>
          <button class="btn-ghost btn-sm flex items-center gap-2 justify-center" @click="socialNotice">
            <span>📘</span> Facebook
          </button>
        </div>
      </div>

      <p class="text-center font-body text-sm text-tertiary/60 mt-6">
        {{ t('login.no_account') }}
        <NuxtLink to="/register" class="text-primary hover:underline ml-1">{{ t('login.register_link') }}</NuxtLink>
      </p>
    </div>

    <!-- Forgot Password Modal -->
    <Transition name="modal">
      <div v-if="forgotModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" @click="forgotModal = false"></div>
        <div class="relative card p-8 max-w-sm w-full border-primary/20">
          <h3 class="font-heading font-bold text-xl text-primary mb-3">Reset Password</h3>
          <p class="font-body text-sm text-tertiary/70 mb-5">Enter your email and we'll send a reset link.</p>
          <input type="email" class="input mb-4" placeholder="your@email.com" />
          <button class="btn-primary w-full justify-center" @click="forgotModal = false">Send Reset Email</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({ guestOnly: true })

import { ref, reactive } from 'vue'
import { useRouter, useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import Logo from '~/components/Logo.vue'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPw = ref(false)
const forgotModal = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  const result = auth.login(form.email, form.password)
  loading.value = false
  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    error.value = result.error
  }
}

function socialNotice() {
  alert('Social login is a demo feature — it\'s not connected to a real provider. Please use email + "sonship123".')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
