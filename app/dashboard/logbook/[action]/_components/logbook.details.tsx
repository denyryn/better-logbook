import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  LoaderCircle,
  Sparkles,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/generated/prisma/client";

import { FormData } from "../page";
import { useProduceLogbookDetails } from "@/lib/query/ai-generate.query";

interface LogbookDetailsProps {
  form: UseFormReturn<FormData>;
  projects?: Project[];
}

export function LogbookDetails({
  form,
  projects,
}: LogbookDetailsProps) {
  const {mutateAsync: produceLogbookDetails, data: producedLogbookDetails, isPending} = useProduceLogbookDetails();
  const { register, watch, setValue } = form;
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true);

  const tags = watch("tags");

  function handleAddTag() {
    const tags = form.watch("tags");
    const newTag = form.watch("newTag");

    if (newTag?.trim() && !form.getValues("tags").includes(newTag.trim())) {
      form.setValue("tags", [...tags, newTag.trim()])
      form.setValue("newTag", "")
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
    );
  }

  function handleProduceDetails() {
    if (isPending) return;
    if (!watch("content").trim()) {
      toast.error("Please enter some content to generate details");
      return;
    }

    produceLogbookDetails(watch("content"));
  }

  useEffect(() => {
    if (!producedLogbookDetails?.data) return;

    function applyProducedDetails() {
      if (!producedLogbookDetails?.data) return;

      function setNewTagsFromResponse() {
        const tags = form.getValues("tags") || [];
        producedLogbookDetails?.data.tags?.forEach((tag: string) => {
          if (!tags?.includes(tag)) {
            setValue("tags", [...tags, tag]);
          }
        });
      }

      setValue("title", producedLogbookDetails.data.title);
      setNewTagsFromResponse();
    }

    applyProducedDetails();
  }, [producedLogbookDetails?.data, setValue, watch, tags]);

  const ChevronIcon = isDetailsCollapsed ? ChevronDown : ChevronUp;

  return (
    <div className="border border-[#000]">
      <div className="flex items-center justify-between border-b border-[#000] bg-white px-3 py-1.5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span className="font-helvetica text-sm font-bold">Logbook Details</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleProduceDetails}
            className="h-11 w-11 border-[#000] p-0"
          >
            {isPending
              ? <LoaderCircle className="h-4 w-4 animate-spin" />
              : <Sparkles className="h-4 w-4" />
            }
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
            className="h-11 w-11 p-0"
          >
            <ChevronIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!isDetailsCollapsed && (
        <div className="flex flex-col gap-6 p-4 font-serif text-sm" style={{ backgroundColor: 'var(--tint-salmon)' }}>
          <Field>
            <FieldLabel htmlFor="title" className="font-helvetica text-xs font-bold">Title (Optional)</FieldLabel>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Sprint Planning Meeting"
              className="border-[#000] bg-white"
              {...register("title")}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="logDate" className="font-helvetica text-xs font-bold">
                <Calendar className="mr-1 inline h-4 w-4" />
                Date
              </FieldLabel>
              <Input id="logDate" type="date" className="border-[#000] bg-white" {...register("logDate")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="project" className="font-helvetica text-xs font-bold">
                <Briefcase className="mr-1 inline h-4 w-4" />
                Project
              </FieldLabel>
              <Select
                value={watch("projectId") || ""}
                onValueChange={(value) => setValue("projectId", value)}
              >
                <SelectTrigger id="project" className="border-[#000] bg-white">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="tags" className="font-helvetica text-xs font-bold">
              <Tag className="mr-1 inline h-4 w-4" />
              Tags
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                id="tags"
                type="text"
                placeholder="Add a tag..."
                className="border-[#000] bg-white"
                {...register("newTag")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" className="border-[#000]" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="inline-flex items-center border border-[#000] bg-white px-2 py-0.5 text-xs font-medium cursor-pointer"
                    aria-label={`Remove tag ${tag}`}
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            )}
          </Field>
        </div>
      )}
    </div>
  );
}
