"use client";

import { ServiceConstants, UserResponseDto, UserServices, UserUpdateDto } from "@/api";
import { formatDateToDMY, formatTimestampToDate } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form, Radio, RadioGroup } from "@heroui/react";
import { useEffect, useState } from "react";
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

	const [userForm, setUserForm] = useState<UserUpdateDto>({
		phone: "",
		fullName: "",
		birthday: "",
		gender: "0",
	});

	useEffect(() => {
		if (selectedUser) {
			console.log("Selected user:", selectedUser);
			setUserForm({
				phone: selectedUser.phone ? String(selectedUser.phone) : "",
				fullName: selectedUser.fullName || "",
				birthday: formatTimestampToDate(selectedUser.birthday) || "",
				gender: selectedUser.gender ?? "0",
			});
		}
	}, [selectedUser]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUserForm((prev) => ({
			...prev,
			[name]: value,
		}));
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

			const validatedGender = Number(userForm.gender) === 1 ? 1 : 0;

			const payload: UserUpdateDto = {
				phone: userForm.phone.trim(),
				fullName: userForm.fullName.trim(),
				birthday: formatDateToDMY(userForm.birthday),
				gender: userForm.gender,
			};

			const updatedUser = await userServices.update(userId, payload as any, "/users");

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
			console.error("Update failed:", error);

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
				<Input
					label="Username"
					labelPlacement="outside"
					isDisabled
					value={selectedUser?.username || ""}
				/>
				<Input
					label="Email"
					labelPlacement="outside"
					isDisabled
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

				<RadioGroup
					label="Gender"
					className="flex w-full items-start justify-start"
					orientation="horizontal"
					value={userForm.gender.toString()}
					onChange={(value) => {
						setUserForm((prev) => ({
							...prev,
							gender: value as unknown as string,
						}));
					}}
				>
					<Radio value="1">Male</Radio>
					<Radio value="0">Female</Radio>
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
