import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be less than 100 characters"),
  scopedRole: z
    .string()
    .min(2, "Scoped role must be at least 2 characters")
    .optional(),
  positionId: z.string().min(1, "Position is required"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
