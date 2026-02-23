"use client";

import {
  IconTrendingDown,
  IconArrowUpRight,
  IconPlus,
  IconArrowRight,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpaceDialog } from "./dialog.space";
import { useCompany } from "@/app/_providers/resources/company.provider";
import { useEffect } from "react";

export function SectionCards() {
  const { companies, getCompanies } = useCompany();

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <SpaceDialog>
        <Card className="@container/card cursor-pointer transition-all border-2 border-dashed border-primary/30 hover:border-primary/60 hover:shadow-md h-full">
          <CardHeader>
            <CardDescription>Add Space</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <IconPlus className="size-12" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Create new space <IconArrowRight className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Organize your work and projects
            </div>
          </CardFooter>
        </Card>
      </SpaceDialog>

      {companies.map((company) => (
        <Card
          key={company.id}
          className="@container/card cursor-pointer transition-all hover:shadow-md h-full group"
        >
          <CardHeader>
            <CardDescription>Space</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {company.name}
            </CardTitle>
            <CardAction>
              <IconArrowUpRight className="group-hover:scale-125 transition-transform" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Has {company.projects.length} projects
            </div>
            <div className="text-muted-foreground">
              Acquisition needs attention
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
