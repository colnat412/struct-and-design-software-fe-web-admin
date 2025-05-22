"use client";

import { ServiceConstants, UserResponseDto, UserServices, UserUpdateDto } from "@/api";
import { formatBirthdayToDMY, formatTimestampToDate, isValidDate, isValidFullName, isValidPhone } from "@/utils/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form, Radio, RadioGroup } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface UserDetailProps {
	selectedUser: UserResponseDto | null;
	setSelectedUser: React.Dispatch<React.SetStateAction<UserResponseDto | null>>;
	setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
	setData: React.Dispatch<React.SetStateAction<UserResponseDto[]>>;
}

export const UserDetails = ({ selectedUser, setSelectedUser, setIsCreate, setData }: UserDetailProps) => {
	const userServices = new UserServices(ServiceConstants.USER_SERVICE);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const [userForm, setUserForm] = useState<UserUpdateDto>({
		username: "",
		email: "",
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
			setUserForm({
				username: selectedUser.username || "",
				email: selectedUser.email || "",
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
				username: "",
				email: "",
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

			setAvatarFile(file);
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

			if (!isValidPhone(userForm.phone)) {
				toast.error("Please enter a valid phone number (10-11 digits)");
				return;
			}
			if (!isValidFullName(userForm.fullName)) {
				toast.error("Full name must be at least 2 characters");
				return;
			}
			if (!isValidDate(userForm.birthday)) {
				toast.error("Invalid date format");
				return;
			}

			const payload: UserUpdateDto = {
				phone: userForm.phone.trim(),
				fullName: userForm.fullName.trim(),
				birthday: formatBirthdayToDMY(userForm.birthday),
				gender: userForm.gender,
				...(selectedUser ? {} : { password: userForm.password }),
				avatarUrl: userForm.avatarUrl,
			};

			console.log("Payload:", payload);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const updatedUser = await userServices.update(userId, payload as any, "/users");
			if (!updatedUser) {
				throw new Error("No response from server");
			}

			if (avatarFile) {
				await UserServices.uploadAvatar(userId, avatarFile);
			}

			toast.success("Người dùng đã được chỉnh sửa");
			const freshData = await userServices.getAll("/users");
			if (Array.isArray(freshData)) {
				setData(freshData);
				setSelectedUser(null);
				setIsCreate(false);
			}
		} catch (error) {
			toast.error("Failed to update user");
			throw error;
		}
	};

	const handleAddNew = async () => {
		try {
			if (!userForm.username?.trim()) {
				toast.error("Username is required");
				return;
			}
			if (!userForm.email?.trim()) {
				toast.error("Email is required");
				return;
			}
			if (!isValidPhone(userForm.phone)) {
				toast.error("Please enter a valid phone number (10-11 digits)");
				return;
			}
			if (!isValidFullName(userForm.fullName)) {
				toast.error("Full name must be at least 2 characters");
				return;
			}
			if (!isValidDate(userForm.birthday)) {
				toast.error("Invalid date format");
				return;
			}

			const payload = {
				username: userForm.username.trim(),
				password: userForm.password,
				email: userForm.email.trim(),
				phone: userForm.phone.trim(),
				fullName: userForm.fullName.trim(),
				avatarUrl: "",
				birthday: formatBirthdayToDMY(userForm.birthday),
				gender: parseInt(userForm.gender),
				role: "USER",
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const newUser = await userServices.create(payload as any, "/users/register");
			if (newUser) {
				toast.success("Người dùng đã được tạo mới");
			}
			if (!newUser?.userId) {
				throw new Error("Failed to create user");
			}

			if (avatarFile) {
				const formData = new FormData();
				formData.append("avatar", avatarFile);
				await UserServices.uploadAvatar(newUser.userId, avatarFile);
			}

			toast.success("User created successfully!");

			const freshData = await userServices.getAll("/users");
			if (Array.isArray(freshData)) {
				setData(freshData);
				setSelectedUser(null);
				setIsCreate(false);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to create user");
		}
	};

	return (
		<Form
			className="flex h-1/3 w-full max-w-full flex-col gap-4 p-4"
			onSubmit={(e) => {
				e.preventDefault();
				if (isCreating) {
					handleAddNew();
				} else {
					handleEdit();
				}
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
								Choose a image
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
					isRequired
					name="username"
					label="Username"
					labelPlacement="outside"
					placeholder="Enter username"
					value={isCreating ? userForm.username : selectedUser?.username || ""}
					onChange={handleChange}
					isDisabled={!isCreating}
				/>
				<Input
					isRequired
					name="email"
					label="Email"
					labelPlacement="outside"
					placeholder="Enter email"
					type="email"
					value={isCreating ? userForm.email : selectedUser?.email || ""}
					onChange={handleChange}
					isDisabled={!isCreating}
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
						color="primary"
						type="submit"
					>
						{isCreating ? "Create" : "Save"}
					</Button>
				</div>
			</div>
		</Form>
	);
};
