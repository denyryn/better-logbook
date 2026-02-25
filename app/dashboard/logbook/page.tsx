"use client";

import { useMemo } from "react";

import { SiteHeader } from "@/components/site-header";
import { useLogbooks } from "@/lib/query/logbook.query";

import { LogbookDataTable } from "../project/[projectId]/_components/data-table.logbook";

export default function Page() {
  const { data: allLogbooks } = useLogbooks();
  const entries = useMemo(() => allLogbooks?.data ?? [], [allLogbooks]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <LogbookDataTable data={entries} />
          </div>
        </div>
      </div>
    </>
  );
}
