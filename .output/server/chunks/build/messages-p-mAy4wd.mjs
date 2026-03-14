import { ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { a as useI18n, b as useAuthStore, c as useCampersStore } from './server.mjs';
import { defineStore } from 'pinia';
import { Pencil, Send } from 'lucide-vue-next';
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

let msgId = 100;
const SEED_MESSAGES = [
  { id: 1, fromId: 2, toId: 1, subject: "Hey!", body: "Looking forward to camp! Are you excited?", timestamp: "2026-03-01T08:00:00", read: false },
  { id: 2, fromId: 1, toId: 3, subject: "Group activities", body: "Can't wait for the night games! See you there.", timestamp: "2026-03-01T09:30:00", read: true },
  { id: 3, fromId: 4, toId: 1, subject: "Devotion notes", body: "I found today's devotion really meaningful. Here's a verse that spoke to me: Psalm 23:1", timestamp: "2026-03-01T10:00:00", read: false }
];
const useMessagesStore = defineStore("messages", () => {
  const messages2 = ref(SEED_MESSAGES);
  function getInbox(userId) {
    return messages2.value.filter((m) => m.toId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  function getSent(userId) {
    return messages2.value.filter((m) => m.fromId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  function send({ fromId, toId, subject, body }) {
    const msg = { id: ++msgId, fromId, toId, subject, body, timestamp: (/* @__PURE__ */ new Date()).toISOString(), read: false };
    messages2.value.push(msg);
    return msg;
  }
  function markRead(id) {
    const m = messages2.value.find((m2) => m2.id === id);
    if (m) m.read = true;
  }
  function unreadCount(userId) {
    return messages2.value.filter((m) => m.toId === userId && !m.read).length;
  }
  return { messages: messages2, getInbox, getSent, send, markRead, unreadCount };
});
const _sfc_main = {
  __name: "messages",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const auth = useAuthStore();
    const campersStore = useCampersStore();
    const msgStore = useMessagesStore();
    const tab = ref("inbox");
    const selected = ref(null);
    const composeOpen = ref(false);
    const compose = reactive({ toId: null, subject: "", body: "" });
    const messageList = computed(() => tab.value === "inbox" ? msgStore.getInbox(auth.user.id) : msgStore.getSent(auth.user.id));
    const unread = computed(() => msgStore.unreadCount(auth.user.id));
    const otherCampers = computed(() => campersStore.campers.filter((c) => c.id !== auth.user.id));
    function partnerName(msg) {
      var _a;
      const id = tab.value === "inbox" ? msg.fromId : msg.toId;
      return ((_a = campersStore.getCamperById(id)) == null ? void 0 : _a.name) || "Unknown";
    }
    function formatTime(ts) {
      return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark" }, _attrs))} data-v-b1e9d425><div class="container-inner py-10" data-v-b1e9d425><div class="flex items-center justify-between mb-8" data-v-b1e9d425><h1 class="section-title" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.title"))}</h1><button class="btn-primary btn-sm" data-v-b1e9d425>`);
      _push(ssrRenderComponent(unref(Pencil), { class: "w-4 h-4" }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("messages.compose"))}</button></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[60vh]" data-v-b1e9d425><div class="space-y-2" data-v-b1e9d425><div class="flex rounded-xl overflow-hidden border border-primary/10 mb-4" data-v-b1e9d425><button class="${ssrRenderClass([tab.value === "inbox" ? "bg-primary text-secondary" : "text-tertiary/70 hover:bg-primary/10", "flex-1 py-2.5 text-sm font-heading font-semibold transition-all"])}" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.inbox"))} `);
      if (unread.value > 0) {
        _push(`<span class="ml-1.5 badge-danger text-xs px-1.5 py-0" data-v-b1e9d425>${ssrInterpolate(unread.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button class="${ssrRenderClass([tab.value === "sent" ? "bg-primary text-secondary" : "text-tertiary/70 hover:bg-primary/10", "flex-1 py-2.5 text-sm font-heading font-semibold transition-all"])}" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.sent"))}</button></div>`);
      if (messageList.value.length === 0) {
        _push(`<div class="card p-6 text-center" data-v-b1e9d425><p class="font-body text-xs text-tertiary/40" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.no_messages"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(messageList.value, (msg) => {
        var _a;
        _push(`<div class="${ssrRenderClass([((_a = selected.value) == null ? void 0 : _a.id) === msg.id ? "border-primary/50 bg-primary/10" : "hover:border-primary/20", "card p-4 cursor-pointer transition-all duration-200"])}" data-v-b1e9d425><div class="flex items-start justify-between gap-2 mb-1" data-v-b1e9d425><p class="font-heading font-semibold text-sm text-tertiary truncate" data-v-b1e9d425>${ssrInterpolate(partnerName(msg))}</p>`);
        if (!msg.read && tab.value === "inbox") {
          _push(`<span class="badge-danger text-xs px-1.5" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.new_badge"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-xs text-tertiary/30 whitespace-nowrap" data-v-b1e9d425>${ssrInterpolate(formatTime(msg.timestamp))}</span></div><p class="font-body text-xs text-primary font-semibold truncate" data-v-b1e9d425>${ssrInterpolate(msg.subject)}</p><p class="font-body text-xs text-tertiary/50 mt-0.5 truncate" data-v-b1e9d425>${ssrInterpolate(msg.body)}</p></div>`);
      });
      _push(`<!--]--></div><div class="md:col-span-2 card p-6 flex flex-col" data-v-b1e9d425>`);
      if (selected.value) {
        _push(`<div class="flex-1" data-v-b1e9d425><h2 class="font-heading font-bold text-lg text-tertiary mb-1" data-v-b1e9d425>${ssrInterpolate(selected.value.subject)}</h2><p class="font-body text-xs text-tertiary/50 mb-6" data-v-b1e9d425>${ssrInterpolate(tab.value === "inbox" ? "From" : "To")}: ${ssrInterpolate(partnerName(selected.value))} \xB7 ${ssrInterpolate(formatTime(selected.value.timestamp))}</p><p class="font-body text-sm text-tertiary/80 leading-relaxed" data-v-b1e9d425>${ssrInterpolate(selected.value.body)}</p></div>`);
      } else {
        _push(`<div class="flex-1 flex items-center justify-center" data-v-b1e9d425><div class="text-center" data-v-b1e9d425><p class="text-4xl mb-3" data-v-b1e9d425>\u{1F4AC}</p><p class="font-body text-sm text-tertiary/40" data-v-b1e9d425>Select a message to read</p></div></div>`);
      }
      _push(`</div></div></div>`);
      if (composeOpen.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-b1e9d425><div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" data-v-b1e9d425></div><div class="relative card p-8 max-w-lg w-full border-primary/20 space-y-4" data-v-b1e9d425><h3 class="font-heading font-bold text-xl text-primary" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.compose"))}</h3><div data-v-b1e9d425><label class="input-label" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.to"))}</label><select class="input" data-v-b1e9d425><!--[-->`);
        ssrRenderList(otherCampers.value, (c) => {
          _push(`<option${ssrRenderAttr("value", c.id)} data-v-b1e9d425${ssrIncludeBooleanAttr(Array.isArray(compose.toId) ? ssrLooseContain(compose.toId, c.id) : ssrLooseEqual(compose.toId, c.id)) ? " selected" : ""}>${ssrInterpolate(c.avatar)} ${ssrInterpolate(c.name)}</option>`);
        });
        _push(`<!--]--></select></div><div data-v-b1e9d425><label class="input-label" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.subject"))}</label><input${ssrRenderAttr("value", compose.subject)} type="text" class="input" data-v-b1e9d425></div><div data-v-b1e9d425><label class="input-label" data-v-b1e9d425>${ssrInterpolate(unref(t)("messages.body"))}</label><textarea rows="4" class="input resize-none" data-v-b1e9d425>${ssrInterpolate(compose.body)}</textarea></div><div class="flex gap-2" data-v-b1e9d425><button class="btn-ghost btn-sm flex-1" data-v-b1e9d425>${ssrInterpolate(unref(t)("common.cancel"))}</button><button class="btn-primary btn-sm flex-1 justify-center" data-v-b1e9d425>`);
        _push(ssrRenderComponent(unref(Send), { class: "w-4 h-4" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("messages.send"))}</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/messages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const messages = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b1e9d425"]]);

export { messages as default };
//# sourceMappingURL=messages-p-mAy4wd.mjs.map
