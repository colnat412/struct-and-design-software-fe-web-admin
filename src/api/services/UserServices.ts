import { IErrorAuth } from "@/types";
import axios from "axios";
import { ServiceConstants } from "../common";
import BaseService from "../common/base-service";
import { UserResponseDto } from "../model";

const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;

export class UserServices extends BaseService<UserResponseDto> {
	constructor(endpoint: string) {
		super(endpoint);
	}

	public static async signIn(username: string, password: string) {
		try {
			const res = await axios.post(`${apiUrl}${ServiceConstants.USER_SERVICE}/auth/token`, {
				username,
				password,
			});
			const { token, user } = res.data.data;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			return res.data;
		} catch (error) {
			throw error;
		}
	}

	public static async getAllUsers(token: string) {
		try {
			const res = await axios.get(`${apiUrl}/user-service/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return res.data.data;
		} catch (error) {
			throw error;
		}
	}

	public static async getUserById(token: string, id: string) {
		try {
			const res = await axios.get(`${apiUrl}/user-service/users/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return res.data.data;
		} catch (error) {
			throw error;
		}
	}

	public static async deleteUser(token: string, id: string) {
		try {
			const res = await axios.delete(`${apiUrl}/user-service/users/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return res.data.data;
		} catch (error) {
			throw error;
		}
	}

	public static async uploadAvatar(userId: string, avatarFile: File) {
		try {
			const formData = new FormData();
			formData.append("avatar", avatarFile);

			const token = localStorage.getItem("token");

			const res = await axios.put(`${apiUrl}/user-service/users/${userId}/avatar`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});
			return res.data;
		} catch (error) {
			throw error;
		}
	}

	public static async search(searchParams: Record<string, string>, token: string) {
		try {
			const res = await axios.get(`${apiUrl}/user-service/users/search`, {
				data: searchParams,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			return res.data.data;
		} catch (error) {
			throw error;
		}
	}
}
