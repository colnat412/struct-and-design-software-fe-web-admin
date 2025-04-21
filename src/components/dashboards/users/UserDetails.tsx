"use client";

import { ServiceConstants, UserResponseDto, UserServices, UserUpdateDto } from "@/api";
import { toInputDateFormat } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

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
		gender: 0,
	});

	useEffect(() => {
		if (selectedUser) {
			setUserForm({
				phone: selectedUser.phone ? String(selectedUser.phone) : "",
				fullName: selectedUser.fullName || "",
				birthday: toInputDateFormat(selectedUser.birthday) || "",
				gender: Number(selectedUser.gender) ?? 0,
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

			const payload: UserUpdateDto = {
				...userForm,
				birthday: new Date(userForm.birthday).toISOString(),
				gender: Number(userForm.gender),
			};

			const updatedUser = await userServices.update(userId, payload as any, "/users");
			if (!updatedUser) {
				throw new Error("Failed to update user");
			}

			const freshData = await userServices.getAll("/users");
			setData(Array.isArray(freshData) ? freshData : []);

			alert("User updated successfully!");
			setSelectedUser(null);
			setIsCreate(false);
		} catch (error) {
			console.error("Update failed:", error);
			alert("Failed to update user.");
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
					value={userForm.fullName}
					onChange={handleChange}
				/>
				<Input
					isRequired
					name="phone"
					label="Phone"
					labelPlacement="outside"
					placeholder="Enter phone"
					value={userForm.phone}
					onChange={handleChange}
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
