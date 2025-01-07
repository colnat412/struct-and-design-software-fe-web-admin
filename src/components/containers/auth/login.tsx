import { LockIcon, PhoneIcon } from "@/assets/svgs";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import React from "react";

const Login = () => {
	return (
		<div className="flex h-screen flex-col items-center gap-6 pt-14">
			<div className="flex flex-col items-center gap-6">
				<h1 className="text-6xl font-bold text-primary">Zalo</h1>
				<div className="flex flex-col items-center">
					<span className="">Đăng nhập tài khoản Zalo</span>
					<span className="">Để kết nối với ứng dụng Zalo Web</span>
				</div>
			</div>
			<div className="flex h-128 w-128 flex-col items-center rounded-lg border bg-white">
				<div className="flex w-full flex-col items-center p-4">
					<span className="text-md font-semibold">Đăng nhập với mật khẩu</span>
					<hr className="mt-2 flex w-128 border-gray-300" />
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-8 p-20">
					<div className="flex w-full flex-row items-center justify-center gap-2">
						<Input
							startContent={
								<div className="flex flex-row gap-4">
									<PhoneIcon className="size-5 text-icon" />
									<select
										name=""
										id=""
									>
										<option value="84">+84</option>
										<option value="1">+1</option>
									</select>
								</div>
							}
							variant="underlined"
							size="sm"
							placeholder="Số điện thoại hoặc email"
						/>
					</div>
					<div className="flex w-full flex-row items-center justify-center gap-2">
						<Input
							startContent={<LockIcon className="size-5" />}
							placeholder="Mật khẩu"
							size="sm"
							variant="underlined"
						/>
					</div>
					<Button
						size="md"
						className="w-full bg-primary text-white"
					>
						Đăng nhập
					</Button>
					<Link
						href="/forgot-password"
						className="text-md text-black"
					>
						Quên mật khẩu
					</Link>
					<Link
						href="#"
						className="mt-10 flex font-semibold text-primary"
					>
						Đăng nhập qua mã QR
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
