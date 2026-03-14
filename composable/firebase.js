// composables/firebase.js
import { getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export const useFirebase = () => {
  // Return null-safe if Firebase hasn't initialized yet
  if (getApps().length === 0) return null

  const app = getApp()
  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  }
}


export const useDb = () => {
  return getFirestore(getApp())
}