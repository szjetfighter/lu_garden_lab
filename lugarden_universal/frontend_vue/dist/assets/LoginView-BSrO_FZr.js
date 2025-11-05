import { A as defineComponent, D as openBlock, G as resolveComponent, I as watch, J as withCtx, K as withDirectives, M as ref, O as normalizeClass, Q as toDisplayString, g as useRoute, h as useRouter, i as __plugin_vue_export_helper_default, l as vModelCheckbox, m as vModelText, p as withModifiers, t as createBaseVNode, v as createCommentVNode, w as createElementBlock, y as createTextVNode, z as createVNode } from "./index-0cj-Hd_i.js";
import { h as login, i as register, j as saveGongBiWork, k as saveToken } from "./authApi-DMUWcRXB.js";
import { b as BackButton_default } from "./BackButton-CfwVcQyt.js";

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
const _hoisted_12 = ["disabled"];
const _hoisted_13 = { class: "form-group" };
const _hoisted_14 = ["disabled"];
const _hoisted_15 = { class: "form-group" };
const _hoisted_16 = ["disabled"];
const _hoisted_17 = { class: "form-group agreement-group" };
const _hoisted_18 = { class: "agreement-checkbox" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = { class: "agreement-text" };
const _hoisted_21 = ["disabled"];
const _hoisted_22 = {
	key: 0,
	class: "error-message"
};
const _hoisted_23 = {
	key: 1,
	class: "success-message"
};
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
		watch(registerForm, (newValue) => {
			if (newValue.username || newValue.password || newValue.confirmPassword) localStorage.setItem("temp_register_form", JSON.stringify(newValue));
		}, { deep: true });
		watch(activeTab, () => {
			errorMessage.value = "";
			successMessage.value = "";
			agreeToTerms.value = false;
		});
		const goHome = () => {
			router.push("/");
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
				_cache[17] || (_cache[17] = createBaseVNode("h1", { class: "page-title" }, "陆家花园", -1)),
				_cache[18] || (_cache[18] = createBaseVNode("p", { class: "page-subtitle" }, "让您的诗歌创作有归属", -1)),
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
					createBaseVNode("div", _hoisted_5, [_cache[8] || (_cache[8] = createBaseVNode("label", { for: "login-username" }, "用户名", -1)), withDirectives(createBaseVNode("input", {
						id: "login-username",
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => loginForm.value.username = $event),
						type: "text",
						placeholder: "请输入用户名",
						required: "",
						disabled: loading.value
					}, null, 8, _hoisted_6), [[vModelText, loginForm.value.username]])]),
					createBaseVNode("div", _hoisted_7, [_cache[9] || (_cache[9] = createBaseVNode("label", { for: "login-password" }, "密码", -1)), withDirectives(createBaseVNode("input", {
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
					createBaseVNode("div", _hoisted_11, [_cache[10] || (_cache[10] = createBaseVNode("label", { for: "register-username" }, "用户名", -1)), withDirectives(createBaseVNode("input", {
						id: "register-username",
						"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => registerForm.value.username = $event),
						type: "text",
						placeholder: "3-20个字符",
						required: "",
						minlength: "3",
						maxlength: "20",
						disabled: loading.value
					}, null, 8, _hoisted_12), [[vModelText, registerForm.value.username]])]),
					createBaseVNode("div", _hoisted_13, [_cache[11] || (_cache[11] = createBaseVNode("label", { for: "register-password" }, "密码", -1)), withDirectives(createBaseVNode("input", {
						id: "register-password",
						"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => registerForm.value.password = $event),
						type: "password",
						placeholder: "至少6个字符",
						required: "",
						minlength: "6",
						disabled: loading.value
					}, null, 8, _hoisted_14), [[vModelText, registerForm.value.password]])]),
					createBaseVNode("div", _hoisted_15, [_cache[12] || (_cache[12] = createBaseVNode("label", { for: "register-confirm-password" }, "确认密码", -1)), withDirectives(createBaseVNode("input", {
						id: "register-confirm-password",
						"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => registerForm.value.confirmPassword = $event),
						type: "password",
						placeholder: "再次输入密码",
						required: "",
						minlength: "6",
						disabled: loading.value
					}, null, 8, _hoisted_16), [[vModelText, registerForm.value.confirmPassword]])]),
					createBaseVNode("div", _hoisted_17, [createBaseVNode("label", _hoisted_18, [withDirectives(createBaseVNode("input", {
						id: "agree-to-terms",
						"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => agreeToTerms.value = $event),
						type: "checkbox",
						disabled: loading.value
					}, null, 8, _hoisted_19), [[vModelCheckbox, agreeToTerms.value]]), createBaseVNode("span", _hoisted_20, [
						_cache[15] || (_cache[15] = createTextVNode(" 我已阅读并同意 ", -1)),
						createVNode(_component_router_link, {
							to: {
								path: "/terms",
								query: { from: "register" }
							},
							class: "agreement-link"
						}, {
							default: withCtx(() => _cache[13] || (_cache[13] = [createTextVNode("《用户协议》", -1)])),
							_: 1,
							__: [13]
						}),
						_cache[16] || (_cache[16] = createTextVNode(" 和 ", -1)),
						createVNode(_component_router_link, {
							to: {
								path: "/privacy",
								query: { from: "register" }
							},
							class: "agreement-link"
						}, {
							default: withCtx(() => _cache[14] || (_cache[14] = [createTextVNode("《隐私政策》", -1)])),
							_: 1,
							__: [14]
						})
					])])]),
					createBaseVNode("button", {
						type: "submit",
						class: "btn-primary",
						disabled: loading.value || !agreeToTerms.value
					}, toDisplayString(loading.value ? "注册中..." : "注册"), 9, _hoisted_21),
					errorMessage.value ? (openBlock(), createElementBlock("p", _hoisted_22, toDisplayString(errorMessage.value), 1)) : createCommentVNode("", true),
					successMessage.value ? (openBlock(), createElementBlock("p", _hoisted_23, toDisplayString(successMessage.value), 1)) : createCommentVNode("", true)
				], 32)) : createCommentVNode("", true)
			])]);
		};
	}
});

//#endregion
//#region src/core/auth/views/LoginView.vue
var LoginView_default = /* @__PURE__ */ __plugin_vue_export_helper_default(LoginView_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f44b6526"]]);

//#endregion
export { LoginView_default as default };