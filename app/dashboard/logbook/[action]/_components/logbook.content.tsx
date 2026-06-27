import { Sparkles } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

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
    <div className="border border-[#000]">
      <div className="border-b border-[#000] bg-white px-3 py-1.5">
        <span className="font-helvetica text-sm font-bold">Content</span>
        <p className="font-serif text-xs">
          Write your logbook entry. Use AI to improve your text.
        </p>
      </div>
      <div className="p-4 font-serif text-sm" style={{ backgroundColor: 'var(--tint-sky)' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 border-[#000] bg-white">
            <TabsTrigger value="edit" className="data-[state=active]:bg-[#000] data-[state=active]:text-white">Edit</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-[#000] data-[state=active]:text-white">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-4">
            <Textarea
              disabled={isPending}
              {...register("content")}
              placeholder="Describe what you worked on today..."
              className="min-h-75 resize-y border-[#000] bg-white"
            />
            {improvedText && improvedText !== content && (
              <div className="border border-[#000] bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-helvetica text-xs font-bold">
                    <Sparkles className="h-4 w-4" />
                    AI Improved Version
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#000]"
                    onClick={handleUseImprovedText}
                  >
                    Use This
                  </Button>
                </div>
                <p className="font-serif text-sm whitespace-pre-wrap">
                  {improvedText}
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-75 border border-[#000] bg-white p-4">
              {content ? (
                <p className="font-serif text-sm whitespace-pre-wrap">{content}</p>
              ) : (
                <p className="font-serif text-xs">
                  No content to preview. Start writing in the Edit tab.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
