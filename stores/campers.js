import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { useDb } from '~/composable/firebase'

export const useCampersStore = defineStore('campers', () => {
  const campers = ref([])
  const loaded = ref(false)

  async function initCampers() {
    // Firebase client SDK is only initialized on the client (plugins/firebase.client.ts).
    if (import.meta.server) return false
    if (loaded.value) return true

    const db = useDb()
    // Can happen during very early navigation; callers can retry after Firebase plugin runs.
    if (!db) return false

    const rawCampers = await getDocs(collection(db, 'campers'));
    console.log(rawCampers);
    const mapped = await Promise.all(
      rawCampers.docs.map(async (c) => {
        const docRef = doc(db, 'campers', c.id)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return null

        const data = docSnap.data()
        const emergency = data.emergency || {}
        return {
          id: docSnap.id,
          ...data,
          emergencyContact: {
            name: emergency.name,
            phone: emergency.phone,
            relation: emergency.relation,
          },
        }
      }),
    )
    console.log(mapped);
    campers.value = mapped.filter(Boolean)
    loaded.value = true
    return true
  }

  function getCamperById(id) {
    return campers.value.find((c) => c.id === id)
  }

  function getCampersByGroup(group) {
    return campers.value.filter((c) => c.group === group)
  }

  function addFriend(userId, friendCode) {
    const me = campers.value.find((c) => c.id === userId)
    const friend = campers.value.find((c) => c.campCode === friendCode)
    if (!me || !friend || friend.id === userId) return { success: false, error: 'Invalid code.' }
    if (me.friends?.includes(friend.id)) return { success: false, error: 'Already friends!' }
    me.friends = me.friends || []
    me.friends.push(friend.id)
    return { success: true, friend }
  }

  function getFriends(userId) {
    const me = campers.value.find((c) => c.id === userId)
    if (!me) return []
    return (me.friends || []).map((id) => campers.value.find((c) => c.id === id)).filter(Boolean)
  }

  async function registerCamper(camper) {
    if (import.meta.server) {
      throw new Error('registerCamper() must run on the client.')
    }

    const db = useDb()
    if (!db) throw new Error('Firebase is not initialized yet (campers store).')

    const { name, email, phone, ic, group, roomNumber, status } = camper
    await addDoc(collection(db, 'campers'), { name, email, phone, ic, group, roomNumber, status })
  }

  return { campers, loaded, initCampers, getCamperById, getCampersByGroup, addFriend, getFriends, registerCamper }
})
