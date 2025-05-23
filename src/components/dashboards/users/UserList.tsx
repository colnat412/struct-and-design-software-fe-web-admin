"use client";
import { ServiceConstants, UserResponseDto, UserServices } from "@/api";
import { SearchIcon, TrashIconn } from "@/assets/svgs/common";
import { ConfirmDeleteModal } from "@/components/modals";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateToDisplay } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserDetails } from "./UserDetails";

const rowsPerPage = 10;
// const pagesPerGroup = 5;

export const UserPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [data, setData] = useState<UserResponseDto[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);
	const [isCreate, setIsCreate] = useState<boolean>(false);

	const [leftWidth, setLeftWidth] = useState<number>(60);
	const containerRef = useRef<HTMLDivElement>(null);

	const totalPages = Math.ceil(data.length / rowsPerPage);
	// const currentGroup = Math.ceil(page / pagesPerGroup);
	// const startPage = (currentGroup - 1) * pagesPerGroup + 1;

	const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const router = useRouter();

	const userServices = new UserServices(ServiceConstants.USER_SERVICE);

	const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
	const [userToDelete, setUserToDelete] = useState<UserResponseDto | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const users = await userServices.getAll("/users");

				setData(Array.isArray(users) ? users : []);
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		setLeftWidth(60);
	}, [isCreate, selectedUser]);

	const handleMouseDown = () => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;
			const containerRect = containerRef.current.getBoundingClientRect();
			const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
			if (newLeftWidth > 20 && newLeftWidth < 80) {
				setLeftWidth(newLeftWidth);
			}
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleDeleteClick = (user: UserResponseDto) => {
		setUserToDelete(user);
		setIsDeleteOpen(true);
	};

	const confirmDelete = async () => {
		if (!userToDelete) return;
		try {
			console.log("Deleting tour with ID:", userToDelete.userId);

			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}
			await userServices.delete(userToDelete.userId, "/users");
			setData((prev) => prev.filter((user) => user.userId !== userToDelete.userId));
		} catch (error) {
			console.error("Error deleting tour:", error);
		} finally {
			setIsDeleteOpen(false);
			setUserToDelete(null);
		}
	};

	return (
		<div
			ref={containerRef}
			className="flex h-full w-full overflow-hidden"
		>
			<div
				className="flex flex-col gap-3 overflow-auto p-4"
				style={{
					width: selectedUser || isCreate ? `${leftWidth}%` : "100%",
					minWidth: "20%",
				}}
			>
				<span className="text-lg font-semibold">Quản lý người dùng</span>
				<div className="mb-2 flex items-center gap-4">
					<Input
						startContent={
							<SearchIcon
								width={18}
								height={18}
							/>
						}
						radius="sm"
						variant="faded"
						className="w-1/3"
						placeholder="Tìm kiếm ..."
					/>
					<Button
						radius="none"
						className="rounded-sm bg-primary font-semibold text-white"
					>
						Tìm kiếm
					</Button>
					<Button
						onPress={() => {
							setIsCreate(true);
							setSelectedUser(null);
							setLeftWidth(60);
						}}
						radius="none"
						className="rounded-sm bg-secondary font-semibold text-white"
					>
						Thêm mới
					</Button>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-10">
						<div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-secondary" />
					</div>
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tên người dùng</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Họ tên</TableHead>
									<TableHead>Số điện thoại</TableHead>
									<TableHead>Giới tính</TableHead>
									<TableHead>Ngày sinh</TableHead>
									<TableHead className="w-40">Vai trò</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentData.map((user) => (
									<TableRow
										key={user.userId}
										onClick={() => setSelectedUser(user)}
										className="cursor-pointer hover:bg-gray-100"
									>
										<TableCell className="font-semibold text-secondary">
											{user.username}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>{user.fullName}</TableCell>
										<TableCell>{user.phone}</TableCell>
										<TableCell>{Number(user.gender) === 1 ? "Nam" : "Nữ"}</TableCell>
										<TableCell>{formatDateToDisplay(user.birthday)}</TableCell>
										<TableCell
											className={
												user.role?.endsWith("R")
													? "text-secondary"
													: user.role
														? "text-primary"
														: ""
											}
										>
											{user.role || "N/A"}
										</TableCell>
										<TableCell width={20}>
											<Button
												onPress={() => handleDeleteClick(user)}
												size="sm"
												variant="light"
											>
												<TrashIconn width={20} />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="mt-4 flex flex-row justify-end gap-2 text-center">
							<Button
								size="sm"
								onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
								disabled={page === 1}
								className={`min-w-10 rounded ${
									page === 1
										? "cursor-not-allowed bg-gray-200 text-gray-400"
										: "bg-gray-300 hover:bg-gray-400"
								}`}
							>
								Back
							</Button>
							{Array.from({ length: totalPages }, (_, i) => (
								<Button
									size="sm"
									key={i + 1}
									onPress={() => setPage(i + 1)}
									className={`min-w-10 rounded ${
										page === i + 1
											? "bg-primary text-white"
											: "bg-gray-200 hover:bg-gray-300"
									}`}
								>
									{i + 1}
								</Button>
							))}
							<Button
								size="sm"
								onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
								disabled={page === totalPages}
								className={`min-w-10 rounded ${
									page === totalPages
										? "cursor-not-allowed bg-gray-200 text-gray-400"
										: "bg-gray-300 hover:bg-gray-400"
								}`}
							>
								Next
							</Button>
						</div>
					</>
				)}
			</div>

			{(selectedUser || isCreate) && (
				<>
					<div
						onMouseDown={handleMouseDown}
						className="relative z-10 w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400"
						style={{ height: "100%", minWidth: "6px" }}
					/>
					<div
						className="relative overflow-auto p-4"
						style={{ width: `${100 - leftWidth}%`, minWidth: "20%" }}
					>
						<UserDetails
							selectedUser={selectedUser}
							setSelectedUser={setSelectedUser}
							setIsCreate={setIsCreate}
							setData={setData}
						/>
					</div>
				</>
			)}
			<ConfirmDeleteModal
				isOpen={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				itemName={userToDelete?.fullName}
				onConfirm={confirmDelete}
				onCancel={() => setUserToDelete(null)}
			/>
		</div>
	);
};
