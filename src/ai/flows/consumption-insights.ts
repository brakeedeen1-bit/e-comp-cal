// src/ai/flows/consumption-insights.ts
'use server';
/**
 * @fileOverview A flow that provides intelligent insights into energy consumption patterns.
 *
 * - generateConsumptionInsights - A function that generates insights into energy consumption.
 * - ConsumptionInsightsInput - The input type for the generateConsumptionInsights function.
 * - ConsumptionInsightsOutput - The return type for the generateConsumptionInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConsumptionInsightsInputSchema = z.object({
  currentWeekConsumption: z.number().describe('The average daily consumption for the current week.'),
  previousWeekConsumption: z.number().describe('The average daily consumption for the previous week.'),
});
export type ConsumptionInsightsInput = z.infer<typeof ConsumptionInsightsInputSchema>;

const ConsumptionInsightsOutputSchema = z.object({
  insight: z.string().describe('An insight comparing the current week consumption to the previous week consumption.'),
});
export type ConsumptionInsightsOutput = z.infer<typeof ConsumptionInsightsOutputSchema>;

export async function generateConsumptionInsights(input: ConsumptionInsightsInput): Promise<ConsumptionInsightsOutput> {
  return consumptionInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'consumptionInsightsPrompt',
  input: {schema: ConsumptionInsightsInputSchema},
  output: {schema: ConsumptionInsightsOutputSchema},
  prompt: `You are an expert energy consumption analyst.

  You will receive the average daily energy consumption for the current week and the previous week.
  You will generate a concise and informative insight comparing the two values, highlighting any significant changes or trends.

Current Week Consumption: {{currentWeekConsumption}} kWh
Previous Week Consumption: {{previousWeekConsumption}} kWh

Insight:`,
});

const consumptionInsightsFlow = ai.defineFlow(
  {
    name: 'consumptionInsightsFlow',
    inputSchema: ConsumptionInsightsInputSchema,
    outputSchema: ConsumptionInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
