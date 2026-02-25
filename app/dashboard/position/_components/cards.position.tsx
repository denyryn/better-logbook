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
import { PositionWithRelations } from "@/types/prisma/positions";

import { PositionDialog } from "../../space/[spaceId]/_components/dialog.position";

interface PositionCardsProps {
  positions: PositionWithRelations[] | undefined;
}

export function PositionCards({ positions }: PositionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <PositionDialog>
        <Card className="border-primary/30 hover:border-primary/60 @container/card h-full cursor-pointer border-2 border-dashed transition-all hover:shadow-md">
          <CardHeader>
            <CardDescription>Add Position</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <IconPlus className="size-12" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Create new position <IconArrowRight className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Organize your work and positions
            </div>
          </CardFooter>
        </Card>
      </PositionDialog>

      {positions?.map((position) => (
        <Link key={position.id} href={`/dashboard/position/${position.id}`}>
          <Card className="group @container/card h-full cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <CardDescription>Position</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {position.role}
              </CardTitle>
              <CardAction>
                <IconArrowUpRight className="transition-transform group-hover:scale-125" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                View position details <IconArrowRight className="size-4" />
              </div>
              <div className="text-muted-foreground">
                @ {position.company.name}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
