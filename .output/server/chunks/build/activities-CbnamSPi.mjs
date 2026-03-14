import { defineStore } from 'pinia';
import { ref } from 'vue';

const ACTIVITIES = [
  { id: 1, name: "Morning Devotion", category: "devotion", description: "Start each day with guided quiet time, worship, and prayer in small groups.", image: "\u{1F304}", capacity: 50, duration: "60 min", difficulty: "Easy", location: "Main Hall", requirements: ["Bible", "Journal"], tags: ["spiritual", "daily"] },
  { id: 2, name: "Jungle Trek", category: "sports", description: "A guided 5km hike through lush jungle trails with team challenges along the way.", image: "\u{1F33F}", capacity: 30, duration: "3 hrs", difficulty: "Moderate", location: "Forest Trail A", requirements: ["Comfortable shoes", "Water bottle", "Sunscreen"], tags: ["outdoor", "team"] },
  { id: 3, name: "Worship Night", category: "arts", description: "A powerful evening of corporate worship, live music, and free response time.", image: "\u{1F3B5}", capacity: 100, duration: "2 hrs", difficulty: "Easy", location: "Amphitheater", requirements: [], tags: ["spiritual", "music", "evening"] },
  { id: 4, name: "Creative Arts Workshop", category: "arts", description: "Express your faith through painting, sketching, and mixed media art.", image: "\u{1F3A8}", capacity: 20, duration: "2 hrs", difficulty: "Easy", location: "Arts Studio", requirements: ["Apron (provided)"], tags: ["creative", "arts"] },
  { id: 5, name: "Giant Sports Games", category: "sports", description: "Team vs team in epic versions of dodgeball, capture the flag, and tug of war.", image: "\u26BD", capacity: 80, duration: "2.5 hrs", difficulty: "Moderate", location: "Sports Field", requirements: ["Sports attire", "Closed shoes"], tags: ["sports", "team", "competition"] },
  { id: 6, name: "Small Group Discussion", category: "devotion", description: "Structured small group time to unpack teachings and share life experiences.", image: "\u{1F4AC}", capacity: 15, duration: "1.5 hrs", difficulty: "Easy", location: "Various Rooms", requirements: [], tags: ["connection", "daily", "spiritual"] },
  { id: 7, name: "Night Games", category: "teambuilding", description: "Thrilling night-time team challenges with flashlights and mystery clues.", image: "\u{1F319}", capacity: 60, duration: "2 hrs", difficulty: "Moderate", location: "Camp Grounds", requirements: ["Torchlight", "Comfortable shoes"], tags: ["night", "team", "adventure"] },
  { id: 8, name: "Pool & Water Games", category: "sports", description: "Splash around with fun pool relays, water balloon battles and more.", image: "\u{1F3CA}", capacity: 40, duration: "2 hrs", difficulty: "Easy", location: "Pool Area", requirements: ["Swimwear", "Towel"], tags: ["water", "fun", "relaxation"] },
  { id: 9, name: "Leadership Workshop", category: "teambuilding", description: "Practical leadership skills and servant-heart principles for the next generation.", image: "\u{1F451}", capacity: 30, duration: "2 hrs", difficulty: "Easy", location: "Conference Room", requirements: ["Notebook"], tags: ["leadership", "growth"] },
  { id: 10, name: "Praise & Songwriting", category: "arts", description: "Learn to write your own worship song with guidance from the music team.", image: "\u{1F3B8}", capacity: 15, duration: "2 hrs", difficulty: "Moderate", location: "Music Room", requirements: ["Musical instrument (optional)"], tags: ["music", "creative", "worship"] },
  { id: 11, name: "Campfire & Testimony Night", category: "devotion", description: "Gather around the fire to share personal testimonies and enjoy s'mores.", image: "\u{1F525}", capacity: 100, duration: "2 hrs", difficulty: "Easy", location: "Campfire Circle", requirements: [], tags: ["evening", "community", "spiritual"] },
  { id: 12, name: "Challenge Course", category: "teambuilding", description: "Ropes course and obstacle challenges designed to build trust and teamwork.", image: "\u{1F9D7}", capacity: 20, duration: "3 hrs", difficulty: "Hard", location: "Ropes Course", requirements: ["Closed shoes", "Comfortable clothes", "No jewellery"], tags: ["adventure", "team", "challenge"] }
];
const useActivitiesStore = defineStore("activities", () => {
  const activities = ref(ACTIVITIES);
  function getById(id) {
    return activities.value.find((a) => a.id === Number(id));
  }
  function getByCategory(category) {
    if (category === "all") return activities.value;
    return activities.value.filter((a) => a.category === category);
  }
  function search(query) {
    const q = query.toLowerCase();
    return activities.value.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q))
    );
  }
  return { activities, getById, getByCategory, search };
});

export { useActivitiesStore as u };
//# sourceMappingURL=activities-CbnamSPi.mjs.map
