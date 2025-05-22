"use client";

import {
	CreateBookingDto,
	ServiceConstants,
	TourResponseDto,
	TourScheduleRequestDto,
	TourServices,
	BookingTicketDto,
	BookingServices,
} from "@/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Image, Select, SelectItem } from "@heroui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const BookingPage = () => {
	const [adults, setAdults] = useState<number>(0);
	const [children, setChildren] = useState<number>(0);
	const [babies, setBabies] = useState<number>(0);

	const [adultsInfo, setAdultsInfo] = useState<BookingTicketDto[]>([
		{ ticketType: "ADULT", fullName: "", gender: "", birthDate: "" },
	]);
	const [childrenInfo, setChildrenInfo] = useState<BookingTicketDto[]>([]);
	const [babiesInfo, setBabiesInfo] = useState<BookingTicketDto[]>([]);

	const [bookingForm, setBookingForm] = useState<Omit<CreateBookingDto, "tickets">>({
		userFullName: "",
		userPhone: "",
		userEmail: "",
		userAddress: "",
		tourScheduleId: "",
		note: "",
	});

	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	const searchParams = useSearchParams();
	const tourId = searchParams.get("tourId");
	const scheduleId = searchParams.get("scheduleId");

	const [tour, setTour] = useState<TourResponseDto | null>(null);
	const [schedule, setSchedule] = useState<TourScheduleRequestDto | null>(null);

	const bookingServices = new BookingServices(ServiceConstants.BOOKING_SERVICE);
	const router = useRouter();

	useEffect(() => {
		setAdultsInfo((prev) => {
			const arr = [...prev];
			while (arr.length < adults) arr.push({ ticketType: "ADULT", fullName: "", gender: "", birthDate: "" });
			return arr.slice(0, adults);
		});
	}, [adults]);
	useEffect(() => {
		setChildrenInfo((prev) => {
			const arr = [...prev];
			while (arr.length < children) arr.push({ ticketType: "CHILD", fullName: "", gender: "", birthDate: "" });
			return arr.slice(0, children);
		});
	}, [children]);
	useEffect(() => {
		setBabiesInfo((prev) => {
			const arr = [...prev];
			while (arr.length < babies) arr.push({ ticketType: "BABY", fullName: "", gender: "", birthDate: "" });
			return arr.slice(0, babies);
		});
	}, [babies]);

	useEffect(() => {
		const fetchData = async () => {
			if (tourId) {
				const tourData = await tourServices.getById(tourId, "/tours");
				setTour(tourData);
			}
			if (scheduleId) {
				const scheduleData = await tourServices.getById(scheduleId, "/tour-schedules");
				setSchedule(scheduleData as any);
				setBookingForm((prev) => ({
					...prev,
					tourScheduleId: scheduleId,
				}));
			}
		};
		fetchData();
	}, [tourId, scheduleId]);

	const handleChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
		if (value < 0) return;
		setter(value);
	};

	const handlePassengerChange = (
		type: "ADULT" | "CHILD" | "BABY",
		index: number,
		field: keyof BookingTicketDto,
		value: string,
	) => {
		const setter = type === "ADULT" ? setAdultsInfo : type === "CHILD" ? setChildrenInfo : setBabiesInfo;
		const getter = type === "ADULT" ? adultsInfo : type === "CHILD" ? childrenInfo : babiesInfo;
		const updated = [...getter];
		updated[index] = { ...updated[index], ticketType: type, [field]: value };
		setter(updated);
	};

	const handleAddNew = async () => {
		try {
			if (
				!bookingForm.userFullName ||
				!bookingForm.userEmail ||
				!bookingForm.userAddress ||
				!bookingForm.userPhone ||
				!bookingForm.tourScheduleId ||
				adults + children + babies === 0
			) {
				toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc");
				return;
			}
			const tickets: BookingTicketDto[] = [
				...adultsInfo.slice(0, adults),
				...childrenInfo.slice(0, children),
				...babiesInfo.slice(0, babies),
			];
			const payload: CreateBookingDto = {
				...bookingForm,
				tickets,
			};
			console.log("payload", payload);

			await bookingServices.create(payload as any, "/books/create-booking-admin");
			toast.success("Đặt tour thành công");
			router.push("/dashboard/booking");
		} catch (error) {
			toast.error("Đặt tour thất bại");
			throw error;
		}
	};

	return (
		<div className="flex flex-col items-center gap-2 bg-white p-4 py-8">
			<h2 className="flex text-center text-3xl font-bold text-primary">ĐẶT TOUR</h2>
			<div className="flex w-full max-w-full flex-row justify-center gap-8">
				<div className="flex min-w-0 flex-1 flex-col rounded-lg bg-white p-6">
					<h3 className="mb-2 text-lg font-bold uppercase">Thông tin liên lạc</h3>
					<div className="mb-3 rounded bg-orange-50 px-3 py-2 text-sm text-primary">
						Điền <span className="font-semibold">đúng</span> thông tin để liên lạc, nhận xác nhận và
						thông báo từ công ty
					</div>
					<div className="mb-4 flex flex-col gap-3">
						<Input
							className="shadow-none"
							variant="bordered"
							isRequired
							name="userFullName"
							label="Họ tên"
							labelPlacement="outside"
							placeholder="Nguyễn Văn A"
							value={bookingForm.userFullName}
							onChange={(e) => setBookingForm((f) => ({ ...f, userFullName: e.target.value }))}
						/>
						<Input
							variant="bordered"
							isRequired
							name="userPhone"
							label="Điện thoại"
							labelPlacement="outside"
							placeholder="0987654321"
							value={bookingForm.userPhone}
							onChange={(e) => setBookingForm((f) => ({ ...f, userPhone: e.target.value }))}
						/>
						<Input
							variant="bordered"
							name="userEmail"
							label="Email"
							labelPlacement="outside"
							placeholder="example@email.com"
							value={bookingForm.userEmail}
							onChange={(e) => setBookingForm((f) => ({ ...f, userEmail: e.target.value }))}
						/>
						<Input
							variant="bordered"
							name="userAddress"
							label="Địa chỉ"
							labelPlacement="outside"
							placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
							value={bookingForm.userAddress}
							onChange={(e) => setBookingForm((f) => ({ ...f, userAddress: e.target.value }))}
						/>
						<Input
							variant="bordered"
							name="note"
							label="Ghi chú"
							labelPlacement="outside"
							placeholder="Ghi chú thêm (nếu có)"
							value={bookingForm.note}
							onChange={(e) => setBookingForm((f) => ({ ...f, note: e.target.value }))}
						/>
					</div>

					<h3 className="mb-2 mt-6 text-lg font-bold uppercase">
						Hành khách ({adults + children + babies})
					</h3>
					<div className="mb-4 flex flex-row gap-4">
						<div className="flex min-w-0 flex-1 flex-col items-center rounded border p-4">
							<div className="mb-2 font-medium">Người lớn</div>
							<div className="mb-1 text-xs text-gray-500">Từ 12 tuổi</div>
							<div className="flex items-center gap-2">
								<button
									className="h-7 w-7 rounded border"
									onClick={() => handleChange(setAdults, adults - 1)}
								>
									-
								</button>
								<span className="w-6 text-center">{adults}</span>
								<button
									className="h-7 w-7 rounded border"
									onClick={() => handleChange(setAdults, adults + 1)}
								>
									+
								</button>
							</div>
						</div>
						<div className="flex min-w-0 flex-1 flex-col items-center rounded border p-4">
							<div className="mb-2 font-medium">Trẻ em</div>
							<div className="mb-1 text-xs text-gray-500">Từ 2-11 tuổi</div>
							<div className="flex items-center gap-2">
								<button
									className="h-7 w-7 rounded border"
									onClick={() => handleChange(setChildren, children - 1)}
								>
									-
								</button>
								<span className="w-6 text-center">{children}</span>
								<button
									className="h-7 w-7 rounded border"
									onClick={() => handleChange(setChildren, children + 1)}
								>
									+
								</button>
							</div>
						</div>
						<div className="flex min-w-0 flex-1 flex-col items-center rounded border p-4">
							<div className="mb-2 font-medium">Em bé</div>
							<div className="mb-1 text-xs text-gray-500">Dưới 2 tuổi</div>
							<div className="flex items-center gap-2">
								<button
									className="h-7 w-7 rounded border"
									onClick={() => handleChange(setBabies, babies - 1)}
								>
									-
								</button>
								<span className="w-6 text-center">{babies}</span>
								<button
									className="h-7 w-7 rounded border"
									onClick={() => handleChange(setBabies, babies + 1)}
								>
									+
								</button>
							</div>
						</div>
					</div>

					<h3 className="mb-2 mt-6 text-lg font-bold uppercase">Thông tin hành khách</h3>
					{adults + children + babies === 0 && (
						<div className="flex items-center justify-center">
							<div className="mb-2 font-medium">Chưa có hành khách nào</div>
						</div>
					)}
					{Array.from({ length: adults }).map((_, idx) => (
						<div
							key={`adult-${idx}`}
							className="mb-4 rounded border p-4"
						>
							<div className="mb-2 font-medium">(Từ 12 tuổi) - Người lớn {idx + 1}</div>
							<div className="flex flex-row gap-2">
								<Input
									variant="bordered"
									placeholder="Nhập họ tên"
									value={adultsInfo[idx]?.fullName || ""}
									onChange={(e) =>
										handlePassengerChange("ADULT", idx, "fullName", e.target.value)
									}
								/>
								<Select
									variant="bordered"
									className="max-w-xs"
									placeholder="Chọn giới tính"
									selectedKeys={adultsInfo[idx]?.gender ? [adultsInfo[idx].gender] : []}
									onChange={(e) =>
										handlePassengerChange("ADULT", idx, "gender", e.target.value)
									}
								>
									<SelectItem key="male">Nam</SelectItem>
									<SelectItem key="female">Nữ</SelectItem>
								</Select>
								<Input
									variant="bordered"
									type="date"
									value={adultsInfo[idx]?.birthDate || ""}
									onChange={(e) =>
										handlePassengerChange("ADULT", idx, "birthDate", e.target.value)
									}
								/>
							</div>
						</div>
					))}
					{Array.from({ length: children }).map((_, idx) => (
						<div
							key={`child-${idx}`}
							className="mb-4 rounded border p-4"
						>
							<div className="mb-2 font-medium">(Từ 2-11 tuổi) - Trẻ em {idx + 1}</div>
							<div className="flex flex-row gap-2">
								<Input
									variant="bordered"
									placeholder="Nhập họ tên"
									value={childrenInfo[idx]?.fullName || ""}
									onChange={(e) =>
										handlePassengerChange("CHILD", idx, "fullName", e.target.value)
									}
								/>
								<Select
									variant="bordered"
									className="max-w-xs"
									placeholder="Chọn giới tính"
									selectedKeys={childrenInfo[idx]?.gender ? [childrenInfo[idx].gender] : []}
									onChange={(e) =>
										handlePassengerChange("CHILD", idx, "gender", e.target.value)
									}
								>
									<SelectItem key="male">Nam</SelectItem>
									<SelectItem key="female">Nữ</SelectItem>
								</Select>
								<Input
									variant="bordered"
									type="date"
									value={childrenInfo[idx]?.birthDate || ""}
									onChange={(e) =>
										handlePassengerChange("CHILD", idx, "birthDate", e.target.value)
									}
								/>
							</div>
						</div>
					))}
					{Array.from({ length: babies }).map((_, idx) => (
						<div
							key={`baby-${idx}`}
							className="mb-4 rounded border p-4"
						>
							<div className="mb-2 font-medium">(Dưới 2 tuổi) - Em bé {idx + 1}</div>
							<div className="flex flex-row gap-2">
								<Input
									variant="bordered"
									placeholder="Nhập họ tên"
									value={babiesInfo[idx]?.fullName || ""}
									onChange={(e) =>
										handlePassengerChange("BABY", idx, "fullName", e.target.value)
									}
								/>
								<Select
									variant="bordered"
									className="max-w-xs"
									placeholder="Chọn giới tính"
									selectedKeys={babiesInfo[idx]?.gender ? [babiesInfo[idx].gender] : []}
									onChange={(e) =>
										handlePassengerChange("BABY", idx, "gender", e.target.value)
									}
								>
									<SelectItem key="male">Nam</SelectItem>
									<SelectItem key="female">Nữ</SelectItem>
								</Select>
								<Input
									variant="bordered"
									type="date"
									value={babiesInfo[idx]?.birthDate || ""}
									onChange={(e) =>
										handlePassengerChange("BABY", idx, "birthDate", e.target.value)
									}
								/>
							</div>
						</div>
					))}
				</div>
				{tour && schedule && (
					<div className="flex max-h-min w-1/3 flex-col rounded-lg border-[1.5px] border-gray-300 bg-white p-6">
						<h3 className="mb-4 text-lg font-bold uppercase">Tóm tắt chuyến đi</h3>
						<div className="mb-4 flex w-full flex-row gap-3">
							<Image
								src={tour.thumbnail}
								alt={tour.name}
								width={100}
								height={100}
								className="h-24 w-24 max-w-full rounded-lg object-cover"
							/>
							<div className="flex flex-col gap-2">
								<span className="font-semibold">{tour.name}</span>
								<div className="flex items-center gap-2 text-sm">
									<span>Ngày đi: {dayjs(schedule.startDate).format("DD/MM/YYYY")}</span>
									<span>|</span>
									<span>Ngày về: {dayjs(schedule.endDate).format("DD/MM/YYYY")}</span>
								</div>
								<span>
									Số hành khách:{" "}
									<span className="font-semibold">{adults + children + babies} người</span>{" "}
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex flex-row justify-between text-sm">
								<span>Giá người lớn:</span>
								<span>{schedule.adultPrice.toLocaleString()} đ</span>
							</div>
							<div className="flex flex-row justify-between text-sm">
								<span>Giá trẻ em:</span>
								<span>{schedule.childPrice.toLocaleString()} đ</span>
							</div>
							<div className="flex flex-row justify-between text-sm">
								<span>Giá em bé:</span>
								<span>{schedule.babyPrice.toLocaleString()} đ</span>
							</div>
							<div className="flex flex-row justify-between text-sm">
								<span>Giảm giá:</span>
								<span>0 đ</span>
							</div>
							<div className="flex flex-row justify-between text-lg font-bold text-primary">
								<span>Tổng tiền</span>
								<span>
									{(
										schedule.adultPrice * adults +
										schedule.childPrice * children +
										schedule.babyPrice * babies
									).toLocaleString()}{" "}
									đ
								</span>
							</div>
							<span className="mb-2 text-xs text-gray-500">(Đã bao gồm thuế và phí)</span>
						</div>
						<Button
							size="lg"
							color="primary"
							onPress={handleAddNew}
						>
							Tiếp tục đặt chỗ
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
