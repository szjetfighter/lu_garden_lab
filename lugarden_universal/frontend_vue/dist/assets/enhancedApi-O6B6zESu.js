import { b as ApiClient, c as ApiError } from "./index-BSnbBRtO.js";

//#region src/shared/services/interceptors.ts
var InterceptorManager = class {
	constructor() {
		this.requestInterceptors = [];
		this.responseInterceptors = [];
		this.errorInterceptors = [];
	}
	addRequestInterceptor(interceptor) {
		this.requestInterceptors.push(interceptor);
		return () => {
			const index = this.requestInterceptors.indexOf(interceptor);
			if (index > -1) this.requestInterceptors.splice(index, 1);
		};
	}
	addResponseInterceptor(interceptor) {
		this.responseInterceptors.push(interceptor);
		return () => {
			const index = this.responseInterceptors.indexOf(interceptor);
			if (index > -1) this.responseInterceptors.splice(index, 1);
		};
	}
	addErrorInterceptor(interceptor) {
		this.errorInterceptors.push(interceptor);
		return () => {
			const index = this.errorInterceptors.indexOf(interceptor);
			if (index > -1) this.errorInterceptors.splice(index, 1);
		};
	}
	async executeRequestInterceptors(config) {
		let result = config;
		for (const interceptor of this.requestInterceptors) result = await interceptor(result);
		return result;
	}
	async executeResponseInterceptors(response) {
		let result = response;
		for (const interceptor of this.responseInterceptors) result = await interceptor(result);
		return result;
	}
	async executeErrorInterceptors(error) {
		let result = error;
		for (const interceptor of this.errorInterceptors) result = await interceptor(result);
		return result;
	}
};
/**
* 认证拦截器
* 自动添加认证头
*/
const authInterceptor = (config) => {
	if (config.url.includes("/admin/")) config.headers["X-Requested-With"] = "XMLHttpRequest";
	const token = localStorage.getItem("token");
	if (token) {
		if (config.url.includes("/my-works") || config.url.includes("/auth/delete-account")) {
			if (!config.headers) config.headers = {};
			config.headers["Authorization"] = `Bearer ${token}`;
		}
	}
	return config;
};
/**
* 加载状态拦截器
* 全局管理加载状态
*/
function createLoadingInterceptor(showLoading, hideLoading) {
	const requestInterceptor = (config) => {
		showLoading();
		return config;
	};
	const responseInterceptor = (response) => {
		hideLoading();
		return response;
	};
	const errorInterceptor = (error) => {
		hideLoading();
		return error;
	};
	return {
		requestInterceptor,
		responseInterceptor,
		errorInterceptor
	};
}
/**
* 日志拦截器
* 记录请求和响应
*/
const logInterceptor = {
	request: ((config) => {
		console.log(`[API Request] ${config.method} ${config.url}`, {
			headers: config.headers,
			body: config.body
		});
		return config;
	}),
	response: ((response) => {
		console.log(`[API Response] ${response.status} ${response.url}`);
		return response;
	}),
	error: ((error) => {
		console.error(`[API Error] ${error.code}: ${error.message}`, {
			statusCode: error.statusCode,
			details: error.details
		});
		return error;
	})
};
/**
* 错误处理拦截器
* 统一处理特定错误
*/
function createErrorHandlingInterceptor(onNetworkError, onServerError, onUnauthorized) {
	return (error) => {
		switch (error.code) {
			case "NETWORK_ERROR":
				onNetworkError?.();
				break;
			case "HTTP_401":
				onUnauthorized?.();
				break;
			case "HTTP_500":
			case "HTTP_502":
			case "HTTP_503":
				onServerError?.();
				break;
		}
		return error;
	};
}
/**
* 缓存拦截器
* 简单的内存缓存实现
*/
function createCacheInterceptor(cacheDuration = 300 * 1e3) {
	const cache = /* @__PURE__ */ new Map();
	const requestInterceptor = (config) => {
		if (config.method === "GET") {
			const cacheKey = config.url;
			const cached = cache.get(cacheKey);
			if (cached && Date.now() - cached.timestamp < cacheDuration) config.__cached = cached.data;
		}
		return config;
	};
	const responseInterceptor = async (response) => {
		if (response.status === 200 && response.url) {
			const url = new URL(response.url);
			if (url.searchParams.get("refresh") !== "true") try {
				const clonedResponse = response.clone();
				const data = await clonedResponse.json();
				cache.set(response.url, {
					data,
					timestamp: Date.now()
				});
			} catch {}
		}
		return response;
	};
	return {
		requestInterceptor,
		responseInterceptor
	};
}

