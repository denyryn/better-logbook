import { Sparkles } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
// Card imports unused — content uses flat div pattern
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { FormData } from "../page";

interface LogbookContentProps {
  form: UseFormReturn<FormData>;
  improvedText?: string;
  isPending?: boolean;
}

export function LogbookContent({ form, improvedText, isPending }: LogbookContentProps) {
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
        <p className="font-serif text-xs">
          Document your work. AI can help refine your writing.
        </p>
      </div>
      <div className="p-3 font-serif text-xs">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 border-border bg-card">
            <TabsTrigger value="edit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Edit</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-3">
            <Textarea
              disabled={isPending}
              {...register("content")}
              placeholder="Detail your accomplishments, decisions, and next steps..."
              className="min-h-75 resize-y border-border bg-card"
            />
            {improvedText && improvedText !== content && (
              <div className="border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-helvetica text-xs font-bold">
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
                <p className="font-serif text-xs">
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
