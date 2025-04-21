export interface UserRequestDto {
	username: string;
	password: string;
	email: string;
	phone: string;
	fullName: string;
	avatarUrl: string;
	birthday: string;
	gender: number;
	role: string;
}

export interface UserUpdateDto {
	phone: string;
	fullName: string;
	birthday: string;
	gender: number;
}
