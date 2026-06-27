"use client";

import {
  IconArrowRight,
  IconArrowUpRight,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SpaceWithPositions } from "@/types/prisma/space";

import { SpaceDialog } from "../../_components/dialog.space";
import { cn } from "@/lib/utils";

export interface SpaceCardsSettings {
  overflow: "enable" | "disable";
}

interface SpaceCardsProps {
  spaces?: SpaceWithPositions[];
  settings?: SpaceCardsSettings;
}

export function SpaceCards({ spaces, settings }: SpaceCardsProps) {
  if (!spaces) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4", {
      "overflow-x-auto": settings?.overflow === "enable",
    })}>
      <SpaceDialog>
        <Card className="border-border group @container/card h-full cursor-pointer border-2 border-dashed py-3 gap-3">
          <CardHeader className="px-3 py-0">
            <CardDescription className="font-helvetica text-sm font-bold uppercase tracking-wide">New Space</CardDescription>
            <CardTitle className="text-xl font-arial-black font-black tabular-nums @[250px]/card:text-2xl">
              <IconPlus className="size-8" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 px-3 py-0 font-serif text-sm">
            <div className="line-clamp-1 flex gap-2 font-helvetica font-bold text-sm">
              Set up a new workspace <IconArrowRight className="size-3" />
            </div>
            <div className="text-foreground font-serif text-sm">
              Track and manage your work
            </div>
          </CardFooter>
        </Card>
      </SpaceDialog>

      {spaces?.map((space, index) => (
        <Link key={space.id} href={`/dashboard/space/${space.id}`}>
          <Card className="group @container/card h-full cursor-pointer border-border py-0 gap-0">
            <div className="border-b border-border bg-card px-2 py-1">
              <span className="font-helvetica text-sm font-bold text-foreground uppercase tracking-wider">Space</span>
            </div>
            <div className="px-2 py-3 font-serif text-sm">
              <CardTitle className="text-3xl font-arial-black font-black leading-tight mb-1">
                {space.name}
              </CardTitle>
              <div className="line-clamp-1 flex gap-2 font-helvetica text-xs font-bold text-muted-foreground">
                {space.positions.length} position{space.positions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
