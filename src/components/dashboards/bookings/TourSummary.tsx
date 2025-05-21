"use client";

import React from "react";
import { Button } from "@heroui/button";
import { TourResponseDto, TourScheduleResponseDto } from "@/api";

interface TourSummaryProps {
	tour: TourResponseDto;
	schedule: TourScheduleResponseDto;
	numAdults: number;
	numChildren: number;
	numBabies: number;
}

export const TourSummary: React.FC<TourSummaryProps> = ({ tour, schedule, numAdults, numChildren, numBabies }) => {
	const totalPassengers = numAdults + numChildren + numBabies;
	const totalPrice =
		numAdults * schedule.adultPrice + numChildren * schedule.childPrice + numBabies * schedule.babyPrice;

	return (
		<div className="flex w-[350px] min-w-[300px] flex-col rounded-lg bg-white p-6 shadow">
			<h3 className="mb-4 text-lg font-bold uppercase">Tóm tắt chuyến đi</h3>
			<div className="mb-4 flex gap-3">
				<img
					src={tour.thumbnail}
					alt={tour.name}
					className="h-20 w-28 rounded object-cover"
				/>
				<div>
					<div className="font-semibold">{tour.name}</div>
					<div className="text-xs text-gray-500">Mã tour: {tour.tourId}</div>
					<div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
						<span>Ngày đi: {new Date(schedule.startDate).toLocaleDateString()}</span>
						<span>•</span>
						<span>Số hành khách: {totalPassengers} người</span>
					</div>
				</div>
			</div>

			<div className="mb-2 flex justify-between text-sm">
				<span>Phí người lớn:</span>
				<span>{schedule.adultPrice.toLocaleString()} đ</span>
			</div>
			<div className="mb-2 flex justify-between text-sm">
				<span>Phí trẻ em:</span>
				<span>{schedule.childPrice.toLocaleString()} đ</span>
			</div>
			<div className="mb-2 flex justify-between text-sm">
				<span>Phí em bé:</span>
				<span>{schedule.babyPrice.toLocaleString()} đ</span>
			</div>
			<div className="mb-2 flex justify-between text-sm">
				<span>Giảm giá:</span>
				<span>0 đ</span>
			</div>
			<div className="mb-2 flex items-center gap-2">
				<input
					className="flex-1 rounded border px-2 py-1 text-sm"
					placeholder="Mã giảm giá"
				/>
				<button className="rounded bg-gray-200 px-3 py-1 text-sm font-medium">Áp dụng</button>
			</div>
			<div className="my-4 flex justify-between text-lg font-bold text-orange-500">
				<span>Tổng tiền</span>
				<span>{totalPrice.toLocaleString()} đ</span>
			</div>
			<div className="mb-2 text-xs text-gray-500">Đã bao gồm thuế và phí</div>
			<Button color="primary">Đặt chỗ</Button>
		</div>
	);
};
