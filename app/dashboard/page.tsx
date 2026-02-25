"use client";

import { SpaceCards } from "@/app/dashboard/space/_components/cards.space";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanies } from "@/lib/query/company.query";
import { useLogbooks } from "@/lib/query/logbook.query";

import { LogbookDataTable } from "./project/[projectId]/_components/data-table.logbook";

export default function Page() {
  const { data: allCompanies } = useCompanies();
  const { data: allLogbooks, isLoading: isLogbookLoading } = useLogbooks();

  function RenderDataTable() {
    if (isLogbookLoading) {
      return (
        <div className="flex flex-col gap-3 px-4 lg:px-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }
    return <LogbookDataTable data={allLogbooks?.data} />;
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SpaceCards spaces={allCompanies?.data} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            {RenderDataTable()}
          </div>
        </div>
      </div>
    </>
  );
}
