'use client';

import { useState } from 'react';
import Header from '@/components/header';
import XOGame from '@/components/games/xo-game';
import SnakesAndLaddersGame from '@/components/games/snakes-ladders-game';
import MemoryMatchGame from '@/components/games/memory-match-game';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Game = 'xo' | 'snakes-and-ladders' | 'memory-match';

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<Game>('xo');
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl font-headline">
              Game Zone
            </h1>
            <p className="text-muted-foreground">
              A little fun to break the boredom.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Game)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="xo">Tic-Tac-Toe</TabsTrigger>
              <TabsTrigger value="snakes-and-ladders">Snakes & Ladders</TabsTrigger>
              <TabsTrigger value="memory-match">Memory Match</TabsTrigger>
            </TabsList>
            <TabsContent value="xo">
              <XOGame />
            </TabsContent>
            <TabsContent value="snakes-and-ladders">
              <SnakesAndLaddersGame />
            </TabsContent>
            <TabsContent value="memory-match">
              <MemoryMatchGame />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
