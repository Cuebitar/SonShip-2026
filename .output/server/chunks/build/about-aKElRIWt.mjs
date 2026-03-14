import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { a as useI18n } from './server.mjs';
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
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    ref(null);
    const stats = [
      { value: "100+", label: "Lives Touched" },
      { value: "2019", label: "Running Since" },
      { value: "4", label: "Days of Camp" },
      { value: "6", label: "Small Groups" }
    ];
    const team = ref([
      { name: "names.elson", role: "Camp Consultant", emoji: "\u{1F4BC}" },
      { name: "names.hao", role: "Superior Camp Coordinator", emoji: "\u{1F468}" },
      { name: "names.jolin", role: "Camp Coordinator who assists with every details", emoji: "\u{1F4C4}" },
      { name: "names.alvin", role: "Camp Coordinator who does all the physical work", emoji: "\u{1F3C3}" },
      { name: "names.ruth", role: "Worship Lead", emoji: "\u{1F3A4}" },
      { name: "names.shawn", role: "Activities Head", emoji: "\u{1F3C6}" },
      { name: "names.jonathan", role: "Game Head", emoji: "\u{1F3AE}" },
      { name: "names.florance", role: "Tech & Media", emoji: "\u{1F3AC}" },
      { name: "names.jack", role: "3M", emoji: "\u{1F509}" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container" }, _attrs))}><section class="relative py-28 bg-gradient-dark overflow-hidden"><div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(230,177,83,0.1),transparent_60%)]"></div><div class="container-inner relative z-10 text-center"><span class="badge-primary mb-4 inline-flex">${ssrInterpolate(unref(t)("about.title"))}</span><h1 class="section-title mb-4">${ssrInterpolate(unref(t)("about.title"))}</h1><p class="section-subtitle max-w-2xl mx-auto">${ssrInterpolate(unref(t)("about.mission"))}</p></div></section><section class="py-20 bg-dark"><div class="container-inner"><div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"><div><h2 class="section-title mb-6">${ssrInterpolate(unref(t)("about.story_title"))}</h2><p class="font-body text-tertiary/75 leading-relaxed text-lg mb-6">${ssrInterpolate(unref(t)("about.story"))}</p></div><div class="grid grid-cols-2 gap-4"><!--[-->`);
      ssrRenderList(stats, (stat) => {
        _push(`<div class="card p-6 text-center"><div class="text-4xl font-heading font-black text-primary mb-1">${ssrInterpolate(stat.value)}</div><div class="text-sm font-body text-tertiary/60">${ssrInterpolate(stat.label)}</div></div>`);
      });
      _push(`<!--]--></div></div></div></section><section class="py-20 bg-secondary/20"><div class="container-inner text-center max-w-3xl mx-auto"><span class="text-5xl mb-6 block">\u{1F3AF}</span><h2 class="section-title mb-6">${ssrInterpolate(unref(t)("about.mission_title"))}</h2><blockquote class="font-script text-2xl md:text-3xl text-primary/90 leading-relaxed"> &quot;${ssrInterpolate(unref(t)("about.mission"))}&quot; </blockquote></div></section><section class="py-20 bg-dark"><div class="container-inner"><h2 class="section-title text-center mb-14">${ssrInterpolate(unref(t)("about.team_title"))}</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-6"><!--[-->`);
      ssrRenderList(team.value, (member) => {
        _push(`<div class="card-hover p-6 text-center group"><div class="text-5xl mb-3 group-hover:animate-bounce inline-block">${ssrInterpolate(member.emoji)}</div><h4 class="font-heading font-bold text-tertiary text-sm mb-1">${ssrInterpolate(unref(t)(member.name))}</h4><p class="font-body text-primary text-xs">${ssrInterpolate(member.role)}</p></div>`);
      });
      _push(`<!--]--></div></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-aKElRIWt.mjs.map
