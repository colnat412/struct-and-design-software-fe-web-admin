"use client";
import { EditIcon, SearchIcon, TrashIcon, TrashIconn } from "@/assets/svgs/common";
import { ModalCreate } from "@/components/modals";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { DatePicker, Form, Radio, RadioGroup, useDisclosure } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ServiceConstants, UserResponseDto, UserServices } from "@/api";
import { BinaryIcon, RecycleIcon } from "lucide-react";

const rowsPerPage = 10;
const pagesPerGroup = 5;

export const UserPage = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const router = useRouter();
	const pathname = usePathname();
	const [page, setPage] = useState(1);

	const [data, setData] = useState<UserResponseDto[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);

	const totalPages = Math.ceil(data.length / rowsPerPage);
	const currentGroup = Math.ceil(page / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
	const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const userServices = new UserServices(ServiceConstants.USER_SERVICE);

	const handleCreateNewUser = async (user: UserResponseDto) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}
			const res = await userServices.create(user, "/users");
			setData((prev) => [...prev, user]);
			return res;
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}
			await userServices.delete(userId, "/users");
			setData((prev) => prev.filter((user) => user.id !== userId));
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {
			try {
				const users = await userServices.getAll("/users");
				console.log("users", users);
				setData(Array.isArray(users) ? users : []);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};
		fetchData();
	}, []);
	const [action, setAction] = React.useState(null);

	return (
		<div className="flex w-full flex-col gap-4 p-4">
			<div className={`flex flex-col gap-4 ${selectedUser ? "h-2/3" : "w-full"}`}>
				<span className="mx-1 font-semibold">Users Management</span>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Username</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Gender</TableHead>
							<TableHead>Date of birth</TableHead>
							<TableHead className="w-40">Role</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentData.map((user) => (
							<TableRow
								key={user.id}
								onClick={() => setSelectedUser(user)}
								className="cursor-pointer hover:bg-gray-100"
							>
								<TableCell className="font-medium text-secondary underline">
									{user.username}
								</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>{Number(user.gender) === 1 ? "Nam" : "Nữ"}</TableCell>
								<TableCell> {new Date(user.birthday).toLocaleDateString("vi-VN")}</TableCell>
								<TableCell>{user.role}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="mt-4 flex flex-row justify-end gap-2 text-center">
					<Button
						size="sm"
						onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
						className="min-w-10 rounded bg-gray-300 hover:bg-gray-400"
						disabled={page === 1}
					>
						Prev
					</Button>
					{Array.from({ length: totalPages }, (_, i) => (
						<Button
							size="sm"
							key={i + 1}
							onPress={() => setPage(i + 1)}
							className={`min-w-10 rounded ${
								page === i + 1 ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"
							}`}
						>
							{i + 1}
						</Button>
					))}
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

			{selectedUser && (
				<Form className="flex h-1/3 w-full max-w-full flex-col gap-4 p-4">
					<span className="mx-1 font-semibold">User Information</span>
					<div className="flex w-full gap-5">
						<Input
							isRequired
							errorMessage="Please enter a username"
							label="Username"
							labelPlacement="outside"
							name="username"
							placeholder="Enter your username"
							type="text"
							value={selectedUser.username}
						/>
						<Input
							isRequired
							errorMessage="Please enter a email"
							label="Email"
							labelPlacement="outside"
							name="email"
							placeholder="Enter your email"
							type="text"
							value={selectedUser.email}
						/>
						<Input
							isRequired
							errorMessage="Please enter a name"
							label="Name"
							labelPlacement="outside"
							name="name"
							placeholder="Enter your name"
							type="text"
							value={selectedUser.name}
						/>
					</div>

					<div className="flex w-full items-center gap-5">
						<RadioGroup
							value={Number(selectedUser.gender) === 0 ? "0" : "1"}
							className="w-1/6"
							label="Gender"
							orientation="horizontal"
						>
							<Radio value="0">Male</Radio>
							<Radio value="1">Female</Radio>
						</RadioGroup>

						{/* <DatePicker
							label="Birth date"
							isRequired
							className="max-w-[284px]"
							value={
								selectedUser.birthday
									? new Date(selectedUser.birthday) // đảm bảo truyền đúng kiểu Date
									: undefined
							}
							onChange={(date) => {
								setSelectedUser((prev) => ({
									...prev,
									birthday: date?.toISOString() ?? null, // hoặc date, tuỳ bạn muốn lưu Date hay string
								}));
							}}
						/> */}

						<Input
							className="w-1/4"
							isRequired
							errorMessage="Please enter a valid username"
							label="Phone"
							labelPlacement="outside"
							name="phone"
							placeholder="Enter your phone"
							type="text"
							value={selectedUser.phone.toString()}
						/>
						<Input
							className="w-1/3"
							isRequired
							errorMessage="Please enter a role"
							label="Role"
							labelPlacement="outside"
							name="username"
							placeholder="Enter your role"
							type="text"
							value={selectedUser.role}
						/>
					</div>

					<div className="flex gap-2">
						<Button
							color="primary"
							type="submit"
						>
							Save
						</Button>
						<Button onPress={() => setSelectedUser(null)}>Cancel</Button>
					</div>
					{action && (
						<div className="text-small text-default-500">
							Action: <code>{action}</code>
						</div>
					)}
				</Form>
			)}
		</div>
	);
};
