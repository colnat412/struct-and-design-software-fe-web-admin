"use client";

import { useEffect, useRef, useState } from "react";
import { CategoryResponseDto, ServiceConstants, TourResponseDto, TourServices } from "@/api";
import { FormatNumber } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Form } from "@heroui/react";
import { useRouter } from "next/navigation";
import BrowseTourModal from "@/components/modals/BrowseTourModal";

interface TourDetailProps {
	selectedTour: TourResponseDto | null;
	setSelectedTour: React.Dispatch<React.SetStateAction<TourResponseDto | null>>;
	setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TourDetails = ({ selectedTour, setSelectedTour, setIsCreate }: TourDetailProps) => {
	const router = useRouter();

	const bookingServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	const [thumbnail, setThumbnail] = useState<string | undefined>(selectedTour?.thumbnail);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const tourServices = new TourServices(ServiceConstants.BOOKING_SERVICE);

	const [categories, setCategories] = useState<CategoryResponseDto[]>([]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		setThumbnail(selectedTour?.thumbnail);
	}, [selectedTour]);

	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setThumbnail(imageUrl);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {
			try {
				const categories = await tourServices.getAll("/category-tours");
				setCategories(Array.isArray(categories) ? categories : []);
			} catch (error) {
				console.error("Error fetching users:", error);
				throw error;
			}
		};
		fetchData();
	}, []);

	return (
		<Form className="flex h-1/3 w-full max-w-full flex-col gap-4 p-4">
			<span className="mx-1 font-semibold">Tour Information</span>

			<div className="mb-4">
				<span className="mb-2 font-medium">Thumbnail</span>
				<div
					className="h-48 w-80 cursor-pointer overflow-hidden rounded border bg-gray-100 object-cover shadow"
					onClick={handleImageClick}
				>
					<img
						src={thumbnail || "/placeholder.jpg"}
						alt="Thumbnail"
						className="h-full w-full object-cover"
					/>
				</div>
				<input
					type="file"
					accept="image/*"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleImageChange}
				/>
			</div>

			<div className="flex w-full flex-col gap-5">
				<Input
					isRequired
					errorMessage="Please enter a name"
					label="Name"
					labelPlacement="outside"
					name="name"
					placeholder="Enter your name"
					type="text"
					value={selectedTour?.name}
				/>
				<Textarea
					isRequired
					errorMessage="Please enter a description"
					label="Description"
					labelPlacement="outside"
					name="description"
					placeholder="Enter your description"
					type="text"
					value={selectedTour?.description}
				/>
				<Input
					isRequired
					errorMessage="Please enter a duration"
					label="Duration"
					labelPlacement="outside"
					name="duration"
					placeholder="Enter your duration"
					type="text"
					value={selectedTour?.duration}
				/>
				<Input
					isRequired
					errorMessage="Please enter a price"
					label="Price"
					labelPlacement="outside"
					name="price"
					placeholder="Enter your price"
					type="text"
					inputMode="numeric"
					value={FormatNumber.formatCurrency(selectedTour?.price ?? 0).toString()}
				/>
				<select
					name=""
					id=""
				>
					{categories.map((category) => (
						<option
							key={category.categoryTourId}
							value={category.categoryTourId}
							selected={selectedTour?.categoryTour.categoryTourId === category.categoryTourId}
						>
							{category.name}
						</option>
					))}
				</select>

				<div className="flex w-full justify-end gap-4">
					<Button
						color="secondary"
						onPress={() => setIsModalOpen(true)}
					>
						Browse Tour
					</Button>
					<Button
						onPress={() => {
							setSelectedTour(null);
							setIsCreate(false);
						}}
					>
						Cancel
					</Button>
					<Button
						color="primary"
						type="submit"
						// onPress={() => {}}
					>
						Save
					</Button>
				</div>
			</div>
			<BrowseTourModal
				tourName={selectedTour?.name || ""}
				duration={selectedTour?.duration || ""}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</Form>
	);
};
