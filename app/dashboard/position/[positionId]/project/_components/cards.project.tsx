"use client";

import {
  IconArrowRight,
  IconArrowUpRight,
  IconPlus,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/generated/prisma/client";

import { ProjectDialog } from "./dialog.project";

interface ProjectCardsProps {
  projects: Project[] | undefined;
}

export function ProjectCards({ projects }: ProjectCardsProps) {
  if (!projects) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <ProjectDialog>
        <Card className="border-primary/30 hover:border-primary/60 @container/card h-full cursor-pointer border-2 border-dashed transition-all hover:shadow-md">
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

      {projects.map((project) => (
        <Card
          key={project.id}
          className="group @container/card h-full cursor-pointer transition-all hover:shadow-md"
        >
          <CardHeader>
            <CardDescription>Space</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {project.name}
            </CardTitle>
            <CardAction>
              <IconArrowUpRight className="transition-transform group-hover:scale-125" />
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
      ))}
    </div>
  );
}
