import { A as defineComponent, B as onMounted, D as openBlock, M as ref, O as normalizeClass, h as useRouter, i as __plugin_vue_export_helper_default, s as computed, t as createBaseVNode, w as createElementBlock, z as createVNode } from "./index-I6Qyf-Z2.js";
import { b as ClassicalEchoDisplay_default } from "./ClassicalEchoDisplay-iJNl3sir.js";
import "./enhancedApi-C4NCKSlP.js";
import { b as useZhouStore } from "./zhou-BqiFFjKj.js";

//#region src/modules/zhou/views/ClassicalEchoScreen.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "classical-echo-screen" };
const _hoisted_2 = { class: "container mx-auto px-4 py-8" };
const _hoisted_3 = { class: "max-w-4xl mx-auto" };
const _hoisted_4 = { class: "echo-content" };
const _hoisted_5 = {
	class: "continue-section animate-fadeInUp",
	style: { "animation-delay": "0.5s" }
};
const _hoisted_6 = { class: "flex items-center justify-center gap-2" };
const _hoisted_7 = ["disabled"];
const _hoisted_8 = {
	key: 0,
	class: "continue-btn-icon",
	fill: "none",
	stroke: "currentColor",
	viewBox: "0 0 24 24"
};
const _hoisted_9 = {
	key: 1,
	class: "animate-spin h-5 w-5",
	fill: "none",
	viewBox: "0 0 24 24"
};
var ClassicalEchoScreen_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ClassicalEchoScreen",
	setup(__props) {
		const router = useRouter();
		const zhouStore = useZhouStore();
		const isTransitioning = ref(false);
		const quoteCitation = computed(() => {
			const poemTitle = zhouStore.result.poemTitle;
			if (!poemTitle || !zhouStore.universeData.poems[poemTitle]) return null;
			const poemData = zhouStore.universeData.poems[poemTitle];
			return poemData.quote_citation || null;
		});
		const quoteText = computed(() => {
			const poemTitle = zhouStore.result.poemTitle;
			if (!poemTitle || !zhouStore.universeData.poems[poemTitle]) return null;
			const poemData = zhouStore.universeData.poems[poemTitle];
			return poemData.quote_text || null;
		});
		const classicalEchoContent = computed(() => {
			if (!zhouStore.quiz.isQuizComplete || !zhouStore.result.selectedPoem) return null;
			const poemTitle = zhouStore.result.poemTitle;
			if (poemTitle) {
				const archetype = zhouStore.universeData.poemArchetypes.find((p) => p.title === poemTitle);
				if (archetype && archetype.classicalEcho) return archetype.classicalEcho;
			}
			return `您的内心世界如诗如画，古人云："情动于中而形于言"。
  
即将为您呈现的诗歌，正是您此刻心境的真实写照。`;
		});
		onMounted(() => {
			if (!zhouStore.quiz.isQuizComplete) {
				router.replace("/");
				return;
			}
			if (!zhouStore.result.selectedPoem) zhouStore.calculatePoemMapping();
		});
		const continueToResult = async () => {
			if (isTransitioning.value) return;
			isTransitioning.value = true;
			try {
				if (!zhouStore.result.selectedPoem) zhouStore.calculatePoemMapping();
				await new Promise((resolve) => setTimeout(resolve, 1e3));
				const chapterKey = zhouStore.navigation.currentChapterName;
				const poemTitle = zhouStore.result.poemTitle || zhouStore.result.selectedPoem?.title;
				const answerPattern = zhouStore.quiz.userAnswers.map((answer) => answer.selectedOption === "A" ? "0" : "1").join("");
				if (!chapterKey || !poemTitle || !answerPattern) {
					console.error("[ClassicalEcho] 缺少必要数据，回退到无参数导航");
					zhouStore.showResult();
					router.push("/result");
					return;
				}
				const params = new URLSearchParams({
					chapter: chapterKey,
					pattern: answerPattern,
					poem: poemTitle
				});
				zhouStore.showResult();
				router.push(`/result?${params.toString()}`);
			} catch (error) {
				console.error("跳转到结果页面失败:", error);
				zhouStore.showError("跳转失败，请重试");
			} finally {
				isTransitioning.value = false;
			}
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createVNode(ClassicalEchoDisplay_default, {
				"quote-citation": quoteCitation.value,
				"quote-text": quoteText.value,
				"classical-echo": classicalEchoContent.value,
				"content-animation-delay": "0.1s"
			}, null, 8, [
				"quote-citation",
				"quote-text",
				"classical-echo"
			])]), createBaseVNode("div", _hoisted_5, [createBaseVNode("div", _hoisted_6, [_cache[2] || (_cache[2] = createBaseVNode("span", { class: "continue-text" }, "看看你的同行者吴任几是怎么说的", -1)), createBaseVNode("button", {
				onClick: continueToResult,
				class: normalizeClass(["btn-continue-arrow rounded-full", { "animate-pulse": isTransitioning.value }]),
				disabled: isTransitioning.value
			}, [!isTransitioning.value ? (openBlock(), createElementBlock("svg", _hoisted_8, _cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": "2",
				d: "M9 5l7 7-7 7"
			}, null, -1)]))) : (openBlock(), createElementBlock("svg", _hoisted_9, _cache[1] || (_cache[1] = [createBaseVNode("circle", {
				class: "opacity-25",
				cx: "12",
				cy: "12",
				r: "10",
				stroke: "currentColor",
				"stroke-width": "4"
			}, null, -1), createBaseVNode("path", {
				class: "opacity-75",
				fill: "currentColor",
				d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			}, null, -1)])))], 10, _hoisted_7)])])])])]);
		};
	}
});

//#endregion
//#region src/modules/zhou/views/ClassicalEchoScreen.vue
var ClassicalEchoScreen_default = /* @__PURE__ */ __plugin_vue_export_helper_default(ClassicalEchoScreen_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-98c36182"]]);

//#endregion
export { ClassicalEchoScreen_default as default };