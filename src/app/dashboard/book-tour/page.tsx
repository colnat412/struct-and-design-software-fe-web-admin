import { BookingPage } from "@/components/dashboards/bookings";
import { Suspense } from "react";

const Test = () => {
	return (
		<Suspense>
			<BookingPage />
		</Suspense>
	);
};

export default Test;
