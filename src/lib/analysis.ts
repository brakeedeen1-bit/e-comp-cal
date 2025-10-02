import {
  format,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  subWeeks,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  isAfter,
} from 'date-fns';
import type { Reading, ReadingWithConsumption, AnalysisMetrics } from './types';

export function calculateConsumptionData(readings: Reading[]): ReadingWithConsumption[] {
  if (readings.length < 2) {
    return readings.map(r => ({ ...r, consumption: 0 }));
  }

  const sortedReadings = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sortedReadings.map((reading, index) => {
    if (index === 0) {
      return { ...reading, consumption: 0 };
    }
    const previousReading = sortedReadings[index - 1];
    // Check if the dates are consecutive, if not, we can't accurately calculate consumption for this entry from the previous.
    // However, for simplicity in this app, we'll assume the difference is over the period. A more complex app might handle gaps.
    const consumption = reading.value - previousReading.value;
    return { ...reading, consumption: consumption > 0 ? consumption : 0 };
  });
}

export function getAnalysisMetrics(readings: ReadingWithConsumption[]): AnalysisMetrics {
  const now = new Date();
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
  const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
  const startOfThisMonth = startOfMonth(now);

  let weeklyTotal = 0;
  let monthlyTotal = 0;
  let peakConsumptionDay: { date: string; value: number } | null = null;
  let totalConsumption = 0;
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentReadings = readings.filter(r => isAfter(new Date(r.date), sevenDaysAgo));
  const dailyAverage = recentReadings.length > 0 ? recentReadings.reduce((acc, r) => acc + r.consumption, 0) / recentReadings.length : 0;


  readings.forEach(r => {
    const readingDate = new Date(r.date);
    totalConsumption += r.consumption;

    if (isWithinInterval(readingDate, { start: startOfThisWeek, end: endOfThisWeek })) {
      weeklyTotal += r.consumption;
    }

    if (isSameMonth(readingDate, now)) {
      monthlyTotal += r.consumption;
    }

    if (!peakConsumptionDay || r.consumption > peakConsumptionDay.value) {
      peakConsumptionDay = { date: r.date, value: r.consumption };
    }
  });

  return {
    dailyAverage: parseFloat(dailyAverage.toFixed(2)),
    weeklyTotal: parseFloat(weeklyTotal.toFixed(2)),
    monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
    peakConsumptionDay,
    totalUnitsMonth: parseFloat(monthlyTotal.toFixed(2)),
  };
}

export function getWeeklyAveragesForInsight(readings: ReadingWithConsumption[]) {
  const now = new Date();

  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
  const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });

  const startOfLastWeek = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const endOfLastWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

  const thisWeekReadings = readings.filter(r => isWithinInterval(new Date(r.date), { start: startOfThisWeek, end: endOfThisWeek }));
  const lastWeekReadings = readings.filter(r => isWithinInterval(new Date(r.date), { start: startOfLastWeek, end: endOfLastWeek }));

  const thisWeekTotal = thisWeekReadings.reduce((sum, r) => sum + r.consumption, 0);
  const lastWeekTotal = lastWeekReadings.reduce((sum, r) => sum + r.consumption, 0);

  const thisWeekAverage = thisWeekReadings.length > 0 ? thisWeekTotal / thisWeekReadings.length : 0;
  const lastWeekAverage = lastWeekReadings.length > 0 ? lastWeekTotal / lastWeekReadings.length : 0;

  return {
    currentWeekConsumption: parseFloat(thisWeekAverage.toFixed(2)),
    previousWeekConsumption: parseFloat(lastWeekAverage.toFixed(2)),
  };
}

export function getChartData(readings: ReadingWithConsumption[], period: 'daily' | 'weekly' | 'monthly') {
    if (period === 'daily') {
        return readings.map(r => ({
            date: format(new Date(r.date), 'MMM d'),
            Consumption: r.consumption,
        })).slice(-30); // Last 30 days
    }

    const dataByPeriod: { [key: string]: number } = {};

    readings.forEach(r => {
        let key: string;
        if (period === 'weekly') {
            const weekStart = startOfWeek(new Date(r.date), { weekStartsOn: 1 });
            key = format(weekStart, 'MMM d');
        } else { // monthly
            key = format(new Date(r.date), 'MMM yyyy');
        }
        if (!dataByPeriod[key]) {
            dataByPeriod[key] = 0;
        }
        dataByPeriod[key] += r.consumption;
    });

    return Object.entries(dataByPeriod).map(([date, consumption]) => ({
        date,
        Consumption: parseFloat(consumption.toFixed(2)),
    })).slice(-12); // Last 12 periods
}

export function getDailyConsumptionVariationData(readings: ReadingWithConsumption[]) {
  if (readings.length < 2) {
    return [];
  }

  const sortedReadings = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const variationData = [];

  for (let i = 1; i < sortedReadings.length; i++) {
    const previousDay = sortedReadings[i - 1];
    const currentDay = sortedReadings[i];

    // Only calculate variation if readings are for consecutive days
    // For simplicity, we'll assume `consumption` represents daily consumption
    // and if the dates are not consecutive, it means a gap, so we skip
    const currentDate = new Date(currentDay.date);
    const previousDate = new Date(previousDay.date);

    // This simplified check assumes each reading *is* a daily reading.
    // If there can be multiple readings per day, a more complex aggregation would be needed first.
    // Given the existing `getChartData` for 'daily' uses individual readings, we'll follow that pattern.
    
    // Check if the readings are from different days and consecutive
    if (!isSameDay(currentDate, previousDate)) {
      const variation = currentDay.consumption - previousDay.consumption;
      variationData.push({
        date: format(currentDate, 'MMM d'),
        Variation: parseFloat(variation.toFixed(2)),
      });
    }
  }
  return variationData.slice(-30); // Show last 30 variations
}
