"use client";

import { UserResponseDto } from "@/api";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form, Radio, RadioGroup } from "@heroui/react";

interface UserDetailProps {
	selectedUser: UserResponseDto | null;
	setSelectedUser: React.Dispatch<React.SetStateAction<UserResponseDto | null>>;
	setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserDetails = ({ selectedUser, setSelectedUser, setIsCreate }: UserDetailProps) => {
	const handleEditUser = () => {};
	return (
		<Form className="flex h-1/3 w-full max-w-full flex-col gap-4 p-4">
			<span className="mx-1 font-semibold">User Information</span>
			<div className="flex w-full flex-col gap-5">
				<Input
					isRequired
					errorMessage="Please enter a username"
					label="Username"
					labelPlacement="outside"
					name="username"
					placeholder="Enter your username"
					type="text"
					isDisabled={selectedUser?.username !== undefined}
					value={selectedUser?.username}
				/>
				<Input
					isRequired
					errorMessage="Please enter a email"
					label="Email"
					labelPlacement="outside"
					name="email"
					placeholder="Enter your email"
					type="text"
					value={selectedUser?.email}
				/>
				<Input
					isRequired
					errorMessage="Please enter a name"
					label="Name"
					labelPlacement="outside"
					name="name"
					placeholder="Enter your name"
					type="text"
					value={selectedUser?.name}
				/>
				<Input
					label="Birthday"
					type="date"
				/>
				<RadioGroup
					value={selectedUser?.gender !== undefined ? selectedUser.gender.toString() : ""}
					className="w-full"
					label="Gender"
					orientation="horizontal"
				>
					<Radio
						checked
						value="0"
					>
						Male
					</Radio>
					<Radio value="1">Female</Radio>
				</RadioGroup>

				<Input
					className="w-full"
					isRequired
					errorMessage="Please enter a valid username"
					label="Phone"
					labelPlacement="outside"
					name="phone"
					placeholder="Enter your phone"
					type="text"
					value={selectedUser?.phone.toString()}
				/>
				<Input
					className="w-full"
					isRequired
					errorMessage="Please enter a role"
					label="Role"
					labelPlacement="outside"
					name="username"
					placeholder="Enter your role"
					type="text"
					value={selectedUser?.role}
				/>
				<div className="flex w-full justify-end gap-4">
					<Button
						onPress={() => {
							setSelectedUser(null);
							setIsCreate(false);
						}}
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
