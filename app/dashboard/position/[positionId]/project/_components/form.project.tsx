"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePositions } from "@/lib/query/position.query";
import { useCreateProject } from "@/lib/query/project.query";
import { ProjectFormData, projectSchema } from "@/schemas/project";
import { LoaderCircle } from "lucide-react";

interface ProjectFormDialogProps {
  onSuccess?: () => void;
}

export function ProjectFormDialog({ onSuccess }: ProjectFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onBlur",
  });

  const { mutate: createProject } = useCreateProject();
  const { data: allPositions } = usePositions();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true);
      createProject({
        name: data.name,
        scopedRole: data.scopedRole,
        positionId: data.positionId,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup>
        <Field className="space-y-1">
          <FieldLabel htmlFor="name" >
            Project Name
          </FieldLabel>
          <Input
            id="name"
            placeholder="e.g., Frontend Development, Marketing Team"
            {...register("name")}
            disabled={isSubmitting || isLoading}
            autoFocus
          />
          {errors.name && (
            <FieldDescription className="text-destructive">
              {errors.name.message}
            </FieldDescription>
          )}
          {!errors.name && (
            <FieldDescription className="text-muted-foreground ">
              Choose a descriptive name for this project
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field className="space-y-1">
          <FieldLabel htmlFor="scopedRole" >
            Scoped Role (Optional)
          </FieldLabel>
          <Input
            id="scopedRole"
            placeholder="e.g., Lead Developer, Technical Lead"
            {...register("scopedRole")}
            disabled={isSubmitting || isLoading}
          />
          {errors.scopedRole && (
            <FieldDescription className="text-destructive">
              {errors.scopedRole.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field className="space-y-1">
          <FieldLabel htmlFor="positionId" >
            Position
          </FieldLabel>
          <Controller
            name="positionId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger >
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {allPositions?.data.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {`${position.role} @ ${position.company.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.positionId && (
            <FieldDescription className="text-destructive">
              {errors.positionId.message}
            </FieldDescription>
          )}
          {!errors.positionId && (
            <FieldDescription className="text-muted-foreground">
              Select the position this project belongs to
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="flex gap-3 justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 text-base font-semibold"
        >
          {isSubmitting || isLoading ? (
            <>
              <LoaderCircle className="mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
}
