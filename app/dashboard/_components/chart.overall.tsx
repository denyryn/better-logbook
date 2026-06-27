import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  logbook: {
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface OverallChartProps {
  data:
    | {
        date: string;
        logbook: number;
      }[]
    | undefined;
  isLoading?: boolean;
}

export function OverallChart({ data, isLoading }: OverallChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  if (isLoading) {
    <Skeleton className="aspect-auto h-[250px] w-full" />;
  }

  const filteredData = data?.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card mx-4 border-[#000] lg:mx-6">
      <div className="border-b border-[#000] bg-white px-3 py-1.5">
        <span className="font-helvetica text-sm font-bold">Overall Productivity</span>
        <p className="font-serif text-xs">
          Overall for the last 3 months
        </p>
      </div>
      <div className="p-4 font-serif text-sm" style={{ backgroundColor: 'var(--tint-sage)' }}>
        <div className="mb-4 flex items-center justify-between">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d" className="border-[#000] data-[state=on]:bg-[#000] data-[state=on]:text-white">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="border-[#000] data-[state=on]:bg-[#000] data-[state=on]:text-white">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="border-[#000] data-[state=on]:bg-[#000] data-[state=on]:text-white">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 border-[#000] **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#000]">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillLogbook" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-logbook)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-logbook)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#000" />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={36}
              domain={[0, "dataMax + 2"]}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={16}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="logbook"
              type="natural"
              fill="url(#fillLogbook)"
              stroke="var(--color-logbook)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
