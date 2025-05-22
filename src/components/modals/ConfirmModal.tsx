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
								Bạn có chắc muốn xóa{" "}
								<span className="font-semibold text-primary">{itemName}</span> ?
							</span>
						</ModalHeader>
						<ModalBody className="flex flex-row">
							<span className="text-sm opacity-70">Hành động này không thể hoàn tác</span>
						</ModalBody>
						<ModalFooter>
							<Button
								color="success"
								onPress={() => {
									onCancel?.();
									onClose();
								}}
							>
								Hủy
							</Button>
							<Button
								color="primary"
								onPress={() => {
									onConfirm();
									onClose();
								}}
							>
								Xác nhận
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
