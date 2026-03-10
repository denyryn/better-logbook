import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKey } from "../constants/query-key.constant";
import { createPasskey, deletePasskey, getPasskeys } from "../client/auth";
import { toast } from "sonner";

export function usePasskeys() {
  return useQuery({
    queryKey: [queryKey.PASSKEYS],
    queryFn: async () => getPasskeys(),
  });
}

export function useCreatePasskey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => createPasskey(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.PASSKEYS] });
      toast.success("Passkey successfully created")
    },
    onError: (error) => {
      console.error("Error creating passkey : " + error.message)
      toast.error("Error creating passkey. " + error.message)
    }
  });
}

export function useDeletePasskey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (passkeyId: string) => deletePasskey(passkeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.PASSKEYS] });
    }
  });
}
