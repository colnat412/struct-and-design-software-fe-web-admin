"use client";

import { ServiceConstants, UserServices } from "@/api";
import { AvatarIcon, LogoICon, LogoutIcon } from "@/assets/svgs/common";
import { Menu } from "@/components";
import { Button } from "@heroui/button";
import { Geist, Geist_Mono, Lato, Merriweather } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const meriWeather = Merriweather({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "700"],
});

interface UserResponse {
	email: string;
	phone: string;
	username: string;
	fullName: string;
	avatarUrl: string;
	birthday: number;
	gender: number;
	role: string;
	userId: string;
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [data, setData] = useState<UserResponse>();
	const router = useRouter();
	const handleLogout = () => {
		localStorage.removeItem("token");
		router.push("/login");
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {
			const user = localStorage.getItem("user");
			try {
				if (user) {
					setData(JSON.parse(user) as UserResponse);
				} else {
					console.error("No user data found in localStorage");
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};
		fetchData();
	}, []);

	return (
		<html lang="en">
			<body className={meriWeather.className}>
				<div className="flex h-screen min-h-screen w-full flex-row">
					<div className="flex h-screen w-1/6 flex-col items-center justify-center gap-12 border-r-2">
						<LogoICon
							className="m-4"
							width={200}
							height={200}
						/>
						<span className="font-semibold">Xin chào, {data?.fullName}</span>
						<Menu />
						<div className="my-2 flex w-full flex-col items-center gap-4">
							<Button
								onPress={handleLogout}
								startContent={
									<LogoutIcon
										width={18}
										height={18}
									/>
								}
								radius="none"
								size="md"
								className="w-1/2 rounded-sm bg-secondary font-semibold text-white"
							>
								Đăng xuất
							</Button>
						</div>
					</div>
					<div className="flex-1">{children}</div>
				</div>
			</body>
		</html>
	);
}
