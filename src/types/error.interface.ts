export interface IErrorAuth {
	isError: {
		username?: boolean;
		password?: boolean;
		isLogin?: boolean;
	};
	errorMessages: {
		username?: string;
		password?: string;
		isLogin?: string;
	};
}
