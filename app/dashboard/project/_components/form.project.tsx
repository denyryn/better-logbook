import { Button } from "@/components/ui/components/ui/button";
import { Input } from "@/components/ui/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePositions } from "@/lib/query/position.query";
import { useCreateProject } from "@/lib/query/project.query";
import { ProjectFormData, projectSchema } from "@/schemas/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProjectFormDialogProps {
  onSuccess?: () => void;
}

export function ProjectFormDialog({ onSuccess }: ProjectFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onBlur",
  });

  const { mutateAsync: createProject, isPending: isLoading } = useCreateProject();
  const {data: allPositions } = usePositions();

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject(data);
      reset();
      toast.success("Project created successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
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
            <FieldDescription className="text-destructive text-sm font-medium">
              {errors.name.message}
            </FieldDescription>
          )}
          {!errors.name && (
            <FieldDescription className="text-muted-foreground text-sm leading-relaxed">
              Choose a descriptive name for this space
            </FieldDescription>
          )}
        </Field>

        <FieldGroup>
          <Field className="space-y-1">
            <FieldLabel htmlFor="positionId" className="text-base font-semibold">
              Position at Company
            </FieldLabel>
            <Controller
              name="positionId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger >
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPositions?.data.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.role} @ {position.company.name}
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
                Select the company or space for this position
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </FieldGroup>

      <div className="flex gap-3 justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 text-base font-semibold"
        >
          {isSubmitting || isLoading ? (
            <>
              <LoaderCircle className="mr-2 animate-spin" size={16} />
              Creating...
            </>
          ) : (
            "Create Space"
          )}
        </Button>
      </div>
    </form>
  )
}
