'use server';

import { suggestMood, type SuggestMoodInput, type SuggestMoodOutput } from '@/ai/flows/auto-mood-suggestion';

export async function getMoodSuggestion(input: SuggestMoodInput): Promise<SuggestMoodOutput | null> {
  try {
    const result = await suggestMood(input);
    return result;
  } catch (error) {
    console.error('Error getting mood suggestion:', error);
    return null;
  }
}
