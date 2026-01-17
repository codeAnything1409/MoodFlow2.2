'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BellRing, BellOff, ListTodo, Youtube } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TodoList from '@/components/todo-list';
import YoutubePlayerCard from '../youtube-player-card';
import type { VideoSuggestion } from '@/ai/flows/youtube-video-suggester';

const focusVideos: VideoSuggestion[] = [
    { youtubeId: 'oPVte6aMprI', title: 'Deep Focus Music', description: '4-Hour study music for concentration.' },
    { youtubeId: '0w80F8FffQ4', title: 'Lofi Hip Hop Radio', description: 'Beats to relax/study to.' },
    { youtubeId: '1_G60OdEzXs', title: 'Classical Music for Studying', description: 'The best classical music for reading, concentration.' },
    { youtubeId: 'qQzf-xzZO7M', title: 'Focus Music for Work and Studying', description: 'Ambient Music for concentration.' },
    { youtubeId: 'Rni7Fz7208c', title: 'Ambient Study Music to Concentrate', description: '24/7 background music for focus.' },
    { youtubeId: 'xAt1xcC6qfM', title: 'Productivity Music', description: 'A mix of ambient and electronic music to help you stay focused.' },
];


export default function FocusActivity() {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [ampm, setAmPm] = useState('AM');

  const [activeAlarm, setActiveAlarm] = useState<NodeJS.Timeout | null>(null);
  const [alarmSetTime, setAlarmSetTime] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoSuggestion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Select a random video on component mount
    setSelectedVideo(focusVideos[Math.floor(Math.random() * focusVideos.length)]);

    // Clear the timeout when the component unmounts
    return () => {
      if (activeAlarm) {
        clearTimeout(activeAlarm);
      }
    };
  }, [activeAlarm]);

  const handleSetAlarm = () => {
    if (!hour || !minute) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Please enter both hour and minute values.',
      });
      return;
    }

    const numHour = parseInt(hour, 10);
    const numMinute = parseInt(minute, 10);

    if (isNaN(numHour) || isNaN(numMinute) || numHour < 1 || numHour > 12 || numMinute < 0 || numMinute > 59) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Please enter a valid time (1-12 for hours, 0-59 for minutes).',
      });
      return;
    }

    let hours24 = numHour;
    if (ampm === 'PM' && numHour < 12) {
      hours24 += 12;
    }
    if (ampm === 'AM' && numHour === 12) { // Midnight case
      hours24 = 0;
    }
    
    const now = new Date();
    const alarmDate = new Date();
    alarmDate.setHours(hours24, numMinute, 0, 0);

    // If the selected time is in the past for today, schedule it for tomorrow
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    
    const delay = alarmDate.getTime() - now.getTime();
    
    const formattedHour = String(numHour).padStart(2, '0');
    const formattedMinute = String(numMinute).padStart(2, '0');
    const displayTime = `${formattedHour}:${formattedMinute} ${ampm}`;

    const alarmTimeout = setTimeout(() => {
      let audio: HTMLAudioElement | null = null;
      let stopTimeout: NodeJS.Timeout | null = null;

      try {
        audio = new Audio('/alarm.mp3');
        audio.loop = true;
        audio.play().catch(e => console.error("Error playing audio:", e));

        toast({
          title: "Time's up!",
          description: "Your focus session has ended.",
        });

        stopTimeout = setTimeout(() => {
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
          handleClearAlarm(false); // Silently clear the alarm after it rings
        }, 15000); // Stop after 15 seconds
      
      } catch (e) {
        console.error("Could not play alarm sound", e);
        handleClearAlarm(false);
      }
    }, delay);

    setActiveAlarm(alarmTimeout);
    setAlarmSetTime(displayTime);

    toast({
      title: 'Alarm Set!',
      description: `Your alarm is set for ${displayTime}.`,
    });
  };

  const handleClearAlarm = (showToast = true) => {
    if (activeAlarm) {
      clearTimeout(activeAlarm);
      setActiveAlarm(null);
      setAlarmSetTime(null);
      setHour('');
      setMinute('');
      setAmPm('AM');
      if (showToast) {
        toast({
          title: 'Alarm Cleared!',
          description: 'Your alarm has been turned off.',
        });
      }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <BellRing className="h-6 w-6" /> Set a Focus Alarm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Stay on track. Set an alarm to keep your focus sharp.
          </p>
          <div className="flex w-full flex-col sm:flex-row items-end gap-2">
              <div className="grid w-full sm:w-auto flex-1 gap-1.5">
                <Label htmlFor="hour">Time</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="hour"
                    type="number"
                    placeholder="HH"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    disabled={!!activeAlarm}
                    min="1"
                    max="12"
                  />
                  <span>:</span>
                  <Input
                    id="minute"
                    type="number"
                    placeholder="MM"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    disabled={!!activeAlarm}
                    min="0"
                    max="59"
                  />
                  <Select value={ampm} onValueChange={setAmPm} disabled={!!activeAlarm}>
                      <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
              </div>
              {activeAlarm ? (
                  <Button variant="destructive" onClick={() => handleClearAlarm(true)} className="w-full mt-2 sm:mt-0 sm:w-auto">
                  <BellOff className="mr-2" />
                  Clear Alarm
                  </Button>
              ) : (
                  <Button type="submit" onClick={handleSetAlarm} className="w-full mt-2 sm:mt-0 sm:w-auto">
                  Set Alarm
                  </Button>
              )}
          </div>
          {alarmSetTime && (
              <div className="text-sm text-muted-foreground pt-2">
                  Active alarm for <span className="font-bold text-foreground">{alarmSetTime}</span>
              </div>
          )}
        </CardContent>
      </Card>
       <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <ListTodo className="h-6 w-6" /> Focus Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TodoList />
        </CardContent>
      </Card>
      <Card className="lg:col-span-1">
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
