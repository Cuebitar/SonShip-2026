import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  const auth = useAuthStore()
  await auth.init()

  // First login uses the temp password an admin issued at registration —
  // block everything else until they set their own. `!== true` (rather than
  // `=== false`) also catches older docs where the field is just missing.
  if (auth.isLoggedIn && (auth.user as any)?.changed_password !== true && to.path !== '/change-password') {
    return navigateTo({ path: '/change-password', query: { redirect: to.fullPath } })
  }

  if (to.path.startsWith('/admin')) {
    if (!auth.isLoggedIn) {
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
    if (!auth.user?.is_admin) {
      return navigateTo('/dashboard')
    }
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return navigateTo('/dashboard')
  }
})
