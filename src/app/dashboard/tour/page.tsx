import { TourList } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Quản lý Tour",
};

const Tour = () => {
	return <TourList />;
};

export default Tour;
