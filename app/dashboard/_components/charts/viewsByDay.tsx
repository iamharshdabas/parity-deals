"use client";

import EmptyChart from "@/components/chart/empty";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumber } from "@/lib/utils";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type Props = {
  chart: {
    views: number;
    date: string;
  }[];
};

export default function ViewsByDayChart({ chart }: Props) {
  const config = {
    views: {
      label: "Visitors",
      color: "hsl(var(--accent-foreground))",
    },
  };

  if (chart.length === 0) return <EmptyChart />;

  return (
    <ChartContainer config={config} className="min-h-32 max-h-64 w-full">
      <BarChart accessibilityLayer data={chart}>
        <XAxis dataKey="date" tickLine={false} tickMargin={2} />
        <YAxis
          tickLine={false}
          tickMargin={2}
          allowDecimals={false}
          tickFormatter={formatNumber}
        />
        <ChartTooltip content={<ChartTooltipContent nameKey="date" />} />
        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
