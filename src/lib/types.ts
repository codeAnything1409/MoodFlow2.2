export const moods = ['Focus', 'Relax', 'Bored', 'Sad'] as const;
export type Mood = (typeof moods)[number];

export const timeOfDayCategories = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
] as const;
export type TimeOfDay = (typeof timeOfDayCategories)[number];

export const contentCategories = [
  'Study',
  'Motivation',
  'Music',
  'Meditation',
  'Entertainment',
] as const;
export type ContentCategory = (typeof contentCategories)[number];

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  imageUrl: string;
  imageHint: string;
};

export type UserInteraction = {
  mood: Mood;
  timeOfDay: TimeOfDay;
  contentCategory?: ContentCategory;
  timestamp: Date;
};
