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
    countryName: string;
    countryCode: string;
  }[];
};

export default function ViewsByCountryChart({ chart }: Props) {
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
        <XAxis dataKey="countryName" tickLine={false} tickMargin={2} />
        <YAxis
          tickLine={false}
          tickMargin={2}
          allowDecimals={false}
          tickFormatter={formatNumber}
        />
        <ChartTooltip content={<ChartTooltipContent nameKey="countryName" />} />
        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
