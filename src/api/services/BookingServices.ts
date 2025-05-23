import api from "../common/api";
import BaseService from "../common/base-service";
import { BookingResponseDto } from "../model";

const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;

export class BookingServices extends BaseService<BookingResponseDto> {
	constructor(endpoint: string) {
		super(endpoint);
	}

	public static async getNumberOfBookingsOfCategory(year: number) {
		try {
			const response = await api.get(`${apiUrl}/booking-service/statistics/category`, {
				params: {
					year: year,
				},
			});
			return response.data.data;
		} catch (error) {
			throw error;
		}
	}

	public static async getTotalRevenueByMonth(year: number) {
		try {
			const response = await api.get(`${apiUrl}/booking-service/statistics/monthly-revenue`, {
				params: {
					year: year,
				},
			});
			return response.data.data;
		} catch (error) {
			throw error;
		}
	}

	public static async getTop3TourRevenue(year: number) {
		try {
			const response = await api.get(`${apiUrl}/booking-service/statistics/top3-tour`, {
				params: {
					year: year,
				},
			});
			return response.data.data;
		} catch (error) {
			throw error;
		}
	}
}
