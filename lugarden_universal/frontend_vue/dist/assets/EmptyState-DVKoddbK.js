import { A as defineComponent, D as openBlock, F as renderSlot, H as resolveDynamicComponent, O as normalizeClass, Q as toDisplayString, i as __plugin_vue_export_helper_default, s as computed, t as createBaseVNode, u as createBlock, v as createCommentVNode, w as createElementBlock } from "./index-I6Qyf-Z2.js";

//#region node_modules/@heroicons/vue/24/outline/esm/PencilIcon.js
function render(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		viewBox: "0 0 24 24",
		"stroke-width": "1.5",
		stroke: "currentColor",
		"aria-hidden": "true",
		"data-slot": "icon"
	}, [createBaseVNode("path", {
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
	})]);
}

//#endregion
//#region src/shared/components/EmptyState.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "empty-content animate-fadeIn max-w-sm w-full card-padding-normal content-spacing-normal" };
const _hoisted_2 = { class: "mb-lg" };
const _hoisted_3 = {
	key: 0,
	class: "text-6xl mb-base opacity-60"
};
const _hoisted_4 = { key: 1 };
const _hoisted_5 = { class: "text-heading-spaced text-gray-700" };
const _hoisted_6 = {
	key: 0,
	class: "text-body-spaced text-gray-600"
};
const _hoisted_7 = {
	key: 1,
	class: "mb-base"
};
const _hoisted_8 = ["disabled"];
const _hoisted_9 = { key: 0 };
const _hoisted_10 = { key: 1 };
const _hoisted_11 = {
	key: 2,
	class: "mt-base"
};
var EmptyState_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "EmptyState",
	props: {
		icon: { default: "" },
		iconComponent: { default: render },
		title: { default: "暂无内容" },
		description: { default: "" },
		actionText: { default: "" },
		actionLoadingText: { default: "处理中..." },
		actionLoading: {
			type: Boolean,
			default: false
		},
		showAction: {
			type: Boolean,
			default: false
		},
		size: { default: "medium" },
		variant: { default: "default" },
		centered: {
			type: Boolean,
			default: true
		}
	},
	emits: ["action"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const containerClass = computed(() => ({
			[`empty-${props.size}`]: true,
			[`empty-${props.variant}`]: true,
			"empty-centered": props.centered,
			"rounded-lg": true
		}));
		const handleAction = () => {
			if (!props.actionLoading) emit("action");
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["empty-state flex items-center justify-center text-center", containerClass.value]) }, [createBaseVNode("div", _hoisted_1, [
				createBaseVNode("div", _hoisted_2, [!_ctx.$slots.icon ? (openBlock(), createElementBlock("div", _hoisted_3, [_ctx.iconComponent ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.iconComponent), {
					key: 0,
					class: "w-6 h-6 mx-auto",
					"aria-hidden": "true"
				})) : (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(_ctx.icon), 1))])) : createCommentVNode("", true), renderSlot(_ctx.$slots, "icon", {}, void 0, true)]),
				createBaseVNode("h3", _hoisted_5, toDisplayString(_ctx.title), 1),
				_ctx.description ? (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(_ctx.description), 1)) : createCommentVNode("", true),
				_ctx.showAction || _ctx.$slots.action ? (openBlock(), createElementBlock("div", _hoisted_7, [renderSlot(_ctx.$slots, "action", {}, () => [_ctx.actionText ? (openBlock(), createElementBlock("button", {
					key: 0,
					onClick: handleAction,
					class: "btn-primary min-w-[120px]",
					disabled: _ctx.actionLoading
				}, [_ctx.actionLoading ? (openBlock(), createElementBlock("span", _hoisted_9, toDisplayString(_ctx.actionLoadingText), 1)) : (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString(_ctx.actionText), 1))], 8, _hoisted_8)) : createCommentVNode("", true)], true)])) : createCommentVNode("", true),
				_ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_11, [renderSlot(_ctx.$slots, "extra", {}, void 0, true)])) : createCommentVNode("", true)
			])], 2);
		};
	}
});

//#endregion
//#region src/shared/components/EmptyState.vue
var EmptyState_default = /* @__PURE__ */ __plugin_vue_export_helper_default(EmptyState_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6e5ada8c"]]);

//#endregion
export { EmptyState_default as b, render as c };