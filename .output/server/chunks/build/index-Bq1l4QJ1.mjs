import { _ as __nuxt_component_0 } from './nuxt-link-D22nWayR.mjs';
import { ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, c as useCampersStore } from './server.mjs';
import { u as useLettersStore } from './letters-DFmj4D3R.mjs';
import { PenLine, Pencil } from 'lucide-vue-next';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const campersStore = useCampersStore();
    const lettersStore = useLettersStore();
    const tab = ref("received");
    const expandedId = ref(null);
    const editingId = ref(null);
    const editBody = ref("");
    const received = computed(() => lettersStore.getReceived(auth.user.id));
    const sent = computed(() => lettersStore.getSent(auth.user.id));
    const currentList = computed(() => tab.value === "received" ? received.value : sent.value);
    const getCamper = (id) => campersStore.getCamperById(id);
    const formatDate = (ts) => new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))} data-v-dd39dbf0><div class="container-inner py-10 max-w-4xl mx-auto" data-v-dd39dbf0><div class="flex items-center justify-between mb-8" data-v-dd39dbf0><h1 class="section-title" data-v-dd39dbf0>${ssrInterpolate(unref(t)("letters.dashboard_title"))}</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/letters/write",
        class: "btn-primary btn-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PenLine), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("letters.write_title"))}`);
          } else {
            return [
              createVNode(unref(PenLine), { class: "w-4 h-4" }),
              createTextVNode(" " + toDisplayString(unref(t)("letters.write_title")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex rounded-xl overflow-hidden border border-primary/10 mb-8 max-w-xs" data-v-dd39dbf0><button class="${ssrRenderClass([tab.value === "received" ? "bg-primary text-secondary" : "text-tertiary/70 hover:bg-primary/10", "flex-1 py-2.5 text-sm font-heading font-semibold transition-all"])}" data-v-dd39dbf0>${ssrInterpolate(unref(t)("letters.received"))} (${ssrInterpolate(received.value.length)}) </button><button class="${ssrRenderClass([tab.value === "sent" ? "bg-primary text-secondary" : "text-tertiary/70 hover:bg-primary/10", "flex-1 py-2.5 text-sm font-heading font-semibold transition-all"])}" data-v-dd39dbf0>${ssrInterpolate(unref(t)("letters.sent_tab"))} (${ssrInterpolate(sent.value.length)}) </button></div>`);
      if (currentList.value.length === 0) {
        _push(`<div class="text-center py-20" data-v-dd39dbf0><p class="text-5xl mb-4" data-v-dd39dbf0>\u{1F48C}</p><p class="font-body text-tertiary/60" data-v-dd39dbf0>${ssrInterpolate(unref(t)("letters.no_letters"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/letters/write",
          class: "btn-primary mt-4 inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Write a Letter`);
            } else {
              return [
                createTextVNode("Write a Letter")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-4" data-v-dd39dbf0><!--[-->`);
      ssrRenderList(currentList.value, (letter) => {
        var _a, _b;
        _push(`<div class="card p-6 border-primary/10 hover:border-primary/30 transition-all" data-v-dd39dbf0><div class="flex items-start justify-between gap-4" data-v-dd39dbf0><div class="flex-1" data-v-dd39dbf0><div class="flex items-center gap-2 mb-3" data-v-dd39dbf0><span class="badge-primary text-xs" data-v-dd39dbf0>${ssrInterpolate(tab.value === "received" ? unref(t)("letters.from") : "To")}: ${ssrInterpolate(tab.value === "received" ? letter.anonymous ? "\u{1F3AD} Anonymous" : (_a = getCamper(letter.fromId)) == null ? void 0 : _a.name : (_b = getCamper(letter.toId)) == null ? void 0 : _b.name)}</span>`);
        if (letter.edited) {
          _push(`<span class="badge-info text-xs" data-v-dd39dbf0>Edited</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="font-body text-xs text-tertiary/40 ml-auto" data-v-dd39dbf0>${ssrInterpolate(formatDate(letter.timestamp))}</span></div>`);
        if (expandedId.value !== letter.id) {
          _push(`<div class="font-body text-sm text-tertiary/75 leading-relaxed cursor-pointer line-clamp-3 hover:text-tertiary transition-colors" data-v-dd39dbf0>${ssrInterpolate(letter.body)}</div>`);
        } else {
          _push(`<div class="font-body text-sm text-tertiary/85 leading-relaxed whitespace-pre-wrap cursor-pointer" data-v-dd39dbf0>${ssrInterpolate(letter.body)}</div>`);
        }
        _push(`</div>`);
        if (tab.value === "sent") {
          _push(`<div class="flex-shrink-0" data-v-dd39dbf0>`);
          if (editingId.value !== letter.id) {
            _push(`<button class="btn-ghost btn-sm btn-icon" data-v-dd39dbf0>`);
            _push(ssrRenderComponent(unref(Pencil), { class: "w-4 h-4" }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<div class="space-y-2" data-v-dd39dbf0><textarea rows="6" class="input text-sm resize-none w-64" data-v-dd39dbf0>${ssrInterpolate(editBody.value)}</textarea><div class="flex gap-2" data-v-dd39dbf0><button class="btn-primary btn-sm flex-1 justify-center text-xs" data-v-dd39dbf0>Save</button><button class="btn-ghost btn-sm text-xs" data-v-dd39dbf0>Cancel</button></div></div>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/letters/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dd39dbf0"]]);

export { index as default };
//# sourceMappingURL=index-Bq1l4QJ1.mjs.map
