import { _ as __nuxt_component_0 } from './nuxt-link-D22nWayR.mjs';
import { computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useActivitiesStore } from './activities-CbnamSPi.mjs';
import { u as useScheduleStore } from './schedule-Cwppcv7L.mjs';
import { ArrowLeft, Clock, MapPin, Users, Zap, CheckCircle, Calendar, Tag } from 'lucide-vue-next';
import { a as useI18n, e as useRoute } from './server.mjs';
import 'pinia';
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

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const route = useRoute();
    const store = useActivitiesStore();
    const scheduleStore = useScheduleStore();
    const activity = computed(() => store.getById(route.params.id));
    const actSchedule = computed(
      () => scheduleStore.schedule.filter((s) => {
        var _a;
        return s.activityId === ((_a = activity.value) == null ? void 0 : _a.id);
      })
    );
    const related = computed(
      () => store.activities.filter((a) => {
        var _a, _b;
        return a.id !== ((_a = activity.value) == null ? void 0 : _a.id) && a.category === ((_b = activity.value) == null ? void 0 : _b.category);
      }).slice(0, 4)
    );
    const categoryColors = {
      sports: "#FF6F1E",
      arts: "#941708",
      devotion: "#E6B153",
      teambuilding: "#3E7C17"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (activity.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container" }, _attrs))}><section class="py-24 bg-gradient-dark relative overflow-hidden"><div class="absolute inset-0" style="${ssrRenderStyle(`background: radial-gradient(circle at 60% 40%, ${categoryColors[activity.value.category]}22, transparent 60%)`)}"></div><div class="container-inner relative z-10">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/activities",
          class: "inline-flex items-center gap-2 text-sm font-body text-tertiary/60 hover:text-primary mb-8 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("common.back"))}`);
            } else {
              return [
                createVNode(unref(ArrowLeft), { class: "w-4 h-4" }),
                createTextVNode(" " + toDisplayString(unref(t)("common.back")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"><div><span class="badge-primary mb-4 inline-flex capitalize">${ssrInterpolate(activity.value.category)}</span><h1 class="section-title mb-4">${ssrInterpolate(activity.value.name)}</h1><p class="font-body text-tertiary/75 text-lg leading-relaxed mb-6">${ssrInterpolate(activity.value.description)}</p><div class="flex flex-wrap gap-4"><div class="flex items-center gap-2 text-sm font-body text-tertiary/60">`);
        _push(ssrRenderComponent(unref(Clock), { class: "w-4 h-4 text-primary" }, null, _parent));
        _push(` ${ssrInterpolate(activity.value.duration)}</div><div class="flex items-center gap-2 text-sm font-body text-tertiary/60">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4 text-primary" }, null, _parent));
        _push(` ${ssrInterpolate(activity.value.location)}</div><div class="flex items-center gap-2 text-sm font-body text-tertiary/60">`);
        _push(ssrRenderComponent(unref(Users), { class: "w-4 h-4 text-primary" }, null, _parent));
        _push(` Max ${ssrInterpolate(activity.value.capacity)}</div><div class="flex items-center gap-2 text-sm font-body text-tertiary/60">`);
        _push(ssrRenderComponent(unref(Zap), { class: "w-4 h-4 text-primary" }, null, _parent));
        _push(` ${ssrInterpolate(activity.value.difficulty)}</div></div></div><div class="text-center"><div class="text-[10rem] animate-float inline-block">${ssrInterpolate(activity.value.image)}</div></div></div></div></section><section class="py-16 bg-dark"><div class="container-inner grid grid-cols-1 md:grid-cols-3 gap-8"><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("activities.requirements"))}</h3><ul class="space-y-2"><!--[-->`);
        ssrRenderList(activity.value.requirements, (req) => {
          _push(`<li class="flex items-center gap-2 text-sm font-body text-tertiary/70"><span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span> ${ssrInterpolate(req)}</li>`);
        });
        _push(`<!--]-->`);
        if (!activity.value.requirements.length) {
          _push(`<li class="text-sm font-body text-tertiary/50">No special requirements.</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul></div><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Calendar), { class: "w-5 h-5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("activities.schedule"))}</h3><!--[-->`);
        ssrRenderList(actSchedule.value, (slot) => {
          _push(`<div class="mb-3 pb-3 border-b border-primary/10 last:border-0"><p class="font-heading font-semibold text-sm text-tertiary">${ssrInterpolate(slot.day)} \u2022 ${ssrInterpolate(slot.time)}</p><p class="text-xs font-body text-tertiary/50">${ssrInterpolate(slot.location)}</p></div>`);
        });
        _push(`<!--]-->`);
        if (!actSchedule.value.length) {
          _push(`<p class="text-sm font-body text-tertiary/50">Schedule TBA.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4 flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Tag), { class: "w-5 h-5" }, null, _parent));
        _push(` Tags </h3><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(activity.value.tags, (tag) => {
          _push(`<span class="badge-accent capitalize">${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div></div></div></section><section class="py-16 bg-secondary/20"><div class="container-inner"><h2 class="section-title mb-8">${ssrInterpolate(unref(t)("activities.related"))}</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(related.value, (rel) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: rel.id,
            to: `/activities/${rel.id}`,
            class: "card-hover p-5 text-center group"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-4xl mb-2"${_scopeId}>${ssrInterpolate(rel.image)}</div><p class="font-heading font-semibold text-sm text-tertiary group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(rel.name)}</p>`);
              } else {
                return [
                  createVNode("div", { class: "text-4xl mb-2" }, toDisplayString(rel.image), 1),
                  createVNode("p", { class: "font-heading font-semibold text-sm text-tertiary group-hover:text-primary transition-colors" }, toDisplayString(rel.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div></section></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container flex items-center justify-center min-h-screen" }, _attrs))}><div class="text-center"><p class="text-6xl mb-4">\u{1F615}</p><p class="font-body text-tertiary/60">Activity not found.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/activities",
          class: "btn-primary mt-4 inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Back to Activities`);
            } else {
              return [
                createTextVNode("Back to Activities")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/activities/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CKEjI7V9.mjs.map
