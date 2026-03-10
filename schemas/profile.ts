import z from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  phone: z.string().regex(/^\+?[0-9]{8,15}$/).optional().nullable()
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;
