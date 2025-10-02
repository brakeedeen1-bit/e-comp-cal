export type Reading = {
  id: string;
  date: string; // ISO string e.g., "2023-10-27"
  value: number; // The meter reading in kWh
};

export type ReadingWithConsumption = Reading & {
  consumption: number;
};

export type AnalysisMetrics = {
  dailyAverage: number;
  weeklyTotal: number;
  monthlyTotal: number;
  peakConsumptionDay: {
    date: string;
    value: number;
  } | null;
  totalUnitsMonth: number;
};
