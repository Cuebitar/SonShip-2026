import { computed, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, c as useCampersStore } from './server.mjs';
import { Pencil, Save, X } from 'lucide-vue-next';
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
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const campersStore = useCampersStore();
    const profile = computed(() => {
      var _a;
      return campersStore.getCamperById((_a = auth.user) == null ? void 0 : _a.id) || auth.user;
    });
    const editing = ref(false);
    const draft = reactive({
      name: "",
      phone: "",
      emergencyContact: { name: "", phone: "", relation: "" },
      medicalInfo: { allergies: "", medications: "", conditions: "" },
      dietary: ""
    });
    function startEdit() {
      const p = profile.value;
      draft.name = p.name;
      draft.phone = p.phone;
      draft.dietary = p.dietary;
      Object.assign(draft.emergencyContact, p.emergencyContact);
      Object.assign(draft.medicalInfo, p.medicalInfo);
    }
    const qrPattern = computed(() => {
      var _a;
      const code = ((_a = profile.value) == null ? void 0 : _a.campCode) || "SC001";
      let seed = code.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return Array.from({ length: 49 }, (_, i) => {
        const row = Math.floor(i / 7), col = i % 7;
        const isMarker = row < 2 && col < 2 || row < 2 && col > 4 || row > 4 && col < 2;
        seed = seed * 1103515245 + 12345 & 2147483647;
        return { id: i, filled: isMarker || seed % 3 !== 0 };
      });
    });
    watch(editing, (v) => {
      if (v) startEdit();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))}><div class="container-inner py-10 max-w-4xl mx-auto"><div class="flex items-center justify-between mb-8"><h1 class="section-title">${ssrInterpolate(unref(t)("profile.title"))}</h1>`);
      if (!editing.value) {
        _push(`<button class="btn-secondary btn-sm">`);
        _push(ssrRenderComponent(unref(Pencil), { class: "w-4 h-4" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("profile.edit"))}</button>`);
      } else {
        _push(`<div class="flex gap-2"><button class="btn-primary btn-sm">`);
        _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("profile.save"))}</button><button class="btn-ghost btn-sm">`);
        _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("profile.cancel"))}</button></div>`);
      }
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="space-y-4"><div class="card p-6 text-center"><div class="text-6xl mb-3">${ssrInterpolate(profile.value.avatar)}</div><h2 class="font-heading font-bold text-lg text-tertiary">${ssrInterpolate(profile.value.name)}</h2><p class="font-body text-sm text-primary">${ssrInterpolate(profile.value.group)}</p></div><div class="card p-6 text-center"><h3 class="font-heading font-bold text-primary mb-3 text-sm">${ssrInterpolate(unref(t)("profile.qr_title"))}</h3><div class="qr-wrapper mx-auto mb-3" style="${ssrRenderStyle({ "width": "120px", "height": "120px", "background": "#F6E9D7", "border-radius": "8px", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "10px" })}"><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(7,1fr)", "gap": "2px", "width": "100%" })}"><!--[-->`);
      ssrRenderList(qrPattern.value, (cell) => {
        _push(`<div style="${ssrRenderStyle(`background:${cell.filled ? "#3A2620" : "#F6E9D7"};border-radius:1px;aspect-ratio:1`)}"></div>`);
      });
      _push(`<!--]--></div></div><p class="font-heading font-black text-xl text-primary">${ssrInterpolate(profile.value.campCode)}</p><p class="font-body text-xs text-tertiary/50 mt-1">${ssrInterpolate(unref(t)("profile.qr_subtitle"))}</p></div></div><div class="md:col-span-2 space-y-5"><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4">${ssrInterpolate(unref(t)("profile.personal"))}</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="input-label">${ssrInterpolate(unref(t)("common.name"))}</label>`);
      if (editing.value) {
        _push(`<input${ssrRenderAttr("value", draft.name)} class="input">`);
      } else {
        _push(`<p class="font-body text-tertiary">${ssrInterpolate(profile.value.name)}</p>`);
      }
      _push(`</div><div><label class="input-label">Email</label><p class="font-body text-tertiary">${ssrInterpolate(profile.value.email)}</p></div><div><label class="input-label">Phone</label>`);
      if (editing.value) {
        _push(`<input${ssrRenderAttr("value", draft.phone)} class="input">`);
      } else {
        _push(`<p class="font-body text-tertiary">${ssrInterpolate(profile.value.phone)}</p>`);
      }
      _push(`</div><div><label class="input-label">${ssrInterpolate(unref(t)("common.group"))}</label><p class="font-body text-primary font-semibold">${ssrInterpolate(profile.value.group)}</p></div></div></div><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4">${ssrInterpolate(unref(t)("profile.emergency"))}</h3><div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label class="input-label">Name</label>`);
      if (editing.value) {
        _push(`<input${ssrRenderAttr("value", draft.emergencyContact.name)} class="input">`);
      } else {
        _push(`<p class="font-body text-tertiary">${ssrInterpolate((_a = profile.value.emergencyContact) == null ? void 0 : _a.name)}</p>`);
      }
      _push(`</div><div><label class="input-label">Phone</label>`);
      if (editing.value) {
        _push(`<input${ssrRenderAttr("value", draft.emergencyContact.phone)} class="input">`);
      } else {
        _push(`<p class="font-body text-tertiary">${ssrInterpolate((_b = profile.value.emergencyContact) == null ? void 0 : _b.phone)}</p>`);
      }
      _push(`</div><div><label class="input-label">Relation</label>`);
      if (editing.value) {
        _push(`<input${ssrRenderAttr("value", draft.emergencyContact.relation)} class="input">`);
      } else {
        _push(`<p class="font-body text-tertiary">${ssrInterpolate((_c = profile.value.emergencyContact) == null ? void 0 : _c.relation)}</p>`);
      }
      _push(`</div></div></div><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4">${ssrInterpolate(unref(t)("profile.medical"))}</h3><div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><!--[-->`);
      ssrRenderList(["allergies", "medications", "conditions"], (field) => {
        var _a2;
        _push(`<div><label class="input-label capitalize">${ssrInterpolate(field)}</label>`);
        if (editing.value) {
          _push(`<input${ssrRenderAttr("value", draft.medicalInfo[field])} class="input">`);
        } else {
          _push(`<p class="font-body text-tertiary">${ssrInterpolate((_a2 = profile.value.medicalInfo) == null ? void 0 : _a2[field])}</p>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="card p-6"><h3 class="font-heading font-bold text-primary mb-4">${ssrInterpolate(unref(t)("profile.preferences"))}</h3><div><label class="input-label">Dietary Preference</label>`);
      if (editing.value) {
        _push(`<select class="input"><option${ssrIncludeBooleanAttr(Array.isArray(draft.dietary) ? ssrLooseContain(draft.dietary, null) : ssrLooseEqual(draft.dietary, null)) ? " selected" : ""}>No restrictions</option><option${ssrIncludeBooleanAttr(Array.isArray(draft.dietary) ? ssrLooseContain(draft.dietary, null) : ssrLooseEqual(draft.dietary, null)) ? " selected" : ""}>Vegetarian</option><option${ssrIncludeBooleanAttr(Array.isArray(draft.dietary) ? ssrLooseContain(draft.dietary, null) : ssrLooseEqual(draft.dietary, null)) ? " selected" : ""}>Vegan</option><option${ssrIncludeBooleanAttr(Array.isArray(draft.dietary) ? ssrLooseContain(draft.dietary, null) : ssrLooseEqual(draft.dietary, null)) ? " selected" : ""}>Halal</option><option${ssrIncludeBooleanAttr(Array.isArray(draft.dietary) ? ssrLooseContain(draft.dietary, null) : ssrLooseEqual(draft.dietary, null)) ? " selected" : ""}>Gluten-free</option></select>`);
      } else {
        _push(`<p class="font-body text-tertiary">${ssrInterpolate(profile.value.dietary)}</p>`);
      }
      _push(`</div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-BJ_aaS_X.mjs.map
