import { Sparkles } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { useAi } from "@/app/_providers/ai/ai.provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { FormData } from "../page";

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
      setValue("content", response.improvedText as string);
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
            {response?.improvedText && response.improvedText !== content && (
              <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="text-primary h-4 w-4" />
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
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {response.improvedText}
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="preview">
            <div className="bg-muted/30 min-h-75 rounded-lg border p-4">
              {content ? (
                <p className="text-sm whitespace-pre-wrap">{content}</p>
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
