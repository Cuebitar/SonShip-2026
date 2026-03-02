import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCampersStore } from './campers'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('sonship-user') || 'null'))
    const isLoggedIn = computed(() => !!user.value)

    function login(email, password) {
        const campersStore = useCampersStore()
        const camper = campersStore.campers.find(c => c.email.toLowerCase() === email.toLowerCase())
        if (camper && password === 'sonship123') {
            user.value = camper
            localStorage.setItem('sonship-user', JSON.stringify(camper))
            return { success: true, user: camper }
        }
        return { success: false, error: 'Invalid email or password.' }
    }

    function logout() {
        user.value = null
        localStorage.removeItem('sonship-user')
    }

    return { user, isLoggedIn, login, logout }
})
