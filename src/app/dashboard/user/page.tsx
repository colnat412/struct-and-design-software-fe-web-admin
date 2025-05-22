import { UserPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Quản lý người dùng",
};

const User = () => {
	return <UserPage />;
};

export default User;
