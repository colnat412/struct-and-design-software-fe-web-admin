import React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";

interface Category {
	categoryTourId: string;
	name: string;
}

interface FilterModalProps {
	isOpen: boolean;
	onClose: () => void;
	categories: Category[];
	selectedCategories: string[];
	toggleCategory: (id: string) => void;
	priceRange: number[];
	formatCurrency: (value: number) => string;
	handleChange: (index: number, value: string) => void;
	handleApplyFilter: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
	isOpen,
	onClose,
	categories,
	selectedCategories,
	toggleCategory,
	priceRange,
	formatCurrency,
	handleChange,
	handleApplyFilter,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onClose}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">Lọc</ModalHeader>
						<ModalBody className="flex flex-col gap-4">
							<div>
								<p className="mb-2 font-semibold">Loại Tour:</p>
								<div className="flex flex-wrap gap-2">
									{categories.map((category) => (
										<Button
											key={category.categoryTourId}
											variant={
												selectedCategories.includes(category.categoryTourId)
													? "solid"
													: "bordered"
											}
											color={
												selectedCategories.includes(category.categoryTourId)
													? "primary"
													: "default"
											}
											onPress={() => toggleCategory(category.categoryTourId)}
											className="rounded-full text-sm"
										>
											{category.name}
										</Button>
									))}
								</div>
							</div>

							<div>
								<p className="mb-2 font-semibold">Khoảng giá (VND):</p>
								<div className="flex items-center gap-3">
									<input
										type="text"
										inputMode="numeric"
										value={formatCurrency(priceRange[0])}
										onChange={(e) => handleChange(0, e.target.value)}
										className="w-1/2 rounded border px-2 py-1"
										placeholder="Min price"
									/>
									<span>—</span>
									<input
										type="text"
										inputMode="numeric"
										value={formatCurrency(priceRange[1])}
										onChange={(e) => handleChange(1, e.target.value)}
										className="w-1/2 rounded border px-2 py-1"
										placeholder="Max price"
									/>
								</div>
							</div>
						</ModalBody>

						<ModalFooter>
							<Button
								variant="light"
								onPress={onClose}
							>
								Hủy
							</Button>
							<Button
								color="primary"
								onPress={() => {
									handleApplyFilter();
									onClose();
								}}
							>
								Áp dụng
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default FilterModal;
