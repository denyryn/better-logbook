import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../page";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/generated/prisma/client";

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Logbook Details</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isDetailsCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
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
                <Calendar className="inline h-4 w-4 mr-1" />
                Date
              </FieldLabel>
              <Input id="logDate" type="date" {...register("logDate")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="project">
                <Briefcase className="inline h-4 w-4 mr-1" />
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
              <Tag className="inline h-4 w-4 mr-1" />
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
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
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
