'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VideoSuggestion } from '@/ai/flows/youtube-video-suggester';

type YoutubePlayerCardProps = {
  video: VideoSuggestion;
};

export default function YoutubePlayerCard({ video }: YoutubePlayerCardProps) {
  const videoSrc = `https://www.youtube.com/embed/${video.youtubeId}`;
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <iframe
            src={videoSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-bold font-headline">{video.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{video.description}</p>
      </CardContent>
    </Card>
  );
}
