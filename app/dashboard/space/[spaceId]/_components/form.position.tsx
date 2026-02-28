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
import { useCompanies } from "@/lib/query/company.query";
import { useCreatePosition } from "@/lib/query/position.query";
import { PositionFormData, positionSchema } from "@/schemas/position";
import { LoaderCircle } from "lucide-react";

interface PositionFormDialogProps {
  onSuccess?: () => void;
}

export function PositionFormDialog({ onSuccess }: PositionFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
    mode: "onBlur",
  });

  const { mutateAsync: createPosition } = useCreatePosition();
  const { data: allSpaces } = useCompanies();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: PositionFormData) => {
    try {
      setIsLoading(true);
      await createPosition({
        companyId: data.companyId,
        positionData: data,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup>
        <Field className="space-y-1">
          <FieldLabel htmlFor="role" className="text-base font-semibold">
            Role
          </FieldLabel>
          <Input
            id="role"
            placeholder="e.g., Senior Developer, Project Manager"
            {...register("role")}
            disabled={isSubmitting || isLoading}
          />
          {errors.role && (
            <FieldDescription className="text-destructive">
              {errors.role.message}
            </FieldDescription>
          )}
          {!errors.role && (
            <FieldDescription className="text-muted-foreground">
              Enter the role title for this position
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field className="space-y-1">
          <FieldLabel htmlFor="companyId" className="text-base font-semibold">
            Company / Space
          </FieldLabel>
          <Controller
            name="companyId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger >
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {allSpaces?.data.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.companyId && (
            <FieldDescription className="text-destructive">
              {errors.companyId.message}
            </FieldDescription>
          )}
          {!errors.companyId && (
            <FieldDescription className="text-muted-foreground">
              Select the company or space for this position
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="flex gap-3">
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
            "Create Position"
          )}
        </Button>
      </div>
    </form>
  );
}
