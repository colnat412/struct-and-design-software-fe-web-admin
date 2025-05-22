"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from "recharts";
import { BookingRevenueStatisticsDto, BookingServices } from "@/api";

export const RevenueBarChart = ({ year }: { year: number }) => {
	const [data, setData] = useState<{ month: string; totalRevenue: number }[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response: BookingRevenueStatisticsDto[] = await BookingServices.getTotalRevenueByMonth(year);

				const months = Array.from({ length: 12 }, (_, i) => i + 1);
				const formatted = months.map((m) => {
					const monthData = response.find((item) => item.month === m);
					return {
						month: `Tháng ${m}`,
						totalRevenue: monthData ? monthData.totalRevenue : 0,
					};
				});
				setData(formatted);
			} catch (error) {
				console.error("Error loading revenue data", error);
			}
		};
		fetchData();
	}, [year]);

	return (
		<div className="flex h-96 w-2/3 flex-col items-center justify-center">
			<h2 className="mb-2 flex text-lg font-semibold">Doanh thu theo tháng ({year})</h2>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<BarChart
					data={data}
					margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month"></XAxis>
					<YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}`}>
						<Label
							value="Doanh thu (triệu ₫)"
							angle={-90}
							position="left"
							style={{ textAnchor: "middle" }}
						/>
					</YAxis>
					<Tooltip formatter={(value: number) => `${value.toLocaleString()} ₫`} />
					<Bar
						dataKey="totalRevenue"
						fill="#00315C"
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
