export const isValidPhone = (phone: string): boolean => {
	const phoneRegex = /^[0-9]{10,11}$/;
	return phoneRegex.test(phone.trim());
};

export const isValidFullName = (fullName: string): boolean => {
	return fullName.trim().length >= 2;
};

export const isValidDate = (date: string): boolean => {
	return !isNaN(new Date(date).getTime());
};

export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email.trim());
};

export const isNonEmpty = (value: string): boolean => {
	return value.trim().length > 0;
};
