"use client";

import { SiteHeader } from "@/components/site-header";
import { usePositions } from "@/lib/query/position.query";

import { PositionCards } from "./_components/cards.position";

export default function PositionPage() {
  const { data: allPositions } = usePositions();

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PositionCards positions={allPositions?.data} />
          </div>
        </div>
      </div>
    </>
  );
}
