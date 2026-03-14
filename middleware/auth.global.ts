export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  const auth = useAuthStore()
  await auth.init()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return navigateTo('/dashboard')
  }
})
