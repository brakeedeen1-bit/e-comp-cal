'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAnalysisMetrics } from '@/lib/analysis';
import type { ReadingWithConsumption } from '@/lib/types';
import { BarChart, Calendar, TrendingUp, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { InsightCard } from './insight-card';

type StatCardsProps = {
  readings: ReadingWithConsumption[];
  costPerKwh: number;
  setCostPerKwh: (cost: number) => void;
};

export function StatCards({ readings, costPerKwh, setCostPerKwh }: StatCardsProps) {
  const metrics = useMemo(() => getAnalysisMetrics(readings), [readings]);
  const estimatedBill = metrics.monthlyTotal * costPerKwh;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Daily Use (7d)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.dailyAverage} kWh</div>
          <p className="text-xs text-muted-foreground">
            Based on the last 7 days of consumption
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month's Total</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.monthlyTotal} kWh</div>
          <p className="text-xs text-muted-foreground">
            Total units consumed this calendar month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Est. Monthly Bill</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${estimatedBill.toFixed(2)}</div>
          <div className="flex items-center gap-2 text-xs">
            <Label htmlFor="cost" className="text-muted-foreground">
              Cost/kWh:
            </Label>
            <Input
              id="cost"
              type="number"
              value={costPerKwh}
              onChange={(e) => setCostPerKwh(parseFloat(e.target.value) || 0)}
              className="h-6 w-20 p-1 text-xs"
              step="0.01"
            />
          </div>
        </CardContent>
      </Card>
      <InsightCard readings={readings} />
    </>
  );
}
