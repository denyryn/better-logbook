import { Loader2, LoaderCircle, Save, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateLogbook } from "@/lib/query/logbook.query";

import { FormData } from "../page";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api.response";

interface SidebarProps {
  form: UseFormReturn<FormData>;
  improveLogbookText: UseMutateAsyncFunction<ApiResponse<string>, Error, string, unknown>
  isPending: boolean;
}

export function Sidebar({ form, improveLogbookText, isPending }: SidebarProps) {
  const { mutateAsync: createLogbook, isPending: isCreatingLogbook } = useCreateLogbook();
  const { watch } = form;
  const formData = watch();

  async function handleSave() {
    if (!formData.content.trim()) {
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
      await createLogbook(logbookData);
      toast.success("Logbook saved successfully!");
      form.reset();
    } catch {
      toast.error("Failed to save logbook");
    }
  }

  async function improveText() {
    if (!formData.content.trim()) {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
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
                 disabled={!formData.content.trim()}
                 className="w-full"
                 variant="outline"
               >
                 <Sparkles className="mr-2 h-4 w-4" />
                 Improve with AI
               </Button>
          }

          {isCreatingLogbook
            ? <Button onClick={handleSave} className="w-full" disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Saving Entry
            </Button>
            : <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Entry
            </Button>
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Be specific about tasks and outcomes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Include any blockers or challenges</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Mention collaborations and meetings</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use AI to enhance clarity and professionalism</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
