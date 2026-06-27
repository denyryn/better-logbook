"use client";

import {
  IconArrowRight,
  IconArrowUpRight,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";

import { ProjectDialog } from "@/app/dashboard/project/_components/dialog.project";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectWithRelations } from "@/types/prisma/project";

interface ProjectCardsProps {
  projects?: ProjectWithRelations[];
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
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <ProjectDialog>
        <Card className="@container/card h-full cursor-pointer border-2 border-dashed border-border py-3 gap-3">
          <CardHeader className="px-3 py-0">
            <CardDescription className="font-helvetica text-sm font-bold uppercase tracking-wide">New Project</CardDescription>
            <CardTitle className="text-xl font-arial-black font-black tabular-nums @[250px]/card:text-2xl">
              <IconPlus className="size-8" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 px-3 py-0 font-serif text-sm">
            <div className="line-clamp-1 flex gap-2 font-helvetica font-bold text-sm">
              Start a new project <IconArrowRight className="size-3" />
            </div>
            <div className="font-serif text-sm">
              Manage your deliverables
            </div>
          </CardFooter>
        </Card>
      </ProjectDialog>

      {projects?.map((project, index) => (
        <Link key={project.id} href={`/dashboard/project/${project.id}`}>
          <Card className="group @container/card h-full cursor-pointer border-border py-0 gap-0">
            <div className="border-b border-border bg-card px-2 py-1">
              <span className="font-helvetica text-sm font-bold text-foreground uppercase tracking-wider">Project</span>
            </div>
            <div className="px-2 py-3 font-serif text-sm">
              <CardTitle className="text-3xl font-arial-black font-black leading-tight mb-1">
                {project.name}
              </CardTitle>
              <div className="line-clamp-1 flex gap-2 font-helvetica text-xs font-bold text-muted-foreground">
                {project.position.role}  @ {project.position.space.name}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
