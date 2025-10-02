'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';
import { generateConsumptionInsights } from '@/ai/flows/consumption-insights';
import type { ReadingWithConsumption } from '@/lib/types';
import { getWeeklyAveragesForInsight } from '@/lib/analysis';

type InsightCardProps = {
  readings: ReadingWithConsumption[];
};

export function InsightCard({ readings }: InsightCardProps) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      try {
        const { currentWeekConsumption, previousWeekConsumption } = getWeeklyAveragesForInsight(readings);
        
        if (currentWeekConsumption === 0 && previousWeekConsumption === 0) {
            setInsight("Not enough data to generate insights. Keep adding readings!");
            return;
        }

        const result = await generateConsumptionInsights({
          currentWeekConsumption,
          previousWeekConsumption,
        });
        setInsight(result.insight);
      } catch (error) {
        console.error('Failed to generate insight:', error);
        setInsight('Could not generate an insight at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [readings]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Insight</CardTitle>
        <Lightbulb className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
