"use client";

import { useLogbook } from "@/app/_providers/resources/logbook.provider";
import { useProject } from "@/app/_providers/resources/project.provider";
import { useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCalendar,
  IconClock,
  IconFolder,
  IconTag,
} from "@tabler/icons-react";
import Link from "next/link";
import { Logbook } from "@/generated/prisma/client";

type LogbookTag = {
  tagId: string;
  tag?: {
    name: string;
  };
};

type LogbookWithTags = Logbook & {
  tags?: LogbookTag[];
};

export function LogbookHistory() {
  const { logbooks, isLoading, getLogbooks } = useLogbook();
  const { projects, getProjects } = useProject();

  const fetchData = useCallback(() => {
    getLogbooks();
    getProjects();
  }, [getLogbooks, getProjects]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
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

  if (!logbooks || logbooks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your logbook history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <IconClock className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No entries yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Start creating logbook entries to see your history here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedLogbooks = [...logbooks].sort(
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
          {logbooks.length} {logbooks.length === 1 ? "entry" : "entries"} in
          your logbook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedLogbooks.slice(0, 10).map((logbook) => {
            const logbookWithTags = logbook as LogbookWithTags;
            const hasTags =
              logbookWithTags.tags && logbookWithTags.tags.length > 0;

            return (
              <Link
                key={logbook.id}
                href={`/dashboard/logbook/edit?id=${logbook.id}`}
                className="group block"
              >
                <div className="border rounded-lg p-4 hover:shadow-md hover:border-primary/50 transition-all duration-200 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {logbook.title && (
                        <h4 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {logbook.title}
                        </h4>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {getRelativeTime(logbook.createdAt)}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {getContentPreview(logbook.content)}
                  </p>

                  {/* Tags - Optional, only show if available */}
                  {hasTags && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <IconTag className="size-3.5 text-muted-foreground" />
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

        {logbooks.length > 10 && (
          <div className="mt-6 text-center">
            <Link
              href="/dashboard/logbook"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all {logbooks.length} entries →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
