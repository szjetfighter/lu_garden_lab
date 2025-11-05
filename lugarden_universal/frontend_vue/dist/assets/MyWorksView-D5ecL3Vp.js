import { A as defineComponent, B as onMounted, C as onUnmounted, D as openBlock, E as renderList, G as resolveComponent, J as withCtx, K as withDirectives, M as ref, N as unref, O as normalizeClass, Q as toDisplayString, h as useRouter, i as __plugin_vue_export_helper_default, k as Transition, m as vModelText, o as withKeys, p as withModifiers, q as Fragment, s as computed, t as createBaseVNode, u as createBlock, v as createCommentVNode, w as createElementBlock, y as createTextVNode, z as createVNode } from "./index-BSnbBRtO.js";
import { c as clearToken, d as deleteAccount, e as getMyWorks, f as getToken } from "./authApi-Ckm-lhus.js";
import "./BackButton-BK4mq5-w.js";
import "./ControlButtons-IGr3RZjK.js";
import "./ArrowDownTrayIcon-uaWbQ4cD.js";
import { b as PoemViewer_default } from "./PoemViewer-CdqyKUFT.js";
import { b as render } from "./ExclamationTriangleIcon-jreoU3Tl.js";
import "./InformationCircleIcon-BOeUYuVf.js";
import { b as ErrorState_default } from "./ErrorState-CaYw3c3T.js";
import { b as EmptyState_default } from "./EmptyState-DBblY3SW.js";
import { b as lujiaming_icon_default } from "./lujiaming_icon-C_tgyrwu.js";
import { b as LoadingSpinner_default } from "./LoadingSpinner-Be6CkrEz.js";
import "./components-D2kd7hr5.js";
import "./ProgressBar-KJQJnfOp.js";
import "./QuestionCard-DJIIvErs.js";
import "./ClassicalEchoDisplay-CuhoMfb3.js";

//#region node_modules/@heroicons/vue/24/outline/esm/HandRaisedIcon.js
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
		d: "M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
	})]);
}

