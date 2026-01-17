import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle } from 'lucide-react';

export default function BoredActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Puzzle className="h-6 w-6" /> Feeling Bored? Let's Play!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-muted-foreground">
          Challenge your mind with a game.
        </p>
        <Link href="/games">
          <Button>Play Games</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
