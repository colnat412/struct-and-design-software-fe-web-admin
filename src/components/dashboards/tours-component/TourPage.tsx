"use client";
import { EditIcon, SearchIcon, TrashIcon } from "@/assets/svgs/common";
import { ModalCreate } from "@/components/modals";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const users = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	username: `user${i + 1}`,
	email: `test${i + 1}@gmail.com`,
	name: `John Doe ${i + 1}`,
	phone: Math.floor(Math.random() * 1000000000),
	role: i % 2 === 0 ? "Admin" : "Customer",
}));

const rowsPerPage = 10;
const pagesPerGroup = 5;

export const TourPage = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const router = useRouter();
	const pathname = usePathname();
	const [page, setPage] = useState(1);

	const totalPages = Math.ceil(users.length / rowsPerPage);
	const currentGroup = Math.ceil(page / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
	const currentData = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	return (
		<div className="flex w-full flex-col gap-4 p-4">
			<div className="flex w-full flex-col gap-8 p-2">
				<span className="mx-1 font-semibold">Tours Management</span>
				<div className="flex w-full flex-row gap-4">
					<Input
						startContent={
							<SearchIcon
								width={18}
								height={18}
							/>
						}
						radius="sm"
						variant="faded"
						className="w-1/4 justify-center"
						placeholder="Search ..."
					/>
					<div className="flex w-full flex-row justify-between gap-4">
						<Button
							radius="none"
							className="w-1/12 rounded-sm bg-primary font-semibold text-white"
						>
							Search
						</Button>
						<Button
							radius="none"
							onPress={onOpen}
							className="w-1/6 rounded-sm bg-secondary font-semibold text-white"
						>
							Add new tour
						</Button>
					</div>
					<ModalCreate
						onOpen={onOpen}
						isOpen={isOpen}
						onOpenChange={onOpenChange}
					/>
				</div>
			</div>
			<table className="w-full border-collapse border border-gray-300">
				<thead>
					<tr className="w-full bg-gray-100">
						<th className="border border-gray-300 p-2">Thumbnail</th>
						<th className="border border-gray-300 p-2">Tour Name</th>
						<th className="border border-gray-300 p-2">Price</th>
						<th className="border border-gray-300 p-2">Category Tour</th>
						<th className="border border-gray-300 p-2">Duration</th>
						<th className="border border-gray-300 p-2">Action</th>
					</tr>
				</thead>
				<tbody>
					{currentData.map((user) => (
						<tr
							key={user.id}
							className={`${user.id % 2 == 0 ? "bg-gray-100" : ""} border border-gray-300`}
						>
							<td className="p-2 text-center text-secondary underline">
								<Link href={"#"}>{user.username}</Link>
							</td>
							<td className="p-2 text-center">{user.email}</td>
							<td className="p-2 text-center">{user.name}</td>
							<td className="p-2 text-center">{user.phone}</td>
							<td
								className={`p-2 text-center ${user.id % 2 == 0 ? "text-primary" : "text-secondary"}`}
							>
								{user.role}
							</td>
							<td className="flex flex-row items-center justify-center gap-2 p-2 text-center">
								<Button
									variant="light"
									size="sm"
								>
									<EditIcon
										width={20}
										height={20}
										className="stroke-secondary"
									/>
								</Button>
								<Button
									variant="light"
									size="sm"
								>
									<TrashIcon
										width={20}
										height={20}
										className="stroke-red-600"
									/>
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-4 flex flex-row justify-end gap-2 text-center">
				<Button
					size="sm"
					onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
					className="min-w-10 rounded bg-gray-300 hover:bg-gray-400"
					disabled={page === 1}
				>
					Prev
				</Button>
				{startPage > 1 && <span className="">...</span>}
				{Array.from({ length: endPage - startPage + 1 }, (_, i) => (
					<Button
						size="sm"
						key={startPage + i}
						onPress={() => setPage(startPage + i)}
						className={`min-w-10 rounded ${page === startPage + i ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"}`}
					>
						{startPage + i}
					</Button>
				))}
				{endPage < totalPages && <span className="">...</span>}
				<Button
					size="sm"
					onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
					className="min-w-10 rounded bg-gray-300 hover:bg-gray-400"
					disabled={page === totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
};
