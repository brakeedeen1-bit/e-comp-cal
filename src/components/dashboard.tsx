'use client';

import type { ReadingWithConsumption } from '@/lib/types';
import { useState } from 'react';
import { StatCards } from '@/components/stat-cards';
import { ConsumptionCharts } from '@/components/consumption-charts';
import { ReadingsTable } from '@/components/readings-table';
import { ReadingForm } from '@/components/reading-form';

type DashboardProps = {
  initialReadings: ReadingWithConsumption[];
};

export function Dashboard({ initialReadings }: DashboardProps) {
  const [readings] = useState<ReadingWithConsumption[]>(initialReadings);
  const [costPerKwh, setCostPerKwh] = useState(0.15);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCards readings={readings} costPerKwh={costPerKwh} setCostPerKwh={setCostPerKwh} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ConsumptionCharts readings={readings} />
        </div>
        <div className="lg:col-span-3">
          <ReadingsTable readings={readings} />
        </div>
      </div>
    </>
  );
}
