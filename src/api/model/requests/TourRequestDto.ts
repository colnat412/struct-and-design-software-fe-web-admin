export interface TourRequestDto {
	name: string;
	description: string;
	duration: string;
	price: number;
	thumbnail: string;
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
	tourImageId: string;
	tourId: string;
	imageUrl: string;
	description: string | "";
}
