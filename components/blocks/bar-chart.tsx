"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@aec-craft/ui/components/primitives/chart";
import { cn } from "@aec-craft/ui/lib/utils";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";

const CONFIG = {
  value: { label: "Value", color: "var(--foreground)" },
} satisfies ChartConfig;

// Thin bars with pill ends over a faint full-width track: a light-touch
// dashboard read, not a heavy block. Fixed `barSize` keeps them slim no matter
// how few rows there are (recharts otherwise fattens a bar to fill its band).
const BAR_SIZE = 8;
const RADIUS = BAR_SIZE / 2;

/**
 * Data-driven horizontal bar chart: one labeled bar per row, values along X.
 * A block over the `chart` primitive so consumers pass data and never take a
 * recharts dependency of their own. Fills its container (`aspect-auto`), so the
 * parent sets the height.
 */
export function BarChart({
  data,
  className,
  labelWidth = 64,
  barSize = BAR_SIZE,
}: {
  data: { label: string; value: number }[];
  className?: string;
  /** Width reserved for the category labels, in px. */
  labelWidth?: number;
  /** Bar thickness in px; kept slim by default. */
  barSize?: number;
}) {
  return (
    <ChartContainer
      className={cn("aspect-auto h-full w-full", className)}
      config={CONFIG}
    >
      <RechartsBarChart
        accessibilityLayer
        barCategoryGap="30%"
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 8, top: 2, bottom: 2 }}
      >
        <YAxis
          axisLine={false}
          dataKey="label"
          tickLine={false}
          type="category"
          width={labelWidth}
        />
        <XAxis dataKey="value" hide type="number" />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Bar
          background={{ fill: "var(--muted)", radius: RADIUS }}
          barSize={barSize}
          dataKey="value"
          fill="var(--color-value)"
          fillOpacity={0.85}
          radius={RADIUS}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
}
