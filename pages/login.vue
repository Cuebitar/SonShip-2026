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

      <!-- ── Ice-Breaking Game Panel (only when ?id= present AND game active) ── -->
      <template v-if="gameId">
        <!-- Loading -->
        <div v-if="iceStore.targetLoading" class="card border-primary/20 p-5 text-center mb-6">
          <Loader2 class="w-5 h-5 animate-spin text-primary mx-auto" />
        </div>

        <!-- Active: round 1+ -->
        <div v-else-if="iceStore.gameState.active" class="mb-6 space-y-3">
          <!-- Target data not yet loaded -->
          <div v-if="!iceStore.targetData"
            class="rounded-2xl border border-white/10 bg-dark/60 p-5 text-center">
            <p class="font-body text-xs text-tertiary/50">{{ iceStore.targetError || 'Loading…' }}</p>
          </div>

          <template v-else>
            <!-- Round 1: Riddle Hunt — riddle + password for target -->
            <div v-if="iceStore.gameState.round === 1" class="space-y-3">
              <div class="rounded-2xl border border-white/10 bg-dark/60 p-5">
                <div v-if="riddleBilingual" class="flex gap-1 mb-3">
                  <button @click="riddleLang = 0"
                    :class="['px-2 py-0.5 rounded text-xs font-bold transition-colors',
                      riddleLang === 0 ? 'bg-primary/20 text-primary' : 'text-tertiary/30 hover:text-tertiary/60']">
                    EN
                  </button>
                  <button @click="riddleLang = 1"
                    :class="['px-2 py-0.5 rounded text-xs font-bold transition-colors',
                      riddleLang === 1 ? 'bg-primary/20 text-primary' : 'text-tertiary/30 hover:text-tertiary/60']">
                    中
                  </button>
                </div>
                <p class="font-body text-sm text-tertiary leading-relaxed whitespace-pre-line">{{ riddleToShow }}</p>
              </div>
              <div v-if="iceStore.targetData.password"
                class="rounded-2xl border border-white/8 bg-white/3 py-4 text-center">
                <p class="font-mono text-xl text-white/90 tracking-widest select-all">{{ iceStore.targetData.password }}</p>
              </div>
            </div>

          </template>
        </div>
        <!-- Round 0 / standby: show nothing -->
      </template>
      <!-- ── End Game Panel ── -->

      <!-- Demo hint (only when no game panel) -->
      <div v-if="!gameId" class="card bg-primary/10 border-primary/20 p-3 mb-6 text-center">
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

import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useIceBreakingStore } from '~/stores/iceBreaking'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import Logo from '~/components/Logo.vue'

const { t } = useI18n()
const auth = useAuthStore()
const iceStore = useIceBreakingStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPw = ref(false)
const forgotModal = ref(false)

// ?id= query param — the logged-in user's own camper ID
const gameId = computed(() => {
  const id = route.query.id
  return Array.isArray(id) ? id[0] : id || ''
})

// 0 = English, 1 = Chinese — default to browser language, toggleable
const riddleLang = ref(0)
onMounted(() => {
  if (navigator?.language?.startsWith('zh')) riddleLang.value = 1
})

const riddleHalves = computed(() => {
  const riddle = iceStore.targetData?.riddle || ''
  if (!riddle) return []
  return riddle.split(/\n\n(?=[一-鿿])/)
})

const riddleToShow = computed(() => {
  const halves = riddleHalves.value
  if (!halves.length) return ''
  return (halves[riddleLang.value] ?? halves[0]).trim()
})

const riddleBilingual = computed(() => riddleHalves.value.length > 1)

async function handleLogin() {
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  const result = await auth.login(form.email, form.password)
  loading.value = false
  if (result.success) {
    const redirect = Array.isArray(route.query.redirect)
      ? route.query.redirect[0]
      : route.query.redirect
    router.push(redirect || '/dashboard')
  } else {
    error.value = result.error
  }
}

onMounted(async () => {
  auth.init()
  if (gameId.value) {
    // subscribeGameState and fetchTargetData both wait for Firebase internally
    iceStore.subscribeGameState()
    await iceStore.fetchTargetData(gameId.value)
  }
})

onUnmounted(() => {
  iceStore.unsubscribeGameState()
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
