import * as React from "react";
import { SVGProps } from "react";
export const PhoneIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			viewBox="0 0 20 23"
			fill="none"
			strokeWidth={2}
			stroke="currentColor"
			{...props}
		>
			<path
				d="M18 6.5V16.5C18 20.5 17 21.5 13 21.5H7C3 21.5 2 20.5 2 16.5V6.5C2 2.5 3 1.5 7 1.5H13C17 1.5 18 2.5 18 6.5Z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 5H8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M9.99995 18.6C10.856 18.6 11.55 17.906 11.55 17.05C11.55 16.194 10.856 15.5 9.99995 15.5C9.14391 15.5 8.44995 16.194 8.44995 17.05C8.44995 17.906 9.14391 18.6 9.99995 18.6Z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
