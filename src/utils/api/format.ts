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

export class FormatNumber {
	public static toFormatNumber(num: number): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}
