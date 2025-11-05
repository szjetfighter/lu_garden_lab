import { A as defineComponent, D as openBlock, F as renderSlot, M as ref, N as unref, O as normalizeClass, P as normalizeStyle, Q as toDisplayString, i as __plugin_vue_export_helper_default, p as withModifiers, s as computed, t as createBaseVNode, v as createCommentVNode, w as createElementBlock, y as createTextVNode, z as createVNode } from "./index-I6Qyf-Z2.js";
import { b as render } from "./ExclamationTriangleIcon-DPnftkPl.js";
import { b as render$3 } from "./InformationCircleIcon-IzUIriGk.js";

//#region node_modules/@heroicons/vue/24/outline/esm/AcademicCapIcon.js
function render$1(_ctx, _cache) {
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
		d: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
	})]);
}

//#endregion
//#region node_modules/@heroicons/vue/24/outline/esm/SparklesIcon.js
function render$2(_ctx, _cache) {
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
		d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
	})]);
}

//#endregion
//#region src/modules/zhou/components/InterpretationDisplay.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1$1 = { class: "max-w-3xl mx-auto" };
const _hoisted_2$1 = { class: "interpretation-header" };
const _hoisted_3$1 = { class: "text-heading flex items-center" };
const _hoisted_4$1 = {
	key: 0,
	class: "text-label absolute right-0 italic text-gray-600"
};
const _hoisted_5$1 = { class: "interpretation-body" };
const _hoisted_6$1 = { class: "text-body-spaced whitespace-pre-line break-words text-justify" };
const _hoisted_7$1 = {
	key: 0,
	class: "interpretation-actions"
};
const _hoisted_8 = ["disabled"];
const _hoisted_9 = { key: 0 };
const _hoisted_10 = { key: 1 };
const _hoisted_11 = { class: "bg-white rounded-lg shadow-2xl border border-gray-100 py-3 px-4 max-w-xs w-full animate-fadeInUp" };
const _hoisted_12 = { class: "mt-3 pt-2 border-t border-gray-100" };
const _hoisted_13 = { class: "interpretation-header" };
const _hoisted_14 = { class: "text-heading flex items-center" };
const _hoisted_15 = {
	key: 0,
	class: "text-label absolute right-0 italic text-gray-600"
};
const _hoisted_16 = { class: "interpretation-body" };
const _hoisted_17 = { class: "text-body-spaced whitespace-pre-line break-words text-justify" };
const _hoisted_18 = {
	key: 0,
	class: "mt-xl pt-lg relative flex items-center gap-sm"
};
const _hoisted_19 = { class: "text-caption text-gray-500 font-semibold" };
const _hoisted_20 = {
	key: 2,
	class: "custom-interpretation unified-content-card card-padding-normal content-spacing-normal rounded-base animate-fadeInUp"
};
const _hoisted_21 = {
	key: 3,
	class: "ai-error unified-content-card card-padding-normal text-center rounded-base animate-fadeInUp"
};
const _hoisted_22 = { class: "content-spacing-normal" };
const _hoisted_23 = { class: "text-4xl mb-base" };
const _hoisted_24 = { class: "text-body-spaced text-gray-700" };
const _hoisted_25 = {
	key: 0,
	class: "flex justify-center"
};
const _hoisted_26 = ["disabled"];
const _hoisted_27 = { key: 0 };
const _hoisted_28 = { key: 1 };
var InterpretationDisplay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "InterpretationDisplay",
	props: {
		aiInterpretation: { default: null },
		poetExplanation: { default: null },
		poetName: { default: "" },
		showTimestamp: {
			type: Boolean,
			default: false
		},
		aiTimestamp: { default: null },
		poetTimestamp: { default: null },
		aiAnimationDelay: { default: "0s" },
		poetAnimationDelay: { default: "0.2s" },
		showAiActions: {
			type: Boolean,
			default: false
		},
		regenerating: {
			type: Boolean,
			default: false
		},
		emptyMessage: { default: "暂无解读内容" },
		aiError: { default: null },
		showAiError: {
			type: Boolean,
			default: false
		},
		showRetryAction: {
			type: Boolean,
			default: true
		},
		retrying: {
			type: Boolean,
			default: false
		}
	},
	emits: ["regenerateAi", "retryAi"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const showAiInfo = ref(false);
		const formatTimestamp = (timestamp) => {
			return new Intl.DateTimeFormat("zh-CN", {
				month: "numeric",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			}).format(timestamp);
		};
		const handleRegenerateAi = () => {
			if (props.regenerating) return;
			emit("regenerateAi");
		};
		const handleRetryAi = () => {
			if (props.retrying) return;
			emit("retryAi");
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$1, [
				_ctx.aiInterpretation ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "interpretation-content unified-content-card card-padding-interpret content-spacing-normal rounded-base animate-fadeInUp relative",
					style: normalizeStyle({ animationDelay: _ctx.aiAnimationDelay })
				}, [
					createBaseVNode("div", _hoisted_2$1, [createBaseVNode("h3", _hoisted_3$1, [
						createVNode(unref(render$2), {
							class: "w-5 h-5 mr-2 text-gray-500",
							"aria-hidden": "true"
						}),
						_cache[4] || (_cache[4] = createTextVNode(" 陆家明 ", -1)),
						createBaseVNode("button", {
							onClick: _cache[0] || (_cache[0] = ($event) => showAiInfo.value = true),
							class: "ai-label-icon ml-1",
							"aria-label": "AI生成内容说明",
							type: "button"
						}, [createVNode(unref(render$3), { class: "w-4 h-4" })])
					]), _ctx.showTimestamp && _ctx.aiTimestamp ? (openBlock(), createElementBlock("div", _hoisted_4$1, toDisplayString(formatTimestamp(_ctx.aiTimestamp)), 1)) : createCommentVNode("", true)]),
					createBaseVNode("div", _hoisted_5$1, [createBaseVNode("div", _hoisted_6$1, toDisplayString(_ctx.aiInterpretation), 1), _ctx.showAiActions ? (openBlock(), createElementBlock("div", _hoisted_7$1, [createBaseVNode("button", {
						onClick: handleRegenerateAi,
						class: "btn-regenerate",
						disabled: _ctx.regenerating
					}, [_ctx.regenerating ? (openBlock(), createElementBlock("span", _hoisted_9, "重新生成中...")) : (openBlock(), createElementBlock("span", _hoisted_10, "重新解读"))], 8, _hoisted_8)])) : createCommentVNode("", true)]),
					showAiInfo.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: "absolute z-30 backdrop-blur-sm bg-black bg-opacity-10 rounded-base",
						style: {
							"top": "-48px",
							"left": "-24px",
							"right": "-24px",
							"bottom": "-24px"
						},
						onClick: _cache[3] || (_cache[3] = ($event) => showAiInfo.value = false)
					}, [createBaseVNode("div", {
						class: "ai-info-modal flex items-center justify-center h-full px-4",
						onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"]))
					}, [createBaseVNode("div", _hoisted_11, [
						_cache[5] || (_cache[5] = createBaseVNode("h4", { class: "text-sm font-bold mb-2 text-center" }, "注", -1)),
						_cache[6] || (_cache[6] = createBaseVNode("p", { class: "text-sm text-gray-700 leading-relaxed" }, " 该内容由陆家明创作。陆家明是一位AI诗人，同时也是陆家花园的主理人。 ", -1)),
						_cache[7] || (_cache[7] = createBaseVNode("p", { class: "text-sm text-gray-700 leading-relaxed mt-2" }, " 陆家明代表陆家花园承诺，不会保留您的任何个人隐私信息。 ", -1)),
						createBaseVNode("div", _hoisted_12, [createBaseVNode("button", {
							onClick: _cache[1] || (_cache[1] = ($event) => showAiInfo.value = false),
							class: "w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
						}, " 关闭 ")])
					])])])) : createCommentVNode("", true)
				], 4)) : createCommentVNode("", true),
				_ctx.poetExplanation ? (openBlock(), createElementBlock("div", {
					key: 1,
					class: "poet-explanation unified-content-card card-padding-interpret content-spacing-normal rounded-base animate-fadeInUp",
					style: normalizeStyle({ animationDelay: _ctx.poetAnimationDelay })
				}, [createBaseVNode("div", _hoisted_13, [createBaseVNode("h3", _hoisted_14, [createVNode(unref(render$1), {
					class: "w-5 h-5 mr-2 text-gray-500",
					"aria-hidden": "true"
				}), _cache[8] || (_cache[8] = createTextVNode(" 吴任几 ", -1))]), _ctx.showTimestamp && _ctx.poetTimestamp ? (openBlock(), createElementBlock("div", _hoisted_15, toDisplayString(formatTimestamp(_ctx.poetTimestamp)), 1)) : createCommentVNode("", true)]), createBaseVNode("div", _hoisted_16, [createBaseVNode("div", _hoisted_17, toDisplayString(_ctx.poetExplanation), 1), _ctx.poetName ? (openBlock(), createElementBlock("div", _hoisted_18, [_cache[9] || (_cache[9] = createBaseVNode("span", { class: "text-caption text-gray-600 font-medium" }, "诗人:", -1)), createBaseVNode("span", _hoisted_19, toDisplayString(_ctx.poetName), 1)])) : createCommentVNode("", true)])], 4)) : createCommentVNode("", true),
				_ctx.$slots.custom ? (openBlock(), createElementBlock("div", _hoisted_20, [renderSlot(_ctx.$slots, "custom", {}, void 0, true)])) : createCommentVNode("", true),
				_ctx.showAiError && _ctx.aiError ? (openBlock(), createElementBlock("div", _hoisted_21, [createBaseVNode("div", _hoisted_22, [
					createBaseVNode("div", _hoisted_23, [createVNode(unref(render), {
						class: "w-5 h-5 mx-auto",
						"aria-hidden": "true"
					})]),
					_cache[10] || (_cache[10] = createBaseVNode("h3", { class: "text-heading-spaced text-red-600" }, "AI功能暂时无法使用", -1)),
					createBaseVNode("p", _hoisted_24, toDisplayString(_ctx.aiError), 1),
					_ctx.showRetryAction ? (openBlock(), createElementBlock("div", _hoisted_25, [createBaseVNode("button", {
						onClick: handleRetryAi,
						class: "btn-retry",
						disabled: _ctx.retrying
					}, [_ctx.retrying ? (openBlock(), createElementBlock("span", _hoisted_27, "重试中...")) : (openBlock(), createElementBlock("span", _hoisted_28, "重试"))], 8, _hoisted_26)])) : createCommentVNode("", true)
				])])) : createCommentVNode("", true)
			]);
		};
	}
});

