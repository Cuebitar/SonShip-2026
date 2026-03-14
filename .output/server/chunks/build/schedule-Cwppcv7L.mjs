import { defineStore } from 'pinia';
import { ref } from 'vue';

const SCHEDULE = [
  // Day 1
  { id: 1, day: "Day 1", date: "2026-08-28", time: "08:00", activityId: 1, name: "Morning Devotion", location: "Main Hall", duration: 60 },
  { id: 2, day: "Day 1", date: "2026-08-28", time: "10:00", activityId: 9, name: "Leadership Workshop", location: "Conference Room", duration: 120 },
  { id: 3, day: "Day 1", date: "2026-08-28", time: "14:00", activityId: 5, name: "Giant Sports Games", location: "Sports Field", duration: 150 },
  { id: 4, day: "Day 1", date: "2026-08-28", time: "20:00", activityId: 3, name: "Worship Night", location: "Amphitheater", duration: 120 },
  // Day 2
  { id: 5, day: "Day 2", date: "2026-08-29", time: "08:00", activityId: 1, name: "Morning Devotion", location: "Main Hall", duration: 60 },
  { id: 6, day: "Day 2", date: "2026-08-29", time: "10:00", activityId: 2, name: "Jungle Trek", location: "Forest Trail A", duration: 180 },
  { id: 7, day: "Day 2", date: "2026-08-29", time: "14:00", activityId: 4, name: "Creative Arts Workshop", location: "Arts Studio", duration: 120 },
  { id: 8, day: "Day 2", date: "2026-08-29", time: "20:00", activityId: 7, name: "Night Games", location: "Camp Grounds", duration: 120 },
  // Day 3
  { id: 9, day: "Day 3", date: "2026-08-30", time: "08:00", activityId: 1, name: "Morning Devotion", location: "Main Hall", duration: 60 },
  { id: 10, day: "Day 3", date: "2026-08-30", time: "10:00", activityId: 8, name: "Pool & Water Games", location: "Pool Area", duration: 120 },
  { id: 11, day: "Day 3", date: "2026-08-30", time: "14:00", activityId: 12, name: "Challenge Course", location: "Ropes Course", duration: 180 },
  { id: 12, day: "Day 3", date: "2026-08-30", time: "20:00", activityId: 11, name: "Campfire & Testimony Night", location: "Campfire Circle", duration: 120 },
  // Day 4
  { id: 13, day: "Day 4", date: "2026-08-31", time: "08:00", activityId: 1, name: "Morning Devotion", location: "Main Hall", duration: 60 },
  { id: 14, day: "Day 4", date: "2026-08-31", time: "10:00", activityId: 10, name: "Closing Ceremony", location: "Main Hall", duration: 120 }
];
const useScheduleStore = defineStore("schedule", () => {
  const schedule = ref(SCHEDULE);
  const bookings = ref({});
  function getDays() {
    return [...new Set(schedule.value.map((s) => s.day))];
  }
  function getByDay(day) {
    return schedule.value.filter((s) => s.day === day);
  }
  function getUserBookings(userId) {
    return bookings.value[userId] || [];
  }
  function isBooked(userId, scheduleId) {
    return (bookings.value[userId] || []).includes(scheduleId);
  }
  function book(userId, scheduleId) {
    if (!bookings.value[userId]) bookings.value[userId] = [];
    if (!bookings.value[userId].includes(scheduleId)) {
      bookings.value[userId].push(scheduleId);
    }
  }
  function unbook(userId, scheduleId) {
    if (bookings.value[userId]) {
      bookings.value[userId] = bookings.value[userId].filter((id) => id !== scheduleId);
    }
  }
  return { schedule, bookings, getDays, getByDay, getUserBookings, isBooked, book, unbook };
});

export { useScheduleStore as u };
//# sourceMappingURL=schedule-Cwppcv7L.mjs.map
