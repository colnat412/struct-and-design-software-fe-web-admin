"use client";

import { ConstructionIcon, NotFoundIcon } from "@/assets/svgs/common";
import { Button } from "@heroui/button";
import { Metadata } from "next";
import { useRouter } from "next/navigation";

export const NotFoundComponent = () => {
	const router = useRouter();
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-10">
			<span className="text-2xl text-secondary">
				This page is under construction and will be coming to you soon.
			</span>
			<ConstructionIcon
				width={256}
				height={256}
			/>
			<Button
				onPress={() => router.push("/dashboard/user")}
				className="w-1/6 bg-primary p-6 text-lg font-semibold text-white"
			>
				Go back to dashboard
			</Button>
		</div>
	);
};
