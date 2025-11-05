import { d as apiClient } from "./index-BSnbBRtO.js";

//#region src/core/auth/services/authApi.ts
/**

* 检查用户名是否可用

*/
async function checkUsername(username) {
	try {
		const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
		if (!response.ok) {
			if (response.status === 429) return {
				available: false,
				reason: null,
				message: "请求过于频繁，请稍后再试"
			};
			throw new Error("检查用户名失败");
		}
		return await response.json();
	} catch (error) {
		return {
			available: false,
			reason: null,
			message: error.message || "检查用户名失败"
		};
	}
}
/**

* 用户注册

*/
async function register(data) {
	try {
		const response = await apiClient.post("/auth/register", data);
		return response;
	} catch (error) {
		return {
			success: false,
			error: error.message || "注册失败"
		};
	}
}
/**

* 用户登录

*/
async function login(data) {
	try {
		const response = await apiClient.post("/auth/login", data);
		return response;
	} catch (error) {
		return {
			success: false,
			error: error.message || "登录失败"
		};
	}
}
/**

* 获取当前用户的所有作品

*/
async function getMyWorks() {
	try {
		const token = localStorage.getItem("token");
		if (!token) return {
			success: false,
			error: "未登录"
		};
		const response = await fetch("/api/my-works", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		});
		if (response.status === 401) {
			console.warn("[authApi] 检测到401，清除token并跳转登录页");
			localStorage.removeItem("token");
			const currentPath = window.location.pathname + window.location.search;
			window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
			return {
				success: false,
				error: "认证失败，请重新登录"
			};
		}
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "获取作品列表失败" }));
			return {
				success: false,
				error: errorData.error || "获取作品列表失败"
			};
		}
		return await response.json();
	} catch (error) {
		return {
			success: false,
			error: error.message || "获取作品列表失败"
		};
	}
}
/**

* 保存Token到localStorage

*/
function saveToken(token) {
	localStorage.setItem("token", token);
}
/**

* 获取Token

*/
function getToken() {
	return localStorage.getItem("token");
}
/**

* 清除Token

*/
function clearToken() {
	localStorage.removeItem("token");
}
/**

* 检查是否已登录

*/
function isAuthenticated() {
	return !!getToken();
}
/**

* 获取当前用户信息（从token解析，简单版本）

*/
function getCurrentUser() {
	const token = getToken();
	if (!token) return null;
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = JSON.parse(atob(parts[1]));
		return { username: payload.username || payload.sub || "用户" };
	} catch (error) {
		console.error("[authApi] 解析token失败:", error);
		return null;
	}
}
/**

* 获取当前用户名

*/
function getUsername() {
	const user = getCurrentUser();
	return user?.username || null;
}
/**

* 保存共笔作品到我的作品集

*/
async function saveGongBiWork(data) {
	try {
		const token = localStorage.getItem("token");
		if (!token) return {
			success: false,
			error: "未登录"
		};
		const response = await fetch("/api/my-works/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		if (response.status === 401) {
			console.warn("[authApi] 检测到401，清除token并跳转登录页");
			localStorage.removeItem("token");
			const currentPath = window.location.pathname + window.location.search;
			window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
			return {
				success: false,
				error: "认证失败，请重新登录"
			};
		}
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "保存作品失败" }));
			return {
				success: false,
				error: errorData.error || "保存作品失败"
			};
		}
		return await response.json();
	} catch (error) {
		return {
			success: false,
			error: error.message || "保存作品失败"
		};
	}
}
/**

* 删除账号

* @param password - 用户密码（用于身份验证）

* @param username - 用户输入的用户名（用于二次确认）

*/
async function deleteAccount(password, username) {
	try {
		const token = localStorage.getItem("token");
		if (!token) return {
			success: false,
			error: "未登录"
		};
		const response = await fetch("/api/user/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify({
				password,
				username
			})
		});
		if (response.status === 401) {
			console.warn("[authApi] 检测到401，清除token并跳转登录页");
			localStorage.removeItem("token");
			window.location.href = "/login";
			return {
				success: false,
				error: "认证失败，请重新登录"
			};
		}
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "删除账号失败" }));
			return {
				success: false,
				error: errorData.message || errorData.error || "删除账号失败"
			};
		}
		const result = await response.json();
		return result;
	} catch (error) {
		return {
			success: false,
			error: error.message || "删除账号失败"
		};
	}
}

//#endregion
export { checkUsername as b, clearToken as c, deleteAccount as d, getMyWorks as e, getToken as f, getUsername as g, isAuthenticated as h, login as i, register as j, saveGongBiWork as k, saveToken as l };