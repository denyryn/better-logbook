import { User } from "@/generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/profile.api";
import { toast } from "sonner";

export function useUpdateProject() {
  return useMutation({
    mutationFn: (profileData: Partial<User>) => updateProfile(profileData),
    onSuccess: () => {
      toast.success("Profile updated successfully")
    },
    onError: () => {
      toast.error("Profile failed to update. Please try again later.")
    }
  });
}
