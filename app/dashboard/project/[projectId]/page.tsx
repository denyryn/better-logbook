"use client";

import { SiteHeader } from "@/components/site-header";
import { useParams } from "next/navigation";

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
        </div>
      </div>
    </>
  );
}
