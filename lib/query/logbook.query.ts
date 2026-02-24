import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {createLogbook, getLogbooks, getLogbooksByProject } from "../api/logbook.api";
import { Logbook } from "@/generated/prisma/client";

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
  mutationFn: (logbookData: Partial<Logbook>) => createLogbook(logbookData.projectId!, logbookData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["logbooks"] });
    },
  });
}
