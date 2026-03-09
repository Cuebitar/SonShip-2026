import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import keys from "../firebase_admin_sdk.json";
// Your Firebase configuration
var firebaseConfig = keys;
// console.log(keys);
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

// Initialize Firebase