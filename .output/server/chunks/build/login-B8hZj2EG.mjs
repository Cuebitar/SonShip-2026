import { _ as __nuxt_component_0 } from './nuxt-link-D22nWayR.mjs';
import { reactive, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, d as useRouter, e as useRoute } from './server.mjs';
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Logo-CqjBTFPY.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useAuthStore();
    useRouter();
    useRoute();
    const form = reactive({ email: "", password: "" });
    const error = ref("");
    const loading = ref(false);
    const showPw = ref(false);
    const forgotModal = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container min-h-screen flex items-center justify-center bg-dark p-4" }, _attrs))} data-v-1658346d><div class="w-full max-w-md" data-v-1658346d><div class="text-center mb-8 sm:pt-16" data-v-1658346d><span class="text-3xl" data-v-1658346d>\u{1F525}</span>`);
      _push(ssrRenderComponent(_sfc_main$1, { size: "3xl" }, null, _parent));
      _push(`<p class="font-heading font-bold text-xl text-tertiary mt-4" data-v-1658346d>${ssrInterpolate(unref(t)("login.title"))}</p><p class="font-body text-sm text-tertiary/60 mt-1" data-v-1658346d>${ssrInterpolate(unref(t)("login.subtitle"))}</p></div><div class="card bg-primary/10 border-primary/20 p-3 mb-6 text-center" data-v-1658346d><p class="font-body text-xs text-primary" data-v-1658346d>\u{1F4A1} ${ssrInterpolate(unref(t)("login.demo_hint"))}</p></div><form class="card p-8 space-y-5" data-v-1658346d>`);
      if (error.value) {
        _push(`<div class="badge-danger w-full justify-center py-3 rounded-xl" data-v-1658346d>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-1658346d><label class="input-label" data-v-1658346d>${ssrInterpolate(unref(t)("login.email"))}</label><input${ssrRenderAttr("value", form.email)} type="email" required class="input" placeholder="liam@sonship.com" data-v-1658346d></div><div data-v-1658346d><label class="input-label" data-v-1658346d>${ssrInterpolate(unref(t)("login.password"))}</label><div class="relative" data-v-1658346d><input${ssrRenderDynamicModel(showPw.value ? "text" : "password", form.password, null)}${ssrRenderAttr("type", showPw.value ? "text" : "password")} required class="input pr-11" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" data-v-1658346d><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary/40 hover:text-primary transition-colors" data-v-1658346d>`);
      if (!showPw.value) {
        _push(ssrRenderComponent(unref(Eye), { class: "w-4 h-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "w-4 h-4" }, null, _parent));
      }
      _push(`</button></div></div><div class="text-right" data-v-1658346d><button type="button" class="font-body text-xs text-primary/70 hover:text-primary transition-colors" data-v-1658346d>${ssrInterpolate(unref(t)("login.forgot"))}</button></div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="btn-primary w-full justify-center btn-lg" data-v-1658346d>`);
      if (loading.value) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin" }, null, _parent));
      } else {
        _push(`<span data-v-1658346d>${ssrInterpolate(unref(t)("login.submit"))}</span>`);
      }
      _push(`</button></form><p class="text-center font-body text-sm text-tertiary/60 mt-6" data-v-1658346d>${ssrInterpolate(unref(t)("login.no_account"))} `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "text-primary hover:underline ml-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("login.register_link"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("login.register_link")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div>`);
      if (forgotModal.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-1658346d><div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" data-v-1658346d></div><div class="relative card p-8 max-w-sm w-full border-primary/20" data-v-1658346d><h3 class="font-heading font-bold text-xl text-primary mb-3" data-v-1658346d>Reset Password</h3><p class="font-body text-sm text-tertiary/70 mb-5" data-v-1658346d>Enter your email and we&#39;ll send a reset link.</p><input type="email" class="input mb-4" placeholder="your@email.com" data-v-1658346d><button class="btn-primary w-full justify-center" data-v-1658346d>Send Reset Email</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1658346d"]]);

export { login as default };
//# sourceMappingURL=login-B8hZj2EG.mjs.map
