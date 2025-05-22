export interface BookingResponseDto {
	bookingId: string;
	status: "PAID" | "EXPIRED" | "PENDING";
	totalPrice: number;
	note: string;
	userFullName: string;
	userPhone: string;
	userEmail: string;
	userAddress: string;
	tourSchedule: ScheduleBookingResponseDto;
	tickets: TicketResponseDto[];
}

export interface ScheduleBookingResponseDto {
	tourScheduleId: string;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	tourId: string;
}

export interface TicketResponseDto {
	ticketId: string;
	price: number;
	status: string;
	note: string;
	ticketType: string;
}

export interface BookingStatisticsCategoryResponseDto {
	categoryName: string;
	count: number;
}

export interface BookingRevenueStatisticsDto {
	month: number;
	totalRevenue: number;
}

export interface BookingTop3TourStatisticsDto {
	tourId: string;
	totalBooking: number;
}
