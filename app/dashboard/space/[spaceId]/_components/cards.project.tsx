"use client";

import {
  IconArrowUpRight,
  IconPlus,
  IconArrowRight,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectDialog } from "@/app/dashboard/position/[positionId]/project/_components/dialog.project";
import { Project } from "@/generated/prisma/client";
import Link from "next/link";

interface ProjectCardsProps {
  projects?: Project[];
}

export function ProjectCards({ projects }: ProjectCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <ProjectDialog>
        <Card className="@container/card cursor-pointer transition-all border-2 border-dashed border-primary/30 hover:border-primary/60 hover:shadow-md h-full">
          <CardHeader>
            <CardDescription>Add Project</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <IconPlus className="size-12" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Create new project <IconArrowRight className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Organize your work and projects
            </div>
          </CardFooter>
        </Card>
      </ProjectDialog>

      {projects?.map((project) => (
        <Link key={project.id} href={`/dashboard/project/${project.id}`}>
          <Card className="@container/card cursor-pointer transition-all hover:shadow-md h-full group">
            <CardHeader>
              <CardDescription>Project</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {project.name}
              </CardTitle>
              <CardAction>
                <IconArrowUpRight className="group-hover:scale-125 transition-transform" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                View project details <IconArrowRight className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Acquisition needs attention
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
