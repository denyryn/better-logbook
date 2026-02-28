"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PositionWithRelations } from "@/types/prisma/positions";

interface PositionTabsListProps {
  positions?: PositionWithRelations[] | undefined;
}

export function PositionTabsList({ positions }: PositionTabsListProps) {
  if (!positions) {
    return <Skeleton className="h-8 w-sm" />;
  }

  return (
    <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
      <TabsTrigger value="all">All</TabsTrigger>

      {positions?.map((position) => (
        <TabsTrigger key={position.id} value={position.id}>
          {position.role}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
