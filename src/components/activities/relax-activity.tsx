'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause, Youtube } from 'lucide-react';
import Image from 'next/image';
import YoutubePlayerCard from '../youtube-player-card';
import type { VideoSuggestion } from '@/ai/flows/youtube-video-suggester';

const relaxVideos: VideoSuggestion[] = [
    { youtubeId: '8O-1qB-fxjc', title: 'Peaceful Relaxation', description: 'Calming music for stress relief and meditation.' },
    { youtubeId: '1ZYbU82GVz4', title: 'Relaxing Sleep Music', description: 'Deep sleeping music for insomnia.' },
    { youtubeId: 'jLjDDcLz2ek', title: 'Beautiful Nature', description: 'A 4K visual journey with relaxing music.' },
    { youtubeId: 'YRJ6xoiRcpQ', title: 'Gentle Rain Sounds', description: 'Rainforest sounds for sleeping and relaxation.' },
];


export default function RelaxActivity() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoSuggestion | null>(null);

  useEffect(() => {
    // Select a random video on component mount
    setSelectedVideo(relaxVideos[Math.floor(Math.random() * relaxVideos.length)]);
  }, []);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Wind className="h-6 w-6" /> Time to Meditate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full">
              <Image 
                  src="https://images.unsplash.com/photo-1520769945061-0a448c463865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx5b2dhJTIwbmF0dXJlfGVufDB8fHx8MTc2ODA0Mzc4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Meditation"
                  fill
                  className="object-cover rounded-md"
                  data-ai-hint="yoga nature"
              />
              <audio ref={audioRef} src="/meditation.mp3" onEnded={() => setIsPlaying(false)} />
          </div>
          <p className="text-muted-foreground">
            Find a comfortable position and focus on your breath.
          </p>
          <Button onClick={togglePlayback}>
            {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isPlaying ? 'Pause Meditation' : 'Start Guided Meditation'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Youtube className="h-6 w-6" /> Suggested for you
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedVideo && <YoutubePlayerCard video={selectedVideo} />}
        </CardContent>
      </Card>
    </div>
  );
}
