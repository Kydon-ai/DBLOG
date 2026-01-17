// request.ts
type RequestInterceptor = (
	config: RequestInit & { url: string }
) => Promise<RequestInit & { url: string }> | (RequestInit & { url: string });
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

// 从localStorage获取token（兼容Zustand的persist中间件）
function getAuthToken(): string {
	try {
		// 直接使用Zustand的存储键名获取token
		const appStorage = localStorage.getItem('app-storage');
		if (appStorage) {
			const parsed = JSON.parse(appStorage);
			console.log('getAuthToken - parsed app-storage:', parsed);
			return parsed.state.token || '';
		}
		console.log('getAuthToken - no app-storage found');
		return '';
	} catch (error) {
		console.error('Failed to get token from localStorage:', error);
		return '';
	}
}

class Request {
	private baseURL: string;
	private defaultHeaders: HeadersInit;
	private requestInterceptors: RequestInterceptor[] = [];
	private responseInterceptors: ResponseInterceptor[] = [];

	constructor(baseURL = '', defaultHeaders: HeadersInit = {}) {
		this.baseURL = baseURL;
		this.defaultHeaders = defaultHeaders;
	}

	// 添加请求拦截器
	useRequest(interceptor: RequestInterceptor): void {
		this.requestInterceptors.push(interceptor);
	}

	// 添加响应拦截器
	useResponse(interceptor: ResponseInterceptor): void {
		this.responseInterceptors.push(interceptor);
	}

	// 处理请求配置的通用方法
	private buildConfig(url: string, options: RequestInit): RequestInit & { url: string } {
		const isFormData = options.body instanceof FormData;

		// 创建请求配置 - 修复URL构建逻辑
		let finalUrl: string;
		if (this.baseURL === '/') {
			// 如果baseURL是根路径，直接使用url
			finalUrl = url;
		} else if (this.baseURL && url.startsWith('/')) {
			// 如果baseURL存在且url以/开头，直接拼接
			finalUrl = this.baseURL + url;
		} else if (this.baseURL && !url.startsWith('/')) {
			// 如果baseURL存在且url不以/开头，添加/后拼接
			finalUrl = this.baseURL + '/' + url;
		} else {
			// 其他情况直接使用url
			finalUrl = url;
		}

		const config: RequestInit & { url: string } = {
			url: finalUrl,
			method: options.method || 'GET',
			body: options.body,
		};

		// 处理headers
		const headers: Record<string, string> = {
			'accept-charset': 'utf-8',
		};

		// 合并默认headers
		if (this.defaultHeaders) {
			for (const [key, value] of Object.entries(this.defaultHeaders)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		// 合并options中的headers
		if (options.headers) {
			for (const [key, value] of Object.entries(options.headers)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		// 设置默认Content-Type（FormData除外）
		if (!isFormData && !headers['content-type']) {
			headers['content-type'] = 'application/json';
		}

		config.headers = headers;
		return config;
	}

	// 通用请求方法
	private async executeRequest(config: RequestInit & { url: string }): Promise<Response> {
		// 应用请求拦截器
		for (const interceptor of this.requestInterceptors) {
			config = await interceptor(config);
		}

		// 发起请求
		let response = await fetch(config.url, config);

		// 应用响应拦截器
		for (const interceptor of this.responseInterceptors) {
			response = await interceptor(response);
		}

		return response;
	}

	// 发送请求并返回JSON数据
	private async _fetch(url: string, options: RequestInit = {}): Promise<any> {
		const config = this.buildConfig(url, options);
		const response = await this.executeRequest(config);
		return response.json();
	}

	get(url: string, headers?: HeadersInit): Promise<any> {
		return this._fetch(url, { method: 'GET', headers });
	}

	post(url: string, data?: any, headers?: HeadersInit): Promise<any> {
		return this._fetch(url, {
			method: 'POST',
			body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
			headers,
		});
	}

	put(url: string, data?: any, headers?: HeadersInit): Promise<any> {
		return this._fetch(url, {
			method: 'PUT',
			body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
			headers,
		});
	}

	delete(url: string, headers?: HeadersInit): Promise<any> {
		return this._fetch(url, { method: 'DELETE', headers });
	}

	options(url: string, headers?: HeadersInit): Promise<any> {
		return this._fetch(url, { method: 'OPTIONS', headers });
	}

	/**
	 * 发起请求并返回原始Response对象（用于处理流式响应等）
	 * @param url 请求URL
	 * @param options 请求选项
	 * @returns Promise<Response> 原始响应对象
	 */
	async stream(url: string, options: RequestInit = {}): Promise<Response> {
		const config = this.buildConfig(url, options);
		return this.executeRequest(config);
	}
}

// 导出一个单例
// 使用后端服务器地址作为baseURL
const request = new Request('http://localhost:8001'); // 使用后端服务器地址作为baseURL
// 如果需要直接请求外部API，可以使用环境变量
// const request = new Request(import.meta.env.VITE_API_BASE_URL);

// 请求拦截器
request.useRequest((config) => {
	if (!config.headers) {
		config.headers = {};
	}

	const headers = config.headers as Record<string, string>;
	// 直接使用config.url判断是否为登录/注册接口
	const isAuthUrl = config.url.includes('/api/auth/login') || config.url.includes('/api/auth/register');
	console.log('Request Interceptor - URL:', config.url);
	console.log('Request Interceptor - isAuthUrl:', isAuthUrl);

	// 如果不是登录/注册接口，添加Authorization头
	if (!isAuthUrl) {
		const token = getAuthToken();
		console.log('Request Interceptor - token:', token);
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
			console.log('Request Interceptor - Added Authorization header');
		} else {
			console.log('Request Interceptor - No token available');
		}
	}

	console.log('Request Interceptor - Final headers:', headers);
	return config;
});

// 响应拦截器
request.useResponse(async (response) => {
	if (!response.ok) {
		let errorMessage = `请求失败 (${response.status})`;

		try {
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} else {
				const text = await response.text();
				errorMessage = text || errorMessage;
			}
		} catch (error) {
			// 忽略解析错误，使用默认错误信息
			console.error('解析响应数据失败:', error);
			errorMessage = '请求失败';
		}

		throw new Error(errorMessage);
	}

	return response;
});

export default request;