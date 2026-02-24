"use client";

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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ProjectFormData, projectSchema } from "@/schemas/project";
import { useProject } from "@/app/_providers/resources/project.provider";
import { usePosition } from "@/app/_providers/resources/position.provider";

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

  const { addProject } = useProject();
  const { positions } = usePosition();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true);
      await addProject({
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
      <FieldGroup className="space-y-6">
        <Field className="space-y-3">
          <FieldLabel htmlFor="name" className="text-base font-semibold">
            Project Name
          </FieldLabel>
          <Input
            id="name"
            placeholder="e.g., Frontend Development, Marketing Team"
            {...register("name")}
            disabled={isSubmitting || isLoading}
            autoFocus
            className="h-12 text-base px-4"
          />
          {errors.name && (
            <FieldDescription className="text-destructive font-medium text-sm">
              {errors.name.message}
            </FieldDescription>
          )}
          {!errors.name && (
            <FieldDescription className="text-muted-foreground text-sm leading-relaxed">
              Choose a descriptive name for this project
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup className="space-y-6">
        <Field className="space-y-3">
          <FieldLabel htmlFor="scopedRole" className="text-base font-semibold">
            Scoped Role (Optional)
          </FieldLabel>
          <Input
            id="scopedRole"
            placeholder="e.g., Lead Developer, Technical Lead"
            {...register("scopedRole")}
            disabled={isSubmitting || isLoading}
            className="h-12 text-base px-4"
          />
          {errors.scopedRole && (
            <FieldDescription className="text-destructive font-medium text-sm">
              {errors.scopedRole.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup className="space-y-6">
        <Field className="space-y-3">
          <FieldLabel htmlFor="positionId" className="text-base font-semibold">
            Position
          </FieldLabel>
          <Controller
            name="positionId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-12 text-base px-4">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.role || "No Role"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.positionId && (
            <FieldDescription className="text-destructive font-medium text-sm">
              {errors.positionId.message}
            </FieldDescription>
          )}
          {!errors.positionId && (
            <FieldDescription className="text-muted-foreground text-sm leading-relaxed">
              Select the position this project belongs to
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 h-12 text-base font-semibold"
        >
          {isSubmitting || isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
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
