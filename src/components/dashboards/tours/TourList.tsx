"use client";
import { CategoryResponseDto, ServiceConstants, TourResponseDto, TourServices } from "@/api";
import { FilterIcon, SearchIcon, TrashIconn } from "@/assets/svgs/common";
import { ConfirmDeleteModal } from "@/components/modals";
import BrowseTourModal from "@/components/modals/BrowseTourModal";
import FilterModal from "@/components/modals/FilterModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatNumber } from "@/utils/api";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rowsPerPage = 10;

export const TourList = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [data, setData] = useState<TourResponseDto[]>([]);
	const [selectedTour, setSelectedTour] = useState<TourResponseDto | null>(null);
	const [isCreate, setIsCreate] = useState<boolean>(false);

	const totalPages = Math.ceil(data.length / rowsPerPage);
	const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const router = useRouter();

	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

	const [searchInput, setSearchInput] = useState<string>("");
	const [categories, setCategories] = useState<CategoryResponseDto[]>([]);

	const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
	const [tourToDelete, setTourToDelete] = useState<TourResponseDto | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleCategory = (category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
		);
		console.log("Selected categories:", selectedCategories);
	};

	const handleApplyFilter = () => {
		setIsFilterOpen(false);
	};

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const tours = await tourServices.getAll("/tours");
			const categories = await tourServices.getAll("/category-tours");
			setData(Array.isArray(tours) ? tours : []);
			setCategories(Array.isArray(categories) ? categories : []);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		fetchData();
	}, []);

	const handleSearch = async (keyword: string) => {
		if (!keyword) {
			setSearchInput("");
		}
		const res = await TourServices.searchTour(keyword);
		if (res) {
			setData(res);
		}
	};

	const handleDeleteClick = (tour: TourResponseDto) => {
		setTourToDelete(tour);
		setIsDeleteOpen(true);
	};

	const confirmDelete = async () => {
		if (!tourToDelete) return;
		try {
			console.log("Deleting tour with ID:", tourToDelete.tourId, isCreate);

			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}
			await tourServices.delete(tourToDelete.tourId, "/tours");
			setData((prev) => prev.filter((tour) => tour.tourId !== tourToDelete.tourId));
		} catch (error) {
			console.error("Error deleting tour:", error);
		} finally {
			setIsDeleteOpen(false);
			setTourToDelete(null);
		}
	};

	const handleChange = (index: number, rawValue: string) => {
		const numericValue = Number(rawValue.replace(/\D/g, ""));
		const newRange = [...priceRange] as [number, number];
		if (index === 0) {
			newRange[0] = Math.min(numericValue, priceRange[1]);
		} else {
			newRange[1] = Math.max(numericValue, priceRange[0]);
		}
		setPriceRange(newRange);
	};

	const handleOpenDetails = (tour: TourResponseDto) => {
		setSelectedTour(tour);
		setIsModalOpen(true);
	};

	return (
		<div className="flex size-full overflow-hidden">
			<div className="flex w-full flex-col gap-3 overflow-auto p-4">
				<span className="text-lg font-semibold">Quản lý tour</span>
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
						placeholder="Tìm kiếm..."
						onChange={(e) => {
							setSearchInput(e.target.value);
						}}
					/>

					<Button
						onPress={() => {
							handleSearch(searchInput);
						}}
						radius="none"
						className="rounded-sm bg-primary font-semibold text-white"
					>
						Tìm kiếm
					</Button>
					<Button
						onPress={() => {
							setIsCreate(true);
							setSelectedTour(null);
							setIsModalOpen(true);
						}}
						radius="none"
						className="rounded-sm bg-secondary font-semibold text-white"
					>
						Thêm mới
					</Button>
					<Button
						startContent={<FilterIcon />}
						onPress={() => setIsFilterOpen(true)}
						radius="none"
						className="rounded-sm bg-primary"
					></Button>
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
									<TableHead className="item-s font-bold">Ảnh</TableHead>
									<TableHead className="font-bold">Tên tour</TableHead>
									<TableHead className="font-bold">Mô tả</TableHead>
									<TableHead className="font-bold">Thời lượng chuyến</TableHead>
									<TableHead className="font-bold">Giá</TableHead>
									<TableHead className="font-bold">Loại tour</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentData.map((tour) => (
									<TableRow
										key={tour.tourId}
										onClick={() => handleOpenDetails(tour)}
										className="cursor-pointer hover:bg-gray-100"
									>
										<TableCell width={128}>
											<Image
												width={100}
												src={tour.thumbnail}
											/>
										</TableCell>
										<TableCell
											width={400}
											className="font-medium"
										>
											{tour.name}
										</TableCell>
										<TableCell width={500}>{tour.description}</TableCell>
										<TableCell width={150}>{tour.duration}</TableCell>
										<TableCell>
											{FormatNumber.toFormatNumber(tour.price ?? 0)} đ
										</TableCell>
										<TableCell>{tour.categoryTour.name}</TableCell>
										<TableCell width={20}>
											<Button
												onPress={() => handleDeleteClick(tour)}
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

						{/* <Pagination
							currentPage={page}
							totalItems={data.length}
							itemsPerPage={rowsPerPage}
							onPageChange={setPage}
						/> */}
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

			<FilterModal
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				categories={categories}
				selectedCategories={selectedCategories}
				toggleCategory={toggleCategory}
				priceRange={priceRange}
				formatCurrency={FormatNumber.formatCurrency}
				handleChange={handleChange}
				handleApplyFilter={handleApplyFilter}
			/>

			<ConfirmDeleteModal
				isOpen={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				itemName={tourToDelete?.name}
				onConfirm={confirmDelete}
				onCancel={() => setTourToDelete(null)}
			/>

			<BrowseTourModal
				selectedTour={selectedTour}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSaved={() => {
					setIsModalOpen(false);
					fetchData();
				}}
			/>
		</div>
	);
};
