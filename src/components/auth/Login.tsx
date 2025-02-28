"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { LogoICon } from "@/assets/svgs/common";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
	const router = useRouter();
	const handleLogin = () => {
		router.push("/dashboard");
	};
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-8 max-sm:w-full sm:w-full md:w-full lg:w-full">
			<LogoICon className="h-40 w-40 sm:h-60 sm:w-60 md:h-72 md:w-72" />
			<h1 className="text-xl font-bold max-sm:text-sm">Nice to see you again</h1>
			<div className="flex flex-col items-center justify-center gap-6 max-sm:w-full sm:w-full md:w-full lg:w-full">
				<Input
					className="w-1/4"
					label="Username"
					type="username"
					size="lg"
					color="default"
					radius="none"
				/>
				<Input
					className="w-1/4"
					label="Password"
					type="password"
					size="lg"
					color="default"
					radius="sm"
				/>
				<div className="flex w-1/4 items-center justify-end max-md:justify-center">
					<Popover
						placement="right"
						backdrop="blur"
					>
						<PopoverTrigger>
							<Link
								className="text-sm text-red-600 underline max-sm:text-xs"
								href="#"
							>
								Quên mật khẩu?
							</Link>
						</PopoverTrigger>
						<PopoverContent>
							<div className="px-1 py-2">
								<div className="flex items-center justify-center text-xl font-bold text-[#FC4337]">
									Warning!
								</div>
								<div className="text-md text-center font-semibold">
									Please contact administrator <br /> to reset your password.
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			<Button
				onPress={handleLogin}
				color="primary"
				className="text-md w-1/4 bg-[#ff4336] font-semibold max-md:w-1/4"
				variant="solid"
				size="lg"
			>
				Sign in
			</Button>
		</div>
	);
};

export default Login;
