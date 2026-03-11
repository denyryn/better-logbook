import z from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().min(1, "Email is required"),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;
