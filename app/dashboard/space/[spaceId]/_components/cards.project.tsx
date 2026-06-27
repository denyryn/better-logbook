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
        <Card className="@container/card h-full cursor-pointer border-2 border-dashed border-[#000]">
          <CardHeader>
            <CardDescription className="font-helvetica text-xs font-bold uppercase tracking-wide">Add Project</CardDescription>
            <CardTitle className="text-2xl font-arial-black font-black tabular-nums @[250px]/card:text-3xl">
              <IconPlus className="size-12" />
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 font-serif text-sm">
            <div className="line-clamp-1 flex gap-2 font-helvetica font-bold">
              Create new project <IconArrowRight className="size-4" />
            </div>
            <div className="font-serif">
              Organize your work and projects
            </div>
          </CardFooter>
        </Card>
      </ProjectDialog>

      {projects?.map((project, index) => (
        <Link key={project.id} href={`/dashboard/project/${project.id}`}>
          <Card className="group @container/card h-full cursor-pointer border-[#000]">
            <div className="border-b border-[#000] bg-white px-3 py-1.5">
              <span className="font-helvetica text-xs font-bold text-[#000]">Project</span>
            </div>
            <div className="px-4 py-3 font-serif text-sm" style={{ backgroundColor: index % 2 === 0 ? 'var(--tint-sage)' : 'var(--tint-salmon)' }}>
              <CardTitle className="text-2xl font-arial-black font-black mb-2">
                {project.name}
              </CardTitle>
              <div className="line-clamp-1 flex gap-2 font-helvetica text-xs font-bold">
                View project details <IconArrowRight className="size-4" />
              </div>
              <div className="text-xs">
                as {project.position.role}  @ {project.position.space.name}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
