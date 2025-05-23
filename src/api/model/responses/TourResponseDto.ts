export interface TourResponseDto {
	tourId: string;
	name: string;
	description: string;
	price: number;
	thumbnail: string;
	duration: string;
	categoryTour: CategoryResponseDto;
	tourImages: TourImageResponseDto[];
	// destination: DestinationResponseDto;
}

export interface CategoryResponseDto {
	categoryTourId: string;
	name: string;
	description: string;
	image: string;
	active: boolean;
}

export interface TourImageResponseDto {
	tourImageId: string;
	tourId: string;
	imageUrl: string;
	description: string;
}

export interface TourScheduleResponseDto {
	tourScheduleId: string;
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

export interface TourDestinationResponseDto {
	tourDestinationId: string;
	name: string;
	description: string;
	image: string;
	orderIndex: number;
	destination: DestinationResponseDto;
	active: boolean;
}

export interface DestinationResponseDto {
	destinationId: string;
	name: string;
	description: string;
	image: string;
	address: string;
	city: string;
	district: string;
	country: string;
	cityId: string;
	districtId: string;
}
