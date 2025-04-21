export class FormatNumber {
	public static toFormatNumber(num: number): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

export const formatDate = (dateString?: string) => {
	if (!dateString) return "";

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return "";

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

export const toInputDateFormat = (dateInput?: string | Date): string => {
	if (!dateInput) return "";

	const date = new Date(dateInput);
	if (isNaN(date.getTime())) return ""; // Kiểm tra xem ngày có hợp lệ không

	// Chuyển đổi ngày về định dạng YYYY-MM-DD
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};
