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
import { PositionWithRelations } from "@/types/prisma/positions";

import { PositionDialog } from "../../space/[spaceId]/_components/dialog.position";

interface PositionCardsProps {
  positions: PositionWithRelations[] | undefined;
}

export function PositionCards({ positions }: PositionCardsProps) {
  if (!positions) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <PositionDialog>
        <Card className="@container/card h-full cursor-pointer border-2 border-dashed border-[#000]">
          <CardHeader>
            <CardDescription className="font-helvetica text-xs font-bold uppercase tracking-wide">Add Position</CardDescription>
            <CardTitle className="text-2xl font-arial-black font-black tabular-nums @[250px]/card:text-3xl">
              <IconPlus className="size-12" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 font-serif text-sm">
            <div className="line-clamp-1 flex gap-2 font-helvetica font-bold">
              Create new position <IconArrowRight className="size-4" />
            </div>
            <div className="font-serif">
              Organize your work and positions
            </div>
          </CardFooter>
        </Card>
      </PositionDialog>

      {positions?.map((position) => (
        <Link key={position.id} href={`/dashboard/space/${position.spaceId}?position=${position.id}`}>
          <Card className="group @container/card h-full cursor-pointer border-[#000]">
            <div className="border-b border-[#000] bg-white px-3 py-1.5">
              <span className="font-helvetica text-xs font-bold text-[#000]">Position</span>
            </div>
            <div className="px-4 py-3 font-serif text-sm" style={{ backgroundColor: 'var(--tint-periwinkle)' }}>
              <CardTitle className="text-2xl font-arial-black font-black mb-2">
                {position.role}
              </CardTitle>
              <div className="line-clamp-1 flex gap-2 font-helvetica text-xs font-bold">
                View position details <IconArrowRight className="size-4" />
              </div>
              <div className="text-xs">
                @ {position.space.name}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
