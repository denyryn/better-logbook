import { Loader2, LoaderCircle, Save, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateLogbook, useUpdateLogbook } from "@/lib/query/logbook.query";

import { FormData } from "../page";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api.response";
import { useSearchParams } from "next/navigation";

interface SidebarProps {
  form: UseFormReturn<FormData>;
  improveLogbookText: UseMutateAsyncFunction<ApiResponse<string>, Error, string, unknown>
  isPending: boolean;
  isEditPage: boolean;
}

export function Sidebar({ form, improveLogbookText, isPending, isEditPage }: SidebarProps) {
  const searchParams = useSearchParams();
  const logbookId = searchParams.get("id") || undefined;

  const { watch } = form;
  const formData = watch();

  const { mutateAsync: createLogbook, isPending: isCreatingLogbook } = useCreateLogbook();
  const { mutateAsync: updateLogbook, isPending: isUpdatingLogbook } = useUpdateLogbook(logbookId)

  async function handleSave() {
    if (!formData?.content?.trim()) {
      toast.error("Please enter logbook content");
      return;
    }
    if (!formData.projectId) {
      toast.error("Please select a project");
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

  async function improveText() {
    if (!formData?.content?.trim()) {
      toast.error("Please enter some content to improve");
      return;
    }
    await improveLogbookText(formData.content);
  }

  const improveButtonProperty = {
    loading: {
      icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
      text: "Improving...",
    },
    default: {
      icon: <Sparkles className="mr-2 h-4 w-4" />,
      text: "Improve with AI",
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-[#000]">
        <div className="border-b border-[#000] bg-white px-3 py-1.5">
          <span className="font-helvetica text-sm font-bold">Actions</span>
        </div>
        <div className="flex flex-col gap-3 p-4 font-serif text-sm" style={{ backgroundColor: 'var(--tint-periwinkle)' }}>
          {isPending
            ? <Button
                onClick={improveText}
                disabled
                className="w-full"
                variant="outline"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Improving...
              </Button>
             : <Button
                 onClick={improveText}
                 disabled={!formData?.content?.trim()}
                 className="w-full border-[#000]"
                 variant="outline"
               >
                 <Sparkles className="mr-2 h-4 w-4" />
                 Improve with AI
               </Button>
          }

          {isCreatingLogbook || isUpdatingLogbook
            ? <Button onClick={handleSave} className="w-full border-[#000] bg-[#000] text-white" disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Saving Entry
            </Button>
            : <Button onClick={handleSave} className="w-full border-[#000] bg-[#000] text-white hover:bg-[#000]">
                <Save className="mr-2 h-4 w-4" />
                Save Entry
            </Button>
          }
        </div>
      </div>

      <div className="border border-[#000]">
        <div className="border-b border-[#000] bg-white px-3 py-1.5">
          <span className="font-helvetica text-sm font-bold">Tips</span>
        </div>
        <div className="p-4 font-serif text-sm" style={{ backgroundColor: 'var(--tint-lime)' }}>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Be specific about tasks and outcomes</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Include any blockers or challenges</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Mention collaborations and meetings</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>Use AI to enhance clarity and professionalism</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
