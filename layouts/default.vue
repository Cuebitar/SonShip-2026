<template>
  <div>
    <AppNavbar />
    <main>
      <slot />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<script setup>
const route = useRoute()
const showFooter = computed(() => route.path !== '/login' && route.path !== '/register')
</script>

<style>
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
