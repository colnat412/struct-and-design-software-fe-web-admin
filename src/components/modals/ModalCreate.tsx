"use client";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Checkbox,
	Input,
	Link,
} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface Props {
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: (isOpen: boolean) => void;
}

export const ModalCreate = ({ isOpen, onOpenChange }: Props) => {
	return (
		<Modal
			isOpen={isOpen}
			placement="top-center"
			onOpenChange={onOpenChange}
			className="max-w-xl rounded-sm"
		>
			<ModalContent className="w-full">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">Add new user</ModalHeader>
						<ModalBody>
							<Input
								label="Username"
								placeholder="Enter your username"
								variant="bordered"
							/>
							<Input
								label="Fullname"
								placeholder="Enter your full name"
								variant="bordered"
							/>
							<Input
								label="Phone"
								placeholder="Enter your phone number"
								type="tel"
								variant="bordered"
							/>
							<Input
								label="Email"
								placeholder="Enter your email"
								type="email"
								variant="bordered"
							/>
							<Input
								label="Password"
								placeholder="Enter your password"
								type="password"
								variant="bordered"
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="secondary"
								onPress={onClose}
							>
								Close
							</Button>
							<Button
								color="primary"
								onPress={onClose}
							>
								Save
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
