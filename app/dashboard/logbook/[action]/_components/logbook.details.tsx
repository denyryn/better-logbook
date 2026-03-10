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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Logbook Details</CardTitle>
          </div>

          <div className="flex gap-4">
            <Button
              variant="default"
              size="sm"
              disabled={isPending}
              onClick={handleProduceDetails}
              className="h-8 w-8 p-0"
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
              className="h-8 w-8 p-0"
            >
              <ChevronIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Create a new logbook entry for your work activities
        </CardDescription>
      </CardHeader>
      {!isDetailsCollapsed && (
        <CardContent className="flex flex-col gap-6">
          <Field>
            <FieldLabel htmlFor="title">Title (Optional)</FieldLabel>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Sprint Planning Meeting"
              {...register("title")}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="logDate">
                <Calendar className="mr-1 inline h-4 w-4" />
                Date
              </FieldLabel>
              <Input id="logDate" type="date" {...register("logDate")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="project">
                <Briefcase className="mr-1 inline h-4 w-4" />
                Project
              </FieldLabel>
              <Select
                value={watch("projectId") || ""}
                onValueChange={(value) => setValue("projectId", value)}
              >
                <SelectTrigger id="project">
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
            <FieldLabel htmlFor="tags">
              <Tag className="mr-1 inline h-4 w-4" />
              Tags
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                id="tags"
                type="text"
                placeholder="Add a tag..."
                {...register("newTag")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="hover:bg-secondary/80 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </Field>
        </CardContent>
      )}
    </Card>
  );
}
