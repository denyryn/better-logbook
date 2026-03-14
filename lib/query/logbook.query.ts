import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Logbook } from "@/generated/prisma/client";

import {
  createLogbook,
  deleteLogbook,
  getLogbookById,
  getLogbooks,
  getLogbooksByProject,
  updateLogbook,
} from "../api/logbook.api";
import { toast } from "sonner";
import { queryKey } from "../constants/query-key.constant";

export function useLogbooks() {
  return useQuery({
    queryKey: [queryKey.LOGBOOKS],
    queryFn: () => getLogbooks(),
  });
}

export function useLogbookById(id?: string) {
  return useQuery({
    queryKey: [queryKey.LOGBOOKS, id],
    queryFn: () => getLogbookById(id!),
    enabled: !!id
  })
}

export function useLogbooksByProject(projectId: string) {
  return useQuery({
    queryKey: [queryKey.LOGBOOKS, projectId],
    queryFn: () => getLogbooksByProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateLogbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logbookData: Partial<Logbook>) =>
      createLogbook(logbookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.LOGBOOKS] });
      queryClient.invalidateQueries({ queryKey: [queryKey.PRODUCTIVITIES] });
      toast.success("Logbook saved succesfully")
    },
    onError: (error) => {
      console.error("Error creating logbook entry:", error);
      toast.error(error.message);
    }
  });
}

export function useUpdateLogbook(logbookId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logbookData: Partial<Logbook>) =>
      updateLogbook(logbookId!, logbookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.LOGBOOKS, logbookId] });
      queryClient.invalidateQueries({ queryKey: [queryKey.PRODUCTIVITIES] });
      toast.success("Logbook saved succesfully")
    },
    onError: (error) => {
      console.error("Error updating logbook entry:", error);
      toast.error("Error updating logbook. " + error.message);
    }
  });
}

export function useDeleteLogbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logbookId: string) =>
      deleteLogbook(logbookId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.LOGBOOKS] });
      queryClient.invalidateQueries({ queryKey: [queryKey.PRODUCTIVITIES] });
      toast.success("Logbook deleted succesfully")
    },
    onError: (error) => {
      console.error("Error deleting logbook entry:", error);
      toast.error("Error deleting logbook. " + error.message);
    }
  });
}
