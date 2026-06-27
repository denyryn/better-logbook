import { LoaderCircle, Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateLogbook, useUpdateLogbook } from "@/lib/query/logbook.query";

import { FormData } from "../page";
import { useSearchParams } from "next/navigation";

interface SidebarProps {
  form: UseFormReturn<FormData>;
  isEditPage: boolean;
}

export function Sidebar({ form, isEditPage }: SidebarProps) {
  const searchParams = useSearchParams();
  const logbookId = searchParams.get("id") || undefined;

  const { watch } = form;
  const formData = watch();

  const { mutateAsync: createLogbook, isPending: isCreatingLogbook } = useCreateLogbook();
  const { mutateAsync: updateLogbook, isPending: isUpdatingLogbook } = useUpdateLogbook(logbookId)

  async function handleSave() {
    if (!formData?.content?.trim()) {
      toast.error("Log content is required before saving");
      return;
    }
    if (!formData.projectId) {
      toast.error("Select a project to associate this entry with");
      return;
    }
    try {
      const logbookData = {
        ...formData,
        logDate: new Date(formData.logDate),
      };

      if (isEditPage) await updateLogbook(logbookData);
      else await createLogbook(logbookData);

      form.reset();
    } catch (err) {
      console.error("Failed to save logbook. Error: ", err)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border">
        <div className="border-b border-border bg-card px-2 py-1">
          <span className="font-helvetica text-sm font-bold">Actions</span>
        </div>
        <div className="flex flex-col gap-3 p-3 font-serif text-sm">
          {isCreatingLogbook || isUpdatingLogbook
            ? <Button onClick={handleSave} className="w-full border-border bg-primary text-primary-foreground" disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Saving...
            </Button>
            : <Button onClick={handleSave} className="w-full border-border bg-primary text-primary-foreground hover:bg-primary">
                <Save className="mr-2 h-4 w-4" />
                Save
            </Button>
          }
        </div>
      </div>

      <div className="border border-border">
        <div className="border-b border-border bg-card px-2 py-1">
          <span className="font-helvetica text-sm font-bold">Tips</span>
        </div>
        <div className="p-3 font-serif text-sm">
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Describe tasks and impact, not just activity</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Note blockers, risks, and decisions made</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Document key discussions and stakeholder input</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Use AI to sharpen clarity and professionalism</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
