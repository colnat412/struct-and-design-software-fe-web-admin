import { BookingList } from "@/components/dashboards/bookings";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Đặt tour",
};

const Booking = () => {
	return <BookingList />;
};

export default Booking;
