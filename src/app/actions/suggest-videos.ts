'use server';

import {
  suggestVideos,
  type SuggestVideosInput,
  type SuggestVideosOutput,
} from '@/ai/flows/youtube-video-suggester';

export async function getVideoSuggestions(
  input: SuggestVideosInput
): Promise<SuggestVideosOutput | null> {
  try {
    const result = await suggestVideos(input);
    return result;
  } catch (error) {
    console.error('Error getting video suggestions:', error);
    return null;
  }
}
