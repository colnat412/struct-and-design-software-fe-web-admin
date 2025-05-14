import * as React from "react";
import { SVGProps } from "react";
export const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		aria-labelledby="controlsIconTitle"
		stroke="#FFFFFF"
		strokeWidth={1}
		strokeLinecap="square"
		strokeLinejoin="miter"
		fill="none"
		color="#FFFFFF"
		{...props}
	>
		<title id="controlsIconTitle">{"Controllers"}</title>
		<path d="M17 18L17 6M12 18L12 6M7 18L7 6M5 8L9 8M10 16L14 16M15 12L19 12" />
	</svg>
);
