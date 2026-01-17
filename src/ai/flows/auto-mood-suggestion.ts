'use server';

/**
 * @fileOverview A flow for suggesting the user's mood based on their usage patterns.
 *
 * - suggestMood - A function that suggests the user's mood.
 * - SuggestMoodInput - The input type for the suggestMood function.
 * - SuggestMoodOutput - The return type for the suggestMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMoodInputSchema = z.object({
  timeOfDay: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']).describe('The time of day.'),
  pastMoods: z.array(z.enum(['Focus', 'Relax', 'Bored', 'Sad'])).describe('The user\'s past moods.'),
  pastContentTypes: z.array(z.string()).describe('The user\'s past content types.'),
}).describe('Input schema for mood suggestion.');

export type SuggestMoodInput = z.infer<typeof SuggestMoodInputSchema>;

const SuggestMoodOutputSchema = z.object({
  suggestedMood: z.enum(['Focus', 'Relax', 'Bored', 'Sad']).describe('The suggested mood for the user.'),
  confidence: z.number().min(0).max(1).describe('The confidence level of the mood suggestion (0 to 1).'),
}).describe('Output schema for mood suggestion.');

export type SuggestMoodOutput = z.infer<typeof SuggestMoodOutputSchema>;

export async function suggestMood(input: SuggestMoodInput): Promise<SuggestMoodOutput> {
  return suggestMoodFlow(input);
}

const suggestMoodPrompt = ai.definePrompt({
  name: 'suggestMoodPrompt',
  input: {schema: SuggestMoodInputSchema},
  output: {schema: SuggestMoodOutputSchema},
  prompt: `Based on the user's usage patterns, suggest a mood.

Time of Day: {{{timeOfDay}}}
Past Moods: {{#each pastMoods}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Past Content Types: {{#each pastContentTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Consider the time of day, past moods, and past content types to suggest the most likely mood for the user. Also, estimate your confidence in the suggested mood.
`,
});

const suggestMoodFlow = ai.defineFlow(
  {
    name: 'suggestMoodFlow',
    inputSchema: SuggestMoodInputSchema,
    outputSchema: SuggestMoodOutputSchema,
  },
  async input => {
    const {output} = await suggestMoodPrompt(input);
    return output!;
  }
);
