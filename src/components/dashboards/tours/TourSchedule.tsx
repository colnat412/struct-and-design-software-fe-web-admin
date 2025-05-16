"use client";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Plus, Trash } from "lucide-react";
import { TourScheduleRequestDto } from "@/api";

interface TourSchedulesProps {
	schedules: TourScheduleRequestDto[];
	setSchedules: (s: TourScheduleRequestDto[]) => void;
}

export const TourSchedules({ schedules, setSchedules }: TourSchedulesProps) =>{
	const handleAdd = () => {
		setSchedules([
			...schedules,
			{
				name: "",
				description: "",
				startDate: "",
				endDate: "",
				adultPrice: 0,
				childPrice: 0,
				babyPrice: 0,
				slot: 0,
				tourId: "",
			},
		]);
	};

	const handleChange = (index: number, field: keyof TourScheduleRequestDto, value: any) => {
		const updated = [...schedules];
		updated[index][field] = value;
		setSchedules(updated);
	};

	const handleRemove = (index: number) => {
		setSchedules(schedules.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Tour Schedules</h3>
				<Button
					size="sm"
					onPress={handleAdd}
					color="primary"
				>
					<Plus className="size-5" />
				</Button>
			</div>

			{!schedules.length ? (
				<div className="text-center opacity-60">Please add a new schedule</div>
			) : (
				schedules.map((schedule, index) => (
					<div
						key={index}
						className="grid grid-cols-1 gap-4 rounded-lg border p-4 shadow-sm"
					>
						<div className="flex items-center justify-between">
							<h4 className="font-medium">Schedule {index + 1}</h4>
							<Button
								size="sm"
								color="secondary"
								onPress={() => handleRemove(index)}
								className="flex items-center gap-1"
							>
								<Trash className="size-5" />
							</Button>
						</div>
						<Input
							label="Name"
							value={schedule.name}
							onChange={(e) => handleChange(index, "name", e.target.value)}
						/>
						<Textarea
							label="Description"
							value={schedule.description}
							onChange={(e) => handleChange(index, "description", e.target.value)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<Input
								label="Start date"
								type="date"
								value={schedule.startDate}
								onChange={(e) => handleChange(index, "startDate", e.target.value)}
							/>
							<Input
								label="End date"
								type="date"
								value={schedule.endDate}
								onChange={(e) => handleChange(index, "endDate", e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-3 gap-4">
							<Input
								label="Adult price"
								type="number"
								value={schedule.adultPrice.toString()}
								onChange={(e) => handleChange(index, "adultPrice", parseFloat(e.target.value))}
							/>
							<Input
								label="Child price"
								type="number"
								value={schedule.childPrice.toString()}
								onChange={(e) => handleChange(index, "childPrice", parseFloat(e.target.value))}
							/>
							<Input
								label="Baby price"
								type="number"
								value={schedule.babyPrice.toString()}
								onChange={(e) => handleChange(index, "babyPrice", parseFloat(e.target.value))}
							/>
						</div>
						<Input
							label="Slot"
							type="number"
							value={schedule.slot.toString()}
							onChange={(e) => handleChange(index, "slot", parseInt(e.target.value))}
						/>
					</div>
				))
			)}
		</div>
	);
}
