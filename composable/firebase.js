// composables/firebase.js
import { getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

let _emulatorConnected = false

export const useFirebase = () => {
  // Return null-safe if Firebase hasn't initialized yet
  if (getApps().length === 0) return null

  const app = getApp()
  const auth = getAuth(app)

  if (
    !_emulatorConnected &&
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    // Connect to the local Auth emulator (default port 9099) in dev only.
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    _emulatorConnected = true
  }

  return {
    app,
    auth,
    firestore: getFirestore(app),
  }
}


export const useDb = () => {
  if (getApps().length === 0) return null
  return getFirestore(getApp())
}
