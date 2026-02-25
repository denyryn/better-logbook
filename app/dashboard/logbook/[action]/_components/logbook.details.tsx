import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { useAi } from "@/app/_providers/ai/ai.provider";
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

interface LogbookDetailsProps {
  form: UseFormReturn<FormData>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  projects?: Project[];
}

export function LogbookDetails({
  form,
  newTag,
  setNewTag,
  projects,
}: LogbookDetailsProps) {
  const { state, produceLogbookDetails, response } = useAi();
  const { register, watch, setValue } = form;
  const tags = watch("tags");
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true);

  function handleAddTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
    );
  }

  function handleProduceDetails() {
    if (state === "loading") return;
    if (!watch("content").trim()) {
      toast.error("Please enter some content to generate details");
      return;
    }

    produceLogbookDetails(watch("content"));
  }

  useEffect(() => {
    if (!response?.logbookDetails) return;

    function applyProducedDetails() {
      if (!response?.logbookDetails) return;

      function setNewTagsFromResponse() {
        response?.logbookDetails?.tags?.forEach((tag: string) => {
          if (!tags.includes(tag)) {
            setValue("tags", [...watch("tags"), tag]);
          }
        });
      }

      setValue("title", response?.logbookDetails?.title);
      setNewTagsFromResponse();
    }

    applyProducedDetails();
  }, [response?.logbookDetails, setValue, watch, tags]);

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
              disabled={state === "loading"}
              onClick={handleProduceDetails}
              className="h-8 w-8 p-0"
            >
              <Sparkles className="h-4 w-4" />
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
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
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
            {tags.length > 0 && (
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
