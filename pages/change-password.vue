<template>
  <div class="page-container bg-dark min-h-screen w-full flex items-center justify-center p-4 overflow-x-hidden">
    <div class="w-full max-w-md mx-auto">
      <!-- Brand -->
      <div class="text-center mb-8 sm:pt-16">
        <span class="text-3xl">🔥</span>
        <Logo size="3xl" />
        <p class="font-heading font-bold text-2xl text-primary mt-4">{{ t('change_password.welcome', { name: auth.user?.name || t('dashboard.camper_fallback') }) }}</p>
        <p class="font-heading font-bold text-lg text-tertiary mt-2">{{ t('change_password.title') }}</p>
        <p class="font-body text-sm text-tertiary/60 mt-1">{{ t('change_password.subtitle') }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="card p-8 space-y-5">
        <div v-if="error" class="badge-danger w-full justify-center py-3 rounded-xl">{{ error }}</div>

        <div>
          <label class="input-label">{{ t('change_password.current_password') }}</label>
          <div class="relative">
            <input v-model="currentPassword" :type="showCurrentPw ? 'text' : 'password'" required class="input pr-11" placeholder="••••••••" />
            <button type="button" @click="showCurrentPw = !showCurrentPw"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary/40 hover:text-primary transition-colors">
              <Eye v-if="!showCurrentPw" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label class="input-label">{{ t('change_password.new_password') }}</label>
          <div class="relative">
            <input v-model="newPassword" :type="showPw ? 'text' : 'password'" required minlength="6" class="input pr-11" placeholder="••••••••" />
            <button type="button" @click="showPw = !showPw"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary/40 hover:text-primary transition-colors">
              <Eye v-if="!showPw" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label class="input-label">{{ t('change_password.confirm_password') }}</label>
          <div class="relative">
            <input v-model="confirmPassword" :type="showConfirmPw ? 'text' : 'password'" required minlength="6" class="input pr-11" placeholder="••••••••" />
            <button type="button" @click="showConfirmPw = !showConfirmPw"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary/40 hover:text-primary transition-colors">
              <Eye v-if="!showConfirmPw" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full justify-center btn-lg">
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>{{ t('change_password.submit') }}</span>
        </button>
      </form>

      <p class="text-center font-body text-sm text-tertiary/60 mt-6">
        <button type="button" @click="handleLogout" class="hover:text-primary hover:underline transition-colors">
          {{ t('change_password.logout_instead') }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requiresAuth: true, ssr: false })

import { ref } from 'vue'
import { useRouter, useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import Logo from '~/components/Logo.vue'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const showCurrentPw = ref(false)
const showPw = ref(false)
const showConfirmPw = ref(false)

async function handleSubmit() {
  error.value = ''

  if (newPassword.value.length < 6) {
    error.value = t('change_password.too_short_error')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = t('change_password.mismatch_error')
    return
  }

  loading.value = true
  const result = await auth.changePassword(currentPassword.value, newPassword.value)
  loading.value = false

  if (result.success) {
    const redirect = Array.isArray(route.query.redirect) ? route.query.redirect[0] : route.query.redirect
    router.push(redirect || '/dashboard')
  } else if (result.code === 'auth/invalid-credential' || result.code === 'auth/wrong-password') {
    error.value = t('change_password.wrong_current_password')
  } else {
    error.value = result.error
  }
}

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>
