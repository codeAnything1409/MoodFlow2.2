'use client';
import { useState, useEffect, useTransition } from 'react';
import Header from '@/components/header';
import { useUserData } from '@/context/user-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getInsights } from '@/app/actions/insights';
import type { InsightsAndAnalyticsDashboardOutput } from '@/ai/flows/insights-and-analytics-dashboard';
import { Loader2, Lightbulb, BarChart2 } from 'lucide-react';
import StatsCard from '@/components/dashboard/stats-card';
import MoodChart from '@/components/dashboard/mood-chart';
import { moods as allMoods } from '@/lib/types';

export default function DashboardPage() {
  const { interactions } = useUserData();
  const [insights, setInsights] = useState<InsightsAndAnalyticsDashboardOutput | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleGenerateInsights = () => {
    if (interactions.length === 0) return;
    startTransition(async () => {
      const weeklyData = JSON.stringify(interactions);
      const result = await getInsights({ weeklyData, additionalContext });
      setInsights(result);
    });
  };

  useEffect(() => {
    // Automatically generate insights on first load if there's data
    if (interactions.length > 0 && !insights) {
      handleGenerateInsights();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactions]);

  const mostFrequentMood =
    insights?.summary
      .match(/most selected mood was (\w+)/)?.[1]
      .replace('.', '') ?? 'N/A';

  const mostFrequentContent =
    insights?.summary
      .match(/most consumed content type was (\w+)/)?.[1]
      .replace('.', '') ?? 'N/A';
      
  const moodCounts = allMoods.map(mood => ({
      mood,
      count: interactions.filter(i => i.mood === mood).length,
  }));

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl font-headline">
              Your Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Discover patterns in your moods and content consumption.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Generate New Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="context">Additional Context</Label>
                <Textarea
                  placeholder="e.g., I've been preparing for exams this week."
                  id="context"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Provide any extra context to help the AI generate more accurate insights.
                </p>
              </div>
              <Button onClick={handleGenerateInsights} disabled={isPending || interactions.length === 0}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Generating...' : 'Generate Insights'}
              </Button>
              {interactions.length === 0 && <p className='text-sm text-destructive'>No interaction data yet. Use the app to generate insights.</p>}
            </CardContent>
          </Card>

          {isPending && (
             <div className="flex justify-center items-center p-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
          )}

          {!isPending && insights && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatsCard title="Most Frequent Mood" value={mostFrequentMood} />
              <StatsCard title="Top Content Category" value={mostFrequentContent} />
              <StatsCard title="Total Interactions" value={interactions.length.toString()} />
            </div>
          )}
          
          {!isPending && insights && (
            <div className="grid gap-6 lg:grid-cols-5">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5" /> Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodChart data={moodCounts} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                      <h3 className="font-semibold">Summary</h3>
                      <p className="text-sm text-muted-foreground">{insights.summary}</p>
                  </div>
                  <div>
                      <h3 className="font-semibold">Key Insights</h3>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                          {insights.insights.map((insight, i) => <li key={i}>{insight}</li>)}
                      </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!isPending && !insights && interactions.length > 0 && (
             <div className="text-center py-12">
              <p className="text-muted-foreground">Click "Generate Insights" to see your weekly summary.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
