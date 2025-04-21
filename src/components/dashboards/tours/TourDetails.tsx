"use client";

import { TourResponseDto } from "@/api";
import { FormatNumber } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Form, Radio, RadioGroup } from "@heroui/react";

interface TourDetailProps {
	selectedTour: TourResponseDto | null;
	setSelectedTour: React.Dispatch<React.SetStateAction<TourResponseDto | null>>;
	setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TourDetails = ({ selectedTour, setSelectedTour, setIsCreate }: TourDetailProps) => {
	const handleEditUser = () => {};
	return (
		<Form className="flex h-1/3 w-full max-w-full flex-col gap-4 p-4">
			<span className="mx-1 font-semibold">Tour Information</span>
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
					name="name"
					placeholder="Enter your duration"
					type="text"
					value={selectedTour?.duration}
				/>
				<Input
					isRequired
					errorMessage="Please enter a price"
					label="Price"
					labelPlacement="outside"
					name="name"
					placeholder="Enter your price"
					type="text"
					value={FormatNumber.toFormatNumber(selectedTour?.price ?? 0)}
				/>

				<div className="flex w-full justify-end gap-4">
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
					>
						Save
					</Button>
				</div>
			</div>
		</Form>
	);
};
