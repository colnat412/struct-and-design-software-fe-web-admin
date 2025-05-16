export interface TourRequestDto {
	name: string;
	description: string;
	duration: string;
	price: number;
	thumbnail: string;
	tourImages: TourImageRequestDto[];
}

export interface TourScheduleRequestDto {
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	adultPrice: number;
	childPrice: number;
	babyPrice: number;
	slot: number;
	tourId: string;
}

export interface TourImageRequestDto {
	tourId: string;
	imageUrl: string;
	description: string | "";
}

export interface TourDestinationRequestDto {
	tourId: string;
	name: string;
	description: string;
}
