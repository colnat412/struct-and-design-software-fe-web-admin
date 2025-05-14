"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface TourImagesProps {
	images: string[];
	setImages: (images: string[]) => void;
}

export default function TourImages({ images, setImages }: TourImagesProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleAddImage = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
			setImages([...images, ...newImages]);
		}
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = [...images];
		updatedImages.splice(index, 1);
		setImages(updatedImages);
	};

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-lg font-semibold">Images</h3>
			<div className="flex flex-wrap gap-4">
				{images.map((url, idx) => (
					<div
						key={idx}
						className="relative h-36 w-44 overflow-hidden rounded-lg"
					>
						<Image
							src={url}
							alt={`Tour Image ${idx + 1}`}
							fill
							className="rounded object-cover"
						/>
						<button
							onClick={() => handleRemoveImage(idx)}
							className="absolute right-1 top-1 rounded-full bg-white bg-opacity-80 p-1 text-sm text-red-500 hover:bg-opacity-100"
						>
							<X size={16} />
						</button>
					</div>
				))}

				<div
					onClick={handleAddImage}
					className="flex h-36 w-44 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"
				>
					Choose images
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					multiple
					className="hidden"
					onChange={handleImageChange}
				/>
			</div>
		</div>
	);
}
