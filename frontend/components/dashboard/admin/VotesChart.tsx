"use client";

import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";

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
  revenue: {
    label: "Revenus générés",
    color: "#FF7F00",
  },
  transactions: {
    label: "Transactions",
    color: "#00A36C",
  },
} satisfies ChartConfig;

export function VotesChart({
  metric,
  chartData,
}: {
  chartData: any;
  metric: "votes" | "revenue" | "transactions";
}) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        barSize={10}
        barCategoryGap="15%"
      >
        <XAxis dataKey="label" tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Legend />
        <Bar
          dataKey="votes"
          fill="var(--color-votes)"
          name={chartConfig.votes.label}
          radius={20}
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          name={chartConfig.revenue.label}
          radius={20}
        />
      </BarChart>
    </ChartContainer>
  );
}
