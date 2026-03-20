import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCampersStore } from './campers'
import { useFirebase } from '~/composable/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const ready = ref(false);
    const isLoggedIn = computed(() => !!user.value);
    const campers = useCampersStore();
    if (import.meta.client) {
        user.value = JSON.parse(localStorage.getItem('sonship-user') || 'null')
    }

    let initPromise = null

    const init = () => {
        if (import.meta.server) return Promise.resolve()
        if (initPromise) return initPromise

        initPromise = new Promise((resolve) => {
            const firebase = useFirebase()
            if (!firebase) {
                ready.value = true
                resolve()
                return
            }

            let resolved = false
            onAuthStateChanged(firebase.auth, (firebaseUser) => {
                ;(async () => {
                    if (!firebaseUser) {
                        user.value = null
                        ready.value = true
                        if (import.meta.client) {
                            localStorage.removeItem('sonship-user')
                        }
                    } else {
                        // Ensure campers are loaded before mapping firebase user -> camper profile.
                        await campers.initCampers()
                        const camperProfile = campers.campers.find((camper) => camper.email === firebaseUser.email)
                        user.value = camperProfile
                        ready.value = true
                        if (import.meta.client) {
                            localStorage.setItem('sonship-user', JSON.stringify(user.value))
                        }
                    }

                    if (!resolved) {
                        resolved = true
                        resolve(firebaseUser)
                    }
                })().catch((err) => {
                    console.error(err)
                    ready.value = true
                    if (!resolved) {
                        resolved = true
                        resolve()
                    }
                })
            })
        })

        return initPromise
    }

    async function login(email, password) {
        const firebase = useFirebase()
        if (!firebase) return { success: false, error: 'Firebase not initialized.' }
        try{
            const result = await signInWithEmailAndPassword(firebase.auth, email, password)
            await campers.initCampers()
            const camperProfile = campers.campers.find((camper) => camper.email === result.user.email)
            user.value = camperProfile || { uid: result.user.uid, email: result.user.email }
            ready.value = true

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
        ready.value = true
        const firebase = useFirebase()
        if (!firebase) return  // ← guard here
        
        await firebase.auth.signOut()
        if (import.meta.client) {
            localStorage.removeItem('sonship-user')
        }
    }

    async function changePassword(newPassword) {
        const firebase = useFirebase()
        if (!firebase) return { success: false, error: 'Firebase not initialized.' }
        try {
            await firebase.auth.currentUser.updatePassword(newPassword)
            user.value.changed_password = true;
            if (import.meta.client) {
                localStorage.setItem('sonship-user', JSON.stringify(user.value))
            }
            return { success: true }
        } catch (error) {
            console.error(error)
            return { success: false, error: error.message }
        }
    }

    return { user, ready, isLoggedIn, login, logout, init, changePassword }
})
