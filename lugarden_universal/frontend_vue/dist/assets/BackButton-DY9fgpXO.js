import { A as defineComponent, D as openBlock, F as renderSlot, O as normalizeClass, P as normalizeStyle, Q as toDisplayString, i as __plugin_vue_export_helper_default, s as computed, t as createBaseVNode, v as createCommentVNode, w as createElementBlock, y as createTextVNode } from "./index-I6Qyf-Z2.js";

//#region src/shared/components/BackButton.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = ["disabled", "aria-label"];
const _hoisted_2 = ["width", "height"];
const _hoisted_3 = ["stroke-width", "d"];
var BackButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "BackButton",
	props: {
		text: { default: "返回" },
		showText: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		variant: { default: "default" },
		size: { default: "medium" },
		color: { default: "default" },
		customColor: { default: "" },
		iconPosition: { default: "left" },
		iconSize: { default: 20 },
		strokeWidth: { default: 2 },
		arrowType: { default: "left" },
		block: {
			type: Boolean,
			default: false
		},
		rounded: {
			type: Boolean,
			default: false
		},
		shadow: {
			type: Boolean,
			default: false
		},
		ariaLabel: { default: "返回上一页" },
		rippleEffect: {
			type: Boolean,
			default: false
		},
		hoverAnimation: {
			type: Boolean,
			default: true
		}
	},
	emits: [
		"click",
		"focus",
		"blur"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const buttonClass = computed(() => ({
			[`back-button--${props.variant}`]: true,
			[`back-button--${props.size}`]: true,
			[`back-button--${props.color}`]: props.color !== "custom",
			"text-sm": props.size === "small",
			"text-base": props.size === "medium",
			"text-lg max-md:text-base": props.size === "large",
			"max-md:text-sm": props.size === "medium",
			"back-button--block": props.block,
			"back-button--rounded": props.rounded,
			"back-button--shadow": props.shadow,
			"back-button--disabled": props.disabled,
			"rounded-full": props.rounded && !props.showText,
			"rounded-base": props.rounded && props.showText,
			[`back-button--icon-${props.iconPosition}`]: props.showText,
			"back-button--icon-only": !props.showText,
			"back-button--ripple": props.rippleEffect,
			"back-button--hover-animation": props.hoverAnimation && !props.disabled
		}));
		const buttonStyle = computed(() => {
			const style = {};
			if (props.color === "custom" && props.customColor) {
				style.color = props.customColor;
				style.borderColor = props.customColor;
			}
			return style;
		});
		const iconClass = computed(() => ({ [`back-icon--${props.iconPosition}`]: props.showText }));
		const arrowClass = computed(() => ({ [`back-arrow--${props.arrowType}`]: true }));
		const textClass = computed(() => ({ [`back-text--${props.iconPosition}`]: true }));
		const arrowPath = computed(() => {
			switch (props.arrowType) {
				case "left": return "M15 19l-7-7 7-7";
				case "up": return "M19 15l-7-7-7 7";
				case "chevron-left": return "M15 18l-6-6 6-6";
				case "chevron-up": return "M18 15l-6-6-6 6";
				default: return "M15 19l-7-7 7-7";
			}
		});
		const handleClick = (event) => {
			if (!props.disabled) emit("click", event);
		};
		__expose({
			focus: () => {},
			blur: () => {}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", {
				class: normalizeClass(["back-button inline-flex items-center justify-center gap-sm font-medium", buttonClass.value]),
				style: normalizeStyle(buttonStyle.value),
				disabled: _ctx.disabled,
				onClick: handleClick,
				"aria-label": _ctx.ariaLabel
			}, [createBaseVNode("span", { class: normalizeClass(["back-icon", iconClass.value]) }, [renderSlot(_ctx.$slots, "icon", {}, () => [(openBlock(), createElementBlock("svg", {
				class: normalizeClass(["back-arrow", arrowClass.value]),
				fill: "none",
				stroke: "currentColor",
				viewBox: "0 0 24 24",
				width: _ctx.iconSize,
				height: _ctx.iconSize
			}, [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": _ctx.strokeWidth,
				d: arrowPath.value
			}, null, 8, _hoisted_3)], 10, _hoisted_2))], true)], 2), _ctx.showText ? (openBlock(), createElementBlock("span", {
				key: 0,
				class: normalizeClass(["back-text whitespace-nowrap leading-none", textClass.value])
			}, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(_ctx.text), 1)], true)], 2)) : createCommentVNode("", true)], 14, _hoisted_1);
		};
	}
});

//#endregion
//#region src/shared/components/BackButton.vue
var BackButton_default = /* @__PURE__ */ __plugin_vue_export_helper_default(BackButton_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c576bc1f"]]);

//#endregion
export { BackButton_default as b };