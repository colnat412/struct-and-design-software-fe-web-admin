"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { useState } from "react";

const users = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	name: `User ${i + 1}`,
	role: "Developer",
	status: i % 2 === 0 ? "Active" : "Inactive",
}));

const rowsPerPage = 10;
const pagesPerGroup = 5;

export const UserPage = () => {
	const [page, setPage] = useState(1);

	const totalPages = Math.ceil(users.length / rowsPerPage);
	const currentGroup = Math.ceil(page / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
	const currentData = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	return (
		<div className="flex w-full flex-col gap-4 p-4">
			<div className="flex flex-col gap-4 p-2">
				<span className="mx-1 font-semibold">Users</span>
				<div className="flex flex-row gap-4">
					<Input
						radius="sm"
						variant="faded"
						className="w-1/4"
						placeholder="Try search any thing..."
					/>
					<Button className="w-1/12 bg-primary font-semibold text-white">Search</Button>
					<Button className="w-1/12 bg-secondary font-semibold text-white">Create</Button>
				</div>
			</div>
			<table className="w-full border-collapse border border-gray-300">
				<thead>
					<tr className="bg-gray-200">
						<th className="border border-gray-300 p-2">Email</th>
						<th className="border border-gray-300 p-2">Username</th>
						<th className="border border-gray-300 p-2">Full Name</th>
						<th className="border border-gray-300 p-2">Role</th>
					</tr>
				</thead>
				<tbody>
					{currentData.map((user) => (
						<tr
							key={user.id}
							className="border border-gray-300"
						>
							<td className="p-2 text-center">{user.id}</td>
							<td className="p-2 text-center">{user.name}</td>
							<td className="p-2 text-center">{user.role}</td>
							<td className="p-2 text-center">{user.status}</td>
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
