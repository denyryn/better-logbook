import { ApiResponse } from "@/lib/api.response";
import { api } from "@/lib/axios";
import { LogbookWithRelations } from "@/types/prisma/logbooks";

export async function getLogbooks(): Promise<
  ApiResponse<LogbookWithRelations[]>
> {
  const { data } =
    await api.get<ApiResponse<LogbookWithRelations[]>>(`/api/logbooks`);
  return data;
}

export async function getLogbooksByProject(
  projectId: string,
): Promise<ApiResponse<LogbookWithRelations[]>> {
  const { data } = await api.get<ApiResponse<LogbookWithRelations[]>>(
    `/api/projects/${projectId}/logbooks`,
  );
  return data;
}

export async function createLogbook(
  projectId: string,
  logbookData: Partial<LogbookWithRelations>,
): Promise<ApiResponse<LogbookWithRelations>> {
  const { data } = await api.post<ApiResponse<LogbookWithRelations>>(
    `/api/projects/${projectId}/logbooks`,
    logbookData,
  );
  return data;
}
