import * as React from "react";
import { SVGProps } from "react";
export const ArrowBack = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M15 19.92L8.47997 13.4C7.70997 12.63 7.70997 11.37 8.47997 10.6L15 4.07996"
			strokeMiterlimit={10}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
