"use client";
import { ServiceConstants, TourResponseDto, TourServices } from "@/api";
import { EditIcon, SearchIcon, TrashIcon } from "@/assets/svgs/common";
import { ModalCreate } from "@/components/modals";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/react";
import Link from "next/link";
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
import { FormatNumber } from "@/utils/api";

const rowsPerPage = 10;
const pagesPerGroup = 5;

export const TourPage = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const router = useRouter();
	const pathname = usePathname();
	const [page, setPage] = useState(1);

	const [data, setData] = useState<TourResponseDto[]>([]);
	const totalPages = Math.ceil(data.length / rowsPerPage);
	const currentGroup = Math.ceil(page / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
	const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		const fetchData = async () => {
			try {
				const tours = await tourServices.getAll("/tours");
				setData(Array.isArray(tours) ? tours : []);
			} catch (error) {
				console.error("Error fetching tour data:", error);
			}
		};
		fetchData();
	}, []);

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
			<Table>
				<TableCaption>A list of your tour</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Duration</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentData.map((tour) => (
						<TableRow key={tour.id}>
							<TableCell className="font-medium">{tour.name}</TableCell>
							<TableCell>{tour.description}</TableCell>
							<TableCell>{FormatNumber.toFormatNumber(tour.price)}đ</TableCell>
							<TableCell>{tour.duration}</TableCell>
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
