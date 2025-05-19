import { TourList } from "@/components";
import { Metadata } from "next";
import { useRouter } from "next/router";

export const metadata: Metadata = {
	title: "Dashboard | Tour Detail",
};

const TourExpand = () => {
	const router = useRouter();
	return <div>{router.query.id}</div>;
};

export default TourExpand;
