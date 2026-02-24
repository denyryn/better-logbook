"use client";

import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";

import data from "./data.json";
import { SpaceCards } from "@/app/dashboard/space/_components/cards.space";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { useCompanies } from "@/lib/query/company.query";

export default function Page() {
  const { data: allCompanies } = useCompanies();
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SpaceCards spaces={allCompanies?.data} />
            {/* <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div> */}
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
