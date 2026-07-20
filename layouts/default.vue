<template>
  <div class="min-h-screen bg-[#0f1015]">
    <AppNavbar />
    <main 
      class="transition-all duration-300 ease-out min-h-screen"
      :class="navStore.isExpanded ? 'lg:pl-[260px]' : 'lg:pl-[80px]'"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useNavStore } from '~/stores/nav'
const navStore = useNavStore()
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