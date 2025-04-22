import { NotFoundComponent } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Page Not Found",
};

const NotFound = () => {
	return <NotFoundComponent />;
};
export default NotFound;
