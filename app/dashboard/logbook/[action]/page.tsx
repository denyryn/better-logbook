"use client";

import { SiteHeader } from "@/components/site-header";
import { useState } from "react";
import { LogbookDetails } from "./_components/logbook.details";
import { LogbookContent } from "./_components/logbook.content";
import { Sidebar } from "./_components/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logbookSchema } from "@/schemas/logbook";
import z from "zod";
import { LogbookHistory } from "./_components/logbook.history";
import { useProjects } from "@/lib/query/project.query";

export type FormData = z.infer<typeof logbookSchema>;

export default function Page() {
  const form = useForm<FormData>({
    resolver: zodResolver(logbookSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      content: "",
      logDate: new Date().toISOString().split("T")[0],
      projectId: "",
      tags: [],
    },
  });

  const [newTag, setNewTag] = useState("");
  const { data: allProjects } = useProjects();

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
                  form={form}
                  newTag={newTag}
                  setNewTag={setNewTag}
                  projects={allProjects?.data}
                />

                {/* Logbook Content */}
                <LogbookContent form={form} />

                {/* Logbook Histories */}
                <LogbookHistory />
              </div>

              {/* Sidebar Actions */}
              <Sidebar form={form} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
