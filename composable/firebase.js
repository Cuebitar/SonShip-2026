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
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    // 连接到 Auth 模拟器，默认端口是 9099
    // disableWarnings: true 可以关闭控制台里烦人的模拟器警告提示（可选）
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    console.log("Firebase Auth 正在使用本地模拟器");
  }
}


export const useDb = () => {
  if (getApps().length === 0) return null
  return getFirestore(getApp())
}
