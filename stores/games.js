import { defineStore } from 'pinia'
import { ref } from 'vue'

const GAMES_LIST = [
    { id: 1, name: 'Reflex Rush', emoji: '⚡', description: 'Tap the glowing button as fast as you can before time runs out!', rules: ['Tap the golden circle when it appears', 'Each correct tap = +10 points', 'Miss = -5 points', '30 seconds per round', 'Fastest fingers win!'], type: 'interactive' },
    { id: 2, name: 'Bible Trivia', emoji: '📖', description: 'Test your knowledge of scripture with rapid-fire trivia questions.', rules: ['10 questions per round', 'Correct = +20 points', 'Wrong = 0 points', 'Fastest correct answer gets bonus +10'], type: 'quiz' },
    { id: 3, name: 'Camp Scavenger Hunt', emoji: '🗺️', description: 'Find hidden items around camp with cryptic clues!', rules: ['Teams of 3', 'Find all 10 items', 'First team to return wins', 'Bonus points for photos'], type: 'physical' },
    { id: 4, name: 'Worship Leader', emoji: '🎤', description: 'Lead worship for 30 seconds, earn points from your team!', rules: ['1 minute timer', 'Team rates your performance', 'Extra points for creativity'], type: 'performance' },
]

const INITIAL_SCORES = [
    { camperId: 1, score: 840, achievements: ['First Login', 'Social Butterfly', 'Early Bird'] },
    { camperId: 2, score: 720, achievements: ['First Login', 'Letter Writer'] },
    { camperId: 3, score: 1100, achievements: ['First Login', 'Game Master', 'Speed Demon', 'Top Scorer'] },
    { camperId: 4, score: 650, achievements: ['First Login', 'Peacemaker'] },
    { camperId: 5, score: 890, achievements: ['First Login', 'Team Player', 'Social Butterfly'] },
    { camperId: 6, score: 760, achievements: ['First Login', 'Creative Soul', 'Letter Writer'] },
    { camperId: 7, score: 930, achievements: ['First Login', 'Game Master', 'Team Player'] },
    { camperId: 8, score: 580, achievements: ['First Login'] },
    { camperId: 9, score: 700, achievements: ['First Login', 'Peacemaker', 'Social Butterfly'] },
    { camperId: 10, score: 1050, achievements: ['First Login', 'Top Scorer', 'Early Bird'] },
    { camperId: 11, score: 810, achievements: ['First Login', 'Team Player'] },
    { camperId: 12, score: 670, achievements: ['First Login', 'Creative Soul'] },
]

const ALL_ACHIEVEMENTS = [
    { id: 'first_login', name: 'First Login', emoji: '🔑', desc: 'Welcome to the portal!' },
    { id: 'social_butterfly', name: 'Social Butterfly', emoji: '🦋', desc: 'Made 3+ friends' },
    { id: 'early_bird', name: 'Early Bird', emoji: '🐦', desc: 'Attended morning devotion' },
    { id: 'game_master', name: 'Game Master', emoji: '🎮', desc: 'Played all camp games' },
    { id: 'speed_demon', name: 'Speed Demon', emoji: '⚡', desc: 'Top score in Reflex Rush' },
    { id: 'top_scorer', name: 'Top Scorer', emoji: '🏆', desc: 'Reached 1000 points' },
    { id: 'letter_writer', name: 'Letter Writer', emoji: '✉️', desc: 'Wrote 2+ letters' },
    { id: 'team_player', name: 'Team Player', emoji: '🤝', desc: 'Participated in team activities' },
    { id: 'peacemaker', name: 'Peacemaker', emoji: '🕊️', desc: 'Resolved a conflict gracefully' },
    { id: 'creative_soul', name: 'Creative Soul', emoji: '🎨', desc: 'Joined the arts workshop' },
]

export const useGamesStore = defineStore('games', () => {
    const scores = ref(INITIAL_SCORES)
    const games = ref(GAMES_LIST)
    const achievements = ref(ALL_ACHIEVEMENTS)

    function getLeaderboard() {
        return [...scores.value].sort((a, b) => b.score - a.score)
    }

    function getCamperScore(camperId) {
        return scores.value.find(s => s.camperId === camperId) || { camperId, score: 0, achievements: [] }
    }

    function addScore(camperId, points) {
        let entry = scores.value.find(s => s.camperId === camperId)
        if (!entry) { entry = { camperId, score: 0, achievements: [] }; scores.value.push(entry) }
        entry.score += points
        if (entry.score >= 1000 && !entry.achievements.includes('Top Scorer')) {
            entry.achievements.push('Top Scorer')
        }
    }

    return { scores, games, achievements, getLeaderboard, getCamperScore, addScore }
})
