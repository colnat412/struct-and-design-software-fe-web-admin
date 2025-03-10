import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export const UserDetails = () => {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
				<h2 className="mb-6 text-center text-2xl font-bold text-secondary">Create new user</h2>
				<div className="flex flex-col gap-4">
					<Input
						className="w-full"
						label="Email"
						type="email"
						size="lg"
						color="default"
						radius="md"
					/>
					<Input
						className="w-full"
						label="Username"
						type="text"
						size="lg"
						color="default"
						radius="md"
					/>
					<Input
						className="w-full"
						label="Password"
						type="password"
						size="lg"
						color="default"
						radius="md"
					/>
					<Input
						className="w-full"
						label="Full Name"
						type="text"
						size="lg"
						color="default"
						radius="md"
					/>
					<Input
						className="w-full"
						label="Phone"
						type="tel"
						size="lg"
						color="default"
						radius="md"
					/>
				</div>
				<Button className="mt-6 w-full rounded-lg bg-primary py-3 text-lg font-semibold text-white shadow-md">
					Save
				</Button>
			</div>
		</div>
	);
};
