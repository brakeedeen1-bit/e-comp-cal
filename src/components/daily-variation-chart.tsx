'use client';

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDailyConsumptionVariationData } from '@/lib/analysis';
import type { ReadingWithConsumption } from '@/lib/types';
import { useMemo } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type DailyVariationChartProps = {
  readings: ReadingWithConsumption[];
};

export function DailyVariationChart({ readings }: DailyVariationChartProps) {
  const chartData = useMemo(() => getDailyConsumptionVariationData(readings), [readings]);

  const chartConfig = {
    Variation: {
      label: 'Consumption Variation (kWh)',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Day-to-Day Consumption Variation</CardTitle>
        <CardDescription>
          Changes in energy consumption compared to the previous day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value} kWh`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="Variation"
                type="monotone"
                stroke="var(--color-Variation)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-Variation)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
