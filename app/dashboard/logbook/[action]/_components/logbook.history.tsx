"use client";

import {
  IconCalendar,
  IconClock,
  IconFolder,
  IconTag,
} from "@tabler/icons-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogbooks } from "@/lib/query/logbook.query";
import { useProjects } from "@/lib/query/project.query";

type LogbookTag = {
  tagId: string;
  tag?: {
    name: string;
  };
};

export function LogbookHistory() {
  const { data: allLogbooks, isLoading } = useLogbooks();
  const { data: allProjects } = useProjects();

  const getProjectName = (projectId: string) => {
    const project = allProjects?.data.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRelativeTime = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return formatDate(date);
  };

  const getContentPreview = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  };

  if (isLoading) {
    return (
      <div className="border border-[#000]">
        <div className="border-b border-[#000] bg-white px-3 py-1.5">
          <span className="font-helvetica text-sm font-bold">Recent Entries</span>
        </div>
        <div className="space-y-4 p-4 font-serif text-sm" style={{ backgroundColor: 'var(--tint-sky)' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 border-b border-[#000] pb-4 last:border-0">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!allLogbooks || allLogbooks?.data.length === 0) {
    return (
      <div className="border border-[#000]">
        <div className="border-b border-[#000] bg-white px-3 py-1.5">
          <span className="font-helvetica text-sm font-bold">Recent Entries</span>
        </div>
        <div className="flex flex-col items-center justify-center p-8 text-center font-serif text-sm" style={{ backgroundColor: 'var(--tint-sky)' }}>
          <div className="mb-4 border border-[#000] p-4">
            <IconClock className="size-8" />
          </div>
          <h3 className="mb-2 font-arial-black text-lg font-black">No entries yet</h3>
          <p className="text-xs">Start creating logbook entries to see your history here</p>
        </div>
      </div>
    );
  }

  const sortedLogbooks = [...allLogbooks.data].sort(
    (a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime(),
  );

  return (
    <div className="border border-[#000]">
      <div className="border-b border-[#000] bg-white px-3 py-1.5">
        <span className="flex items-center gap-2 font-helvetica text-sm font-bold">
          <IconClock className="size-4" />
          Recent Entries
        </span>
        <p className="font-serif text-xs">{allLogbooks.data.length} {allLogbooks.data.length === 1 ? "entry" : "entries"} in your logbook</p>
      </div>
      <div className="space-y-4 p-4 font-serif text-sm" style={{ backgroundColor: 'var(--tint-sky)' }}>
        {sortedLogbooks.slice(0, 10).map((logbook) => {
          const logbookWithTags = logbook;
          const hasTags =
            logbookWithTags.tags && logbookWithTags.tags.length > 0;

          return (
            <Link
              key={logbook.id}
              href={`/dashboard/logbook/edit?id=${logbook.id}`}
              className="group block"
            >
              <div className="space-y-3 border border-[#000] bg-white p-4 transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {logbook.title && (
                      <h4 className="font-helvetica text-sm font-bold">
                        {logbook.title}
                      </h4>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <IconCalendar className="size-3.5" />
                        <span>{formatDate(logbook.logDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IconFolder className="size-3.5" />
                        <span>{getProjectName(logbook.projectId)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs whitespace-nowrap">
                    {getRelativeTime(logbook.createdAt)}
                  </div>
                </div>

                {/* Content Preview */}
                <p className="line-clamp-2 text-xs">
                  {getContentPreview(logbook.content)}
                </p>

                {/* Tags */}
                {hasTags && (
                  <div className="flex flex-wrap items-center gap-2">
                    <IconTag className="size-3.5" />
                    {logbookWithTags.tags!.slice(0, 3).map((logbookTag) => (
                      <Badge
                        key={logbookTag.tagId}
                        variant="outline"
                        className="border-[#000] bg-white text-xs"
                      >
                        {logbookTag.tag?.name || "tag"}
                      </Badge>
                    ))}
                    {logbookWithTags.tags!.length > 3 && (
                      <Badge variant="outline" className="border-[#000] bg-white text-xs">
                        +{logbookWithTags.tags!.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        {allLogbooks.data.length > 10 && (
          <div className="mt-6 text-center">
            <Link
              href="/dashboard/logbook"
              className="text-[#0000ee] text-sm font-medium underline"
            >
              View all {allLogbooks.data.length} entries →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
