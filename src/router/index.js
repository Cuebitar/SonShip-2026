import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    // Public
    { path: '/', name: 'Home', component: () => import('../pages/HomePage.vue') },
    { path: '/about', name: 'About', component: () => import('../pages/AboutPage.vue') },
    { path: '/activities', name: 'Activities', component: () => import('../pages/ActivitiesPage.vue') },
    { path: '/activities/:id', name: 'ActivityDetail', component: () => import('../pages/ActivityDetailPage.vue') },
    { path: '/register', name: 'Register', component: () => import('../pages/RegistrationPage.vue') },
    // Auth
    { path: '/login', name: 'Login', component: () => import('../pages/LoginPage.vue'), meta: { guestOnly: true } },
    // Protected
    { path: '/dashboard', name: 'Dashboard', component: () => import('../pages/DashboardPage.vue'), meta: { requiresAuth: true } },
    { path: '/profile', name: 'Profile', component: () => import('../pages/CamperInfoPage.vue'), meta: { requiresAuth: true } },
    { path: '/friends', name: 'Friends', component: () => import('../pages/FriendsListPage.vue'), meta: { requiresAuth: true } },
    { path: '/games', name: 'Games', component: () => import('../pages/GamesPage.vue'), meta: { requiresAuth: true } },
    { path: '/messages', name: 'Messages', component: () => import('../pages/MessageBoardPage.vue'), meta: { requiresAuth: true } },
    { path: '/letters/write', name: 'WriteLetter', component: () => import('../pages/WritingLetterPage.vue'), meta: { requiresAuth: true } },
    { path: '/letters', name: 'Letters', component: () => import('../pages/LetterDashboardPage.vue'), meta: { requiresAuth: true } },
    { path: '/schedule', name: 'Schedule', component: () => import('../pages/SchedulePage.vue'), meta: { requiresAuth: true } },
    { path: '/gallery', name: 'Gallery', component: () => import('../pages/GalleryPage.vue'), meta: { requiresAuth: true } },
    { path: '/admin/registrations', name: 'AdminRegistrations', component: () => import('../pages/AdminRegistrationPage.vue'), meta: { requiresAuth: true } },
    // Catch-all
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        return { top: 0, behavior: 'smooth' }
    },
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (to.meta.guestOnly && auth.isLoggedIn) {
        next({ name: 'Dashboard' })
    } else {
        next()
    }
})

export default router
