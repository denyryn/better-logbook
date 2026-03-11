import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKey } from "../constants/query-key.constant";
import { createPasskey, deletePasskey, deleteSession, getPasskeys, getSessions } from "../client/auth";
import { toast } from "sonner";
import { signOut, signUpWithEmail, signInWithEmail } from "@/lib/client/auth";
import { UserLogin, UserSignUp } from "@/types/user";

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

export function useSessions() {
  return useQuery({
    queryKey: [queryKey.SESSIONS],
    queryFn: async () => getSessions()
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tokenId: string) => deleteSession(tokenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.SESSIONS] });
      toast.success("Session successfully deleted")
    }
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (credentials: UserLogin) => signInWithEmail(credentials),
    onSuccess: () => {
      toast.success("Signed in successfully")
    }
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (credentials: UserSignUp) => signUpWithEmail(credentials),
    onSuccess: () => {
      toast.success("Signed up successfully")
    }
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => signOut(),
    onSuccess: () => {
      toast.success("Signed out successfully")
    }
  });
}
