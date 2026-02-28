"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ProjectFormDialog } from "./form.project";

export function ProjectDialog({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <SheetHeader className="space-y-1 border-b px-4 py-6">
            <SheetTitle >
              Create New Project
            </SheetTitle>
            <SheetDescription >
              Add a new project to organize your logbook entries and tasks
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <ProjectFormDialog onSuccess={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