//#endregion
//#region src/modules/portal/services/portalApi.ts
/**
* Portal API服务类
* 处理宇宙门户的所有API操作
*/
var PortalApiService = class {
	constructor(apiClient) {
		this.apiClient = apiClient;
	}
	/**
	* 获取宇宙列表
	* @param options 查询选项
	* @returns 宇宙列表响应
	*/
	async getUniverseList(options = {}) {
		const queryParams = new URLSearchParams();
		if (options.status && options.status.length > 0) queryParams.append("status", options.status.join(","));
		if (options.refresh) queryParams.append("refresh", "true");
		if (options.includeAnalytics) queryParams.append("analytics", "true");
		const endpoint = `/portal/universes${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
		return this.apiClient.get(endpoint);
	}
	/**
	* 获取单个宇宙详情
	* @param universeId 宇宙ID
	* @param includeAnalytics 是否包含分析数据
	* @returns 宇宙详情响应
	*/
	async getUniverseDetail(universeId, includeAnalytics = false) {
		const queryParams = includeAnalytics ? "?analytics=true" : "";
		const endpoint = `/portal/universes/${String(universeId)}${queryParams}`;
		return this.apiClient.get(endpoint);
	}
	/**
	* 搜索宇宙
	* @param query 搜索关键词
	* @param filters 筛选条件
	* @returns 搜索结果
	*/
	async searchUniverses(query, filters = {}) {
		const queryParams = new URLSearchParams();
		queryParams.append("q", query);
		if (filters.status && filters.status.length > 0) queryParams.append("status", filters.status.join(","));
		if (filters.category) queryParams.append("category", filters.category);
		const endpoint = `/portal/universes/search?${queryParams.toString()}`;
		return this.apiClient.get(endpoint);
	}
	/**
	* 更新宇宙状态
	* @param universeId 宇宙ID
	* @param status 新状态
	* @param reason 更新原因（可选）
	* @returns 更新结果
	*/
	async updateUniverseStatus(universeId, status, reason) {
		return this.apiClient.put(`/portal/universes/${String(universeId)}/status`, {
			status,
			reason
		});
	}
	/**
	* 批量更新宇宙状态
	* @param updates 批量更新数据
	* @returns 批量更新结果
	*/
	async batchUpdateUniverseStatus(updates) {
		return this.apiClient.put("/portal/universes/batch-status", { updates });
	}
	/**
	* 检查宇宙访问权限
	* @param universeId 宇宙ID
	* @param userId 用户ID（可选，默认当前用户）
	* @returns 访问权限信息
	*/
	async checkUniverseAccess(universeId, userId) {
		let endpoint = `/portal/universes/${String(universeId)}/access`;
		if (userId) endpoint += `?userId=${encodeURIComponent(userId)}`;
		return this.apiClient.get(endpoint);
	}
	/**
	* 记录宇宙访问
	* @param universeId 宇宙ID
	* @param source 访问来源
	* @returns 访问记录结果
	*/
	async recordUniverseVisit(universeId, source = "portal") {
		return this.apiClient.post(`/portal/universes/${String(universeId)}/visit`, {
			source,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	/**
	* 获取宇宙统计数据
	* @param universeId 宇宙ID（可选，获取所有宇宙的统计）
	* @param timeRange 时间范围
	* @returns 统计数据
	*/
	async getUniverseAnalytics(universeId, timeRange = "7d") {
		const baseEndpoint = universeId ? `/portal/universes/${String(universeId)}/analytics` : "/portal/analytics";
		const endpoint = `${baseEndpoint}?timeRange=${encodeURIComponent(timeRange)}`;
		return this.apiClient.get(endpoint);
	}
	/**
	* 检查Portal系统健康状态
	* @returns 系统状态信息
	*/
	async getPortalHealth() {
		return this.apiClient.get("/portal/health");
	}
	/**
	* 获取Portal配置信息
	* @returns 配置信息
	*/
	async getPortalConfig() {
		return this.apiClient.get("/portal/config");
	}
	/**
	* 获取用户的宇宙偏好
	* @param userId 用户ID（可选）
	* @returns 用户偏好设置
	*/
	async getUserPreferences(userId) {
		const endpoint = userId ? `/portal/users/${userId}/preferences` : "/portal/user/preferences";
		return this.apiClient.get(endpoint);
	}
	/**
	* 更新用户偏好设置
	* @param preferences 偏好设置
	* @param userId 用户ID（可选）
	* @returns 更新结果
	*/
	async updateUserPreferences(preferences, userId) {
		const endpoint = userId ? `/portal/users/${userId}/preferences` : "/portal/user/preferences";
		return this.apiClient.put(endpoint, preferences);
	}
};

//#endregion
//#region src/shared/services/enhancedApi.ts
/**
* 增强的API客户端类
* 在基础ApiClient上添加拦截器功能
*/
var EnhancedApiClient = class extends ApiClient {
	constructor(baseURL = "/api", options = {}) {
		super(baseURL);
		this.loadingRequests = /* @__PURE__ */ new Set();
		this.interceptors = new InterceptorManager();
		this.onLoadingChange = options.onLoadingChange;
		this.onError = options.onError;
		this.setupDefaultInterceptors(options);
	}
	/**
	* 设置默认拦截器
	*/
	setupDefaultInterceptors(options) {
		this.interceptors.addRequestInterceptor(authInterceptor);
		if (this.onLoadingChange) {
			const loadingInterceptors = createLoadingInterceptor(() => this.updateLoadingState(true), () => this.updateLoadingState(false));
			this.interceptors.addRequestInterceptor(loadingInterceptors.requestInterceptor);
			this.interceptors.addResponseInterceptor(loadingInterceptors.responseInterceptor);
			this.interceptors.addErrorInterceptor(loadingInterceptors.errorInterceptor);
		}
		if (options.enableLogging !== false) {
			this.interceptors.addRequestInterceptor(logInterceptor.request);
			this.interceptors.addResponseInterceptor(logInterceptor.response);
			this.interceptors.addErrorInterceptor(logInterceptor.error);
		}
		if (options.enableCaching) {
			const cacheInterceptors = createCacheInterceptor(options.cacheDuration);
			this.interceptors.addRequestInterceptor(cacheInterceptors.requestInterceptor);
			this.interceptors.addResponseInterceptor(cacheInterceptors.responseInterceptor);
		}
		if (this.onError) {
			const errorInterceptor = createErrorHandlingInterceptor(() => this.onError?.(new ApiError("NETWORK_ERROR", "网络连接失败", 0)), () => this.onError?.(new ApiError("SERVER_ERROR", "服务器错误", 500)), () => this.onError?.(new ApiError("UNAUTHORIZED", "认证失败", 401)));
			this.interceptors.addErrorInterceptor(errorInterceptor);
		}
	}
	/**
	* 更新加载状态
	*/
	updateLoadingState(loading) {
		if (loading) this.loadingRequests.add("request");
		else this.loadingRequests.delete("request");
		const isLoading = this.loadingRequests.size > 0;
		this.onLoadingChange?.(isLoading);
	}
	/**
	* 重写请求方法以支持拦截器
	*/
	async request(endpoint, options = {}, config = {}) {
		const requestId = `${options.method || "GET"}_${endpoint}_${Date.now()}`;
		try {
			let requestConfig = {
				url: endpoint,
				method: options.method || "GET",
				headers: {
					"Content-Type": "application/json",
					...Object.fromEntries(new Headers(options.headers))
				},
				body: options.body,
				...config
			};
			requestConfig = await this.interceptors.executeRequestInterceptors(requestConfig);
			const response = await super.request(endpoint, {
				...options,
				headers: requestConfig.headers,
				body: requestConfig.body
			}, config);
			return response;
		} catch (error) {
			let apiError = error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", error instanceof Error ? error.message : String(error), 0);
			apiError = await this.interceptors.executeErrorInterceptors(apiError);
			throw apiError;
		} finally {
			this.loadingRequests.delete(requestId);
		}
	}
	/**
	* 添加请求拦截器
	*/
	addRequestInterceptor(interceptor) {
		return this.interceptors.addRequestInterceptor(interceptor);
	}
	/**
	* 添加响应拦截器
	*/
	addResponseInterceptor(interceptor) {
		return this.interceptors.addResponseInterceptor(interceptor);
	}
	/**
	* 添加错误拦截器
	*/
	addErrorInterceptor(interceptor) {
		return this.interceptors.addErrorInterceptor(interceptor);
	}
};
/**
* 宇宙内容服务
*/
var UniverseService = class {
	constructor(apiClient) {
		this.apiClient = apiClient;
	}
	/**
	* 获取所有宇宙列表
	*/
	async getUniverses() {
		return this.apiClient.get("/universes");
	}
	/**
	* 获取特定宇宙的内容
	*/
	async getUniverseContent(universeCode, refresh = false) {
		const endpoint = `/universes/${universeCode}/content${refresh ? "?refresh=true" : ""}`;
		return this.apiClient.get(endpoint);
	}
};
/**
* AI功能服务
*/
var AIService = class {
	constructor(apiClient) {
		this.apiClient = apiClient;
	}
	/**
	* 请求诗歌解读
	* @returns 包含解读内容的Promise
	*/
	async interpretPoem(poem, title, combination, chapter) {
		return this.apiClient.post("/interpret", {
			poem,
			title,
			combination,
			chapter
		});
	}
};
/**
* API服务工厂
* 创建和管理所有API服务实例
*/
var ApiServiceFactory = class {
	constructor(options = {}) {
		this.apiClient = new EnhancedApiClient("/api", options);
		this.universeService = new UniverseService(this.apiClient);
		this.aiService = new AIService(this.apiClient);
		this.portalService = new PortalApiService(this.apiClient);
	}
	/**
	* 获取宇宙服务
	*/
	getUniverseService() {
		return this.universeService;
	}
	/**
	* 获取AI服务
	*/
	getAIService() {
		return this.aiService;
	}
	/**
	* 获取Portal服务
	*/
	getPortalService() {
		return this.portalService;
	}
	/**
	* 获取原始API客户端
	*/
	getApiClient() {
		return this.apiClient;
	}
	/**
	* 销毁所有服务
	*/
	destroy() {
		console.log("API服务已销毁");
	}
};
let defaultApiFactory = null;
/**
* 获取默认的API服务工厂
*/
function getApiServices(options) {
	if (!defaultApiFactory || options) defaultApiFactory = new ApiServiceFactory(options);
	return defaultApiFactory;
}

//#endregion
export { getApiServices as b };