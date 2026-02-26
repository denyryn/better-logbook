"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

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

  const { mutateAsync: createCompany } = useCreateCompany();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SpaceFormData) => {
    try {
      setIsLoading(true);
      await createCompany({ name: data.name });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating space:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup className="space-y-6">
        <Field className="space-y-3">
          <FieldLabel htmlFor="name" className="text-base font-semibold">
            Space Name
          </FieldLabel>
          <Input
            id="name"
            placeholder="e.g., Frontend Development, Marketing Team"
            {...register("name")}
            disabled={isSubmitting || isLoading}
            autoFocus
            className="h-12 px-4 text-base"
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

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="h-12 flex-1 text-base font-semibold"
        >
          {isSubmitting || isLoading ? (
            <>
              <span className="mr-2 animate-spin">⏳</span>
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
