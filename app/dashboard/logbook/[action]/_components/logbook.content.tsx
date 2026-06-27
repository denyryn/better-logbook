import { Loader2, Sparkles } from "lucide-react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponse } from "@/lib/api.response";
import { FormData } from "../page";

interface LogbookContentProps {
  form: UseFormReturn<FormData>;
  improvedText?: string;
  isPending?: boolean;
  improveLogbookText?: UseMutateAsyncFunction<ApiResponse<string>, Error, string, unknown>;
}

export function LogbookContent({ form, improvedText, isPending, improveLogbookText }: LogbookContentProps) {
  const { register, watch, setValue } = form;
  const content = watch("content");
  const [activeTab, setActiveTab] = useState("edit");

  // Update content when AI improves it
  function handleUseImprovedText() {
    if (improvedText) {
      setValue("content", improvedText);
      toast.success("Applied improved text");
    }
  }

  return (
    <div className="border border-border">
      <div className="border-b border-border bg-card px-2 py-1">
        <span className="font-helvetica text-sm font-bold">Content</span>
        <p className="font-serif text-sm">
          Document your work. AI can help refine your writing.
        </p>
      </div>
      <div className="p-3 font-serif text-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 border-border bg-card">
            <TabsTrigger value="edit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Edit</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-3">
            <div className="relative">
              <Textarea
                disabled={isPending}
                {...register("content")}
                placeholder="Detail your accomplishments, decisions, and next steps..."
                className="min-h-75 resize-y border-border bg-card"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending || !form.watch("content")?.trim()}
                onClick={async () => {
                  const content = form.watch("content");
                  if (!content?.trim()) {
                    toast.error("Write some content first before polishing with AI");
                    return;
                  }
                  if (improveLogbookText) await improveLogbookText(content);
                }}
                className="absolute bottom-2 right-2 border-border"
              >
                {isPending
                  ? <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  : <Sparkles className="mr-1 h-3 w-3" />
                }
                {isPending ? "Improving..." : "Improve with AI"}
              </Button>
            </div>
            {improvedText && improvedText !== content && (
              <div className="border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-helvetica text-sm font-bold">
                    <Sparkles className="h-4 w-4" />
                    AI-suggested revision
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border"
                    onClick={handleUseImprovedText}
                  >
                    Apply
                  </Button>
                </div>
                <p className="font-serif text-sm whitespace-pre-wrap">
                  {improvedText}
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-75 border border-border bg-card p-4">
              {content ? (
                <p className="font-serif text-sm whitespace-pre-wrap">{content}</p>
              ) : (
                <p className="font-serif text-sm">
                  Nothing to preview yet. Write something in the editor above.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
