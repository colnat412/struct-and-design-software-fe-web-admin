"use client";

import { Button } from "@heroui/button";

interface MenuItemProps {
	title: string;
	icon: React.ReactNode;
	selected?: boolean;
	handleClick?: () => void;
}

export const MenuItem = ({ title, icon, selected, handleClick }: MenuItemProps) => {
	return (
		<Button
			onPress={handleClick}
			startContent={icon}
			className={`flex w-full flex-row items-center justify-start gap-6 p-5 font-semibold ${selected ? "bg-primary text-white" : "bg-white text-black"}`}
			radius="none"
			variant="solid"
		>
			{title}
		</Button>
	);
};
