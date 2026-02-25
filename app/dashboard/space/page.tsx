"use client";

import { SiteHeader } from "@/components/site-header";
import { useCompanies } from "@/lib/query/company.query";

import { SpaceCards } from "./_components/cards.space";

export default function Page() {
  const { data: allCompanies } = useCompanies();

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SpaceCards spaces={allCompanies?.data} />
          </div>
        </div>
      </div>
    </>
  );
}
