<template>
  <!-- 整个导航外壳 -->
  <div>
    
    <!-- ==================== 1. TOP HEADER (Full Width) ==================== -->
    <header class="fixed top-0 left-0 right-0 h-20 bg-[#0f1015]/95 backdrop-blur-md z-50 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
      
      <!-- Left: Mobile Hamburger & Logo -->
      <!-- lg:w-[236px] 确保在展开 Sidebar 时，Logo 区域与 Sidebar 宽度对齐 -->
      <div class="flex items-center gap-4 lg:w-[236px] shrink-0">
        <!-- 移动端汉堡菜单按钮 -->
        <button @click="mobileOpen = !mobileOpen" class="lg:hidden text-white/70 hover:text-yellow-500 transition-colors p-1">
          <Menu v-if="!mobileOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>

        <!-- 全局 Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img :src="Firelight" class="w-7 h-7 group-hover:scale-110 transition-transform" alt="Firelight"/>
          <Logo class="text-xl tracking-tight text-white group-hover:text-yellow-500 transition-colors" />
        </NuxtLink>
      </div>

      <!-- Center: Search Bar -->
      <div class="hidden md:flex items-center bg-[#15161c] border border-white/5 rounded-xl px-4 py-2 w-72 lg:w-[400px] transition-colors focus-within:border-yellow-500/30 focus-within:bg-[#1a1b23] mx-4">
        <Search class="w-4 h-4 text-white/40 mr-3 shrink-0" />
        <input type="text" placeholder="Search anything..." class="bg-transparent border-none outline-none text-sm text-white/90 w-full placeholder-white/30" />
        <div class="flex items-center justify-center bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-white/40 font-mono ml-2 shrink-0">⌘K</div>
      </div>

      <!-- Right: Controls -->
      <div class="flex items-center gap-3 lg:gap-5 ml-auto shrink-0">
        <!-- Lang Toggle -->
        <button @click="toggleLang"
          class="hidden sm:block text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-semibold">
          {{ locale === 'en' ? 'EN' : '中文' }}
        </button>

        <!-- Guest buttons -->
        <template v-if="hydrated && !auth.isLoggedIn && isCamp">
          <NuxtLink to="/login" class="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm px-5 py-2 rounded-lg transition-colors">{{ t('nav.login') }}</NuxtLink>
        </template>

        <!-- User Profile & Notifications -->
        <template v-else-if="hydrated && auth.isLoggedIn">
          <!-- User Dropdown -->
          <div class="relative" ref="dropdownRef">
            <button @click="showDropdown = !showDropdown"
              class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-yellow-500/20 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all text-yellow-500">
              <span class="text-lg leading-none">{{ auth.user?.avatar || '👱‍♂️' }}</span>
              <span class="font-bold text-sm hidden sm:block">{{ auth.user?.name }}</span>
              <ChevronDown class="w-4 h-4 opacity-70 hidden sm:block" />
            </button>
            
            <Transition name="dropdown">
              <div v-if="showDropdown"
                class="absolute right-0 top-full mt-3 w-52 bg-[#15161c] border border-white/10 rounded-2xl py-2 shadow-2xl">
                <NuxtLink v-for="item in userMenu" :key="item.to" :to="item.to"
                  @click="showDropdown = false"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-yellow-500 hover:bg-white/5 transition-colors">
                  <component :is="item.icon" class="w-4 h-4" />
                  {{ t(item.label) }}
                </NuxtLink>
                <div class="h-px bg-white/10 my-1.5 mx-3" />
                <button @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut class="w-4 h-4" />
                  {{ t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Notification Bell -->
          <button class="relative p-2.5 rounded-full border border-white/10 bg-[#15161c] hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <Bell class="w-5 h-5" />
            <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#0f1015]">
              2
            </span>
          </button>
        </template>
      </div>
    </header>


    <!-- ==================== 2. LEFT SIDEBAR (Desktop) ==================== -->
    <!-- 注意这里的 top-20 和 bottom-0，让侧边栏只占据顶栏下方的空间 -->
   <!-- ==================== 2. LEFT SIDEBAR (Desktop) ==================== -->
   <aside 
      class="fixed left-0 top-20 bottom-0 bg-[#0f1015] border-r border-white/5 hidden lg:flex flex-col z-40 transition-all duration-300 ease-out overflow-hidden"
      :class="navStore.isExpanded ? 'w-[260px]' : 'w-[80px]'"
      @mouseenter="navStore.toggleSidebar(true)"
      @mouseleave="navStore.toggleSidebar(false)"
    >
      <!-- 动态背景图层 -->
      <div 
        class="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen transition-opacity duration-300"
        :style="{ backgroundImage: `url(${firecamp})` }"
      ></div>
      <!-- 暗色渐变遮罩，确保文字清晰度 -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/80 to-[#0f1015]/60 pointer-events-none"></div>

      <!-- Navigation Links (加入 relative z-10 悬浮在背景上) -->
      <nav class="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
        <NuxtLink v-for="link in sideNavLinks" :key="link.to" :to="link.to"
          class="flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group border border-transparent backdrop-blur-sm"
          :class="$route.path === link.to ? 'bg-[#1a1b23]/80 text-yellow-500 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)]' : 'text-white/60 hover:text-white/90 hover:bg-white/10'">
          
          <!-- 图标 -->
          <component :is="link.icon" class="w-6 h-6 shrink-0 transition-colors" :class="$route.path === link.to ? 'text-yellow-500' : 'text-white/40 group-hover:text-white/70'" />
          
          <!-- 文字 -->
          <span v-if="navStore.isExpanded" class="font-medium text-sm whitespace-nowrap">{{ t(link.label) }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom Area (圣经金句) (加入 relative z-10) -->
      <div v-if="navStore.isExpanded" class="relative z-10 p-6 mt-auto border-t border-white/5 text-center bg-[#0a0a0d]/50 backdrop-blur-md">
        <p class="text-[12px] text-yellow-500/80 font-serif italic whitespace-nowrap">"Let your light shine..."</p>
      </div>
    </aside>

    <!-- ==================== 3. MOBILE SIDEBAR DRAWER ==================== -->
    <!-- 背景遮罩 (Top-20 确保不挡住 Top Header) -->
    <Transition name="fade">
      <div v-if="mobileOpen" class="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-30 lg:hidden" @click="mobileOpen = false"></div>
    </Transition>

    <!-- 移动端抽屉 -->
    <Transition name="slide-left">
      <aside v-if="mobileOpen" class="fixed left-0 top-20 bottom-0 w-[260px] bg-[#0f1015] border-r border-white/10 z-40 lg:hidden flex flex-col">
        <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <NuxtLink v-for="link in sideNavLinks" :key="link.to" :to="link.to"
            @click="mobileOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            :class="$route.path === link.to ? 'bg-[#1a1b23] text-yellow-500 border border-white/5' : 'text-white/60 hover:bg-white/5'">
            <component :is="link.icon" class="w-5 h-5" :class="$route.path === link.to ? 'text-yellow-500' : 'text-white/40'"/>
            <span class="font-medium text-sm">{{ t(link.label) }}</span>
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-white/5 flex gap-2">
          <button @click="toggleLang" class="flex-1 py-2 rounded-lg border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/5 transition-colors">
            {{ locale === 'en' ? '中文' : 'EN' }}
          </button>
          <button v-if="auth.isLoggedIn" @click="handleLogout" class="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors">
            {{ t('nav.logout') }}
          </button>
        </div>
      </aside>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useNavStore } from '~/stores/nav'
import Logo from '../Logo.vue'
import Firelight from '../../assets/firelight.svg'
import firecamp from '~/assets/background/campFire.jpg'

import { 
  ChevronDown, Menu, X, LogOut, LayoutDashboard, User, Users, Gamepad2, 
  Search, Bell, Megaphone, Heart, Info, Image, BookOpen, Settings, 
  Calendar, ChevronRight, ShieldAlert 
} from 'lucide-vue-next'

const { t, locale, setLocale } = useI18n()
const auth = useAuthStore()
const navStore = useNavStore()
const router = useRouter()

const mobileOpen = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref(null)
const hydrated = ref(false)

const isAdmin = computed(() => hydrated.value && auth.isLoggedIn && auth.user?.is_admin === true)

const isCamp = computed(() => {
  if (!hydrated.value) return false
  const now = new Date()
  const campStart = new Date('2026-08-29 00:00:00')
  return now >= campStart
})

const sideNavLinks = computed(() => {
  if (isAdmin.value) {
    return [
      { to: '/admin/dashboard', label: 'nav.adminDashboard', icon: ShieldAlert },
      { to: '/admin/users', label: 'nav.manageSchedule', icon: Users },
      { to: '/admin/settings', label: 'nav.settings', icon: Settings },
    ]
  }

  if (hydrated.value && auth.isLoggedIn) {
    return [
      { to: '/dashboard', label: 'nav.dashboard', icon: LayoutDashboard },
      { to: '/schedule', label: 'nav.schedule', icon: Calendar },
      { to: '/games', label: 'nav.games', icon: Gamepad2},
      { to: '/about', label: 'nav.about', icon: Info }, 
      { to: '/devotion', label: 'activities.devotion', icon: BookOpen },
      { to: '/profile', label: 'nav.profile', icon: User },
    ]
  }

  return [
    { to: '/', label: 'nav.home', icon: LayoutDashboard },
    { to: '/about', label: 'nav.about', icon: Info },
    { to: '/register', label: 'nav.register', icon: User },
  ]
})

const userMenu = computed(() => {
  if (isAdmin.value) {
    return [
      { to: '/admin/dashboard', label: 'nav.adminDashboard', icon: ShieldAlert },
      { to: '/profile', label: 'nav.profile', icon: User },
    ]
  }
  return [
    { to: '/profile', label: 'nav.profile', icon: User },
  ]
})

function toggleLang() {
  setLocale(locale.value === 'en' ? 'zh' : 'en')
}

function handleLogout() {
  auth.logout()
  showDropdown.value = false
  mobileOpen.value = false
  router.push('/')
}

function onClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) showDropdown.value = false
}

onMounted(() => {
  hydrated.value = true
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 179, 8, 0.5); 
}

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>