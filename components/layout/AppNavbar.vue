<template>
  <nav class="fixed top-0 left-0 right-0 z-50 h-16 border-b border-primary/10"
       :class="scrolled ? 'bg-dark/95 backdrop-blur-xl shadow-dark' : 'bg-transparent'">
    <div class="container-inner h-full flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <img :src="Firelight" class="w-8 h-8" alt="Firelight"/>
        <Logo size="xl" />
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-1">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to"
          class="nav-link px-3 py-1.5 rounded-xl hover:bg-primary/10 transition-all"
          :class="{ 'nav-link-active bg-primary/10': $route.path === link.to }"
          :aria-label="t(link.label)"
          :title="t(link.label)"
          >
          {{ t(link.label) }}
        </NuxtLink>
      </div>

      <!-- Right Side -->
      <div class="hidden md:flex items-center gap-3">
        <!-- Lang Toggle -->
        <button @click="toggleLang"
          class="btn-ghost btn-sm font-heading text-xs px-3 py-1.5 rounded-md">
          {{ locale === 'en' ? '中文' : 'EN' }}
        </button>

        <!-- Guest buttons -->
        <template v-if="!auth.isLoggedIn && isCamp">
          <NuxtLink to="/register" class="btn-ghost btn-sm rounded-md">{{ t('nav.register') }}</NuxtLink>
          <NuxtLink to="/login" class="btn-primary btn-sm rounded-md">{{ t('nav.login') }}</NuxtLink>
        </template>

        <!-- User avatar -->
        <template v-else-if="auth.isLoggedIn">
          <div class="relative" ref="dropdownRef">
            <button @click="showDropdown = !showDropdown"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all">
              <span class="text-lg">{{ auth.user?.avatar }}</span>
              <span class="font-heading font-semibold text-sm text-primary">{{ auth.user?.name.split(' ')[0] }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-primary/60" />
            </button>
            <Transition name="dropdown">
              <div v-if="showDropdown"
                class="absolute right-0 top-full mt-2 w-48 card border border-primary/20 py-1.5 shadow-warm-lg">
                <NuxtLink v-for="item in userMenu" :key="item.to" :to="item.to"
                  @click="showDropdown = false"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-tertiary/80 hover:text-primary hover:bg-primary/10 transition-all">
                  <component :is="item.icon" class="w-4 h-4" />
                  {{ t(item.label) }}
                </NuxtLink>
                <div class="divider my-1.5 mx-3" />
                <button @click="handleLogout"
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut class="w-4 h-4" />
                  {{ t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </template>
      </div>

      <!-- Mobile Hamburger -->
      <button @click="mobileOpen = !mobileOpen"
        class="md:hidden btn-ghost btn-icon p-2">
        <Menu v-if="!mobileOpen" class="w-5 h-5" />
        <X v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="mobileOpen"
        class="md:hidden absolute top-16 left-0 right-0 bg-dark/98 backdrop-blur-xl border-b border-primary/10 py-4 px-4 space-y-1">
        <NuxtLink v-for="link in [...navLinks, ...mobileExtra]" :key="link.to" :to="link.to"
          @click="mobileOpen = false"
          class="block nav-link px-4 py-3 rounded-xl hover:bg-primary/10 transition-all">
          {{ t(link.label) }}
        </NuxtLink>
        <div class="divider" />
        <div class="flex gap-2 pt-1">
          <button @click="toggleLang" class="btn-ghost btn-sm flex-1">
            {{ locale === 'en' ? '中文' : 'EN' }}
          </button>
          <template v-if="!auth.isLoggedIn && isCamp">
            <NuxtLink to="/login" @click="mobileOpen = false" class="btn-primary btn-sm flex-1 text-center">
              {{ t('nav.login') }}
            </NuxtLink>
          </template>
          <template v-else-if="auth.isLoggedIn">
            <button @click="handleLogout" class="btn-danger btn-sm flex-1">{{ t('nav.logout') }}</button>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import Logo from '../Logo.vue'
import Firelight from '../../assets/firelight.svg'
import { ChevronDown, Menu, X, LogOut, LayoutDashboard, User, Users, Gamepad2, MessageCircle, Mail, Calendar, Image } from 'lucide-vue-next'

const { t, locale, setLocale } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const scrolled = ref(false)
const mobileOpen = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref(null)

const publicLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/about', label: 'nav.about' },
  { to: '/register', label: 'nav.register' },
]

const authLinks = [
  { to: '/dashboard', label: 'nav.dashboard' },
  { to: '/schedule', label: 'nav.schedule' },
  { to: '/gallery', label: 'nav.gallery' },
]

const isCamp = computed(() => {
  const now = new Date()
  const campStart = new Date('2026-08-29 00:00:00')
  return now >= campStart
})
const navLinks = computed(() => auth.isLoggedIn ? [...publicLinks.slice(0,2), ...authLinks] : publicLinks)
const mobileExtra = computed(() => auth.isLoggedIn ? [
  { to: '/profile', label: 'nav.profile' },
  { to: '/friends', label: 'nav.friends' },
  { to: '/games', label: 'nav.games' },
  { to: '/messages', label: 'nav.messages' },
  { to: '/letters', label: 'nav.letters' },
] : [])

const userMenu = [
  { to: '/dashboard', label: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'nav.profile', icon: User },
  { to: '/friends', label: 'nav.friends', icon: Users },
  { to: '/games', label: 'nav.games', icon: Gamepad2 },
  { to: '/messages', label: 'nav.messages', icon: MessageCircle },
  { to: '/letters', label: 'nav.letters', icon: Mail },
  { to: '/schedule', label: 'nav.schedule', icon: Calendar },
  { to: '/gallery', label: 'nav.gallery', icon: Image },
]

function toggleLang() {
  setLocale(locale.value === 'en' ? 'zh' : 'en')
}

function handleLogout() {
  auth.logout()
  showDropdown.value = false
  mobileOpen.value = false
  router.push('/')
}

function onScroll() { scrolled.value = window.scrollY > 20 }
function onClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) showDropdown.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.addEventListener('click', onClickOutside)
  console.log(auth.isLoggedIn)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

.mobile-menu-enter-active, .mobile-menu-leave-active { transition: all 0.25s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
