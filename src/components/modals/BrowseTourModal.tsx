"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useState } from "react";
import TourImages from "../dashboards/tours/TourImages";
import TourSchedules, { Schedule } from "../dashboards/tours/TourSchedule";

interface BrowseTourModalProps {
	tourName: string;
	duration: string;
	isOpen: boolean;
	onClose: () => void;
}

export default function BrowseTourModal({ tourName, duration, isOpen, onClose }: BrowseTourModalProps) {
	const [images, setImages] = useState<string[]>([]);
	const [schedules, setSchedules] = useState<Schedule[]>([]);

	const handleSave = () => {
		console.log("Saving Tour...");
		console.log("Images:", images);
		console.log("Schedules:", schedules);
		onClose();
	};

	return (
		<Modal
			className="size-11/12 max-w-screen-xl"
			isOpen={isOpen}
			onClose={onClose}
			placement="center"
		>
			<ModalContent>
				<ModalHeader>
					{tourName} | {duration}
				</ModalHeader>
				<ModalBody className="max-h-[80vh] space-y-8 overflow-y-auto px-4 py-2">
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
