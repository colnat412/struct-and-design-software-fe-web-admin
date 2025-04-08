export class FormatNumber {
	// format to 500.000.000
	public static toFormatNumber(num: number): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}
