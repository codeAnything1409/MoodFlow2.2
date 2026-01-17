'use server';

import {
  generateInsightsAndAnalyticsDashboard,
  type InsightsAndAnalyticsDashboardInput,
  type InsightsAndAnalyticsDashboardOutput,
} from '@/ai/flows/insights-and-analytics-dashboard';

export async function getInsights(
  input: InsightsAndAnalyticsDashboardInput
): Promise<InsightsAndAnalyticsDashboardOutput | null> {
  try {
    const result = await generateInsightsAndAnalyticsDashboard(input);
    return result;
  } catch (error) {
    console.error('Error getting insights:', error);
    return null;
  }
}
