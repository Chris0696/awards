"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  projects: {
    label: "Projets publiés",
    color: "#0026B0",
  },
} satisfies ChartConfig;

export function NewProjectsChart({ chartData }: { chartData: any }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        barSize={20}
        barCategoryGap="10%"
      >
        <XAxis tickLine={false} dataKey="label" />
        <YAxis axisLine={false} tickLine={false} />
        <Bar dataKey="projects" fill="var(--color-projects)" radius={20} />
      </BarChart>
    </ChartContainer>
  );
}
