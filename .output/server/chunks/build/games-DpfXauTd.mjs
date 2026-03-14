import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, c as useCampersStore } from './server.mjs';
import { defineStore } from 'pinia';
import { Trophy, Star } from 'lucide-vue-next';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'node:module';
import 'vue-router';
import 'firebase/firestore';
import 'firebase/app';
import 'firebase/auth';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const GAMES_LIST = [
  { id: 1, name: "Reflex Rush", emoji: "\u26A1", description: "Tap the glowing button as fast as you can before time runs out!", rules: ["Tap the golden circle when it appears", "Each correct tap = +10 points", "Miss = -5 points", "30 seconds per round", "Fastest fingers win!"], type: "interactive" },
  { id: 2, name: "Bible Trivia", emoji: "\u{1F4D6}", description: "Test your knowledge of scripture with rapid-fire trivia questions.", rules: ["10 questions per round", "Correct = +20 points", "Wrong = 0 points", "Fastest correct answer gets bonus +10"], type: "quiz" },
  { id: 3, name: "Camp Scavenger Hunt", emoji: "\u{1F5FA}\uFE0F", description: "Find hidden items around camp with cryptic clues!", rules: ["Teams of 3", "Find all 10 items", "First team to return wins", "Bonus points for photos"], type: "physical" },
  { id: 4, name: "Worship Leader", emoji: "\u{1F3A4}", description: "Lead worship for 30 seconds, earn points from your team!", rules: ["1 minute timer", "Team rates your performance", "Extra points for creativity"], type: "performance" }
];
const INITIAL_SCORES = [
  { camperId: 1, score: 840, achievements: ["First Login", "Social Butterfly", "Early Bird"] },
  { camperId: 2, score: 720, achievements: ["First Login", "Letter Writer"] },
  { camperId: 3, score: 1100, achievements: ["First Login", "Game Master", "Speed Demon", "Top Scorer"] },
  { camperId: 4, score: 650, achievements: ["First Login", "Peacemaker"] },
  { camperId: 5, score: 890, achievements: ["First Login", "Team Player", "Social Butterfly"] },
  { camperId: 6, score: 760, achievements: ["First Login", "Creative Soul", "Letter Writer"] },
  { camperId: 7, score: 930, achievements: ["First Login", "Game Master", "Team Player"] },
  { camperId: 8, score: 580, achievements: ["First Login"] },
  { camperId: 9, score: 700, achievements: ["First Login", "Peacemaker", "Social Butterfly"] },
  { camperId: 10, score: 1050, achievements: ["First Login", "Top Scorer", "Early Bird"] },
  { camperId: 11, score: 810, achievements: ["First Login", "Team Player"] },
  { camperId: 12, score: 670, achievements: ["First Login", "Creative Soul"] }
];
const ALL_ACHIEVEMENTS = [
  { id: "first_login", name: "First Login", emoji: "\u{1F511}", desc: "Welcome to the portal!" },
  { id: "social_butterfly", name: "Social Butterfly", emoji: "\u{1F98B}", desc: "Made 3+ friends" },
  { id: "early_bird", name: "Early Bird", emoji: "\u{1F426}", desc: "Attended morning devotion" },
  { id: "game_master", name: "Game Master", emoji: "\u{1F3AE}", desc: "Played all camp games" },
  { id: "speed_demon", name: "Speed Demon", emoji: "\u26A1", desc: "Top score in Reflex Rush" },
  { id: "top_scorer", name: "Top Scorer", emoji: "\u{1F3C6}", desc: "Reached 1000 points" },
  { id: "letter_writer", name: "Letter Writer", emoji: "\u2709\uFE0F", desc: "Wrote 2+ letters" },
  { id: "team_player", name: "Team Player", emoji: "\u{1F91D}", desc: "Participated in team activities" },
  { id: "peacemaker", name: "Peacemaker", emoji: "\u{1F54A}\uFE0F", desc: "Resolved a conflict gracefully" },
  { id: "creative_soul", name: "Creative Soul", emoji: "\u{1F3A8}", desc: "Joined the arts workshop" }
];
const useGamesStore = defineStore("games", () => {
  const scores = ref(INITIAL_SCORES);
  const games2 = ref(GAMES_LIST);
  const achievements = ref(ALL_ACHIEVEMENTS);
  function getLeaderboard() {
    return [...scores.value].sort((a, b) => b.score - a.score);
  }
  function getCamperScore(camperId) {
    return scores.value.find((s) => s.camperId === camperId) || { camperId, score: 0, achievements: [] };
  }
  function addScore(camperId, points) {
    let entry = scores.value.find((s) => s.camperId === camperId);
    if (!entry) {
      entry = { camperId, score: 0, achievements: [] };
      scores.value.push(entry);
    }
    entry.score += points;
    if (entry.score >= 1e3 && !entry.achievements.includes("Top Scorer")) {
      entry.achievements.push("Top Scorer");
    }
  }
  return { scores, games: games2, achievements, getLeaderboard, getCamperScore, addScore };
});
const _sfc_main = {
  __name: "games",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const gamesStore = useGamesStore();
    const campersStore = useCampersStore();
    const rulesModal = ref(null);
    const reflexActive = ref(false);
    const circleVisible = ref(false);
    const circleX = ref(50);
    const circleY = ref(50);
    const timeLeft = ref(30);
    const gameScore = ref(0);
    const gameTaps = ref(0);
    const leaderboard = computed(() => gamesStore.getLeaderboard().slice(0, 10));
    const myAchievements = computed(() => {
      var _a, _b;
      return ((_b = gamesStore.getCamperScore((_a = auth.user) == null ? void 0 : _a.id)) == null ? void 0 : _b.achievements) || [];
    });
    const getCamper = (id) => campersStore.getCamperById(id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))} data-v-44d064c5><div class="container-inner py-10" data-v-44d064c5><h1 class="section-title mb-8" data-v-44d064c5>${ssrInterpolate(unref(t)("games.title"))}</h1><div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-v-44d064c5><div class="lg:col-span-2 space-y-6" data-v-44d064c5><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-44d064c5><!--[-->`);
      ssrRenderList(unref(gamesStore).games, (game) => {
        _push(`<div class="card-hover p-6 group" data-v-44d064c5><div class="flex items-start justify-between mb-3" data-v-44d064c5><span class="text-4xl" data-v-44d064c5>${ssrInterpolate(game.emoji)}</span><span class="badge-primary text-xs capitalize" data-v-44d064c5>${ssrInterpolate(game.type)}</span></div><h3 class="font-heading font-bold text-tertiary group-hover:text-primary transition-colors mb-1" data-v-44d064c5>${ssrInterpolate(game.name)}</h3><p class="font-body text-xs text-tertiary/60 mb-4" data-v-44d064c5>${ssrInterpolate(game.description)}</p><div class="flex gap-2" data-v-44d064c5>`);
        if (game.type === "interactive") {
          _push(`<button class="btn-primary btn-sm flex-1 justify-center" data-v-44d064c5>${ssrInterpolate(unref(t)("games.play"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="btn-ghost btn-sm flex-1 justify-center" data-v-44d064c5>${ssrInterpolate(unref(t)("games.rules"))}</button></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (reflexActive.value) {
        _push(`<div class="card p-8 border-primary/30 text-center" data-v-44d064c5><h3 class="font-heading font-bold text-xl text-primary mb-2" data-v-44d064c5>\u26A1 Reflex Rush</h3><p class="font-body text-sm text-tertiary/60 mb-4" data-v-44d064c5>Tap the golden circle! Time: <span class="text-primary font-bold" data-v-44d064c5>${ssrInterpolate(timeLeft.value)}s</span></p><div class="relative h-48 bg-secondary/30 rounded-2xl overflow-hidden cursor-pointer" data-v-44d064c5>`);
        if (circleVisible.value) {
          _push(`<button style="${ssrRenderStyle(`position:absolute;left:${circleX.value}%;top:${circleY.value}%;transform:translate(-50%,-50%);`)}" class="w-16 h-16 rounded-full bg-primary animate-pulse-warm border-4 border-accent shadow-warm-lg" data-v-44d064c5></button>`);
        } else {
          _push(`<!---->`);
        }
        if (!circleVisible.value) {
          _push(`<div class="absolute inset-0 flex items-center justify-center" data-v-44d064c5><p class="font-body text-tertiary/40 text-sm" data-v-44d064c5>Get ready... \u{1F440}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-4 flex justify-center gap-6" data-v-44d064c5><div class="text-center" data-v-44d064c5><p class="font-heading font-black text-3xl text-primary" data-v-44d064c5>${ssrInterpolate(gameScore.value)}</p><p class="font-body text-xs text-tertiary/50" data-v-44d064c5>Score</p></div><div class="text-center" data-v-44d064c5><p class="font-heading font-black text-3xl text-accent" data-v-44d064c5>${ssrInterpolate(gameTaps.value)}</p><p class="font-body text-xs text-tertiary/50" data-v-44d064c5>Taps</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-6" data-v-44d064c5><div class="card p-6" data-v-44d064c5><h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2" data-v-44d064c5>`);
      _push(ssrRenderComponent(unref(Trophy), { class: "w-5 h-5" }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("games.leaderboard"))}</h3><div class="space-y-2" data-v-44d064c5><!--[-->`);
      ssrRenderList(leaderboard.value, (entry, i) => {
        var _a, _b, _c;
        _push(`<div class="${ssrRenderClass([entry.camperId === ((_a = unref(auth).user) == null ? void 0 : _a.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-primary/5", "flex items-center gap-3 p-2 rounded-lg"])}" data-v-44d064c5><span class="${ssrRenderClass([i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-tertiary/40", "font-heading font-black text-sm w-6 text-center"])}" data-v-44d064c5>${ssrInterpolate(i + 1)}</span><span class="text-lg" data-v-44d064c5>${ssrInterpolate((_b = getCamper(entry.camperId)) == null ? void 0 : _b.avatar)}</span><div class="flex-1 min-w-0" data-v-44d064c5><p class="font-body text-xs font-semibold text-tertiary truncate" data-v-44d064c5>${ssrInterpolate((_c = getCamper(entry.camperId)) == null ? void 0 : _c.name)}</p></div><span class="font-heading font-bold text-sm text-primary" data-v-44d064c5>${ssrInterpolate(entry.score)}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="card p-6" data-v-44d064c5><h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2" data-v-44d064c5>`);
      _push(ssrRenderComponent(unref(Star), { class: "w-5 h-5" }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("games.achievements"))}</h3><div class="grid grid-cols-2 gap-2" data-v-44d064c5><!--[-->`);
      ssrRenderList(unref(gamesStore).achievements, (ach) => {
        _push(`<div class="${ssrRenderClass([myAchievements.value.includes(ach.name) ? "bg-primary/10 border border-primary/20" : "bg-secondary/20 opacity-40", "p-2 rounded-lg text-center transition-all duration-200"])}" data-v-44d064c5><div class="text-2xl mb-1" data-v-44d064c5>${ssrInterpolate(ach.emoji)}</div><p class="font-body text-xs text-tertiary leading-tight" data-v-44d064c5>${ssrInterpolate(ach.name)}</p></div>`);
      });
      _push(`<!--]--></div></div></div></div></div>`);
      if (rulesModal.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-44d064c5><div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" data-v-44d064c5></div><div class="relative card p-8 max-w-md w-full border-primary/20" data-v-44d064c5><h3 class="font-heading font-bold text-xl text-primary mb-1" data-v-44d064c5>${ssrInterpolate(rulesModal.value.emoji)} ${ssrInterpolate(rulesModal.value.name)}</h3><p class="font-body text-sm text-tertiary/60 mb-5" data-v-44d064c5>${ssrInterpolate(rulesModal.value.description)}</p><ul class="space-y-2" data-v-44d064c5><!--[-->`);
        ssrRenderList(rulesModal.value.rules, (rule) => {
          _push(`<li class="flex gap-2 text-sm font-body text-tertiary/80" data-v-44d064c5><span class="text-primary" data-v-44d064c5>\u2192</span> ${ssrInterpolate(rule)}</li>`);
        });
        _push(`<!--]--></ul><button class="btn-primary w-full justify-center mt-6" data-v-44d064c5>Got it!</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/games.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const games = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-44d064c5"]]);

export { games as default };
//# sourceMappingURL=games-DpfXauTd.mjs.map
