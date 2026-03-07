import { useAi } from "@/app/_providers/ai/ai.provider";
import { Button } from "@/components/ui/components/ui/button";
import { Input } from "@/components/ui/components/ui/input";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Logbook } from "@/generated/prisma/client";
import { useCreateLogbook } from "@/lib/query/logbook.query";
import { useProjects } from "@/lib/query/project.query";
import { QuickCreateFormData, quickCreateSchema } from "@/schemas/quick-create";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface QuickCreateFormDialogProps {
  onSuccess?: () => void;
}

export function QuickCreateFormDialog({ onSuccess }: QuickCreateFormDialogProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm({
    resolver: zodResolver(quickCreateSchema),
    mode: "onBlur",
  });

  const { state: aiState, improveLogbookText, produceLogbookDetails, response } = useAi();
  const { data: allProjects, isLoading: isProjectsLoading } = useProjects();
  const { mutateAsync: createLogbook, isPending: isCreateLogbookPending } = useCreateLogbook();

  async function inferenceLogbookCreation(data: QuickCreateFormData) {
    const inferencedData: Partial<Logbook & {tags: string[]}> = { ...data };

    inferencedData.logDate = new Date();

    const [improvedText, logbookDetails] = await Promise.all([
      improveLogbookText(data.content),
      produceLogbookDetails(data.content)
    ]);

    inferencedData.title = logbookDetails?.data?.title;
    inferencedData.tags = logbookDetails?.data?.tags;
    inferencedData.content = improvedText.data;

    console.log("Inferenced Data:", inferencedData);
    await createLogbook(inferencedData)
  }

  const onSubmit = async (data: QuickCreateFormData) => {
    try {
      await inferenceLogbookCreation(data)
      reset();
      toast.success("Logbook entry created successfully.")
      onSuccess?.();
    } catch (error) {
      console.error("Error creating:", error);
      toast.error("Failed to create logbook entry. Please try again")
    }
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Quick Create</DialogTitle>
          <DialogDescription>
            Create a new logbook entry quickly.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field className="space-y-1">
            <FieldLabel htmlFor="projectId" >
              Project
            </FieldLabel>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                  <SelectTrigger >
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {allProjects?.data.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.projectId && (
              <FieldDescription className="text-destructive text-sm font-medium">
                {errors.projectId.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field className="space-y-1">
            <FieldLabel htmlFor="content" >
              Content
            </FieldLabel>
            <Textarea
              id="content"
              placeholder="Write your log entry here..."
              {...register("content")}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.content && (
              <FieldDescription className="text-destructive text-sm font-medium">
                {errors.content.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild disabled={isSubmitting}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {isSubmitting
            ? <Button type="submit" disabled>Create <LoaderCircle className="animate-spin" /></Button>
            : <Button type="submit">Create</Button>
          }
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
