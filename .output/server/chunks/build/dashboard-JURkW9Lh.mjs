import { _ as __nuxt_component_0 } from './nuxt-link-D22nWayR.mjs';
import { ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, c as useCampersStore } from './server.mjs';
import { u as useScheduleStore } from './schedule-Cwppcv7L.mjs';
import { Calendar, Bell, Clock, Heart, Sparkles } from 'lucide-vue-next';
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
import 'pinia';
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

const _sfc_main = {
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const campersStore = useCampersStore();
    const scheduleStore = useScheduleStore();
    const revealCode = ref("");
    const identityRevealed = ref(false);
    const wrongCode = ref(false);
    const angelTarget = computed(() => {
      if (!auth.user) return null;
      return campersStore.getCamperById(auth.user.secretAngelTargetId);
    });
    const mySchedule = computed(() => scheduleStore.schedule.slice(0, 3));
    const announcements = [
      { id: 1, title: "\u{1F392} Packing list has been sent to your email!", date: "Aug 10, 2026" },
      { id: 2, title: "\u{1F4CB} Pre-camp form due by August 15", date: "Aug 1, 2026" },
      { id: 3, title: "\u{1F68C} Bus pickup details \u2014 check your group chat", date: "July 25, 2026" }
    ];
    const quickLinks = [
      { to: "/games", label: "nav.games", emoji: "\u{1F3AE}" },
      { to: "/messages", label: "nav.messages", emoji: "\u{1F4AC}" },
      { to: "/letters", label: "nav.letters", emoji: "\u{1F48C}" },
      { to: "/friends", label: "nav.friends", emoji: "\u{1F465}" },
      { to: "/gallery", label: "nav.gallery", emoji: "\u{1F4F7}" },
      { to: "/profile", label: "nav.profile", emoji: "\u{1F464}" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))}><div class="container-inner py-10"><div class="mb-10"><p class="font-body text-tertiary/60 text-sm mb-1">${ssrInterpolate(unref(t)("dashboard.welcome"))}</p><h1 class="section-title">${ssrInterpolate((_a = unref(auth).user) == null ? void 0 : _a.name)} ${ssrInterpolate((_b = unref(auth).user) == null ? void 0 : _b.avatar)}</h1><div class="flex flex-wrap gap-2 mt-3"><span class="badge-primary">${ssrInterpolate((_c = unref(auth).user) == null ? void 0 : _c.group)}</span><span class="badge-accent">Camp Code: ${ssrInterpolate((_d = unref(auth).user) == null ? void 0 : _d.campCode)}</span></div></div><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"><div class="card p-6"><h2 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Calendar), { class: "w-5 h-5" }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("dashboard.upcoming"))}</h2><div class="space-y-3"><div class="bg-primary/10 rounded-xl p-4 border border-primary/20"><p class="font-heading font-bold text-tertiary mb-1">SonShip Camp 2026</p><p class="text-xs font-body text-tertiary/60">\u{1F4C5} August 28\u201331, 2026</p><p class="text-xs font-body text-tertiary/60">\u{1F4CD} Nature Retreat Centre, Selangor</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/schedule",
        class: "btn-ghost btn-sm w-full justify-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View Schedule`);
          } else {
            return [
              createTextVNode("View Schedule")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="card p-6"><h2 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5" }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("dashboard.announcements"))}</h2><div class="space-y-3"><!--[-->`);
      ssrRenderList(announcements, (ann) => {
        _push(`<div class="border-b border-primary/10 pb-3 last:border-0 last:pb-0"><p class="font-body text-sm text-tertiary">${ssrInterpolate(ann.title)}</p><p class="font-body text-xs text-tertiary/50 mt-1">${ssrInterpolate(ann.date)}</p></div>`);
      });
      _push(`<!--]--></div></div><div class="card p-6"><h2 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Clock), { class: "w-5 h-5" }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("dashboard.my_schedule"))}</h2><div class="space-y-2"><!--[-->`);
      ssrRenderList(mySchedule.value.slice(0, 3), (slot) => {
        _push(`<div class="flex items-center gap-3 bg-primary/5 rounded-lg p-3"><span class="text-xs font-heading font-bold text-primary w-14">${ssrInterpolate(slot.time)}</span><div><p class="font-body text-xs text-tertiary font-semibold">${ssrInterpolate(slot.name)}</p><p class="font-body text-xs text-tertiary/50">${ssrInterpolate(slot.day)}</p></div></div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/schedule",
        class: "btn-ghost btn-sm w-full justify-center mt-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Full Schedule`);
          } else {
            return [
              createTextVNode("Full Schedule")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card p-6 border-primary/30"><h2 class="font-heading font-bold text-primary mb-2 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Heart), { class: "w-5 h-5 text-red-400" }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("dashboard.secret_angel"))}</h2><p class="font-body text-xs text-tertiary/50 mb-4">${ssrInterpolate(unref(t)("dashboard.secret_angel_hint"))}</p><div class="relative group"><div class="bg-secondary/50 rounded-xl p-5 border border-primary/20 text-center filter blur-sm group-hover:blur-none transition-all duration-500 cursor-pointer"><div class="text-5xl mb-2">${ssrInterpolate((_e = angelTarget.value) == null ? void 0 : _e.avatar)}</div><p class="font-heading font-bold text-tertiary">${ssrInterpolate((_f = angelTarget.value) == null ? void 0 : _f.name)}</p><p class="font-body text-xs text-primary">${ssrInterpolate((_g = angelTarget.value) == null ? void 0 : _g.group)}</p></div><div class="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity pointer-events-none"><div class="bg-dark/70 backdop-blur rounded-xl px-4 py-2"><p class="font-heading font-bold text-primary text-sm">Hover to reveal \u{1F440}</p></div></div></div></div><div class="card p-6 border-accent/30"><h2 class="font-heading font-bold text-accent mb-2 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "w-5 h-5" }, null, _parent));
      _push(`${ssrInterpolate(unref(t)("dashboard.secret_identity"))}</h2><p class="font-body text-xs text-tertiary/50 mb-4">${ssrInterpolate(unref(t)("dashboard.secret_identity_hint"))}</p>`);
      if (!identityRevealed.value) {
        _push(`<div><div class="bg-secondary/50 rounded-xl p-5 text-center mb-4 border border-accent/20"><div class="text-5xl mb-2 filter blur-sm">\u{1F464}</div><p class="font-heading font-bold text-tertiary filter blur-sm">???</p></div><div class="flex gap-2"><input${ssrRenderAttr("value", revealCode.value)} type="text" class="input flex-1 text-sm"${ssrRenderAttr("placeholder", unref(t)("dashboard.reveal_code"))}><button class="btn-secondary btn-sm px-4">${ssrInterpolate(unref(t)("dashboard.reveal_btn"))}</button></div>`);
        if (wrongCode.value) {
          _push(`<p class="font-body text-xs text-red-400 mt-2">${ssrInterpolate(unref(t)("dashboard.wrong_code"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="bg-accent/10 rounded-xl p-5 text-center border border-accent/30"><div class="text-5xl mb-2">\u2728</div><p class="font-heading font-bold text-accent text-lg">${ssrInterpolate((_h = unref(auth).user) == null ? void 0 : _h.secretIdentity)}</p><p class="font-body text-xs text-tertiary/50 mt-2">${ssrInterpolate(unref(t)("dashboard.identity_revealed"))}</p></div>`);
      }
      _push(`</div><div class="card p-6"><h2 class="font-heading font-bold text-primary mb-4">Quick Access</h2><div class="grid grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(quickLinks, (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.to,
          to: link.to,
          class: "card-hover p-4 text-center group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-2xl mb-1 block"${_scopeId}>${ssrInterpolate(link.emoji)}</span><span class="font-body text-xs text-tertiary group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(unref(t)(link.label))}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-2xl mb-1 block" }, toDisplayString(link.emoji), 1),
                createVNode("span", { class: "font-body text-xs text-tertiary group-hover:text-primary transition-colors" }, toDisplayString(unref(t)(link.label)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-JURkW9Lh.mjs.map
