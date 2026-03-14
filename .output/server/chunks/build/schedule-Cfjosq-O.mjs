import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore } from './server.mjs';
import { u as useScheduleStore } from './schedule-Cwppcv7L.mjs';
import { MapPin, CalendarCheck } from 'lucide-vue-next';
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
  __name: "schedule",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const scheduleStore = useScheduleStore();
    const days = scheduleStore.getDays();
    const activeDay = ref(days[0]);
    const daySchedule = computed(() => scheduleStore.getByDay(activeDay.value));
    const isBooked = (id) => {
      var _a;
      return scheduleStore.isBooked((_a = auth.user) == null ? void 0 : _a.id, id);
    };
    const myBookedSlots = computed(() => {
      var _a;
      const booked = scheduleStore.getUserBookings((_a = auth.user) == null ? void 0 : _a.id);
      return scheduleStore.schedule.filter((s) => booked.includes(s.id));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))}><div class="container-inner py-10"><h1 class="section-title mb-8">${ssrInterpolate(unref(t)("schedule.title"))}</h1><div class="flex flex-wrap gap-2 mb-8"><!--[-->`);
      ssrRenderList(unref(days), (day) => {
        _push(`<button class="${ssrRenderClass([activeDay.value === day ? "bg-primary text-secondary border-primary font-bold" : "badge-primary hover:bg-primary/30", "badge cursor-pointer text-sm px-5 py-2 transition-all duration-200"])}">${ssrInterpolate(day)}</button>`);
      });
      _push(`<!--]--></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-3">`);
      if (daySchedule.value.length === 0) {
        _push(`<div class="text-center py-12 card"><p class="font-body text-tertiary/50">No sessions on ${ssrInterpolate(activeDay.value)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(daySchedule.value, (slot) => {
        _push(`<div class="${ssrRenderClass([isBooked(slot.id) ? "border-primary/40 bg-primary/5" : "hover:border-primary/20", "card p-5 flex items-center gap-5 group transition-all"])}"><div class="flex-shrink-0 text-center w-16"><p class="font-heading font-black text-lg text-primary">${ssrInterpolate(slot.time)}</p><p class="font-body text-xs text-tertiary/40">${ssrInterpolate(slot.duration)}m</p></div><div class="w-px h-12 bg-primary/20 flex-shrink-0"></div><div class="flex-1 min-w-0"><h3 class="font-heading font-bold text-tertiary group-hover:text-primary transition-colors">${ssrInterpolate(slot.name)}</h3><p class="font-body text-xs text-tertiary/50 flex items-center gap-1 mt-1">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-3 h-3" }, null, _parent));
        _push(` ${ssrInterpolate(slot.location)}</p></div><button class="${ssrRenderClass([isBooked(slot.id) ? "btn-primary btn-sm" : "btn-ghost btn-sm", "flex-shrink-0 transition-all"])}">${ssrInterpolate(isBooked(slot.id) ? "\u2713 " + unref(t)("schedule.book") + "ed" : unref(t)("schedule.book"))}</button></div>`);
      });
      _push(`<!--]--></div><div class="space-y-4"><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(CalendarCheck), { class: "w-5 h-5" }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("schedule.personal"))}</h3>`);
      if (myBookedSlots.value.length === 0) {
        _push(`<div class="text-center py-6"><p class="font-body text-xs text-tertiary/40">No sessions booked yet.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(myBookedSlots.value, (slot) => {
        _push(`<div class="mb-3 pb-3 border-b border-primary/10 last:border-0 last:pb-0"><p class="font-heading font-semibold text-sm text-tertiary">${ssrInterpolate(slot.name)}</p><p class="font-body text-xs text-primary">${ssrInterpolate(slot.day)} \xB7 ${ssrInterpolate(slot.time)}</p><p class="font-body text-xs text-tertiary/40">${ssrInterpolate(slot.location)}</p><button class="text-red-400 text-xs font-body hover:underline mt-1">${ssrInterpolate(unref(t)("schedule.unbook"))}</button></div>`);
      });
      _push(`<!--]--></div><div class="card p-5"><h4 class="font-heading font-bold text-sm text-primary mb-3">Camp Dates</h4><div class="space-y-2 text-xs font-body text-tertiary/60"><p>\u{1F4C5} Day 1 \u2014 April 10, 2026</p><p>\u{1F4C5} Day 2 \u2014 April 11, 2026</p><p>\u{1F4C5} Day 3 \u2014 April 12, 2026</p></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/schedule.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=schedule-Cfjosq-O.mjs.map
