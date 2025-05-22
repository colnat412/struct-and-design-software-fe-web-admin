export interface CreateBookingDto {
	userFullName: string;
	userPhone: string;
	userEmail: string;
	userAddress: string;
	tourScheduleId: string;
	note: string;
	tickets: BookingTicketDto[];
}

export interface BookingTicketDto {
	ticketType: "ADULT" | "CHILD" | "BABY";
	birthDate: string;
	fullName: string;
	gender: string;
}
