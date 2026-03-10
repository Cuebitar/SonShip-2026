import { defineStore } from 'pinia'
import { ref } from 'vue'

let msgId = 100

const SEED_MESSAGES = [
    { id: 1, fromId: 2, toId: 1, subject: 'Hey!', body: 'Looking forward to camp! Are you excited?', timestamp: '2026-03-01T08:00:00', read: false },
    { id: 2, fromId: 1, toId: 3, subject: 'Group activities', body: "Can't wait for the night games! See you there.", timestamp: '2026-03-01T09:30:00', read: true },
    { id: 3, fromId: 4, toId: 1, subject: 'Devotion notes', body: 'I found today\'s devotion really meaningful. Here\'s a verse that spoke to me: Psalm 23:1', timestamp: '2026-03-01T10:00:00', read: false },
]

export const useMessagesStore = defineStore('messages', () => {
    const messages = ref(SEED_MESSAGES)

    function getInbox(userId) {
        return messages.value.filter(m => m.toId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    function getSent(userId) {
        return messages.value.filter(m => m.fromId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    function send({ fromId, toId, subject, body }) {
        const msg = { id: ++msgId, fromId, toId, subject, body, timestamp: new Date().toISOString(), read: false }
        messages.value.push(msg)
        return msg
    }

    function markRead(id) {
        const m = messages.value.find(m => m.id === id)
        if (m) m.read = true
    }

    function unreadCount(userId) {
        return messages.value.filter(m => m.toId === userId && !m.read).length
    }

    return { messages, getInbox, getSent, send, markRead, unreadCount }
})
