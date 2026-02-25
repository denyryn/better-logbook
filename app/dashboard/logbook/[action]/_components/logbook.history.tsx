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
import { Logbook } from "@/generated/prisma/client";
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your logbook history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 border-b pb-4 last:border-0">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!allLogbooks || allLogbooks?.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your logbook history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <IconClock className="text-muted-foreground size-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No entries yet</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              Start creating logbook entries to see your history here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedLogbooks = [...allLogbooks.data].sort(
    (a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconClock className="size-5" />
          Recent Entries
        </CardTitle>
        <CardDescription>
          {allLogbooks.data.length}{" "}
          {allLogbooks.data.length === 1 ? "entry" : "entries"} in your logbook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                <div className="hover:border-primary/50 space-y-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-md">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {logbook.title && (
                        <h4 className="group-hover:text-primary line-clamp-1 text-base font-semibold transition-colors">
                          {logbook.title}
                        </h4>
                      )}
                      <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
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
                    <div className="text-muted-foreground text-xs whitespace-nowrap">
                      {getRelativeTime(logbook.createdAt)}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {getContentPreview(logbook.content)}
                  </p>

                  {/* Tags - Optional, only show if available */}
                  {hasTags && (
                    <div className="flex flex-wrap items-center gap-2">
                      <IconTag className="text-muted-foreground size-3.5" />
                      {logbookWithTags.tags!.slice(0, 3).map((logbookTag) => (
                        <Badge
                          key={logbookTag.tagId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {logbookTag.tag?.name || "tag"}
                        </Badge>
                      ))}
                      {logbookWithTags.tags!.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{logbookWithTags.tags!.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {allLogbooks.data.length > 10 && (
          <div className="mt-6 text-center">
            <Link
              href="/dashboard/logbook"
              className="text-primary text-sm font-medium hover:underline"
            >
              View all {allLogbooks.data.length} entries →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
