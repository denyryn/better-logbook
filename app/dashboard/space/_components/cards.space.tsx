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

const TINT_VARS = [
  "var(--tint-sage)",
  "var(--tint-salmon)",
  "var(--tint-peach)",
  "var(--tint-lime)",
  "var(--tint-sky)",
  "var(--tint-periwinkle)",
  "var(--tint-steel)",
  "var(--tint-olive)",
];

function getTintBg(index: number) {
  return TINT_VARS[index % TINT_VARS.length];
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
        <Card className="border-[#000] group @container/card h-full cursor-pointer border-2 border-dashed">
          <CardHeader>
            <CardDescription className="font-helvetica text-xs font-bold uppercase tracking-wide">Add Space</CardDescription>
            <CardTitle className="text-2xl font-arial-black font-black tabular-nums @[250px]/card:text-3xl">
              <IconPlus className="size-12" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm font-serif">
            <div className="line-clamp-1 flex gap-2 font-helvetica font-bold">
              Create new space <IconArrowRight className="size-4" />
            </div>
            <div className="text-[#000] font-serif">
              Organize your work and projects
            </div>
          </CardFooter>
        </Card>
      </SpaceDialog>

      {spaces?.map((space, index) => (
        <Link key={space.id} href={`/dashboard/space/${space.id}`}>
          <Card className="group @container/card h-full cursor-pointer border-[#000]">
            <div className="border-b border-[#000] bg-white px-3 py-1.5">
              <span className="font-helvetica text-xs font-bold text-[#000]">Space</span>
            </div>
            <div className="px-4 py-3 font-serif text-sm" style={{ backgroundColor: getTintBg(index) }}>
              <CardTitle className="text-2xl font-arial-black font-black tabular-nums @[250px]/card:text-3xl mb-2">
                {space.name}
              </CardTitle>
              <div className="line-clamp-1 flex gap-2 font-helvetica text-xs font-bold">
                {space.positions.length} position{space.positions.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs font-serif">
                Keep it moving
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
