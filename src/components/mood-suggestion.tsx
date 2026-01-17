'use client';

import { useState, useEffect, useTransition } from 'react';
import { useUserData } from '@/context/user-data-context';
import { getTimeOfDay } from '@/lib/time';
import type { Mood } from '@/lib/types';
import { getMoodSuggestion } from '@/app/actions/suggest';
import { Button } from './ui/button';
import { Wand2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type MoodSuggestionProps = {
  onAccept: (mood: Mood) => void;
};

const SHOW_SUGGESTION_THRESHOLD = 3;

export default function MoodSuggestion({ onAccept }: MoodSuggestionProps) {
  const { interactions } = useUserData();
  const [suggestion, setSuggestion] = useState<Mood | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (
      interactions.length >= SHOW_SUGGESTION_THRESHOLD &&
      !suggestion &&
      !isPending
    ) {
      startTransition(async () => {
        const timeOfDay = getTimeOfDay();
        const pastMoods = interactions.map((i) => i.mood).slice(-5) as Mood[];
        const pastContentTypes = interactions.map((i) => i.contentCategory).filter(Boolean) as string[];

        const result = await getMoodSuggestion({
          timeOfDay,
          pastMoods,
          pastContentTypes
        });

        if (result && result.confidence > 0.5) {
          setSuggestion(result.suggestedMood);
          setIsVisible(true);
        }
      });
    }
  }, [interactions, suggestion, isPending]);

  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // We can set a timeout to prevent it from showing again for a while
  };

  const moodEmojis: Record<Mood, string> = {
    Focus: '🎯',
    Relax: '🌙',
    Bored: '👀',
    Sad: '😢',
  };

  return (
    <AnimatePresence>
      {isVisible && suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-md rounded-lg border bg-accent/20 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Wand2 className="h-5 w-5 text-accent-foreground" />
              <p className="text-sm font-medium text-accent-foreground">
                Looks like it's time to{' '}
                <span className="font-bold">{suggestion}</span>{' '}
                {moodEmojis[suggestion]}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAccept}>
                Accept
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                aria-label="Dismiss suggestion"
                className="px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
