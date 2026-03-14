import { ref, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { a as useI18n, c as useCampersStore } from './server.mjs';
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
  __name: "registrations",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const tabs = ["All", "Pending", "Approved", "Rejected"];
    const activeTab = ref("All");
    const filterGroup = ref("All");
    const filterRoom = ref("All");
    const campersStore = useCampersStore();
    console.log(campersStore.campers, 12333);
    const records = computed(
      () => campersStore.campers.map((c, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const secretAngel = campersStore.getCamperById(c.secretAngelTargetId);
        const hour = (8 + index % 10).toString().padStart(2, "0");
        const minute = (index * 13 % 60).toString().padStart(2, "0");
        const day = (1 + index % 15).toString().padStart(2, "0");
        const registrationTime = `2026-08-${day} ${hour}:${minute}`;
        return {
          id: c.id,
          fullName: c.name,
          ic: c.ic,
          phone: c.phone,
          email: c.email,
          gender: c.gender,
          transportation: c.transportation,
          // importantInfo: c.medicalInfo?.allergies !== 'None' ? c.medicalInfo?.allergies : 'None',
          emergencyContactName: ((_a = c.emergencyContact) == null ? void 0 : _a.name) || "",
          emergencyContactPhone: ((_b = c.emergencyContact) == null ? void 0 : _b.phone) || "",
          emergencyContactRelationship: ((_d = (_c = c.emergencyContact) == null ? void 0 : _c.relation) == null ? void 0 : _d.toLowerCase()) || "parent",
          q1: (_f = (_e = c.questions) == null ? void 0 : _e.place) != null ? _f : "",
          q2: (_h = (_g = c.questions) == null ? void 0 : _g.verse) != null ? _h : "",
          q3: (_j = (_i = c.questions) == null ? void 0 : _i.pain) != null ? _j : "",
          status: c.status != "3" ? "Pending" : "Approved",
          secretIdentity: c.secret_identity,
          secretAngel: secretAngel ? secretAngel.name : "",
          iceBreakingTarget: "Liam Chen",
          group: c.group || "",
          roomNumber: `R${100 + c.id}`,
          registrationTime
        };
      })
    );
    const availableGroups = computed(() => {
      const groups = new Set(records.value.map((r) => r.group).filter(Boolean));
      return Array.from(groups).sort();
    });
    const availableRooms = computed(() => {
      const rooms = new Set(records.value.map((r) => r.roomNumber).filter(Boolean));
      return Array.from(rooms).sort();
    });
    const filteredRecords = computed(() => {
      return records.value.filter((r) => {
        const matchTab = activeTab.value === "All" || r.status === activeTab.value;
        const matchGroup = filterGroup.value === "All" || r.group === filterGroup.value;
        const matchRoom = filterRoom.value === "All" || r.roomNumber === filterRoom.value;
        return matchTab && matchGroup && matchRoom;
      });
    });
    const recordOptions = computed(() => {
      if (!selectedRecord.value) return [];
      return records.value.filter((r) => r.id !== selectedRecord.value.id);
    });
    const selectedRecord = ref(null);
    const editForm = reactive({
      status: "",
      group: "",
      roomNumber: "",
      transportation: "",
      secretIdentity: "",
      secretAngel: "",
      iceBreakingTarget: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container bg-dark min-h-screen pb-16" }, _attrs))} data-v-a8b46cca><section class="py-12 bg-gradient-dark relative overflow-hidden border-b border-white/10" data-v-a8b46cca><div class="container-inner relative z-10" data-v-a8b46cca><h1 class="font-heading font-black text-3xl md:text-4xl text-primary mb-2" data-v-a8b46cca>Registration Dashboard</h1><p class="font-body text-tertiary" data-v-a8b46cca>Manage all camp registrations</p></div></section><section class="container-inner mt-8" data-v-a8b46cca><div class="flex flex-col gap-4 mb-6" data-v-a8b46cca><div class="flex flex-wrap gap-2" data-v-a8b46cca><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "px-4 py-2 rounded-full font-heading text-sm font-bold transition-all",
          activeTab.value === tab ? "bg-primary text-dark" : "bg-white/5 text-tertiary hover:bg-white/10"
        ])}" data-v-a8b46cca>${ssrInterpolate(tab)}</button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap gap-4" data-v-a8b46cca><div class="flex items-center gap-2" data-v-a8b46cca><label class="text-xs font-bold text-primary" data-v-a8b46cca>Group:</label><select class="input py-1.5 px-3 text-sm bg-dark/50 border-white/10 w-40" data-v-a8b46cca><option value="All" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(filterGroup.value) ? ssrLooseContain(filterGroup.value, "All") : ssrLooseEqual(filterGroup.value, "All")) ? " selected" : ""}>All Groups</option><!--[-->`);
      ssrRenderList(availableGroups.value, (group) => {
        _push(`<option${ssrRenderAttr("value", group)} data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(filterGroup.value) ? ssrLooseContain(filterGroup.value, group) : ssrLooseEqual(filterGroup.value, group)) ? " selected" : ""}>${ssrInterpolate(group)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex items-center gap-2" data-v-a8b46cca><label class="text-xs font-bold text-primary" data-v-a8b46cca>Room:</label><select class="input py-1.5 px-3 text-sm bg-dark/50 border-white/10 w-40" data-v-a8b46cca><option value="All" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(filterRoom.value) ? ssrLooseContain(filterRoom.value, "All") : ssrLooseEqual(filterRoom.value, "All")) ? " selected" : ""}>All Rooms</option><!--[-->`);
      ssrRenderList(availableRooms.value, (room) => {
        _push(`<option${ssrRenderAttr("value", room)} data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(filterRoom.value) ? ssrLooseContain(filterRoom.value, room) : ssrLooseEqual(filterRoom.value, room)) ? " selected" : ""}>${ssrInterpolate(room)}</option>`);
      });
      _push(`<!--]--></select></div></div></div><div class="card overflow-x-auto" data-v-a8b46cca><table class="w-full text-left border-collapse min-w-[800px]" data-v-a8b46cca><thead data-v-a8b46cca><tr class="border-b border-white/10 bg-white/5" data-v-a8b46cca><th class="p-4 font-heading text-primary font-bold text-sm" data-v-a8b46cca>Name</th><th class="p-4 font-heading text-primary font-bold text-sm" data-v-a8b46cca>Date</th><th class="p-4 font-heading text-primary font-bold text-sm" data-v-a8b46cca>Gender</th><th class="p-4 font-heading text-primary font-bold text-sm" data-v-a8b46cca>Group</th><th class="p-4 font-heading text-primary font-bold text-sm" data-v-a8b46cca>Room</th><th class="p-4 font-heading text-primary font-bold text-sm" data-v-a8b46cca>Status</th><th class="p-4 font-heading text-primary font-bold text-sm text-right" data-v-a8b46cca>Actions</th></tr></thead><tbody data-v-a8b46cca><!--[-->`);
      ssrRenderList(filteredRecords.value, (record) => {
        _push(`<tr class="border-b border-white/5 hover:bg-white/5 transition-colors" data-v-a8b46cca><td class="p-4" data-v-a8b46cca><div class="font-bold text-white" data-v-a8b46cca>${ssrInterpolate(record.fullName)}</div><div class="text-xs text-tertiary/70" data-v-a8b46cca>${ssrInterpolate(record.phone)}</div></td><td class="p-4 text-tertiary text-sm" data-v-a8b46cca>${ssrInterpolate(record.registrationTime)}</td><td class="p-4 text-tertiary text-sm capitalize" data-v-a8b46cca>${ssrInterpolate(record.gender)}</td><td class="p-4 text-tertiary text-sm" data-v-a8b46cca>${ssrInterpolate(record.group || "-")}</td><td class="p-4 text-tertiary text-sm" data-v-a8b46cca>${ssrInterpolate(record.roomNumber || "-")}</td><td class="p-4" data-v-a8b46cca><span class="${ssrRenderClass([
          "px-2 py-1 rounded text-xs font-bold inline-block",
          record.status === "Approved" ? "bg-green-500/20 text-green-400" : record.status === "Rejected" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
        ])}" data-v-a8b46cca>${ssrInterpolate(record.status)}</span></td><td class="p-4 text-right" data-v-a8b46cca><button class="btn-primary py-1.5 px-3 text-xs w-auto min-w-0" data-v-a8b46cca> View / Edit </button></td></tr>`);
      });
      _push(`<!--]-->`);
      if (filteredRecords.value.length === 0) {
        _push(`<tr data-v-a8b46cca><td colspan="6" class="p-8 text-center text-tertiary" data-v-a8b46cca>No records found.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></section>`);
      if (selectedRecord.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" data-v-a8b46cca><div class="absolute inset-0 bg-dark/80 backdrop-blur-sm" data-v-a8b46cca></div><div class="relative card max-h-[90vh] overflow-y-auto w-full max-w-4xl p-0 flex flex-col shadow-2xl border-primary/30" data-v-a8b46cca><div class="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark/95 backdrop-blur z-10" data-v-a8b46cca><div data-v-a8b46cca><h3 class="font-heading font-black text-2xl text-primary" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.fullName)}</h3><p class="text-sm text-tertiary mt-1" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.email)} \u2022 ${ssrInterpolate(selectedRecord.value.ic)}</p></div><button class="text-tertiary hover:text-white p-2 text-2xl leading-none" data-v-a8b46cca>\xD7</button></div><div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8" data-v-a8b46cca><div class="space-y-6" data-v-a8b46cca><div data-v-a8b46cca><h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2" data-v-a8b46cca>Registration Details</h4><div class="space-y-3 text-sm" data-v-a8b46cca><div class="flex flex-col" data-v-a8b46cca><span class="text-tertiary/70 text-xs" data-v-a8b46cca>Reg. Time</span> <span class="text-white font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.registrationTime)}</span></div><div class="flex flex-col" data-v-a8b46cca><span class="text-tertiary/70 text-xs" data-v-a8b46cca>Gender</span> <span class="text-white capitalize font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.gender)}</span></div><div class="flex flex-col" data-v-a8b46cca><span class="text-tertiary/70 text-xs" data-v-a8b46cca>Phone</span> <span class="text-white font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.phone)}</span></div><div class="flex flex-col" data-v-a8b46cca><span class="text-tertiary/70 text-xs" data-v-a8b46cca>Important Info</span> <span class="text-white font-medium bg-white/5 p-2 rounded mt-1" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.importantInfo || "None")}</span></div></div></div><div data-v-a8b46cca><h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2" data-v-a8b46cca>Emergency Contact</h4><div class="space-y-3 text-sm" data-v-a8b46cca><div class="flex flex-col" data-v-a8b46cca><span class="text-tertiary/70 text-xs" data-v-a8b46cca>Name</span> <span class="text-white font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.emergencyContactName)}</span></div><div class="flex flex-col" data-v-a8b46cca><span class="text-tertiary/70 text-xs" data-v-a8b46cca>Phone</span> <span class="text-white font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.emergencyContactPhone)}</span></div><div class="flex flex-col" data-v-a8b46cca><span class="text-tertiary/70 text-xs" data-v-a8b46cca>Relationship</span> <span class="text-white capitalize font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.emergencyContactRelationship)}</span></div></div></div><div data-v-a8b46cca><h4 class="font-heading font-bold text-primary mb-3 text-sm uppercase tracking-widest border-b border-primary/20 pb-2" data-v-a8b46cca>Questions</h4><div class="space-y-3 text-sm" data-v-a8b46cca><div class="bg-white/5 p-3 rounded" data-v-a8b46cca><p class="text-tertiary/70 text-xs mb-1" data-v-a8b46cca>${ssrInterpolate(unref(t)("questions.q1"))}</p><p class="text-white font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.q1 || "-")}</p></div><div class="bg-white/5 p-3 rounded" data-v-a8b46cca><p class="text-tertiary/70 text-xs mb-1" data-v-a8b46cca>${ssrInterpolate(unref(t)("questions.q2"))}</p><p class="text-white font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.q2 || "-")}</p></div><div class="bg-white/5 p-3 rounded" data-v-a8b46cca><p class="text-tertiary/70 text-xs mb-1" data-v-a8b46cca>${ssrInterpolate(unref(t)("questions.q3"))}</p><p class="text-white font-medium" data-v-a8b46cca>${ssrInterpolate(selectedRecord.value.q3 || "-")}</p></div></div></div></div><div class="space-y-5 bg-primary/5 p-6 rounded-xl border border-primary/20" data-v-a8b46cca><h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-widest border-b border-primary/20 pb-2" data-v-a8b46cca>Admin Controls</h4><div class="grid grid-cols-2 gap-4" data-v-a8b46cca><div class="col-span-2" data-v-a8b46cca><label class="block text-xs font-bold text-primary/80 mb-1" data-v-a8b46cca>Status</label><select class="input py-2 bg-dark/50" data-v-a8b46cca><option value="Pending" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.status) ? ssrLooseContain(editForm.status, "Pending") : ssrLooseEqual(editForm.status, "Pending")) ? " selected" : ""}>Pending</option><option value="Approved" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.status) ? ssrLooseContain(editForm.status, "Approved") : ssrLooseEqual(editForm.status, "Approved")) ? " selected" : ""}>Approved</option><option value="Rejected" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.status) ? ssrLooseContain(editForm.status, "Rejected") : ssrLooseEqual(editForm.status, "Rejected")) ? " selected" : ""}>Rejected</option></select></div><div data-v-a8b46cca><label class="block text-xs font-bold text-primary/80 mb-1" data-v-a8b46cca>Group</label><input${ssrRenderAttr("value", editForm.group)} type="text" class="input py-2 bg-dark/50" placeholder="e.g. Eagles" data-v-a8b46cca></div><div data-v-a8b46cca><label class="block text-xs font-bold text-primary/80 mb-1" data-v-a8b46cca>Room Number</label><input${ssrRenderAttr("value", editForm.roomNumber)} type="text" class="input py-2 bg-dark/50" placeholder="e.g. A101" data-v-a8b46cca></div><div class="col-span-2" data-v-a8b46cca><label class="block text-xs font-bold text-primary/80 mb-1" data-v-a8b46cca>Transportation</label><select class="input py-2 bg-dark/50" data-v-a8b46cca><option value="car" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.transportation) ? ssrLooseContain(editForm.transportation, "car") : ssrLooseEqual(editForm.transportation, "car")) ? " selected" : ""}>Car</option><option value="bus" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.transportation) ? ssrLooseContain(editForm.transportation, "bus") : ssrLooseEqual(editForm.transportation, "bus")) ? " selected" : ""}>Bus</option></select></div><div class="col-span-2" data-v-a8b46cca><label class="block text-xs font-bold text-primary/80 mb-1" data-v-a8b46cca>Secret Identity</label><input${ssrRenderAttr("value", editForm.secretIdentity)} type="text" class="input py-2 bg-dark/50" placeholder="e.g. The Flame Keeper" data-v-a8b46cca></div><div class="col-span-2" data-v-a8b46cca><label class="block text-xs font-bold text-primary/80 mb-1" data-v-a8b46cca>Secret Angel Target</label><select class="input py-2 bg-dark/50" data-v-a8b46cca><option value="" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.secretAngel) ? ssrLooseContain(editForm.secretAngel, "") : ssrLooseEqual(editForm.secretAngel, "")) ? " selected" : ""}>None</option><!--[-->`);
        ssrRenderList(recordOptions.value, (user) => {
          _push(`<option${ssrRenderAttr("value", user.fullName)} data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.secretAngel) ? ssrLooseContain(editForm.secretAngel, user.fullName) : ssrLooseEqual(editForm.secretAngel, user.fullName)) ? " selected" : ""}>${ssrInterpolate(user.fullName)}</option>`);
        });
        _push(`<!--]--></select></div><div class="col-span-2" data-v-a8b46cca><label class="block text-xs font-bold text-primary/80 mb-1" data-v-a8b46cca>Ice Breaking Target</label><select class="input py-2 bg-dark/50" data-v-a8b46cca><option value="" data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.iceBreakingTarget) ? ssrLooseContain(editForm.iceBreakingTarget, "") : ssrLooseEqual(editForm.iceBreakingTarget, "")) ? " selected" : ""}>None</option><!--[-->`);
        ssrRenderList(recordOptions.value, (user) => {
          _push(`<option${ssrRenderAttr("value", user.fullName)} data-v-a8b46cca${ssrIncludeBooleanAttr(Array.isArray(editForm.iceBreakingTarget) ? ssrLooseContain(editForm.iceBreakingTarget, user.fullName) : ssrLooseEqual(editForm.iceBreakingTarget, user.fullName)) ? " selected" : ""}>${ssrInterpolate(user.fullName)}</option>`);
        });
        _push(`<!--]--></select></div></div></div></div><div class="p-6 border-t border-white/10 flex justify-end gap-4 sticky bottom-0 bg-dark/95 backdrop-blur" data-v-a8b46cca><button class="px-4 py-2 font-bold text-tertiary hover:text-white transition-colors" data-v-a8b46cca>Cancel</button><button class="btn-primary w-auto min-w-0 px-6" data-v-a8b46cca>Save Changes</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/registrations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const registrations = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a8b46cca"]]);

export { registrations as default };
//# sourceMappingURL=registrations-BrG6inFI.mjs.map
