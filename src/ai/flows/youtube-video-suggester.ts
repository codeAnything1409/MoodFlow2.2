'use server';
/**
 * @fileOverview A flow for suggesting YouTube videos based on the user's mood.
 *
 * - suggestVideos - A function that suggests YouTube videos.
 * - SuggestVideosInput - The input type for the suggestVideos function.
 * - SuggestVideosOutput - The return type for the suggestVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVideosInputSchema = z.object({
  mood: z.string().describe('The user\'s current mood.'),
});
export type SuggestVideosInput = z.infer<typeof SuggestVideosInputSchema>;

const VideoSuggestionSchema = z.object({
    title: z.string().describe('The title of the YouTube video.'),
    description: z.string().describe('A short description of the video.'),
    youtubeId: z.string().describe('A relevant YouTube video ID.'),
});

const SuggestVideosOutputSchema = z.object({
  videos: z.array(VideoSuggestionSchema).length(9).describe('An array of 9 YouTube video suggestions.'),
});
export type SuggestVideosOutput = z.infer<typeof SuggestVideosOutputSchema>;
export type VideoSuggestion = z.infer<typeof VideoSuggestionSchema>;


export async function suggestVideos(input: SuggestVideosInput): Promise<SuggestVideosOutput> {
  return suggestVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVideosPrompt',
  input: {schema: SuggestVideosInputSchema},
  output: {schema: SuggestVideosOutputSchema},
  prompt: `You are a helpful assistant that recommends YouTube videos to users based on their mood.

If the mood is 'Sad', suggest uplifting or happy music videos.
For other moods, suggest relevant videos.

Based on the user's mood of '{{{mood}}}', suggest exactly 9 YouTube videos that could help improve their mood. For each video, provide a title, a short description, and a plausible (but not necessarily real) YouTube video ID.

Ensure that the suggestions are varied and different each time this prompt is called. Do not suggest the same videos repeatedly.
`,
});

const suggestVideosFlow = ai.defineFlow(
  {
    name: 'suggestVideosFlow',
    inputSchema: SuggestVideosInputSchema,
    outputSchema: SuggestVideosOutputSchema,
  },
  async input => {
    const {output} = await suggestVideosPrompt(input);
    return output!;
  }
);
