export interface TourResponseDto {
	id: string;
	name: string;
	description: string;
	price: number;
	thumbnail: string;
	duration: string;
	categoryName: string;
}

export interface CategoryResponseDto {
	categoryTourId: string;
	name: string;
	description: string;
	image: string;
	active: boolean;
}
