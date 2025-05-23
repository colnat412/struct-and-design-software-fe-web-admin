import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
	headers: {
		"Content-Type": "application/json",
	},
	validateStatus: (status) => status >= 200 && status <= 302,
});

// Interceptor trước khi gửi request
api.interceptors.request.use(
	async (config) => {
		// Lấy token từ AsyncStorage
		const token = await localStorage.getItem("token");
		if (token) {
			// Thêm token vào header của request
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// Interceptor xử lý lỗi
api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status;
		if (status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		} else {
			console.error("⛔ Axios: ", status + " - " + error.config?.url);
		}
		return Promise.reject(error);
	},
);

export default api;
