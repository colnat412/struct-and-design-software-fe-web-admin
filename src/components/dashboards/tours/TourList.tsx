"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { TrashIconn, SearchIcon } from "@/assets/svgs/common";
import { UserServices, ServiceConstants, TourResponseDto, TourServices } from "@/api";
import { Image } from "@heroui/image";
import { TourDetails } from "./TourDetails";
import { FormatNumber } from "@/utils/api";

const rowsPerPage = 10;
const pagesPerGroup = 5;

export const TourList = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [data, setData] = useState<TourResponseDto[]>([]);
	const [selectedTour, setSelectedTour] = useState<TourResponseDto | null>(null);
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

	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const users = await tourServices.getAll("/tours");
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
			console.log("Deleting user with ID:", id);

			await tourServices.delete(id, "/tours");
			setData((prev) => prev.filter((tour) => tour.id !== id));
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
				style={{ width: selectedTour ? `${leftWidth}%` : "100%" }}
			>
				<span className="text-lg font-semibold">Tours Management</span>
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
							setSelectedTour(null);
						}}
						radius="none"
						className="rounded-sm bg-secondary font-semibold text-white"
					>
						Add new tour
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
									<TableHead className="item-s font-bold">Thumbnail</TableHead>
									<TableHead className="font-bold">Name</TableHead>
									<TableHead className="font-bold">Description</TableHead>
									<TableHead className="font-bold">Duration</TableHead>
									<TableHead className="font-bold">Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentData.map((tour) => (
									<TableRow
										key={tour.id}
										onClick={() => setSelectedTour(tour)}
										className="cursor-pointer hover:bg-gray-100"
									>
										<TableCell width={200}>
											<Image
												width={200}
												src={tour.thumbnail}
											/>
										</TableCell>
										<TableCell
											width={400}
											className="font-medium text-secondary underline"
										>
											{tour.name}
										</TableCell>
										<TableCell width={500}>{tour.description}</TableCell>
										<TableCell width={200}>{tour.duration}</TableCell>
										<TableCell>{FormatNumber.toFormatNumber(tour.price ?? 0)}đ</TableCell>
										<TableCell width={20}>
											<Button
												onPress={() => handleDeleteUser(tour.id)}
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

			{(selectedTour || isCreate) && (
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
						<TourDetails
							selectedTour={selectedTour}
							setSelectedTour={setSelectedTour}
							setIsCreate={setIsCreate}
						/>
					</div>
				</>
			)}
		</div>
	);
};
