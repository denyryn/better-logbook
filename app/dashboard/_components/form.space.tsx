"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateCompany } from "@/lib/query/company.query";
import { SpaceFormData, spaceSchema } from "@/schemas/space";
import { toast } from "sonner";

interface SpaceFormDialogProps {
  onSuccess?: () => void;
}

export function SpaceFormDialog({ onSuccess }: SpaceFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    mode: "onBlur",
  });

  const { mutateAsync: createCompany, isPending: isLoading } = useCreateCompany();

  const onSubmit = async (data: SpaceFormData) => {
    try {
      await createCompany({ name: data.name });
      reset();
      toast.success("Space created successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error creating space:", error);
      toast.error("Failed to create space. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup>
        <Field className="space-y-1">
          <FieldLabel htmlFor="name" >
            Space Name
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
  );
}
