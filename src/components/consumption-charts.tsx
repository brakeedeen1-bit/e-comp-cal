'use client';

import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getChartData } from '@/lib/analysis';
import type { ReadingWithConsumption } from '@/lib/types';
import { useMemo, useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

type ConsumptionChartsProps = {
  readings: ReadingWithConsumption[];
};

export function ConsumptionCharts({ readings }: ConsumptionChartsProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const chartData = useMemo(() => getChartData(readings, period), [readings, period]);
  
  const chartConfig = {
    Consumption: {
      label: 'Consumption (kWh)',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <div className="grid gap-1">
          <CardTitle>Consumption Trends</CardTitle>
          <CardDescription>
            Visualize your energy usage over time.
          </CardDescription>
        </div>
        <Tabs defaultValue="daily" className="ml-auto" onValueChange={(value) => setPeriod(value as any)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
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
                tickFormatter={(value) => `${value} kWh`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
               <ChartLegend content={<ChartLegendContent />} />
              {period === 'daily' ? (
                <Line
                  dataKey="Consumption"
                  type="monotone"
                  stroke="var(--color-Consumption)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-Consumption)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              ) : (
                <Bar dataKey="Consumption" fill="var(--color-Consumption)" radius={4} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
