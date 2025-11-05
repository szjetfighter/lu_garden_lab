import { A as defineComponent, D as openBlock, P as normalizeStyle, Q as toDisplayString, i as __plugin_vue_export_helper_default, s as computed, t as createBaseVNode, v as createCommentVNode, w as createElementBlock } from "./index-I6Qyf-Z2.js";

//#region src/modules/zhou/components/ClassicalEchoDisplay.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "max-w-3xl mx-auto" };
const _hoisted_2 = {
	key: 0,
	class: "unified-content-card card-padding-normal content-spacing-normal rounded-base"
};
const _hoisted_3 = {
	key: 0,
	class: "text-heading-spaced text-center font-bold italic tracking-wide"
};
const _hoisted_4 = {
	key: 1,
	class: "text-body-spaced font-semibold italic text-gray-700"
};
const _hoisted_5 = {
	key: 2,
	class: "text-body text-gray-700 text-justify"
};
const _hoisted_6 = {
	key: 1,
	class: "text-center card-padding-normal content-spacing-normal bg-white/40 backdrop-blur-[10px] border border-white/30 text-gray-600 rounded-base"
};
const _hoisted_7 = { class: "text-body italic" };
var ClassicalEchoDisplay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ClassicalEchoDisplay",
	props: {
		quoteText: { default: null },
		quoteCitation: { default: null },
		classicalEcho: { default: null },
		contentAnimationDelay: { default: "0.1s" },
		emptyMessage: { default: "古典智慧与现代诗歌的对话，需要更多的时间来沉淀..." }
	},
	setup(__props) {
		const props = __props;
		const hasAnyContent = computed(() => {
			return !!(props.quoteText || props.quoteCitation || props.classicalEcho);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [_cache[1] || (_cache[1] = createBaseVNode("div", { class: "text-center animate-fadeInUp" }, [createBaseVNode("h2", { class: "text-heading-spaced" }, " 你选择的道路，有古人智慧的回响 ")], -1)), createBaseVNode("div", {
				class: "mt-3xl mb-3xl animate-fadeInUp",
				style: normalizeStyle({ animationDelay: _ctx.contentAnimationDelay })
			}, [hasAnyContent.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
				_ctx.quoteCitation ? (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(_ctx.quoteCitation), 1)) : createCommentVNode("", true),
				_ctx.quoteText ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(_ctx.quoteText), 1)) : createCommentVNode("", true),
				_ctx.classicalEcho ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(_ctx.classicalEcho), 1)) : createCommentVNode("", true)
			])) : createCommentVNode("", true), !hasAnyContent.value ? (openBlock(), createElementBlock("div", _hoisted_6, [_cache[0] || (_cache[0] = createBaseVNode("div", { class: "text-5xl mb-base opacity-70" }, "🏮", -1)), createBaseVNode("p", _hoisted_7, toDisplayString(_ctx.emptyMessage), 1)])) : createCommentVNode("", true)], 4)]);
		};
	}
});

//#endregion
//#region src/modules/zhou/components/ClassicalEchoDisplay.vue
var ClassicalEchoDisplay_default = /* @__PURE__ */ __plugin_vue_export_helper_default(ClassicalEchoDisplay_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3a7a21ee"]]);

//#endregion
export { ClassicalEchoDisplay_default as b };