import { A as defineComponent, D as openBlock, E as renderList, P as normalizeStyle, Q as toDisplayString, i as __plugin_vue_export_helper_default, q as Fragment, t as createBaseVNode, w as createElementBlock, y as createTextVNode } from "./index-I6Qyf-Z2.js";

//#region src/modules/zhou/components/QuestionCard.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "max-w-4xl mx-auto" };
const _hoisted_2 = {
	class: "unified-content-card card-padding-normal content-spacing-normal rounded-base animate-fadeInUp",
	style: {
		"padding-top": "6rem",
		"padding-bottom": "2.5rem"
	}
};
const _hoisted_3 = {
	class: "flex flex-col gap-4 sm:gap-6 md:gap-8",
	style: { "margin-top": "5rem" }
};
const _hoisted_4 = ["onClick", "disabled"];
const _hoisted_5 = { class: "font-bold mr-2" };
var QuestionCard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "QuestionCard",
	props: {
		question: {},
		questionIndex: {},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ["answer"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const handleAnswer = (option) => {
			if (props.disabled) return;
			emit("answer", option);
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [(openBlock(), createElementBlock("div", {
				class: "text-heading-spaced text-center animate-textChange",
				key: _ctx.questionIndex
			}, toDisplayString(_ctx.question.question), 1)), createBaseVNode("div", _hoisted_3, [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.question.options, (option, key) => {
				return openBlock(), createElementBlock("button", {
					key,
					class: "btn-option text-left justify-start whitespace-normal text-body px-6 py-4 max-sm:px-4 max-sm:py-3 animate-fadeInUp",
					style: normalizeStyle({ animationDelay: `${.3 + (key === "A" ? 0 : .1)}s` }),
					onClick: ($event) => handleAnswer(key),
					disabled: _ctx.disabled
				}, [createBaseVNode("span", _hoisted_5, toDisplayString(key) + ".", 1), createTextVNode(" " + toDisplayString(option), 1)], 12, _hoisted_4);
			}), 128))])])]);
		};
	}
});

//#endregion
//#region src/modules/zhou/components/QuestionCard.vue
var QuestionCard_default = /* @__PURE__ */ __plugin_vue_export_helper_default(QuestionCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-33a12d65"]]);

//#endregion
export { QuestionCard_default as b };