"use client";

import { IconCalendarWeek, IconClock } from "@tabler/icons-react";
import { format, isAfter, isThisMonth, startOfDay, subDays } from "date-fns";
import { useParams } from "next/navigation";
import * as React from "react";

import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogbooksByProject } from "@/lib/query/logbook.query";

import { LogbookDataTable } from "./_components/data-table.logbook";
import { LogbookStatCard } from "./_components/stat-card.logbook";

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: response, isLoading } = useLogbooksByProject(projectId);

  const entries = React.useMemo(() => response?.data ?? [], [response]);

  const sevenDaysAgo = React.useMemo(
    () => startOfDay(subDays(new Date(), 7)),
    [],
  );

  const stats = React.useMemo(() => {
    const total = entries.length;
    const thisWeek = entries.filter((e) =>
      isAfter(e.logDate, sevenDaysAgo),
    ).length;
    const thisMonth = entries.filter((e) => isThisMonth(e.logDate)).length;
    const lastEntry = entries.length
      ? format(
          new Date(
            Math.max(...entries.map((e) => new Date(e.logDate).getTime())),
          ),
          "MMM d, yyyy",
        )
      : "—";
    return { total, thisWeek, thisMonth, lastEntry };
  }, [entries, sevenDaysAgo]);

  function RenderDataTable() {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-3 px-4 lg:px-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }

    return <LogbookDataTable data={entries} projectId={projectId} />;
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* ── Stats ── */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-4">
              <LogbookStatCard
                title="Past 7 Days"
                value={stats.thisWeek}
                description="Entries in the last week"
                icon={IconCalendarWeek}
                loading={isLoading}
              />
              <LogbookStatCard
                title="This Month"
                value={stats.thisMonth}
                description="Entries this calendar month"
                icon={IconClock}
              />
            </div>

            {RenderDataTable()}
          </div>
        </div>
      </div>
    </>
  );
}
