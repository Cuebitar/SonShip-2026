import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { defineStore } from 'pinia';
import { Share2, X } from 'lucide-vue-next';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const GALLERY_ITEMS = [
  { id: 1, session: "Day 1", activity: "worship", title: "Opening Worship", emoji: "\u{1F64C}", color: "#E6B153", description: "The Spirit moved as we opened camp together" },
  { id: 2, session: "Day 1", activity: "sports", title: "Sports Field Fun", emoji: "\u26BD", color: "#FF6F1E", description: "Eagles vs Lions \u2013 the epic match begins!" },
  { id: 3, session: "Day 1", activity: "devotion", title: "Morning Quiet Time", emoji: "\u{1F304}", color: "#3A2620", description: "Starting the day in God's presence" },
  { id: 4, session: "Day 2", activity: "nature", title: "Jungle Trek", emoji: "\u{1F33F}", color: "#2D6A4F", description: "Discovering God's creation on the trail" },
  { id: 5, session: "Day 2", activity: "arts", title: "Creative Arts", emoji: "\u{1F3A8}", color: "#941708", description: "Expressing faith through art" },
  { id: 6, session: "Day 2", activity: "night", title: "Night Games", emoji: "\u{1F319}", color: "#1B1040", description: "Torches, clues, and team cheers" },
  { id: 7, session: "Day 3", activity: "worship", title: "Campfire Night", emoji: "\u{1F525}", color: "#FF6F1E", description: "Testimonies by firelight \u2013 unforgettable" },
  { id: 8, session: "Day 3", activity: "sports", title: "Pool Games", emoji: "\u{1F3CA}", color: "#0096C7", description: "Splashing into community" },
  { id: 9, session: "Day 3", activity: "closing", title: "Closing Ceremony", emoji: "\u2728", color: "#E6B153", description: "Goodbye hugs and hearts full" },
  { id: 10, session: "Group Photos", activity: "group", title: "Eagles Group Shot", emoji: "\u{1F985}", color: "#3A2620", description: "The Eagles fam!" },
  { id: 11, session: "Group Photos", activity: "group", title: "Lions Group Shot", emoji: "\u{1F981}", color: "#941708", description: "Hear us ROAR!" },
  { id: 12, session: "Group Photos", activity: "group", title: "Doves Group Shot", emoji: "\u{1F54A}\uFE0F", color: "#3E7C17", description: "Doves spreading peace" }
];
const useGalleryStore = defineStore("gallery", () => {
  const photos = ref(GALLERY_ITEMS);
  function getSessions() {
    return ["All", ...new Set(photos.value.map((p) => p.session))];
  }
  function getBySession(session) {
    if (session === "All") return photos.value;
    return photos.value.filter((p) => p.session === session);
  }
  return { photos, getSessions, getBySession };
});
const _sfc_main = {
  __name: "gallery",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const galleryStore = useGalleryStore();
    const sessions = galleryStore.getSessions();
    const activeSession = ref("All");
    const lightbox = ref(null);
    const filtered = computed(() => galleryStore.getBySession(activeSession.value));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))} data-v-31e79e66><div class="container-inner py-10" data-v-31e79e66><h1 class="section-title mb-4" data-v-31e79e66>${ssrInterpolate(unref(t)("gallery.title"))}</h1><div class="flex flex-wrap gap-2 mb-10" data-v-31e79e66><!--[-->`);
      ssrRenderList(unref(sessions), (session) => {
        _push(`<button class="${ssrRenderClass([activeSession.value === session ? "bg-primary text-secondary border-primary" : "badge-primary hover:bg-primary/30", "badge cursor-pointer text-sm px-4 py-1.5 transition-all"])}" data-v-31e79e66>${ssrInterpolate(session === "All" ? unref(t)("gallery.filter_all") : session)}</button>`);
      });
      _push(`<!--]--></div><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-v-31e79e66><!--[-->`);
      ssrRenderList(filtered.value, (photo) => {
        _push(`<div class="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square" style="${ssrRenderStyle(`background: linear-gradient(135deg, ${photo.color}cc, ${photo.color}66)`)}" data-v-31e79e66><div class="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300" data-v-31e79e66>${ssrInterpolate(photo.emoji)}</div><div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-all duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100" data-v-31e79e66><div data-v-31e79e66><p class="font-heading font-bold text-xs text-white" data-v-31e79e66>${ssrInterpolate(photo.title)}</p><p class="font-body text-xs text-white/70" data-v-31e79e66>${ssrInterpolate(photo.session)}</p></div></div></div>`);
      });
      _push(`<!--]--></div>`);
      if (filtered.value.length === 0) {
        _push(`<div class="text-center py-20" data-v-31e79e66><p class="font-body text-tertiary/50" data-v-31e79e66>No photos in this session yet.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (lightbox.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-31e79e66><div class="absolute inset-0 bg-dark/90 backdrop-blur-sm" data-v-31e79e66></div><div class="relative max-w-lg w-full" data-v-31e79e66><div class="rounded-3xl overflow-hidden relative aspect-square" style="${ssrRenderStyle(`background: linear-gradient(135deg, ${lightbox.value.color}dd, ${lightbox.value.color}88)`)}" data-v-31e79e66><div class="absolute inset-0 flex items-center justify-center text-[8rem]" data-v-31e79e66>${ssrInterpolate(lightbox.value.emoji)}</div></div><div class="mt-4 px-2" data-v-31e79e66><h3 class="font-heading font-bold text-xl text-tertiary" data-v-31e79e66>${ssrInterpolate(lightbox.value.title)}</h3><p class="font-body text-sm text-tertiary/60 mt-1" data-v-31e79e66>${ssrInterpolate(lightbox.value.description)}</p><div class="flex gap-3 mt-4" data-v-31e79e66><button class="btn-ghost btn-sm flex items-center gap-2" data-v-31e79e66>`);
        _push(ssrRenderComponent(unref(Share2), { class: "w-4 h-4" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("gallery.share"))}</button><button class="btn-ghost btn-sm ml-auto flex items-center gap-2" data-v-31e79e66>`);
        _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("gallery.close"))}</button></div></div><button class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center font-bold hover:bg-accent transition-colors" data-v-31e79e66> \u2715 </button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const gallery = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-31e79e66"]]);

export { gallery as default };
//# sourceMappingURL=gallery-CW96-uOD.mjs.map
