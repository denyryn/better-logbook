"use client";

import { useState } from "react";

import { PositionFormDialog } from "@/app/dashboard/space/[spaceId]/_components/form.position";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PositionDialog({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <SheetHeader className="space-y-1 border-b px-6 py-8">
            <SheetTitle>
              Create New Position
            </SheetTitle>
            <SheetDescription>
              Add a new position to organize your work and projects
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <PositionFormDialog onSuccess={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
