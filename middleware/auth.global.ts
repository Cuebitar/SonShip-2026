export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }

    if (to.meta.guestOnly && auth.isLoggedIn) {
      return navigateTo('/dashboard')
    }
  }
})
