export interface TourResponseDto {
	tourId: string;
	name: string;
	description: string;
	price: number;
	thumbnail: string;
	duration: string;
	categoryTour: CategoryResponseDto;
}

export interface CategoryResponseDto {
	categoryTourId: string;
	name: string;
	description: string;
	image: string;
	active: boolean;
}
