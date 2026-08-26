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
    // Auditors are scoped to the AI City game's admin pages only (dashboard,
    // Phase 1 audit, Phase 2 scoring — all under this one path prefix).
    // Everything else under /admin still requires full is_admin.
    const isAiCityAdminPath = to.path.startsWith('/admin/games/ai-city')
    const isAuditorAllowed = (auth.user as any)?.is_auditor === true && isAiCityAdminPath
    if (!auth.user?.is_admin && !isAuditorAllowed) {
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
