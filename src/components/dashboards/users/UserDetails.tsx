"use client";

import { ServiceConstants, UserRequestDto, UserResponseDto, UserServices, UserUpdateDto } from "@/api";
import { formatDateToDMY, formatTimestampToDate } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form, Radio, RadioGroup } from "@heroui/react";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface UserDetailProps {
	selectedUser: UserResponseDto | null;
	setSelectedUser: React.Dispatch<React.SetStateAction<UserResponseDto | null>>;
	setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
	setData: React.Dispatch<React.SetStateAction<UserResponseDto[]>>;
}

export const UserDetails = ({ selectedUser, setSelectedUser, setIsCreate, setData }: UserDetailProps) => {
	const userServices = new UserServices(ServiceConstants.USER_SERVICE);
	const fileInputRef = useRef<HTMLInputElement | null>(null); // Tham chiếu đến input file

	const [userForm, setUserForm] = useState<UserUpdateDto>({
		phone: "",
		fullName: "",
		birthday: "",
		gender: "0",
		password: "123456",
		avatarUrl: "",
	});

	const [isCreating, setIsCreating] = useState<boolean>(false);

	useEffect(() => {
		if (selectedUser) {
			console.log("Selected user:", selectedUser);

			setUserForm({
				phone: selectedUser.phone ? String(selectedUser.phone) : "",
				fullName: selectedUser.fullName || "",
				birthday: formatTimestampToDate(selectedUser.birthday) || "",
				gender: String(selectedUser.gender || "0"),
				password: "",
				avatarUrl: selectedUser.avatarUrl || "",
			});
			setIsCreating(false);
		} else {
			setUserForm({
				phone: "",
				fullName: "",
				birthday: "",
				gender: "0",
				password: "123456",
				avatarUrl: "",
			});
			setIsCreating(true);
		}
	}, [selectedUser]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUserForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUserForm((prev) => ({
					...prev,
					avatarUrl: reader.result as string,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAvatarClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleEdit = async () => {
		try {
			const userId = selectedUser?.userId;
			if (!userId) return;
			const phoneRegex = /^[0-9]{10,11}$/;
			if (!phoneRegex.test(userForm.phone.trim())) {
				toast.error("Please enter a valid phone number (10-11 digits)", {
					duration: 3000,
					position: "top-right",
					style: {
						background: "#ef4444",
						color: "#fff",
						padding: "16px",
					},
				});
				return;
			}
			if (userForm.fullName.trim().length < 2) {
				toast.error("Full name must be at least 2 characters", {
					duration: 3000,
					position: "top-right",
					style: {
						background: "#ef4444",
						color: "#fff",
						padding: "16px",
					},
				});
				return;
			}
			const dateTimestamp = new Date(userForm.birthday).getTime();
			if (isNaN(dateTimestamp)) {
				toast.error("Invalid date format", {
					duration: 3000,
					position: "top-right",
					style: {
						background: "#ef4444",
						color: "#fff",
						padding: "16px",
					},
				});
				return;
			}

			const payload: UserUpdateDto = {
				phone: userForm.phone.trim(),
				fullName: userForm.fullName.trim(),
				birthday: formatDateToDMY(userForm.birthday),
				gender: userForm.gender,
				...(selectedUser ? {} : { password: userForm.password }),
				avatarUrl: userForm.avatarUrl,
			};
			console.log("Payload:", payload);

			const updatedUser = await userServices.update(userId, payload as any, "/users");
			console.log("Updated user:", updatedUser);

			if (!updatedUser) {
				throw new Error("No response from server");
			}
			toast.success("User updated successfully!", {
				duration: 3000,
				position: "top-right",
				style: {
					background: "#22c55e",
					color: "#fff",
					padding: "16px",
				},
			});

			const freshData = await userServices.getAll("/users");
			if (Array.isArray(freshData)) {
				setData(freshData);
				setSelectedUser(null);
				setIsCreate(false);
			}
		} catch (error) {
			let errorMessage = "Failed to update user";
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (axios.isAxiosError(error) && error.response) {
				errorMessage = error.response.data?.message || "Server error occurred";
			}

			toast.error(errorMessage, {
				duration: 3000,
				position: "top-right",
				style: {
					background: "#ef4444",
					color: "#fff",
					padding: "16px",
				},
			});
		}
	};

	const handleAddNew = async () => {
		try {
		} catch (error) {}
	};

	return (
		<Form
			className="flex h-1/3 w-full max-w-full flex-col gap-4 p-4"
			onSubmit={(e) => {
				e.preventDefault();
				handleEdit();
			}}
		>
			<span className="mx-1 font-semibold">User Information</span>
			<div className="flex w-full flex-col gap-5">
				<div className="flex flex-col gap-3">
					<label className="font-medium">Avatar</label>
					<div
						className="h-32 w-32 cursor-pointer overflow-hidden rounded-full"
						onClick={handleAvatarClick}
					>
						{userForm.avatarUrl ? (
							<img
								src={userForm.avatarUrl}
								alt="Avatar Preview"
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-gray-300 text-sm">
								Add a image
							</div>
						)}
					</div>
					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleAvatarChange}
						className="hidden"
					/>
				</div>

				<Input
					label="Username"
					labelPlacement="outside"
					placeholder="Enter username"
					isDisabled={!isCreating}
					value={selectedUser?.username || ""}
				/>
				<Input
					label="Email"
					labelPlacement="outside"
					placeholder="Enter email"
					isDisabled={!isCreating}
					value={selectedUser?.email || ""}
				/>
				<Input
					isRequired
					name="fullName"
					label="Full Name"
					labelPlacement="outside"
					placeholder="Enter full name"
					value={userForm.fullName || ""}
					onChange={handleChange}
				/>
				<Input
					isRequired
					name="phone"
					label="Phone"
					labelPlacement="outside"
					placeholder="Enter phone number"
					value={userForm.phone || ""}
					onChange={handleChange}
					pattern="[0-9]{10,11}"
					title="Phone number must be 10-11 digits"
				/>
				<Input
					isRequired
					name="birthday"
					label="Birthday"
					labelPlacement="outside"
					type="date"
					value={userForm.birthday}
					onChange={handleChange}
				/>
				{isCreating && (
					<Input
						isRequired
						name="password"
						label="Password"
						labelPlacement="outside"
						placeholder="Enter password"
						type="password"
						defaultValue="123456"
						value={userForm.password}
						onChange={handleChange}
					/>
				)}

				<RadioGroup
					label="Gender"
					className="flex w-full items-start justify-start"
					orientation="horizontal"
					defaultValue={userForm.gender}
					value={userForm.gender}
					onValueChange={(value) => {
						setUserForm((prev) => ({
							...prev,
							gender: value,
						}));
					}}
				>
					<Radio value="0">Female</Radio>
					<Radio value="1">Male</Radio>
				</RadioGroup>
				<div className="flex w-full justify-end gap-4">
					<Button
						onPress={() => {
							setSelectedUser(null);
							setIsCreate(false);
						}}
						type="button"
					>
						Cancel
					</Button>
					<Button
						onPress={handleEdit}
						color="primary"
						type="submit"
					>
						Save
					</Button>
				</div>
			</div>
		</Form>
	);
};
