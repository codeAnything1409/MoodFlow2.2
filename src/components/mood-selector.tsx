'use client';

import { BrainCircuit, Coffee, Meh, Frown } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Mood } from '@/lib/types';
import { moods } from '@/lib/types';
import { cn } from '@/lib/utils';

type MoodSelectorProps = {
  selectedMood: Mood | null;
  onMoodChange: (mood: Mood) => void;
};

const moodIcons: Record<Mood, React.ReactNode> = {
  Focus: <BrainCircuit className="h-6 w-6" />,
  Relax: <Coffee className="h-6 w-6" />,
  Bored: <Meh className="h-6 w-6" />,
  Sad: <Frown className="h-6 w-6" />,
};

export default function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center font-headline text-2xl">How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          value={selectedMood ?? ''}
          onValueChange={(value) => {
            if (value) onMoodChange(value as Mood);
          }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          aria-label="Mood selection"
        >
          {moods.map((mood) => (
            <ToggleGroupItem
              key={mood}
              value={mood}
              className={cn(
                'flex h-24 flex-col gap-2 rounded-lg border-2 border-transparent p-4 transition-all duration-200 ease-in-out',
                'data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary-foreground data-[state=on]:shadow-lg',
                'hover:bg-accent/50 hover:text-accent-foreground'
              )}
              aria-label={mood}
            >
              {moodIcons[mood]}
              <span className="text-sm font-medium">{mood}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}
