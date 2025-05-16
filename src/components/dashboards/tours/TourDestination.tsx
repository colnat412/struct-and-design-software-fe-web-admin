"use client";

import { DestinationResponseDto } from "@/api";
import { useState } from "react";

interface TourDestinationProps {
	destinations: DestinationResponseDto[];
	setDestination: (des: DestinationResponseDto) => void;
}

// export default function TourDestination({ value, onChange }: TourDestinationProps) {
// 	const [destinations, setDestinations] = useState<DestinationResponseDto[]>([]);
// 	const [isLoading, setIsLoading] = useState<boolean>(true);

// 	return (
// 		<div className="flex flex-col gap-2">
// 			<label
// 				htmlFor="destination-select"
// 				className="text-sm font-medium"
// 			>
// 				Destination
// 			</label>
// 			<select
// 				id="destination-select"
// 				name="destinationId"
// 				value={value}
// 				onChange={(e) => onChange(e.target.value)}
// 				className="rounded border p-2"
// 			>
// 				<option value="">Select destination</option>
// 				{destinations.map((dest) => (
// 					<option
// 						key={dest.destinationId}
// 						value={dest.destinationId}
// 					>
// 						{dest.name} ({dest.city}, {dest.country})
// 					</option>
// 				))}
// 			</select>
// 		</div>
// 	);
// }
export default function TourDestination() {
	const [destinations, setDestinations] = useState<DestinationResponseDto[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	return <div className="flex flex-col gap-2"></div>;
}
