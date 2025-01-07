import * as React from "react";
import { SVGProps } from "react";
export const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 32 32"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		strokeWidth={2}
		stroke="currentColor"
		{...props}
	>
		<path
			d="M10.5334 26.6669C13.0781 27.9723 16.0055 28.3259 18.7879 27.6639C21.5703 27.002 24.0248 25.368 25.709 23.0565C27.3933 20.7449 28.1966 17.9078 27.9741 15.0564C27.7517 12.205 26.5181 9.52685 24.4958 7.50448C22.4734 5.48211 19.7952 4.24856 16.9438 4.02611C14.0924 3.80367 11.2553 4.60695 8.94378 6.29122C6.63224 7.97549 4.99828 10.43 4.33632 13.2124C3.67436 15.9948 4.02794 18.9221 5.33335 21.4669L2.66669 29.3336L10.5334 26.6669Z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
