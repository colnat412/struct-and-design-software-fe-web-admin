import { UserPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
};

const DashboardPage = () => {
	return <UserPage />;
};

export default DashboardPage;
