import axios from "axios";
import { ServiceConstants } from "../common";
import { TourResponseDto } from "../model";
import api from "../common/api";
import BaseService from "../common/base-service";
import Tour from "@/app/dashboard/tour/page";

export class TourServices extends BaseService<TourResponseDto> {
	constructor(endpoint: string) {
		super(endpoint);
	}

	public static async searchTour(keyword: string) {
		try {
			const response = await api.get(
				`${ServiceConstants.BOOKING_SERVICE}/tours/search/${encodeURIComponent(keyword)}`,
			);
			return response.data.data;
		} catch (error) {
			console.error("Error searching tours:", error);
			throw error;
		}
	}

	public static async getTourImagesOfTour(tourId: string) {
		try {
			const response = await api.get(`${ServiceConstants.BOOKING_SERVICE}/tours/${tourId}/tour-images`);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching tour images:", error);
			throw error;
		}
	}

	public static async getTourSchedulesOfTour(tourId: string) {
		try {
			const response = await api.get(`${ServiceConstants.BOOKING_SERVICE}/tours/${tourId}/tour-schedule`);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching tour schedule:", error);
			throw error;
		}
	}

	// public static async getAllTours(token: string): Promise<TourResponseDto[]> {
	// 	try {
	// 		const response = await api.get(`${ServiceConstants.BOOKING_SERVICE}/tours`, {});

	// 		if (response.headers?.location) {
	// 			console.log("Redirected to:", response.headers.location);
	// 		}

	// 		console.log("API Response:", response.data);
	// 		return response.data.data;
	// 	} catch (error) {
	// 		console.error("Error fetching tours:", error);
	// 		throw error;
	// 	}
	// }
}
