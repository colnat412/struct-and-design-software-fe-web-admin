"use client";

import { DestinationResponseDto } from "@/api";
import { Checkbox } from "@heroui/react";

interface TourDestinationProps {
	destinations: DestinationResponseDto[];
	selectedDestinationIds: string[];
	setSelectedDestinationIds: (value: string[]) => void;
}

export const TourDestination: React.FC<TourDestinationProps> = ({
	destinations,
	selectedDestinationIds,
	setSelectedDestinationIds,
}) => {
	const handleToggle = (id: string) => {
		if (selectedDestinationIds.includes(id)) {
			setSelectedDestinationIds(selectedDestinationIds.filter((item) => item !== id));
		} else {
			setSelectedDestinationIds([...selectedDestinationIds, id]);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-lg font-semibold">Điểm đến (có thể chọn nhiều)</h3>
			<div className="flex flex-wrap gap-4">
				{destinations.map((dest) => (
					<label
						key={dest.destinationId}
						className="flex w-[calc(25%-1rem)] items-center gap-2 rounded border p-2"
					>
						<Checkbox
							value={dest.destinationId}
							isSelected={selectedDestinationIds.includes(dest.destinationId)}
							onValueChange={() => handleToggle(dest.destinationId)}
							// Optionally add name, size, color, etc.
						/>
						<span className="text-sm">
							{dest.name} ({dest.city}, {dest.country})
						</span>
					</label>
				))}
			</div>
		</div>
	);
};
