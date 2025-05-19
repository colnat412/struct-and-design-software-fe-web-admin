export interface UserRequestDto {
	username: string;
	password: string;
	email: string;
	phone: string;
	fullName: string;
	avatarUrl: string;
	birthday: string;
	gender: string;
	role: string;
}

export interface UserUpdateDto {
	username?: string;
	password?: string;
	email?: string;
	phone: string;
	fullName: string;
	avatarUrl?: string;
	birthday: string;
	gender: string;
	role?: string;
}
