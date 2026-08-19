<template>
  <!-- 整个导航外壳 -->
  <div>
    
    <!-- ==================== 1. TOP HEADER (Full Width) ==================== -->
    <header class="fixed top-0 left-0 right-0 h-20 bg-[#0f1015]/95 backdrop-blur-md z-50 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
      
      <!-- Left: Mobile Hamburger & Logo -->
      <!-- lg:w-[236px] 确保在展开 Sidebar 时，Logo 区域与 Sidebar 宽度对齐 -->
      <div class="flex items-center gap-4 lg:w-[236px] shrink-0">
        <!-- 移动端汉堡菜单按钮（游客没有侧边栏内容可看，只有登入后才需要） -->
        <button v-if="hydrated && auth.isLoggedIn" @click="mobileOpen = !mobileOpen" class="lg:hidden text-white/70 hover:text-yellow-500 transition-colors p-1">
          <Menu v-if="!mobileOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>

        <!-- 全局 Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img :src="Firelight" class="w-7 h-7 group-hover:scale-110 transition-transform" alt="Firelight"/>
          <Logo class="text-xl tracking-tight text-white group-hover:text-yellow-500 transition-colors" />
        </NuxtLink>
      </div>

      <!-- Right: Controls -->
      <div class="flex items-center gap-3 lg:gap-5 ml-auto shrink-0">
        <!-- Lang Toggle -->
        <button @click="toggleLang"
          class="hidden sm:block text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-semibold">
          {{ locale === 'en' ? 'EN' : '中文' }}
        </button>

        <!-- Guest buttons -->
        <template v-if="hydrated && !auth.isLoggedIn">
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

   <!-- 1. 替换原来的通知铃铛按钮部分 -->
