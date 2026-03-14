import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCampersStore } from './campers'
import { useFirebase } from '~/composable/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isLoggedIn = computed(() => !!user.value);
    const campers = useCampersStore();
    campers.initCampers();
    if (import.meta.client) {
        user.value = JSON.parse(localStorage.getItem('sonship-user') || 'null')
    }

    const init = () => {
        const firebase = useFirebase()
        if (!firebase) return  // ← guard here

        onAuthStateChanged(firebase.auth, (firebaseUser) => {
            user.value = campers.campers.find((camper) => camper.email === firebaseUser.email)
        })
    }

    async function login(email, password) {
        const firebase = useFirebase()
        if (!firebase) return { success: false, error: 'Firebase not initialized.' }
        try{
            const result = await signInWithEmailAndPassword(firebase.auth, email, password)
            user.value = campers.campers.find((camper) => camper.email === result.user.email)

            if (import.meta.client) {
                localStorage.setItem('sonship-user', JSON.stringify(user.value))
            }
            return { success: true, user: user.value }
        } catch (error) {
            console.error(error)
            return { success: false, error: error.message }
        }
        return { success: false, error: 'Invalid email or password.' }
    }

    async function logout() {
        user.value = null
        const firebase = useFirebase()
        if (!firebase) return  // ← guard here
        
        firebase.auth.signOut()
        if (import.meta.client) {
            localStorage.removeItem('sonship-user')
        }
    }

    return { user, isLoggedIn, login, logout, init }
})
