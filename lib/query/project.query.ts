import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  getProjects,
  getProjectsByCompany,
  getProjectsByPosition,
} from "../api/project.api";
import { Project } from "@/generated/prisma/client";
import { queryKey } from "../constants/query-key.constant";

export function useProjects() {
  return useQuery({
    queryKey: [queryKey.PROJECTS],
    queryFn: () => getProjects(),
  });
}

export function useProjectsByPosition(positionId: string) {
  return useQuery({
    queryKey: [queryKey.PROJECTS, positionId],
    queryFn: () => getProjectsByPosition(positionId),
    enabled: !!positionId,
  });
}

export function useProjectsByCompany(companyId: string) {
  return useQuery({
    queryKey: [queryKey.PROJECTS, companyId],
    queryFn: () => getProjectsByCompany(companyId),
    enabled: !!companyId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectData: Partial<Project>) =>
      createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.PROJECTS] });
    },
  });
}
