"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { SiteHeader } from "@/components/site-header";
import { useProjects } from "@/lib/query/project.query";
import { logbookSchema } from "@/schemas/logbook";

import { LogbookContent } from "./_components/logbook.content";
import { LogbookDetails } from "./_components/logbook.details";
import { LogbookHistory } from "./_components/logbook.history";
import { Sidebar } from "./_components/sidebar";
import { useImproveText } from "@/lib/query/ai-generate.query";
import { useSearchParams } from "next/navigation";
import { format, formatISO } from "date-fns";
import { useLogbookById } from "@/lib/query/logbook.query";
import { useEffect } from "react";

export type FormData = z.infer<typeof logbookSchema>;

export default function Page() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || undefined;
  const logbookId = searchParams.get("id") || undefined;

  const today = formatISO(new Date(), { representation: "date" });
  const { data: logbook } = useLogbookById(logbookId)

  const form = useForm<FormData>({
    resolver: zodResolver(logbookSchema),
    mode: "onSubmit",
    defaultValues: { logDate: today, projectId: projectId },
  });

  const { data: allProjects } = useProjects();
  const { mutateAsync: improveLogbookText, data: improvedText, isPending } = useImproveText();

  useEffect(() => {
    if (logbook && logbook.data) form.reset({
      title: logbook.data.title || undefined,
      content: logbook.data.content,
      logDate: format(logbook.data.logDate, "yyyy-MM-dd"),
      projectId: logbook.data.projectId,
      tags: logbook.data.tags?.map((t) => t.tag.name),
    });
  }, [form, logbook])

  const isEditPage = !!logbookId;

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
                  projects={allProjects?.data}
                />

                {/* Logbook Content */}
                <LogbookContent form={form} improvedText={improvedText?.data} />

                {/* Logbook Histories */}
                <LogbookHistory />
              </div>

              {/* Sidebar Actions */}
              <Sidebar form={form} improveLogbookText={improveLogbookText} isPending={isPending} isEditPage={isEditPage} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
