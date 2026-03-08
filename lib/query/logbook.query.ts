import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Logbook } from "@/generated/prisma/client";

import {
  createLogbook,
  getLogbooks,
  getLogbooksByProject,
} from "../api/logbook.api";
import { toast } from "sonner";

export function useLogbooks() {
  return useQuery({
    queryKey: ["logbooks"],
    queryFn: () => getLogbooks(),
  });
}

export function useLogbooksByProject(projectId: string) {
  return useQuery({
    queryKey: ["logbooks", projectId],
    queryFn: () => getLogbooksByProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateLogbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logbookData: Partial<Logbook>) =>
      createLogbook(logbookData.projectId!, logbookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
    },
    onError: (error) => {
      console.error("Error creating logbook entry:", error);
      toast.error(error.message);
    }
  });
}
