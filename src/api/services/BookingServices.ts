import BaseService from "../common/base-service";
import { BookingResponseDto } from "../model";

export class BookingServices extends BaseService<BookingResponseDto> {
	constructor(endpoint: string) {
		super(endpoint);
	}
}
