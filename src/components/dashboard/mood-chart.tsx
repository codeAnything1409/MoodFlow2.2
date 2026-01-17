'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type MoodChartProps = {
  data: { mood: string; count: number }[];
};

const chartConfig = {
  count: {
    label: 'Count',
  },
  Focus: {
    label: 'Focus',
    color: 'hsl(var(--chart-1))',
  },
  Relax: {
    label: 'Relax',
    color: 'hsl(var(--chart-2))',
  },
  Bored: {
    label: 'Bored',
    color: 'hsl(var(--chart-3))',
  },
  Sad: {
    label: 'Sad',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;


export default function MoodChart({ data }: MoodChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis
            dataKey="mood"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                indicator="dot" 
            />}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
