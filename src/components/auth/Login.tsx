import { LogoICon } from "@/assets/svgs/common";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Metadata } from "next";
import Link from "next/link";

const Login = () => {
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4">
			<LogoICon
				width={256}
				height={256}
			/>
			<h1 className="text-xl font-bold">Login</h1>
			<div className="flex w-full flex-col items-center justify-center gap-4">
				<Input
					className="w-1/4"
					label="Username"
					type="username"
					size="lg"
					color="default"
				/>
				<Input
					className="w-1/4"
					label="Password"
					type="password"
					size="lg"
					color="default"
				/>
			</div>

			<Button
				className="w-1/4"
				color="primary"
				variant="solid"
				size="md"
			>
				Login
			</Button>
		</div>
	);
};

export default Login;
