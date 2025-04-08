import Login from "@/components/auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
};

const LoginPage = () => {
	return <Login />;
};

export default LoginPage;
