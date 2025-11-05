import { A as defineComponent, B as onMounted, C as onUnmounted, D as openBlock, E as renderList, G as resolveComponent, J as withCtx, L as reactive, M as ref, N as unref, O as normalizeClass, Q as toDisplayString, e as getUserFriendlyErrorMessage, f as isApiError, h as useRouter, i as __plugin_vue_export_helper_default, j as defineStore, k as Transition, p as withModifiers, q as Fragment, s as computed, t as createBaseVNode, u as createBlock, v as createCommentVNode, w as createElementBlock, y as createTextVNode, z as createVNode } from "./index-0cj-Hd_i.js";
import { f as getUsername, g as isAuthenticated } from "./authApi-DMUWcRXB.js";
import "./BackButton-CfwVcQyt.js";
import { b as ErrorState_default } from "./ErrorState-CQCVaoCj.js";
import { b as EmptyState_default } from "./EmptyState-BeqYa-By.js";
import { b as LoadingSpinner_default } from "./LoadingSpinner-DLftEDJi.js";
import { b as NotificationToast_default, c as AnimationWrapper_default } from "./components-BfT3xTN5.js";
import "./ProgressBar-BzUeofeR.js";
import { b as getApiServices } from "./enhancedApi-D-VVpnBX.js";

//#region node_modules/@heroicons/vue/24/outline/esm/DocumentTextIcon.js
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
		d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
	})]);
}

//#endregion
//#region src/modules/portal/components/UniverseCard.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1$1 = { class: "flex-1" };
const _hoisted_2$1 = { class: "flex justify-between items-start mb-4" };
const _hoisted_3$1 = { class: "text-2xl font-bold text-gray-800 m-0" };
const _hoisted_4$1 = { class: "text-base text-gray-600 mb-4 whitespace-pre-line leading-loose" };
const _hoisted_5$1 = { class: "flex justify-between items-center mt-4" };
const _hoisted_6$1 = { class: "text-xs text-gray-500 m-0" };
const _hoisted_7$1 = ["disabled"];
var UniverseCard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "UniverseCard",
	props: {
		universe: {},
		disabled: {
			type: Boolean,
			default: false
		},
		index: { default: 0 }
	},
	emits: ["click", "enter"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const isActive = computed(() => {
			return props.universe.status === "active" && !props.disabled;
		});
		const animationDelay = computed(() => {
			return Math.min(props.index * 50, 200);
		});
		const statusText = computed(() => {
			const statusMap = {
				active: "已上线",
				developing: "开发中",
				maintenance: "维护中",
				archived: "已归档"
			};
			return statusMap[props.universe.status] || "未知";
		});
		const buttonText = computed(() => {
			if (!isActive.value) return props.universe.status === "developing" ? "敬请期待" : "暂不可用";
			return "进入宇宙";
		});
		const handleCardClick = () => {
			emit("click", props.universe);
		};
		const handleEnterClick = () => {
			if (isActive.value) emit("enter", props.universe);
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(AnimationWrapper_default), {
				"animation-type": "fadeInUp",
				delay: animationDelay.value,
				class: "universe-card-wrapper"
			}, {
				default: withCtx(() => [createBaseVNode("div", {
					class: normalizeClass(["universe-card", { "card-disabled": !isActive.value }]),
					onClick: handleCardClick
				}, [createBaseVNode("div", _hoisted_1$1, [createBaseVNode("div", _hoisted_2$1, [createBaseVNode("h3", _hoisted_3$1, toDisplayString(_ctx.universe.name), 1), createBaseVNode("span", { class: normalizeClass(["universe-status", _ctx.universe.status]) }, toDisplayString(statusText.value), 3)]), createBaseVNode("p", _hoisted_4$1, toDisplayString(_ctx.universe.description), 1)]), createBaseVNode("div", _hoisted_5$1, [createBaseVNode("p", _hoisted_6$1, toDisplayString(_ctx.universe.meta), 1), createBaseVNode("button", {
					class: "enter-button",
					disabled: !isActive.value,
					onClick: withModifiers(handleEnterClick, ["stop"])
				}, toDisplayString(buttonText.value), 9, _hoisted_7$1)])], 2)]),
				_: 1
			}, 8, ["delay"]);
		};
	}
});

