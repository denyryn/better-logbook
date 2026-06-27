import { Project } from "@/generated/prisma/client";
import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";
import { ProjectWithRelations } from "@/types/prisma/project";

function getBaseUrl({
  positionId,
  spaceId,
}: { positionId?: string; spaceId?: string } = {}) {
  if (positionId) return `/api/positions/${positionId}/projects`;
  if (spaceId) return `/api/spaces/${spaceId}/projects`;
  return `/api/projects`;
}

export async function getProjects() {
  const { data } = await api.get<ApiResponse<ProjectWithRelations[]>>(getBaseUrl());
  return data;
}

export async function getProjectsByPosition(positionId: string) {
  if (!positionId) throw new Error("Position ID is required");

  const { data } = await api.get<ApiResponse<ProjectWithRelations[]>>(
    getBaseUrl({ positionId: positionId }),
  );
  return data;
}

export async function getProjectsBySpace(spaceId: string) {
  if (!spaceId) throw new Error("Space ID is required");

  const { data } = await api.get<ApiResponse<ProjectWithRelations[]>>(
    getBaseUrl({ spaceId: spaceId }),
  );
  return data;
}

export async function createProject(project: Partial<Project>) {
  const { data } = await api.post<ApiResponse<Project>>(getBaseUrl(), project);
  return data;
}

export async function updateProject(
  projectId: string,
  project: Partial<Project>,
) {
  const { data } = await api.put<ApiResponse<Project>>(
    `/api/projects/${projectId}`,
    project,
  );
  return data;
}

export async function deleteProject(projectId: string) {
  const { data } = await api.delete<ApiResponse<null>>(
    `/api/projects/${projectId}`,
  );
  return data;
}
