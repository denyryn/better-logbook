"use client";

import { SiteHeader } from "@/components/site-header";
import { useState } from "react";
import { LogbookDetails } from "./_components/logbook.details";
import { LogbookContent } from "./_components/logbook.content";
import { Sidebar } from "./_components/sidebar";
import { Logbook } from "@/generated/prisma/client";

export type FormData = Omit<
  Logbook,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "userId"
> & {
  tags: string[];
};

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    logDate: new Date(),
    positionId: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  return (
    <>
      <SiteHeader name="Create Logbook Entry" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              {/* Main Content Area */}
              <div className="flex flex-col gap-6">
                {/* Logbook Details */}
                <LogbookDetails
                  formData={formData}
                  setFormData={setFormData}
                  newTag={newTag}
                  setNewTag={setNewTag}
                />

                {/* Logbook Content */}
                <LogbookContent formData={formData} setFormData={setFormData} />

                {/* Logbook Histories */}
              </div>

              {/* Sidebar Actions */}
              <Sidebar formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
