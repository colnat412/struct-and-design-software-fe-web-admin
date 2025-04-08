import { UserPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | User",
};

const User = () => {
	return <UserPage />;
};

export default User;
