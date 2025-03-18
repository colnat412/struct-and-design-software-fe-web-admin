"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import { AvatarIcon, LogoICon, LogoutIcon } from "@/assets/svgs/common";
import { Button } from "@heroui/button";
import { Menu } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const lato = Lato({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "700"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const handleLogout = () => {
		localStorage.removeItem("token");
		router.push("/login");
	};
	return (
		<html lang="en">
			<body className={lato.className}>
				<div className="flex h-screen w-full flex-row">
					<div className="flex h-screen w-1/6 flex-col items-center justify-center gap-12 border-r-2">
						<LogoICon
							width={200}
							height={200}
						/>
						<span className="font-semibold">Welcome back, John</span>
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
								Sign out
							</Button>
						</div>
					</div>
					<div className="flex-1">{children}</div>
					<div className="relative">
						<button className="absolute right-2 top-2 flex flex-col gap-4 rounded-full border-2 border-secondary p-3">
							<AvatarIcon
								width={20}
								height={20}
							/>
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
