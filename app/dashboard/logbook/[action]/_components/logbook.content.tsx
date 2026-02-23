import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../page";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAi } from "@/app/_providers/ai/ai.provider";

interface LogbookContentProps {
  form: UseFormReturn<FormData>;
}

export function LogbookContent({ form }: LogbookContentProps) {
  const { register, watch, setValue } = form;
  const { state, response } = useAi();
  const content = watch("content");
  const [activeTab, setActiveTab] = useState("edit");

  // Update content when AI improves it
  function handleUseImprovedText() {
    if (response) {
      setValue("content", response);
      toast.success("Applied improved text");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content</CardTitle>
        <CardDescription>
          Write your logbook entry. Use AI to improve your text.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-4">
            <Textarea
              disabled={state === "loading"}
              {...register("content")}
              placeholder="Describe what you worked on today..."
              className="min-h-75 resize-y"
            />
            {response && response !== content && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Improved Version
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUseImprovedText}
                  >
                    Use This
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-75 rounded-lg border bg-muted/30 p-4">
              {content ? (
                <p className="whitespace-pre-wrap text-sm">{content}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No content to preview. Start writing in the Edit tab.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
