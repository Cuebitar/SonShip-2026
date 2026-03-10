import { getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export function getFirebaseApp() {
  if (!getApps().length) {
    throw new Error('Firebase app is not initialized yet.')
  }
  return getApp()
}

export function getDb() {
  return getFirestore(getFirebaseApp())
}
