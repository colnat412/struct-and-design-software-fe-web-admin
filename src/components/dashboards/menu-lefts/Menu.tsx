"use client";

import { DashboardIcon, FlyIcon, LocationIcon } from "@/assets/svgs/common";
import { MenuItem } from "./MenuItem";
import { ContactIcon } from "@/assets/svgs";
import { usePathname, useRouter } from "next/navigation";

export const Menu = () => {
	const router = useRouter();
	const pathname = usePathname();

	const items = [
		{
			id: 0,
			title: "Tổng quan",
			icon: (isSelected: boolean) => (
				<DashboardIcon
					width={40}
					height={40}
					className={isSelected ? "text-white" : "text-black"}
				/>
			),
			path: "/dashboard",
		},
		{
			id: 1,
			title: "Người dùng",
			icon: (isSelected: boolean) => (
				<ContactIcon
					width={40}
					height={40}
					className={isSelected ? "text-white" : "text-black"}
				/>
			),
			path: "/dashboard/user",
		},
		{
			id: 2,
			title: "Tour",
			icon: (isSelected: boolean) => (
				<FlyIcon
					width={40}
					height={40}
					className={isSelected ? "text-white" : "text-black"}
				/>
			),
			path: "/dashboard/tour",
		},
		{
			id: 3,
			title: "Đặt tour",
			icon: (isSelected: boolean) => (
				<LocationIcon
					width={40}
					height={40}
					className={isSelected ? "text-white" : "text-black"}
				/>
			),
			path: "/booking",
		},
	];

	const handleClick = (path: string) => {
		router.push(path.toLowerCase());
	};

	return (
		<div className="flex h-screen w-full flex-col gap-4">
			<span className="text-md px-2 font-semibold">Menu</span>
			{items.map((item) => {
				const isSelected = pathname === item.path;
				return (
					<MenuItem
						key={item.id}
						title={item.title}
						icon={item.icon(isSelected)}
						handleClick={() => handleClick(item.path)}
						selected={isSelected}
					/>
				);
			})}
		</div>
	);
};
