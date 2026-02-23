import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../page";
import { useAi } from "@/app/_providers/ai/ai.provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Sparkles } from "lucide-react";
import { useLogbook } from "@/app/_providers/resources/logbook.provider";

interface SidebarProps {
  form: UseFormReturn<FormData>;
}

export function Sidebar({ form }: SidebarProps) {
  const { state, improve } = useAi();
  const { addLogbook } = useLogbook();
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
      await addLogbook(logbookData);
      toast.success("Logbook saved successfully!");
    } catch {
      toast.error("Failed to save logbook");
    }
  }

  async function improveText() {
    if (!formData.content.trim()) {
      toast.error("Please enter some content to improve");
      return;
    }
    await improve(formData.content);
  }
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={improveText}
            disabled={state === "loading" || !formData.content.trim()}
            className="w-full"
            variant="outline"
          >
            {state === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Improve with AI
              </>
            )}
          </Button>

          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Entry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
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
