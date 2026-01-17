import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

export default function SadActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Music className="h-6 w-6" /> Uplifting Music
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Sometimes a good song is all you need. Here are some music video suggestions to lift your spirits. Check them out below.
        </p>
      </CardContent>
    </Card>
  );
}
