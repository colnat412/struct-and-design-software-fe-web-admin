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
			const { token } = res.data.data;
			localStorage.setItem("token", token);
			return token;
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
			const res = await axios.get(`${apiUrl}/user-service/users/${id}`, {});
		} catch (error) {
			throw error;
		}
	}
}
