"use client";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Plus, Trash } from "lucide-react";
import { TourScheduleRequestDto } from "@/api";

interface TourSchedulesProps {
	schedules: TourScheduleRequestDto[];
	setSchedules: (schedules: TourScheduleRequestDto[]) => void;
}

export const TourSchedules: React.FC<TourSchedulesProps> = ({ schedules, setSchedules }) => {
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

	const handleChange = <K extends keyof TourScheduleRequestDto>(
		index: number,
		field: K,
		value: TourScheduleRequestDto[K],
	) => {
		const updated = [...schedules];
		updated[index] = { ...updated[index], [field]: value };
		setSchedules(updated);
	};

	const handleRemove = (index: number) => {
		const updated = [...schedules];
		updated.splice(index, 1);
		setSchedules(updated);
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
				<p className="text-center opacity-60">There are no schedules added, please add a new schedule</p>
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
						<div className="flex flex-row gap-4">
							<Input
								label="Start Date"
								type="date"
								value={schedule.startDate?.slice(0, 10)}
								onChange={(e) => handleChange(index, "startDate", e.target.value)}
							/>
							<Input
								label="End Date"
								type="date"
								value={schedule.endDate?.slice(0, 10)}
								onChange={(e) => handleChange(index, "endDate", e.target.value)}
							/>
						</div>
						<div className="flex flex-row gap-4">
							{/* <Input
								label="Adult Price"
								type="number"
								value={schedule.adultPrice.toString()}
								onChange={(e) =>
									handleChange(index, "adultPrice", parseFloat(e.target.value) || 0)
								}
							/>
							<Input
								label="Child Price"
								type="number"
								value={schedule.childPrice.toString()}
								onChange={(e) =>
									handleChange(index, "childPrice", parseFloat(e.target.value) || 0)
								}
							/>
							<Input
								label="Baby Price"
								type="number"
								value={schedule.babyPrice.toString()}
								onChange={(e) =>
									handleChange(index, "babyPrice", parseFloat(e.target.value) || 0)
								}
							/> */}
						</div>
						{/* <Input
							label="Slot"
							type="number"
							value={schedule.slot.toString()}
							onChange={(e) => handleChange(index, "slot", parseInt(e.target.value) || 0)}
						/> */}
					</div>
				))
			)}
		</div>
	);
};
