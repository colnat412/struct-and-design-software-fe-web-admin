"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { TrashIconn, SearchIcon } from "@/assets/svgs/common";
import { UserDetails } from "./UserDetails";
import { UserResponseDto, UserServices, ServiceConstants } from "@/api";
import { formatDate } from "@/utils/api";

const rowsPerPage = 10;
const pagesPerGroup = 5;

export const UserPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [data, setData] = useState<UserResponseDto[]>([]);
	const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);
	const [isCreate, setIsCreate] = useState<boolean>(false);

	const [leftWidth, setLeftWidth] = useState(60);
	const containerRef = useRef<HTMLDivElement>(null);

	const totalPages = Math.ceil(data.length / rowsPerPage);
	const currentGroup = Math.ceil(page / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
	const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const router = useRouter();
	const pathname = usePathname();

	const userServices = new UserServices(ServiceConstants.USER_SERVICE);

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
				console.log("Fetched users:", users);

				setData(Array.isArray(users) ? users : []);
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

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

	const handleDeleteUser = async (id: string) => {
		try {
			const confirmed = window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?");
			if (!confirmed) return;

			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}

			await userServices.delete(id, "/users");
			setData((prev) => prev.filter((user) => user.userId !== id));
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	return (
		<div
			ref={containerRef}
			className="flex h-[calc(100vh-100px)] w-full overflow-hidden"
		>
			<div
				className="flex flex-col gap-3 overflow-auto p-4"
				style={{ width: selectedUser ? `${leftWidth}%` : "100%" }}
			>
				<span className="text-lg font-semibold">Users Management</span>
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
						placeholder="Search ..."
					/>
					<Button
						radius="none"
						className="rounded-sm bg-primary font-semibold text-white"
					>
						Search
					</Button>
					<Button
						onPress={() => {
							setIsCreate(true);
							setSelectedUser(null);
						}}
						radius="none"
						className="rounded-sm bg-secondary font-semibold text-white"
					>
						Add new user
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
										key={user.userId}
										onClick={() => setSelectedUser(user)}
										className="cursor-pointer hover:bg-gray-100"
									>
										<TableCell className="font-medium text-secondary underline">
											{user.username}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>{user.fullName}</TableCell>
										<TableCell>{user.phone}</TableCell>
										<TableCell>{Number(user.gender) === 0 ? "Male" : "Female"}</TableCell>
										<TableCell>
											{formatDate(new Date(user.birthday).toDateString())}
										</TableCell>
										<TableCell
											className={
												user.role.endsWith("R") ? "text-secondary" : "text-primary"
											}
										>
											{user.role}
										</TableCell>
										<TableCell width={20}>
											<Button
												onPress={() => handleDeleteUser(user.userId)}
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
								Prev
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
						style={{ width: `${100 - leftWidth}%` }}
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
		</div>
	);
};
