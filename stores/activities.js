import { defineStore } from 'pinia'
import { ref } from 'vue'

// 每个活动的中文字段（name_zh / description_zh / difficulty_zh / requirements_zh）
// 与对应的英文字段（name / description / difficulty / requirements）配对，
// 由 utils/activity.js 里的辅助函数依照当前语言选用。
const ACTIVITIES = [
    { id: 1, name: 'Morning Devotion', name_zh: '晨更灵修', category: 'devotion', description: 'Start each day with guided quiet time, worship, and prayer in small groups.', description_zh: '每天以小组形式的静修时间、敬拜和祷告展开新的一天。', image: '🌄', capacity: 50, duration: '60 min', difficulty: 'Easy', difficulty_zh: '简单', location: 'Main Hall', requirements: ['Bible', 'Journal'], requirements_zh: ['圣经', '笔记本'], tags: ['spiritual', 'daily'] },
    { id: 2, name: 'Jungle Trek', name_zh: '丛林徒步', category: 'sports', description: 'A guided 5km hike through lush jungle trails with team challenges along the way.', description_zh: '在向导带领下穿越茂密丛林小径，全程 5 公里，途中设有团队挑战。', image: '🌿', capacity: 30, duration: '3 hrs', difficulty: 'Moderate', difficulty_zh: '中等', location: 'Forest Trail A', requirements: ['Comfortable shoes', 'Water bottle', 'Sunscreen'], requirements_zh: ['舒适的鞋子', '水壶', '防晒霜'], tags: ['outdoor', 'team'] },
    { id: 3, name: 'Worship Night', name_zh: '敬拜之夜', category: 'arts', description: 'A powerful evening of corporate worship, live music, and free response time.', description_zh: '一个充满能量的团体敬拜之夜，有现场音乐与自由回应的时间。', image: '🎵', capacity: 100, duration: '2 hrs', difficulty: 'Easy', difficulty_zh: '简单', location: 'Amphitheater', requirements: [], requirements_zh: [], tags: ['spiritual', 'music', 'evening'] },
    { id: 4, name: 'Creative Arts Workshop', name_zh: '创意艺术工作坊', category: 'arts', description: 'Express your faith through painting, sketching, and mixed media art.', description_zh: '透过绘画、素描与综合媒材艺术来表达你的信仰。', image: '🎨', capacity: 20, duration: '2 hrs', difficulty: 'Easy', difficulty_zh: '简单', location: 'Arts Studio', requirements: ['Apron (provided)'], requirements_zh: ['围裙（现场提供）'], tags: ['creative', 'arts'] },
    { id: 5, name: 'Giant Sports Games', name_zh: '大型运动游戏', category: 'sports', description: 'Team vs team in epic versions of dodgeball, capture the flag, and tug of war.', description_zh: '团队对战，体验加大版躲避球、夺旗游戏与拔河比赛。', image: '⚽', capacity: 80, duration: '2.5 hrs', difficulty: 'Moderate', difficulty_zh: '中等', location: 'Sports Field', requirements: ['Sports attire', 'Closed shoes'], requirements_zh: ['运动服装', '包鞋'], tags: ['sports', 'team', 'competition'] },
    { id: 6, name: 'Small Group Discussion', name_zh: '小组讨论', category: 'devotion', description: 'Structured small group time to unpack teachings and share life experiences.', description_zh: '有系统的小组时间，深入探讨信息内容并分享生命经历。', image: '💬', capacity: 15, duration: '1.5 hrs', difficulty: 'Easy', difficulty_zh: '简单', location: 'Various Rooms', requirements: [], requirements_zh: [], tags: ['connection', 'daily', 'spiritual'] },
    { id: 7, name: 'Night Games', name_zh: '夜间游戏', category: 'teambuilding', description: 'Thrilling night-time team challenges with flashlights and mystery clues.', description_zh: '刺激的夜间团队挑战，配合手电筒与神秘线索。', image: '🌙', capacity: 60, duration: '2 hrs', difficulty: 'Moderate', difficulty_zh: '中等', location: 'Camp Grounds', requirements: ['Torchlight', 'Comfortable shoes'], requirements_zh: ['手电筒', '舒适的鞋子'], tags: ['night', 'team', 'adventure'] },
    { id: 8, name: 'Pool & Water Games', name_zh: '泳池水上游戏', category: 'sports', description: 'Splash around with fun pool relays, water balloon battles and more.', description_zh: '尽情享受泳池接力赛、水球大战等有趣活动。', image: '🏊', capacity: 40, duration: '2 hrs', difficulty: 'Easy', difficulty_zh: '简单', location: 'Pool Area', requirements: ['Swimwear', 'Towel'], requirements_zh: ['泳装', '毛巾'], tags: ['water', 'fun', 'relaxation'] },
    { id: 9, name: 'Leadership Workshop', name_zh: '领袖工作坊', category: 'teambuilding', description: 'Practical leadership skills and servant-heart principles for the next generation.', description_zh: '为下一代装备实用的领导技能与仆人心态原则。', image: '👑', capacity: 30, duration: '2 hrs', difficulty: 'Easy', difficulty_zh: '简单', location: 'Conference Room', requirements: ['Notebook'], requirements_zh: ['笔记本'], tags: ['leadership', 'growth'] },
    { id: 10, name: 'Praise & Songwriting', name_zh: '敬拜创作', category: 'arts', description: 'Learn to write your own worship song with guidance from the music team.', description_zh: '在音乐团队的指导下，学习创作属于你自己的敬拜歌曲。', image: '🎸', capacity: 15, duration: '2 hrs', difficulty: 'Moderate', difficulty_zh: '中等', location: 'Music Room', requirements: ['Musical instrument (optional)'], requirements_zh: ['乐器（非必须）'], tags: ['music', 'creative', 'worship'] },
    { id: 11, name: 'Campfire & Testimony Night', name_zh: '营火见证之夜', category: 'devotion', description: 'Gather around the fire to share personal testimonies and enjoy s\'mores.', description_zh: '围绕营火分享个人见证，享用棉花糖夹心饼干。', image: '🔥', capacity: 100, duration: '2 hrs', difficulty: 'Easy', difficulty_zh: '简单', location: 'Campfire Circle', requirements: [], requirements_zh: [], tags: ['evening', 'community', 'spiritual'] },
    { id: 12, name: 'Challenge Course', name_zh: '挑战课程', category: 'teambuilding', description: 'Ropes course and obstacle challenges designed to build trust and teamwork.', description_zh: '绳索与障碍挑战，旨在建立信任与团队合作。', image: '🧗', capacity: 20, duration: '3 hrs', difficulty: 'Hard', difficulty_zh: '困难', location: 'Ropes Course', requirements: ['Closed shoes', 'Comfortable clothes', 'No jewellery'], requirements_zh: ['包鞋', '舒适的衣服', '不佩戴饰品'], tags: ['adventure', 'team', 'challenge'] },
]

export const useActivitiesStore = defineStore('activities', () => {
    const activities = ref(ACTIVITIES)

    function getById(id) {
        return activities.value.find(a => a.id === Number(id))
    }

    function getByCategory(category) {
        if (category === 'all') return activities.value
        return activities.value.filter(a => a.category === category)
    }

    function search(query) {
        const q = query.toLowerCase()
        return activities.value.filter(a =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.tags.some(t => t.includes(q))
        )
    }

    return { activities, getById, getByCategory, search }
})
