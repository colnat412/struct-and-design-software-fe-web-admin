"use client";

import { BookingServices, BookingStatisticsCategoryResponseDto } from "@/api";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#1E40AF", "#0F766E", "#CA8A04", "#B91C1C"];

export const PieChartComponent = ({ year }: { year: number }) => {
	const [data, setData] = useState<BookingStatisticsCategoryResponseDto[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await BookingServices.getNumberOfBookingsOfCategory(year);
				const formatted = response.map((item: BookingStatisticsCategoryResponseDto) => ({
					name: item.categoryName,
					count: item.count,
				}));
				setData(formatted);
			} catch (err) {
				console.error("Fetch failed", err);
			}
		};
		fetchData();
	}, [year]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);
		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor="middle"
				dominantBaseline="central"
				fontSize={14}
			>
				{`${name}: ${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<div className="flex w-1/3 flex-col items-center">
			<h2 className="mb-2 text-lg font-semibold">Biểu đồ theo danh mục</h2>
			{data.length > 0 ? (
				<PieChart
					width={400}
					height={350}
				>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						outerRadius={160}
						dataKey="count"
						label={renderCustomizedLabel}
						labelLine={false}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${entry.categoryName}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			) : (
				<p className="text-gray-500">Không có dữ liệu cho năm {year}</p>
			)}
		</div>
	);
};