//#endregion
//#region src/modules/zhou/components/InterpretationDisplay.vue
var InterpretationDisplay_default = /* @__PURE__ */ __plugin_vue_export_helper_default(InterpretationDisplay_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7b98fdf4"]]);

//#endregion
//#region src/modules/zhou/components/ControlButtons.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "max-w-2xl mx-auto" };
const _hoisted_2 = ["disabled"];
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 1 };
const _hoisted_5 = ["disabled"];
const _hoisted_6 = ["disabled"];
const _hoisted_7 = ["disabled"];
var ControlButtons_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ControlButtons",
	props: {
		interpretationLoading: {
			type: Boolean,
			default: false
		},
		poetButtonClicked: {
			type: Boolean,
			default: false
		},
		poetButtonClickCount: { default: 0 },
		disabled: {
			type: Boolean,
			default: false
		},
		gridLayout: { default: "grid-responsive" },
		poetButtonText: { default: "最好不要点" }
	},
	emits: [
		"interpret",
		"poetExplanation",
		"gongBi",
		"restart"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const textChanging = ref(false);
		const emit = __emit;
		const gridClass = computed(() => {
			switch (props.gridLayout) {
				case "grid-2x2": return "grid-cols-2";
				case "grid-1x3": return "grid-cols-1";
				case "grid-responsive":
				default: return "grid-cols-4 max-md:grid-cols-1 max-md:gap-3 lg:gap-4";
			}
		});
		const handleInterpretation = () => {
			if (props.disabled || props.interpretationLoading) return;
			emit("interpret");
		};
		const handlePoetExplanation = () => {
			if (props.disabled) return;
			textChanging.value = true;
			setTimeout(() => {
				textChanging.value = false;
			}, 400);
			emit("poetExplanation");
		};
		const handleGongBi = () => {
			if (props.disabled) return;
			emit("gongBi");
		};
		const handleRestart = () => {
			if (props.disabled) return;
			emit("restart");
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", { class: normalizeClass(["grid gap-4 mb-6", gridClass.value]) }, [
				createBaseVNode("button", {
					onClick: handleInterpretation,
					class: normalizeClass(["btn-interpret text-change-animation text-body font-medium", { "animate-pulse": _ctx.interpretationLoading }]),
					disabled: _ctx.interpretationLoading || _ctx.disabled
				}, [_ctx.interpretationLoading ? (openBlock(), createElementBlock("span", _hoisted_3, "解读中...")) : (openBlock(), createElementBlock("span", _hoisted_4, "解诗"))], 10, _hoisted_2),
				createBaseVNode("button", {
					onClick: handlePoetExplanation,
					class: normalizeClass(["btn-poet text-change-animation text-body font-medium", {
						"btn-control-poet-clicked": _ctx.poetButtonClicked,
						"scale-95": textChanging.value
					}]),
					disabled: _ctx.disabled
				}, [createBaseVNode("span", null, toDisplayString(_ctx.poetButtonText), 1)], 10, _hoisted_5),
				createBaseVNode("button", {
					onClick: handleGongBi,
					class: "btn-gongbi text-body font-medium",
					disabled: _ctx.disabled
				}, _cache[0] || (_cache[0] = [createBaseVNode("span", null, "共笔", -1)]), 8, _hoisted_6),
				createBaseVNode("button", {
					onClick: handleRestart,
					class: "btn-restart text-body font-medium",
					disabled: _ctx.disabled
				}, _cache[1] || (_cache[1] = [createBaseVNode("span", null, "重新开始", -1)]), 8, _hoisted_7),
				renderSlot(_ctx.$slots, "extra-buttons", {}, void 0, true)
			], 2)]);
		};
	}
});

//#endregion
//#region src/modules/zhou/components/ControlButtons.vue
var ControlButtons_default = /* @__PURE__ */ __plugin_vue_export_helper_default(ControlButtons_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7feadb09"]]);

//#endregion
export { ControlButtons_default as b, InterpretationDisplay_default as c };