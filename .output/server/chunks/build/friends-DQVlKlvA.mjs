import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, c as useCampersStore } from './server.mjs';
import { UserPlus } from 'lucide-vue-next';
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
  __name: "friends",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const campersStore = useCampersStore();
    const showAdd = ref(false);
    const friendCode = ref("");
    const addError = ref("");
    const addSuccess = ref(false);
    const friends2 = computed(() => {
      var _a;
      return campersStore.getFriends((_a = auth.user) == null ? void 0 : _a.id);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))} data-v-1ed900e3><div class="container-inner py-10 max-w-4xl mx-auto" data-v-1ed900e3><div class="flex items-center justify-between mb-8" data-v-1ed900e3><h1 class="section-title" data-v-1ed900e3>${ssrInterpolate(unref(t)("friends.title"))}</h1><button class="btn-primary btn-sm" data-v-1ed900e3>`);
      _push(ssrRenderComponent(unref(UserPlus), { class: "w-4 h-4" }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("friends.add"))}</button></div>`);
      if (friends2.value.length > 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-v-1ed900e3><!--[-->`);
        ssrRenderList(friends2.value, (friend) => {
          _push(`<div class="card-hover p-5 text-center group" data-v-1ed900e3><div class="text-5xl mb-2" data-v-1ed900e3>${ssrInterpolate(friend.avatar)}</div><h3 class="font-heading font-bold text-sm text-tertiary group-hover:text-primary transition-colors" data-v-1ed900e3>${ssrInterpolate(friend.name)}</h3><p class="font-body text-xs text-primary mb-2" data-v-1ed900e3>${ssrInterpolate(friend.group)}</p><span class="badge-accent text-xs" data-v-1ed900e3>${ssrInterpolate(friend.campCode)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-20" data-v-1ed900e3><p class="text-5xl mb-4" data-v-1ed900e3>\u{1F44B}</p><p class="font-body text-tertiary/60" data-v-1ed900e3>${ssrInterpolate(unref(t)("friends.no_friends"))}</p><p class="font-body text-sm text-tertiary/40 mt-2" data-v-1ed900e3>Hint: Try adding code SC002 or SC003!</p></div>`);
      }
      if (showAdd.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-1ed900e3><div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" data-v-1ed900e3></div><div class="relative card p-8 max-w-sm w-full border-primary/20 shadow-warm-lg" data-v-1ed900e3><h3 class="font-heading font-bold text-xl text-primary mb-2" data-v-1ed900e3>${ssrInterpolate(unref(t)("friends.add"))}</h3><p class="font-body text-xs text-tertiary/50 mb-5" data-v-1ed900e3>${ssrInterpolate(unref(t)("friends.add_hint"))}</p><input${ssrRenderAttr("value", friendCode.value)} type="text" class="input mb-3 text-center tracking-widest uppercase"${ssrRenderAttr("placeholder", unref(t)("friends.input_placeholder"))} maxlength="6" data-v-1ed900e3>`);
        if (addError.value) {
          _push(`<p class="font-body text-xs text-red-400 mb-3" data-v-1ed900e3>${ssrInterpolate(addError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (addSuccess.value) {
          _push(`<p class="font-body text-xs text-green-400 mb-3" data-v-1ed900e3>Friend added! \u{1F389}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-2" data-v-1ed900e3><button class="btn-ghost btn-sm flex-1" data-v-1ed900e3>${ssrInterpolate(unref(t)("common.cancel"))}</button><button class="btn-primary btn-sm flex-1" data-v-1ed900e3>Add</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/friends.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const friends = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1ed900e3"]]);

export { friends as default };
//# sourceMappingURL=friends-DQVlKlvA.mjs.map
