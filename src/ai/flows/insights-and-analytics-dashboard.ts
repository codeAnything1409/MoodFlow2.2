'use server';

/**
 * @fileOverview Generates a weekly summary of user data, including most selected moods, content types,
 * and peak productivity times, providing insights into user habits.
 *
 * - generateInsightsAndAnalyticsDashboard - A function that generates the insights and analytics dashboard.
 * - InsightsAndAnalyticsDashboardInput - The input type for the generateInsightsAndAnalyticsDashboard function.
 * - InsightsAndAnalyticsDashboardOutput - The return type for the generateInsightsAndAnalyticsDashboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InsightsAndAnalyticsDashboardInputSchema = z.object({
  weeklyData: z
    .string()
    .describe(
      'A JSON string containing weekly user data, including mood selections, content consumption, and session durations.'
    ),
  additionalContext: z
    .string()
    .optional()
    .describe('Any additional context that may be useful for insights.'),
});
export type InsightsAndAnalyticsDashboardInput = z.infer<
  typeof InsightsAndAnalyticsDashboardInputSchema
>;

const InsightsAndAnalyticsDashboardOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A human-readable summary of the user data, including most selected moods, content types, and peak productivity times.'
    ),
  insights: z.array(z.string()).describe('Key insights derived from the user data.'),
  recommendationAccuracyScore: z
    .number()
    .optional()
    .describe('A score indicating the accuracy of content recommendations.'),
});
export type InsightsAndAnalyticsDashboardOutput = z.infer<
  typeof InsightsAndAnalyticsDashboardOutputSchema
>;

export async function generateInsightsAndAnalyticsDashboard(
  input: InsightsAndAnalyticsDashboardInput
): Promise<InsightsAndAnalyticsDashboardOutput> {
  return insightsAndAnalyticsDashboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'insightsAndAnalyticsDashboardPrompt',
  input: {schema: InsightsAndAnalyticsDashboardInputSchema},
  output: {schema: InsightsAndAnalyticsDashboardOutputSchema},
  prompt: `You are an AI assistant that analyzes user data to provide insights and analytics.

Analyze the following weekly user data:
{{{weeklyData}}}

Additional Context: {{{additionalContext}}}

Provide a summary of the user's most selected moods, most consumed content types, and peak productivity times.
Also, provide key insights derived from the data and, if possible, include a recommendation accuracy score.

Format the output as a JSON object with the following keys:
- summary: A human-readable summary of the user data.
- insights: An array of key insights derived from the user data.
- recommendationAccuracyScore: A score indicating the accuracy of content recommendations (optional).

Consider the user interface style guide when generating the output:
- [color] Primary color: Slate blue (#7395AE) evokes a sense of calm and focus.
- [color] Background color: Very light blue (#E8EBEF), provides a soft backdrop that does not distract.
- [color] Accent color: Light gold (#D0B49F), offering subtle contrast and a touch of warmth.
- [typography] Body and headline font: 'PT Sans', a modern, humanist sans-serif suitable for headlines and body text.
- [iconography] Minimalist icons that represent moods and content categories.
- [animation] Smooth, subtle animations for mood transitions and content loading.
- [layout] Clean and distraction-free layout, with a clear "Suggested for You" section.`,
});

const insightsAndAnalyticsDashboardFlow = ai.defineFlow(
  {
    name: 'insightsAndAnalyticsDashboardFlow',
    inputSchema: InsightsAndAnalyticsDashboardInputSchema,
    outputSchema: InsightsAndAnalyticsDashboardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
