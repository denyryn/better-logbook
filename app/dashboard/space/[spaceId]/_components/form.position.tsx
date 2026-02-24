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
import { positionSchema, PositionFormData } from "@/schemas/position";
import { usePosition } from "@/app/_providers/resources/position.provider";
import { useCompany } from "@/app/_providers/resources/company.provider";
import { useState } from "react";

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

  const { addPosition } = usePosition();
  const { companies } = useCompany();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: PositionFormData) => {
    try {
      setIsLoading(true);
      await addPosition({
        role: data.role || null,
        companyId: data.companyId,
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
      <FieldGroup className="space-y-6">
        <Field className="space-y-3">
          <FieldLabel htmlFor="role" className="text-base font-semibold">
            Role
          </FieldLabel>
          <Input
            id="role"
            placeholder="e.g., Senior Developer, Project Manager"
            {...register("role")}
            disabled={isSubmitting || isLoading}
            className="h-12 text-base px-4"
          />
          {errors.role && (
            <FieldDescription className="text-destructive font-medium text-sm">
              {errors.role.message}
            </FieldDescription>
          )}
          {!errors.role && (
            <FieldDescription className="text-muted-foreground text-sm leading-relaxed">
              Enter the role title for this position
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup className="space-y-6">
        <Field className="space-y-3">
          <FieldLabel htmlFor="companyId" className="text-base font-semibold">
            Company / Space
          </FieldLabel>
          <Controller
            name="companyId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-12 text-base px-4">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.companyId && (
            <FieldDescription className="text-destructive font-medium text-sm">
              {errors.companyId.message}
            </FieldDescription>
          )}
          {!errors.companyId && (
            <FieldDescription className="text-muted-foreground text-sm leading-relaxed">
              Select the company or space for this position
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
            "Create Position"
          )}
        </Button>
      </div>
    </form>
  );
}
