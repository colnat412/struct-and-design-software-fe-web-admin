"use client";

import {
	CategoryResponseDto,
	CreateTourDestinationDto,
	CreateTourDto,
	CreateTourScheduleDto,
	DestinationResponseDto,
	ServiceConstants,
	TourDestinationResponseDto,
	TourImageResponseDto,
	TourResponseDto,
	TourScheduleRequestDto,
	TourScheduleResponseDto,
	TourServices,
	UpdateTourDestinationDto,
	UpdateTourDto,
	UpdateTourScheduleDto,
	UserServices,
} from "@/api";
import { ImageIcon } from "@/assets/svgs/common";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Loader2, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TourDestination, TourImages, TourSchedules } from "../dashboards";
import BookingScheduleModal from "./ChooseScheduleModal";
import { toast, Toaster } from "sonner";

interface BrowseTourModalProps {
	selectedTour: TourResponseDto | null;
	isOpen: boolean;
	onClose: () => void;
	onSaved?: () => void;
}

type TourImageWithFile = TourImageResponseDto & {
	file?: File;
};

export default function BrowseTourModal({ selectedTour, isOpen, onClose, onSaved }: BrowseTourModalProps) {
	const router = useRouter();
	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [thumbnail, setThumbnail] = useState<{ imageUrl: string; file?: File } | null>(null);
	const [thumbnailLoading, setThumbnailLoading] = useState(false);

	const [images, setImages] = useState<TourImageWithFile[]>([]);
	const [schedules, setSchedules] = useState<TourScheduleRequestDto[]>([]);
	const [destinations, setDestinations] = useState<DestinationResponseDto[]>([]);

	const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
	const [isEditingName, setIsEditingName] = useState<boolean>(false);
	const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);

	const [isCreate, setIsCreate] = useState<boolean>(false);
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
	const [selectedSchedule, setSelectedSchedule] = useState<TourScheduleResponseDto | null>(null);

	useEffect(() => {
		if (selectedTour?.thumbnail) {
			setThumbnail({ imageUrl: selectedTour.thumbnail });
		} else {
			setThumbnail(null);
		}
	}, [selectedTour]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (selectedTour) {
					const tourImageRes = await TourServices.getTourImagesOfTour(selectedTour.tourId);
					console.log("Tour Image Res", tourImageRes);
					setImages(tourImageRes);

					const scheduleRes = await TourServices.getTourSchedulesOfTour(selectedTour.tourId);
					setSchedules(Array.isArray(scheduleRes) ? scheduleRes : []);
					const TourDestinationRes = await TourServices.getTourDestinationsOfTour(selectedTour.tourId);
					setSelectedDestinationIds(
						TourDestinationRes.map(
							(tourDestination: TourDestinationResponseDto) =>
								tourDestination.destination.destinationId,
						),
					);
					console.log("Tour Destination Res", TourDestinationRes);
				}
			} catch (err) {
				console.error("Failed to fetch tour images", err);
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
			setIsCreate(false);
		} else {
			setTourForm({
				thumbnail: "",
				name: "Tour mới",
				description: "",
				duration: "",
				price: "",
				categoryId: "",
			});
			setImages([]);
			setSchedules([]);
			setSelectedDestinationIds([]);
			setIsCreate(true);
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
				const destinationsRes = await tourServices.getAll("/destinations");
				setDestinations(Array.isArray(destinationsRes) ? destinationsRes : []);
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
			setThumbnailLoading(true);
			setThumbnail({ imageUrl, file });
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setTourForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddNewTour = async () => {
		try {
			const thumbnailUrl = await UserServices.uploadImage(thumbnail?.file as File);
			const payload = {
				name: tourForm.name,
				description: tourForm.description,
				duration: tourForm.duration,
				price: Number(tourForm.price),
				thumbnail: thumbnailUrl || "",
				categoryId: tourForm.categoryId,
			} as CreateTourDto;

			const newTour = await tourServices.create(payload as any, "/tours");
			if (newTour) {
				toast.success("Tạo tour mới thành công");
				// Create Tour Images
				for (const [index, image] of images.entries()) {
					const formDataTourImages = new FormData();
					if (image.file) {
						formDataTourImages.append("file", image.file);
					}
					formDataTourImages.append("description", `Ảnh tour ${index + 1}`);
					formDataTourImages.append("orderIndex", index.toString());
					formDataTourImages.append("tourId", newTour.tourId);
					await TourServices.createTourImage(formDataTourImages);
				}
				// Create Tour Schedule
				if (schedules.length > 0) {
					for (const schedule of schedules) {
						const tourSchedulePayload = {
							name: schedule.name,
							description: schedule.description,
							startDate: schedule.startDate,
							endDate: schedule.endDate,
							adultPrice: schedule.adultPrice,
							childPrice: schedule.childPrice,
							babyPrice: schedule.babyPrice,
							slot: schedule.slot,
							tourId: newTour.tourId,
						} as CreateTourScheduleDto;
						await tourServices.create(tourSchedulePayload as any, "/tour-schedules");
					}
				}
				// Create Tour Destinations
				const selectedDestinations = destinations.filter((d) =>
					selectedDestinationIds.includes(d.destinationId),
				);
				for (const [index, destination] of selectedDestinations.entries()) {
					const destinationPayload: CreateTourDestinationDto = {
						name: destination.name,
						description: destination.description,
						tourId: newTour.tourId,
						orderIndex: index + 1,
						destinationId: destination.destinationId,
					};
					await tourServices.create(destinationPayload as any, "/tour-destinations");
				}
			}

			onSaved?.();
			onClose();
		} catch (error: any) {
			console.error("Failed to add new tour:", error.response?.data || error.message || error);
		}
	};

	const handleEditTour = async () => {
		try {
			let thumbnailUrl = selectedTour?.thumbnail || "";
			if (thumbnail?.file) {
				thumbnailUrl = await UserServices.uploadImage(thumbnail.file as File);
			}
			const tourPayload = {
				name: tourForm.name,
				description: tourForm.description,
				duration: tourForm.duration,
				price: Number(tourForm.price),
				thumbnail: thumbnailUrl,
				categoryId: tourForm.categoryId,
			} as UpdateTourDto;
			await tourServices.update(selectedTour?.tourId as string, tourPayload as any, `/tours`);
			const currentSchedules = await TourServices.getTourSchedulesOfTour(selectedTour!.tourId);
			if (currentSchedules.length < schedules.length) {
				const schedulesNew = schedules.filter((schedule) => {
					return !currentSchedules.some(
						(currentSchedule: TourScheduleResponseDto) =>
							currentSchedule.name === schedule.name &&
							currentSchedule.startDate === schedule.startDate &&
							currentSchedule.endDate === schedule.endDate,
					);
				});
				for (const schedule of schedulesNew) {
					const tourSchedulePayload = {
						name: schedule.name,
						description: schedule.description,
						startDate: schedule.startDate,
						endDate: schedule.endDate,
						adultPrice: schedule.adultPrice,
						childPrice: schedule.childPrice,
						babyPrice: schedule.babyPrice,
						slot: schedule.slot,
						tourId: selectedTour?.tourId,
					} as CreateTourScheduleDto;
					console.log("Tour Schedule Payload", tourSchedulePayload);

					await tourServices.create(tourSchedulePayload as any, "/tour-schedules");
				}
			} else if (currentSchedules.length > schedules.length) {
				const schedulesRemove = currentSchedules.filter((currentSchedule: TourScheduleResponseDto) => {
					return !schedules.some(
						(schedule: TourScheduleResponseDto) =>
							currentSchedule.name === schedule.name &&
							currentSchedule.startDate === schedule.startDate &&
							currentSchedule.endDate === schedule.endDate,
					);
				});
				for (const schedule of schedulesRemove) {
					await tourServices.delete(schedule.tourScheduleId, "/tour-schedules");
				}
			} else {
				for (const schedule of schedules) {
					const tourSchedulePayload = {
						tourScheduleId: schedule.tourScheduleId,
						name: schedule.name,
						description: schedule.description,
						startDate: schedule.startDate,
						endDate: schedule.endDate,
						adultPrice: schedule.adultPrice,
						childPrice: schedule.childPrice,
						babyPrice: schedule.babyPrice,
						slot: schedule.slot,
						tourId: selectedTour?.tourId,
					} as UpdateTourScheduleDto;
					await TourServices.updateTourSchedule(tourSchedulePayload);
				}
			}

			const oldImages = await TourServices.getTourImagesOfTour(selectedTour!.tourId);
			const imagesToAdd = images.filter((image) => image.file && !image.tourImageId);
			const imagesToRemove = oldImages.filter(
				(image: TourImageResponseDto) => !images.some((img) => img.tourImageId === image.tourImageId),
			);
			await Promise.all(
				imagesToAdd.map((image, index) => {
					const formDataTourImages = new FormData();
					if (image.file) {
						formDataTourImages.append("file", image.file);
					}
					formDataTourImages.append("description", `Ảnh tour ${index + 1}`);
					formDataTourImages.append("orderIndex", index.toString());
					formDataTourImages.append("tourId", selectedTour!.tourId);
					return TourServices.createTourImage(formDataTourImages);
				}),
			);
			await Promise.all(
				imagesToRemove.map((image: TourImageResponseDto) =>
					tourServices.delete(image.tourImageId, "/api/tour-images/delete"),
				),
			);
			const currentDestinationIds = selectedDestinationIds;
			const oldDestinations = await TourServices.getTourDestinationsOfTour(selectedTour!.tourId);
			const oldDestinationIds = oldDestinations.map(
				(d: TourDestinationResponseDto) => d.destination.destinationId,
			);
			const destinationsToAdd = currentDestinationIds.filter((id) => !oldDestinationIds.includes(id));
			const destinationsToRemove = oldDestinations.filter(
				(d: TourDestinationResponseDto) => !currentDestinationIds.includes(d.destination.destinationId),
			);
			await Promise.all(
				destinationsToAdd.map((id, index) => {
					const dest = destinations.find((d) => d.destinationId === id)!;
					const payload: UpdateTourDestinationDto = {
						name: dest.name,
						description: dest.description,
						orderIndex: index + 1,
						destinationId: id,
						tourId: selectedTour!.tourId,
					};
					return tourServices.create(payload as any, "/tour-destinations");
				}),
			);
			await Promise.all(
				destinationsToRemove.map((d: TourDestinationResponseDto) =>
					tourServices.delete(d.tourDestinationId, "/tour-destinations"),
				),
			);
			toast.success("Tour đã được chỉnh sửa");
			onSaved?.();
			onClose();
		} catch (error) {
			console.error("Failed to update tour:", error);
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
							<span className="mb-2 text-sm font-medium">
								Ảnh đại diện <span className="text-red-500">*</span>
							</span>
							<div
								onClick={handleImageClick}
								className="relative flex h-48 w-80 cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
							>
								{thumbnail ? (
									<>
										{thumbnailLoading && (
											<div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
												<Loader2
													className="animate-spin text-gray-500"
													size={24}
												/>
											</div>
										)}
										<img
											src={thumbnail.imageUrl}
											alt="Thumbnail"
											className="h-full w-full object-cover"
											onLoad={() => setThumbnailLoading(false)}
										/>
									</>
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
									variant="bordered"
									isRequired
									name="duration"
									label="Thời lượng"
									labelPlacement="outside"
									placeholder="3 ngày 2 đêm"
									value={tourForm.duration}
									onChange={handleChange}
								/>
								<Input
									variant="bordered"
									isRequired
									name="price"
									label="Giá"
									inputMode="numeric"
									labelPlacement="outside"
									placeholder="2.500.000"
									value={tourForm.price}
									onChange={handleChange}
								/>
								<div className="flex flex-col gap-1">
									<label
										htmlFor="destination-select"
										className="text-sm font-medium"
									>
										Loại tour <span className="text-red-500">*</span>
									</label>
									<select
										className="rounded-xl border p-2 shadow-sm"
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
							</div>
							<Textarea
								variant="bordered"
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
					<TourDestination
						destinations={destinations}
						selectedDestinationIds={selectedDestinationIds}
						setSelectedDestinationIds={setSelectedDestinationIds}
					/>
					{selectedTour && (
						<BookingScheduleModal
							isOpen={isBookingModalOpen}
							onClose={() => setIsBookingModalOpen(false)}
							tour={selectedTour}
							schedules={schedules}
							onSelect={(schedule) => setSelectedSchedule(schedule)}
						/>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						color="success"
						onPress={onClose}
					>
						Hủy
					</Button>
					{!isCreate && (
						<Button
							color="secondary"
							onPress={() => setIsBookingModalOpen(true)}
						>
							Đặt tour
						</Button>
					)}
					<Button
						color="primary"
						onPress={isCreate ? handleAddNewTour : handleEditTour}
					>
						Lưu
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
