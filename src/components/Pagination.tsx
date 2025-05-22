"use client";

import { Button } from "@heroui/button";

interface PaginationProps {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
	pagesPerGroup?: number;
	onPageChange: (page: number) => void;
}

export const Pagination = ({
	currentPage,
	totalItems,
	itemsPerPage,
	pagesPerGroup = 5,
	onPageChange,
}: PaginationProps) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const currentGroup = Math.ceil(currentPage / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

	if (totalPages <= 1) return null;

	return (
		<div className="mt-4 flex flex-row justify-end gap-2 text-center">
			<Button
				size="sm"
				onPress={() => onPageChange(Math.max(currentPage - 1, 1))}
				disabled={currentPage === 1}
				className={`min-w-10 rounded ${
					currentPage === 1
						? "cursor-not-allowed bg-gray-200 text-gray-400"
						: "bg-gray-300 hover:bg-gray-400"
				}`}
			>
				Back
			</Button>

			{Array.from({ length: endPage - startPage + 1 }, (_, i) => {
				const page = startPage + i;
				return (
					<Button
						key={page}
						size="sm"
						onPress={() => onPageChange(page)}
						className={`min-w-10 rounded ${
							currentPage === page ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"
						}`}
					>
						{page}
					</Button>
				);
			})}

			<Button
				size="sm"
				onPress={() => onPageChange(Math.min(currentPage + 1, totalPages))}
				disabled={currentPage === totalPages}
				className={`min-w-10 rounded ${
					currentPage === totalPages
						? "cursor-not-allowed bg-gray-200 text-gray-400"
						: "bg-gray-300 hover:bg-gray-400"
				}`}
			>
				Next
			</Button>
		</div>
	);
};
