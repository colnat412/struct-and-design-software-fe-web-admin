"use client";

import { TourImageResponseDto } from "@/api";
import { ImageIcon } from "@/assets/svgs/common";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface TourImagesProps {
	images: TourImageWithFile[];
	setImages: (images: TourImageWithFile[]) => void;
}

type TourImageWithFile = TourImageResponseDto & { file?: File };

export const TourImages = ({ images, setImages }: TourImagesProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

	const handleAddImage = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages: TourImageWithFile[] = Array.from(files).map((file) => {
				const url = URL.createObjectURL(file);
				setLoadingImages((prev) => new Set(prev).add(url));
				return {
					tourImageId: "",
					tourId: "",
					imageUrl: url,
					description: "",
					file,
				};
			});
			setImages([...images, ...newImages]);
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
			<h3 className="text-lg font-semibold">Hình Ảnh của Tour</h3>
			<div className="flex flex-wrap gap-4">
				{images.map((image, idx) => (
					<div
						key={image.imageUrl + idx}
						className="relative h-36 w-44 overflow-hidden rounded-lg"
					>
						{loadingImages.has(image.imageUrl) && (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
								<Loader2
									className="animate-spin text-gray-500"
									size={24}
								/>
							</div>
						)}

						<Image
							src={image.imageUrl}
							alt={`Tour Image ${idx + 1}`}
							fill
							className="rounded object-cover"
							onLoad={() => handleImageLoad(image.imageUrl)}
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
					<p className="text-sm text-gray-500">Nhấn vào để thêm ảnh</p>
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
