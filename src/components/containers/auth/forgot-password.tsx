import { ArrowBack, PhoneIcon } from "@/assets/svgs";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import React from "react";

const ForgotPassword = () => {
	return (
		<div className="flex h-screen flex-col items-center gap-6 pt-14">
			<div className="flex flex-col items-center gap-6">
				<h1 className="text-6xl font-bold text-primary">Zalo</h1>
				<div className="flex flex-col items-center">
					<span className="">Khôi phục mật khẩu Zalo</span>
					<span className="">Để kết nối với ứng dụng Zalo Web</span>
				</div>
			</div>
			<div className="flex h-80 w-128 flex-col items-center rounded-lg border bg-white">
				<div className="flex w-full flex-col items-center p-10">
					<span className="text-md font-semibold">Nhập số điện thoại hoặc email</span>
					{/* <hr className="flex mt-2 border-gray-300 w-128" /> */}
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-8 px-20">
					<div className="flex w-full flex-row items-center justify-center gap-2">
						<Input
							startContent={
								<div className="flex flex-row gap-4">
									<PhoneIcon className="size-5" />
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
					<Button
						size="md"
						className="w-full bg-primary text-white"
					>
						Tiếp tục
					</Button>
					<div className="flex w-full flex-row justify-start">
						<Link
							className="flex w-full flex-row items-center justify-start"
							href="#"
						>
							<ArrowBack
								width={16}
								height={16}
							/>
							Quay lại
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
