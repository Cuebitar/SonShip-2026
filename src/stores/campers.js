import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebaseInit';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
// Derangement helpers — ensures no one is their own secret angel
function createDerangement(arr) {
    const n = arr.length
    const result = [...arr]
    for (let i = n - 1; i > 0; i--) {
        let j
        do { j = Math.floor(Math.random() * i) } while (j === i || result[j] === arr[i])
            ;[result[i], result[j]] = [result[j], result[i]]
    }
    // Fix any remaining self-assignments
    for (let i = 0; i < n; i++) {
        if (result[i] === arr[i]) {
            const swap = (i + 1) % n
                ;[result[i], result[swap]] = [result[swap], result[i]]
        }
    }
    return result
}

async function initCampers(){
    let RAW_CAMPERS = [];
    try{
        RAW_CAMPERS = await getDocs(collection(db, 'campers'));
        
    }
    catch(e){
        console.log(e);
    }
    const ids = RAW_CAMPERS.docs.map(c => c.id)
    const shuffled = createDerangement(ids)
    async function getDocumentData(collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const {emergency} = docSnap.data();
            return { 
                id: docSnap.id, 
                ...docSnap.data(),  
                emergencyContact: { name: emergency.name, phone: emergency.phone, relation: emergency.relation },
            };
        } else {
            console.log("No such document!");
            return null;
        }
    }

    return await Promise.all(RAW_CAMPERS.docs.map(async (c, i) => ({
        ...c,
        ...await getDocumentData('campers', c.id),
    })))
}

const CAMPERS = await initCampers();
console.log(CAMPERS);
// [
//     { id: 1, name: 'Liam Chen', email: 'liam@sonship.com', phone: '012-3456789', ic: '980101-14-5678', group: 'Eagles', avatar: '🦁', secretIdentity: 'The Flame Keeper', revealCode: 'FLAME01', campCode: 'SC001' },
//     { id: 2, name: 'Aria Wong', email: 'aria@sonship.com', phone: '012-2345678', ic: '991205-10-4321', group: 'Eagles', avatar: '🌸', secretIdentity: 'The Bridge Builder', revealCode: 'BRIDGE02', campCode: 'SC002' },
//     { id: 3, name: 'Ethan Tan', email: 'ethan@sonship.com', phone: '011-3456789', ic: '000312-01-2345', group: 'Lions', avatar: '⚡', secretIdentity: 'The Storm Chaser', revealCode: 'STORM03', campCode: 'SC003' },
//     { id: 4, name: 'Mei Lin', email: 'mei@sonship.com', phone: '016-4567890', ic: '020715-05-6789', group: 'Lions', avatar: '🌙', secretIdentity: 'The Moon Walker', revealCode: 'MOON04', campCode: 'SC004' },
//     { id: 5, name: 'Noah Lim', email: 'noah@sonship.com', phone: '017-5678901', ic: '010523-08-9012', group: 'Doves', avatar: '🌊', secretIdentity: 'The Tide Turner', revealCode: 'TIDE05', campCode: 'SC005' },
//     { id: 6, name: 'Zara Ng', email: 'zara@sonship.com', phone: '018-6789012', ic: '031108-12-3456', group: 'Doves', avatar: '✨', secretIdentity: 'The Light Bringer', revealCode: 'LIGHT06', campCode: 'SC006' },
//     { id: 7, name: 'Caleb Yap', email: 'caleb@sonship.com', phone: '019-7890123', ic: '980709-07-7890', group: 'Eagles', avatar: '🔥', secretIdentity: 'The Fire Starter', revealCode: 'FIRE07', campCode: 'SC007' },
//     { id: 8, name: 'Sophie Koh', email: 'sophie@sonship.com', phone: '013-8901234', ic: '010304-11-2345', group: 'Lions', avatar: '🌺', secretIdentity: 'The Healer', revealCode: 'HEAL08', campCode: 'SC008' },
//     { id: 9, name: 'Jayden Oh', email: 'jayden@sonship.com', phone: '014-9012345', ic: '020917-09-5678', group: 'Doves', avatar: '🕊️', secretIdentity: 'The Peacemaker', revealCode: 'PEACE09', campCode: 'SC009' },
//     { id: 10, name: 'Lydia Teo', email: 'lydia@sonship.com', phone: '015-0123456', ic: '991130-06-8901', group: 'Eagles', avatar: '🌟', secretIdentity: 'The Star Gazer', revealCode: 'STAR10', campCode: 'SC010' },
//     { id: 11, name: 'Marcus Lee', email: 'marcus@sonship.com', phone: '012-1234567', ic: '030628-14-1234', group: 'Lions', avatar: '🦅', secretIdentity: 'The Eagle Eye', revealCode: 'EAGLE11', campCode: 'SC011' },
//     { id: 12, name: 'Priya Raj', email: 'priya@sonship.com', phone: '011-2345670', ic: '020214-16-4567', group: 'Doves', avatar: '🌈', secretIdentity: 'The Rainbow Keeper', revealCode: 'RAINBOW12', campCode: 'SC012' },
// ]

export const useCampersStore = defineStore('campers', () => {
    const campers = ref(CAMPERS)
    console.log(campers.value, 12333);

    function getCamperById(id) {
        return campers.value.find(c => c.id === id)
    }

    function getCampersByGroup(group) {
        return campers.value.filter(c => c.group === group)
    }

    function addFriend(userId, friendCode) {
        const me = campers.value.find(c => c.id === userId)
        const friend = campers.value.find(c => c.campCode === friendCode)
        if (!friend || friend.id === userId) return { success: false, error: 'Invalid code.' }
        if (me.friends.includes(friend.id)) return { success: false, error: 'Already friends!' }
        me.friends.push(friend.id)
        return { success: true, friend }
    }

    function getFriends(userId) {
        const me = campers.value.find(c => c.id === userId)
        if (!me) return []
        return me.friends.map(id => campers.value.find(c => c.id === id)).filter(Boolean)
    }

    async function registerCamper(camper){
        const {name, email, phone, ic, group, roomNumber, status} = camper;
        const camperRef = collection(db, 'campers');
        await addDoc(camperRef, {name, email, phone, ic, group, roomNumber, status});
    }

    return { campers, getCamperById, getCampersByGroup, addFriend, getFriends }
})
