import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { useDb, useFirebase } from '~/composable/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const useCampersStore = defineStore('campers', () => {
  const campers = ref([])
  const loaded = ref(false)

  function normalizeIc(value) {
    return (value || '').replace(/\D/g, '')
  }

  function normalizeEmail(value) {
    return (value || '').trim().toLowerCase()
  }

  function getReferenceId(reference) {
    return reference?.id || reference?.path?.split('/').pop() || ''
  }


  async function initCampers() {
    // Firebase client SDK is only initialized on the client (plugins/firebase.client.ts).
    if (import.meta.server) return false
    if (loaded.value) return true

    const db = useDb()
    // Can happen during very early navigation; callers can retry after Firebase plugin runs.
    if (!db) return false

    const rawCampers = await getDocs(collection(db, 'campers'))
    campers.value = rawCampers.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    const firebase = useFirebase()

    if (!db) throw new Error('Firebase is not initialized yet (campers store).')
    if (!firebase) throw new Error('Firebase auth is not initialized yet (campers store).')

    if (!loaded.value) {
      await initCampers()
    }

    const normalizedIc = normalizeIc(camper.ic)
    const normalizedEmail = normalizeEmail(camper.email)

    if (campers.value.some((existingCamper) => normalizeIc(existingCamper.ic) === normalizedIc)) {
      const error = new Error('IC already exists.')
      error.code = 'campers/ic-already-exists'
      throw error
    }

    if (campers.value.some((existingCamper) => normalizeEmail(existingCamper.email) === normalizedEmail)) {
      const error = new Error('Email already exists.')
      error.code = 'campers/email-already-exists'
      throw error
    }

    const camperRef = doc(collection(db, 'campers'))
    const camperPayload = {
      avatar: camper.avatar || '',
      changed_password: Boolean(camper.changed_password),
      email: normalizedEmail,
      emergency: {
        name: camper.emergency?.name || '',
        phone: camper.emergency?.phone || '',
        relationship: camper.emergency?.relationship || '',
      },
      gender: camper.gender || '',
      group: '',
      ic: normalizedIc,
      ice_breaking: {
        riddle: '',
        target: camperRef,
      },
      important_info: camper.important_info || '',
      is_admin: Boolean(camper.is_admin),
      name: camper.name || '',
      password: camper.password || '',
      phone: camper.phone || '',
      questions: {
        pain: camper.questions?.pain || '',
        place: camper.questions?.place || '',
        verse: camper.questions?.verse || '',
      },
      room_name: '',
      secret_angel: camperRef,
      secret_identity: '',
      status: camper.status || 'Pending',
      transport: camper.transport || '',
      registrationTime: camper.registrationTime || new Date().toISOString(),
    }

    await createUserWithEmailAndPassword(firebase.auth, camper.email, camper.password)
    await setDoc(camperRef, camperPayload)
    campers.value.push(camperPayload);
  }

  async function updateCamper(camper) {
    const db = useDb()
    if (!db) throw new Error('Firebase is not initialized yet (campers store).')

    const camperId = camper.id
    const camperRef = doc(collection(db, 'campers'), camperId)
    const payload = { ...camper }

    if (typeof payload.secret_angel === 'string' && payload.secret_angel) {
      payload.secret_angel = doc(collection(db, 'campers'), payload.secret_angel)
    }

    delete payload.id
    await updateDoc(camperRef, payload)
    campers.value = campers.value.map((c) => c.id === camperId ? { ...c, ...payload } : c)
  }

  return { campers, loaded, initCampers, getCamperById, getCampersByGroup, addFriend, getFriends, registerCamper, updateCamper }
})
