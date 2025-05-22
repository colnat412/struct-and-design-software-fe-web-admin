"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import { BookingServices, TourServices, ServiceConstants, TourResponseDto, BookingTop3TourStatisticsDto } from "@/api";

interface ChartItem {
	tourName: string;
	totalBooking: number;
}

export const TopTourRevenueChart = ({ year }: { year: number }) => {
	const tourService = new TourServices(ServiceConstants.BOOKING_SERVICE);
	const [data, setData] = useState<ChartItem[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const topTours = await BookingServices.getTop3TourRevenue(year);

				const detailedData = await Promise.all(
					topTours.map(async (item: BookingTop3TourStatisticsDto) => {
						const tour = await tourService.getById(item.tourId, "/tours");
						return {
							tourName: tour?.name ?? "Không rõ",
							totalBooking: item.totalBooking,
						};
					}),
				);
				setData(detailedData);
			} catch (error) {
				console.error("Error fetching top booked tours", error);
			}
		};

		fetchData();
	}, [year]);

	return (
		<div className="h-[300px] w-full">
			<h2 className="mb-2 text-lg font-semibold">Top 3 tour được đặt nhiều nhất ({year})</h2>
			<ResponsiveContainer
				width="100%"
				height="100%"
			>
				<BarChart
					layout="vertical"
					data={data}
					margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis type="number" />
					<YAxis
						type="category"
						dataKey="tourName"
						width={200}
						fill="#F75449"
					/>
					<Tooltip />
					<Bar
						dataKey="totalBooking"
						fill="#F75449"
					>
						<LabelList
							dataKey="totalBooking"
							position="right"
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
