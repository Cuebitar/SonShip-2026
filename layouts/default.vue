<template>
  <div class="min-h-screen bg-[#0f1015]">
    <AppNavbar />
    <main
      class="transition-all duration-300 ease-out min-h-screen"
      :class="showSidebar ? (navStore.isExpanded ? 'lg:pl-[260px]' : 'lg:pl-[80px]') : ''"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNavStore } from '~/stores/nav'
import { useAuthStore } from '~/stores/auth'

const navStore = useNavStore()
const auth = useAuthStore()

// Mirrors AppNavbar's own hydrated+isLoggedIn gate: the sidebar (and this
// padding) only exists once logged in, so it must match its visibility exactly.
const hydrated = ref(false)
onMounted(() => { hydrated.value = true })
const showSidebar = computed(() => hydrated.value && auth.isLoggedIn)
</script>

<style>
/* 保持你的转场动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>