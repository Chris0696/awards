"use client";

import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

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
  votes: {
    label: "Nombre de votes",
    color: "#0026B0",
  },
} satisfies ChartConfig;

export function VotesChart({ chartData }: { chartData: any }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        barSize={20}
        barCategoryGap="10%"
      >
        <XAxis tickLine={false} dataKey="label" />
        <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
        <Bar dataKey="votes" fill="var(--color-votes)" radius={20} />
      </BarChart>
    </ChartContainer>
  );
}
