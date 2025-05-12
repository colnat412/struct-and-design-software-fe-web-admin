import { TourResponseDto } from "../model";
import api from "./api";

export default class BaseService<T> {
	private endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	private getAuthHeader() {
		const token = localStorage.getItem("token");
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	async create(data: T, url_api: string): Promise<T> {
		try {
			console.log("Endpoint:", this.endpoint + url_api);

			const response = await api.post<ApiResponse<T>>(this.endpoint + url_api, data, {
				headers: this.getAuthHeader(),
			});
			return response.data.data;
		} catch (error) {
			console.error("Error creating data:", error);
			throw error;
		}
	}

	async getAll(url_api: string): Promise<T> {
		try {
			const response = await api.get<ApiResponse<T>>(this.endpoint + url_api, {
				headers: this.getAuthHeader(),
			});
			return response.data.data;
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	}

	async search(data: T, url_api: string): Promise<T> {
		try {
			const response = await api.get<ApiResponse<T>>(this.endpoint + url_api, {
				headers: this.getAuthHeader(),
				params: data,
			});
			return response.data.data;
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	}

	async getById(id: string | number, api_url: string): Promise<T> {
		try {
			const response = await api.get<ApiResponse<T>>(`${this.endpoint + api_url}/${id}`, {
				headers: this.getAuthHeader(),
			});
			return response.data.data;
		} catch (error) {
			console.error(`Error fetching data with ID ${id}:`, error);
			throw error;
		}
	}

	async update(id: string | number, data: T, url_api: string): Promise<T> {
		try {
			const response = await api.put<T>(`${this.endpoint + url_api}/${id}`, data, {
				headers: this.getAuthHeader(),
			});
			return response.data;
		} catch (error) {
			console.error(`Error updating data with ID ${id}:`, error);
			throw error;
		}
	}

	async updateAdmin(id: string | number, data: T, url_api: string): Promise<T> {
		try {
			const response = await api.put<T>(`${this.endpoint + url_api}/${id}/avatar`, data, {
				headers: this.getAuthHeader(),
			});
			return response.data;
		} catch (error) {
			console.error(`Error updating data with ID ${id}:`, error);
			throw error;
		}
	}

	async delete(id: string | number, url_api: string): Promise<void> {
		try {
			const response = await api.delete<ApiResponse<T>>(`${this.endpoint + url_api}/${id}`, {
				headers: this.getAuthHeader(),
			});
			if (response.status !== 200) {
				throw new Error(`Failed to delete data with ID ${id}`);
			}
		} catch (error) {
			console.error(`Error deleting data with ID ${id}:`, error);
			throw error;
		}
	}
}
