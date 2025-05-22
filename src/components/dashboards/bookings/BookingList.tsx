"use client";
import { BookingResponseDto, BookingServices, ServiceConstants } from "@/api";
import { SearchIcon } from "@/assets/svgs/common";
import { Pagination } from "@/components/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatNumber } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rowsPerPage = 10;

export const BookingList = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [data, setData] = useState<BookingResponseDto[]>([]);

	const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const router = useRouter();

	const bookingServices = new BookingServices(ServiceConstants.BOOKING_SERVICE);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const bookings = await bookingServices.getAll("/books");
			setData(Array.isArray(bookings) ? bookings : []);
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

	return (
		<div className="flex size-full overflow-hidden">
			<div className="flex w-full flex-col gap-3 overflow-auto p-4">
				<span className="text-lg font-semibold">Quản lý tour đã đặt</span>
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
					/>

					<Button
						radius="none"
						className="rounded-sm bg-primary font-semibold text-white"
					>
						Tìm kiếm
					</Button>
					<Button
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
									<TableHead className="item-s font-bold">Tên người đặt</TableHead>
									<TableHead className="font-bold">Số điện thoại</TableHead>
									<TableHead className="font-bold">Địa chỉ</TableHead>
									<TableHead className="font-bold">Ngày đi</TableHead>
									<TableHead className="font-bold">Ngày về</TableHead>
									<TableHead className="font-bold">Tổng số vé</TableHead>
									<TableHead className="font-bold">Tổng tiền</TableHead>
									<TableHead className="font-bold">Trạng thái</TableHead>
									<TableHead className="font-bold">Ghi chú</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentData.map((booking) => (
									<TableRow
										key={booking.bookingId}
										className="cursor-pointer hover:bg-gray-100"
									>
										<TableCell>{booking.userFullName}</TableCell>
										<TableCell>{booking.userPhone}</TableCell>
										<TableCell>{booking.userAddress}</TableCell>
										<TableCell>
											{dayjs(booking.tourSchedule.startDate).format(
												"DD/MM/YYYY HH:mm",
											)}
										</TableCell>
										<TableCell>
											{dayjs(booking.tourSchedule.endDate).format("DD/MM/YYYY HH:mm")}
										</TableCell>
										<TableCell>
											{[
												...new Set(
													booking.tickets.map((ticket) => ticket.ticketType),
												),
											].map((type) => {
												const ticketCount = booking.tickets.filter(
													(t) => t.ticketType === type,
												).length;
												return (
													<div key={type}>
														{type} ({ticketCount})
													</div>
												);
											})}
										</TableCell>
										<TableCell>
											{FormatNumber.toFormatNumber(booking.totalPrice ?? 0)} đ
										</TableCell>
										<TableCell>
											{booking.status === "PAID"
												? "Đã thanh toán"
												: booking.status === "EXPIRED"
													? "Hết hạn"
													: "Đang chờ"}
										</TableCell>
										<TableCell>{booking.note || "Không có ghi chú"}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<Pagination
							currentPage={page}
							totalItems={data.length}
							itemsPerPage={rowsPerPage}
							onPageChange={setPage}
						/>
					</>
				)}
			</div>
		</div>
	);
};
