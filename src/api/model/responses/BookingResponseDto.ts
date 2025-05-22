export interface BookingResponseDto {
	bookingId: string;
	status: string;
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
