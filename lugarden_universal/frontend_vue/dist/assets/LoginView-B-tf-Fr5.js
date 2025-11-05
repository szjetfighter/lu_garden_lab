import { A as defineComponent, D as openBlock, G as resolveComponent, I as watch, J as withCtx, K as withDirectives, M as ref, N as unref, O as normalizeClass, Q as toDisplayString, g as useRoute, h as useRouter, i as __plugin_vue_export_helper_default, l as vModelCheckbox, m as vModelText, p as withModifiers, t as createBaseVNode, v as createCommentVNode, w as createElementBlock, y as createTextVNode, z as createVNode } from "./index-BSnbBRtO.js";
import { b as checkUsername, i as login, j as register, k as saveGongBiWork, l as saveToken } from "./authApi-Ckm-lhus.js";
import { b as BackButton_default } from "./BackButton-BK4mq5-w.js";
import { b as render$3 } from "./ExclamationTriangleIcon-jreoU3Tl.js";
import { b as render } from "./InformationCircleIcon-BOeUYuVf.js";

//#region node_modules/@heroicons/vue/24/outline/esm/CheckCircleIcon.js
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
		d: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
	})]);
}

//#endregion
//#region node_modules/@heroicons/vue/24/outline/esm/XCircleIcon.js
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
		d: "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
	})]);
}

