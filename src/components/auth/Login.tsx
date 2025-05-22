"use client";

import { UserServices } from "@/api";
import { LogoICon } from "@/assets/svgs/common";
import { IErrorAuth } from "@/types";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Login = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<IErrorAuth>({
		isError: {
			username: false,
			password: false,
			isLogin: false,
		},
		errorMessages: {
			username: "",
			password: "",
			isLogin: "",
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const checkUsername = () => {
		if (username.length <= 0) {
			setError((prevError) => ({
				...prevError,
				isError: {
					...prevError.isError,
					username: true,
				},
				errorMessages: {
					...prevError.errorMessages,
					username: "Username is required",
				},
			}));
			return false;
		}

		setError((prevError) => ({
			...prevError,
			isError: {
				...prevError.isError,
				username: false,
			},
			errorMessages: {
				...prevError.errorMessages,
				username: "",
			},
		}));
		return true;
	};
	const checkPassword = () => {
		if (password.length <= 0) {
			setError((prevError) => ({
				...prevError,
				isError: {
					...prevError.isError,
					password: true,
				},
				errorMessages: {
					...prevError.errorMessages,
					password: "Password is required",
				},
			}));
			return false;
		}
		setError((prevError) => ({
			...prevError,
			isError: {
				...prevError.isError,
				password: false,
			},
			errorMessages: {
				...prevError.errorMessages,
				password: "",
			},
		}));
		return true;
	};

	const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};
	const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleLogin = async () => {
		if (!checkUsername() || !checkPassword()) {
			router.push("/login");
			return;
		}

		setIsLoading(true);
		try {
			const result = await UserServices.signIn(username, password);

			if (result) {
				toast.success("Login successful!", {
					duration: 3000,
					position: "top-right",
					style: {
						background: "#22c55e",
						color: "#fff",
						padding: "16px",
					},
				});
				router.push("/dashboard/user");
			} else {
				toast.error("Username or password is incorrect", {
					duration: 3000,
					position: "top-right",
					style: {
						background: "#ef4444",
						color: "#fff",
						padding: "16px",
					},
				});
			}
		} catch (err: unknown) {
			toast.error("An error occurred during login", {
				duration: 3000,
				position: "top-right",
				style: {
					background: "#ef4444",
					color: "#fff",
					padding: "16px",
				},
			});

			if (err instanceof Error) {
				console.error("Login error:", err.message);
			} else {
				console.error("Unknown login error:", err);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-screen w-full max-w-full flex-col items-center justify-center gap-8 max-sm:w-full sm:w-full md:w-full lg:w-full">
			<LogoICon className="h-40 w-40 sm:h-60 sm:w-60 md:h-72 md:w-72" />
			<h1 className="text-xl font-bold max-sm:text-sm">Nice to see you again</h1>
			<div className="flex flex-col items-center justify-center gap-6 max-sm:w-full sm:w-full md:w-full lg:w-full">
				<Input
					className="max-lg:w-5/6 lg:w-1/4"
					label="Username"
					type="username"
					size="lg"
					color="default"
					radius="none"
					onChange={handleChangeUsername}
					onBlur={checkUsername}
					isInvalid={error.isError.username}
					errorMessage={error.errorMessages.username}
				/>
				<Input
					className="max-lg:w-5/6 lg:w-1/4"
					label="Password"
					type="password"
					size="lg"
					color="default"
					radius="sm"
					onChange={handleChangePassword}
					onBlur={checkPassword}
					isInvalid={error.isError.password}
					errorMessage={error.errorMessages.password}
				/>
				<div className="flex w-1/4 items-center justify-end max-lg:justify-center">
					<Popover backdrop="blur">
						<PopoverTrigger>
							<Link
								className="md:item-center text-sm text-red-600 underline max-sm:text-xs"
								href="#"
							>
								Forgot Password ?
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
				className="text-md bg-[#ff4336] font-semibold max-lg:w-5/6 lg:w-1/4"
				variant="solid"
				size="lg"
				isLoading={isLoading}
				spinner={
					<svg
						className="h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				}
			>
				{isLoading ? "Signing in..." : "Sign in"}
			</Button>
			{error.isError.isLogin && <div className="text-sm text-red-500">{error.errorMessages.isLogin}</div>}
		</div>
	);
};

export default Login;
