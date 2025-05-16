"use client";

import { ImageIcon } from "@/assets/svgs/common";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface TourImagesProps {
	images: string[];
	setImages: (images: string[]) => void;
}

export const TourImages = ({ images, setImages }: TourImagesProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

	const handleAddImage = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImageURLs = Array.from(files).map((file) => URL.createObjectURL(file));
			newImageURLs.forEach((url) => setLoadingImages((prev) => new Set(prev).add(url)));
			setImages([...images, ...newImageURLs]);
		}
	};

	const handleImageLoad = (url: string) => {
		setLoadingImages((prev) => {
			const updated = new Set(prev);
			updated.delete(url);
			return updated;
		});
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = [...images];
		updatedImages.splice(index, 1);
		setImages(updatedImages);
	};

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-lg font-semibold">Tour Images</h3>
			<div className="flex flex-wrap gap-4">
				{images.map((url, idx) => (
					<div
						key={idx}
						className="relative h-36 w-44 overflow-hidden rounded-lg"
					>
						{loadingImages.has(url) && (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
								<Loader2
									className="animate-spin text-gray-500"
									size={24}
								/>
							</div>
						)}

						<Image
							src={url}
							alt={`Tour Image ${idx + 1}`}
							fill
							className="rounded object-cover"
							onLoad={() => handleImageLoad(url)}
						/>

						<button
							onClick={() => handleRemoveImage(idx)}
							className="absolute right-1 top-1 z-20 rounded-full bg-white bg-opacity-80 p-1 text-sm text-red-500 hover:bg-opacity-100"
						>
							<X size={16} />
						</button>
					</div>
				))}

				<div
					onClick={handleAddImage}
					className="flex h-36 w-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"
				>
					<ImageIcon
						width={24}
						height={24}
						opacity={0.5}
					/>
					<p className="text-sm text-gray-500">Click to add images</p>
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
};