//#endregion
//#region src/core/auth/views/LoginView.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "login-container" };
const _hoisted_2 = { class: "back-button-container" };
const _hoisted_3 = { class: "login-card unified-content-card" };
const _hoisted_4 = { class: "tabs" };
const _hoisted_5 = { class: "form-group" };
const _hoisted_6 = ["disabled"];
const _hoisted_7 = { class: "form-group" };
const _hoisted_8 = ["disabled"];
const _hoisted_9 = ["disabled"];
const _hoisted_10 = {
	key: 0,
	class: "error-message"
};
const _hoisted_11 = { class: "form-group" };
const _hoisted_12 = { class: "label-with-info" };
const _hoisted_13 = ["disabled"];
const _hoisted_14 = {
	key: 0,
	class: "username-check-feedback"
};
const _hoisted_15 = {
	key: 0,
	class: "check-checking"
};
const _hoisted_16 = {
	key: 1,
	class: "check-available"
};
const _hoisted_17 = {
	key: 2,
	class: "check-unavailable"
};
const _hoisted_18 = {
	key: 3,
	class: "check-invalid"
};
const _hoisted_19 = { class: "form-group" };
const _hoisted_20 = ["disabled"];
const _hoisted_21 = { class: "form-group" };
const _hoisted_22 = ["disabled"];
const _hoisted_23 = { class: "form-group agreement-group" };
const _hoisted_24 = { class: "agreement-checkbox" };
const _hoisted_25 = ["disabled"];
const _hoisted_26 = { class: "agreement-text" };
const _hoisted_27 = ["disabled"];
const _hoisted_28 = {
	key: 0,
	class: "error-message"
};
const _hoisted_29 = {
	key: 1,
	class: "success-message"
};
const _hoisted_30 = { class: "bg-white rounded-lg shadow-2xl border border-gray-100 py-3 px-4 max-w-xs w-full" };
const _hoisted_31 = { class: "mt-3 pt-2 border-t border-gray-100" };
var LoginView_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "LoginView",
	setup(__props) {
		const router = useRouter();
		const route = useRoute();
		const activeTab = ref(route.query.tab || "login");
		const loading = ref(false);
		const errorMessage = ref("");
		const successMessage = ref("");
		const loginForm = ref({
			username: "",
			password: ""
		});
		const savedRegisterData = localStorage.getItem("temp_register_form");
		const registerForm = ref(savedRegisterData ? JSON.parse(savedRegisterData) : {
			username: "",
			password: "",
			confirmPassword: ""
		});
		const agreeToTerms = ref(false);
		const showUsernameInfo = ref(false);
		const usernameCheckStatus = ref("idle");
		const usernameCheckMessage = ref("");
		let usernameCheckTimeout = null;
		watch(registerForm, (newValue) => {
			if (newValue.username || newValue.password || newValue.confirmPassword) localStorage.setItem("temp_register_form", JSON.stringify(newValue));
		}, { deep: true });
		watch(activeTab, () => {
			errorMessage.value = "";
			successMessage.value = "";
			agreeToTerms.value = false;
			usernameCheckStatus.value = "idle";
			usernameCheckMessage.value = "";
		});
		const goHome = () => {
			router.push("/");
		};
		const handleUsernameBlur = () => {
			const username = registerForm.value.username.trim();
			if (usernameCheckTimeout !== null) clearTimeout(usernameCheckTimeout);
			if (!username) {
				usernameCheckStatus.value = "idle";
				usernameCheckMessage.value = "";
				return;
			}
			usernameCheckTimeout = window.setTimeout(async () => {
				usernameCheckStatus.value = "checking";
				usernameCheckMessage.value = "检查中...";
				try {
					const result = await checkUsername(username);
					if (result.available) {
						usernameCheckStatus.value = "available";
						usernameCheckMessage.value = "用户名可用";
					} else {
						if (result.reason === "invalid_format") usernameCheckStatus.value = "invalid";
						else usernameCheckStatus.value = "unavailable";
						usernameCheckMessage.value = result.message;
					}
				} catch (error) {
					usernameCheckStatus.value = "idle";
					usernameCheckMessage.value = "";
				}
			}, 500);
		};
		const checkAndSavePendingWork = async () => {
			try {
				const pendingWorkStr = localStorage.getItem("pending_gongbi_work");
				if (!pendingWorkStr) return;
				const pendingWork = JSON.parse(pendingWorkStr);
				const { poem, urlParams, timestamp } = pendingWork;
				const now = Date.now();
				const expireTime = 1800 * 1e3;
				if (now - timestamp > expireTime) {
					console.log("[LoginView] 临时数据已过期，清除");
					localStorage.removeItem("pending_gongbi_work");
					return;
				}
				console.log("[LoginView] 检测到未保存的共笔作品，开始保存");
				const sourcePoemId = `zhou_${urlParams.chapter}_${urlParams.poem}`;
				const mappingId = `${urlParams.chapter}_${urlParams.pattern}`;
				const result = await saveGongBiWork({
					sourcePoemId,
					mappingId,
					userInput: poem.userFeeling,
					poemTitle: poem.title,
					poemContent: poem.content,
					poemQuote: poem.quote || null,
					poemQuoteSource: poem.quoteSource || null,
					conversationId: poem.metadata?.conversationId || "",
					messageId: poem.metadata?.messageId || "",
					usageMetadata: poem.metadata || {}
				});
				if (result.success) {
					console.log("[LoginView] 临时作品保存成功");
					localStorage.removeItem("pending_gongbi_work");
				} else console.error("[LoginView] 临时作品保存失败:", result.error);
			} catch (err) {
				console.error("[LoginView] 处理临时作品异常:", err);
			}
		};
		const handleLogin = async () => {
			errorMessage.value = "";
			loading.value = true;
			try {
				const response = await login({
					username: loginForm.value.username,
					password: loginForm.value.password
				});
				if (response.success && response.token) {
					saveToken(response.token);
					await checkAndSavePendingWork();
					const redirect = route.query.redirect;
					router.push(redirect || "/my-works");
				} else errorMessage.value = response.error || "登录失败";
			} catch (error) {
				errorMessage.value = error.message || "登录失败";
			} finally {
				loading.value = false;
			}
		};
		const handleRegister = async () => {
			errorMessage.value = "";
			successMessage.value = "";
			if (registerForm.value.username.length < 3 || registerForm.value.username.length > 20) {
				errorMessage.value = "用户名必须是3-20个字符";
				return;
			}
			if (registerForm.value.password.length < 6) {
				errorMessage.value = "密码至少需要6个字符";
				return;
			}
			if (registerForm.value.password !== registerForm.value.confirmPassword) {
				errorMessage.value = "两次密码输入不一致";
				return;
			}
			if (!agreeToTerms.value) {
				errorMessage.value = "请阅读并同意用户协议和隐私政策";
				return;
			}
			loading.value = true;
			try {
				const response = await register({
					username: registerForm.value.username,
					password: registerForm.value.password,
					confirmPassword: registerForm.value.confirmPassword
				});
				if (response.success) {
					successMessage.value = "注册成功！正在跳转到登录...";
					registerForm.value = {
						username: "",
						password: "",
						confirmPassword: ""
					};
					localStorage.removeItem("temp_register_form");
					setTimeout(() => {
						activeTab.value = "login";
						successMessage.value = "";
						loginForm.value.username = registerForm.value.username;
					}, 2e3);
				} else errorMessage.value = response.error || "注册失败";
			} catch (error) {
				errorMessage.value = error.message || "注册失败";
			} finally {
				loading.value = false;
			}
		};
		return (_ctx, _cache) => {
			const _component_router_link = resolveComponent("router-link");
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createVNode(BackButton_default, {
				text: "返回",
				onClick: goHome
			})]), createBaseVNode("div", _hoisted_3, [
				_cache[25] || (_cache[25] = createBaseVNode("h1", { class: "page-title" }, "陆家花园", -1)),
				_cache[26] || (_cache[26] = createBaseVNode("p", { class: "page-subtitle" }, "让您的诗歌创作有归属", -1)),
				createBaseVNode("div", _hoisted_4, [createBaseVNode("button", {
					class: normalizeClass(["tab-button", { active: activeTab.value === "login" }]),
					onClick: _cache[0] || (_cache[0] = ($event) => activeTab.value = "login")
				}, " 登录 ", 2), createBaseVNode("button", {
					class: normalizeClass(["tab-button", { active: activeTab.value === "register" }]),
					onClick: _cache[1] || (_cache[1] = ($event) => activeTab.value = "register")
				}, " 注册 ", 2)]),
				activeTab.value === "login" ? (openBlock(), createElementBlock("form", {
					key: 0,
					onSubmit: withModifiers(handleLogin, ["prevent"]),
					class: "auth-form"
				}, [
					createBaseVNode("div", _hoisted_5, [_cache[12] || (_cache[12] = createBaseVNode("label", { for: "login-username" }, "用户名", -1)), withDirectives(createBaseVNode("input", {
						id: "login-username",
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => loginForm.value.username = $event),
						type: "text",
						placeholder: "请输入用户名",
						required: "",
						disabled: loading.value
					}, null, 8, _hoisted_6), [[vModelText, loginForm.value.username]])]),
					createBaseVNode("div", _hoisted_7, [_cache[13] || (_cache[13] = createBaseVNode("label", { for: "login-password" }, "密码", -1)), withDirectives(createBaseVNode("input", {
						id: "login-password",
						"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => loginForm.value.password = $event),
						type: "password",
						placeholder: "请输入密码",
						required: "",
						disabled: loading.value
					}, null, 8, _hoisted_8), [[vModelText, loginForm.value.password]])]),
					createBaseVNode("button", {
						type: "submit",
						class: "btn-primary",
						disabled: loading.value
					}, toDisplayString(loading.value ? "登录中..." : "登录"), 9, _hoisted_9),
					errorMessage.value ? (openBlock(), createElementBlock("p", _hoisted_10, toDisplayString(errorMessage.value), 1)) : createCommentVNode("", true)
				], 32)) : createCommentVNode("", true),
				activeTab.value === "register" ? (openBlock(), createElementBlock("form", {
					key: 1,
					onSubmit: withModifiers(handleRegister, ["prevent"]),
					class: "auth-form"
				}, [
					createBaseVNode("div", _hoisted_11, [
						createBaseVNode("div", _hoisted_12, [_cache[14] || (_cache[14] = createBaseVNode("label", { for: "register-username" }, "用户名", -1)), createBaseVNode("button", {
							onClick: _cache[4] || (_cache[4] = ($event) => showUsernameInfo.value = true),
							class: "username-info-icon",
							"aria-label": "用户名用途说明",
							type: "button"
						}, [createVNode(unref(render), { class: "w-4 h-4" })])]),
						withDirectives(createBaseVNode("input", {
							id: "register-username",
							"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => registerForm.value.username = $event),
							type: "text",
							placeholder: "3-20个字符",
							required: "",
							minlength: "3",
							maxlength: "20",
							disabled: loading.value,
							onBlur: handleUsernameBlur
						}, null, 40, _hoisted_13), [[vModelText, registerForm.value.username]]),
						usernameCheckStatus.value !== "idle" ? (openBlock(), createElementBlock("div", _hoisted_14, [usernameCheckStatus.value === "checking" ? (openBlock(), createElementBlock("span", _hoisted_15, toDisplayString(usernameCheckMessage.value), 1)) : usernameCheckStatus.value === "available" ? (openBlock(), createElementBlock("span", _hoisted_16, [createVNode(unref(render$1), { class: "check-icon" }), createTextVNode(" " + toDisplayString(usernameCheckMessage.value), 1)])) : usernameCheckStatus.value === "unavailable" ? (openBlock(), createElementBlock("span", _hoisted_17, [createVNode(unref(render$2), { class: "check-icon" }), createTextVNode(" " + toDisplayString(usernameCheckMessage.value), 1)])) : usernameCheckStatus.value === "invalid" ? (openBlock(), createElementBlock("span", _hoisted_18, [createVNode(unref(render$3), { class: "check-icon" }), createTextVNode(" " + toDisplayString(usernameCheckMessage.value), 1)])) : createCommentVNode("", true)])) : createCommentVNode("", true)
					]),
					createBaseVNode("div", _hoisted_19, [_cache[15] || (_cache[15] = createBaseVNode("label", { for: "register-password" }, "密码", -1)), withDirectives(createBaseVNode("input", {
						id: "register-password",
						"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => registerForm.value.password = $event),
						type: "password",
						placeholder: "至少6个字符",
						required: "",
						minlength: "6",
						disabled: loading.value
					}, null, 8, _hoisted_20), [[vModelText, registerForm.value.password]])]),
					createBaseVNode("div", _hoisted_21, [_cache[16] || (_cache[16] = createBaseVNode("label", { for: "register-confirm-password" }, "确认密码", -1)), withDirectives(createBaseVNode("input", {
						id: "register-confirm-password",
						"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => registerForm.value.confirmPassword = $event),
						type: "password",
						placeholder: "再次输入密码",
						required: "",
						minlength: "6",
						disabled: loading.value
					}, null, 8, _hoisted_22), [[vModelText, registerForm.value.confirmPassword]])]),
					createBaseVNode("div", _hoisted_23, [createBaseVNode("label", _hoisted_24, [withDirectives(createBaseVNode("input", {
						id: "agree-to-terms",
						"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => agreeToTerms.value = $event),
						type: "checkbox",
						disabled: loading.value
					}, null, 8, _hoisted_25), [[vModelCheckbox, agreeToTerms.value]]), createBaseVNode("span", _hoisted_26, [
						_cache[19] || (_cache[19] = createTextVNode(" 我已阅读并同意 ", -1)),
						createVNode(_component_router_link, {
							to: {
								path: "/terms",
								query: { from: "register" }
							},
							class: "agreement-link"
						}, {
							default: withCtx(() => _cache[17] || (_cache[17] = [createTextVNode("《用户协议》", -1)])),
							_: 1,
							__: [17]
						}),
						_cache[20] || (_cache[20] = createTextVNode(" 和 ", -1)),
						createVNode(_component_router_link, {
							to: {
								path: "/privacy",
								query: { from: "register" }
							},
							class: "agreement-link"
						}, {
							default: withCtx(() => _cache[18] || (_cache[18] = [createTextVNode("《隐私政策》", -1)])),
							_: 1,
							__: [18]
						})
					])])]),
					createBaseVNode("button", {
						type: "submit",
						class: "btn-primary",
						disabled: loading.value || !agreeToTerms.value || usernameCheckStatus.value !== "available"
					}, toDisplayString(loading.value ? "注册中..." : "注册"), 9, _hoisted_27),
					errorMessage.value ? (openBlock(), createElementBlock("p", _hoisted_28, toDisplayString(errorMessage.value), 1)) : createCommentVNode("", true),
					successMessage.value ? (openBlock(), createElementBlock("p", _hoisted_29, toDisplayString(successMessage.value), 1)) : createCommentVNode("", true)
				], 32)) : createCommentVNode("", true),
				showUsernameInfo.value && activeTab.value === "register" ? (openBlock(), createElementBlock("div", {
					key: 2,
					class: "fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center px-4",
					onClick: _cache[11] || (_cache[11] = ($event) => showUsernameInfo.value = false)
				}, [createBaseVNode("div", {
					class: "username-info-modal animate-fadeInUp",
					onClick: _cache[10] || (_cache[10] = withModifiers(() => {}, ["stop"]))
				}, [createBaseVNode("div", _hoisted_30, [
					_cache[21] || (_cache[21] = createBaseVNode("h4", { class: "text-sm font-bold mb-2 text-center" }, "注", -1)),
					_cache[22] || (_cache[22] = createBaseVNode("p", { class: "text-sm text-gray-700 leading-relaxed" }, " 您的用户名会用在共笔功能的署名处。 ", -1)),
					_cache[23] || (_cache[23] = createBaseVNode("p", { class: "text-sm text-gray-700 leading-relaxed mt-2" }, " 建议使用有意义的笔名，而非随意的字符组合。 ", -1)),
					_cache[24] || (_cache[24] = createBaseVNode("p", { class: "text-sm text-gray-700 leading-relaxed mt-2" }, " 注册后用户名无法修改。 ", -1)),
					createBaseVNode("div", _hoisted_31, [createBaseVNode("button", {
						onClick: _cache[9] || (_cache[9] = ($event) => showUsernameInfo.value = false),
						class: "w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
					}, " 知道了 ")])
				])])])) : createCommentVNode("", true)
			])]);
		};
	}
});

//#endregion
//#region src/core/auth/views/LoginView.vue
var LoginView_default = /* @__PURE__ */ __plugin_vue_export_helper_default(LoginView_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0d89ec58"]]);

//#endregion
export { LoginView_default as default };