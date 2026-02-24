import { useQuery } from "@tanstack/react-query";
import { getProjects, getProjectsByCompany, getProjectsByPosition } from "../api/project.api";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });
}

export function useProjectsByPosition(positionId: string) {
  return useQuery({
    queryKey: ["projects", positionId],
    queryFn: () => getProjectsByPosition(positionId),
    enabled: !!positionId,
  });
}

export function useProjectsByCompany(companyId: string) {
  return useQuery({
    queryKey: ["projects", companyId],
    queryFn: () => getProjectsByCompany(companyId),
    enabled: !!companyId,
  });
}
