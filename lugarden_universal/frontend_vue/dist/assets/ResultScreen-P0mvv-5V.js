import { A as defineComponent, B as onMounted, D as openBlock, M as ref, N as unref, O as normalizeClass, Q as toDisplayString, g as useRoute, h as useRouter, i as __plugin_vue_export_helper_default, s as computed, t as createBaseVNode, v as createCommentVNode, w as createElementBlock, z as createVNode } from "./index-I6Qyf-Z2.js";
import { b as ControlButtons_default, c as InterpretationDisplay_default } from "./ControlButtons-BMxcyJs4.js";
import "./ArrowDownTrayIcon-CimBjohx.js";
import { b as PoemViewer_default } from "./PoemViewer-CGWvdiio.js";
import "./ExclamationTriangleIcon-DPnftkPl.js";
import "./InformationCircleIcon-IzUIriGk.js";
import { b as ErrorState_default } from "./ErrorState-BqKb-ZOn.js";
import { b as LoadingSpinner_default } from "./LoadingSpinner-CngjKRiQ.js";
import "./enhancedApi-C4NCKSlP.js";
import { b as useZhouStore } from "./zhou-BqiFFjKj.js";

//#region src/modules/zhou/views/ResultScreen.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = {
	class: "min-h-screen",
	style: { "background-color": "var(--bg-primary)" }
};
const _hoisted_2 = { class: "container mx-auto px-4 py-8" };
const _hoisted_3 = { class: "max-w-4xl mx-auto" };
const _hoisted_4 = { class: "result-content-mobile md:hidden" };
const _hoisted_5 = {
	key: 0,
	class: "mb-8"
};
const _hoisted_6 = {
	class: "action-group animate-fadeInUp",
	style: { "animation-delay": "0.1s" }
};
const _hoisted_7 = { class: "max-w-2xl mx-auto" };
const _hoisted_8 = ["disabled"];
const _hoisted_9 = { key: 0 };
const _hoisted_10 = { key: 1 };
const _hoisted_11 = {
	key: 0,
	class: "animate-fadeInUp",
	style: { "animation-delay": "0.2s" }
};
const _hoisted_12 = {
	class: "action-group animate-fadeInUp",
	style: { "animation-delay": "0.2s" }
};
const _hoisted_13 = { class: "max-w-2xl mx-auto" };
const _hoisted_14 = {
	key: 0,
	class: "animate-fadeInUp",
	style: { "animation-delay": "0.2s" }
};
const _hoisted_15 = { class: "result-content hidden md:block" };
const _hoisted_16 = {
	key: 0,
	class: "mb-8"
};
const _hoisted_17 = {
	class: "mb-8 animate-fadeInUp",
	style: { "animation-delay": "0.4s" }
};
const _hoisted_18 = { class: "interpretation-area" };
const _hoisted_19 = { key: 0 };
const _hoisted_20 = { key: 1 };
var ResultScreen_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ResultScreen",
	setup(__props) {
		const router = useRouter();
		const route = useRoute();
		const zhouStore = useZhouStore();
		const textChanging = ref(false);
		const selectedPoemQuoteText = computed(() => {
			const poem = zhouStore.result.selectedPoem;
			if (!poem || !poem.body) return null;
			if (typeof poem.body === "object" && poem.body !== null) return poem.body.quote_text || null;
			return null;
		});
		const selectedPoemQuoteCitation = computed(() => {
			const poem = zhouStore.result.selectedPoem;
			if (!poem || !poem.body) return null;
			if (typeof poem.body === "object" && poem.body !== null) return poem.body.quote_citation || null;
			return null;
		});
		const selectedPoemMainText = computed(() => {
			const poem = zhouStore.result.selectedPoem;
			if (!poem || !poem.body) return null;
			if (typeof poem.body === "object" && poem.body !== null) return poem.body.main_text || null;
			if (typeof poem.body === "string") return poem.body;
			return null;
		});
		onMounted(async () => {
			const chapterParam = route.query.chapter;
			const patternParam = route.query.pattern;
			const poemParam = route.query.poem;
			if (chapterParam && patternParam && poemParam) {
				console.log("[ResultScreen] 从URL参数加载诗歌:", {
					chapterParam,
					patternParam,
					poemParam
				});
				try {
					await zhouStore.loadPoemByParams(chapterParam, patternParam, poemParam);
					if (zhouStore.quiz.userAnswers.length === 0) zhouStore.reconstructQuizFromPattern(chapterParam, patternParam);
					return;
				} catch (error) {
					console.error("[ResultScreen] 从URL参数加载失败:", error);
				}
			}
			console.log("[ResultScreen] URL参数缺失或加载失败，尝试使用store数据");
			if (!zhouStore.quiz.isQuizComplete) {
				console.error("[ResultScreen] 无URL参数且问答未完成，重定向到首页");
				router.replace("/zhou");
				return;
			}
			if (!zhouStore.result.selectedPoem) zhouStore.calculatePoemMapping();
		});
		const getInterpretation = async () => {
			try {
				await zhouStore.getInterpretation();
			} catch (error) {
				console.error("获取解读失败:", error);
			}
		};
		const showPoetExplanation = () => {
			textChanging.value = true;
			setTimeout(() => {
				textChanging.value = false;
			}, 400);
			zhouStore.showPoetExplanation();
		};
		const navigateToGongBi = () => {
			const chapterKey = zhouStore.navigation.currentChapterName;
			const poemTitle = zhouStore.result.poemTitle || zhouStore.result.selectedPoem?.title;
			const answerPattern = zhouStore.quiz.userAnswers.map((answer) => answer.selectedOption === "A" ? "0" : "1").join("");
			if (!chapterKey || !poemTitle || !answerPattern) {
				console.error("[ResultScreen] 缺少必要数据，无法导航到共笔页面");
				return;
			}
			const params = new URLSearchParams({
				chapter: chapterKey,
				pattern: answerPattern,
				poem: poemTitle
			});
			router.push(`/gongbi?${params.toString()}`);
		};
		const startOver = () => {
			const currentProject = zhouStore.navigation.currentMainProject;
			zhouStore.resetApp();
			if (currentProject) router.push(`/project/${currentProject.id}`);
			else router.push("/zhou");
		};
		const retryLoad = async () => {
			zhouStore.clearError();
			zhouStore.calculatePoemMapping();
		};
		const handlePoemCopied = (text) => {
			console.log("诗歌已复制到剪贴板:", text.substring(0, 50) + "...");
		};
		const handlePoemShared = (shareData) => {
			console.log("诗歌已分享:", shareData.title);
		};
		const handlePoemDownloaded = (fileName) => {
			console.log("诗歌已下载为文件:", fileName);
		};
		const retryAiFeatures = () => {
			zhouStore.clearError();
			console.log("重试AI功能");
			if (!zhouStore.result.interpretationContent) getInterpretation();
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [
				createBaseVNode("div", _hoisted_4, [
					unref(zhouStore).result.selectedPoem ? (openBlock(), createElementBlock("div", _hoisted_5, [createVNode(PoemViewer_default, {
						"poem-title": unref(zhouStore).result.poemTitle || unref(zhouStore).result.selectedPoem.title,
						"quote-text": selectedPoemQuoteText.value,
						"quote-citation": selectedPoemQuoteCitation.value,
						"main-text": selectedPoemMainText.value,
						"animation-delay": "0.2s",
						"show-actions": true,
						"show-download": true,
						"show-share": true,
						onCopied: handlePoemCopied,
						onShared: handlePoemShared,
						onDownloaded: handlePoemDownloaded
					}, null, 8, [
						"poem-title",
						"quote-text",
						"quote-citation",
						"main-text"
					])])) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("button", {
						onClick: getInterpretation,
						class: normalizeClass(["w-full btn-interpret text-change-animation text-body font-medium", { "animate-pulse": unref(zhouStore).result.interpretationLoading }]),
						disabled: unref(zhouStore).result.interpretationLoading
					}, [unref(zhouStore).result.interpretationLoading ? (openBlock(), createElementBlock("span", _hoisted_9, "解读中...")) : (openBlock(), createElementBlock("span", _hoisted_10, "解诗"))], 10, _hoisted_8), unref(zhouStore).result.interpretationContent ? (openBlock(), createElementBlock("div", _hoisted_11, [createVNode(InterpretationDisplay_default, {
						"ai-interpretation": unref(zhouStore).result.interpretationContent,
						"poet-explanation": null,
						"ai-error": unref(zhouStore).ui.errorMessage,
						"show-ai-error": !!unref(zhouStore).ui.errorMessage,
						"show-retry-action": true,
						retrying: unref(zhouStore).result.interpretationLoading,
						"ai-animation-delay": "0s",
						"empty-message": "",
						onRetryAi: retryAiFeatures
					}, null, 8, [
						"ai-interpretation",
						"ai-error",
						"show-ai-error",
						"retrying"
					])])) : createCommentVNode("", true)])]),
					createBaseVNode("div", _hoisted_12, [createBaseVNode("div", _hoisted_13, [createBaseVNode("button", {
						onClick: showPoetExplanation,
						class: normalizeClass(["w-full btn-poet text-change-animation text-body font-medium", {
							"btn-control-poet-clicked": unref(zhouStore).result.poetButtonClicked,
							"scale-95": textChanging.value
						}])
					}, [createBaseVNode("span", null, toDisplayString(unref(zhouStore).getPoetButtonText()), 1)], 2), unref(zhouStore).result.poetExplanation ? (openBlock(), createElementBlock("div", _hoisted_14, [createVNode(InterpretationDisplay_default, {
						"ai-interpretation": null,
						"poet-explanation": unref(zhouStore).result.poetExplanation,
						"ai-error": null,
						"show-ai-error": false,
						"show-retry-action": false,
						"poet-animation-delay": "0s",
						"empty-message": ""
					}, null, 8, ["poet-explanation"])])) : createCommentVNode("", true)])]),
					createBaseVNode("div", {
						class: "action-group animate-fadeInUp",
						style: { "animation-delay": "0.3s" }
					}, [createBaseVNode("div", { class: "max-w-2xl mx-auto" }, [createBaseVNode("button", {
						onClick: navigateToGongBi,
						class: "w-full btn-gongbi text-body font-medium"
					}, _cache[0] || (_cache[0] = [createBaseVNode("span", null, "共笔", -1)]))])]),
					createBaseVNode("div", {
						class: "action-group action-group-last animate-fadeInUp",
						style: { "animation-delay": "0.4s" }
					}, [createBaseVNode("div", { class: "max-w-2xl mx-auto" }, [createBaseVNode("button", {
						onClick: startOver,
						class: "w-full btn-restart text-body font-medium"
					}, _cache[1] || (_cache[1] = [createBaseVNode("span", null, "重新开始", -1)]))])])
				]),
				createBaseVNode("div", _hoisted_15, [
					unref(zhouStore).result.selectedPoem ? (openBlock(), createElementBlock("div", _hoisted_16, [createVNode(PoemViewer_default, {
						"poem-title": unref(zhouStore).result.poemTitle || unref(zhouStore).result.selectedPoem.title,
						"quote-text": selectedPoemQuoteText.value,
						"quote-citation": selectedPoemQuoteCitation.value,
						"main-text": selectedPoemMainText.value,
						"animation-delay": "0.2s",
						"show-actions": true,
						"show-download": true,
						"show-share": true,
						onCopied: handlePoemCopied,
						onShared: handlePoemShared,
						onDownloaded: handlePoemDownloaded
					}, null, 8, [
						"poem-title",
						"quote-text",
						"quote-citation",
						"main-text"
					])])) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_17, [createVNode(ControlButtons_default, {
						"interpretation-loading": unref(zhouStore).result.interpretationLoading,
						"poet-button-clicked": unref(zhouStore).result.poetButtonClicked,
						"poet-button-click-count": unref(zhouStore).result.poetButtonClickCount,
						"poet-button-text": unref(zhouStore).getPoetButtonText(),
						onInterpret: getInterpretation,
						onPoetExplanation: showPoetExplanation,
						onGongBi: navigateToGongBi,
						onRestart: startOver
					}, null, 8, [
						"interpretation-loading",
						"poet-button-clicked",
						"poet-button-click-count",
						"poet-button-text"
					])]),
					createBaseVNode("div", _hoisted_18, [createVNode(InterpretationDisplay_default, {
						"ai-interpretation": unref(zhouStore).result.interpretationContent,
						"poet-explanation": unref(zhouStore).result.poetExplanation,
						"ai-error": unref(zhouStore).ui.errorMessage,
						"show-ai-error": !!unref(zhouStore).ui.errorMessage,
						"show-retry-action": true,
						retrying: unref(zhouStore).result.interpretationLoading,
						"ai-animation-delay": "0.6s",
						"poet-animation-delay": "0.8s",
						"empty-message": "",
						onRetryAi: retryAiFeatures
					}, null, 8, [
						"ai-interpretation",
						"poet-explanation",
						"ai-error",
						"show-ai-error",
						"retrying"
					])])
				]),
				!unref(zhouStore).result.selectedPoem && !unref(zhouStore).universeData.error ? (openBlock(), createElementBlock("div", _hoisted_19, [createVNode(LoadingSpinner_default, {
					size: "large",
					"loading-text": "正在准备您的诗歌...",
					subtitle: "诗意正在汇聚，请稍候...",
					variant: "pulse",
					"show-progress": false,
					centered: ""
				})])) : createCommentVNode("", true),
				unref(zhouStore).universeData.error ? (openBlock(), createElementBlock("div", _hoisted_20, [createVNode(ErrorState_default, {
					"error-type": "unknown",
					"error-title": "出现了问题",
					"error-message": unref(zhouStore).universeData.error,
					"show-retry": true,
					"show-back": false,
					"retry-text": "重试",
					onRetry: retryLoad,
					suggestions: [
						"请检查网络连接",
						"刷新页面重试",
						"稍后再试"
					]
				}, null, 8, ["error-message"])])) : createCommentVNode("", true)
			])])]);
		};
	}
});

//#endregion
//#region src/modules/zhou/views/ResultScreen.vue
var ResultScreen_default = /* @__PURE__ */ __plugin_vue_export_helper_default(ResultScreen_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-41959020"]]);

//#endregion
export { ResultScreen_default as default };