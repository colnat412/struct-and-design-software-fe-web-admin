"use client";

import { ContactIcon } from "@/assets/svgs";
import { MenuItem } from "./MenuItem";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardIcon, FlyIcon, LocationIcon } from "@/assets/svgs/common";

export const Menu = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [selectedItem, setSelectedItem] = useState<number | null>(null);
	const items = [
		{
			id: 0,
			title: "Dashboard",
			icon: (
				<DashboardIcon
					width={40}
					height={40}
					className="text-secondary"
				/>
			),
			path: "/dashboard",
		},
		{
			id: 1,
			title: "User",
			icon: (
				<ContactIcon
					width={40}
					height={40}
					className="text-secondary"
				/>
			),
			path: "/dashboard/user",
		},
		{
			id: 2,
			title: "Booking",
			icon: (
				<LocationIcon
					width={40}
					height={40}
					className="text-secondary"
				/>
			),
			path: "/dashboard",
		},
		{
			id: 3,
			title: "Tour",
			icon: (
				<FlyIcon
					width={40}
					height={40}
					className="text-secondary"
				/>
			),
			path: "/tour",
		},
	];
	const handleClick = (id: number) => {
		setSelectedItem(id);
		router.push(`${items[id].path.toLowerCase()}`);
	};
	return (
		<div className="flex h-screen w-full flex-col gap-4">
			<span className="text-md px-2 font-semibold">Menu</span>
			{items.map((item, index) => (
				<MenuItem
					key={index}
					title={item.title}
					icon={item.icon}
					handleClick={() => handleClick(item.id)}
					selected={selectedItem === item.id || pathname === item.path}
				/>
			))}
		</div>
	);
};
