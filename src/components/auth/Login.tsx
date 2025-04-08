"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { LogoICon } from "@/assets/svgs/common";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserServices } from "@/api";
import { IErrorAuth, IUser } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
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

	const [user, setUser] = useState<IUser | null>(null);

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
		const token = await UserServices.signIn(username, password);

		if (checkUsername() && checkPassword()) {
			if (token) router.push("/dashboard");
			else {
				setError({
					isError: {
						...error.isError,
						isLogin: true,
					},
					errorMessages: {
						...error.errorMessages,
						isLogin: "Username or password is incorrect",
					},
				});
			}
		} else router.push("/login");
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
			>
				Sign in
			</Button>
		</div>
	);
};

export default Login;