<div class="relative" ref="notifDropdownRef">
  <button @click="showNotifDropdown = !showNotifDropdown" 
          class="relative p-2.5 rounded-full border border-white/10 bg-[#15161c] hover:bg-white/5 transition-colors text-white/70 hover:text-white">
    <Bell class="w-5 h-5" />
    <span v-if="notifications.length > 0" 
          class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#0f1015] px-0.5">
      {{ notifications.length }}
    </span>
  </button>

  <!-- 2. 下拉式通知卡片 -->
  <Transition name="dropdown">
    <div v-if="showNotifDropdown"
         class="absolute right-0 top-full mt-3 w-80 lg:w-96 bg-[#15161c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60]">
      
      <!-- 标题栏 -->
      <div class="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-[#1a1b23]/50">
        <h3 class="font-bold text-white">{{ t('navbar.notifications') }}</h3>
        <button @click="showNotifDropdown = false" class="text-white/40 hover:text-white transition-colors">✕</button>
      </div>
      
      <!-- 通知内容列表 -->
      <div class="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#0f1015]">
        <div v-if="notifications.length > 0">
          <div v-for="notif in notifications" :key="notif.id" 
               class="px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 mt-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
              <div>
                <p class="text-sm font-bold text-white mb-0.5 group-hover:text-yellow-500 transition-colors">{{ notif.title }}</p>
                <p class="text-xs text-white/50 leading-relaxed">{{ notif.message }}</p>
                <p class="text-[10px] text-white/30 mt-2">{{ timeAgo(notif.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 无通知状态 -->
        <div v-else class="py-12 text-center">
          <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell class="w-6 h-6 text-white/20" />
          </div>
          <p class="text-white/40 text-sm">{{ t('navbar.no_notifications') }}</p>
        </div>
      </div>
    </div>
  </Transition>
</div>
    </template>
  </div>
</header>


    <!-- ==================== 2. LEFT SIDEBAR (Desktop) ==================== -->
    <!-- 注意这里的 top-20 和 bottom-0，让侧边栏只占据顶栏下方的空间 -->
   <!-- ==================== 2. LEFT SIDEBAR (Desktop) ==================== -->
   <aside
      v-if="showSidebar"
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
        <template v-for="link in sideNavLinks" :key="link.to || link.divider">
          <!-- 分组分隔线（管理员的「会员视图」区块） -->
          <div v-if="link.divider" class="pt-4 pb-1">
            <p v-if="navStore.isExpanded" class="px-3 text-[10px] font-bold uppercase tracking-wider text-white/30 whitespace-nowrap">{{ t(link.label) }}</p>
            <div v-else class="h-px bg-white/10 mx-2" />
          </div>

          <NuxtLink v-else :to="link.to"
            class="flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group border border-transparent backdrop-blur-sm"
            :class="$route.path === link.to ? 'bg-[#1a1b23]/80 text-yellow-500 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)]' : 'text-white/60 hover:text-white/90 hover:bg-white/10'">

            <!-- 图标 -->
            <component :is="link.icon" class="w-6 h-6 shrink-0 transition-colors" :class="$route.path === link.to ? 'text-yellow-500' : 'text-white/40 group-hover:text-white/70'" />

            <!-- 文字 -->
            <span v-if="navStore.isExpanded" class="font-medium text-sm whitespace-nowrap">{{ t(link.label) }}</span>
          </NuxtLink>
        </template>
      </nav>

      <!-- Bottom Area (圣经金句) (加入 relative z-10) -->
      <div v-if="navStore.isExpanded" class="relative z-10 p-6 mt-auto border-t border-white/5 text-center bg-[#0a0a0d]/50 backdrop-blur-md">
        <p class="text-[12px] text-yellow-500/80 font-serif italic whitespace-nowrap">{{ t('navbar.bible_quote') }}</p>
      </div>
    </aside>

   <!-- ==================== 3. MOBILE SIDEBAR DRAWER ==================== -->
   <Transition name="fade">
      <div v-if="mobileOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" @click="mobileOpen = false"></div>
    </Transition>

    <Transition name="slide-left">
      <!-- 增加了 relative 和 overflow-hidden 以容纳背景图 -->
      <aside v-if="mobileOpen" class="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0f1015] border-r border-white/10 z-[70] lg:hidden flex flex-col overflow-hidden">
        
        <!-- 背景图层 (与桌面端侧边栏保持一致) -->
        <div class="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none" 
             :style="{ backgroundImage: `url(${firecamp})` }"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/90 to-transparent pointer-events-none"></div>

        <!-- Header: Close button + Logo -->
        <div class="relative z-10 h-20 flex items-center justify-between px-6 border-b border-white/5">
          <NuxtLink to="/" @click="mobileOpen = false" class="flex items-center gap-2">
            <img :src="Firelight" class="w-7 h-7" alt="Firelight"/>
            <Logo class="text-xl text-white tracking-tight" />
          </NuxtLink>
          <button @click="mobileOpen = false" class="text-white/50 hover:text-white transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- 导航菜单 -->
        <nav class="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <template v-for="link in sideNavLinks" :key="link.to || link.divider">
            <p v-if="link.divider" class="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/30">
              {{ t(link.label) }}
            </p>

            <NuxtLink v-else :to="link.to"
              @click="mobileOpen = false"
              class="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all backdrop-blur-sm border border-transparent"
              :class="$route.path === link.to
                ? 'bg-[#1a1b23]/80 border-yellow-500/20 text-yellow-500 shadow-lg'
                : 'text-white/60 hover:bg-white/5 hover:border-white/5'">

              <component :is="link.icon" class="w-5 h-5" :class="$route.path === link.to ? 'text-yellow-500' : 'text-white/40'"/>
              <span class="font-bold text-sm">{{ t(link.label) }}</span>
            </NuxtLink>
          </template>
        </nav>

        <!-- 底部功能区 (EN/中文 + 登出) -->
        <div class="relative z-10 p-6 border-t border-white/5 bg-[#0f1015]/50 backdrop-blur-md flex gap-3">
          <button @click="toggleLang" class="flex-1 py-3 rounded-xl border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/5 transition-colors">
            {{ locale === 'en' ? '中文' : 'EN' }}
          </button>
          <button v-if="auth.isLoggedIn" @click="handleLogout" class="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors">
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
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'
import Logo from '../Logo.vue'
import Firelight from '../../assets/firelight.svg'
import firecamp from '~/assets/background/campFire.jpg'

import {
  ChevronDown, Menu, X, LogOut, LayoutDashboard, User, Users, Gamepad2,
  Search, Bell, Megaphone, Heart, Image, BookOpen, Settings,
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
const db = useDb()
const notifications = ref([]) // 存储实时通知
const isNotificationModalOpen = ref(false) // 控制弹窗开关
const showNotifDropdown = ref(false)
const notifDropdownRef = ref(null)


onMounted(() => {
  hydrated.value = true
  document.addEventListener('click', onClickOutside)

  // 监听 Firebase 的 notifications 集合 (假设你有这个集合)
  if (db) {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(10))
    onSnapshot(q, (snapshot) => {
      notifications.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
  }
})


const isAdmin = computed(() => hydrated.value && auth.isLoggedIn && auth.user?.is_admin === true)

// Guests get a top nav instead of the sidebar (no persistent app-shell before login).
const showSidebar = computed(() => hydrated.value && auth.isLoggedIn)

// 会员（登入用户）能看到的页面
const memberNavLinks = [
  { to: '/dashboard', label: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/schedule', label: 'nav.schedule', icon: Calendar },
  { to: '/games', label: 'nav.games', icon: Gamepad2 },
  // { to: '/devotion', label: 'activities.devotion', icon: BookOpen },
  { to: '/profile', label: 'nav.profile', icon: User },
]

// 管理后台页面
const adminNavLinks = [
  { to: '/admin/dashboard', label: 'nav.adminDashboard', icon: ShieldAlert },
  { to: '/admin/registrations', label: 'nav.registrations', icon: Users },
  { to: '/admin/games', label: 'nav.manageGames', icon: Gamepad2 },
  { to: '/admin/settings', label: 'nav.settings', icon: Settings },
]

const sideNavLinks = computed(() => {
  // Admins keep their admin tools and also get every member page.
  if (isAdmin.value) {
    return [
      ...adminNavLinks,
      { divider: 'member', label: 'nav.memberView' },
      ...memberNavLinks,
    ]
  }

  if (hydrated.value && auth.isLoggedIn) {
    return memberNavLinks
  }

  // 游客只看得到首页 + 顶部的登入按钮，没有侧边栏/汉堡菜单可用
  return []
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
  if (notifDropdownRef.value && !notifDropdownRef.value.contains(e.target)) showNotifDropdown.value = false
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