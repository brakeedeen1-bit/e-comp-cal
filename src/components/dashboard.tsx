'use client';

import type { ReadingWithConsumption } from '@/lib/types';
import { useState } from 'react';
import { StatCards } from '@/components/stat-cards';
import { ConsumptionCharts } from '@/components/consumption-charts';
import { ReadingsTable } from '@/components/readings-table';
import { ReadingForm } from '@/components/reading-form';
import { InsightCard } from '@/components/insight-card';
import { DailyVariationChart } from '@/components/daily-variation-chart';

type DashboardProps = {
  initialReadings: ReadingWithConsumption[];
};

export function Dashboard({ initialReadings }: DashboardProps) {
  const [readings, setReadings] = useState<ReadingWithConsumption[]>(initialReadings);
  const [costPerKwh, setCostPerKwh] = useState(0.15);

  const addReading = (newReading: ReadingWithConsumption) => {
    setReadings((prevReadings) => [...prevReadings, newReading].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 my-4">
        {/* <ReadingForm onNewReading={addReading} lastReadingValue={readings.length > 0 ? readings[readings.length - 1].value : 0} /> */}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 my-4">
        <StatCards readings={readings} costPerKwh={costPerKwh} setCostPerKwh={setCostPerKwh} />
        <InsightCard readings={readings} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-9 my-4">
        <div className="lg:col-span-6">
          <ConsumptionCharts readings={readings} />
        </div>
        <div className="lg:col-span-3">
          <ReadingsTable readings={readings} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 my-4">
        <DailyVariationChart readings={readings} />
      </div>
    </>
  );
}
