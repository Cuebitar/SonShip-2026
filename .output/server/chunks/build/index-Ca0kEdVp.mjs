import { _ as __nuxt_component_0 } from './nuxt-link-D22nWayR.mjs';
import { ref, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useActivitiesStore } from './activities-CbnamSPi.mjs';
import { Search, Clock, MapPin, Users } from 'lucide-vue-next';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useI18n } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const store = useActivitiesStore();
    const searchQuery = ref("");
    const activeCategory = ref("all");
    const categories = [
      { value: "all" },
      { value: "sports" },
      { value: "arts" },
      { value: "devotion" },
      { value: "teambuilding" }
    ];
    const filteredActivities = computed(() => {
      let list = store.activities;
      if (activeCategory.value !== "all") list = list.filter((a) => a.category === activeCategory.value);
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
      }
      return list;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container" }, _attrs))} data-v-b7947331><section class="py-24 bg-gradient-dark relative overflow-hidden" data-v-b7947331><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(230,177,83,0.1),transparent_60%)]" data-v-b7947331></div><div class="container-inner relative z-10 text-center" data-v-b7947331><h1 class="section-title mb-4" data-v-b7947331>${ssrInterpolate(unref(t)("activities.title"))}</h1><p class="section-subtitle max-w-xl mx-auto" data-v-b7947331>${ssrInterpolate(unref(t)("activities.subtitle"))}</p><div class="mt-8 max-w-md mx-auto relative" data-v-b7947331>`);
      _push(ssrRenderComponent(unref(Search), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary/40" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("activities.search_placeholder"))} class="input pl-11 text-center" data-v-b7947331></div><div class="flex flex-wrap gap-2 justify-center mt-6" data-v-b7947331><!--[-->`);
      ssrRenderList(categories, (cat) => {
        _push(`<button class="${ssrRenderClass([activeCategory.value === cat.value ? "bg-primary text-secondary border-primary" : "badge-primary hover:bg-primary/30", "badge cursor-pointer transition-all duration-200"])}" data-v-b7947331>${ssrInterpolate(unref(t)(`activities.${cat.value}`))}</button>`);
      });
      _push(`<!--]--></div></div></section><section class="py-16 bg-dark" data-v-b7947331><div class="container-inner" data-v-b7947331><div${ssrRenderAttrs({
        name: "activity-list",
        class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      })} data-v-b7947331>`);
      ssrRenderList(filteredActivities.value, (act) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: act.id,
          to: `/activities/${act.id}`,
          class: "card-hover p-6 group block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start justify-between mb-4" data-v-b7947331${_scopeId}><span class="text-5xl" data-v-b7947331${_scopeId}>${ssrInterpolate(act.image)}</span><span class="badge-primary capitalize text-xs" data-v-b7947331${_scopeId}>${ssrInterpolate(act.category)}</span></div><h3 class="font-heading font-bold text-lg text-tertiary group-hover:text-primary transition-colors mb-2" data-v-b7947331${_scopeId}>${ssrInterpolate(act.name)}</h3><p class="font-body text-sm text-tertiary/60 leading-relaxed mb-4 line-clamp-2" data-v-b7947331${_scopeId}>${ssrInterpolate(act.description)}</p><div class="flex flex-wrap gap-3 text-xs font-body text-tertiary/50" data-v-b7947331${_scopeId}><span class="flex items-center gap-1" data-v-b7947331${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Clock), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(`${ssrInterpolate(act.duration)}</span><span class="flex items-center gap-1" data-v-b7947331${_scopeId}>`);
              _push2(ssrRenderComponent(unref(MapPin), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(`${ssrInterpolate(act.location)}</span><span class="flex items-center gap-1" data-v-b7947331${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Users), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
              _push2(`${ssrInterpolate(act.capacity)}</span></div><div class="mt-4 pt-4 border-t border-primary/10" data-v-b7947331${_scopeId}><span class="font-heading font-semibold text-primary text-sm group-hover:underline" data-v-b7947331${_scopeId}>${ssrInterpolate(unref(t)("activities.view_details"))} \u2192</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start justify-between mb-4" }, [
                  createVNode("span", { class: "text-5xl" }, toDisplayString(act.image), 1),
                  createVNode("span", { class: "badge-primary capitalize text-xs" }, toDisplayString(act.category), 1)
                ]),
                createVNode("h3", { class: "font-heading font-bold text-lg text-tertiary group-hover:text-primary transition-colors mb-2" }, toDisplayString(act.name), 1),
                createVNode("p", { class: "font-body text-sm text-tertiary/60 leading-relaxed mb-4 line-clamp-2" }, toDisplayString(act.description), 1),
                createVNode("div", { class: "flex flex-wrap gap-3 text-xs font-body text-tertiary/50" }, [
                  createVNode("span", { class: "flex items-center gap-1" }, [
                    createVNode(unref(Clock), { class: "w-3.5 h-3.5" }),
                    createTextVNode(toDisplayString(act.duration), 1)
                  ]),
                  createVNode("span", { class: "flex items-center gap-1" }, [
                    createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                    createTextVNode(toDisplayString(act.location), 1)
                  ]),
                  createVNode("span", { class: "flex items-center gap-1" }, [
                    createVNode(unref(Users), { class: "w-3.5 h-3.5" }),
                    createTextVNode(toDisplayString(act.capacity), 1)
                  ])
                ]),
                createVNode("div", { class: "mt-4 pt-4 border-t border-primary/10" }, [
                  createVNode("span", { class: "font-heading font-semibold text-primary text-sm group-hover:underline" }, toDisplayString(unref(t)("activities.view_details")) + " \u2192", 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`</div>`);
      if (filteredActivities.value.length === 0) {
        _push(`<div class="text-center py-20" data-v-b7947331><p class="text-5xl mb-4" data-v-b7947331>\u{1F50D}</p><p class="font-body text-tertiary/60" data-v-b7947331>No activities found. Try a different search.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/activities/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b7947331"]]);

export { index as default };
//# sourceMappingURL=index-Ca0kEdVp.mjs.map
