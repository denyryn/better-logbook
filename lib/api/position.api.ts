import { PositionWithRelations } from "@/types/prisma/positions";

import { ApiResponse } from "../api.response";
import { api } from "../axios";

function getBaseUrl(companyId?: string) {
  if (companyId) return `/api/companies/${companyId}/positions`;
  return `/api/positions`;
}

export async function getPositions() {
  const { data } = await api.get<ApiResponse<PositionWithRelations[]>>(getBaseUrl());
  return data;
}

export async function getPositionsByCompany(companyId: string) {
  if (!companyId) throw new Error("Company ID is required");

  const { data } = await api.get<ApiResponse<PositionWithRelations[]>>(
    `${getBaseUrl(companyId)}`,
  );
  return data;
}
