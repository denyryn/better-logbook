import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";
import { LogbookWithRelations } from "@/types/prisma/logbooks";

function getBaseUrl(projectId?: string) {
  if (projectId) return `/api/projects/${projectId}/logbooks`;
  return `/api/logbooks`;
}

export async function getLogbooks(): Promise<
  ApiResponse<LogbookWithRelations[]>
> {
  const { data } =
    await api.get<ApiResponse<LogbookWithRelations[]>>(getBaseUrl());
  return data;
}

export async function getLogbooksByProject(
  projectId: string,
): Promise<ApiResponse<LogbookWithRelations[]>> {
  const { data } = await api.get<ApiResponse<LogbookWithRelations[]>>(
    getBaseUrl(projectId),
  );
  return data;
}

export async function createLogbook(
  projectId: string,
  logbookData: Partial<LogbookWithRelations>,
): Promise<ApiResponse<LogbookWithRelations>> {
  const { data } = await api.post<ApiResponse<LogbookWithRelations>>(
    getBaseUrl(projectId),
    logbookData,
  );
  return data;
}
