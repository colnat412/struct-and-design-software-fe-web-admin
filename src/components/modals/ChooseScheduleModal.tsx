"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";
import { TourResponseDto, TourScheduleResponseDto } from "@/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingScheduleModalProps {
	isOpen: boolean;
	onClose: () => void;
	tour: TourResponseDto;
	schedules: TourScheduleResponseDto[];
	onSelect: (schedule: TourScheduleResponseDto) => void;
}

export default function BookingScheduleModal({
	isOpen,
	onClose,
	tour,
	schedules,
	onSelect,
}: BookingScheduleModalProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const router = useRouter();
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			placement="center"
		>
			<ModalContent>
				<ModalHeader>Chọn lịch trình tour</ModalHeader>
				<ModalBody>
					{!schedules.length ? (
						<div className="text-center text-gray-500">Không có lịch trình nào khả dụng.</div>
					) : (
						<div className="flex flex-col gap-3">
							{schedules.map((schedule, idx) => (
								<label
									key={schedule.tourScheduleId || idx}
									className={`flex cursor-pointer flex-col rounded border p-3 transition-all ${
										selectedIndex === idx
											? "border-primary bg-primary/10"
											: "hover:border-primary"
									}`}
								>
									<input
										type="radio"
										name="schedule"
										checked={selectedIndex === idx}
										onChange={() => setSelectedIndex(idx)}
										className="mr-2"
									/>
									<div className="flex flex-row items-center gap-4">
										<div>
											<div className="font-semibold">{schedule.name}</div>
											<div className="text-sm text-gray-500">
												{schedule.description}
											</div>
										</div>
										<div className="ml-auto flex flex-col text-right">
											<span>
												Ngày đi:{" "}
												<b>
													{schedule.startDate
														? new Date(
																schedule.startDate,
															).toLocaleDateString()
														: ""}
												</b>
											</span>
											<span>
												Ngày về:{" "}
												<b>
													{schedule.endDate
														? new Date(schedule.endDate).toLocaleDateString()
														: ""}
												</b>
											</span>
										</div>
									</div>
								</label>
							))}
						</div>
					)}
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
						isDisabled={selectedIndex === null}
						onPress={() => {
							if (selectedIndex !== null) {
								const selected = schedules[selectedIndex];
								router.push(
									`/dashboard/book-tour?tourId=${tour.tourId}&scheduleId=${selected.tourScheduleId}`,
								);
								onClose();
							}
						}}
					>
						Xác nhận
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
