import { _ as __nuxt_component_0 } from './nuxt-link-D22nWayR.mjs';
import { reactive, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, c as useCampersStore } from './server.mjs';
import { u as useLettersStore } from './letters-DFmj4D3R.mjs';
import { Mail, Send } from 'lucide-vue-next';
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
  __name: "write",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const campersStore = useCampersStore();
    useLettersStore();
    const form = reactive({ toId: "", body: "", anonymous: false });
    const sent = ref(false);
    const otherCampers = computed(() => campersStore.campers.filter((c) => {
      var _a;
      return c.id !== ((_a = auth.user) == null ? void 0 : _a.id);
    }));
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))} data-v-e6f93912><div class="container-inner py-10 max-w-3xl mx-auto" data-v-e6f93912><div class="flex items-center justify-between mb-8" data-v-e6f93912><div data-v-e6f93912><h1 class="section-title" data-v-e6f93912>${ssrInterpolate(unref(t)("letters.write_title"))}</h1><p class="font-body text-sm text-tertiary/50 mt-1" data-v-e6f93912>Write something meaningful to a fellow camper \u{1F48C}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/letters",
        class: "btn-ghost btn-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Mail), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` My Letters `);
          } else {
            return [
              createVNode(unref(Mail), { class: "w-4 h-4" }),
              createTextVNode(" My Letters ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card p-8 bg-[#fdf8f0] border-primary/20 relative overflow-hidden" data-v-e6f93912><div class="absolute inset-0 pointer-events-none" style="${ssrRenderStyle({ "background": "repeating-linear-gradient(transparent, transparent 31px, rgba(230,177,83,0.12) 31px, rgba(230,177,83,0.12) 32px)", "background-position": "0 40px" })}" data-v-e6f93912></div><div class="absolute top-0 bottom-0 left-16 w-px bg-primary/20 pointer-events-none" data-v-e6f93912></div><div class="relative space-y-5" data-v-e6f93912><div class="flex items-center gap-4" data-v-e6f93912><label class="input-label text-secondary min-w-[60px] mb-0 flex-shrink-0" data-v-e6f93912>${ssrInterpolate(unref(t)("letters.recipient"))}:</label><select class="flex-1 bg-transparent border-b border-secondary/30 text-secondary font-body text-sm focus:outline-none focus:border-primary/60 pb-1" data-v-e6f93912><option value="" disabled data-v-e6f93912${ssrIncludeBooleanAttr(Array.isArray(form.toId) ? ssrLooseContain(form.toId, "") : ssrLooseEqual(form.toId, "")) ? " selected" : ""}>Select a camper...</option><!--[-->`);
      ssrRenderList(otherCampers.value, (c) => {
        _push(`<option${ssrRenderAttr("value", c.id)} data-v-e6f93912${ssrIncludeBooleanAttr(Array.isArray(form.toId) ? ssrLooseContain(form.toId, c.id) : ssrLooseEqual(form.toId, c.id)) ? " selected" : ""}>${ssrInterpolate(c.avatar)} ${ssrInterpolate(c.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex items-center gap-4" data-v-e6f93912><label class="input-label text-secondary min-w-[60px] mb-0 flex-shrink-0" data-v-e6f93912>From:</label><div class="flex gap-3" data-v-e6f93912><label class="flex items-center gap-2 cursor-pointer" data-v-e6f93912><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(form.anonymous, false)) ? " checked" : ""}${ssrRenderAttr("value", false)} class="accent-secondary" data-v-e6f93912><span class="font-body text-sm text-secondary" data-v-e6f93912>${ssrInterpolate((_a = unref(auth).user) == null ? void 0 : _a.name)} (${ssrInterpolate(unref(t)("letters.named"))})</span></label><label class="flex items-center gap-2 cursor-pointer" data-v-e6f93912><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(form.anonymous, true)) ? " checked" : ""}${ssrRenderAttr("value", true)} class="accent-secondary" data-v-e6f93912><span class="font-body text-sm text-secondary" data-v-e6f93912>${ssrInterpolate(unref(t)("letters.anonymous"))} \u{1F3AD}</span></label></div></div><div class="pt-2" data-v-e6f93912><textarea rows="12" placeholder="Dear friend,

I just wanted to say..." class="w-full bg-transparent text-secondary font-body text-sm leading-8 resize-none focus:outline-none placeholder-secondary/30" style="${ssrRenderStyle({ "line-height": "32px" })}" data-v-e6f93912>${ssrInterpolate(form.body)}</textarea></div><div class="flex items-center justify-between pt-4 border-t border-secondary/20" data-v-e6f93912><p class="font-script text-secondary/60 text-lg" data-v-e6f93912>${ssrInterpolate(form.anonymous ? "Your Secret Friend \u{1F3AD}" : (_b = unref(auth).user) == null ? void 0 : _b.name)}</p><button${ssrIncludeBooleanAttr(!form.toId || !form.body.trim()) ? " disabled" : ""} class="btn-primary" data-v-e6f93912>`);
      _push(ssrRenderComponent(unref(Send), { class: "w-4 h-4" }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("letters.submit"))}</button></div></div></div>`);
      if (sent.value) {
        _push(`<div class="fixed bottom-6 right-6 z-50 card p-4 border-primary/30 shadow-warm-lg flex items-center gap-3" data-v-e6f93912><span class="text-2xl" data-v-e6f93912>\u{1F48C}</span><span class="font-body text-sm text-tertiary" data-v-e6f93912>${ssrInterpolate(unref(t)("letters.sent_success"))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/letters/write.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const write = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e6f93912"]]);

export { write as default };
//# sourceMappingURL=write-CzAdwKY_.mjs.map
