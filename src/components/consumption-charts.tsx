'use client';

import { Bar, Line, Area, Radar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, ResponsiveContainer, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getChartData } from '@/lib/analysis';
import type { ReadingWithConsumption } from '@/lib/types';
import { useMemo, useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

type ConsumptionChartsProps = {
  readings: ReadingWithConsumption[];
};

export function ConsumptionCharts({ readings }: ConsumptionChartsProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'radar' | 'pie'>('line');

  const chartData = useMemo(() => getChartData(readings, period), [readings, period]);

  const chartConfig = {
    Consumption: {
      label: 'Consumption (kWh)',
      color: 'hsl(var(--primary))',
    },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
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
          </ComposedChart>
        );
      case 'bar':
        return (
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
            <Bar dataKey="Consumption" fill="var(--color-Consumption)" radius={4} />
          </ComposedChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
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
            <Area type="monotone" dataKey="Consumption" stroke="var(--color-Consumption)" fill="var(--color-Consumption)" />
          </AreaChart>
        );
      case 'radar':
        return (
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="date" />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            <Radar name="Consumption" dataKey="Consumption" stroke="var(--color-Consumption)" fill="var(--color-Consumption)" fillOpacity={0.6} />
          </RadarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={chartData} dataKey="Consumption" nameKey="date" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
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
        <Tabs defaultValue={period} className="ml-auto" onValueChange={(value) => setPeriod(value as any)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue={chartType} className="ml-auto" onValueChange={(value) => setChartType(value as any)}>
          <TabsList>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
            <TabsTrigger value="radar">Radar</TabsTrigger>
            <TabsTrigger value="pie">Pie</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
