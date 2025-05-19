import * as React from "react";
import { SVGProps } from "react";

export const DashboardIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 32 32"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		strokeWidth={2}
		stroke="currentColor"
		{...props}
	>
		<path
			d="M4 6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M18 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V6Z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M4 21a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M18 16a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V16Z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
