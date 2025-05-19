export const formatTimestampToDate = (timestamp: number | string): string => {
	if (!timestamp) return "";

	const date = new Date(Number(timestamp));
	if (isNaN(date.getTime())) return "";

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

export const formatDateToDisplay = (timestamp: number | string): string => {
	if (!timestamp) return "";

	const date = new Date(Number(timestamp));
	if (isNaN(date.getTime())) return "";

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

export const formatDateToDMY = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};

export const formatBirthdayToDMY = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const year = date.getUTCFullYear();
	return `${day}-${month}-${year}`;
};

export const formatDateTimeLocal = (dateStr: string): string => {
	if (!dateStr) return "";
	const date = new Date(dateStr);
	const pad = (n: number) => n.toString().padStart(2, "0");

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export class FormatNumber {
	public static toFormatNumber(num: number): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	public static formatCurrency = (value: number) => {
		return new Intl.NumberFormat("vi-VN").format(value);
	};
}
