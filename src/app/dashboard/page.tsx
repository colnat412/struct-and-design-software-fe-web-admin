"use client";

import { PieChartComponent, RevenueBarChart, TopTourRevenueChart } from "@/components";
import { useState } from "react";

const DashboardPage = () => {
	const [selectedYear, setSelectedYear] = useState<number>(2025);

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedYear(Number(e.target.value));
	};

	return (
		<div className="flex flex-col items-center justify-center gap-2 p-6">
			<h1 className="text-2xl font-bold text-primary">Thống kê</h1>
			<div className="mb-6">
				<label className="m-4 font-medium">Chọn năm:</label>
				<select
					value={selectedYear}
					onChange={handleYearChange}
					className="rounded border px-2 py-1"
				>
					{[2023, 2024, 2025, 2026].map((year) => (
						<option
							key={year}
							value={year}
						>
							{year}
						</option>
					))}
				</select>
			</div>
			<div className="flex w-full flex-col gap-4">
				<div className="flex w-full flex-row justify-between">
					<PieChartComponent year={selectedYear} />
					<RevenueBarChart year={selectedYear} />
				</div>
				<TopTourRevenueChart year={selectedYear} />
			</div>
		</div>
	);
};

export default DashboardPage;
