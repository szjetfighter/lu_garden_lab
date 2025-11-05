import { A as defineComponent, B as onMounted, C as onUnmounted, D as openBlock, E as renderList, F as renderSlot, H as resolveDynamicComponent, I as watch, J as withCtx, M as ref, O as normalizeClass, P as normalizeStyle, Q as toDisplayString, i as __plugin_vue_export_helper_default, k as Transition, q as Fragment, r as Teleport, s as computed, t as createBaseVNode, u as createBlock, v as createCommentVNode, w as createElementBlock, y as createTextVNode, z as createVNode } from "./index-BSnbBRtO.js";

//#region src/shared/components/AnimationWrapper.vue?vue&type=script&setup=true&lang.ts
var AnimationWrapper_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "AnimationWrapper",
	props: {
		animationType: { default: "fadeInUp" },
		mode: { default: "default" },
		duration: { default: 300 },
		appear: {
			type: Boolean,
			default: true
		},
		visible: {
			type: Boolean,
			default: true
		},
		animationKey: { default: "default" },
		delay: { default: 0 },
		disableAnimationOnMobile: {
			type: Boolean,
			default: false
		},
		respectReducedMotion: {
			type: Boolean,
			default: true
		},
		customTransitionName: { default: "" },
		wrapperClass: { default: "" },
		preserveAspectRatio: {
			type: Boolean,
			default: false
		},
		preventScrollJump: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		"beforeEnter",
		"enter",
		"afterEnter",
		"beforeLeave",
		"leave",
		"afterLeave",
		"enterCancelled",
		"leaveCancelled"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const isMobile = ref(false);
		const prefersReducedMotion = ref(false);
		const transitionName = computed(() => {
			if (props.customTransitionName) return props.customTransitionName;
			if (shouldDisableAnimation.value) return "no-animation";
			return `anim-${props.animationType}`;
		});
		const shouldDisableAnimation = computed(() => {
			if (props.respectReducedMotion && prefersReducedMotion.value) return true;
			if (props.disableAnimationOnMobile && isMobile.value) return true;
			return false;
		});
		const wrapperStyle = computed(() => {
			const style = {};
			if (props.delay > 0) style.animationDelay = `${props.delay}ms`;
			if (props.preserveAspectRatio) style.aspectRatio = "auto";
			return style;
		});
		const checkMobileDevice = () => {
			isMobile.value = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		};
		const checkReducedMotionPreference = () => {
			if (typeof window !== "undefined" && window.matchMedia) {
				const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
				prefersReducedMotion.value = mediaQuery.matches;
				mediaQuery.addEventListener("change", (e) => {
					prefersReducedMotion.value = e.matches;
				});
			}
		};
		const preventScrollJumpHandler = () => {
			if (props.preventScrollJump) document.body.style.overflow = "hidden";
		};
		const restoreScrollHandler = () => {
			if (props.preventScrollJump) document.body.style.overflow = "";
		};
		onMounted(() => {
			checkMobileDevice();
			checkReducedMotionPreference();
			window.addEventListener("resize", checkMobileDevice);
		});
		onUnmounted(() => {
			window.removeEventListener("resize", checkMobileDevice);
			restoreScrollHandler();
		});
		const handleBeforeEnter = (el) => {
			preventScrollJumpHandler();
			emit("beforeEnter", el);
		};
		const handleEnter = (el) => {
			emit("enter", el);
		};
		const handleAfterEnter = (el) => {
			restoreScrollHandler();
			emit("afterEnter", el);
		};
		const handleBeforeLeave = (el) => {
			preventScrollJumpHandler();
			emit("beforeLeave", el);
		};
		const handleLeave = (el) => {
			emit("leave", el);
		};
		const handleAfterLeave = (el) => {
			restoreScrollHandler();
			emit("afterLeave", el);
		};
		const handleEnterCancelled = (el) => {
			restoreScrollHandler();
			emit("enterCancelled", el);
		};
		const handleLeaveCancelled = (el) => {
			restoreScrollHandler();
			emit("leaveCancelled", el);
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Transition, {
				name: transitionName.value,
				mode: _ctx.mode,
				duration: _ctx.duration,
				appear: _ctx.appear,
				onBeforeEnter: handleBeforeEnter,
				onEnter: handleEnter,
				onAfterEnter: handleAfterEnter,
				onBeforeLeave: handleBeforeLeave,
				onLeave: handleLeave,
				onAfterLeave: handleAfterLeave,
				onEnterCancelled: handleEnterCancelled,
				onLeaveCancelled: handleLeaveCancelled
			}, {
				default: withCtx(() => [_ctx.visible ? (openBlock(), createElementBlock("div", {
					key: _ctx.animationKey,
					class: normalizeClass(["animation-wrapper", _ctx.wrapperClass]),
					style: normalizeStyle(wrapperStyle.value)
				}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 6)) : createCommentVNode("", true)]),
				_: 3
			}, 8, [
				"name",
				"mode",
				"duration",
				"appear"
			]);
		};
	}
});

