import z from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  phone: z.number()
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;
