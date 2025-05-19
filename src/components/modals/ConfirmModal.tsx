"use client";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";

interface ConfirmDeleteModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	onCancel?: () => void;
	itemName?: string;
}

export const ConfirmDeleteModal = ({
	isOpen,
	onOpenChange,
	onConfirm,
	onCancel,
	itemName,
}: ConfirmDeleteModalProps) => {
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<span className="text-md">
								Are you sure you want to delete{" "}
								<span className="font-semibold text-primary">{itemName}</span> ?
							</span>
						</ModalHeader>
						<ModalBody className="flex flex-row">
							<span className="text-md opacity-70">This action cannot be undone</span>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="light"
								color="default"
								onPress={() => {
									onCancel?.();
									onClose();
								}}
							>
								Cancel
							</Button>
							<Button
								color="primary"
								onPress={() => {
									onConfirm();
									onClose();
								}}
							>
								Confirm
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
