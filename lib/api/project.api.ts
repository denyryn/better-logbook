import { Project } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";

function getBaseUrl({ positionId, companyId }: { positionId?: string, companyId?: string } = {}) {
  if (positionId) return `/api/positions/${positionId}/projects`;
  if (companyId) return `/api/companies/${companyId}/projects`;
  return `/api/projects`;
}

export async function getProjects() {
  const { data } = await api.get<ApiResponse<Project[]>>(getBaseUrl());
  return data;
}

export async function getProjectsByPosition(positionId: string) {
  if (!positionId) throw new Error("Position ID is required");

  const { data } = await api.get<ApiResponse<Project[]>>(
    getBaseUrl({ positionId:positionId })
  );
  return data;
}

export async function getProjectsByCompany(companyId: string) {
  if (!companyId) throw new Error("Company ID is required");

  const { data } = await api.get<ApiResponse<Project[]>>(
    getBaseUrl({ companyId:companyId })
  );
  return data;
}

export async function createProject(project: Partial<Project>) {
  const { data } = await api.post<ApiResponse<Project>>(
    getBaseUrl(),
    project
  );
  return data;
}

export async function updateProject(
  projectId: string,
  project: Partial<Project>
) {
  const { data } = await api.put<ApiResponse<Project>>(
    `/api/projects/${projectId}`,
    project
  );
  return data;
}

export async function deleteProject(projectId: string) {
  const { data } = await api.delete<ApiResponse<null>>(
    `/api/projects/${projectId}`
  );
  return data;
}
