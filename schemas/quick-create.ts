import { z } from "zod";

export const quickCreateSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  content: z.string().min(1, "Content is required"),
});

export type QuickCreateFormData = z.infer<typeof quickCreateSchema>;