//#endregion
//#region src/modules/portal/components/UniverseCard.vue
var UniverseCard_default = /* @__PURE__ */ __plugin_vue_export_helper_default(UniverseCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0da30af0"]]);

//#endregion
//#region src/modules/portal/stores/portal.ts
const usePortalStore = defineStore("portal", () => {
	let apiServices = null;
	const initializeApiServices = () => {
		if (!apiServices) apiServices = getApiServices({
			onLoadingChange: (loading) => {
				console.log("[Portal API] Loading状态变化:", loading, "当前手动状态:", state.loading);
				if (!state.loading || loading === false) {
					console.log("[Portal API] 接受状态变化");
					state.loading = loading;
				} else console.log("[Portal API] 忽略状态变化，避免冲突");
			},
			onError: (error) => {
				console.error("Portal API错误:", error);
				state.error.hasError = true;
				state.error.message = getUserFriendlyErrorMessage(error);
			},
			enableLogging: true,
			enableCaching: true,
			cacheDuration: 600 * 1e3
		});
		return apiServices;
	};
	const state = reactive({
		universes: [],
		loading: false,
		error: {
			hasError: false,
			message: "",
			code: void 0
		},
		selectedUniverse: void 0
	});
	const navigationConfig = {
		zhou: "/zhou",
		maoxiaodou: "/maoxiaodou"
	};
	const activeUniverses = computed(() => {
		return state.universes.filter((universe) => universe.status === "active");
	});
	const developingUniverses = computed(() => {
		return state.universes.filter((universe) => universe.status === "developing");
	});
	const visibleUniverses = computed(() => {
		return state.universes.filter((universe) => universe.status !== "archived");
	});
	const universeStats = computed(() => {
		const stats = {
			total: state.universes.length,
			active: 0,
			developing: 0,
			maintenance: 0,
			archived: 0
		};
		state.universes.forEach((universe) => {
			stats[universe.status]++;
		});
		return stats;
	});
	const hasActiveUniverses = computed(() => {
		return activeUniverses.value.length > 0;
	});
	const isLoading = computed(() => state.loading);
	const hasError = computed(() => state.error.hasError);
	const errorMessage = computed(() => state.error.message);
	async function loadUniverses(refresh = false) {
		if (state.loading) {
			console.log("[Portal] 已在加载中，跳过重复请求");
			return;
		}
		try {
			console.log("[Portal] 开始加载宇宙列表, refresh:", refresh);
			state.loading = true;
			clearError();
			if (!refresh && state.universes.length > 0) {
				console.log("[Portal] 缓存数据存在且不需要刷新，直接返回");
				state.loading = false;
				return;
			}
			const api = initializeApiServices();
			const portalService = api.getPortalService();
			try {
				const response = await portalService.getUniverseList({
					refresh,
					includeAnalytics: false
				});
				if (response.status === "success" && response.universes) state.universes = response.universes;
				else throw new Error(response.message || "获取宇宙列表失败");
			} catch (apiError) {
				console.warn("API调用失败，使用硬编码数据作为降级方案:", apiError);
				await simulateApiCall();
				state.universes = [
					{
						id: "zhou",
						name: "周与春秋练习",
						description: "基于吴任几《周与春秋练习》系列诗歌的互动体验，通过问答与解诗探索古典诗歌的现代意义。",
						status: "active",
						meta: "诗歌问答 · 古典解读",
						version: "2.0.0",
						lastUpdated: "2025-08-28"
					},
					{
						id: "maoxiaodou",
						name: "毛小豆故事演绎",
						description: "毛小豆宇宙的奇幻冒险，包含前篇、正篇、番外的完整故事体系。",
						status: "developing",
						meta: "故事世界 · 角色扮演",
						version: "0.8.0",
						lastUpdated: "2025-08-15"
					},
					{
						id: "poet_universe",
						name: "诗人宇宙",
						description: "探索多位诗人的世界观和创作理念，通过AI对话体验不同的诗歌美学。",
						status: "developing",
						meta: "诗人对话 · AI体验",
						version: "0.3.0",
						lastUpdated: "2025-08-01"
					}
				];
			}
			console.log("[Portal] 宇宙列表加载成功:", {
				total: state.universes.length,
				active: activeUniverses.value.length,
				developing: developingUniverses.value.length
			});
		} catch (error) {
			console.error("加载宇宙列表失败:", error);
			if (isApiError(error)) {
				state.error.hasError = true;
				state.error.message = error.message;
				state.error.code = error.code;
			} else {
				state.error.hasError = true;
				state.error.message = error instanceof Error ? error.message : "加载宇宙列表失败";
			}
		} finally {
			console.log("[Portal] 加载完成，重置loading状态");
			state.loading = false;
		}
	}
	async function simulateApiCall() {
		const delay = Math.random() * 1e3 + 500;
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
	async function refreshUniverses() {
		return loadUniverses(true);
	}
	async function selectUniverse(universe) {
		state.selectedUniverse = universe;
		console.log("选择宇宙:", universe.name);
		try {
			const api = initializeApiServices();
			const portalService = api.getPortalService();
			await portalService.recordUniverseVisit(universe.id, "portal");
		} catch (error) {
			console.warn("记录宇宙访问失败:", error);
		}
	}
	function getUniverseNavigationPath(universeId) {
		const id = String(universeId);
		return navigationConfig[id] || "/";
	}
	function isUniverseAccessible(universe) {
		return universe.status === "active";
	}
	async function checkUniverseAccessPermission(universeId) {
		try {
			const api = initializeApiServices();
			const portalService = api.getPortalService();
			return await portalService.checkUniverseAccess(universeId);
		} catch (error) {
			console.warn("检查宇宙访问权限失败:", error);
			const universe = findUniverseById(universeId);
			return {
				accessible: universe ? isUniverseAccessible(universe) : false,
				reason: universe?.status !== "active" ? `宇宙状态：${getUniverseStatusText(universe?.status || "archived")}` : void 0
			};
		}
	}
	function getUniverseStatusText(status) {
		const statusMap = {
			active: "已上线",
			developing: "开发中",
			maintenance: "维护中",
			archived: "已归档"
		};
		return statusMap[status] || "未知";
	}
	function findUniverseById(id) {
		return state.universes.find((universe) => universe.id === id);
	}
	function clearError() {
		state.error.hasError = false;
		state.error.message = "";
		state.error.code = void 0;
	}
	function setError(message, code) {
		state.error.hasError = true;
		state.error.message = message;
		state.error.code = code;
	}
	async function retryLoad() {
		clearError();
		return loadUniverses(true);
	}
	function resetPortalState() {
		state.universes = [];
		state.selectedUniverse = void 0;
		clearError();
		console.log("Portal状态已重置");
	}
	function updateUniverse(universeId, updates) {
		const index = state.universes.findIndex((u) => u.id === universeId);
		if (index !== -1) {
			state.universes[index] = {
				...state.universes[index],
				...updates
			};
			console.log("宇宙信息已更新:", universeId, updates);
		}
	}
	function addUniverse(universe) {
		const exists = state.universes.some((u) => u.id === universe.id);
		if (!exists) {
			state.universes.push(universe);
			console.log("新宇宙已添加:", universe.name);
		}
	}
	function isDataStale() {
		return state.universes.length === 0;
	}
	async function preloadUniverseData() {
		console.log("[Portal] 预加载宇宙数据开始, isDataStale:", isDataStale(), "currentLoading:", state.loading);
		if (isDataStale()) {
			console.log("[Portal] 数据过期，开始加载");
			await loadUniverses();
		} else {
			console.log("[Portal] 数据新鲜，确保loading状态正确");
			if (state.loading && state.universes.length > 0) {
				console.log("[Portal] 检测到状态冲突，重置loading状态");
				state.loading = false;
			}
		}
		console.log("[Portal] 预加载完成, finalLoading:", state.loading, "universes:", state.universes.length);
	}
	return {
		state,
		activeUniverses,
		developingUniverses,
		visibleUniverses,
		universeStats,
		hasActiveUniverses,
		isLoading,
		hasError,
		errorMessage,
		loadUniverses,
		refreshUniverses,
		preloadUniverseData,
		selectUniverse,
		getUniverseNavigationPath,
		isUniverseAccessible,
		checkUniverseAccessPermission,
		getUniverseStatusText,
		findUniverseById,
		clearError,
		setError,
		retryLoad,
		resetPortalState,
		updateUniverse,
		addUniverse,
		isDataStale
	};
});

//#endregion
//#region src/modules/portal/views/UniversePortal.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "universe-portal" };
const _hoisted_2 = { class: "portal-header" };
const _hoisted_3 = { class: "header-content" };
const _hoisted_4 = { class: "user-nav" };
const _hoisted_5 = { class: "desktop-nav" };
const _hoisted_6 = {
	key: 0,
	class: "user-nav-logged-in"
};
const _hoisted_7 = { class: "user-name" };
const _hoisted_8 = {
	key: 1,
	class: "user-nav-logged-out"
};
const _hoisted_9 = {
	key: 0,
	class: "mobile-nav"
};
const _hoisted_10 = { class: "username-mobile" };
const _hoisted_11 = { class: "menu-icon" };
const _hoisted_12 = {
	key: 1,
	class: "mobile-nav-logged-out"
};
const _hoisted_13 = { class: "universes-container" };
const _hoisted_14 = {
	key: 3,
	class: "universes-grid"
};
const _hoisted_15 = { class: "site-footer" };
const _hoisted_16 = { class: "copyright" };
var UniversePortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "UniversePortal",
	setup(__props) {
		const router = useRouter();
		const portalStore = usePortalStore();
		const isLoggedIn = computed(() => isAuthenticated());
		const username = computed(() => getUsername() || "用户");
		const isMenuOpen = ref(false);
		const showToast = ref(false);
		const toastMessage = ref("");
		const toastType = ref("info");
		const currentYear = computed(() => (/* @__PURE__ */ new Date()).getFullYear());
		const loading = computed(() => portalStore.isLoading);
		const error = computed(() => ({
			hasError: portalStore.hasError,
			message: portalStore.errorMessage
		}));
		const universes = computed(() => portalStore.visibleUniverses);
		const showToastMessage = (message, type = "info") => {
			toastMessage.value = message;
			toastType.value = type;
			showToast.value = true;
		};
		const navigateToUniverse = async (universe) => {
			await portalStore.selectUniverse(universe);
			if (!portalStore.isUniverseAccessible(universe)) {
				const statusMessages = {
					developing: `${universe.name} 正在紧张开发中，敬请期待！🚧`,
					maintenance: `${universe.name} 正在维护升级，请稍后再来～🔧`,
					archived: `${universe.name} 已暂时下线，感谢您的关注！📦`
				};
				const message = statusMessages[universe.status] || `${universe.name} 暂时无法访问`;
				showToastMessage(message, "info");
				return;
			}
			const navigationPath = portalStore.getUniverseNavigationPath(universe.id);
			showToastMessage(`正在进入 ${universe.name}～`, "success");
			router.push(navigationPath);
		};
		const toggleMenu = () => {
			isMenuOpen.value = !isMenuOpen.value;
		};
		const closeMenu = () => {
			isMenuOpen.value = false;
		};
		const handleMenuLogout = () => {
			closeMenu();
			handleLogout();
		};
		const handleClickOutside = (event) => {
			const target = event.target;
			if (isMenuOpen.value && !target.closest(".mobile-nav")) isMenuOpen.value = false;
		};
		const handleLogout = () => {
			localStorage.removeItem("token");
			showToastMessage("已退出登录", "success");
			window.location.reload();
		};
		onMounted(async () => {
			await portalStore.preloadUniverseData();
			document.addEventListener("click", handleClickOutside);
		});
		onUnmounted(() => {
			document.removeEventListener("click", handleClickOutside);
		});
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createBaseVNode("header", _hoisted_2, [createBaseVNode("div", _hoisted_3, [_cache[8] || (_cache[8] = createBaseVNode("div", { class: "title-section" }, [createBaseVNode("h1", { class: "portal-title" }, "陆家花园"), createBaseVNode("p", { class: "portal-subtitle" }, "诗歌宇宙的探索入口")], -1)), createBaseVNode("nav", _hoisted_4, [createBaseVNode("div", _hoisted_5, [isLoggedIn.value ? (openBlock(), createElementBlock("div", _hoisted_6, [
					createBaseVNode("span", _hoisted_7, toDisplayString(username.value), 1),
					_cache[3] || (_cache[3] = createBaseVNode("span", { class: "nav-divider" }, "|", -1)),
					createVNode(_component_router_link, {
						to: "/my-works",
						class: "nav-link"
					}, {
						default: withCtx(() => _cache[2] || (_cache[2] = [createTextVNode("我的作品", -1)])),
						_: 1,
						__: [2]
					}),
					_cache[4] || (_cache[4] = createBaseVNode("span", { class: "nav-divider" }, "|", -1)),
					createBaseVNode("button", {
						onClick: handleLogout,
						class: "nav-link logout-btn"
					}, "退出")
				])) : (openBlock(), createElementBlock("div", _hoisted_8, [createVNode(_component_router_link, {
					to: "/login",
					class: "login-btn"
				}, {
					default: withCtx(() => _cache[5] || (_cache[5] = [createTextVNode("登录/注册", -1)])),
					_: 1,
					__: [5]
				})]))]), isLoggedIn.value ? (openBlock(), createElementBlock("div", _hoisted_9, [createBaseVNode("button", {
					onClick: toggleMenu,
					class: "menu-toggle-btn"
				}, [createBaseVNode("span", _hoisted_10, toDisplayString(username.value), 1), createBaseVNode("span", _hoisted_11, toDisplayString(isMenuOpen.value ? "✕" : "⋮"), 1)]), createVNode(Transition, { name: "dropdown" }, {
					default: withCtx(() => [isMenuOpen.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: "dropdown-menu",
						onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
					}, [createVNode(_component_router_link, {
						to: "/my-works",
						onClick: closeMenu,
						class: "menu-item"
					}, {
						default: withCtx(() => [createVNode(unref(render), { class: "menu-item-icon" }), _cache[6] || (_cache[6] = createTextVNode(" 我的作品 ", -1))]),
						_: 1,
						__: [6]
					}), createBaseVNode("button", {
						onClick: handleMenuLogout,
						class: "menu-item menu-item-logout"
					}, " ↗ 退出 ")])) : createCommentVNode("", true)]),
					_: 1
				})])) : (openBlock(), createElementBlock("div", _hoisted_12, [createVNode(_component_router_link, {
					to: "/login",
					class: "login-btn-mobile"
				}, {
					default: withCtx(() => _cache[7] || (_cache[7] = [createTextVNode("登录/注册", -1)])),
					_: 1,
					__: [7]
				})]))])])]),
				createBaseVNode("main", _hoisted_13, [loading.value ? (openBlock(), createBlock(unref(LoadingSpinner_default), {
					key: 0,
					message: "正在加载宇宙列表...",
					size: "large"
				})) : error.value.hasError ? (openBlock(), createBlock(unref(ErrorState_default), {
					key: 1,
					message: error.value.message,
					onRetry: unref(portalStore).retryLoad
				}, null, 8, ["message", "onRetry"])) : universes.value.length === 0 ? (openBlock(), createBlock(unref(EmptyState_default), {
					key: 2,
					title: "暂无可用宇宙",
					description: "目前还没有已上线的宇宙项目，请稍后再来探索吧～",
					icon: "🌌",
					"show-action": true,
					"action-text": "刷新列表",
					onAction: unref(portalStore).refreshUniverses
				}, null, 8, ["onAction"])) : (openBlock(), createElementBlock("div", _hoisted_14, [(openBlock(true), createElementBlock(Fragment, null, renderList(universes.value, (universe, index) => {
					return openBlock(), createBlock(unref(UniverseCard_default), {
						key: universe.id,
						universe,
						index,
						onClick: navigateToUniverse,
						onEnter: navigateToUniverse
					}, null, 8, ["universe", "index"]);
				}), 128))]))]),
				createBaseVNode("footer", _hoisted_15, [
					createBaseVNode("p", _hoisted_16, "© " + toDisplayString(currentYear.value) + " 陆家花园", 1),
					_cache[9] || (_cache[9] = createBaseVNode("a", {
						href: "https://beian.miit.gov.cn",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "beian-link icp-beian"
					}, " 沪ICP备2025147783号 ", -1)),
					_cache[10] || (_cache[10] = createBaseVNode("a", {
						href: "https://www.beian.gov.cn/portal/registerSystemInfo",
						target: "_blank",
						rel: "noopener noreferrer",
						class: "beian-link police-beian"
					}, " 沪公网安备31010702009727号 ", -1))
				]),
				showToast.value ? (openBlock(), createBlock(unref(NotificationToast_default), {
					key: 0,
					message: toastMessage.value,
					type: toastType.value,
					duration: 3e3,
					onClose: _cache[1] || (_cache[1] = ($event) => showToast.value = false)
				}, null, 8, ["message", "type"])) : createCommentVNode("", true)
			]);
		};
	}
});

//#endregion
//#region src/modules/portal/views/UniversePortal.vue
var UniversePortal_default = /* @__PURE__ */ __plugin_vue_export_helper_default(UniversePortal_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a84d6dfc"]]);

//#endregion
export { UniversePortal_default as default };