"use client";

import EmptyChart from "@/components/chart/empty";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCountryGroup, formatNumber } from "@/lib/utils";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type Props = {
  chart: {
    views: number;
    countryGroup: string;
  }[];
};

export default function ViewsByCountryGroupChart({ chart }: Props) {
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
        <XAxis
          dataKey="countryGroup"
          tickLine={false}
          tickMargin={2}
          tickFormatter={formatCountryGroup}
        />
        <YAxis
          tickLine={false}
          tickMargin={2}
          allowDecimals={false}
          tickFormatter={formatNumber}
        />
        <ChartTooltip
          content={<ChartTooltipContent nameKey="countryGroup" />}
        />
        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
