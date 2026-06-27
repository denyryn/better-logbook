import { z } from "zod";

export const positionSchema = z.object({
  role: z
    .string()
    .min(1, "Role is required")
    .max(100, "Role must be less than 100 characters"),
  spaceId: z.string().min(1, "Space is required"),
});

export type PositionFormData = z.infer<typeof positionSchema>;
