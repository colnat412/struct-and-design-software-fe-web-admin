import { IErrorAuth } from "@/types";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;

export class UserServices {
	public static async signIn(username: string, password: string) {
		try {
			const res = await axios.post(`${apiUrl}/user-service/auth/token`, {
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
}