//#endregion
//#region src/shared/components/AnimationWrapper.vue
var AnimationWrapper_default = /* @__PURE__ */ __plugin_vue_export_helper_default(AnimationWrapper_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e862d333"]]);

//#endregion
//#region src/shared/components/NotificationToast.vue?vue&type=script&setup=true&lang.ts
const _hoisted_1 = { class: "toast-content" };
const _hoisted_2 = {
	key: 0,
	class: "toast-title font-semibold mb-xs"
};
const _hoisted_3 = { class: "toast-message opacity-90 break-words" };
const _hoisted_4 = {
	key: 1,
	class: "toast-actions flex gap-sm mt-sm"
};
const _hoisted_5 = ["onClick"];
var NotificationToast_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "NotificationToast",
	props: {
		title: { default: "" },
		message: { default: "" },
		visible: {
			type: Boolean,
			default: false
		},
		type: { default: "info" },
		variant: { default: "filled" },
		size: { default: "medium" },
		position: { default: "top-right" },
		duration: { default: 4e3 },
		closable: {
			type: Boolean,
			default: true
		},
		hideCloseButton: {
			type: Boolean,
			default: false
		},
		pauseOnHover: {
			type: Boolean,
			default: true
		},
		clickToClose: {
			type: Boolean,
			default: false
		},
		showIcon: {
			type: Boolean,
			default: true
		},
		customIcon: { default: "" },
		actions: { default: () => [] },
		showActions: {
			type: Boolean,
			default: false
		},
		animation: { default: "slide" },
		showProgress: {
			type: Boolean,
			default: true
		},
		persistent: {
			type: Boolean,
			default: false
		},
		zIndex: { default: 1e3 },
		customClass: { default: "" },
		customColor: { default: "" },
		customBackgroundColor: { default: "" }
	},
	emits: [
		"close",
		"update:visible",
		"action",
		"click",
		"timeout"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const showToast = ref(false);
		const isPaused = ref(false);
		const progress = ref(100);
		const timeoutId = ref(null);
		const startTime = ref(0);
		const remainingTime = ref(0);
		const containerClass = computed(() => ({
			[`toast-container--${props.position}`]: true,
			[`toast-container--z-${props.zIndex}`]: true
		}));
		const toastClass = computed(() => ({
			[`toast--${props.type}`]: props.type !== "custom",
			[`toast--${props.variant}`]: true,
			[`toast--${props.size}`]: true,
			"text-xs max-sm:text-xs": props.size === "small",
			"text-sm max-md:text-xs": props.size === "medium",
			"text-base max-md:text-sm": props.size === "large",
			"toast--clickable": props.clickToClose,
			"toast--persistent": props.persistent,
			[props.customClass]: props.customClass
		}));
		const toastStyle = computed(() => {
			const style = { zIndex: props.zIndex.toString() };
			if (props.type === "custom") {
				if (props.customColor) style.color = props.customColor;
				if (props.customBackgroundColor) style.backgroundColor = props.customBackgroundColor;
			}
			return style;
		});
		const iconClass = computed(() => ({ [`toast-icon--${props.type}`]: props.type !== "custom" }));
		const iconSvgClass = computed(() => ({ [`icon--${props.type}`]: props.type !== "custom" }));
		const closeButtonClass = computed(() => ({ [`toast-close--${props.type}`]: props.type !== "custom" }));
		const transitionName = computed(() => {
			const position = props.position;
			switch (props.animation) {
				case "slide":
					if (position.includes("right")) return "slide-right";
					if (position.includes("left")) return "slide-left";
					if (position.includes("top")) return "slide-down";
					if (position.includes("bottom")) return "slide-up";
					return "slide-down";
				case "bounce": return "bounce";
				case "zoom": return "zoom";
				case "fade":
				default: return "fade";
			}
		});
		const iconComponent = computed(() => {
			if (props.customIcon) return props.customIcon;
			switch (props.type) {
				case "success": return "CheckCircleIcon";
				case "warning": return "ExclamationTriangleIcon";
				case "error": return "XCircleIcon";
				case "info":
				default: return "InformationCircleIcon";
			}
		});
		const progressStyle = computed(() => ({
			width: `${progress.value}%`,
			backgroundColor: getProgressColor()
		}));
		const getProgressColor = () => {
			switch (props.type) {
				case "success": return "#22c55e";
				case "warning": return "#f59e0b";
				case "error": return "#ef4444";
				case "info": return "#3b82f6";
				default: return props.customColor || "#3b82f6";
			}
		};
		const startTimer = () => {
			if (props.duration <= 0 || props.persistent) return;
			startTime.value = Date.now();
			remainingTime.value = props.duration;
			const updateProgress = () => {
				if (isPaused.value) return;
				const elapsed = Date.now() - startTime.value;
				const remaining = Math.max(0, props.duration - elapsed);
				progress.value = remaining / props.duration * 100;
				if (remaining <= 0) handleTimeout();
				else timeoutId.value = requestAnimationFrame(updateProgress);
			};
			timeoutId.value = requestAnimationFrame(updateProgress);
		};
		const pauseTimer = () => {
			if (!props.pauseOnHover || props.duration <= 0) return;
			isPaused.value = true;
			if (timeoutId.value) {
				cancelAnimationFrame(timeoutId.value);
				timeoutId.value = null;
			}
			const elapsed = Date.now() - startTime.value;
			remainingTime.value = Math.max(0, props.duration - elapsed);
		};
		const resumeTimer = () => {
			if (!props.pauseOnHover || props.duration <= 0) return;
			isPaused.value = false;
			startTime.value = Date.now();
			startTimer();
		};
		const clearTimer = () => {
			if (timeoutId.value) {
				cancelAnimationFrame(timeoutId.value);
				timeoutId.value = null;
			}
		};
		const handleTimeout = () => {
			clearTimer();
			emit("timeout");
			handleClose();
		};
		const handleClose = () => {
			clearTimer();
			showToast.value = false;
			emit("close");
			emit("update:visible", false);
		};
		const handleToastClick = (event) => {
			emit("click", event);
			if (props.clickToClose) handleClose();
		};
		const handleMouseEnter = () => {
			if (props.pauseOnHover) pauseTimer();
		};
		const handleMouseLeave = () => {
			if (props.pauseOnHover) resumeTimer();
		};
		const handleActionClick = (action) => {
			emit("action", action.key);
			if (action.handler) action.handler();
		};
		const handleAfterEnter = () => {
			startTimer();
		};
		const handleBeforeLeave = () => {
			clearTimer();
		};
		watch(() => props.visible, (newVisible) => {
			if (newVisible) {
				showToast.value = true;
				progress.value = 100;
			} else handleClose();
		}, { immediate: true });
		onUnmounted(() => {
			clearTimer();
		});
		__expose({
			close: handleClose,
			pause: pauseTimer,
			resume: resumeTimer
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, { to: "body" }, [_ctx.visible ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: normalizeClass(["toast-container", containerClass.value])
			}, [createVNode(Transition, {
				name: transitionName.value,
				appear: "",
				onAfterEnter: handleAfterEnter,
				onBeforeLeave: handleBeforeLeave
			}, {
				default: withCtx(() => [showToast.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(["toast flex items-start gap-sm leading-6", toastClass.value]),
					style: normalizeStyle(toastStyle.value),
					onClick: handleToastClick,
					onMouseenter: handleMouseEnter,
					onMouseleave: handleMouseLeave
				}, [
					_ctx.showIcon ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: normalizeClass(["toast-icon", iconClass.value])
					}, [renderSlot(_ctx.$slots, "icon", {}, () => [(openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), { class: normalizeClass(["icon-svg", iconSvgClass.value]) }, null, 8, ["class"]))], true)], 2)) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_1, [
						_ctx.title ? (openBlock(), createElementBlock("div", _hoisted_2, toDisplayString(_ctx.title), 1)) : createCommentVNode("", true),
						createBaseVNode("div", _hoisted_3, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(_ctx.message), 1)], true)]),
						_ctx.showActions || _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_4, [renderSlot(_ctx.$slots, "actions", {}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.actions, (action) => {
							return openBlock(), createElementBlock("button", {
								key: action.key,
								class: normalizeClass(["toast-action-button text-xs font-medium px-sm py-xs border rounded-sm bg-transparent transition-all cursor-pointer", action.class]),
								onClick: ($event) => handleActionClick(action)
							}, toDisplayString(action.label), 11, _hoisted_5);
						}), 128))], true)])) : createCommentVNode("", true)
					]),
					_ctx.closable && !_ctx.hideCloseButton ? (openBlock(), createElementBlock("button", {
						key: 1,
						class: normalizeClass(["toast-close", closeButtonClass.value]),
						onClick: handleClose,
						"aria-label": "关闭通知"
					}, [renderSlot(_ctx.$slots, "close-icon", {}, () => [_cache[0] || (_cache[0] = createBaseVNode("svg", {
						class: "close-icon",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24"
					}, [createBaseVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M6 18L18 6M6 6l12 12"
					})], -1))], true)], 2)) : createCommentVNode("", true),
					_ctx.showProgress && _ctx.duration > 0 ? (openBlock(), createElementBlock("div", {
						key: 2,
						class: "toast-progress",
						style: normalizeStyle(progressStyle.value)
					}, null, 4)) : createCommentVNode("", true)
				], 38)) : createCommentVNode("", true)]),
				_: 3
			}, 8, ["name"])], 2)) : createCommentVNode("", true)]);
		};
	}
});

//#endregion
//#region src/shared/components/NotificationToast.vue
var NotificationToast_default = /* @__PURE__ */ __plugin_vue_export_helper_default(NotificationToast_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3b46a878"]]);

//#endregion
export { NotificationToast_default as b, AnimationWrapper_default as c };