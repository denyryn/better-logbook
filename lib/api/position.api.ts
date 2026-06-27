import { PositionWithRelations } from "@/types/prisma/positions";

import { ApiResponse } from "../api.response";
import { api } from "../axios";

function getBaseUrl(spaceId?: string) {
  if (spaceId) return `/api/spaces/${spaceId}/positions`;
  return `/api/positions`;
}

export async function getPositions() {
  const { data } = await api.get<ApiResponse<PositionWithRelations[]>>(getBaseUrl());
  return data;
}

export async function getPositionsBySpace(spaceId: string) {
  if (!spaceId) throw new Error("Space ID is required");

  const { data } = await api.get<ApiResponse<PositionWithRelations[]>>(
    `${getBaseUrl(spaceId)}`,
  );
  return data;
}

export async function createPosition(
  spaceId: string,
  positionData: Partial<PositionWithRelations>,
) {
  if (!spaceId) throw new Error("Space ID is required");

  const { data } = await api.post<ApiResponse<PositionWithRelations>>(
    `${getBaseUrl()}`,
    { ...positionData, spaceId },
  );
  return data;
}
