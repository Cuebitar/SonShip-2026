import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = {
  __name: "Logo",
  __ssrInlineRender: true,
  props: {
    class: {
      type: String,
      default: "text-xl"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["font-heading w-full", props.class]
      }, _attrs))}><span class="font-[&#39;Times_New_Roman&#39;,serif] text-primary italic font-medium mr-[-3px] text-[1.125em]">son</span><span class="text-tertiary drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)] font-black text-[1em]">ship<span class="font-[&#39;Times_New_Roman&#39;,serif]">.</span></span></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Logo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Logo-CqjBTFPY.mjs.map