//#endregion
//#region src/core/auth/views/MyWorksView.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "my-works-container" };
const _hoisted_2 = { class: "top-nav" };
const _hoisted_3 = { class: "nav-content" };
const _hoisted_4 = { class: "nav-actions" };
const _hoisted_5 = { class: "desktop-nav" };
const _hoisted_6 = { class: "username" };
const _hoisted_7 = { class: "mobile-nav" };
const _hoisted_8 = { class: "username-mobile" };
const _hoisted_9 = { class: "menu-icon" };
const _hoisted_10 = { class: "works-main" };
const _hoisted_11 = {
	key: 3,
	class: "works-list"
};
const _hoisted_12 = ["onClick"];
const _hoisted_13 = { class: "summary-header" };
const _hoisted_14 = { class: "work-title" };
const _hoisted_15 = { class: "summary-meta" };
const _hoisted_16 = { class: "meta-tag" };
const _hoisted_17 = { class: "meta-tag" };
const _hoisted_18 = { class: "meta-tag" };
const _hoisted_19 = {
	key: 0,
	class: "work-content"
};
const _hoisted_20 = { class: "user-input-section" };
const _hoisted_21 = { class: "user-feeling-content" };
const _hoisted_22 = { class: "works-footer" };
const _hoisted_23 = { class: "works-count" };
const _hoisted_24 = { class: "copyright" };
const _hoisted_25 = { class: "footer-links" };
const _hoisted_26 = { class: "modal-header" };
const _hoisted_27 = { class: "modal-body" };
const _hoisted_28 = { class: "confirm-input" };
const _hoisted_29 = { class: "confirm-input" };
const _hoisted_30 = { for: "confirm-username" };
const _hoisted_31 = {
	key: 0,
	class: "error-message"
};
const _hoisted_32 = { class: "modal-footer" };
const _hoisted_33 = ["disabled"];
const _hoisted_34 = ["disabled"];
var MyWorksView_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MyWorksView",
	setup(__props) {
		const router = useRouter();
		const loading = ref(true);
		const error = ref(false);
		const errorMessage = ref("");
		const works = ref([]);
		const isMenuOpen = ref(false);
		const isDeleteModalOpen = ref(false);
		const confirmPassword = ref("");
		const confirmUsername = ref("");
		const isDeleting = ref(false);
		const deleteError = ref("");
		const username = computed(() => {
			const token = getToken();
			if (!token) return "游客";
			try {
				const payload = JSON.parse(atob(token.split(".")[1]));
				return payload.username || "用户";
			} catch {
				return "用户";
			}
		});
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		const loadWorks = async () => {
			loading.value = true;
			error.value = false;
			errorMessage.value = "";
			try {
				const response = await getMyWorks();
				if (response.success && response.works) works.value = response.works.map((work) => ({
					...work,
					isExpanded: false
				}));
				else {
					error.value = true;
					errorMessage.value = response.error || "加载作品失败";
				}
			} catch (err) {
				error.value = true;
				errorMessage.value = err.message || "网络错误，请稍后重试";
			} finally {
				loading.value = false;
			}
		};
		const toggleWork = (work) => {
			work.isExpanded = !work.isExpanded;
		};
		const logout = () => {
			clearToken();
			router.push("/");
		};
		const goToCreate = () => {
			router.push("/zhou");
		};
		const goBack = () => {
			router.push("/");
		};
		const toggleMenu = () => {
			isMenuOpen.value = !isMenuOpen.value;
		};
		const handleMenuAction = (action) => {
			action();
			isMenuOpen.value = false;
		};
		const formatDate = (dateString) => {
			const date = new Date(dateString);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hours = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		};
		const handleClickOutside = (event) => {
			const target = event.target;
			if (isMenuOpen.value && !target.closest(".mobile-nav")) isMenuOpen.value = false;
		};
		const showDeleteConfirm = () => {
			isDeleteModalOpen.value = true;
			confirmPassword.value = "";
			confirmUsername.value = "";
			deleteError.value = "";
		};
		const closeDeleteModal = () => {
			if (isDeleting.value) return;
			isDeleteModalOpen.value = false;
			confirmPassword.value = "";
			confirmUsername.value = "";
			deleteError.value = "";
		};
		const confirmDelete = async () => {
			deleteError.value = "";
			isDeleting.value = true;
			try {
				const response = await deleteAccount(confirmPassword.value, confirmUsername.value);
				if (response.success) {
					clearToken();
					alert("账号已成功删除");
					router.push("/login");
				} else deleteError.value = response.error || "删除账号失败";
			} catch (err) {
				deleteError.value = err.message || "网络错误，请稍后重试";
			} finally {
				isDeleting.value = false;
			}
		};
		onMounted(() => {
			loadWorks();
			document.addEventListener("click", handleClickOutside);
		});
		onUnmounted(() => {
			document.removeEventListener("click", handleClickOutside);
		});
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createBaseVNode("header", _hoisted_2, [createBaseVNode("div", _hoisted_3, [_cache[11] || (_cache[11] = createBaseVNode("h1", { class: "page-title" }, "我的作品集", -1)), createBaseVNode("div", _hoisted_4, [createBaseVNode("div", _hoisted_5, [
					createBaseVNode("span", _hoisted_6, toDisplayString(username.value), 1),
					createBaseVNode("button", {
						onClick: goBack,
						class: "back-btn"
					}, "返回陆家花园"),
					createBaseVNode("button", {
						onClick: logout,
						class: "logout-btn"
					}, "退出登录"),
					createBaseVNode("button", {
						onClick: showDeleteConfirm,
						class: "farewell-btn"
					}, [createVNode(unref(render$1), { class: "farewell-icon" }), _cache[7] || (_cache[7] = createTextVNode(" Farewell ", -1))])
				]), createBaseVNode("div", _hoisted_7, [createBaseVNode("button", {
					onClick: toggleMenu,
					class: "menu-toggle-btn"
				}, [createBaseVNode("span", _hoisted_8, toDisplayString(username.value), 1), createBaseVNode("span", _hoisted_9, toDisplayString(isMenuOpen.value ? "✕" : "⋮"), 1)]), createVNode(Transition, { name: "dropdown" }, {
					default: withCtx(() => [isMenuOpen.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: "dropdown-menu",
						onClick: _cache[3] || (_cache[3] = withModifiers(() => {}, ["stop"]))
					}, [
						createBaseVNode("button", {
							onClick: _cache[0] || (_cache[0] = ($event) => handleMenuAction(goBack)),
							class: "menu-item"
						}, _cache[8] || (_cache[8] = [createBaseVNode("img", {
							src: lujiaming_icon_default,
							alt: "陆家花园",
							class: "menu-icon-img"
						}, null, -1), createTextVNode(" 返回陆家花园 ", -1)])),
						createBaseVNode("button", {
							onClick: _cache[1] || (_cache[1] = ($event) => handleMenuAction(logout)),
							class: "menu-item menu-item-logout"
						}, _cache[9] || (_cache[9] = [createBaseVNode("span", { class: "menu-logout-icon" }, "↗", -1), createTextVNode(" 退出登录 ", -1)])),
						createBaseVNode("button", {
							onClick: _cache[2] || (_cache[2] = ($event) => handleMenuAction(showDeleteConfirm)),
							class: "menu-item menu-item-farewell"
						}, [createVNode(unref(render$1), { class: "menu-farewell-icon" }), _cache[10] || (_cache[10] = createTextVNode(" Farewell ", -1))])
					])) : createCommentVNode("", true)]),
					_: 1
				})])])])]),
				createBaseVNode("main", _hoisted_10, [loading.value ? (openBlock(), createBlock(unref(LoadingSpinner_default), {
					key: 0,
					message: "正在加载作品...",
					size: "large"
				})) : error.value ? (openBlock(), createBlock(unref(ErrorState_default), {
					key: 1,
					message: errorMessage.value,
					onRetry: loadWorks
				}, null, 8, ["message"])) : works.value.length === 0 ? (openBlock(), createBlock(unref(EmptyState_default), {
					key: 2,
					icon: "✍️",
					title: "您还没有创作作品",
					description: "去创作一首属于您的诗歌吧～",
					"show-action": true,
					"action-text": "去创作",
					onAction: goToCreate
				})) : (openBlock(), createElementBlock("div", _hoisted_11, [(openBlock(true), createElementBlock(Fragment, null, renderList(works.value, (work, index) => {
					return openBlock(), createElementBlock("div", {
						key: work.id,
						class: "work-item"
					}, [createBaseVNode("div", {
						class: "work-summary",
						onClick: ($event) => toggleWork(work)
					}, [createBaseVNode("div", _hoisted_13, [createBaseVNode("h3", _hoisted_14, toDisplayString(work.poemTitle), 1), createBaseVNode("button", { class: normalizeClass(["toggle-icon", { expanded: work.isExpanded }]) }, toDisplayString(work.isExpanded ? "▲" : "▼"), 3)]), createBaseVNode("div", _hoisted_15, [
						createBaseVNode("span", _hoisted_16, "原诗：《" + toDisplayString(work.sourcePoemTitle) + "》", 1),
						_cache[12] || (_cache[12] = createBaseVNode("span", { class: "meta-separator" }, "•", -1)),
						createBaseVNode("span", _hoisted_17, toDisplayString(work.sourcePoemChapter), 1),
						_cache[13] || (_cache[13] = createBaseVNode("span", { class: "meta-separator" }, "•", -1)),
						createBaseVNode("span", _hoisted_18, toDisplayString(formatDate(work.createdAt)), 1)
					])], 8, _hoisted_12), createVNode(Transition, { name: "expand" }, {
						default: withCtx(() => [work.isExpanded ? (openBlock(), createElementBlock("div", _hoisted_19, [createBaseVNode("div", _hoisted_20, [_cache[14] || (_cache[14] = createBaseVNode("div", { class: "user-feeling-label" }, "您的思绪", -1)), createBaseVNode("div", _hoisted_21, toDisplayString(work.userInput), 1)]), createVNode(unref(PoemViewer_default), {
							"poem-title": work.poemTitle,
							"quote-text": work.poemQuote || "",
							"quote-citation": work.poemQuoteSource || "",
							"main-text": work.poemContent,
							author: `陆家明 × ${username.value}`,
							"show-actions": true,
							"animation-delay": `${index * .1}s`
						}, null, 8, [
							"poem-title",
							"quote-text",
							"quote-citation",
							"main-text",
							"author",
							"animation-delay"
						])])) : createCommentVNode("", true)]),
						_: 2
					}, 1024)]);
				}), 128))]))]),
				createBaseVNode("footer", _hoisted_22, [
					createBaseVNode("p", _hoisted_23, "共创作 " + toDisplayString(works.value.length) + " 首诗歌", 1),
					createBaseVNode("p", _hoisted_24, "© " + toDisplayString(unref(currentYear)) + " 陆家花园", 1),
					createBaseVNode("div", _hoisted_25, [
						createVNode(_component_router_link, {
							to: "/terms?from=my-works",
							class: "footer-link"
						}, {
							default: withCtx(() => _cache[15] || (_cache[15] = [createTextVNode(" 用户协议 ", -1)])),
							_: 1,
							__: [15]
						}),
						_cache[17] || (_cache[17] = createBaseVNode("span", { class: "footer-separator" }, "|", -1)),
						createVNode(_component_router_link, {
							to: "/privacy?from=my-works",
							class: "footer-link"
						}, {
							default: withCtx(() => _cache[16] || (_cache[16] = [createTextVNode(" 隐私政策 ", -1)])),
							_: 1,
							__: [16]
						})
					])
				]),
				createVNode(Transition, { name: "modal" }, {
					default: withCtx(() => [isDeleteModalOpen.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: "modal-overlay",
						onClick: closeDeleteModal
					}, [createBaseVNode("div", {
						class: "modal-content",
						onClick: _cache[6] || (_cache[6] = withModifiers(() => {}, ["stop"]))
					}, [
						createBaseVNode("div", _hoisted_26, [createBaseVNode("h2", null, [createVNode(unref(render), { class: "warning-icon" }), _cache[18] || (_cache[18] = createTextVNode(" 删除账号 ", -1))])]),
						createBaseVNode("div", _hoisted_27, [
							_cache[22] || (_cache[22] = createBaseVNode("p", { class: "delete-description" }, "删除账号后：", -1)),
							_cache[23] || (_cache[23] = createBaseVNode("ul", { class: "delete-info-list" }, [
								createBaseVNode("li", null, "您将无法再登录陆家花园"),
								createBaseVNode("li", null, "您的用户名将不可复用"),
								createBaseVNode("li", null, [createBaseVNode("strong", null, "您的历史共笔作品将保留，但不会与您的身份关联")])
							], -1)),
							_cache[24] || (_cache[24] = createBaseVNode("p", { class: "delete-contact-hint" }, " 如有疑虑，请查看用户协议，或与我们联系：lujiaming@lugarden.space ", -1)),
							createBaseVNode("div", _hoisted_28, [_cache[19] || (_cache[19] = createBaseVNode("label", { for: "confirm-password" }, "请先输入密码验证身份：", -1)), withDirectives(createBaseVNode("input", {
								id: "confirm-password",
								"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => confirmPassword.value = $event),
								type: "password",
								placeholder: "输入密码",
								onKeyup: withKeys(confirmDelete, ["enter"])
							}, null, 544), [[vModelText, confirmPassword.value]])]),
							createBaseVNode("div", _hoisted_29, [createBaseVNode("label", _hoisted_30, [
								_cache[20] || (_cache[20] = createTextVNode("再输入用户名 ", -1)),
								createBaseVNode("strong", null, toDisplayString(username.value), 1),
								_cache[21] || (_cache[21] = createTextVNode(" 确认删除：", -1))
							]), withDirectives(createBaseVNode("input", {
								id: "confirm-username",
								"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => confirmUsername.value = $event),
								type: "text",
								placeholder: "输入用户名",
								onKeyup: withKeys(confirmDelete, ["enter"])
							}, null, 544), [[vModelText, confirmUsername.value]])]),
							deleteError.value ? (openBlock(), createElementBlock("p", _hoisted_31, toDisplayString(deleteError.value), 1)) : createCommentVNode("", true)
						]),
						createBaseVNode("div", _hoisted_32, [createBaseVNode("button", {
							onClick: closeDeleteModal,
							class: "cancel-btn",
							disabled: isDeleting.value
						}, " 取消 ", 8, _hoisted_33), createBaseVNode("button", {
							onClick: confirmDelete,
							class: "confirm-delete-btn",
							disabled: isDeleting.value || !confirmPassword.value || !confirmUsername.value
						}, toDisplayString(isDeleting.value ? "删除中..." : "确认删除"), 9, _hoisted_34)])
					])])) : createCommentVNode("", true)]),
					_: 1
				})
			]);
		};
	}
});

//#endregion
//#region src/core/auth/views/MyWorksView.vue
var MyWorksView_default = /* @__PURE__ */ __plugin_vue_export_helper_default(MyWorksView_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-376be7fd"]]);

//#endregion
export { MyWorksView_default as default };