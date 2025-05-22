import { ServiceConstants } from "../common";
import api from "../common/api";
import BaseService from "../common/base-service";
import { TourResponseDto, UpdateTourScheduleDto } from "../model";

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

	public static async createTourImage(formData: FormData) {
		try {
			const response = await api.post(`${ServiceConstants.BOOKING_SERVICE}/api/tour-images/upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			return response.data.data;
		} catch (error) {
			console.error("Error creating tour image:", error);
			throw error;
		}
	}

	public static async getTourDestinationsOfTour(tourId: string) {
		try {
			const response = await api.get(`${ServiceConstants.BOOKING_SERVICE}/tour-destinations/tourId/${tourId}`);
			return response.data.data;
		} catch (error) {
			console.error("Error fetching tour destinations:", error);
			throw error;
		}
	}

	public static async updateTourSchedule(data: UpdateTourScheduleDto) {
		try {
			const response = await api.put(`${ServiceConstants.BOOKING_SERVICE}/tour-schedules/`, data, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			return response.data.data;
		} catch (error) {
			throw error;
		}
	}
}
