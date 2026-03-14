import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCampersStore } from './campers'
import { useFirebase } from '~/composable/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isLoggedIn = computed(() => !!user.value)

    if (import.meta.client) {
        user.value = JSON.parse(localStorage.getItem('sonship-user') || 'null')
    }

    const init = () => {
        const firebase = useFirebase()
        if (!firebase) return  // ← guard here

        onAuthStateChanged(firebase.auth, (firebaseUser) => {
            user.value = firebaseUser;
        })
    }

    async function login(email, password) {
        const firebase = useFirebase()
        if (!firebase) return { success: false, error: 'Firebase not initialized.' }
        try{
            const result = await signInWithEmailAndPassword(firebase.auth, email, password)
            user.value = result.user

            if (import.meta.client) {
                localStorage.setItem('sonship-user', JSON.stringify(result.user))
            }
            return { success: true, user: result.user }
        } catch (error) {
            console.error(error)
            return { success: false, error: error.message }
        }
        return { success: false, error: 'Invalid email or password.' }
    }

    function logout() {
        user.value = null
        if (import.meta.client) {
            localStorage.removeItem('sonship-user')
        }
    }

    return { user, isLoggedIn, login, logout, init }
})
