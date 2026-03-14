import { _ as __nuxt_component_0 } from './nuxt-link-D22nWayR.mjs';
import { ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useActivitiesStore } from './activities-CbnamSPi.mjs';
import { ArrowRight, ChevronDown } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Logo-CqjBTFPY.mjs';
import { F as Firelight } from './firelight-_F5Nxwhz.mjs';
import { a as useI18n, u as useHead } from './server.mjs';
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
    const activitiesStore = useActivitiesStore();
    useHead({
      title: "Home"
    });
    (/* @__PURE__ */ new Date("2026-08-28T09:00:00")).getTime();
    const timeLeft = ref({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    const highlights = {
      community: { emoji: "\u{1F91D}" },
      growth: { emoji: "\u{1F331}" },
      adventure: { emoji: "\u26F0\uFE0F" }
    };
    activitiesStore.activities.slice(0, 8);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container" }, _attrs))}><section class="relative min-h-screen max-h-screen flex items-center justify-center overflow-hidden"><div class="absolute inset-0 bg-[url(&#39;../assets/bg.JPG&#39;)] bg-cover bg-center"></div><div class="absolute inset-0 bg-gradient-hero opacity-90"></div><div class="relative z-10 container-inner text-center px-4">`);
      _push(ssrRenderComponent(_sfc_main$1, { class: "md:text-9xl text-7xl pb-2 md:tracking-[-0.7rem] tracking-[-0.4rem]" }, null, _parent));
      _push(`<p class="text-sm md:text-xl mb-6 animate-fade-in mt-[-25px] md:mt-[-30px] mr-[-24px] md:mr-[-88px] font-body" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}"><img class="inline-block w-6 h-6 mr-[-5px]"${ssrRenderAttr("src", unref(Firelight))} alt="Firelight"> reconnecting... </p><p class="font-body text-tertiary/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}">${ssrInterpolate(unref(t)("home.hero_subtitle"))}</p><div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="${ssrRenderStyle({ "animation-delay": "0.6s" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "btn-primary btn-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("home.hero_cta"))} `);
            _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("home.hero_cta")) + " ", 1),
              createVNode(unref(ArrowRight), { class: "w-5 h-5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "btn-ghost btn-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("home.hero_learn"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("home.hero_learn")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="absolute -bottom-16 left-1/2 -translate-x-1/2 animate-bounce">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "w-6 h-6 text-primary/60" }, null, _parent));
      _push(`</div></div></section><section class="py-20 bg-dark"><div class="container-inner"><div class="text-center mb-14"><h2 class="section-title mb-3">${ssrInterpolate(unref(t)("home.highlights_title"))}</h2><div class="w-16 h-1 bg-gradient-warm mx-auto rounded-full"></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList(highlights, (item, key) => {
        _push(`<div class="card-hover p-8 text-center group"><div class="text-5xl mb-4 group-hover:animate-bounce inline-block">${ssrInterpolate(item.emoji)}</div><h3 class="font-heading font-bold text-xl text-primary mb-3">${ssrInterpolate(unref(t)(`home.highlights.${key}.title`))}</h3><p class="font-body text-tertiary/70 text-sm leading-relaxed">${ssrInterpolate(unref(t)(`home.highlights.${key}.desc`))}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-24 relative overflow-hidden bg-secondary/10"><div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(230,177,83,0.05),transparent_70%)] pointer-events-none"></div><div class="container-inner relative z-10 text-center"><div class="mb-12"><h2 class="section-title mb-4">${ssrInterpolate(unref(t)("home.sessions_title"))}</h2><div class="w-16 h-1 bg-gradient-warm mx-auto rounded-full mb-6"></div><p class="font-body text-tertiary/60 max-w-lg mx-auto">${ssrInterpolate(unref(t)("home.sessions_subtitle"))}</p></div><div class="flex flex-wrap justify-center gap-4 md:gap-8 mb-16"><!--[-->`);
      ssrRenderList(timeLeft.value, (value, unit) => {
        _push(`<div class="flex flex-col items-center"><div class="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-dark/40 backdrop-blur-md border border-primary/20 rounded-2xl shadow-warm"><span class="text-3xl md:text-5xl font-heading font-bold text-primary">${ssrInterpolate(value)}</span></div><span class="mt-3 text-xs md:text-sm font-body font-semibold uppercase tracking-widest text-tertiary/60">${ssrInterpolate(unit)}</span></div>`);
      });
      _push(`<!--]--></div><div class="flex flex-col items-center space-y-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "btn-primary btn-xl group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("home.cta_btn"))} `);
            _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-6 h-6 group-hover:translate-x-1 transition-transform" }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("home.cta_btn")) + " ", 1),
              createVNode(unref(ArrowRight), { class: "w-6 h-6 group-hover:translate-x-1 transition-transform" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-sm font-body text-tertiary/40">${ssrInterpolate(unref(t)("home.cta_subtitle"))}</p></div></div></section><section class="py-20 bg-secondary/30"><div class="container-inner"><div class="rounded-3xl overflow-hidden relative bg-gradient-hero min-h-64 flex items-center justify-center p-10"><div class="absolute inset-0 opacity-20 flex items-center justify-center select-none"></div><div class="relative text-center"><p class="font-script text-primary text-3xl md:text-5xl mb-4">${ssrInterpolate(unref(t)("home.gallery_title"))}</p><p class="font-body text-tertiary/70 mb-6">${ssrInterpolate(unref(t)("home.gallery_subtitle"))}</p><div class="flex flex-wrap justify-center gap-2 text-4xl"><!--[-->`);
      ssrRenderList(12, (i) => {
        _push(`<span class="animate-pulse" style="${ssrRenderStyle(`animation-delay: ${i * 0.1}s`)}">${ssrInterpolate(["\u{1F981}", "\u{1F338}", "\u26A1", "\u{1F319}", "\u{1F30A}", "\u2728", "\u{1F525}", "\u{1F33A}", "\u{1F54A}\uFE0F", "\u{1F31F}", "\u{1F985}", "\u{1F308}"][i - 1])}</span>`);
      });
      _push(`<!--]--></div></div></div></div></section><section class="py-20 bg-dark"><div class="container-inner text-center"><h2 class="section-title mb-4">${ssrInterpolate(unref(t)("home.cta_title"))}</h2><p class="section-subtitle mb-8 max-w-xl mx-auto">${ssrInterpolate(unref(t)("home.cta_subtitle"))}</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "btn-primary btn-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("home.cta_btn"))} `);
            _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-5 h-5" }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("home.cta_btn")) + " ", 1),
              createVNode(unref(ArrowRight), { class: "w-5 h-5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D0a3DhBf.mjs.map
