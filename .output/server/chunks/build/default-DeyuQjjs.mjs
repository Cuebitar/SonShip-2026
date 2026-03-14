import { _ as __nuxt_component_0$1 } from './nuxt-link-D22nWayR.mjs';
import { computed, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext, ref, createVNode, resolveDynamicComponent, openBlock, createBlock } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderVNode } from 'vue/server-renderer';
import { e as useRoute, a as useI18n, b as useAuthStore, d as useRouter } from './server.mjs';
import { _ as _sfc_main$3 } from './Logo-CqjBTFPY.mjs';
import { F as Firelight } from './firelight-_F5Nxwhz.mjs';
import { ChevronDown, LayoutDashboard, User, Users, Gamepad2, MessageCircle, Mail, Calendar, Image, LogOut, Menu, X } from 'lucide-vue-next';
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

const _sfc_main$2 = {
  __name: "AppNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale, setLocale } = useI18n();
    const auth = useAuthStore();
    useRouter();
    const scrolled = ref(false);
    const mobileOpen = ref(false);
    const showDropdown = ref(false);
    ref(null);
    const publicLinks = [
      { to: "/", label: "nav.home" },
      { to: "/about", label: "nav.about" },
      { to: "/register", label: "nav.register" }
    ];
    const authLinks = [
      { to: "/dashboard", label: "nav.dashboard" },
      { to: "/schedule", label: "nav.schedule" },
      { to: "/gallery", label: "nav.gallery" }
    ];
    const isCamp = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const campStart = /* @__PURE__ */ new Date("2026-08-29 00:00:00");
      return now >= campStart;
    });
    const navLinks = computed(() => auth.isLoggedIn ? [...publicLinks.slice(0, 2), ...authLinks] : publicLinks);
    const mobileExtra = computed(() => auth.isLoggedIn ? [
      { to: "/profile", label: "nav.profile" },
      { to: "/friends", label: "nav.friends" },
      { to: "/games", label: "nav.games" },
      { to: "/messages", label: "nav.messages" },
      { to: "/letters", label: "nav.letters" }
    ] : []);
    const userMenu = [
      { to: "/dashboard", label: "nav.dashboard", icon: LayoutDashboard },
      { to: "/profile", label: "nav.profile", icon: User },
      { to: "/friends", label: "nav.friends", icon: Users },
      { to: "/games", label: "nav.games", icon: Gamepad2 },
      { to: "/messages", label: "nav.messages", icon: MessageCircle },
      { to: "/letters", label: "nav.letters", icon: Mail },
      { to: "/schedule", label: "nav.schedule", icon: Calendar },
      { to: "/gallery", label: "nav.gallery", icon: Image }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: ["fixed top-0 left-0 right-0 z-50 h-16 border-b border-primary/10", scrolled.value ? "bg-dark/95 backdrop-blur-xl shadow-dark" : "bg-transparent"]
      }, _attrs))} data-v-5746602b><div class="container-inner h-full flex items-center justify-between" data-v-5746602b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(Firelight))} class="w-8 h-8" alt="Firelight" data-v-5746602b${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, { size: "xl" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("img", {
                src: unref(Firelight),
                class: "w-8 h-8",
                alt: "Firelight"
              }, null, 8, ["src"]),
              createVNode(_sfc_main$3, { size: "xl" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center gap-1" data-v-5746602b><!--[-->`);
      ssrRenderList(navLinks.value, (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.to,
          to: link.to,
          class: ["nav-link px-3 py-1.5 rounded-xl hover:bg-primary/10 transition-all", { "nav-link-active bg-primary/10": _ctx.$route.path === link.to }],
          "aria-label": unref(t)(link.label),
          title: unref(t)(link.label)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)(link.label))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)(link.label)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="hidden md:flex items-center gap-3" data-v-5746602b><button class="btn-ghost btn-sm font-heading text-xs px-3 py-1.5 rounded-md" data-v-5746602b>${ssrInterpolate(unref(locale) === "en" ? "\u4E2D\u6587" : "EN")}</button>`);
      if (!unref(auth).isLoggedIn && isCamp.value) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/register",
          class: "btn-ghost btn-sm rounded-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("nav.register"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("nav.register")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "btn-primary btn-sm rounded-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("nav.login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("nav.login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else if (unref(auth).isLoggedIn) {
        _push(`<div class="relative" data-v-5746602b><button class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all" data-v-5746602b><span class="text-lg" data-v-5746602b>${ssrInterpolate((_a = unref(auth).user) == null ? void 0 : _a.avatar)}</span><span class="font-heading font-semibold text-sm text-primary" data-v-5746602b>${ssrInterpolate((_b = unref(auth).user) == null ? void 0 : _b.name.split(" ")[0])}</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-3.5 h-3.5 text-primary/60" }, null, _parent));
        _push(`</button>`);
        if (showDropdown.value) {
          _push(`<div class="absolute right-0 top-full mt-2 w-48 card border border-primary/20 py-1.5 shadow-warm-lg" data-v-5746602b><!--[-->`);
          ssrRenderList(userMenu, (item) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: item.to,
              to: item.to,
              onClick: ($event) => showDropdown.value = false,
              class: "flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-tertiary/80 hover:text-primary hover:bg-primary/10 transition-all"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { class: "w-4 h-4" }, null), _parent2, _scopeId);
                  _push2(` ${ssrInterpolate(unref(t)(item.label))}`);
                } else {
                  return [
                    (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "w-4 h-4" })),
                    createTextVNode(" " + toDisplayString(unref(t)(item.label)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--><div class="divider my-1.5 mx-3" data-v-5746602b></div><button class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-red-400 hover:bg-red-500/10 transition-all" data-v-5746602b>`);
          _push(ssrRenderComponent(unref(LogOut), { class: "w-4 h-4" }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("nav.logout"))}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="md:hidden btn-ghost btn-icon p-2" data-v-5746602b>`);
      if (!mobileOpen.value) {
        _push(ssrRenderComponent(unref(Menu), { class: "w-5 h-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
      }
      _push(`</button></div>`);
      if (mobileOpen.value) {
        _push(`<div class="md:hidden absolute top-16 left-0 right-0 bg-dark/98 backdrop-blur-xl border-b border-primary/10 py-4 px-4 space-y-1" data-v-5746602b><!--[-->`);
        ssrRenderList([...navLinks.value, ...mobileExtra.value], (link) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: link.to,
            to: link.to,
            onClick: ($event) => mobileOpen.value = false,
            class: "block nav-link px-4 py-3 rounded-xl hover:bg-primary/10 transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)(link.label))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)(link.label)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--><div class="divider" data-v-5746602b></div><div class="flex gap-2 pt-1" data-v-5746602b><button class="btn-ghost btn-sm flex-1" data-v-5746602b>${ssrInterpolate(unref(locale) === "en" ? "\u4E2D\u6587" : "EN")}</button>`);
        if (!unref(auth).isLoggedIn && isCamp.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/login",
            onClick: ($event) => mobileOpen.value = false,
            class: "btn-primary btn-sm flex-1 text-center"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("nav.login"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("nav.login")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else if (unref(auth).isLoggedIn) {
          _push(`<button class="btn-danger btn-sm flex-1" data-v-5746602b>${ssrInterpolate(unref(t)("nav.logout"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppNavbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5746602b"]]);
const _sfc_main$1 = {
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const quickLinks = [
      { to: "/", label: t("nav.home") },
      { to: "/about", label: t("nav.about") },
      { to: "/register", label: t("nav.register") },
      { to: "/login", label: t("nav.login") },
      { to: "/admin/registrations", label: "Admin (Registrations)" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-secondary/50 border-t border-primary/10 py-12 mt-0" }, _attrs))}><div class="container-inner"><div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"><div><div class="flex items-center gap-2 mb-3"><span class="text-2xl">\u{1F525}</span>`);
      _push(ssrRenderComponent(_sfc_main$3, { class: "text-xl md:text-2xl" }, null, _parent));
      _push(`</div><p class="font-body text-sm text-tertiary/60 leading-relaxed max-w-xs">${ssrInterpolate(unref(t)("home.hero_subtitle"))}</p></div><div><h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">${ssrInterpolate(unref(t)("footer.quick_links"))}</h4><ul class="space-y-2"><!--[-->`);
      ssrRenderList(quickLinks, (link) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "font-body text-sm text-tertiary/60 hover:text-primary transition-colors",
          "aria-label": link.label,
          title: link.label
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">${ssrInterpolate(unref(t)("footer.camp_info"))}</h4><ul class="space-y-2 font-body text-sm text-tertiary/60"><li class="flex items-center gap-2"><span>\u{1F4C5}</span> August 28\u201331, 2026</li><li class="flex items-center gap-2"><span>\u{1F4CD}</span> Radiant Retreats Site B, Jalan Utama Janda Baik, Kampung Chemperoh, 28750 Bentong, Pahang</li><li class="flex items-center gap-2"><span>\u2709\uFE0F</span> sonship2026@megasubangcmc.org.my</li></ul></div></div><div class="divider"></div><div class="flex flex-col items-center justify-between gap-3 text-xs font-body text-tertiary/40"><p>\xA9 2026 SonShip Camp. Made with \u2764\uFE0F for the Kingdom.</p><p>${ssrInterpolate(unref(t)("home.hero_tagline"))}</p></div></div></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const showFooter = computed(() => route.path !== "/login" && route.path !== "/register");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppNavbar = __nuxt_component_0;
      const _component_AppFooter = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_AppNavbar, null, null, _parent));
      _push(`<main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (unref(showFooter)) {
        _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DeyuQjjs.mjs.map
