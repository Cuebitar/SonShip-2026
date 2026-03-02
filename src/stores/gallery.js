import { defineStore } from 'pinia'
import { ref } from 'vue'

// Using emoji as placeholder for camp photos since no real photos exist
const GALLERY_ITEMS = [
    { id: 1, session: 'Day 1', activity: 'worship', title: 'Opening Worship', emoji: '🙌', color: '#E6B153', description: 'The Spirit moved as we opened camp together' },
    { id: 2, session: 'Day 1', activity: 'sports', title: 'Sports Field Fun', emoji: '⚽', color: '#FF6F1E', description: 'Eagles vs Lions – the epic match begins!' },
    { id: 3, session: 'Day 1', activity: 'devotion', title: 'Morning Quiet Time', emoji: '🌄', color: '#3A2620', description: 'Starting the day in God\'s presence' },
    { id: 4, session: 'Day 2', activity: 'nature', title: 'Jungle Trek', emoji: '🌿', color: '#2D6A4F', description: 'Discovering God\'s creation on the trail' },
    { id: 5, session: 'Day 2', activity: 'arts', title: 'Creative Arts', emoji: '🎨', color: '#941708', description: 'Expressing faith through art' },
    { id: 6, session: 'Day 2', activity: 'night', title: 'Night Games', emoji: '🌙', color: '#1B1040', description: 'Torches, clues, and team cheers' },
    { id: 7, session: 'Day 3', activity: 'worship', title: 'Campfire Night', emoji: '🔥', color: '#FF6F1E', description: 'Testimonies by firelight – unforgettable' },
    { id: 8, session: 'Day 3', activity: 'sports', title: 'Pool Games', emoji: '🏊', color: '#0096C7', description: 'Splashing into community' },
    { id: 9, session: 'Day 3', activity: 'closing', title: 'Closing Ceremony', emoji: '✨', color: '#E6B153', description: 'Goodbye hugs and hearts full' },
    { id: 10, session: 'Group Photos', activity: 'group', title: 'Eagles Group Shot', emoji: '🦅', color: '#3A2620', description: 'The Eagles fam!' },
    { id: 11, session: 'Group Photos', activity: 'group', title: 'Lions Group Shot', emoji: '🦁', color: '#941708', description: 'Hear us ROAR!' },
    { id: 12, session: 'Group Photos', activity: 'group', title: 'Doves Group Shot', emoji: '🕊️', color: '#3E7C17', description: 'Doves spreading peace' },
]

export const useGalleryStore = defineStore('gallery', () => {
    const photos = ref(GALLERY_ITEMS)

    function getSessions() {
        return ['All', ...new Set(photos.value.map(p => p.session))]
    }

    function getBySession(session) {
        if (session === 'All') return photos.value
        return photos.value.filter(p => p.session === session)
    }

    return { photos, getSessions, getBySession }
})
