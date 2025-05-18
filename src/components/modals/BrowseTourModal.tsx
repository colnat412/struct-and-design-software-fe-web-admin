"use client";

import {
	CategoryResponseDto,
	CreateTourDto,
	CreateTourImageDto,
	DestinationResponseDto,
	ServiceConstants,
	TourImageRequestDto,
	TourResponseDto,
	TourScheduleRequestDto,
	TourServices,
	UserServices,
} from "@/api";
import { ImageIcon } from "@/assets/svgs/common";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TourImages, TourSchedules } from "../dashboards";

interface BrowseTourModalProps {
	selectedTour: TourResponseDto | null;
	isOpen: boolean;
	onClose: () => void;
	onSaved?: () => void;
}

type TourImageWithFile = TourImageRequestDto & {
	file?: File;
};

export default function BrowseTourModal({ selectedTour, isOpen, onClose, onSaved }: BrowseTourModalProps) {
	const router = useRouter();
	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [thumbnail, setThumbnail] = useState<string | undefined>(selectedTour?.thumbnail);

	const [images, setImages] = useState<TourImageWithFile[]>([]);
	const [schedules, setSchedules] = useState<TourScheduleRequestDto[]>([]);
	const [destinations, setDestinations] = useState<DestinationResponseDto[]>([]);

	const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
	const [isEditingName, setIsEditingName] = useState<boolean>(false);
	const [imageFiles, setImageFiles] = useState<File[]>([]);

	useEffect(() => {
		setThumbnail(selectedTour?.thumbnail);
	}, [selectedTour]);

	useEffect(() => {
		const fetchData = async () => {
			if (selectedTour) {
				try {
					const tourImageRes = await TourServices.getTourImagesOfTour(selectedTour.tourId);
					setImages(tourImageRes);
					const res = await tourServices.getAll("/destinations");
					setDestinations(Array.isArray(res) ? res : []);
					const scheduleRes = await TourServices.getTourSchedulesOfTour(selectedTour.tourId);
					console.log("Tour Schedules:", scheduleRes);
					setSchedules(Array.isArray(scheduleRes) ? scheduleRes : []);
					console.log("Schedule:", schedules);
				} catch (err) {
					console.error("Failed to fetch tour images", err);
				}
			}
		};
		fetchData();
	}, [selectedTour]);

	const [tourForm, setTourForm] = useState({
		thumbnail: "",
		name: "",
		description: "",
		duration: "",
		price: "",
		categoryId: "",
	});

	useEffect(() => {
		if (selectedTour) {
			setTourForm({
				thumbnail: selectedTour.thumbnail || "",
				name: selectedTour.name || "",
				description: selectedTour.description || "",
				duration: selectedTour.duration || "",
				price: selectedTour.price?.toString() || "",
				categoryId: selectedTour.categoryTour?.categoryTourId || "",
			});
			console.log("Selected Tour:", selectedTour);
			console.log("Form Data:", tourForm);
		} else {
			setTourForm({
				thumbnail: "",
				name: "Tour mới",
				description: "",
				duration: "",
				price: "",
				categoryId: "",
			});
		}
	}, [selectedTour]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const fetchCategories = async () => {
			try {
				const res = await tourServices.getAll("/category-tours");
				setCategories(Array.isArray(res) ? res : []);
			} catch (err) {
				console.error("Failed to fetch categories", err);
			}
		};
		fetchCategories();
	}, []);

	const handleImageClick = () => fileInputRef.current?.click();

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setThumbnail(imageUrl);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setTourForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddNewTour = async () => {
		try {
			// const thumbnailFile = fileInputRef.current?.files?.[0];
			// const thumbnailUpload = await UserServices.uploadAvatar(thumbnailFile);

			const payload = {
				name: tourForm.name,
				description: tourForm.description,
				duration: tourForm.duration,
				price: Number(tourForm.price),
				thumbnail: thumbnail || "",
				categoryId: tourForm.categoryId,
			} as CreateTourDto;
			const newTour = await tourServices.create(payload as any, "/tours");

			if (newTour) {
				for (const [index, image] of images.entries()) {
					const formDataTourImages = new FormData();
					if (image.file) {
						formDataTourImages.append("file", image.file);
					}
					formDataTourImages.append("description", image.description || `Ảnh tour ${index + 1}`);
					formDataTourImages.append("orderIndex", index.toString());
					formDataTourImages.append("tourId", newTour.tourId);
					await TourServices.createTourImage(formDataTourImages);
				}
			}
			onSaved?.();
			onClose();
		} catch (error: any) {
			console.error("Failed to add new tour:", error.response?.data || error.message || error);
		}
	};

	return (
		<Modal
			className="size-11/12 max-w-screen-xl"
			isOpen={isOpen}
			onClose={onClose}
			placement="center"
		>
			<ModalContent className="max-h-[90vh] overflow-hidden">
				<ModalHeader>
					{isEditingName ? (
						<input
							type="text"
							name="name"
							placeholder="Nhập tên tour"
							className="text-md w-full border-b bg-transparent font-semibold outline-none transition-all focus:border-primary"
							value={tourForm.name}
							onChange={handleChange}
							onBlur={() => setIsEditingName(false)}
							autoFocus
						/>
					) : (
						<div
							className="group flex w-full cursor-pointer flex-row items-center gap-2"
							onClick={() => setIsEditingName(true)}
						>
							<h2 className="text-lg font-semibold text-gray-800">
								{tourForm.name || "Tour mới"}
							</h2>
							<PencilIcon
								size={16}
								className="text-secondary group-hover:text-secondary"
							/>
						</div>
					)}
				</ModalHeader>
				<ModalBody
					className="flex w-full max-w-full flex-col overflow-y-auto p-4"
					style={{ maxHeight: "100vh" }}
				>
					<h3 className="text-lg font-semibold">Thông Tin Tour</h3>

					<div className="flex flex-col gap-4">
						<div className="m-1 flex flex-col gap-1">
							<span className="mb-2 text-sm font-medium">Ảnh đại diện</span>
							<div
								onClick={handleImageClick}
								className="flex h-48 w-80 cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
							>
								{thumbnail ? (
									<img
										src={thumbnail}
										alt="Thumbnail"
										className="h-full w-full object-cover"
									/>
								) : (
									<>
										<ImageIcon
											width={24}
											height={24}
											opacity={0.5}
										/>
										<p className="text-sm text-gray-500">Nhấn vào để thêm ảnh</p>
									</>
								)}
							</div>
							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleImageChange}
							/>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex flex-row gap-2">
								<Input
									isRequired
									name="duration"
									label="Thời lượng"
									labelPlacement="outside"
									placeholder="3 ngày 2 đêm"
									value={tourForm.duration}
									onChange={handleChange}
								/>
								<Input
									isRequired
									name="price"
									label="Giá"
									inputMode="numeric"
									labelPlacement="outside"
									placeholder="2.500.000"
									value={tourForm.price}
									onChange={handleChange}
								/>
								<select
									className="rounded border p-2"
									name="categoryId"
									value={tourForm.categoryId}
									onChange={handleChange}
								>
									<option value="">Chọn loại tour</option>
									{categories.map((cat) => (
										<option
											key={cat.categoryTourId}
											value={cat.categoryTourId}
										>
											{cat.name}
										</option>
									))}
								</select>
							</div>
							{/* <Input
							name="destination"
							label="Destination"
							labelPlacement="outside"
							placeholder="e.g. Da Nang"
							value={tourForm.destination}
							onChange={handleChange}
						/> */}
							<Textarea
								isRequired
								name="description"
								label="Mô tả"
								labelPlacement="outside"
								placeholder="Chi tiết tour"
								value={tourForm.description}
								onChange={handleChange}
							/>
						</div>
					</div>

					<TourImages
						images={images}
						setImages={setImages}
					/>
					<TourSchedules
						schedules={schedules}
						setSchedules={setSchedules}
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						color="secondary"
						onPress={onClose}
					>
						Hủy
					</Button>
					<Button
						color="primary"
						onPress={handleAddNewTour}
					>
						Lưu
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
