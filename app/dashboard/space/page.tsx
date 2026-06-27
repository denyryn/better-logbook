"use client";

import { SiteHeader } from "@/components/site-header";
import { useSpaces } from "@/lib/query/space.query";

import { SpaceCards } from "./_components/cards.space";

export default function Page() {
  const { data: allSpaces } = useSpaces();

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <h1 className="sr-only">Spaces</h1>
            <SpaceCards spaces={allSpaces?.data} />
          </div>
        </div>
      </div>
    </>
  );
}
