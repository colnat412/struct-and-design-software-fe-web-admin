import axios from "axios";
import { ApiResponse } from "../model";

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
		const errorResponse = error.response.data as ApiResponse<null>;
		if (errorResponse.statusCode === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		} else {
			console.error("⛔ Axios: ", error.status + " - " + error.config?.url);
		}
		return Promise.reject(error);
	},
);

export default api;
