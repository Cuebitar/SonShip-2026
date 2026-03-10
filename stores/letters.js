import { defineStore } from 'pinia'
import { ref } from 'vue'

let letterId = 10

const SEED_LETTERS = [
    { id: 1, fromId: 3, toId: 1, anonymous: false, body: 'Hey Liam! I just wanted to say you have such an encouraging spirit. Keep shining! 🌟', timestamp: '2026-03-01T10:00:00', edited: false },
    { id: 2, fromId: null, toId: 2, anonymous: true, body: 'Aria, your smile lights up every room. You are more loved than you know. 💛', timestamp: '2026-03-01T11:00:00', edited: false },
    { id: 3, fromId: 1, toId: 4, anonymous: false, body: 'Mei! Your quiet strength is so inspiring. Thank you for always listening.', timestamp: '2026-03-01T12:00:00', edited: false },
]

export const useLettersStore = defineStore('letters', () => {
    const letters = ref(SEED_LETTERS)

    function getReceived(userId) {
        return letters.value.filter(l => l.toId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    function getSent(userId) {
        return letters.value.filter(l => l.fromId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    function send({ fromId, toId, body, anonymous }) {
        const letter = {
            id: ++letterId,
            fromId: anonymous ? null : fromId,
            toId,
            anonymous,
            body,
            timestamp: new Date().toISOString(),
            edited: false,
        }
        letters.value.push(letter)
        return letter
    }

    function edit(id, newBody) {
        const l = letters.value.find(l => l.id === id)
        if (l) { l.body = newBody; l.edited = true }
    }

    return { letters, getReceived, getSent, send, edit }
})
