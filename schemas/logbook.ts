import { z } from "zod";

export const logbookSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content cannot be empty"),
  logDate: z.string().datetime("Invalid date format"),
  projectId: z.string().min(1, "Project is required"),
  tags: z.array(z.string()).min(0, "Tags must be an array of strings"),
});
