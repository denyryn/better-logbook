import { z } from "zod";

export const spaceSchema = z.object({
  name: z
    .string()
    .min(1, "Space name is required")
    .min(2, "Space name must be at least 2 characters")
    .max(100, "Space name must be less than 100 characters"),
});

export type SpaceFormData = z.infer<typeof spaceSchema>;
