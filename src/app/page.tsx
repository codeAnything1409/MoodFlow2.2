'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Mood, TimeOfDay } from '@/lib/types';
import { getTimeOfDay } from '@/lib/time';
import MoodSelector from '@/components/mood-selector';
import MoodSuggestion from '@/components/mood-suggestion';
import Header from '@/components/header';
import { useUserData } from '@/context/user-data-context';
import type { VideoSuggestion } from '@/ai/flows/youtube-video-suggester';
import { getVideoSuggestions } from '@/app/actions/suggest-videos';
import YoutubePlayerCard from '@/components/youtube-player-card';
import { Skeleton } from '@/components/ui/skeleton';
import FocusActivity from '@/components/activities/focus-activity';
import RelaxActivity from '@/components/activities/relax-activity';
import BoredActivity from '@/components/activities/bored-activity';
import SadActivity from '@/components/activities/sad-activity';

export default function Home() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');
  const [isClient, setIsClient] = useState(false);
  const [videoSuggestions, setVideoSuggestions] = useState<VideoSuggestion[]>([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const { addInteraction } = useUserData();

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    setIsClient(true);
  }, []);

  const handleMoodChange = async (newMood: Mood) => {
    setMood(newMood);
    setVideoSuggestions([]);
    if (newMood) {
      addInteraction({
        mood: newMood,
        timeOfDay,
        timestamp: new Date(),
      });
      setIsFetchingVideos(true);
      const suggestions = await getVideoSuggestions({ mood: newMood });
      if (suggestions) {
        setVideoSuggestions(suggestions.videos);
      }
      setIsFetchingVideos(false);
    }
  };

  const welcomeMessage = useMemo(() => {
    if (!isClient) return 'Welcome';
    return `Good ${timeOfDay}`;
  }, [isClient, timeOfDay]);

  const renderActivity = () => {
    if (!mood) return null;

    switch (mood) {
      case 'Focus':
        return <FocusActivity />;
      case 'Relax':
        return <RelaxActivity />;
      case 'Bored':
        return <BoredActivity />;
      case 'Sad':
        return <SadActivity />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-8 p-4 md:p-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl md:text-5xl font-headline">
              {welcomeMessage}
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Let's find the perfect content for your moment.
            </p>
          </div>

          <MoodSuggestion onAccept={handleMoodChange} />

          <MoodSelector selectedMood={mood} onMoodChange={handleMoodChange} />
          
          {mood && (
            <section className="w-full space-y-4">
               <h2 className="text-2xl font-bold text-center font-headline">
                Activity for You
              </h2>
              {renderActivity()}
            </section>
          )}

          {isFetchingVideos && (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {videoSuggestions.length > 0 && (
             <section className="w-full space-y-4">
              <h2 className="text-2xl font-bold text-center font-headline">
                For Your Mood...
              </h2>
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videoSuggestions.map((video) => (
                  <YoutubePlayerCard key={video.youtubeId} video={video} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
