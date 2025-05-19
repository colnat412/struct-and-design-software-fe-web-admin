import { TourList } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | Tour",
};

const Tour = () => {
	return <TourList />;
};

export default Tour;
