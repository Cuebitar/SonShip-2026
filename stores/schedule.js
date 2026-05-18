import { defineStore } from 'pinia'
import { ref } from 'vue'

const SCHEDULE = [
  // ── Day 1 · 28 Aug · 建立关系 ─────────────────────────────────
  { id: 1,  day: 'Day 1', date: '2026-08-28', time: '14:00', name: 'Registration',                   location: 'Mega Subang',              duration: 60  },
  { id: 2,  day: 'Day 1', date: '2026-08-28', time: '15:00', name: 'Bus Depart to Radiant Site B',   location: 'Mega Subang',              duration: 120 },
  { id: 3,  day: 'Day 1', date: '2026-08-28', time: '17:00', name: 'Bus Arrive at Radiant Site B',   location: 'Radiant Site B',           duration: 30  },
  { id: 4,  day: 'Day 1', date: '2026-08-28', time: '17:30', name: 'Check In + Welcome Kit',         location: 'Radiant Site B',           duration: 90  },
  { id: 5,  day: 'Day 1', date: '2026-08-28', time: '19:00', name: 'Dinner',                         location: 'Dining Hall',              duration: 60  },
  { id: 6,  day: 'Day 1', date: '2026-08-28', time: '20:00', name: 'Opening Ceremony + Ice Breaker', location: 'Main Hall',                duration: 90  },
  { id: 7,  day: 'Day 1', date: '2026-08-28', time: '21:30', name: 'Camp Rules Briefing',            location: 'Main Hall',                duration: 30  },
  { id: 8,  day: 'Day 1', date: '2026-08-28', time: '22:00', name: 'Relax',                          location: 'Common Area',              duration: 60  },
  { id: 9, day: 'Day 1', date: '2026-08-28', time: '23:00', name: 'Lights Out',                     location: 'Dormitory',                duration: 0   },

  // ── Day 2 · 29 Aug · 建立关系 ─────────────────────────────────
  { id: 10, day: 'Day 2', date: '2026-08-29', time: '08:00', name: 'Breakfast',                      location: 'Dining Hall',              duration: 60  },
  { id: 11, day: 'Day 2', date: '2026-08-29', time: '09:00', name: 'Opening Ceremony + Big Game',    location: 'Main Hall / Grounds',      duration: 240 },
  { id: 12, day: 'Day 2', date: '2026-08-29', time: '13:00', name: 'Lunch',                          location: 'Dining Hall',              duration: 90  },
  { id: 13, day: 'Day 2', date: '2026-08-29', time: '14:30', name: 'Workshop 1 (Gamified): BGR',     location: 'Main Hall',                duration: 90  },
  { id: 14, day: 'Day 2', date: '2026-08-29', time: '16:00', name: 'Break',                          location: 'Common Area',              duration: 60  },
  { id: 15, day: 'Day 2', date: '2026-08-29', time: '17:00', name: 'Workshop 2 (Gamified): AI & Faith', location: 'Main Hall',             duration: 120 },
  { id: 16, day: 'Day 2', date: '2026-08-29', time: '19:00', name: 'Dinner',                         location: 'Dining Hall',              duration: 60  },
  { id: 17, day: 'Day 2', date: '2026-08-29', time: '20:00', name: 'Worship',                        location: 'Main Hall',                duration: 30  },
  { id: 18, day: 'Day 2', date: '2026-08-29', time: '20:30', name: 'Sermon 1: Lesson of the Game',   location: 'Main Hall',                duration: 90  },
  { id: 19, day: 'Day 2', date: '2026-08-29', time: '22:00', name: 'Relax',                          location: 'Common Area',              duration: 60  },
  { id: 20, day: 'Day 2', date: '2026-08-29', time: '23:00', name: 'Lights Out',                     location: 'Dormitory',                duration: 0   },

  // ── Day 3 · 30 Aug · 灵命 ─────────────────────────────────────
  { id: 21, day: 'Day 3', date: '2026-08-30', time: '08:00', name: 'Breakfast',                      location: 'Dining Hall',              duration: 60  },
  { id: 22, day: 'Day 3', date: '2026-08-30', time: '09:00', name: 'How to Answer Pt 1: Is God Real?', location: 'Main Hall',              duration: 90  },
  { id: 23, day: 'Day 3', date: '2026-08-30', time: '10:30', name: 'How to Answer Pt 2: Is Jesus God?', location: 'Main Hall',             duration: 90  },
  { id: 24, day: 'Day 3', date: '2026-08-30', time: '12:00', name: 'Group Photo',                    location: 'Grounds',                  duration: 30  },
  { id: 25, day: 'Day 3', date: '2026-08-30', time: '12:30', name: 'Lunch',                          location: 'Dining Hall',              duration: 60  },
  { id: 26, day: 'Day 3', date: '2026-08-30', time: '13:30', name: 'Worship',                        location: 'Main Hall',                duration: 30  },
  { id: 27, day: 'Day 3', date: '2026-08-30', time: '14:00', name: 'Sermon 2: What is Stopping You from Experiencing God?', location: 'Main Hall', duration: 90 },
  { id: 28, day: 'Day 3', date: '2026-08-30', time: '15:30', name: 'Quiet Retreat Briefing',         location: 'Main Hall',                duration: 30  },
  { id: 29, day: 'Day 3', date: '2026-08-30', time: '16:00', name: 'Quiet Retreat',                  location: 'Various Stations',         duration: 180 },
  { id: 30, day: 'Day 3', date: '2026-08-30', time: '19:00', name: 'Seek & Soak: Temple Structure',  location: 'Main Hall',                duration: 180 },
  { id: 31, day: 'Day 3', date: '2026-08-30', time: '22:00', name: 'Relax (Surprise Supper 🎉)',      location: 'Common Area',              duration: 60  },
  { id: 32, day: 'Day 3', date: '2026-08-30', time: '23:00', name: 'Lights Out',                     location: 'Dormitory',                duration: 0   },

  // ── Day 4 · 31 Aug · Action Plan ──────────────────────────────
  { id: 33, day: 'Day 4', date: '2026-08-31', time: '08:00', name: 'Breakfast',                      location: 'Dining Hall',              duration: 60  },
  { id: 34, day: 'Day 4', date: '2026-08-31', time: '09:00', name: '灵修法',                          location: 'Main Hall',                duration: 60  },
  { id: 35, day: 'Day 4', date: '2026-08-31', time: '10:00', name: 'Pledge',                         location: 'Main Hall',                duration: 90  },
  { id: 36, day: 'Day 4', date: '2026-08-31', time: '11:30', name: 'Testimony',                      location: 'Main Hall',                duration: 60  },
  { id: 37, day: 'Day 4', date: '2026-08-31', time: '12:30', name: 'Lunch',                          location: 'Dining Hall',              duration: 60  },
]

export const useScheduleStore = defineStore('schedule', () => {
  const schedule = ref(SCHEDULE)
  const bookings = ref({}) // { userId: [scheduleId, ...] }

  function getDays() {
    return [...new Set(schedule.value.map(s => s.day))]
  }

  function getByDay(day) {
    return schedule.value.filter(s => s.day === day)
  }

  function getUserBookings(userId) {
    return bookings.value[userId] || []
  }

  function isBooked(userId, scheduleId) {
    return (bookings.value[userId] || []).includes(scheduleId)
  }

  function book(userId, scheduleId) {
    if (!bookings.value[userId]) bookings.value[userId] = []
    if (!bookings.value[userId].includes(scheduleId)) {
      bookings.value[userId].push(scheduleId)
    }
  }

  function unbook(userId, scheduleId) {
    if (bookings.value[userId]) {
      bookings.value[userId] = bookings.value[userId].filter(id => id !== scheduleId)
    }
  }

  return { schedule, bookings, getDays, getByDay, getUserBookings, isBooked, book, unbook }
})