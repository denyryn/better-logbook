"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import { IconHome, IconChevronRight } from "@tabler/icons-react";

const formatSegment = (segment: string): string => {
  // Handle URL parameters like [id], [action]
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return segment.slice(1, -1);
  }

  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getSegmentLabel = (
  segment: string,
  index: number,
  segments: string[],
): string => {
  // Custom labels for specific routes
  const customLabels: Record<string, string> = {
    logbook: "Logbook",
    dashboard: "Dashboard",
    space: "Spaces",
    create: "Create",
    edit: "Edit",
    view: "View",
  };

  const lowerSegment = segment.toLowerCase();
  return customLabels[lowerSegment] || formatSegment(segment);
};

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Don't show breadcrumb on home page
  if (segments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="flex-1">
      <BreadcrumbList className="text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <IconHome className="size-4" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = getSegmentLabel(segment, index, segments);

          return (
            <Fragment key={href}>
              <BreadcrumbSeparator>
                <IconChevronRight className="size-4 text-muted-foreground" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
