import { UserDetails } from "@/components";

const UserDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	return <UserDetails />;
};

export default UserDetailsPage;
