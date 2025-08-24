"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#0026B0",
  },
  mobile: {
    label: "Mobile",
    color: "#FF7F00",
  },
} satisfies ChartConfig;

export function NewProjectsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px]">
      <BarChart
        accessibilityLayer
        data={chartData}
        barSize={20}
        barCategoryGap={"10%"}
      >
        <XAxis tickLine={false} dataKey="month" />
        <YAxis axisLine={false} tickLine={false} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={20} />
      </BarChart>
    </ChartContainer>
  );
}
