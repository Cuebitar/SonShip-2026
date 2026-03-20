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

    function readStoredUser() {
        if (!import.meta.client) return null

        const raw = localStorage.getItem('sonship-user')
        if (!raw || raw === 'undefined' || raw === 'null') return null

        try {
            return JSON.parse(raw)
        } catch (error) {
            console.error('Failed to parse stored sonship-user:', error)
            localStorage.removeItem('sonship-user')
            return null
        }
    }

    function persistUser(nextUser) {
        if (!import.meta.client) return

        if (!nextUser) {
            localStorage.removeItem('sonship-user')
            return
        }

        localStorage.setItem('sonship-user', JSON.stringify(nextUser))
    }

    async function waitForFirebase(maxAttempts = 50, delayMs = 50) {
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            const firebase = useFirebase()
            if (firebase) return firebase

            await new Promise((resolve) => window.setTimeout(resolve, delayMs))
        }

        return null
    }

    if (import.meta.client) {
        user.value = readStoredUser()
    }

    let initPromise = null

    const init = () => {
        if (import.meta.server) return Promise.resolve()
        if (initPromise) return initPromise

        initPromise = new Promise((resolve) => {
            ;(async () => {
                const firebase = await waitForFirebase()
                if (!firebase) {
                    ready.value = true
                    initPromise = null
                    resolve()
                    return
                }

                let resolved = false
                onAuthStateChanged(firebase.auth, (firebaseUser) => {
                    ;(async () => {
                        if (!firebaseUser) {
                            user.value = null
                            ready.value = true
                            persistUser(null)
                        } else {
                            await campers.initCampers()
                            const camperProfile = campers.campers.find((camper) => camper.email === firebaseUser.email)
                            user.value = camperProfile || { uid: firebaseUser.uid, email: firebaseUser.email }
                            ready.value = true
                            persistUser(user.value)
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
            })().catch((err) => {
                console.error(err)
                ready.value = true
                initPromise = null
                resolve()
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

            persistUser(user.value)
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
        persistUser(null)
    }

    async function changePassword(newPassword) {
        const firebase = useFirebase()
        if (!firebase) return { success: false, error: 'Firebase not initialized.' }
        try {
            await firebase.auth.currentUser.updatePassword(newPassword)
            user.value.changed_password = true;
            persistUser(user.value)
            return { success: true }
        } catch (error) {
            console.error(error)
            return { success: false, error: error.message }
        }
    }

    return { user, ready, isLoggedIn, login, logout, init, changePassword }
})
