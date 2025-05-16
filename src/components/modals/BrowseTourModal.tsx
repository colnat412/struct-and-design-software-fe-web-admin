"use client";

import {
	CategoryResponseDto,
	DestinationResponseDto,
	ServiceConstants,
	TourImageResponseDto,
	TourResponseDto,
	TourScheduleRequestDto,
	TourServices,
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

export default function BrowseTourModal({ selectedTour, isOpen, onClose, onSaved }: BrowseTourModalProps) {
	const router = useRouter();
	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [thumbnail, setThumbnail] = useState<string | undefined>(selectedTour?.thumbnail);

	const [images, setImages] = useState<string[]>([]);
	const [schedules, setSchedules] = useState<TourScheduleRequestDto[]>([]);
	const [destinations, setDestinations] = useState<DestinationResponseDto[]>([]);

	const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
	const [isEditingName, setIsEditingName] = useState<boolean>(false);

	useEffect(() => {
		setThumbnail(selectedTour?.thumbnail);
	}, [selectedTour]);

	useEffect(() => {
		const fetchData = async () => {
			if (selectedTour) {
				try {
					const tourImageRes = await TourServices.getTourImagesOfTour(selectedTour.tourId);
					setImages(tourImageRes.map((img: TourImageResponseDto) => img.imageUrl));
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

	const [formData, setFormData] = useState({
		thumbnail: "",
		name: "",
		description: "",
		duration: "",
		price: "",
		categoryTourId: "",
		// destinationId: "",
	});

	useEffect(() => {
		if (selectedTour) {
			setFormData({
				thumbnail: selectedTour.thumbnail || "",
				name: selectedTour.name || "",
				description: selectedTour.description || "",
				duration: selectedTour.duration || "",
				price: selectedTour.price?.toString() || "",
				categoryTourId: selectedTour.categoryTour?.categoryTourId || "",
				// destinationId: selectedTour.destination.destinationId || "",
			});
			console.log("Selected Tour:", selectedTour);
			console.log("Form Data:", formData);
		} else {
			setFormData({
				thumbnail: "",
				name: "",
				description: "",
				duration: "",
				price: "",
				categoryTourId: "",
				// destinationId: "",
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
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		try {
			const payload = {
				...formData,
				price: Number(formData.price),
				image_tour: images,
				schedules,
			};
			console.log("Saving Tour Payload:", payload);
			onSaved?.();
			onClose();
		} catch (err) {
			console.error("Failed to save tour", err);
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
							placeholder="Enter tour name"
							className="text-md w-full border-b bg-transparent font-semibold outline-none transition-all focus:border-primary"
							value={formData.name}
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
								{formData.name || "Untitled Tour"}
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
					<h3 className="text-lg font-semibold">Tour Information</h3>
					<div className="flex flex-col gap-4">
						<div className="m-1 flex flex-col gap-1">
							<span className="mb-2 font-medium">Thumbnail</span>
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
										<p className="text-sm text-gray-500">Click to upload thumbnail</p>
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
									label="Duration"
									labelPlacement="outside"
									placeholder="e.g. 3 days 2 nights"
									value={formData.duration}
									onChange={handleChange}
								/>
								<Input
									isRequired
									name="price"
									label="Price"
									inputMode="numeric"
									labelPlacement="outside"
									placeholder="e.g. 2500000"
									value={formData.price}
									onChange={handleChange}
								/>
								<select
									className="rounded border p-2"
									name="categoryTourId"
									value={formData.categoryTourId}
									onChange={handleChange}
								>
									<option value="">Select Category</option>
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
							value={formData.destination}
							onChange={handleChange}
						/> */}
							<Textarea
								isRequired
								name="description"
								label="Description"
								labelPlacement="outside"
								placeholder="Tour details"
								value={formData.description}
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
						Cancel
					</Button>
					<Button
						color="primary"
						onPress={handleSave}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
